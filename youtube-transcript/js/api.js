// ============================================
// API CLIENT - TranscriptAPI Integration
// ============================================

class TranscriptAPI {
    constructor(config) {
        this.config = config;
        this.rateLimit = {
            limit: 200,
            remaining: 200,
            reset: Date.now() + 60000
        };
        this.cache = new Map();
    }
    
    /**
     * Make an API request with proper error handling and retries
     */
    async request(endpoint, params = {}, options = {}) {
        const {
            method = 'GET',
            retries = this.config.RATE_LIMIT.MAX_RETRIES,
            signal
        } = options;
        
        // Check cache for GET requests
        if (method === 'GET' && !options.skipCache) {
            const cacheKey = this.getCacheKey(endpoint, params);
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.config.CACHE_DURATION) {
                return cached.data;
            }
        }
        
        // Build URL with query parameters
        const url = this.buildURL(endpoint, params);
        
        // Attempt request with retries
        let lastError;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                // Check rate limit before request
                await this.checkRateLimit();
                
                // Make request
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${this.config.API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    signal
                });
                
                // Update rate limit info from headers
                this.updateRateLimit(response.headers);
                
                // Handle response
                if (!response.ok) {
                    const error = await this.handleErrorResponse(response);
                    
                    // Check if error is retryable
                    if (this.isRetryableError(error.status) && attempt < retries) {
                        const delay = this.getRetryDelay(error.status, response.headers, attempt);
                        console.log(`Retry ${attempt + 1}/${retries} after ${delay}ms`);
                        await this.sleep(delay);
                        continue;
                    }
                    
                    throw error;
                }
                
                // Parse response
                const data = await response.json();
                
                // Cache successful GET requests
                if (method === 'GET' && !options.skipCache) {
                    const cacheKey = this.getCacheKey(endpoint, params);
                    this.cache.set(cacheKey, {
                        data,
                        timestamp: Date.now()
                    });
                }
                
                return data;
                
            } catch (error) {
                lastError = error;
                
                // Don't retry if aborted
                if (error.name === 'AbortError') {
                    throw error;
                }
                
                // Don't retry certain errors
                if (!this.isRetryableError(error.status)) {
                    throw error;
                }
            }
        }
        
        throw lastError;
    }
    
    /**
     * Get transcript for a YouTube video
     */
    async getTranscript(videoUrl, options = {}) {
        const {
            format = 'text',
            includeTimestamp = true,
            includeMetadata = false,
            signal
        } = options;
        
        const params = {
            video_url: videoUrl,
            format: format,
            include_timestamp: includeTimestamp,
            send_metadata: includeMetadata
        };
        
        return this.request(
            this.config.ENDPOINTS.TRANSCRIPT,
            params,
            { signal }
        );
    }
    
    /**
     * Search YouTube videos
     */
    async search(query, options = {}) {
        const {
            type = 'video',
            limit = 20,
            signal
        } = options;
        
        const params = { q: query, type, limit };
        
        return this.request(
            this.config.ENDPOINTS.SEARCH,
            params,
            { signal }
        );
    }
    
    /**
     * Resolve channel ID from handle or URL
     */
    async resolveChannel(input, signal) {
        const params = { input };
        
        return this.request(
            this.config.ENDPOINTS.CHANNEL_RESOLVE,
            params,
            { signal }
        );
    }
    
    /**
     * Search within a channel
     */
    async searchChannel(channelId, query, options = {}) {
        const {
            limit = 30,
            signal
        } = options;
        
        const params = { channel_id: channelId, q: query, limit };
        
        return this.request(
            this.config.ENDPOINTS.CHANNEL_SEARCH,
            params,
            { signal }
        );
    }
    
    /**
     * Get channel videos (paginated)
     */
    async getChannelVideos(channelId, continuationToken = null, signal) {
        const params = continuationToken 
            ? { continuation: continuationToken }
            : { channel_id: channelId };
        
        return this.request(
            this.config.ENDPOINTS.CHANNEL_VIDEOS,
            params,
            { signal }
        );
    }
    
    /**
     * Get latest videos from channel via RSS
     */
    async getChannelLatest(channelId, signal) {
        const params = { channel_id: channelId };
        
        return this.request(
            this.config.ENDPOINTS.CHANNEL_LATEST,
            params,
            { signal }
        );
    }
    
    /**
     * Get playlist videos (paginated)
     */
    async getPlaylistVideos(playlistId, continuationToken = null, signal) {
        const params = continuationToken
            ? { continuation: continuationToken }
            : { playlist_id: playlistId };
        
        return this.request(
            this.config.ENDPOINTS.PLAYLIST_VIDEOS,
            params,
            { signal }
        );
    }
    
    /**
     * Build URL with query parameters
     */
    buildURL(endpoint, params) {
        const url = new URL(endpoint, this.config.API_BASE_URL);
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
        
        return url.toString();
    }
    
    /**
     * Get cache key for request
     */
    getCacheKey(endpoint, params) {
        return `${endpoint}:${JSON.stringify(params)}`;
    }
    
    /**
     * Check rate limit before making request
     */
    async checkRateLimit() {
        if (this.rateLimit.remaining <= 0) {
            const now = Date.now();
            if (now < this.rateLimit.reset) {
                const waitTime = this.rateLimit.reset - now;
                console.log(`Rate limit exceeded, waiting ${waitTime}ms`);
                await this.sleep(waitTime);
            }
        }
    }
    
    /**
     * Update rate limit info from response headers
     */
    updateRateLimit(headers) {
        const limit = headers.get('X-RateLimit-Limit');
        const remaining = headers.get('X-RateLimit-Remaining');
        const reset = headers.get('X-RateLimit-Reset');
        
        if (limit) this.rateLimit.limit = parseInt(limit);
        if (remaining) this.rateLimit.remaining = parseInt(remaining);
        if (reset) this.rateLimit.reset = parseInt(reset) * 1000;
    }
    
    /**
     * Determine if error is retryable
     */
    isRetryableError(status) {
        return [408, 429, 500, 502, 503, 504].includes(status);
    }
    
    /**
     * Get retry delay based on error status
     */
    getRetryDelay(status, headers, attempt) {
        if (status === 429) {
            const retryAfter = headers.get('Retry-After');
            if (retryAfter) {
                return parseInt(retryAfter) * 1000;
            }
        }
        
        // Exponential backoff
        return this.config.RATE_LIMIT.RETRY_DELAY * Math.pow(2, attempt);
    }
    
    /**
     * Handle error response
     */
    async handleErrorResponse(response) {
        let errorData;
        
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: response.statusText };
        }
        
        const error = new Error(errorData.detail || 'Unknown error');
        error.status = response.status;
        error.code = errorData.code;
        error.data = errorData;
        
        return error;
    }
    
    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Get current rate limit status
     */
    getRateLimitStatus() {
        return {
            limit: this.rateLimit.limit,
            remaining: this.rateLimit.remaining,
            reset: this.rateLimit.reset,
            resetDate: new Date(this.rateLimit.reset)
        };
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
}

// Create and export instance
const api = new TranscriptAPI(CONFIG);

// ============================================
// CONFIGURATION - API Keys and Settings
// ============================================

const CONFIG = {
    // API Configuration
    API_BASE_URL: '', // Empty for local API (relative path)
    API_KEY: '', // Not needed for local API
    API_VERSION: 'v1',

    // Endpoints (now using local Vercel serverless functions)
    ENDPOINTS: {
        TRANSCRIPT: '/api/youtube/transcript',
        SEARCH: '', // Not implemented yet
        CHANNEL_RESOLVE: '', // Not implemented yet
        CHANNEL_SEARCH: '', // Not implemented yet
        CHANNEL_VIDEOS: '', // Not implemented yet
        CHANNEL_LATEST: '', // Not implemented yet
        PLAYLIST_VIDEOS: '' // Not implemented yet
    },
    
    // Rate Limiting
    RATE_LIMIT: {
        REQUESTS_PER_MINUTE: 200,
        RETRY_DELAY: 1000, // 1 second
        MAX_RETRIES: 3
    },
    
    // Cache Settings
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    
    // App Settings
    DEFAULT_SETTINGS: {
        includeTimestamps: true,
        includeMetadata: false,
        format: 'text'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

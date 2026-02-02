// ============================================
// APP CONTROLLER - UI & Application Logic
// ============================================

class TranscriptApp {
    constructor() {
        this.api = api;
        this.currentTranscript = null;
        this.currentMetadata = null;
        this.searchMatches = [];
        this.currentMatchIndex = 0;
        this.abortController = null;
        
        this.init();
    }
    
    /**
     * Initialize application
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateRateLimitDisplay();
        
        // Update rate limit display every 10 seconds
        setInterval(() => this.updateRateLimitDisplay(), 10000);
    }
    
    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            videoUrl: document.getElementById('video-url'),
            includeTimestamps: document.getElementById('include-timestamps'),
            includeMetadata: document.getElementById('include-metadata'),
            formatSelect: document.getElementById('format-select'),
            fetchBtn: document.getElementById('fetch-btn'),
            resultsSection: document.getElementById('results-section'),
            metadataCard: document.getElementById('metadata-card'),
            videoThumbnail: document.getElementById('video-thumbnail'),
            videoTitle: document.getElementById('video-title'),
            videoAuthor: document.getElementById('video-author'),
            videoLink: document.getElementById('video-link'),
            transcriptOutput: document.getElementById('transcript-output'),
            errorMessage: document.getElementById('error-message'),
            successMessage: document.getElementById('success-message'),
            copyBtn: document.getElementById('copy-btn'),
            downloadBtn: document.getElementById('download-btn'),
            searchToggle: document.getElementById('search-toggle'),
            searchBox: document.getElementById('search-box'),
            searchInput: document.getElementById('search-input'),
            searchCount: document.getElementById('search-count'),
            searchPrev: document.getElementById('search-prev'),
            searchNext: document.getElementById('search-next'),
            creditsRemaining: document.getElementById('credits-remaining'),
            rateLimit: document.getElementById('rate-limit')
        };
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        this.elements.fetchBtn.addEventListener('click', () => this.fetchTranscript());
        
        this.elements.videoUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.fetchTranscript();
            }
        });
        
        this.elements.copyBtn.addEventListener('click', () => this.copyTranscript());
        this.elements.downloadBtn.addEventListener('click', () => this.downloadTranscript());
        
        this.elements.searchToggle.addEventListener('click', () => {
            this.elements.searchBox.style.display = 
                this.elements.searchBox.style.display === 'none' ? 'block' : 'none';
            if (this.elements.searchBox.style.display === 'block') {
                this.elements.searchInput.focus();
            }
        });
        
        this.elements.searchInput.addEventListener('input', (e) => {
            this.searchInTranscript(e.target.value);
        });
        
        this.elements.searchPrev.addEventListener('click', () => {
            this.navigateToMatch(-1);
        });
        
        this.elements.searchNext.addEventListener('click', () => {
            this.navigateToMatch(1);
        });
    }
    
    /**
     * Fetch transcript from API
     */
    async fetchTranscript() {
        const videoUrl = this.elements.videoUrl.value.trim();
        
        if (!videoUrl) {
            this.showError('Please enter a YouTube URL or video ID');
            return;
        }
        
        // Cancel any ongoing request
        if (this.abortController) {
            this.abortController.abort();
        }
        
        this.abortController = new AbortController();
        
        this.setLoading(true);
        this.hideMessages();
        this.hideResults();
        
        try {
            const options = {
                format: this.elements.formatSelect.value,
                includeTimestamp: this.elements.includeTimestamps.checked,
                includeMetadata: this.elements.includeMetadata.checked,
                signal: this.abortController.signal
            };
            
            const data = await this.api.getTranscript(videoUrl, options);
            
            this.currentTranscript = data.transcript;
            this.currentMetadata = data.metadata || null;
            
            this.displayResults(data);
            this.showSuccess('Transcript retrieved successfully!');
            
        } catch (error) {
            this.handleFetchError(error);
        } finally {
            this.setLoading(false);
            this.abortController = null;
            this.updateRateLimitDisplay();
        }
    }
    
    /**
     * Display results
     */
    displayResults(data) {
        this.elements.resultsSection.style.display = 'block';
        
        // Display metadata if available
        if (this.currentMetadata) {
            this.elements.metadataCard.style.display = 'block';
            this.elements.videoThumbnail.src = this.currentMetadata.thumbnail_url || '';
            this.elements.videoTitle.textContent = this.currentMetadata.title || 'Unknown Title';
            this.elements.videoAuthor.textContent = this.currentMetadata.author_name || 'Unknown Author';
            this.elements.videoLink.href = this.currentMetadata.author_url || '#';
        } else {
            this.elements.metadataCard.style.display = 'none';
        }
        
        // Display transcript
        this.renderTranscript(this.currentTranscript, data.format || 'text');
    }
    
    /**
     * Render transcript based on format
     */
    renderTranscript(transcript, format) {
        let html = '';
        
        if (format === 'json') {
            if (Array.isArray(transcript)) {
                transcript.forEach(segment => {
                    if (typeof segment === 'object' && segment.text) {
                        const timestamp = segment.start !== undefined 
                            ? `<span class="timestamp">[${this.formatTime(segment.start)}]</span>` 
                            : '';
                        html += `<div class="segment">${timestamp} ${this.escapeHtml(segment.text)}</div>`;
                    } else {
                        html += `<div class="segment">${this.escapeHtml(segment)}</div>`;
                    }
                });
            }
        } else {
            // Text format
            if (typeof transcript === 'string') {
                html = this.formatTextTranscript(transcript);
            }
        }
        
        this.elements.transcriptOutput.innerHTML = html || '<p>No transcript available</p>';
    }
    
    /**
     * Format text transcript with timestamps
     */
    formatTextTranscript(text) {
        // Replace [123.45s] format with styled spans
        return text.replace(
            /\[(\d+\.?\d*)s\]/g,
            '<span class="timestamp">[$1s]</span>'
        );
    }
    
    /**
     * Format time in seconds to readable format
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    /**
     * Copy transcript to clipboard
     */
    async copyTranscript() {
        const text = this.elements.transcriptOutput.textContent;
        
        try {
            await navigator.clipboard.writeText(text);
            this.showSuccess('Transcript copied to clipboard!');
        } catch (error) {
            this.showError('Failed to copy transcript');
        }
    }
    
    /**
     * Download transcript as file
     */
    downloadTranscript() {
        const text = this.elements.transcriptOutput.textContent;
        const videoId = this.extractVideoId(this.elements.videoUrl.value) || 'transcript';
        const format = this.elements.formatSelect.value;
        const extension = format === 'json' ? 'json' : 'txt';
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${videoId}-transcript.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess('Transcript downloaded!');
    }
    
    /**
     * Search in transcript
     */
    searchInTranscript(query) {
        if (!query.trim()) {
            this.clearSearch();
            return;
        }
        
        const transcriptText = this.elements.transcriptOutput.textContent.toLowerCase();
        const queryLower = query.toLowerCase();
        
        this.searchMatches = [];
        let index = 0;
        
        while ((index = transcriptText.indexOf(queryLower, index)) !== -1) {
            this.searchMatches.push(index);
            index += query.length;
        }
        
        this.currentMatchIndex = 0;
        this.updateSearchDisplay();
        this.highlightSearchMatch();
    }
    
    /**
     * Navigate search results
     */
    navigateToMatch(direction) {
        if (this.searchMatches.length === 0) return;
        
        this.currentMatchIndex += direction;
        
        if (this.currentMatchIndex < 0) {
            this.currentMatchIndex = this.searchMatches.length - 1;
        } else if (this.currentMatchIndex >= this.searchMatches.length) {
            this.currentMatchIndex = 0;
        }
        
        this.highlightSearchMatch();
    }
    
    /**
     * Highlight current search match
     */
    highlightSearchMatch() {
        const query = this.elements.searchInput.value;
        if (!query || this.searchMatches.length === 0) return;
        
        const matchIndex = this.searchMatches[this.currentMatchIndex];
        const transcriptText = this.elements.transcriptOutput.textContent;
        
        // Get context around match
        const contextStart = Math.max(0, matchIndex - 50);
        const contextEnd = Math.min(transcriptText.length, matchIndex + query.length + 50);
        const context = transcriptText.substring(contextStart, contextEnd);
        
        // Scroll to match
        const scrollPos = (matchIndex / transcriptText.length) * 
                         this.elements.transcriptOutput.scrollHeight;
        this.elements.transcriptOutput.scrollTop = scrollPos - 100;
    }
    
    /**
     * Update search display
     */
    updateSearchDisplay() {
        if (this.searchMatches.length > 0) {
            this.elements.searchCount.textContent = 
                `${this.currentMatchIndex + 1} of ${this.searchMatches.length} matches`;
        } else {
            this.elements.searchCount.textContent = 'No matches found';
        }
    }
    
    /**
     * Clear search
     */
    clearSearch() {
        this.searchMatches = [];
        this.currentMatchIndex = 0;
        this.elements.searchCount.textContent = '';
    }
    
    /**
     * Handle fetch errors
     */
    handleFetchError(error) {
        let message = 'Failed to fetch transcript';
        
        if (error.status === 401) {
            message = 'Invalid API key. Please check your configuration.';
        } else if (error.status === 402) {
            message = error.data?.detail?.message || 'Insufficient credits. Please top up.';
        } else if (error.status === 404) {
            message = 'Video not found or no transcript available.';
        } else if (error.status === 429) {
            message = 'Rate limit exceeded. Please wait a moment.';
        } else if (error.name === 'AbortError') {
            message = 'Request cancelled.';
        } else if (error.message) {
            message = error.message;
        }
        
        this.showError(message);
    }
    
    /**
     * Update rate limit display
     */
    updateRateLimitDisplay() {
        const status = this.api.getRateLimitStatus();
        
        this.elements.creditsRemaining.textContent = status.remaining;
        this.elements.rateLimit.textContent = `${status.limit}/min`;
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = 'block';
        this.elements.successMessage.style.display = 'none';
    }
    
    /**
     * Show success message
     */
    showSuccess(message) {
        this.elements.successMessage.textContent = message;
        this.elements.successMessage.style.display = 'block';
        this.elements.errorMessage.style.display = 'none';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.elements.successMessage.style.display = 'none';
        }, 3000);
    }
    
    /**
     * Hide all messages
     */
    hideMessages() {
        this.elements.errorMessage.style.display = 'none';
        this.elements.successMessage.style.display = 'none';
    }
    
    /**
     * Hide results section
     */
    hideResults() {
        this.elements.resultsSection.style.display = 'none';
    }
    
    /**
     * Set loading state
     */
    setLoading(loading) {
        const btn = this.elements.fetchBtn;
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        
        btn.disabled = loading;
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';
        } else {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }
    
    /**
     * Extract video ID from URL
     */
    extractVideoId(input) {
        // Match 11-character video ID
        const match = input.match(/([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.transcriptApp = new TranscriptApp();
});

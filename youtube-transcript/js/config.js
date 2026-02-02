// ============================================
// CONFIGURATION - API Keys and Settings
// ============================================

const CONFIG = {
    // API Configuration
    API_BASE_URL: 'https://transcriptapi.com',
    API_KEY: 'sk_w43cQAOjub9kDKrJeyr4HR5WTJRkhXEm1Av2vZvUasY',
    API_VERSION: 'v2',
    
    // Endpoints
    ENDPOINTS: {
        TRANSCRIPT: '/api/v2/youtube/transcript',
        SEARCH: '/api/v2/youtube/search',
        CHANNEL_RESOLVE: '/api/v2/youtube/channel/resolve',
        CHANNEL_SEARCH: '/api/v2/youtube/channel/search',
        CHANNEL_VIDEOS: '/api/v2/youtube/channel/videos',
        CHANNEL_LATEST: '/api/v2/youtube/channel/latest',
        PLAYLIST_VIDEOS: '/api/v2/youtube/playlist/videos'
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

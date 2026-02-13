// SEO Query Manager - API Helper

class API {
    constructor() {
        this.apiKey = this.getApiKey();
    }

    getApiKey() {
        // Try to get from localStorage first
        const stored = localStorage.getItem('seo_query_manager_api_key');
        if (stored) return stored;

        // Default key
        return 'seo-query-manager-key';
    }

    setApiKey(key) {
        localStorage.setItem('seo_query_manager_api_key', key);
        this.apiKey = key;
    }

    async request(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(error.error || error.message || 'Request failed');
        }

        return response.json();
    }

    get(url) {
        return this.request(url, { method: 'GET' });
    }

    post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    delete(url) {
        return this.request(url, { method: 'DELETE' });
    }
}

// Initialize API client
const api = new API();

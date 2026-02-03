/**
 * AdsPower API Client
 * Comprehensive client for AdsPower API integration
 * Documentation: https://adspower-ltd.notion.site/AdsPower-API-Documentation-For-beginner-6c8ca7b0fc2942b9b2ac3e0b3bc9c399
 */

const http = require('http');

class AdsPowerClient {
    constructor(apiKey = '746feb8ab409fbb27a0377a864279e6c000f879a7a0e5329', baseUrl = 'http://local.adspower.net:50325') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.apiVersion = 'v1';
    }

    /**
     * Make API request to AdsPower
     */
    async request(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const url = `${this.baseUrl}/api/${this.apiVersion}${endpoint}`;
            const urlObj = new URL(url);

            // Add API key to query parameters
            urlObj.searchParams.append('api_key', this.apiKey);

            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const req = http.request(urlObj, options, (res) => {
                let body = '';

                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = JSON.parse(body);
                        if (response.code === 0 || response.code === 'Success') {
                            resolve(response.data || response);
                        } else {
                            reject(new Error(`API Error: ${response.msg || response.message}`));
                        }
                    } catch (e) {
                        reject(new Error(`Invalid JSON response: ${body}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Connection failed: ${error.message}`));
            });

            if (data && method === 'POST') {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    /**
     * Test API connection
     */
    async testConnection() {
        return new Promise((resolve) => {
            const options = {
                hostname: new URL(this.baseUrl).hostname,
                port: new URL(this.baseUrl).port || 80,
                path: '/status',
                method: 'GET'
            };

            const req = http.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => { body += chunk; });
                res.on('end', () => {
                    try {
                        const response = JSON.parse(body);
                        if (response.code === 0) {
                            resolve({
                                success: true,
                                message: 'Connected to AdsPower API',
                                data: response
                            });
                        } else {
                            resolve({
                                success: false,
                                message: response.msg || 'Connection failed'
                            });
                        }
                    } catch (e) {
                        resolve({
                            success: false,
                            message: `Invalid JSON: ${body}`
                        });
                    }
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    message: error.message,
                    hint: 'Make sure AdsPower application is running'
                });
            });

            req.end();
        });
    }

    /**
     * Get all profiles
     * @param {Object} options - { group_id, page, page_size, keywords }
     */
    async getProfiles(options = {}) {
        const params = new URLSearchParams();
        if (options.group_id) params.append('group_id', options.group_id);
        if (options.page) params.append('page', options.page);
        if (options.page_size) params.append('page_size', options.page_size);
        if (options.keywords) params.append('keywords', options.keywords);

        const endpoint = `/user/list?${params.toString()}`;
        return await this.request(endpoint);
    }

    /**
     * Get detailed profile information
     * @param {string} userId - Profile user ID
     */
    async getProfileInfo(userId) {
        const data = { user_id: userId };
        return await this.request('/user/info', 'POST', data);
    }

    /**
     * Get browser fingerprint for a profile
     * @param {string} userId - Profile user ID
     */
    async getBrowserFingerprint(userId) {
        const data = { user_id: userId };
        return await this.request('/user/fingerprint', 'POST', data);
    }

    /**
     * Check if a profile is active
     * @param {string} userId - Profile user ID
     */
    async isProfileActive(userId) {
        const data = { user_id: userId };
        const result = await this.request('/browser/is-active', 'POST', data);
        return result.is_active;
    }

    /**
     * Get all profile groups
     */
    async getGroups() {
        return await this.request('/user/group');
    }

    /**
     * Start a profile browser
     * @param {string} userId - Profile user ID
     * @param {Object} options - Launch options
     */
    async startProfile(userId, options = {}) {
        const params = new URLSearchParams();
        params.append('user_id', userId);

        // Add optional parameters
        if (options.headless !== undefined) params.append('headless', options.headless ? '1' : '0');
        if (options.open_tabs !== undefined) params.append('open_tabs', options.open_tabs ? '1' : '0');
        if (options.ip_tab !== undefined) params.append('ip_tab', options.ip_tab ? '1' : '0');
        if (options.clear_cache_after_closing !== undefined) params.append('clear_cache_after_closing', options.clear_cache_after_closing ? '1' : '0');

        const endpoint = `/browser/start?${params.toString()}`;
        return await this.request(endpoint, 'GET');
    }

    /**
     * Stop a profile browser
     * @param {string} userId - Profile user ID
     */
    async stopProfile(userId) {
        const data = { user_id: userId };
        return await this.request('/browser/close', 'POST', data);
    }

    /**
     * Get profile cookies
     * @param {string} userId - Profile user ID
     */
    async getCookies(userId) {
        const data = { user_id: userId };
        return await this.request('/browser/cookies', 'POST', data);
    }

    /**
     * Get profile extension data
     * @param {string} userId - Profile user ID
     */
    async getExtensions(userId) {
        const data = { user_id: userId };
        return await this.request('/browser/get_extensions', 'POST', data);
    }

    /**
     * Delete a profile
     * @param {string} userId - Profile user ID
     */
    async deleteProfile(userId) {
        const data = { user_id: userId };
        return await this.request('/user/delete', 'POST', data);
    }

    /**
     * Create a new profile
     * @param {Object} profileData - Profile configuration
     */
    async createProfile(profileData) {
        return await this.request('/user/create', 'POST', profileData);
    }

    /**
     * Update a profile
     * @param {string} userId - Profile user ID
     * @param {Object} updates - Fields to update
     */
    async updateProfile(userId, updates) {
        const data = {
            user_id: userId,
            ...updates
        };
        return await this.request('/user/update', 'POST', data);
    }

    /**
     * Get profile audit logs
     * @param {string} userId - Profile user ID
     */
    async getAuditLogs(userId) {
        const data = { user_id: userId };
        return await this.request('/audit-log/list', 'POST', data);
    }

    /**
     * Comprehensive profile data extraction
     * @param {string} userId - Profile user ID
     */
    async getFullProfileData(userId) {
        try {
            const [info, active, cookies, extensions] = await Promise.allSettled([
                this.getProfileInfo(userId),
                this.isProfileActive(userId),
                this.getCookies(userId),
                this.getExtensions(userId)
            ]);

            return {
                success: true,
                profile_id: userId,
                basic_info: info.status === 'fulfilled' ? info.value : null,
                is_active: active.status === 'fulfilled' ? active.value : null,
                cookies: cookies.status === 'fulfilled' ? cookies.value : null,
                extensions: extensions.status === 'fulfilled' ? extensions.value : null,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                profile_id: userId
            };
        }
    }
}

module.exports = AdsPowerClient;

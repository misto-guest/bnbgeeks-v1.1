/**
 * AdsPower Integration Module
 * Provides connection to AdsPower browser profiles
 */

const axios = require('axios');

const ADPOWER_API = 'http://127.0.0.1:50325';

class AdsPowerIntegration {
    constructor(apiEndpoint = ADPOWER_API) {
        this.apiEndpoint = apiEndpoint;
    }
    
    /**
     * Check if AdsPower is running
     */
    async checkStatus() {
        try {
            const response = await axios.get(`${this.apiEndpoint}/status`);
            return response.data;
        } catch (e) {
            console.error('AdsPower not running:', e.message);
            return null;
        }
    }
    
    /**
     * Get all browser profiles
     */
    async getProfiles() {
        try {
            const response = await axios.get(`${this.apiEndpoint}/api/v1/browser/list`);
            return response.data.data || [];
        } catch (e) {
            console.error('Failed to get profiles:', e.message);
            return [];
        }
    }
    
    /**
     * Start a browser profile and get debugging endpoint
     */
    async startProfile(profileId) {
        try {
            const response = await axios.get(`${this.apiEndpoint}/api/v1/browser/start`, {
                params: {
                    user_id: profileId,
                    headless: 0,
                    ip_tab: 0
                }
            });
            
            if (response.data.success) {
                return {
                    success: true,
                    wsEndpoint: response.data.data.ws,
                    webdriverPath: response.data.data.webdriver
                };
            }
            return { success: false, error: response.data.msg };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
    
    /**
     * Stop a browser profile
     */
    async stopProfile(profileId) {
        try {
            const response = await axios.get(`${this.apiEndpoint}/api/v1/browser/stop`, {
                params: { user_id: profileId }
            });
            return response.data.success;
        } catch (e) {
            console.error('Failed to stop profile:', e.message);
            return false;
        }
    }
    
    /**
     * Create a new browser profile
     */
    async createProfile(name, group = 'dutch-portals') {
        try {
            const response = await axios.post(`${this.apiEndpoint}/api/v1/user/create`, {
                name,
                group,
                proxy_config: {
                    proxy_soft: 'no_proxy'
                },
                fingerprint_config: {
                    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    language: ['nl-NL', 'en-US'],
                    timezone: 'Europe/Amsterdam'
                }
            });
            
            if (response.data.success) {
                return { success: true, profileId: response.data.data.id };
            }
            return { success: false, error: response.data.msg };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
    
    /**
     * Connect to an existing profile using Puppeteer
     */
    async connectToProfile(page, profileId) {
        const result = await this.startProfile(profileId);
        
        if (result.success) {
            const browser = await page.browser();
            const page = await browser.newPage();
            return { success: true, page };
        }
        
        return { success: false, error: result.error };
    }
}

module.exports = AdsPowerIntegration;

# ClawDeck AdsPower Integration Guide

**Last Updated:** 2026-02-09
**Purpose:** Enable ClawDeck agents to use AdsPower API for browser automation

---

## 🎯 Quick Reference

**AdsPower API Status:** ✅ **CONFIGURED & WORKING**

**API Endpoint:** `http://127.0.0.1:50325`
**API Key:** `746feb8ab409fbb27a0377a864279e6c000f879a7a0e5329`
**Account:** rebel@ri.eu / contact@rebelinternet.eu
**Profiles:** 200 total (at capacity)
**Expiration:** 2026-08-15

---

## 📂 File Locations

**Primary Scripts:** `/Users/northsea/clawd-dmitry/warmup-automation/`

```
warmup-automation/
├── adspower-client.js          # AdsPower API wrapper (MAIN)
├── check-adspower-api.js       # Test API connection
├── test-adspower-profile-1.js  # Example automation
├── run-with-adspower.js        # Puppeteer launcher
├── warmup-enhanced.js          # Full warmup automation
└── scripts/
    └── run-with-adspower.js    # Utility scripts
```

**Documentation:**
- `/Users/northsea/clawd-dmitry/warmup-automation/ADSPOWER_SETUP.md`

---

## 🚀 How ClawDeck Agents Access AdsPower

### Method 1: Use Existing AdsPower Client (Recommended)

```javascript
// Import the client
const AdsPowerClient = require('/Users/northsea/clawd-dmitry/warmup-automation/adspower-client.js');

// Initialize
const adspower = new AdsPowerClient();

// List profiles
const profiles = await adspower.listProfiles();
console.log(`Found ${profiles.length} profiles`);

// Open a profile
const result = await adspower.openProfile('k12am9a2');
console.log(`Profile opened at port ${result.puppeteer_port}`);

// Connect Puppeteer
const puppeteer = require('puppeteer');
const browser = await puppeteer.connect({
  browserWSEndpoint: `ws://localhost:${result.puppeteer_port}`
});

// Your automation here
const page = await browser.newPage();
await page.goto('https://example.com');

// Close when done
await adspower.closeProfile('k12am9a2');
```

### Method 2: Direct API Calls

```javascript
const http = require('http');
const apiKey = '746feb8ab409fbb27a0377a864279e6c000f879a7a0e5329';

async function openProfile(profileId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 50325,
      path: `/api/v1/user/open?api_key=${apiKey}&user_id=${profileId}`,
      method: 'POST'
    };

    http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).end();
  });
}
```

---

## 🎭 Common Patterns

### Pattern 1: Single Profile Automation

```javascript
const AdsPowerClient = require('/Users/northsea/clawd-dmitry/warmup-automation/adspower-client.js');
const puppeteer = require('puppeteer');

async function runAutomation(profileId) {
  const adspower = new AdsPowerClient();
  
  // Open profile
  const profile = await adspower.openProfile(profileId);
  console.log(`Profile ${profileId} opened on port ${profile.puppeteer_port}`);
  
  // Wait for browser to be ready
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Connect Puppeteer
  const browser = await puppeteer.connect({
    browserWSEndpoint: `ws://localhost:${profile.puppeteer_port}`
  });
  
  const page = await browser.newPage();
  
  // Your automation logic here
  await page.goto('https://example.com');
  const title = await page.title();
  console.log('Page title:', title);
  
  // Cleanup
  await browser.close();
  await adspower.closeProfile(profileId);
  
  return { success: true, title };
}

// Usage
runAutomation('k12am9a2')
  .then(result => console.log('Done:', result))
  .catch(err => console.error('Error:', err));
```

### Pattern 2: Batch Profile Automation

```javascript
async function batchAutomation(profileIds) {
  const adspower = new AdsPowerClient();
  const results = [];
  
  // Process profiles in parallel (max 5 at a time)
  const batchSize = 5;
  
  for (let i = 0; i < profileIds.length; i += batchSize) {
    const batch = profileIds.slice(i, i + batchSize);
    
    const batchResults = await Promise.allSettled(
      batch.map(id => runAutomation(id))
    );
    
    results.push(...batchResults);
    
    // Wait between batches
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  
  return results;
}
```

### Pattern 3: Filter & Select Profiles

```javascript
async function getProfilesByGroup(groupId) {
  const adspower = new AdsPowerClient();
  const allProfiles = await adspower.listProfiles();
  
  return allProfiles.filter(p => 
    p.group_id === groupId ||
    p.group_name === groupId
  );
}

async function getMobileProfiles() {
  const adspower = new AdsPowerClient();
  const allProfiles = await adspower.listProfiles();
  
  return allProfiles.filter(p => 
    p.browser_kernel && p.browser_kernel.includes('8086') // Mobile
  );
}
```

---

## 📊 Profile Information

### Profile Groups
- **Group 0:** Default group (majority)
- **Group 7473129:** ~15 profiles
- **Group 4585199:** ~5 profiles  
- **Group 4079086:** ~2 profiles

### Profile ID Patterns
- **Newest (1-50):** Start with `k` prefix (e.g., k12am9a2)
- **Oldest (96-100):** Start with `j` prefix
- **Sorted by:** Creation date (newest first)

### Key Profile (Test Account)
- **Profile ID:** k12am9a2
- **Email:** patmcgee727@gmail.com
- **IP:** 178.230.42.159 (Netherlands)
- **Type:** Mobile 8086
- **Status:** ✅ Successfully warmed up

---

## ⚡ Performance Guidelines

### Concurrent Profile Limits
- **Comfortable:** 30-50 profiles simultaneously
- **Optimal:** 25 profiles for long-running tasks
- **Maximum:** 75-100 profiles (with trade-offs)

### Best Practices

1. **Batch Operations**
   - Process 15-20 profiles per batch
   - Use 10-20 second delays between batches
   - Close profiles immediately after use

2. **Resource Management**
   - Keep ≤50 profiles open simultaneously
   - Monitor memory usage
   - Use lightweight fingerprint configs

3. **Error Handling**
   - Implement retry logic (3 attempts)
   - Use exponential backoff
   - Log all errors for debugging

---

## 🔧 Testing Connection

```bash
# Quick test
cd /Users/northsea/clawd-dmitry/warmup-automation
node check-adspower-api.js

# Test single profile
node test-adspower-profile-1.js
```

---

## 🎯 Next Steps for Puppeteer Automations

### Phase 1: Basic Templates
1. Create reusable automation templates
2. Build profile selection utilities
3. Implement batch operation patterns
4. Add error handling & retry logic

### Phase 2: Advanced Features
1. Cookie/session management
2. Screenshot & video capture
3. Form automation
4. Data extraction patterns

### Phase 3: Integration
1. ClawDeck task queue integration
2. Progress monitoring & reporting
3. Automated scheduling
4. Result logging

---

## 📝 Example: Complete Automation Script

```javascript
/**
 * ClawDeck AdsPower Automation Example
 * Shows complete workflow from profile selection to result
 */

const AdsPowerClient = require('/Users/northsea/clawd-dmitry/warmup-automation/adspower-client.js');
const puppeteer = require('puppeteer');

async function clawDeckAutomation(taskConfig) {
  const adspower = new AdsPowerClient();
  const { profileIds, url, actions } = taskConfig;
  
  console.log(`Starting automation for ${profileIds.length} profiles`);
  
  const results = [];
  
  for (const profileId of profileIds) {
    try {
      // Open profile
      const profile = await adspower.openProfile(profileId);
      console.log(`✅ Opened ${profileId} on port ${profile.puppeteer_port}`);
      
      // Wait for browser
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Connect Puppeteer
      const browser = await puppeteer.connect({
        browserWSEndpoint: `ws://localhost:${profile.puppeteer_port}`
      });
      
      const page = await browser.newPage();
      
      // Navigate to URL
      await page.goto(url, { waitUntil: 'networkidle2' });
      console.log(`📍 Navigated to ${url}`);
      
      // Run actions
      const actionResults = [];
      for (const action of actions) {
        const result = await executeAction(page, action);
        actionResults.push(result);
      }
      
      // Close browser & profile
      await browser.close();
      await adspower.closeProfile(profileId);
      
      results.push({
        profile: profileId,
        success: true,
        actions: actionResults
      });
      
    } catch (error) {
      console.error(`❌ Error with ${profileId}:`, error.message);
      results.push({
        profile: profileId,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Example usage
clawDeckAutomation({
  profileIds: ['k12am9a2', 'k12am9a3'],
  url: 'https://example.com',
  actions: [
    { type: 'screenshot', path: 'screenshot.png' },
    { type: 'extract', selector: 'h1', property: 'text' }
  ]
}).then(results => {
  console.log('Results:', JSON.stringify(results, null, 2));
});
```

---

## 🚨 Important Notes

1. **API Limitations:**
   - Only first 100 profiles accessible via `/user/list`
   - `/user/info` endpoint doesn't work
   - Use `/user/list` with pagination for profiles 101-200

2. **Timing Issues:**
   - Always wait 5 seconds after `openProfile()` before connecting Puppeteer
   - Add delays between profile operations to avoid rate limits

3. **Error Recovery:**
   - If Puppeteer connection fails, close profile and retry
   - Use `Promise.allSettled()` for batch operations
   - Log all errors for debugging

---

## 📚 Additional Resources

**AdsPower API Docs:** https://adspower-ltd.notion.site/AdsPower-API-Documentation-For-beginner-6c8ca7b0fc2942b9b2ac3e0b3bc9c399

**Local Documentation:** `/Users/northsea/clawd-dmitry/warmup-automation/ADSPOWER_SETUP.md`

**Working Examples:**
- `/Users/northsea/clawd-dmitry/warmup-automation/warmup-enhanced.js`
- `/Users/northsea/clawd-dmitry/warmup-automation/test-adspower-profile-1.js`

---

**Status:** ✅ Ready for ClawDeck agent use
**Version:** AdsPower v7.12.29 | API v1
**Last Tested:** 2026-02-04

# 2026-02-09 - AdsPower API Configuration

## AdsPower Setup (Ready for ClawDeck Use)

**Status:** ✅ CONFIGURED & WORKING

---

## API Connection Details

**API Endpoint:** `http://127.0.0.1:50325`
**API Key:** `746feb8ab409fbb27a0377a864279e6c000f879a7a0e5329`
**Account:** `rebel@ri.eu` / `contact@rebelinternet.eu`
**Profiles:** 200 total (at capacity)
**Expiration:** 2026-08-15
**Version:** v7.12.29 | 2.8.2.8

---

## Key Scripts (Ready to Use)

**Location:** `/Users/northsea/clawd-dmitry/warmup-automation/`

1. **adspower-client.js**
   - AdsPower API wrapper class
   - Methods: listProfiles(), openProfile(), closeProfile()
   - Error handling & retry logic built-in
   - Primary interface for all AdsPower operations

2. **test-adspower-profile-1.js**
   - Example automation script
   - Demonstrates profile launch + Puppeteer connection
   - Template for new automations

3. **warmup-enhanced.js**
   - Full warmup automation system
   - Google services automation
   - Email warmup workflows
   - Status tracking & logging

4. **check-adspower-api.js**
   - Test API connection
   - Verify authentication
   - Quick health check

5. **run-with-adspower.js**
   - Puppeteer launcher utility
   - Profile connection helper

---

## Usage Pattern for ClawDeck Agents

```javascript
// Import the client
const AdsPowerClient = require('/Users/northsea/clawd-dmitry/warmup-automation/adspower-client.js');

// Initialize
const adspower = new AdsPowerClient();

// List all profiles
const profiles = await adspower.listProfiles();
console.log(`Found ${profiles.length} profiles`);

// Open specific profile
const profile = await adspower.openProfile('k12am9a2');
console.log(`Profile opened on port ${profile.puppeteer_port}`);

// Connect Puppeteer
const puppeteer = require('puppeteer');
const browser = await puppeteer.connect({
  browserWSEndpoint: `ws://localhost:${profile.puppeteer_port}`
});

// Your automation here
const page = await browser.newPage();
await page.goto('https://example.com');

// Close when done
await browser.close();
await adspower.closeProfile('k12am9a2');
```

---

## Profile Groups

- **Group 0:** Default group (majority of profiles)
- **Group 7473129:** ~15 profiles
- **Group 4585199:** ~5 profiles
- **Group 4079086:** ~2 profiles

---

## Profile ID Patterns

- **Newest (1-50):** Start with `k` prefix (e.g., k12am9a2)
- **Oldest (96-100):** Start with `j` prefix
- **Sorted by:** Creation date (newest first)

---

## Test Profile (Working Example)

**Profile ID:** `k12am9a2`
- **Email:** `patmcgee727@gmail.com`
- **IP:** 178.230.42.159 (Netherlands)
- **Type:** Mobile 8086
- **Status:** ✅ Successfully warmed up
- **Screenshots:** `/Users/northsea/clawd-dmitry/screenshots/profile-1-warmup/`

---

## Important Technical Notes

1. **Timing:** Always wait 5 seconds after `openProfile()` before connecting Puppeteer
2. **Pagination:** Only first 100 profiles accessible via `/user/list` (API limitation)
3. **Concurrent Limit:** Comfortable with 30-50 profiles open simultaneously
4. **Endpoint Issues:** `/user/info` doesn't work; use `/user/list` instead

---

## Documentation

**Integration Guide:** `/Users/northsea/clawd-dmitry/CLAWDECK-ADSPOWER-INTEGRATION.md`
**Setup Docs:** `/Users/northsea/clawd-dmitry/warmup-automation/ADSPOWER_SETUP.md`
**Task Board:** `/Users/northsea/clawd-dmitry/CLAWDECK-TASKS.md`

---

## Next Steps

1. ✅ AdsPower API configured and tested
2. ✅ Client wrapper ready for agent use
3. ✅ Documentation created
4. ⏳ Create Puppeteer automation templates
5. ⏳ Build batch operation utilities
6. ⏳ Integrate with ClawDeck task system

---

**Last Updated:** 2026-02-09
**Status:** Ready for ClawDeck agent automation
**Access:** Any agent can use via adspower-client.js

# AdsPower Integration

## Overview

This integration connects the warmup automation with AdsPower, enabling:
- Profile management at scale (3500+ profiles)
- Automated warmup on multiple profiles
- Cookie/session data extraction
- Bulk operations with progress tracking

## Setup Instructions

### 1. Start AdsPower Application

Ensure AdsPower is running with API enabled:
1. Open AdsPower application
2. Go to **Settings > API & MCP**
3. Verify local server is running on `http://local.adspower.net:50325`
4. Generate/copy your API key

### 2. Test API Connection

Run the test script to verify connection and extract profile data:

```bash
cd /Users/northsea/clawd-dmitry/warmup-automation
node test-adspower-profile-1.js
```

This will:
- ✅ Test API connection
- ✅ List all profiles
- ✅ Extract full data for Profile 1
- ✅ Save data to `adspower-profile-data.json`

### 3. View Dashboard

Open the dashboard in your browser:

```bash
open adspower-dashboard.html
```

Or open manually:
```
file:///Users/northsea/clawd-dmitry/warmup-automation/adspower-dashboard.html
```

The dashboard displays:
- Profile information (name, ID, status, browser type)
- Statistics (cookies, domains, extensions, active sessions)
- Cookie inventory with domains
- Installed extensions
- Real-time data refresh

## API Features

### Implemented Endpoints

#### Connection & User
- ✅ `GET /api/v1/user/status` - Test connection
- ✅ `GET /api/v1/user/list` - List all profiles
- ✅ `POST /api/v1/user/info` - Get profile details
- ✅ `POST /api/v1/user/group` - Get profile groups

#### Browser Control
- ✅ `POST /api/v1/browser/open` - Start profile browser
- ✅ `POST /api/v1/browser/close` - Stop profile browser
- ✅ `POST /api/v1/browser/is-active` - Check if profile is active
- ✅ `POST /api/v1/browser/cookies` - Get profile cookies
- ✅ `POST /api/v1/browser/get_extensions` - Get profile extensions

#### Profile Management
- ✅ `POST /api/v1/user/create` - Create new profile
- ✅ `POST /api/v1/user/update` - Update profile
- ✅ `POST /api/v1/user/delete` - Delete profile
- ✅ `POST /api/v1/user/fingerprint` - Get browser fingerprint
- ✅ `POST /api/v1/audit-log/list` - Get audit logs

## Usage Examples

### Basic Usage

```javascript
const AdsPowerClient = require('./adspower-client');

const client = new AdsPowerClient('your-api-key');

// Test connection
const status = await client.testConnection();

// Get all profiles
const profiles = await client.getProfiles();

// Get specific profile info
const info = await client.getProfileInfo('profile-id');

// Start a profile
await client.startProfile('profile-id');
```

### Extract Profile Data

```javascript
// Get comprehensive profile data
const fullData = await client.getFullProfileData('profile-id');

// Returns:
{
  success: true,
  profile_id: 'xxx',
  basic_info: { ... },
  is_active: true,
  cookies: [ ... ],
  extensions: [ ... ],
  timestamp: '2026-02-03T...'
}
```

### Filter Profiles

```javascript
// Get profiles from specific group
const profiles = await client.getProfiles({
  group_id: 'group-123',
  page: 1,
  page_size: 50
});

// Search profiles by keyword
const results = await client.getProfiles({
  keywords: 'test'
});
```

## Current Status

### ✅ Completed
- API client implementation (all major endpoints)
- Test script for Profile 1 data extraction
- HTML dashboard for profile visualization
- Error handling and connection testing

### ⏳ In Progress
- Integration with warmup automation script
- Bulk profile processing
- Queue system for parallel warmup
- Progress tracking UI

### 📋 TODO
- [ ] Warmup integration with profile selection
- [ ] Batch warmup (10-50 profiles simultaneously)
- [ ] Queue management for large scale (3500+ profiles)
- [ ] Cookie export to AdsPower profiles
- [ ] MCP integration for natural language control
- [ ] Web UI for profile management
- [ ] Scheduling system for automated warmup

## Files

- `adspower-client.js` - API client library
- `test-adspower-profile-1.js` - Connection test & data extraction
- `adspower-profile-data.json` - Extracted profile data (generated)
- `adspower-dashboard.html` - Visual dashboard
- `ADSPOWER_INTEGRATION.md` - This file

## Troubleshooting

### Connection Refused
**Error:** `Connection failed: ECONNREFUSED`

**Solution:**
1. Ensure AdsPower application is running
2. Check API is enabled in Settings > API & MCP
3. Verify local server port (default: 50325)

### API Key Error
**Error:** `API Error: Invalid API key`

**Solution:**
1. Generate new API key in AdsPower
2. Update API key in test script
3. Ensure no trailing spaces in API key

### Profile Not Found
**Error:** `Profile xxx not found`

**Solution:**
1. Run `node test-adspower-profile-1.js` to list all profiles
2. Use correct profile user ID
3. Check profile is not deleted

## Security Notes

⚠️ **Important:**
- API key is stored in plain text in test files
- For production, use environment variables:
  ```bash
  export ADSPOWER_API_KEY="your-key-here"
  ```
- Never commit API keys to version control
- Restrict API key permissions in AdsPower settings

## Next Steps

1. **Test Connection:** Run `node test-adspower-profile-1.js`
2. **Verify Data:** Open `adspower-dashboard.html`
3. **Integration Ready:** Client is ready for warmup script integration
4. **Scale Up:** Ready for 3500+ profile management

---

*Generated for AdsPower API integration with warmup automation*

# AdsPower Installation & Profile 1 Warmup Test

## 📋 Quick Start Guide

### Option 1: Manual Installation (Recommended)

1. **Download AdsPower:**
   - Visit: https://www.adspower.com/download
   - Click the "Download" button
   - Select "macOS Version" (approx. 150MB)
   - File will be saved as `AdsPower.dmg` in your Downloads folder

2. **Install:**
   - Double-click `AdsPower.dmg` to open it
   - Drag the AdsPower icon to your Applications folder
   - Wait for copy to complete
   - Eject the DMG when done

3. **First Launch:**
   - Open Applications folder
   - Double-click AdsPower
   - **If you see a security warning:**
     - Go to: System Preferences > Security & Privacy > General
     - Click "Open Anyway" for AdsPower
   - Create an account or log in

4. **Enable API:**
   - Click Settings (gear icon)
   - Go to "API & MCP" tab
   - Verify "Local Server" shows: **Connected**
   - Note the URL: `http://local.adspower.net:50325`
   - Your API key is already configured in the scripts

### Option 2: Automated Setup

Run the installation helper:
```bash
/Users/northsea/clawd-dmitry/warmup-automation/install-adspower.sh
```

This will guide you through the installation and automatically test the connection.

## 🚀 After Installation

### Step 1: Verify AdsPower is Running

Make sure AdsPower application is open and you see the main interface.

### Step 2: Run Profile 1 Warmup Test

```bash
cd /Users/northsea/clawd-dmitry/warmup-automation
node launch-profile-1-warmup.js
```

This script will:
1. ✅ Test AdsPower API connection
2. ✅ Get Profile 1 information
3. ✅ Launch Profile 1 browser
4. ✅ Check if Gmail is logged in
5. ✅ Run warmup activities (Gmail, Google search, Dutch news sites)
6. ✅ Take screenshots throughout the process
7. ✅ Keep the browser window open for you to see

### Step 3: View Results

Screenshots will be saved to:
```
/Users/northsea/clawd-dmitry/warmup-automation/screenshots/profile-1-warmup/
```

Open this folder to see all the warmup activity screenshots.

## 📊 What to Expect

### Profile 1 Status
- Profile should launch in a new browser window
- If Gmail is logged in, it will show your inbox
- Warmup will visit 4-5 sites over ~5 minutes
- Browser window stays open after warmup completes

### Warmup Activities
1. **Gmail Check** - Verifies login status
2. **Google Search** - Searches for "latest technology news"
3. **Dutch News** - Visits nu.nl
4. **Tech Site** - Visits tweakers.net

Each activity:
- Takes a full-page screenshot
- Pauses for 2-5 seconds (human-like)
- Shows progress in terminal

### Screenshots Captured
- `initial_TIMESTAMP.png` - Before warmup starts
- `activity_1_TIMESTAMP.png` - After Gmail check
- `activity_2_TIMESTAMP.png` - After Google search
- `activity_3_TIMESTAMP.png` - After Dutch news
- `activity_4_TIMESTAMP.png` - After tech site
- `final_TIMESTAMP.png` - After warmup completes

## 🔧 Troubleshooting

### AdsPower Won't Start
**Error:** "AdsPower can't be opened because it is from an unidentified developer"

**Solution:**
```bash
# Remove quarantine attribute
sudo xattr -cr /Applications/AdsPower.app

# Or via System Preferences:
# System Preferences > Security & Privacy > General
# Click "Open Anyway"
```

### API Connection Failed
**Error:** `Connection failed: connect ECONNREFUSED 127.0.0.1:50325`

**Solution:**
1. Ensure AdsPower application is running
2. Go to Settings > API & MCP
3. Verify "Local Server" shows "Connected"
4. Check the URL matches: `http://local.adspower.net:50325`

### Profile 1 Not Found
**Error:** `Profile 1 not found`

**Solution:**
1. Open AdsPower application
2. Check if Profile 1 exists in your profile list
3. If not, create a new profile
4. Or update `PROFILE_ID` in the script to match an existing profile

### Gmail Not Logged In
**Warning:** `Gmail may not be logged in`

**Solution:**
1. Let the warmup complete anyway
2. Manually log into Gmail in the opened browser window
3. The profile will save the login for next time
4. Re-run the warmup script to test with logged-in Gmail

## 📁 Files Created

- `adspower-client.js` - API client library
- `test-adspower-profile-1.js` - Connection test script
- `launch-profile-1-warmup.js` - Warmup script for Profile 1
- `adspower-profile-data.json` - Profile data (generated)
- `adspower-dashboard.html` - Visual dashboard
- `screenshots/profile-1-warmup/` - Warmup screenshots

## ✅ Success Indicators

You'll know it worked when you see:
```
✅ Connected to AdsPower API
✅ Profile found: [Profile Name]
✅ Profile launched successfully!
✅ Connected to browser
✅ Profile 1 is ready for warmup
📧 Checking Gmail...
✅ Gmail appears to be logged in!
🎯 Starting warmup activities...
✅ All warmup activities completed
✅ Warmup completed!
```

## 🎯 Next Steps (After This Test)

Once Profile 1 warmup works:
1. ✅ Verify screenshots look good
2. ✅ Check Gmail is properly logged in
3. ✅ Confirm browser fingerprint is applied
4. ✅ Review activity patterns
5. ✅ Scale to multiple profiles
6. ✅ Implement batch warmup for 3500+ profiles

---

*Ready when you are! Install AdsPower and run the test script.* 🚀

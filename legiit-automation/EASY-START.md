# 🚀 Legiit Automation - Easy Setup Guide

## ⚡ Quick Start (Double-Click & Go!)

### macOS Users

1. Open `legiit-automation` folder
2. **Double-click** `start.command`
3. Browser opens automatically → Done!

### Windows Users

1. Open `legiit-automation` folder
2. **Double-click** `start.bat`
3. Browser opens automatically → Done!

### Linux Users

1. Open `legiit-automation` folder
2. Run `./start-setup.sh`
3. Browser opens automatically → Done!

---

## 📸 What You'll See

Your browser opens to a beautiful dashboard:

```
🔐 Legiit Automation Setup
┌─────────────────────────────────┐
│ Legiit Email: [___________]     │
│ Legiit Password: [___________]  │
│                                 │
│ Port: 3000                      │
│ API Key: [Auto-generated]       │
│                                 │
│ [💾 Save Configuration]         │
│ [🚀 Start Server]               │
└─────────────────────────────────┘
```

---

## ✅ Setup Steps (One-Time, 2 Minutes)

### 1. Browser Opens Automatically
- URL: http://localhost:8080
- Beautiful purple gradient interface

### 2. Fill in Your Details
- **Legiit Email** - Your Legiit account email
- **Legiit Password** - Your Legiit password
- **Port** - Leave as 3000 (or change if needed)
- **API Key** - Leave blank (auto-generates secure key)

### 3. Click Buttons
- Click **"💾 Save Configuration"**
- Click **"🚀 Start Server"**

### 4. Done! Dashboard Shows:
- ✅ Your API endpoint
- 🔑 Your API key
- 📋 Example requests
- 🧪 Test form

---

## 📡 Use the API (Your Tool)

Once running, call this endpoint:

```bash
POST http://localhost:3000/api/purchase-citation

Headers:
  X-API-Key: your_api_key
  Content-Type: application/json

Body:
{
  "domain": "mybusiness.com",
  "businessName": "My Business LLC",
  "address": "123 Main St, New York, NY 10001"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORDER-1234567890",
  "screenshot": "/path/to/screenshot.png"
}
```

---

## 🔄 Start/Stop

### To Start:
- **Double-click** `start.command` (Mac) or `start.bat` (Windows)
- Or open dashboard → Click "Start Server"

### To Stop:
- Press **Ctrl+C** in the terminal window
- Or dashboard → Click "Stop Server"

---

## 📁 Files in Folder

```
legiit-automation/
├── start.command          ⭐ Double-click this (Mac)
├── start.bat              ⭐ Double-click this (Windows)
├── start-setup.sh         ⭐ Run this (Linux)
├── node_modules/          (auto-created)
├── .env                   (your credentials, auto-created)
└── src/
    ├── setup-server.js    (dashboard backend)
    └── server.js          (automation API)
```

---

## 🎯 Complete Workflow

### First Time Setup (2 minutes):
1. **Double-click** `start.command` (or `start.bat`)
2. **Wait** 30 seconds (installing dependencies)
3. **Browser opens** automatically
4. **Fill in** Legiit email & password
5. **Click** "Save Configuration"
6. **Click** "Start Server"
7. **Copy** API key from dashboard
8. ✅ **Done!** Ready to use

### Daily Use (10 seconds):
1. **Double-click** `start.command`
2. **Browser opens** with dashboard
3. **Click** "Start Server"
4. ✅ **Ready!** API is running

### Integration (Your Tool):
```javascript
// Make API calls
fetch('http://localhost:3000/api/purchase-citation', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    domain: 'business.com',
    businessName: 'Business LLC',
    address: '123 Main St, New York, NY 10001'
  })
})
```

---

## 🔒 Security

✅ **Credentials stored locally** - Never uploaded to cloud
✅ **API key auto-generated** - 32-byte hex string
✅ **Local servers only** - No external connections
✅ **No data collection** - Everything runs on your machine

---

## 🆘 Troubleshooting

### "Command not found"
**Fix:** Install Node.js from https://nodejs.org/

### "Port already in use"
**Fix:** Change port number in dashboard (try 3001, 3002)

### "Browser doesn't open"
**Fix:** Manually open http://localhost:8080

### "Server won't start"
**Fix:**
1. Check credentials are saved
2. Stop and restart server
3. Check terminal for errors

### "Purchase failed"
**Fix:**
1. Verify Legiit credentials
2. Check wallet balance
3. Set HEADLESS=false to watch the process

---

## 📋 Requirements

- ✅ Node.js 18+ (install from nodejs.org)
- ✅ Modern browser (Chrome, Firefox, Safari, Edge)
- ✅ Legiit account with wallet balance
- ✅ Internet connection

---

## 🎉 Success!

**You now have:**
- ✅ One-click launcher (no terminal needed)
- ✅ Beautiful web dashboard
- ✅ Automated Legiit purchasing
- ✅ API for your tool integration

**Double-click and go!** 🚀

---

## 📞 Support

If you need help:
1. Check the dashboard status messages
2. Review this guide
3. Check terminal for error messages
4. Verify Node.js is installed: `node --version`

---

**Setup URL:** http://localhost:8080  
**API Endpoint:** http://localhost:3000/api/purchase-citation

**Made easy for non-developers!** 💪

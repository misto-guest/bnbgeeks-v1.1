# 🖥️ Legiit Automation - Web Dashboard Setup

## Quick Start (3 Steps)

### Step 1: Open Setup Dashboard

**Option A: Double-click (Mac)**
```bash
open legiit-automation/start-setup.sh
```

**Option B: Terminal**
```bash
cd legiit-automation
npm run setup
```

### Step 2: Configure in Browser

1. Browser opens to: http://localhost:8080
2. Fill in your Legiit credentials
3. Click "Save Configuration"
4. Click "Start Server"

### Step 3: Use the API

The dashboard will show you:
- ✅ API endpoint URL
- 🔑 Your API key
- 📋 Request format
- 🧪 Test form

**That's it!** No terminal, no coding, no config files.

---

## 📸 Dashboard Features

### 1. Credential Setup
- Enter Legiit email & password
- Configure server port (default: 3000)
- Generate API key (auto-created)
- Toggle headless mode

### 2. Server Control
- **Start Server** - Launch automation API
- **Stop Server** - Stop automation API
- Status indicators

### 3. API Information
- Shows endpoint URL
- Displays your API key
- Example request format
- Copy-paste ready

### 4. Test Form
- Test the API directly from browser
- Fill in domain, business name, address
- Click "Test Purchase"
- See results instantly

---

## 📡 API Endpoint (for Your Tool)

Once started, use this endpoint:

```
POST http://localhost:3000/api/purchase-citation
```

**Headers:**
```
Content-Type: application/json
X-API-Key: YOUR_API_KEY
```

**Body:**
```json
{
  "domain": "business.com",
  "businessName": "Business LLC",
  "address": "123 Main St, City, State ZIP"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORDER-1234567890",
  "screenshot": "/path/to/screenshot.png",
  "timestamp": "2026-02-09T12:00:00.000Z"
}
```

---

## 🎯 Complete Workflow

### For Setup (One-Time)

1. **Run start script**
   ```bash
   ./start-setup.sh
   ```

2. **Browser opens automatically**
   - http://localhost:8080

3. **Fill in form**
   - Legiit email
   - Legiit password
   - Port (3000 is fine)
   - API key (leave blank to auto-generate)

4. **Click buttons**
   - "Save Configuration"
   - "Start Server"

5. **Done!** Server is running

### For Your Tool (Integration)

1. **Make API calls**
   ```javascript
   fetch('http://localhost:3000/api/purchase-citation', {
     method: 'POST',
     headers: {
       'X-API-Key': 'your_api_key',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       domain: 'mybusiness.com',
       businessName: 'My Business LLC',
       address: '123 Main St, New York, NY 10001'
     })
   })
   ```

2. **Get response**
   ```json
   {
     "success": true,
     "orderId": "ORDER-1234567890"
   }
   ```

3. **Purchase complete!**

---

## 🔄 Start/Stop Server

### Start Server
- Open dashboard: http://localhost:8080
- Click "Start Server" button
- Or use terminal: `npm start`

### Stop Server
- In dashboard: Click "Stop Server"
- Or terminal: Press Ctrl+C

### Check Status
- Dashboard shows if server is running
- Green indicator = running
- Red indicator = stopped

---

## 🔒 Security

- Credentials saved in `.env` file (not in git)
- API key auto-generated (32 bytes, hex)
- Setup server only runs locally (localhost:8080)
- Automation server only runs locally (localhost:3000)

---

## 📂 Files Created

```
legiit-automation/
├── start-setup.sh          ⭐ Run this to open dashboard
├── src/
│   ├── setup-server.js     # Dashboard backend
│   └── server.js           # Automation API
├── public/
│   └── setup.html          # Dashboard UI
└── .env                    # Your credentials (auto-created)
```

---

## 🆘 Troubleshooting

### "Port already in use"
- Change port in dashboard (try 3001, 3002, etc.)
- Or close other apps using port 3000

### "Server won't start"
- Check if credentials are saved
- Look for error messages in dashboard
- Try stopping and starting again

### "Can't open dashboard"
- Make sure port 8080 is available
- Check firewall settings
- Try: `npm run setup` in terminal

### "Purchase failed"
- Check Legiit credentials
- Verify wallet balance
- Check screenshot in `logs/` folder
- Set HEADLESS=false to watch the process

---

## ✅ Quick Checklist

**First-Time Setup:**
- [ ] Run `./start-setup.sh`
- [ ] Browser opens to http://localhost:8080
- [ ] Enter Legiit credentials
- [ ] Click "Save Configuration"
- [ ] Click "Start Server"
- [ ] Copy API key from dashboard
- [ ] Test with test form

**Integration:**
- [ ] Add API endpoint to your tool
- [ ] Include API key in header
- [ ] Send POST requests with order data
- [ ] Handle success/error responses

---

## 🎉 Success!

You now have:
1. ✅ Web dashboard for setup (no terminal needed)
2. ✅ API endpoint for automation (easy integration)
3. ✅ Test form for verification
4. ✅ One-click server control

**Setup URL:** http://localhost:8080  
**API Endpoint:** http://localhost:3000/api/purchase-citation

---

**Need help?** Check the dashboard for live status and error messages.

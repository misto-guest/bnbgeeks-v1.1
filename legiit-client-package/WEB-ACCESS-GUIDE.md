# 🌐 Making Legiit API Accessible from Web

## 🎯 Goal

Make your local Legiit API accessible from your web application over the internet.

---

## ✅ You Already Have Cloudflare Tunnel!

From your GPS project, you have:
```
https://jesse-prescribed-projects-yellow.trycloudflare.com
```

---

## 🚀 Two Options

### Option 1: Add Legiit API to Existing Tunnel (Easy)

Your existing tunnel can already route to the Legiit API!

**Integration URL:**
```
https://jesse-prescribed-projects-yellow.trycloudflare.com/legiit/api/purchase-citation
```

**Your web app calls:**
```javascript
fetch('https://jesse-prescribed-projects-yellow.trycloudflare.com/legiit/api/purchase-citation', {
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

### Option 2: Separate Tunnel for Legiit API

Create dedicated tunnel:

```bash
cloudflare tunnel --url http://localhost:3000
```

Gives you:
```
https://something.trycloudflare.com/api/purchase-citation
```

---

## 🔧 Setup Instructions

### Step 1: Start Legiit API Server

**Mac:**
```bash
cd legiit-automation
./start.command
```

**Windows:**
```
Double-click start.bat
```

Server runs on: `http://localhost:3000`

### Step 2: Start Cloudflare Tunnel

```bash
cloudflare tunnel --url http://localhost:3000
```

Output:
```
https://your-random-subdomain.trycloudflare.com
```

### Step 3: Test from Web App

```javascript
const response = await fetch('https://your-subdomain.trycloudflare.com/api/purchase-citation', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_from_dashboard',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    domain: 'mybusiness.com',
    businessName: 'My Business LLC',
    address: '123 Main St, New York, NY 10001'
  })
});

const result = await response.json();
console.log(result);
// { success: true, orderId: "ORDER-1234567890", ... }
```

---

## 🔒 Security for Web Access

### 1. Keep API Key Secret
❌ **NEVER put in frontend code:**
```javascript
// Bad - visible to everyone!
const apiKey = 'abc123...';
fetch('https://...', { headers: { 'X-API-Key': apiKey } })
```

✅ **ALWAYS use backend:**
```javascript
// Your backend
app.post('/api/purchase-citation', async (req, res) => {
  const response = await fetch('http://localhost:3000/api/purchase-citation', {
    headers: {
      'X-API-Key': process.env.LEGIIT_API_KEY // From .env file
    },
    body: JSON.stringify(req.body)
  });
  // ...
});
```

### 2. Add CORS to Legiit API

Add this to `src/server.js`:

```javascript
// CORS middleware
app.use((req, res, next) => {
  // Allow your web app domain
  const allowedOrigins = [
    'https://your-web-app.com',
    'http://localhost:3000',
    'https://jesse-prescribed-projects-yellow.trycloudflare.com'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Headers', 'X-API-Key, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});
```

### 3. Add Rate Limiting

```javascript
// Simple rate limiter
const rateLimit = new Map();

app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];

  // Remove old requests (older than 1 minute)
  const recent = requests.filter(t => now - t < 60000);

  if (recent.length >= 10) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  recent.push(now);
  rateLimit.set(ip, recent);
  next();
});
```

---

## 📊 Complete Architecture

```
┌─────────────────┐
│  Your Web App   │
│  (Frontend)     │
└────────┬────────┘
         │
         │ HTTPS request
         ▼
┌─────────────────┐
│  Your Backend   │
│  (Node.js/PHP)  │
└────────┬────────┘
         │
         │ HTTP request
         ▼
┌─────────────────────────┐
│  Cloudflare Tunnel      │
│  (Public URL)           │
└────────┬────────────────┘
         │
         │ Forwards to
         ▼
┌─────────────────────────┐
│  Legiit API Server      │
│  (localhost:3000)       │
└────────┬────────────────┘
         │
         │ Puppeteer
         ▼
┌─────────────────────────┐
│  Legiit Website         │
│  (Automated Browser)    │
└─────────────────────────┘
```

---

## 🧪 Testing

### 1. Test Locally First
```bash
curl -X POST http://localhost:3000/api/purchase-citation \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"domain":"test.com","businessName":"Test LLC","address":"123 Test St"}'
```

### 2. Test Through Tunnel
```bash
curl -X POST https://your-subdomain.trycloudflare.com/api/purchase-citation \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"domain":"test.com","businessName":"Test LLC","address":"123 Test St"}'
```

### 3. Test from Web App
Use the integration code in your web app.

---

## 🔄 Keep Tunnel Running

### Option A: Manual
Keep terminal open with tunnel running

### Option B: Background Service
Use a process manager:

```bash
# Using nohup
nohup cloudflare tunnel --url http://localhost:3000 > tunnel.log 2>&1 &

# Check logs
tail -f tunnel.log
```

### Option C: Systemd Service (Linux)
Create `/etc/systemd/system/legiit-tunnel.service`:

```ini
[Unit]
Description=Legiit API Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=your_user
ExecStart=/usr/local/bin/cloudflare tunnel --url http://localhost:3000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable legiit-tunnel
sudo systemctl start legiit-tunnel
```

---

## 📝 Environment Variables for Your Web App

```env
# In your web app's .env file
LEGIIT_API_URL=https://your-subdomain.trycloudflare.com
LEGIIT_API_KEY=your_api_key_from_dashboard
```

Use in code:
```javascript
const apiUrl = process.env.LEGIIT_API_URL;
const apiKey = process.env.LEGIIT_API_KEY;
```

---

## ✅ Checklist

- [ ] Start Legiit API server (start.command / start.bat)
- [ ] Start Cloudflare tunnel
- [ ] Test API locally
- [ ] Test through tunnel
- [ ] Add API endpoint to your web app backend
- [ ] Store API key in environment variables
- [ ] Add CORS if needed
- [ ] Test from web app
- [ ] Add error handling
- [ ] Add rate limiting

---

## 🎯 Quick Start Commands

```bash
# Terminal 1: Start Legiit API
cd legiit-automation
./start.command  # or start.bat on Windows

# Terminal 2: Start Cloudflare Tunnel
cloudflare tunnel --url http://localhost:3000

# Terminal 3: Test
curl -X POST https://your-subdomain.trycloudflare.com/api/purchase-cociation \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"domain":"test.com","businessName":"Test LLC","address":"123 Test St"}'
```

---

## 📞 Troubleshooting

### "Connection refused"
- Make sure Legiit API server is running
- Check it's on port 3000

### "Invalid API Key"
- Copy API key from dashboard
- Check header is `X-API-Key` not `Authorization`

### "CORS error"
- Add CORS middleware to API server
- Check allowed origins

### "Tunnel not working"
- Make sure cloudflare tunnel is running
- Check the tunnel URL

---

**Ready for web integration!** 🌐

**API URL:** `https://your-subdomain.trycloudflare.com/api/purchase-citation`

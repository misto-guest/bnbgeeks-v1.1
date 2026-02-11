# 📡 Legiit Automation API - Quick Start Guide

## API Endpoint

```
POST http://localhost:3000/api/purchase-citation
```

### Request Format

**Headers:**
```http
Content-Type: application/json
X-API-Key: YOUR_SECRET_API_KEY
```

**Body:**
```json
{
  "domain": "mybusiness.com",
  "businessName": "My Business LLC",
  "address": "123 Main St, New York, NY 10001"
}
```

### Response Format

**Success:**
```json
{
  "success": true,
  "orderId": "ORDER-1739097600000",
  "screenshot": "/path/to/screenshot.png",
  "timestamp": "2026-02-09T12:20:00.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2026-02-09T12:20:00.000Z"
}
```

---

## 🔐 How to Add Your Login (3 Methods)

### Method 1: Interactive Setup (Easiest) ⭐

```bash
cd legiit-automation
./quick-setup.sh
```

This will prompt you for:
- Legiit email
- Legiit password
- API key (or auto-generate one)

Then creates `.env` file automatically.

---

### Method 2: Manual Edit

```bash
cd legiit-automation
cp .env.example .env
nano .env  # or use 'code .env' for VS Code
```

Edit the values:
```env
LEGIIT_EMAIL=your_email@example.com
LEGIIT_PASSWORD=your_password
PORT=3000
API_KEY=create_a_secure_api_key_here
HEADLESS=true
SLOW_MO=50
```

Save and exit (Ctrl+X, then Y, then Enter for nano)

---

### Method 3: One-Line Command

```bash
cd legiit-automation && cat > .env << 'EOF'
LEGIIT_EMAIL=your_email@example.com
LEGIIT_PASSWORD=your_password
PORT=3000
API_KEY=your_api_key_here
HEADLESS=true
SLOW_MO=50
EOF
```

Replace the values with your actual credentials.

---

## 🚀 Start the Server

After configuring `.env`:

```bash
npm start
```

You should see:
```
🚀 Legiit Automation API Server
📡 Listening on port 3000
🔑 API Key: configured
```

---

## 🧪 Test the API

### Using cURL
```bash
curl -X POST http://localhost:3000/api/purchase-citation \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "test.com",
    "businessName": "Test Business",
    "address": "123 Test St, City, ST 12345"
  }'
```

### Using the Test Script
```bash
npm test
```

---

## 📝 Example Integrations

### Node.js / JavaScript
```javascript
const result = await fetch('http://localhost:3000/api/purchase-citation', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    domain: 'mybusiness.com',
    businessName: 'My Business LLC',
    address: '123 Main St, New York, NY 10001'
  })
}).then(r => r.json());

console.log(result);
// { success: true, orderId: "ORDER-123", ... }
```

### Python
```python
import requests

response = requests.post(
    'http://localhost:3000/api/purchase-citation',
    headers={'X-API-Key': 'YOUR_API_KEY'},
    json={
        'domain': 'mybusiness.com',
        'businessName': 'My Business LLC',
        'address': '123 Main St, New York, NY 10001'
    }
)

result = response.json()
print(result)
```

### PHP
```php
$response = curl_post('http://localhost:3000/api/purchase-citation', [
    'headers' => ['X-API-Key: YOUR_API_KEY'],
    'json' => [
        'domain' => 'mybusiness.com',
        'businessName' => 'My Business LLC',
        'address' => '123 Main St, New York, NY 10001'
    ]
]);

$result = json_decode($response, true);
```

---

## 🔑 Where to Find Your API Key

After running `./quick-setup.sh`, it will display your API key:

```
🔑 Your API Key: a1b2c3d4e5f6...
⚠️  Keep this key secret!
```

Or if you created `.env` manually, your API key is the value you set for `API_KEY=...`

---

## ⚙️ Configuration Options

| Variable | Description | Example |
|----------|-------------|---------|
| `LEGIIT_EMAIL` | Your Legiit login email | `john@email.com` |
| `LEGIIT_PASSWORD` | Your Legiit password | `secret123` |
| `PORT` | Server port | `3000` |
| `API_KEY` | Secret API key | `abc123def456` |
| `HEADLESS` | Hide browser? | `true` or `false` |
| `SLOW_MO` | Delay (ms) between actions | `50` |

---

## 🔒 Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` to Git
- Never share your API key publicly
- Use strong, unique API keys
- Keep your Legiit credentials secure
- Monitor your wallet balance

---

## 📞 Need Help?

- Check `README.md` for full documentation
- Check `INTEGRATION.md` for more examples
- Run `npm test` to verify setup
- Set `HEADLESS=false` in `.env` to watch the browser

---

## ✅ Quick Checklist

- [ ] Run `npm install` (first time only)
- [ ] Configure `.env` with credentials
- [ ] Run `npm start` to start server
- [ ] Test with `npm test` or cURL
- [ ] Integrate API call into your tool

---

**Ready! 🚀**
Server running on: `http://localhost:3000`
API endpoint: `POST /api/purchase-citation`

# Legiit Automation - API Integration Guide

## 🎯 Overview

This automation provides a REST API for purchasing local citations from Legiit automatically. The service runs on a local server and accepts purchase requests via HTTP POST.

## 📦 What Was Created

```
legiit-automation/
├── src/
│   ├── server.js              # Express API server
│   └── legiit-automation.js   # Puppeteer automation logic
├── logs/                      # Screenshot logs (for verification)
├── .env.example               # Configuration template
├── .gitignore
├── package.json               # Dependencies
├── README.md                  # Full documentation
├── setup.sh                   # Setup script
└── test-api.js               # API testing script
```

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd legiit-automation
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
LEGIIT_EMAIL=your_email@example.com
LEGIIT_PASSWORD=your_password
PORT=3000
API_KEY=your_secret_api_key_here
```

### Step 3: Start the Server

```bash
npm start
```

You'll see:
```
🚀 Legiit Automation API Server
📡 Listening on port 3000
🔑 API Key: configured
```

## 📡 API Endpoint

### POST /api/purchase-citation

**Headers:**
```
X-API-Key: your_secret_api_key_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "domain": "example.com",
  "businessName": "My Business LLC",
  "address": "123 Main St, New York, NY 10001"
}
```

**Success Response:**
```json
{
  "success": true,
  "orderId": "ORDER-1234567890",
  "screenshot": "/path/to/screenshot.png",
  "timestamp": "2026-02-09T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2026-02-09T12:00:00.000Z"
}
```

## 🔌 Integration Examples

### Example 1: JavaScript/Node.js

```javascript
const purchaseCitation = async (domain, businessName, address) => {
  const response = await fetch('http://localhost:3000/api/purchase-citation', {
    method: 'POST',
    headers: {
      'X-API-Key': 'your_api_key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ domain, businessName, address })
  });

  return await response.json();
};

// Usage
const result = await purchaseCitation(
  'mybusiness.com',
  'My Business LLC',
  '123 Main St, New York, NY 10001'
);

console.log(result);
```

### Example 2: Python

```python
import requests
import json

def purchase_citation(domain, business_name, address):
    url = 'http://localhost:3000/api/purchase-citation'
    headers = {
        'X-API-Key': 'your_api_key',
        'Content-Type': 'application/json'
    }
    data = {
        'domain': domain,
        'businessName': business_name,
        'address': address
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
result = purchase_citation(
    'mybusiness.com',
    'My Business LLC',
    '123 Main St, New York, NY 10001'
)

print(result)
```

### Example 3: cURL

```bash
curl -X POST http://localhost:3000/api/purchase-citation \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "mybusiness.com",
    "businessName": "My Business LLC",
    "address": "123 Main St, New York, NY 10001"
  }'
```

## ⚙️ Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `LEGIIT_EMAIL` | Legiit account email | *required* |
| `LEGIIT_PASSWORD` | Legiit password | *required* |
| `PORT` | Server port | `3000` |
| `API_KEY` | API authentication key | *optional* |
| `HEADLESS` | Run browser invisibly | `true` |
| `SLOW_MO` | Delay between actions (ms) | `50` |

## 🔒 Security Best Practices

1. **Never commit `.env`** to version control
2. **Use strong API keys** in production
3. **Rotate credentials regularly**
4. **Monitor wallet balance** to prevent overdrafts
5. **Use HTTPS** in production (add reverse proxy)

## 🧪 Testing

Run the included test script:
```bash
npm test
```

Or manually test with cURL (see Example 3 above).

## 📊 What Happens During Purchase

1. **Login** - Browser logs into Legiit
2. **Navigate** - Goes to the gig page
3. **Select Package** - Chooses "Standard" package
4. **Fill Forms** - Auto-detects and fills domain, business name, address
5. **Checkout** - Proceeds to payment
6. **Pay** - Selects wallet balance
7. **Confirm** - Completes purchase
8. **Screenshot** - Saves verification image
9. **Return** - Returns order ID and status

## 🐛 Troubleshooting

### Login Issues
- Verify credentials in `.env`
- Set `HEADLESS=false` to watch the process
- Check for 2FA on your account

### Payment Issues
- Ensure wallet has sufficient balance
- Verify "Standard" package is available
- Check screenshot in `logs/` folder

### Form Field Detection
The automation uses multiple selector strategies to find fields. If Legiit changes their UI, update the selectors in `src/legiit-automation.js`.

## 📝 Next Steps

1. **Setup:** Follow setup instructions above
2. **Test:** Run `npm test` to verify
3. **Integrate:** Use the integration examples above
4. **Deploy:** Consider deploying to a server for 24/7 availability

## 🎉 Ready to Use!

Once the server is running (`npm start`), you can send POST requests to purchase citations automatically.

**Server runs on:** `http://localhost:3000`
**API endpoint:** `POST /api/purchase-citation`

---

For full documentation, see `README.md`

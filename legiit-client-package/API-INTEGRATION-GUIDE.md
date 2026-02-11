# 📡 Legiit Automation API - Integration Guide

## 🌐 API Endpoint

### Local Development
```
POST http://localhost:3000/api/purchase-citation
```

### Production (With Tunnel)
```
POST https://your-subdomain.trycloudflare.com/api/purchase-citation
```

---

## 🔑 Authentication

### Required Headers
```http
Content-Type: application/json
X-API-Key: YOUR_SECRET_API_KEY
```

### Get Your API Key
1. Open dashboard: http://localhost:8080
2. Fill in credentials → Save
3. Dashboard shows: `API Key: abc123...`
4. Copy this key for your requests

---

## 📋 Request Format

### Endpoint
```
POST /api/purchase-citation
```

### Request Body
```json
{
  "domain": "mybusiness.com",
  "businessName": "My Business LLC",
  "address": "123 Main St, New York, NY 10001"
}
```

### Required Fields
- **domain** (string) - Business website/domain
- **businessName** (string) - Legal business name
- **address** (string) - Full business address

---

## 📤 Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "orderId": "ORDER-1739097600000",
  "screenshot": "/path/to/screenshot.png",
  "timestamp": "2026-02-09T12:20:00.000Z"
}
```

### Error Response (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "timestamp": "2026-02-09T12:20:00.000Z"
}
```

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "error": "Missing required fields: domain, businessName, address",
  "timestamp": "2026-02-09T12:20:00.000Z"
}
```

---

## 💻 Integration Examples

### JavaScript / Node.js
```javascript
async function purchaseCitation(domain, businessName, address) {
  const response = await fetch('http://localhost:3000/api/purchase-citation', {
    method: 'POST',
    headers: {
      'X-API-Key': 'your_api_key_here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      domain: domain,
      businessName: businessName,
      address: address
    })
  });

  const result = await response.json();

  if (result.success) {
    console.log('✅ Order placed:', result.orderId);
    return result;
  } else {
    console.error('❌ Error:', result.error);
    throw new Error(result.error);
  }
}

// Usage
purchaseCitation(
  'mybusiness.com',
  'My Business LLC',
  '123 Main St, New York, NY 10001'
)
.then(result => {
  // Handle success
  console.log('Order ID:', result.orderId);
})
.catch(error => {
  // Handle error
  console.error('Purchase failed:', error.message);
});
```

### Python
```python
import requests
import json

def purchase_citation(domain, business_name, address):
    url = 'http://localhost:3000/api/purchase-citation'
    headers = {
        'X-API-Key': 'your_api_key_here',
        'Content-Type': 'application/json'
    }
    data = {
        'domain': domain,
        'businessName': business_name,
        'address': address
    }

    response = requests.post(url, headers=headers, json=data)
    result = response.json()

    if result['success']:
        print(f"✅ Order placed: {result['orderId']}")
        return result
    else:
        print(f"❌ Error: {result['error']}")
        raise Exception(result['error'])

# Usage
try:
    result = purchase_citation(
        domain='mybusiness.com',
        business_name='My Business LLC',
        address='123 Main St, New York, NY 10001'
    )
    print(f"Order ID: {result['orderId']}")
except Exception as e:
    print(f"Purchase failed: {str(e)}")
```

### PHP
```php
<?php
function purchaseCitation($domain, $businessName, $address) {
    $url = 'http://localhost:3000/api/purchase-citation';
    $headers = [
        'X-API-Key: your_api_key_here',
        'Content-Type: application/json'
    ];
    $data = [
        'domain' => $domain,
        'businessName' => $businessName,
        'address' => $address
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $result = json_decode($response, true);
    curl_close($ch);

    if ($result['success']) {
        echo "✅ Order placed: " . $result['orderId'] . "\n";
        return $result;
    } else {
        echo "❌ Error: " . $result['error'] . "\n";
        throw new Exception($result['error']);
    }
}

// Usage
try {
    $result = purchaseCitation(
        'mybusiness.com',
        'My Business LLC',
        '123 Main St, New York, NY 10001'
    );
    echo "Order ID: " . $result['orderId'] . "\n";
} catch (Exception $e) {
    echo "Purchase failed: " . $e->getMessage() . "\n";
}
?>
```

### cURL
```bash
curl -X POST http://localhost:3000/api/purchase-citation \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "mybusiness.com",
    "businessName": "My Business LLC",
    "address": "123 Main St, New York, NY 10001"
  }'
```

---

## 🌐 Making It Accessible from Web

### Option 1: Cloudflare Tunnel (Recommended)

You already have Cloudflare tunnel running! Just expose the API:

```bash
cloudflare tunnel --url http://localhost:3000
```

This gives you a public URL like:
```
https://jesse-prescribed-projects-yellow.trycloudflare.com
```

**Your web app can then call:**
```javascript
fetch('https://jesse-prescribed-projects-yellow.trycloudflare.com/api/purchase-citation', {
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

### Option 2: ngrok

```bash
ngrok http 3000
```

Gives you: `https://abc123.ngrok.io`

### Option 3: Local Only (Development)

For local development:
```javascript
fetch('http://localhost:3000/api/purchase-citation', {
  // ...
})
```

---

## 🔒 Security Best Practices

### 1. Never Expose API Key Publicly
❌ **Bad:**
```javascript
// In frontend code
const apiKey = 'abc123...'; // Visible to everyone!
```

✅ **Good:**
```javascript
// In backend code only
const response = await fetch('http://localhost:3000/api/purchase-citation', {
  headers: {
    'X-API-Key': process.env.LEGIIT_API_KEY // Backend environment variable
  }
});
```

### 2. Use Environment Variables
```env
# In your web app's .env
LEGIIT_API_URL=http://localhost:3000
LEGIIT_API_KEY=your_secret_api_key
```

### 3. Add Rate Limiting
Implement rate limiting on your web app to prevent abuse:
```javascript
// Example: Max 5 requests per minute per user
```

### 4. Validate Input
```javascript
// Validate before sending
if (!domain || !businessName || !address) {
  throw new Error('Missing required fields');
}

// Sanitize input
domain = domain.trim();
businessName = businessName.trim();
address = address.trim();
```

### 5. Add CORS (If Needed)
If calling from different domain, add CORS to the API server:

```javascript
// In src/server.js
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://your-web-app.com');
  res.header('Access-Control-Allow-Headers', 'X-API-Key, Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST');
  next();
});
```

---

## 📊 Complete Web App Integration

### Backend Integration (Recommended)

Your web app backend → Legiit API

```javascript
// In your web app backend
app.post('/api/purchase-citation', async (req, res) => {
  const { domain, businessName, address } = req.body;

  // Validate input
  if (!domain || !businessName || !address) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Call Legiit API
    const response = await fetch(`${process.env.LEGIIT_API_URL}/api/purchase-citation`, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.LEGIIT_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domain, businessName, address })
    });

    const result = await response.json();

    if (result.success) {
      res.json({
        success: true,
        orderId: result.orderId,
        message: 'Citation purchase successful!'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### Frontend Integration

Your web app frontend → Your backend → Legiit API

```javascript
// In your web app frontend
async function purchaseCitation(domain, businessName, address) {
  const response = await fetch('/api/purchase-citation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      domain,
      businessName,
      address
    })
  });

  const result = await response.json();

  if (result.success) {
    alert(`✅ Order placed! ID: ${result.orderId}`);
  } else {
    alert(`❌ Error: ${result.error}`);
  }
}
```

---

## 🧪 Testing the API

### Using the Dashboard
1. Start the automation server (from dashboard)
2. Open the test form in dashboard
3. Fill in test data
4. Click "Test Purchase"
5. See results instantly

### Using cURL
```bash
curl -X POST http://localhost:3000/api/purchase-citation \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "test.com",
    "businessName": "Test LLC",
    "address": "123 Test St, City, ST 12345"
  }'
```

---

## 📝 API Reference

### POST /api/purchase-citation

**Description:** Purchases a local citation package from Legiit

**Authentication:** Required (X-API-Key header)

**Request Body:**
```json
{
  "domain": "string (required)",
  "businessName": "string (required)",
  "address": "string (required)"
}
```

**Success Response:** 200 OK
```json
{
  "success": true,
  "orderId": "ORDER-1234567890",
  "screenshot": "/path/to/screenshot.png",
  "timestamp": "ISO 8601 datetime"
}
```

**Error Response:** 400 Bad Request / 500 Internal Server Error
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "ISO 8601 datetime"
}
```

---

## ✅ Integration Checklist

**Setup:**
- [ ] Start the automation server (double-click `start.command` or `start.bat`)
- [ ] Copy your API key from dashboard
- [ ] Set up Cloudflare tunnel (for web access)

**Integration:**
- [ ] Add API endpoint to your backend
- [ ] Store API key in environment variables
- [ ] Implement error handling
- [ ] Add input validation
- [ ] Test with sample data

**Security:**
- [ ] Never expose API key in frontend code
- [ ] Use HTTPS in production
- [ ] Add rate limiting
- [ ] Validate and sanitize input

---

## 🎯 Quick Start

1. **Start API server:** Double-click `start.command` (Mac) or `start.bat` (Windows)
2. **Get API key:** Dashboard shows it automatically
3. **Set up tunnel:** `cloudflare tunnel --url http://localhost:3000`
4. **Integrate:** Use code examples above
5. **Test:** Use dashboard test form

---

## 📞 Need Help?

- Dashboard: http://localhost:8080
- API: http://localhost:3000
- Check dashboard for live status
- See `logs/` folder for screenshots

---

**Ready for integration!** 🚀

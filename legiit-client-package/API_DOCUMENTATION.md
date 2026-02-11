# Legiit Automation API - Complete Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the API uses environment-based authentication. Your Legiit credentials should be configured in the `.env` file on the server side.

**Future Enhancement:** Implement API key or OAuth-based authentication for multi-tenant scenarios.

---

## Endpoints

### 1. Health Check

Check if the API server is running.

**Endpoint:** `GET /health`

**Request:**
```http
GET /health HTTP/1.1
Host: localhost:3000
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "Legiit Automation API",
  "version": "1.0.0"
}
```

**cURL Example:**
```bash
curl http://localhost:3000/health
```

---

### 2. API Documentation

Get information about available endpoints.

**Endpoint:** `GET /`

**Request:**
```http
GET / HTTP/1.1
Host: localhost:3000
```

**Response (200 OK):**
```json
{
  "name": "Legiit Automation API",
  "version": "1.0.0",
  "description": "Automated purchasing of Legiit services via Puppeteer",
  "endpoints": {
    "GET /health": "Health check",
    "GET /": "API documentation",
    "POST /api/purchase": "Purchase a Legiit service",
    "POST /api/purchase/standard": "Quick purchase with Standard package"
  }
}
```

---

### 3. Purchase Service (Full)

Complete purchase endpoint with maximum flexibility.

**Endpoint:** `POST /api/purchase`

**Content-Type:** `application/json`

#### Request Body Schema

```typescript
interface PurchaseRequest {
  serviceUrl?: string;           // Optional: Custom service URL
  package?: string;              // Optional: Package name (default: "Standard")
  details: {
    domain: string;              // Required: Business domain/website
    businessName: string;        // Required: Business name
    address: string;             // Required: Business address
  };
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `serviceUrl` | string | No | Custom Legiit service URL. Defaults to the local citations service |
| `package` | string | No | Package tier to purchase (e.g., "Standard", "Premium") |
| `details.domain` | string | **Yes** | Business domain or website URL |
| `details.businessName` | string | **Yes** | Official business name |
| `details.address` | string | **Yes** | Full business address |

#### Request Examples

**Minimal Request:**
```json
{
  "details": {
    "domain": "example.com",
    "businessName": "Example Business LLC",
    "address": "123 Main St, City, State 12345"
  }
}
```

**Full Request:**
```json
{
  "serviceUrl": "https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072",
  "package": "Standard",
  "details": {
    "domain": "example.com",
    "businessName": "Example Business LLC",
    "address": "123 Main St, City, State 12345"
  }
}
```

#### Response Schema

**Success Response (200 OK):**
```json
{
  "success": true,
  "steps": [
    "Browser initialized",
    "Logged in",
    "Navigated to service",
    "Selected Standard package",
    "Filled business details",
    "Purchase completed"
  ],
  "orderId": "ORD123456",
  "requestId": "lw1j2v3k"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Missing required fields in details: domain, businessName, address",
  "requestId": "lw1j2v3k"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Login failed - check credentials",
  "steps": [
    "Browser initialized"
  ],
  "requestId": "lw1j2v3k"
}
```

#### cURL Examples

**Basic Purchase:**
```bash
curl -X POST http://localhost:3000/api/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "details": {
      "domain": "mybusiness.com",
      "businessName": "My Business LLC",
      "address": "123 Main St, City, State 12345"
    }
  }'
```

**With Custom Service URL:**
```bash
curl -X POST http://localhost:3000/api/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "serviceUrl": "https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072",
    "package": "Standard",
    "details": {
      "domain": "mybusiness.com",
      "businessName": "My Business LLC",
      "address": "123 Main St, City, State 12345"
    }
  }'
```

---

### 4. Quick Purchase (Standard Package)

Simplified endpoint for Standard package purchases.

**Endpoint:** `POST /api/purchase/standard`

**Content-Type:** `application/json`

#### Request Body Schema

```typescript
interface QuickPurchaseRequest {
  domain: string;           // Required: Business domain/website
  businessName: string;     // Required: Business name
  address: string;          // Required: Business address
  serviceUrl?: string;      // Optional: Custom service URL
}
```

#### Request Example

```json
{
  "domain": "example.com",
  "businessName": "Example Business LLC",
  "address": "123 Main St, City, State 12345"
}
```

#### Response

Same response format as `/api/purchase` endpoint.

#### cURL Example

```bash
curl -X POST http://localhost:3000/api/purchase/standard \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "mybusiness.com",
    "businessName": "My Business LLC",
    "address": "123 Main St, City, State 12345"
  }'
```

---

## Integration Examples

### Node.js / JavaScript

```javascript
const fetch = require('node-fetch');

async function purchaseService(details) {
  const response = await fetch('http://localhost:3000/api/purchase/standard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(details)
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Purchase successful!');
    console.log('Order ID:', result.orderId);
  } else {
    console.error('Purchase failed:', result.error);
  }
  
  return result;
}

// Usage
purchaseService({
  domain: 'mybusiness.com',
  businessName: 'My Business LLC',
  address: '123 Main St, City, State 12345'
});
```

### Python

```python
import requests
import json

def purchase_service(domain, business_name, address):
    url = 'http://localhost:3000/api/purchase/standard'
    headers = {'Content-Type': 'application/json'}
    data = {
        'domain': domain,
        'businessName': business_name,
        'address': address
    }
    
    response = requests.post(url, headers=headers, json=data)
    result = response.json()
    
    if result['success']:
        print(f'Purchase successful! Order ID: {result.get("orderId")}')
    else:
        print(f'Purchase failed: {result.get("error")}')
    
    return result

# Usage
purchase_service(
    domain='mybusiness.com',
    business_name='My Business LLC',
    address='123 Main St, City, State 12345'
)
```

### PHP

```php
<?php

function purchaseService($domain, $businessName, $address) {
    $url = 'http://localhost:3000/api/purchase/standard';
    $data = [
        'domain' => $domain,
        'businessName' => $businessName,
        'address' => $address
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $result = json_decode($response, true);
    
    if ($result['success']) {
        echo "Purchase successful! Order ID: " . $result['orderId'] . "\n";
    } else {
        echo "Purchase failed: " . $result['error'] . "\n";
    }
    
    curl_close($ch);
    return $result;
}

// Usage
purchaseService(
    'mybusiness.com',
    'My Business LLC',
    '123 Main St, City, State 12345'
);
?>
```

### Ruby

```ruby
require 'net/http'
require 'json'
require 'uri'

def purchase_service(domain, business_name, address)
  uri = URI.parse('http://localhost:3000/api/purchase/standard')
  header = {'Content-Type': 'application/json'}
  data = {
    domain: domain,
    businessName: business_name,
    address: address
  }
  
  http = Net::HTTP.new(uri.host, uri.port)
  request = Net::HTTP::Post.new(uri.request_uri, header)
  request.body = data.to_json
  
  response = http.request(request)
  result = JSON.parse(response.body)
  
  if result['success']
    puts "Purchase successful! Order ID: #{result['orderId']}"
  else
    puts "Purchase failed: #{result['error']}"
  end
  
  result
end

# Usage
purchase_service(
  'mybusiness.com',
  'My Business LLC',
  '123 Main St, City, State 12345'
)
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request (missing/invalid fields) |
| 404 | Endpoint Not Found |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message description",
  "requestId": "unique-request-id"
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Missing required fields` | Request body incomplete | Include all required fields |
| `Login failed - check credentials` | Invalid Legiit credentials | Verify `.env` file settings |
| `Could not find Standard package button` | Page structure changed | Run with HEADLESS=false to debug |
| `Timeout` | Page load too slow | Increase TIMEOUT in `.env` |

---

## Best Practices

### 1. Input Validation

Always validate input before sending to API:

```javascript
function validateInput(details) {
  const errors = [];
  
  if (!details.domain || details.domain.length < 3) {
    errors.push('Invalid domain');
  }
  
  if (!details.businessName || details.businessName.length < 2) {
    errors.push('Invalid business name');
  }
  
  if (!details.address || details.address.length < 10) {
    errors.push('Invalid address');
  }
  
  return errors.length === 0 ? null : errors;
}
```

### 2. Error Handling

Always handle responses properly:

```javascript
try {
  const response = await fetch('http://localhost:3000/api/purchase/standard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  return result;
  
} catch (error) {
  console.error('API Error:', error);
  // Handle error appropriately
}
```

### 3. Request ID Tracking

Use the `requestId` from responses for support/debugging:

```javascript
const result = await purchaseService(details);
console.log('Request ID:', result.requestId); // Save this for troubleshooting
```

### 4. Timeout Handling

Set appropriate timeouts for your HTTP client:

```javascript
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(details),
  timeout: 120000 // 2 minutes
});
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use:

1. Implement rate limiting on the server side
2. Add exponential backoff for retries
3. Queue purchases if making multiple requests

### Recommended Rate Limits

- **Per IP:** 10 requests per minute
- **Per Account:** 5 purchases per hour
- **Concurrent requests:** Maximum 2

---

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Quick purchase
curl -X POST http://localhost:3000/api/purchase/standard \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "test.com",
    "businessName": "Test Business",
    "address": "123 Test St, Test City, TS 12345"
  }'
```

### Using Postman

1. Import the API endpoint
2. Set method to `POST`
3. Set URL to `http://localhost:3000/api/purchase/standard`
4. Add header: `Content-Type: application/json`
5. Add body (raw JSON):
   ```json
   {
     "domain": "test.com",
     "businessName": "Test Business",
     "address": "123 Test St, Test City, TS 12345"
   }
   ```
6. Send request

---

## Security Considerations

### Current Implementation

- Credentials stored in environment variables
- No authentication between client and server
- Suitable for local/internal use

### Production Recommendations

1. **API Keys**: Implement API key authentication
2. **HTTPS**: Always use HTTPS in production
3. **Input Sanitization**: Sanitize all user inputs
4. **Rate Limiting**: Prevent abuse
5. **Logging**: Log all purchases for audit
6. **Secrets Management**: Use proper secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault)
7. **CORS**: Configure CORS properly for your domain
8. **Validation**: Server-side validation of all inputs

---

## Changelog

### Version 1.0.0 (2024-01-15)

- Initial release
- Core purchase automation
- Express.js API wrapper
- Health check endpoint
- Screenshot debugging support

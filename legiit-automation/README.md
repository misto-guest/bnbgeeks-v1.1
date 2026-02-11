# Legiit Automation API

Automated purchasing of Legiit services using Puppeteer with an Express.js API wrapper.

## 🎯 Features

- ✅ **Web Panel** - Beautiful UI for easy purchases
- ✅ Fully automated Legiit service purchasing
- ✅ Puppeteer-based browser automation
- ✅ RESTful API with Express.js
- ✅ Configurable service selection
- ✅ Wallet balance payment support
- ✅ Detailed logging and error handling
- ✅ Screenshot capture for debugging
- ✅ Health check endpoints

## 📋 Requirements

- Node.js >= 16.x
- npm or yarn
- Legiit account with wallet balance
- Chrome/Chromium (for Puppeteer)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd legiit-automation

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

Add your Legiit credentials:

```env
LEGIIT_EMAIL=your_email@example.com
LEGIIT_PASSWORD=your_password_here
PORT=3000
HEADLESS=true
TIMEOUT=60000
```

### 3. Run Tests (Optional)

```bash
npm test
```

This will verify that:
- Browser initialization works
- Login to Legiit succeeds
- Navigation to service page works
- Package selection functions
- Business details form fills correctly

> ⚠️ **Note:** The test does NOT complete an actual purchase. It verifies all steps up to payment.

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on port 3000 (or the port configured in `.env`).

### 5. Open Web Panel

Visit **http://localhost:3000** in your browser to access the beautiful web panel!

🎨 **The web panel includes:**
- Easy form input for domain, business name, and address
- Real-time progress tracking
- Order confirmation with Order ID
- API documentation built-in
- Mobile-friendly responsive design

Alternatively, use the **Quick Start Script**:

```bash
chmod +x start.sh
./start.sh
```

---

## 🌐 Web Panel vs API

### Use the Web Panel if:
- ✅ You prefer a visual interface
- ✅ You want to make occasional purchases
- ✅ You need to see real-time progress

### Use the API if:
- ✅ You want to integrate into your own systems
- ✅ You need automated bulk purchases
- ✅ You're building custom tools

Both methods use the same backend automation!

---

## 📡 API Usage

### Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "Legiit Automation API",
  "version": "1.0.0"
}
```

### Purchase Service (Full)

**Endpoint:** `POST /api/purchase`

**Request Body:**
```json
{
  "serviceUrl": "https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072",
  "package": "Standard",
  "details": {
    "domain": "mybusiness.com",
    "businessName": "My Business LLC",
    "address": "123 Main Street, City, State 12345"
  }
}
```

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/api/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "serviceUrl": "https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072",
    "package": "Standard",
    "details": {
      "domain": "mybusiness.com",
      "businessName": "My Business LLC",
      "address": "123 Main Street, City, State 12345"
    }
  }'
```

**Example using Node.js:**
```javascript
const response = await fetch('http://localhost:3000/api/purchase', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    serviceUrl: 'https://legiit.com/Toplocalcitations/350-usa-local-citations-listings-and-directories-1679073072',
    package: 'Standard',
    details: {
      domain: 'mybusiness.com',
      businessName: 'My Business LLC',
      address: '123 Main Street, City, State 12345'
    }
  })
});

const result = await response.json();
console.log(result);
```

**Success Response:**
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

### Quick Purchase (Standard Package)

**Endpoint:** `POST /api/purchase/standard`

Simplified endpoint that assumes Standard package and default service URL.

**Request Body:**
```json
{
  "domain": "mybusiness.com",
  "businessName": "My Business LLC",
  "address": "123 Main Street, City, State 12345"
}
```

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/api/purchase/standard \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "mybusiness.com",
    "businessName": "My Business LLC",
    "address": "123 Main Street, City, State 12345"
  }'
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `LEGIIT_EMAIL` | Your Legiit account email | - | ✅ Yes |
| `LEGIIT_PASSWORD` | Your Legiit account password | - | ✅ Yes |
| `PORT` | API server port | 3000 | No |
| `HEADLESS` | Run browser in headless mode | true | No |
| `TIMEOUT` | Page load timeout (ms) | 60000 | No |
| `DEFAULT_SERVICE_URL` | Default service URL | - | No |
| `NODE_ENV` | Environment (development/production) | development | No |

### Headless Mode

- **Production:** Set `HEADLESS=true` (runs without visible browser)
- **Debugging:** Set `HEADLESS=false` (shows browser window for debugging)

## 🐛 Debugging

### Screenshots

The automation automatically captures screenshots:
- `screenshots/before-checkout.png` - Before clicking checkout
- `screenshots/order-confirmation.png` - After successful purchase
- `screenshots/error-state.png` - On error

To enable screenshots, ensure the `screenshots` directory exists:
```bash
mkdir -p screenshots
```

### Logging

The API provides detailed console logging:
- 🚀 Browser initialization
- 🔐 Login attempts
- 📍 Navigation steps
- 📦 Package selection
- 📝 Form filling
- 💳 Purchase completion
- ✅ Success indicators
- ❌ Error messages

### Common Issues

**Issue:** "Login failed - check credentials"
- **Solution:** Verify your Legiit email and password in `.env` file

**Issue:** "Could not find Standard package button"
- **Solution:** The service page structure may have changed. Set `HEADLESS=false` and run test to see the actual page

**Issue:** "Missing required fields"
- **Solution:** Some services require additional fields. Check the screenshots to see what's being asked

**Issue:** Browser times out
- **Solution:** Increase `TIMEOUT` in `.env` file (e.g., `TIMEOUT=120000` for 120 seconds)

## 🏗️ Project Structure

```
legiit-automation/
├── src/
│   ├── legiit-purchaser.js    # Core Puppeteer automation logic
│   ├── server.js               # Express.js API server
│   └── test.js                 # Test suite
├── screenshots/                # Screenshot captures (auto-created)
├── .env                        # Environment configuration (create this)
├── .env.example                # Example environment file
├── package.json                # Node.js dependencies
└── README.md                   # This file
```

## 📝 API Reference

### POST /api/purchase

Full-featured purchase endpoint with all options.

**Request:**
```json
{
  "serviceUrl": "string (optional)",
  "package": "string (optional, default: 'Standard')",
  "details": {
    "domain": "string (required)",
    "businessName": "string (required)",
    "address": "string (required)"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "steps": ["array of completed steps"],
  "orderId": "string",
  "requestId": "string"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "error message",
  "steps": ["array of completed steps before error"],
  "requestId": "string"
}
```

### POST /api/purchase/standard

Simplified purchase endpoint for Standard package.

**Request:**
```json
{
  "domain": "string (required)",
  "businessName": "string (required)",
  "address": "string (required)",
  "serviceUrl": "string (optional)"
}
```

Same response format as `/api/purchase`.

## 🔒 Security Considerations

1. **Never commit `.env` file** - Contains sensitive credentials
2. **Use environment variables** - Keep secrets out of code
3. **Monitor wallet balance** - Ensure sufficient funds before purchases
4. **Rate limiting** - Implement rate limiting for production use
5. **HTTPS only** - Use HTTPS in production (not plain HTTP)
6. **Input validation** - API validates all inputs before processing

## 🚀 Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name legiit-api

# View logs
pm2 logs legiit-api

# Restart
pm2 restart legiit-api

# Stop
pm2 stop legiit-api
```

### Using Docker (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:18-slim

# Install Chrome dependencies
RUN apt-get update && apt-get install -y \
    wget gnupg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy source
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "src/server.js"]
```

Build and run:
```bash
docker build -t legiit-automation .
docker run -p 3000:3000 --env-file .env legiit-automation
```

## 🤝 Support

For issues or questions:
1. Check the debug screenshots
2. Review console logs
3. Verify environment variables
4. Test with `HEADLESS=false` to see the browser

## 📄 License

ISC

## ⚠️ Disclaimer

This automation tool is provided as-is. Ensure you:
- Have sufficient wallet balance
- Understand the service you're purchasing
- Comply with Legiit's Terms of Service
- Test thoroughly before production use

The author is not responsible for any unintended purchases or service charges.

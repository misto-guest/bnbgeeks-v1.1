# Legiit Citation Purchase Automation

Complete Puppeteer automation for purchasing citation services on Legiit.com platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Legiit.com account with wallet balance
- Your gig URL (e.g., https://legiit.com/YourService/YourGig)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set your credentials
cp .env.example .env

# 3. Edit .env file
nano .env
```

### Configuration (.env file)

```bash
LEGIIT_EMAIL=your-email@example.com
LEGIIT_PASSWORD=your-password
LEGIIT_GIG_URL=https://legiit.com/ServiceProvider/Gig-12345
HEADLESS=false
SLOW_MO=100
```

## 📦 Two Versions Available

### Version 1: Class-Based (legiit-purchaser.js)
Full-featured with error handling and validation.

```javascript
const LegiitPurchaser = require('./src/legiit-purchaser');

const purchaser = new LegiitPurchaser({
  email: 'your-email@example.com',
  password: 'your-password',
  gigUrl: 'https://legiit.com/YourGig/12345'
});

const result = await purchaser.purchase({
  domain: 'example.com',
  businessName: 'My Business LLC',
  address: '123 Main St, City, State, ZIP'
});

console.log('Order ID:', result.orderId);
```

### Version 2: Function-Based (legiit-automation.js)
Simple ES6 module for easy integration.

```javascript
import { purchaseCitation } from './src/legiit-automation.js';

const result = await purchaseCitation({
  domain: 'example.com',
  businessName: 'My Business LLC',
  address: '123 Main St, City, State, ZIP'
});

console.log('Order ID:', result.orderId);
```

## 🎯 Usage Examples

### Single Purchase
```bash
node examples/single-purchase.js
```

### Batch Processing
```bash
node examples/batch-purchase.js
```

### API Integration (Express)
```bash
cd api-server
npm install
npm start
# API runs on http://localhost:3000
```

## 🔧 Features

✅ **Automatic Login** - Handles authentication
✅ **Gig Selection** - Navigates to your gig page
✅ **Package Selection** - Standard/Basic/Premium
✅ **Form Filling** - Auto-fills business details
✅ **Wallet Payment** - Uses wallet balance
✅ **Order Extraction** - Retrieves order ID
✅ **Screenshots** - Visual confirmation
✅ **Error Handling** - Robust retry logic
✅ **Human-like Delays** - Avoids detection

## 📝 API Endpoints (If Using Server)

### POST /api/purchase
```json
{
  "domain": "example.com",
  "businessName": "My Business LLC",
  "address": "123 Main St, City, State, ZIP",
  "package": "standard"
}
```

### Response
```json
{
  "success": true,
  "orderId": "LG-123456",
  "timestamp": "2026-02-10T19:30:00Z",
  "screenshot": "/screenshots/order-LG-123456.png"
}
```

## 🛠️ Advanced Configuration

### Timeout Settings
```javascript
const purchaser = new LegiitPurchaser({
  timeout: 90000  // 90 seconds
});
```

### Headless Mode
```javascript
const purchaser = new LegiitPurchaser({
  headless: true  // Run without UI
});
```

### Custom Delays
```javascript
const purchaser = new LegiitPurchaser({
  slowMo: 200  // Slower typing/interaction
});
```

## 📊 Output

### Console Output
```
🚀 Initializing browser...
✅ Browser initialized
🔐 Logging into Legiit...
✅ Successfully logged in
🛒 Opening gig page...
✅ Gig page loaded
📦 Selecting Standard package...
✅ Package selected
📝 Filling business details...
✅ Business details submitted
💳 Processing payment...
✅ Order completed: LG-123456
📸 Screenshot saved
```

### Screenshots
Saved to `screenshots/` directory:
- `login-success.png`
- `gig-page.png`
- `order-form.png`
- `confirmation-LG-123456.png`

## 🐛 Troubleshooting

### Issue: "Login failed"
**Solution:** Check credentials in .env file

### Issue: "Package selection failed"
**Solution:** Verify gig URL has correct package options

### Issue: "Payment failed"
**Solution:** Ensure sufficient wallet balance

### Issue: "Browser crash"
**Solution:** Install Chrome/Chromium:
```bash
# On Ubuntu/Debian
sudo apt-get install chromium-browser

# On macOS
brew install --cask chromium

# Or use Puppeteer's bundled Chrome
```

## 🔒 Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to version control
- Use environment variables for production
- Keep credentials secure
- Use read-only file permissions: `chmod 600 .env`

## 📧 Support

For issues or questions:
- Check `TROUBLESHOOTING.md` for detailed solutions
- Review `examples/` directory for usage patterns
- Examine `api-server/` for integration examples

## 📄 License

This automation is provided as-is for client use cases.

---

**Last Updated:** 2026-02-10
**Version:** 1.0.0
**Platform:** Legiit.com

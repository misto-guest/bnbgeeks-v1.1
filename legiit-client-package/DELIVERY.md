# Legiit Citation Automation - Client Delivery Package

## 📦 What's Included

✅ **Complete Source Code** - Both class and function versions
✅ **Documentation** - README, installation guide, examples
✅ **Environment Template** - .env.example for configuration
✅ **Example Scripts** - Single and batch purchase demos
✅ **Ready to Deploy** - No Clawdbot dependencies

---

## 🎯 Quick Start (5 Minutes)

### 1. Extract Package
```bash
unzip legiit-automation-client.zip
cd legiit-automation-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure
```bash
cp .env.example .env
nano .env  # Add your credentials
```

### 4. Test Run
```bash
node examples/single-purchase.js
```

---

## 📁 File Structure

```
legiit-automation-client/
├── README.md                    # Complete documentation
├── INSTALL.md                   # Installation guide
├── DELIVERY.md                  # This file
├── .env.example                 # Configuration template
├── package.json                 # Dependencies
│
├── src/                         # Source code
│   ├── legiit-purchaser.js     # Class-based version
│   └── legiit-automation.js     # Function-based version
│
├── examples/                    # Usage examples
│   ├── single-purchase.js       # Single citation
│   ├── batch-purchase.js        # Multiple citations
│   └── test-connection.js       # Test credentials
│
├── api-server/                  # Express API integration (optional)
│   ├── server.js
│   ├── routes/
│   │   └── purchase.js
│   └── package.json
│
├── results/                     # Output directory (auto-created)
├── screenshots/                 # Screenshots (auto-created)
└── logs/                        # Log files (auto-created)
```

---

## 🔑 Configuration

### Required Variables (.env)

```bash
LEGIIT_EMAIL=your-email@example.com
LEGIIT_PASSWORD=your-password
LEGIIT_GIG_URL=https://legiit.com/ServiceProvider/Gig-12345
```

### Optional Variables

```bash
HEADLESS=false          # Show/hide browser window
SLOW_MO=100            # Delay between actions (ms)
TIMEOUT=60000          # Page load timeout (ms)
DEFAULT_PACKAGE=standard # Package tier
```

---

## 💻 Usage Examples

### Example 1: Single Purchase
```javascript
const LegiitPurchaser = require('./src/legiit-purchaser');

const purchaser = new LegiitPurchaser();

const result = await purchaser.purchase({
  domain: 'example.com',
  businessName: 'Example Business',
  address: '123 Main St'
});

console.log('Order:', result.orderId);
await purchaser.close();
```

### Example 2: Batch Processing
```bash
node examples/batch-purchase.js
```

Processes multiple businesses from an array or CSV file.

### Example 3: API Endpoint
```bash
cd api-server
npm install
npm start
```

Provides REST API:
```
POST /api/purchase
Content-Type: application/json

{
  "domain": "example.com",
  "businessName": "Example Business",
  "address": "123 Main St"
}
```

---

## ✅ Features

- ✅ Automatic login
- ✅ Gig navigation
- ✅ Package selection (Basic/Standard/Premium)
- ✅ Form filling
- ✅ Wallet payment
- ✅ Order ID extraction
- ✅ Screenshot capture
- ✅ Error handling
- ✅ Retry logic
- ✅ Human-like delays
- ✅ Batch processing
- ✅ API integration ready

---

## 🛠️ Integration Options

### Option 1: Standalone Script
```bash
node examples/single-purchase.js
```

### Option 2: Import into Node.js Project
```javascript
const LegiitPurchaser = require('./src/legiit-purchaser');
```

### Option 3: REST API (Express)
```bash
cd api-server && npm start
```

### Option 4: Docker Container
```bash
docker build -t legiit-automation .
docker run -v $(pwd)/results:/app/results legiit-automation
```

---

## 📊 Output & Results

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

### Screenshot Evidence
All purchases include screenshots:
- `login-success.png`
- `gig-page.png`
- `order-form.png`
- `confirmation-LG-123456.png`

### Order Data
```json
{
  "orderId": "LG-123456",
  "timestamp": "2026-02-10T19:30:00Z",
  "domain": "example.com",
  "businessName": "Example Business",
  "package": "standard"
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Login fails | Check credentials in .env |
| Package not found | Verify LEGIIT_GIG_URL is correct |
| Payment fails | Ensure sufficient wallet balance |
| Browser crash | Install Chrome/Chromium |
| Timeout errors | Increase TIMEOUT in .env |

For detailed troubleshooting, see `TROUBLESHOOTING.md`.

---

## 🔒 Security Best Practices

1. ✅ Never commit `.env` file
2. ✅ Use environment variables
3. ✅ Rotate passwords regularly
4. ✅ Use read-only file permissions: `chmod 600 .env`
5. ✅ Separate test/production credentials
6. ✅ Monitor order logs for suspicious activity

---

## 📧 Support & Documentation

- **README.md** - Complete documentation
- **INSTALL.md** - Installation guide
- **Examples/** - Working code samples
- **api-server/** - API integration example

---

## 📋 Requirements

- ✅ Node.js 18 or higher
- ✅ npm or yarn package manager
- ✅ Legiit.com account with wallet balance
- ✅ Valid gig URL
- ✅ Internet connection
- ✅ 512MB RAM minimum
- ✅ 100MB disk space

---

## 🎓 Learning Resources

### Understanding the Code
1. Start with `examples/single-purchase.js`
2. Read source code comments in `src/`
3. Review `README.md` for API details
4. Check `examples/batch-purchase.js` for advanced usage

### Customization Guide
1. **Change delays**: Modify `SLOW_MO` in .env
2. **Add fields**: Edit form selectors in source
3. **Custom validation**: Add checks in purchase method
4. **Different packages**: Modify package selection logic

---

## ✨ What This Automation Does

**Step-by-step:**
1. Opens Legiit.com
2. Logs in with your credentials
3. Navigates to your gig page
4. Selects package tier (Basic/Standard/Premium)
5. Fills in business details (domain, name, address)
6. Confirms purchase
7. Waits for order confirmation
8. Extracts order ID
9. Takes screenshot confirmation
10. Returns result with all details

**What you get:**
- ✅ Completed citation order
- ✅ Order ID for tracking
- ✅ Screenshot evidence
- ✅ Timestamp of purchase
- ✅ Error handling & retry logic

---

## 🚀 Next Steps

1. **Install & Configure** (5 min)
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Test Run** (2 min)
   ```bash
   node examples/single-purchase.js
   ```

3. **Verify Results**
   - Check screenshots/ folder
   - Confirm order in Legiit dashboard
   - Review order ID

4. **Scale Up**
   - Use batch-purchase.js for multiple
   - Set up API server for integration
   - Configure monitoring/logging

---

## 📞 Need Help?

**Common Issues:**
- Installation problems → See `INSTALL.md`
- Configuration → Check `.env.example`
- Usage → Review `examples/`
- Integration → See `api-server/`

---

**Package Version:** 1.0.0  
**Last Updated:** 2026-02-10  
**Platform:** Legiit.com  
**Compatibility:** Node.js 18+

---

## ✨ Ready to Use!

This package is completely standalone and ready for client deployment. No Clawdbot dependencies, no external services required. Just install, configure, and run!

Good luck with your citations! 🚀

# Installation Guide - Legiit Citation Automation

## Step 1: Extract Files

```bash
# Extract the ZIP file
unzip legiit-automation-package.zip
cd legiit-automation-package
```

## Step 2: Install Node.js Dependencies

```bash
npm install
```

**Required packages:**
- puppeteer (^21.0.0)
- dotenv (^16.0.3)

## Step 3: Configuration

### Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
nano .env
```

### Add Your Credentials

```bash
# .env file content
LEGIIT_EMAIL=your-email@example.com
LEGIIT_PASSWORD=your-password
LEGIIT_GIG_URL=https://legiit.com/ServiceProvider/YourGig-12345
HEADLESS=false
SLOW_MO=100
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `LEGIIT_EMAIL` | Your Legiit login email | *Required* |
| `LEGIIT_PASSWORD` | Your Legiit password | *Required* |
| `LEGIIT_GIG_URL` | Your gig page URL | *Required* |
| `HEADLESS` | Run browser invisibly | `false` |
| `SLOW_MO` | Slow down actions (ms) | `100` |

## Step 4: Test Installation

```bash
# Run test script
node examples/test-connection.js
```

**Expected output:**
```
✅ Node.js installed: v18.x.x
✅ Dependencies installed
✅ Environment file found
✅ Configuration valid
✅ Ready to use!
```

## Step 5: First Purchase

### Option A: Command Line
```bash
node examples/single-purchase.js
```

### Option B: Programmatic
```javascript
// Create test-purchase.js
const LegiitPurchaser = require('./src/legiit-purchaser');

async function run() {
  const purchaser = new LegiitPurchaser();
  
  const result = await purchaser.purchase({
    domain: 'test-domain.com',
    businessName: 'Test Business',
    address: '123 Test St'
  });
  
  console.log('Order:', result.orderId);
  await purchaser.close();
}

run();
```

## Step 6: Verify Installation

### Check Screenshot Directory
```bash
ls -la screenshots/
```

Should contain:
- `login-success.png`
- `order-form.png`
- `confirmation-*.png`

### Check Logs
```bash
tail -50 logs/purchases.log
```

## Platform-Specific Notes

### macOS
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Chromium
brew install --cask chromium
```

### Linux (Ubuntu/Debian)
```bash
# Install Chromium
sudo apt-get update
sudo apt-get install -y chromium-browser

# Or Chrome
sudo apt-get install -y google-chrome-stable
```

### Windows
```bash
# Download Puppeteer Windows build
# Or install Chrome from: https://www.google.com/chrome/
```

## Docker Installation (Optional)

```bash
# Build Docker image
docker build -t legiit-automation .

# Run container
docker run -v $(pwd)/screenshots:/app/screenshots legiit-automation
```

## Common Installation Issues

### Issue: "Cannot find module 'puppeteer'"
**Solution:**
```bash
npm install puppeteer
```

### Issue: "Chromium not found"
**Solution:**
```bash
# Reinstall puppeteer with bundled Chrome
npm uninstall puppeteer
npm install puppeteer
npx puppeteer browsers install chrome
```

### Issue: "Permission denied"
**Solution:**
```bash
# Make scripts executable
chmod +x examples/*.js
```

### Issue: ".env file not found"
**Solution:**
```bash
# Ensure .env exists
ls -la .env

# If missing, create from example
cp .env.example .env
```

## Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] .env file created
- [ ] Credentials added to .env
- [ ] Gig URL verified
- [ ] Test purchase successful
- [ ] Screenshots folder created
- [ ] Log files accessible

## Next Steps

1. ✅ Review `README.md` for usage examples
2. ✅ Check `examples/` directory for patterns
3. ✅ Integrate into your project (see `INTEGRATION.md`)
4. ✅ Set up monitoring/logging
5. ✅ Configure error handling

## Getting Help

If installation fails:

1. Check Node.js version: `node --version` (must be 18+)
2. Clear npm cache: `npm cache clean --force`
3. Reinstall: `rm -rf node_modules && npm install`
4. Check permissions: `ls -la` (should show drwxr-xr-x)
5. Review error logs in `logs/` directory

---

**Pro Tip:** Start with `HEADLESS=false` to see the browser window and verify everything works, then switch to `HEADLESS=true` for production.

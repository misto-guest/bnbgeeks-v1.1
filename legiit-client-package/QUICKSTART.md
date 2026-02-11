# Quick Start Guide - Legiit Automation

Get up and running with the Legiit Automation API in 5 minutes!

## 🚀 Setup (2 minutes)

### Step 1: Install Dependencies

```bash
cd legiit-automation
npm install
```

### Step 2: Configure Credentials

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your credentials
nano .env  # or use your preferred editor
```

Add your Legiit credentials:

```env
LEGIIT_EMAIL=your_email@example.com
LEGIIT_PASSWORD=your_password_here
PORT=3000
HEADLESS=true
```

### Step 3: Start the Server

```bash
npm start
```

You should see:

```
╔══════════════════════════════════════════════╗
║   Legiit Automation API Server             ║
╠══════════════════════════════════════════════╣
║   Running on port 3000                       ║
║                                              ║
║   Endpoints:                                 ║
║   → http://localhost:3000/                   ║
║   → http://localhost:3000/health             ║
║   → http://localhost:3000/api/purchase       ║
╚══════════════════════════════════════════════╝
```

## 🧪 Test (1 minute)

In a new terminal, test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "Legiit Automation API",
  "version": "1.0.0"
}
```

## 💻 Make Your First Purchase (2 minutes)

### Using cURL

```bash
curl -X POST http://localhost:3000/api/purchase/standard \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "mybusiness.com",
    "businessName": "My Business LLC",
    "address": "123 Main St, City, State 12345"
  }'
```

### Using Node.js

```bash
# Install node-fetch if needed
npm install node-fetch

# Run the example
node examples/nodejs-example.js
```

### Using Python

```bash
# Install requests if needed
pip install requests

# Run the example
python examples/python-example.py
```

## ✅ Success!

If everything worked, you should see a response like:

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

## 🐛 Troubleshooting

### Problem: "Login failed - check credentials"

**Solution:** Double-check your email and password in `.env` file

### Problem: "ECONNREFUSED" or "Cannot connect"

**Solution:** Make sure the server is running (`npm start`)

### Problem: "Could not find Standard package button"

**Solution:** The page structure might have changed. Try:
1. Set `HEADLESS=false` in `.env`
2. Restart the server
3. Watch the browser to see what's happening

### Problem: Timeout errors

**Solution:** Increase `TIMEOUT` in `.env`:
```env
TIMEOUT=120000  # 2 minutes
```

## 📚 Next Steps

1. **Read the full documentation:** [README.md](README.md)
2. **Check API docs:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. **Run full test suite:** `npm test`
4. **Integrate into your app:** See examples in `examples/` directory

## 🔧 Common Customizations

### Change the Port

Edit `.env`:
```env
PORT=8080
```

### See the Browser (Debug Mode)

Edit `.env`:
```env
HEADLESS=false
```

Now you can watch the automation in action!

### Use a Different Service

Pass a custom `serviceUrl` in your request:

```bash
curl -X POST http://localhost:3000/api/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "serviceUrl": "https://legiit.com/your-service-url",
    "package": "Standard",
    "details": {
      "domain": "mybusiness.com",
      "businessName": "My Business LLC",
      "address": "123 Main St, City, State 12345"
    }
  }'
```

## 💡 Tips

1. **Always test with small purchases first** - Verify the automation works before scaling
2. **Keep your screenshots** - They help debug issues in the `screenshots/` folder
3. **Monitor your wallet** - Make sure you have enough balance before purchasing
4. **Use meaningful business names** - Helps track orders in your Legiit account

## 🆘 Need Help?

1. Check the [README.md](README.md) for detailed documentation
2. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
3. Examine screenshots in `screenshots/` to debug issues
4. Enable debug mode (`HEADLESS=false`) to see what's happening

## 🎉 You're Ready!

You can now:
- ✅ Purchase Legiit services automatically
- ✅ Integrate into your applications
- ✅ Scale your local citation building
- ✅ Automate your SEO workflows

Happy automating! 🚀

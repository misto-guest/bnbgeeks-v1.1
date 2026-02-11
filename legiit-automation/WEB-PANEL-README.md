# 🚀 Legiit Automation - Web Panel

A beautiful web interface for the Legiit citation purchase automation system.

---

## ✨ Features

- 🎨 **Modern, responsive UI** with gradient design
- 📝 **Easy form input** for domain, business name, and address
- ⚡ **Real-time progress tracking** with step-by-step updates
- ✅ **Order confirmation** with Order ID and Request ID
- 🌐 **API documentation** built into the panel
- 📱 **Mobile-friendly** design

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/northsea/clawd-dmitry/legiit-automation
npm install
```

### 2. Configure Credentials

```bash
cp .env.example .env
```

Edit `.env` and add your Legiit credentials:

```env
LEGIIT_EMAIL=your_email@example.com
LEGIIT_PASSWORD=your_password
HEADLESS=true
TIMEOUT=60000
PORT=3000
```

### 3. Start the Server

```bash
npm start
```

The web panel will be available at: **http://localhost:3000**

---

## 📸 Using the Web Panel

### Step 1: Open the Panel

Visit `http://localhost:3000` in your browser.

### Step 2: Fill in the Form

- **Domain**: Enter your business domain (e.g., `mybusiness.com`)
- **Business Name**: Official business name (e.g., `My Business LLC`)
- **Address**: Full business address (e.g., `123 Main St, City, State 12345`)
- **Package**: Select Standard, Premium, or Basic

### Step 3: Purchase

Click the **"Purchase Citations"** button and watch the progress in real-time!

### Step 4: Get Results

Once complete, you'll see:
- ✅ Order ID
- ✅ Request ID
- ✅ Success confirmation

---

## 🔌 API Usage

You can still use the API directly with cURL, Postman, or any HTTP client.

### Health Check

```bash
curl http://localhost:3000/health
```

### Quick Purchase (Standard Package)

```bash
curl -X POST http://localhost:3000/api/purchase/standard \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "mybusiness.com",
    "businessName": "My Business LLC",
    "address": "123 Main St, City, State 12345"
  }'
```

### Custom Purchase

```bash
curl -X POST http://localhost:3000/api/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "serviceUrl": "https://legiit.com/...",
    "package": "Premium",
    "details": {
      "domain": "mybusiness.com",
      "businessName": "My Business LLC",
      "address": "123 Main St, City, State 12345"
    }
  }'
```

---

## 🌍 Deployment Options

### Option 1: Local Development

Run it locally on your machine:

```bash
npm install
npm start
```

Access at: `http://localhost:3000`

---

### Option 2: Deploy to Vercel

1. **Install Vercel CLI**

```bash
npm i -g vercel
vercel login
```

2. **Deploy**

```bash
cd /Users/northsea/clawd-dmitry/legiit-automation
vercel
```

3. **Set Environment Variables in Vercel Dashboard**

- Go to: `https://vercel.com/dashboard`
- Select your project
- Settings → Environment Variables
- Add:
  - `LEGIIT_EMAIL`
  - `LEGIIT_PASSWORD`
  - `HEADLESS` = `true`
  - `TIMEOUT` = `60000`
  - `PORT` = `3000`

---

### Option 3: Deploy to Railway

1. **Install Railway CLI**

```bash
npm i -g @railway/cli
railway login
```

2. **Initialize and Deploy**

```bash
cd /Users/northsea/clawd-dmitry/legiit-automation
railway init
railway up
```

3. **Add Environment Variables**

```bash
railway variables set LEGIIT_EMAIL=your_email@example.com
railway variables set LEGIIT_PASSWORD=your_password
railway variables set HEADLESS=true
railway variables set TIMEOUT=60000
```

---

### Option 4: Deploy to Render

1. **Create `render.yaml`** (already included)

2. **Connect GitHub Repo to Render**

- Go to: https://render.com
- Click "New +" → "Web Service"
- Connect your GitHub repo
- Add environment variables:
  - `LEGIIT_EMAIL`
  - `LEGIIT_PASSWORD`
  - `HEADLESS` = `true`
  - `TIMEOUT` = `60000`

3. **Deploy**

Click "Create Web Service" and Render will deploy automatically.

---

## 🔒 Security Notes

⚠️ **IMPORTANT**: This automation requires your Legiit credentials.

- **NEVER** commit your `.env` file to Git
- **NEVER** share your credentials with anyone
- **USE** environment variables for deployment
- **ROTATE** your password if compromised

---

## 📁 Project Structure

```
legiit-automation/
├── public/                 # Web panel files
│   ├── index.html         # Main web interface
│   ├── style.css          # Styling
│   └── app.js             # Frontend logic
├── src/
│   ├── server.js          # Express API server
│   ├── legiit-purchaser.js # Puppeteer automation
│   └── test.js            # Test suite
├── .env                   # Your credentials (NEVER commit)
├── .env.example           # Example template
├── package.json           # Dependencies
└── README.md              # This file
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to automation service"

**Solution:** Make sure the server is running:
```bash
npm start
```

### Issue: "Missing required fields"

**Solution:** Fill in all form fields: domain, business name, and address.

### Issue: Purchase fails

**Solution:** Check your `.env` file has correct Legiit credentials.

### Issue: Browser timeout

**Solution:** Increase `TIMEOUT` in `.env`:
```env
TIMEOUT=120000  # 2 minutes
```

---

## 📞 Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify your `.env` configuration
3. Test the health endpoint: `curl http://localhost:3000/health`
4. Run the test suite: `npm test`

---

## ✅ What's Included

- ✅ **Web panel** with modern UI
- ✅ **Express.js API** with multiple endpoints
- ✅ **Puppeteer automation** for Legiit
- ✅ **Deployment guides** for Vercel, Railway, Render
- ✅ **API documentation** and examples
- ✅ **Test suite** for validation

---

**Made with ❤️ using Express.js, Puppeteer, and modern CSS**

Ready to automate your Legiit purchases! 🚀

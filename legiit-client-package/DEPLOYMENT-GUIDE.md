# 🌐 Deploy Legiit Automation Web Panel

Complete guide to deploy your Legiit automation web panel to production.

---

## 🎯 Deployment Options

Choose the deployment method that works best for you:

1. **Vercel** - Easiest, free tier available ⭐
2. **Railway** - Simple, great for Node.js apps
3. **Render** - Free tier, easy deployment
4. **Your own server** - Full control

---

## Option 1: Vercel (Recommended) ⭐

### Why Vercel?
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Zero-config deployment
- ✅ Fast global CDN

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd /Users/northsea/clawd-dmitry/legiit-automation
vercel
```

Follow the prompts:
- **Set up and deploy?** → **Y**es
- **Which scope?** → Select your account
- **Link to existing project?** → **N**o
- **Project name** → `legiit-automation` (or any name)
- **Directory** → `./` (current directory)
- **Override settings?** → **N**o

### Step 4: Set Environment Variables

Go to Vercel dashboard:
1. Visit: https://vercel.com/dashboard
2. Select your `legiit-automation` project
3. Go to **Settings** → **Environment Variables**
4. Add the following:

```
LEGIIT_EMAIL = your_email@example.com
LEGIIT_PASSWORD = your_password
HEADLESS = true
TIMEOUT = 60000
PORT = 3000
NODE_ENV = production
```

### Step 5: Redeploy

After adding environment variables, trigger a new deployment:
- Either push a new commit to GitHub
- Or click "Redeploy" in Vercel dashboard

### Your Web Panel URL

Once deployed, your web panel will be at:
```
https://legiit-automation.vercel.app
```

---

## Option 2: Railway

### Why Railway?
- ✅ Free tier ($5 credit/month)
- ✅ Simple deployment
- ✅ Built-in database support
- ✅ Automatic HTTPS

### Step 1: Install Railway CLI

```bash
npm i -g @railway/cli
```

### Step 2: Login

```bash
railway login
```

### Step 3: Initialize Project

```bash
cd /Users/northsea/clawd-dmitry/legiit-automation
railway init
```

### Step 4: Add Environment Variables

```bash
railway variables set LEGIIT_EMAIL=your_email@example.com
railway variables set LEGIIT_PASSWORD=your_password
railway variables set HEADLESS=true
railway variables set TIMEOUT=60000
railway variables set PORT=3000
railway variables set NODE_ENV=production
```

### Step 5: Deploy

```bash
railway up
```

### Your Web Panel URL

Railway will provide a URL like:
```
https://your-project-name.up.railway.app
```

---

## Option 3: Render

### Why Render?
- ✅ Free tier available
- ✅ Simple GitHub integration
- ✅ Automatic HTTPS
- ✅ Databases available

### Step 1: Prepare for Deployment

The `render.yaml` file is already included in your project.

### Step 2: Connect GitHub

1. Go to: https://render.com
2. Sign up / Login
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub account
5. Select the `legiit-automation` repository

### Step 3: Configure

- **Name**: `legiit-automation`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Add Environment Variables

In the "Environment" section, add:

```
NODE_ENV = production
PORT = 3000
HEADLESS = true
TIMEOUT = 60000
LEGIIT_EMAIL = your_email@example.com
LEGIIT_PASSWORD = your_password
```

### Step 5: Deploy

Click **"Create Web Service"**

### Your Web Panel URL

Render will provide a URL like:
```
https://legiit-automation.onrender.com
```

---

## Option 4: Your Own Server (VPS)

### Prerequisites
- Server with Node.js installed
- Domain name (optional)
- Basic terminal knowledge

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd legiit-automation
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
cp .env.example .env
nano .env  # or use your preferred editor
```

Add your credentials:
```
LEGIIT_EMAIL=your_email@example.com
LEGIIT_PASSWORD=your_password
HEADLESS=true
TIMEOUT=60000
PORT=3000
NODE_ENV=production
```

### Step 4: Start with PM2 (Recommended)

```bash
# Install PM2
npm i -g pm2

# Start app
pm2 start src/server.js --name legiit-automation

# Save PM2 config
pm2 save

# Setup startup script
pm2 startup
```

### Step 5: Setup Reverse Proxy (Nginx)

If you have a domain, setup Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 6: SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
✅ **DO:** Use environment variables for credentials
❌ **DON'T:** Hardcode credentials in source code

### 2. Gitignore
✅ **DO:** Keep `.env` in `.gitignore`
❌ **DON'T:** Commit `.env` to repository

### 3. Secrets Management
✅ **DO:** Rotate passwords regularly
❌ **DON'T:** Share credentials with anyone

### 4. Access Control
✅ **DO:** Add authentication if needed
❌ **DON'T:** Leave public API unprotected

---

## 🧪 Testing Your Deployment

### 1. Health Check

```bash
curl https://your-deployment-url.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "service": "Legiit Automation API",
  "version": "1.0.0"
}
```

### 2. Test Web Panel

Visit your deployment URL in a browser:
```
https://your-deployment-url.com
```

You should see the web panel with a green "API Online" status.

### 3. Test Purchase

Fill out the form and submit a test purchase (make sure you have sufficient Legiit wallet balance).

---

## 📊 Monitoring

### Vercel
- Dashboard: https://vercel.com/dashboard
- Real-time logs, deployment status, analytics

### Railway
- Dashboard: https://railway.app/dashboard
- Logs, metrics, deployment status

### Render
- Dashboard: https://render.com/dashboard
- Logs, deployment status, alerts

### PM2 (VPS)
```bash
pm2 logs legiit-automation
pm2 monit
```

---

## 🐛 Common Issues

### Issue: "Cannot read property of undefined"

**Cause:** Environment variables not set
**Solution:** Add all required environment variables in platform dashboard

### Issue: "Timeout waiting for selector"

**Cause:** Slow internet or Legiit servers
**Solution:** Increase `TIMEOUT` environment variable to `120000` (2 minutes)

### Issue: "ECONNREFUSED"

**Cause:** Server not running or wrong port
**Solution:** Check PORT is set to `3000` and server is running

---

## ✅ Deployment Checklist

Before going live:

- [ ] `.env` file configured with credentials
- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables set in platform dashboard
- [ ] Health check endpoint returns `{"status": "ok"}`
- [ ] Web panel loads in browser
- [ ] Test purchase successful
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring/alerts setup (optional)

---

## 🎉 You're Live!

Your Legiit Automation web panel is now deployed and ready to use!

**Access it at:** Your deployment URL

**Need help?** Check the logs in your platform dashboard or run `pm2 logs` if using PM2.

---

**Made with ❤️ for automated citation purchasing**

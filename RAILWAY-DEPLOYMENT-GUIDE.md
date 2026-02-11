# Railway Deployment Guide: Bol.com Outreach Tool

**Project:** misto-guest/bol-outreach  
**Project Location:** `/Users/northsea/clawd-dmitry/bol-outreach`  
**App Type:** Express + Puppeteer + SQLite

---

## ✅ Pre-Deployment Verification

The project is **ready for Railway deployment**! 

✓ `railway.json` configuration file exists  
✓ Healthcheck path configured: `/api/health`  
✓ Restart policy on failure (max 10 retries)  
✓ Nixpacks builder configured  
✓ Production-ready structure

---

## 🚀 Step-by-Step Deployment Guide

### **Step 1: Visit Railway**

**Exact URL to visit:**  
```
https://railway.app/new
```

Or go to `https://railway.app` and click **"New Project"** → **"Deploy from GitHub repo"**

---

### **Step 2: Connect GitHub Repository**

1. **Authorize Railway** (if not already authorized)
   - Click "Connect GitHub Account"
   - Authorize Railway to access your repositories
   - Select **misto-guest/bol-outreach** from the list
   - If the repo doesn't appear, search for it in the search bar

2. **Select the repository**
   - Click on **bol-outreach** to select it
   - Railway will detect the `railway.json` configuration automatically

3. **Configure deployment settings**
   - **Root Directory:** Leave as `/` (root of repository)
   - **Builder:** Nixpacks (auto-detected from railway.json)
   - **Branch:** `main` (or `master`, depending on your default branch)

4. **Click "Deploy"** to start the initial deployment

---

### **Step 3: Configure Environment Variables**

After creating the project, you'll need to add environment variables.

**Navigate to:**  
`Settings` → `Variables`

#### **Required Environment Variables**

Click **"New Variable"** for each of these:

| Variable Name | Exact Value | Notes |
|--------------|-------------|-------|
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `3000` | Default port (Railway will override with PORT env var) |
| `DATABASE_PATH` | `/data/bol-outreach.db` | **IMPORTANT:** Use /data path for persistent volume |

#### **Optional Environment Variables**

Only add these if you need these features:

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `ADPOWER_API_ENDPOINT` | `http://127.0.0.1:50325` | AdsPower API (if using multi-profile) |
| `ADPOWER_API_KEY` | `your_api_key_here` | Your AdsPower API key |
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP server for notifications |
| `EMAIL_PORT` | `587` | SMTP port |
| `EMAIL_SECURE` | `false` | TLS/SSL setting |
| `EMAIL_USER` | `your-email@gmail.com` | SMTP username |
| `EMAIL_PASS` | `your-app-password` | SMTP password (use App Password for Gmail) |
| `EMAIL_FROM` | `Bol.com Outreach <noreply@yourdomain.com>` | From email address |
| `SESSION_SECRET` | `<generate-random-string>` | Generate a secure random string |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warn, error) |

---

### **Step 4: Configure Persistent Volume (IMPORTANT!)**

The SQLite database needs persistent storage to survive deployments and restarts.

**Navigate to:**  
`Settings` → `Volumes`

1. **Click "Create Volume"**
2. **Configure the volume:**
   - **Name:** `data` (or any name you prefer)
   - **Mount Path:** `/data` (EXACTLY this - it matches DATABASE_PATH)
   - **Size:** Start with **1 GB** (you can resize later if needed)

3. **Click "Create Volume"**

**Why this matters:** Without the persistent volume, your database would be lost every time Railway redeploys or restarts your app.

---

### **Step 5: Verify Deployment**

Railway will automatically build and deploy your app. Here's how to check the status:

#### **Check Build Logs**

1. Navigate to the **Deployments** tab
2. Click on the latest deployment
3. View the build log to ensure:
   - ✓ Dependencies installed successfully (`npm install`)
   - ✓ No build errors
   - ✓ Build completed successfully

#### **Check Deployment Status**

Look for the green checkmark ✓ indicating:
- ✓ Build successful
- ✓ Service is running
- ✓ Healthcheck passed

---

### **Step 6: Find Your Production URL**

**Navigate to:**  
`Deployment` → Click on your deployment → Look for the **"Deployments"** section

Or easier:  
Go to the main project view and find the **"Your app is available at"** section

Your production URL will look like:
```
https://your-app-name.up.railway.app
```

**Example:** If your project is named `bol-outreach`, the URL might be:
```
https://bol-outreach.up.railway.app
```

---

## 🔍 Testing Your Deployment

### **1. Check Health Endpoint**

Open in your browser or use curl:
```
https://your-app-name.up.railway.app/api/health
```

**Expected response:** 
```json
{"status":"ok","timestamp":"2025-02-10T..."}
```

### **2. Access the Web Dashboard**

Visit:
```
https://your-app-name.up.railway.app
```

You should see the Bol.com Outreach Platform dashboard.

### **3. Verify Database Persistence**

1. Add some test data (create a template or campaign)
2. Trigger a new deployment (push a small change or use "Redeploy")
3. Check that your data is still there after the redeployment

---

## 📊 Monitoring Your App

**Key places to monitor:**

### **Deployment Logs**
`Deployments` → Select deployment → **View Logs**

### **Real-Time Logs**
Click on the **"Logs"** tab in the project header to see real-time output

### **Metrics**
`Metrics` tab shows:
- CPU usage
- Memory usage
- Network traffic
- Disk I/O

### **Health Status**
The healthcheck at `/api/health` runs automatically with a 300-second timeout

---

## 🔄 Troubleshooting

### **App won't start**

**Check:** 
- Build logs for errors
- Environment variables are set correctly
- Database path is `/data/bol-outreach.db`

### **Database errors**

**Common cause:** Volume not mounted correctly  
**Fix:** Verify the volume mount path is exactly `/data`

### **Healthcheck failing**

**Check:**
- The `/api/health` endpoint exists in your code
- PORT environment variable is set (Railway sets this automatically)
- No errors in the logs

### **Puppeteer issues**

**Note:** Railway's Nixpacks builder typically handles Puppeteer dependencies automatically. If you encounter Chromium issues:

1. Check build logs for Chromium installation
2. Add environment variable if needed:
   ```
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
   ```

---

## 🎛️ Railway Configuration Summary

Your `railway.json` already includes optimal settings:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install",
    "watchPatterns": ["**"]
  },
  "deploy": {
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**What this means:**
- **Builder:** Nixpacks (Railway's smart builder)
- **Healthcheck:** Checks `/api/health` every 300 seconds
- **Restart Policy:** Automatically restarts on failure (up to 10 retries)
- **Watch Patterns:** Watches all files for changes

---

## 📝 Post-Deployment Checklist

- [ ] Railway project created
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Persistent volume created and mounted at `/data`
- [ ] Deployment successful (green checkmark)
- [ ] Healthcheck passing
- [ ] Production URL accessible
- [ ] Dashboard loads correctly
- [ ] Database persistence tested
- [ ] Tested creating a test campaign/template

---

## 🎯 Next Steps

After successful deployment:

1. **Set up a custom domain** (optional)
   - `Settings` → `Domains` → Add your domain
   - Configure DNS records as shown

2. **Set up monitoring**
   - Configure alerting in Railway for failures
   - Check logs regularly

3. **Consider production hardening**
   - Use a strong `SESSION_SECRET`
   - Set up email for notifications
   - Configure backup strategy

4. **Share with users**
   - Share the production URL
   - Provide access credentials (if you add auth)

---

## 🆘 Getting Help

**Railway Documentation:** https://docs.railway.app  
**Railway Discord:** https://discord.gg/railway  
**Project README:** Check `/Users/northsea/clawd-dmitry/bol-outreach/README.md`

---

## ✨ Deployment Complete!

Once you see the green checkmark and can access your production URL, your Bol.com Outreach Platform is live on Railway!

**Access your app at:**  
`https://your-app-name.up.railway.app`

---

**Last Updated:** 2025-02-10  
**Project:** misto-guest/bol-outreach  
**Railway Builder:** Nixpacks  
**Healthcheck:** `/api/health`  
**Volume Mount:** `/data`

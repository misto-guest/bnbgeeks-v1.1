# ☁️ Cloud Deployment Guide - SEO Query Manager

## 📋 Quick Overview

The SEO Query Manager is ready for cloud deployment. This guide will help you deploy it to **Railway.app** (recommended) or **Render.com**.

### Why Railway.app?
- ✅ **Free tier available** (up to $5/month credit)
- ✅ **No cold starts** (unlike Render)
- ✅ **Easy deployment from subdirectories**
- ✅ **Built-in PostgreSQL** (upgrade from SQLite if needed)
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Simple environment variable management**

---

## 🚀 Option 1: Deploy to Railway.app (RECOMMENDED)

### Prerequisites
- Railway account (free): https://railway.app
- Railway CLI installed (or use web dashboard)
- GitHub repository access

### Method A: Automated Deployment Script

```bash
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager

# Run the deployment script
./deploy-to-railway.sh
```

The script will:
1. Check/install Railway CLI
2. Login to Railway
3. Create a new project
4. Set environment variables
5. Deploy the app
6. Display the public URL

### Method B: Manual Deployment via CLI

```bash
# 1. Install Railway CLI (if not installed)
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Navigate to query-manager directory
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager

# 4. Initialize Railway project
railway init

# 5. Link to your GitHub repository
railway link

# 6. Set environment variables
railway variables set SERPER_API_KEY=your_actual_api_key_here
railway variables set SECRET_KEY=$(openssl rand -hex 32)
railway variables set API_KEY=seo-query-manager-key
railway variables set PYTHON_VERSION=3.9.0
railway variables set PORT=5001

# 7. Deploy!
railway up

# 8. Get your deployment URL
railway domains
```

### Method C: Manual Deployment via Web Dashboard

1. Go to https://railway.app and click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `misto-guest/bnbgeeks-v1.1` (or the correct repo)
4. **Important:** Set the root directory to `seo-backlinks-search/query-manager`
5. Railway will detect it's a Python app
6. Add environment variables in the "Variables" tab:
   ```
   SERPER_API_KEY=your_actual_api_key_here
   SECRET_KEY=your_random_secret_key
   API_KEY=seo-query-manager-key
   PYTHON_VERSION=3.9.0
   PORT=5001
   ```
7. Click "Deploy"
8. Wait for deployment (usually 1-2 minutes)
9. Click on your project and get the public URL

---

## 🎨 Option 2: Deploy to Render.com

### Prerequisites
- Render account (free): https://render.com
- GitHub repository

### Deployment Steps

1. **Push deployment files to GitHub:**
   ```bash
   cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager
   git add render.yaml Procfile .python-version railway.json
   git commit -m "Add cloud deployment configs"
   git push origin main
   ```

2. **Go to Render.com:**
   - Sign up/login at https://dashboard.render.com
   - Click "New +" → "Web Service"

3. **Connect GitHub:**
   - Connect your GitHub account
   - Select the repository (bnbgeeks-v1.1 or correct repo)
   - **Root Directory:** Set to `seo-backlinks-search/query-manager`

4. **Configure Service:**
   - **Name:** seo-query-manager
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT --workers 4`

5. **Environment Variables:**
   ```
   SERPER_API_KEY = your_actual_api_key_here
   SECRET_KEY = your_random_secret_key
   API_KEY = seo-query-manager-key
   PYTHON_VERSION = 3.9.0
   PORT = 5001
   ```

6. **Deploy:**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Render will provide a URL like: `https://seo-query-manager.onrender.com`

7. **Get Your URL:**
   - Click on your service in Render dashboard
   - Your public URL is at the top

---

## ✅ Verify Deployment

After deployment, test your app:

### 1. Check Health Status
```bash
curl https://your-app-url.railway.app/api/status
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "queries": 0
}
```

### 2. Test Authentication
```bash
curl -H "X-API-Key: seo-query-manager-key" \
     https://your-app-url.railway.app/api/queries
```

### 3. Access Web Interface
Open in browser: `https://your-app-url.railway.app`

---

## 🔐 Important Configuration Notes

### SERPER_API_KEY
- **Required** for the search functionality
- Get your API key at: https://serper.dev/api-key
- Free tier: 2,500 searches/month
- Set this in Railway/Render dashboard after deployment

### Database Considerations

**Default:** SQLite (file-based)
- Works for small-scale usage
- Data is lost when app rebuilds (on free tiers)

**Upgrade to PostgreSQL (Recommended for Production):**
- Railway: Click "Add Service" → "PostgreSQL"
- Render: Click "Database" → "PostgreSQL"
- Update `DATABASE_URL` environment variable
- Modify `app.py` to use SQLAlchemy with PostgreSQL

---

## 📊 What You Get After Deployment

### Public URL
- Example: `https://seo-query-manager-production.up.railway.app`
- Or: `https://seo-query-manager.onrender.com`
- **No port forwarding needed!**
- **Automatic HTTPS included!**

### API Access
```bash
# Base URL
API_BASE="https://your-app-url.railway.app/api"

# API Key
API_KEY="seo-query-manager-key"

# Example: Get all queries
curl -H "X-API-Key: $API_KEY" $API_BASE/queries

# Example: Add a query
curl -X POST $API_BASE/queries \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "seo link building services",
    "schedule": "weekly",
    "region": "us",
    "max_pages": 2
  }'
```

### Dashboard URLs
- **Railway:** https://railway.app/project/your-project-id
- **Render:** https://dashboard.render.com/services/your-service-id

---

## 🎉 Success Checklist

After deployment, confirm:
- [ ] Public URL is accessible (HTTPS works)
- [ ] Web interface loads (`/`)
- [ ] API status endpoint returns 200 (`/api/status`)
- [ ] Authentication works (X-API-Key header)
- [ ] Can add queries via API or web interface
- [ ] SERPER_API_KEY is set (search works)
- [ ] Logs show no errors

---

## 🛠️ Troubleshooting

### Issue: "Service not starting"
- Check logs in Railway/Render dashboard
- Verify PORT is set to 5001 (or use $PORT)
- Ensure all dependencies are in requirements.txt

### Issue: "Database errors"
- SQLite file storage may not persist on free tiers
- Consider upgrading to PostgreSQL
- Check file permissions

### Issue: "Search not working"
- Verify SERPER_API_KEY is set correctly
- Check API key has credits remaining
- Test API key at https://serper.dev/playground

### Issue: "CORS errors"
- The app has CORS enabled for all origins
- If issues persist, check network tab in browser
- Ensure API key is being sent in headers

---

## 📞 Support

For issues or questions:
- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs
- Check app logs in your platform dashboard
- Review `DEPLOYMENT.md` for additional info

---

**Status:** 🟢 **Ready for Cloud Deployment**
**Recommended Platform:** 🚂 **Railway.app**
**Estimated Time:** 5-10 minutes
**Cost:** Free (with usage limits)

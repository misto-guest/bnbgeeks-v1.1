# 📋 Deployment Checklist - SEO Query Manager

## ✅ Pre-Deployment Checklist

### Files Created/Modified
- [x] **railway.json** - Railway.app configuration
- [x] **render.yaml** - Render.com configuration
- [x] **Procfile** - Process file for cloud platforms
- [x] **.python-version** - Python version specification
- [x] **deploy-to-railway.sh** - Automated Railway deployment script
- [x] **quick-deploy.sh** - Interactive deployment selector
- [x] **app.py** - Modified (removed sys.path, uses local scraper)
- [x] **scraper.py** - Copied to query-manager directory
- [x] **CLOUD_DEPLOYMENT.md** - Complete deployment guide
- [x] **DEPLOYMENT_README.md** - Quick reference
- [x] **DEPLOYMENT_SUMMARY.md** - This summary

### Pre-Deployment Steps
- [ ] **Get SERPER_API_KEY** from https://serper.dev
- [ ] **Add to Git** (query-manager not in Git yet)
- [ ] **Choose platform** (Railway.app recommended)
- [ ] **Create account** on chosen platform
- [ ] **Install CLI** (optional, but recommended)

### Git Commands to Run First

```bash
cd /Users/northsea/clawd-dmitry/seo-backlinks-search

# Add the query-manager directory
git add seo-backlinks-search/query-manager/

# Commit
git commit -m "Add SEO Query Manager with cloud deployment configs"

# Push to GitHub
git push origin main
```

## 🚀 Deployment Options

### Option 1: Railway.app (Recommended)

**CLI Method:**
```bash
npm install -g @railway/cli
railway login
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager
railway init
railway variables set SERPER_API_KEY=your_api_key_here
railway variables set SECRET_KEY=$(openssl rand -hex 32)
railway variables set API_KEY=seo-query-manager-key
railway up
```

**Web Dashboard Method:**
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose repository
5. Set root directory: `seo-backlinks-search/query-manager`
6. Add environment variables (see below)
7. Click "Deploy"

### Option 2: Render.com

1. Push to GitHub (see Git commands above)
2. Go to https://dashboard.render.com
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Set root directory: `seo-backlinks-search/query-manager`
6. Configure:
   - Name: seo-query-manager
   - Runtime: Python 3
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 4`
7. Add environment variables (see below)
8. Click "Deploy"

### Option 3: Automated Script

```bash
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager

# Interactive script
./quick-deploy.sh
```

## 🔑 Environment Variables

Copy these to your platform dashboard:

```bash
SERPER_API_KEY=your_actual_api_key_here
SECRET_KEY=your_random_secret_key_or_use_d3ab6bdedcf4326e4bbb4bb5c0e36da9b43a6e2e304dcf09e8cdc1e18df11570
API_KEY=seo-query-manager-key
PYTHON_VERSION=3.9.0
PORT=5001
```

**IMPORTANT:** Get SERPER_API_KEY from https://serper.dev (2,500 free searches/month)

## ✅ Post-Deployment Verification

### 1. Check Status
```bash
curl https://your-app-url.up.railway.app/api/status
```

Expected: `{"status": "healthy", "database": "connected", "queries": 0}`

### 2. Test Authentication
```bash
curl https://your-app-url.up.railway.app/api/queries \
  -H "X-API-Key: seo-query-manager-key"
```

Expected: `[]` (empty array, no queries yet)

### 3. Access Web Interface
Visit: `https://your-app-url.up.railway.app/`

### 4. Test Adding a Query
```bash
curl -X POST https://your-app-url.up.railway.app/api/queries \
  -H "X-API-Key: seo-query-manager-key" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "seo link building services",
    "schedule": "weekly",
    "region": "us",
    "max_pages": 2
  }'
```

## 📊 Platform Comparison

| Feature | Railway.app | Render.com |
|---------|-------------|------------|
| Free Tier | ✅ $5/month | ✅ 750h/month |
| Cold Starts | ✅ No cold starts | ❌ 30-50s delay |
| Subdirectory Deploy | ✅ Easy | ✅ Supported |
| Auto HTTPS | ✅ Yes | ✅ Yes |
| Database | ✅ PostgreSQL | ✅ PostgreSQL |
| CLI | ✅ Excellent | ✅ Good |
| **Recommendation** | ✅ **Recommended** | Alternative |

## 🎯 Final URL Example

After deployment, you'll get:

```
Public URL: https://seo-query-manager-production.up.railway.app
API Base:  https://seo-query-manager-production.up.railway.app/api/
Web UI:    https://seo-query-manager-production.up.railway.app/
Dashboard: https://railway.app/project/your-project-id
```

## 📞 Troubleshooting

### Issue: Deployment fails
- Check logs in platform dashboard
- Verify root directory is correct
- Ensure all dependencies are in requirements.txt

### Issue: Search not working
- Verify SERPER_API_KEY is set correctly
- Check API key has credits remaining
- Test at https://serper.dev/playground

### Issue: Database errors
- SQLite may not persist on free tiers
- Consider upgrading to PostgreSQL
- Check file permissions

## 🎉 Success Criteria

After deployment, you should have:

- [x] Public HTTPS URL (no port forwarding!)
- [x] API accessible at `/api/`
- [x] Web interface accessible at `/`
- [x] Authentication working (X-API-Key)
- [x] Can add queries via API or web interface
- [x] Search functionality working (if SERPER_API_KEY set)
- [x] Logs accessible in dashboard

## 📚 Additional Resources

- **CLOUD_DEPLOYMENT.md** - Detailed guide
- **DEPLOYMENT_README.md** - Quick reference
- **DEPLOYMENT_SUMMARY.md** - Complete summary
- **API.md** - API documentation
- **Railway docs:** https://docs.railway.app
- **Render docs:** https://render.com/docs

---

**Status:** ✅ **READY TO DEPLOY**
**Files:** 8 deployment/config files created
**Time:** 5-10 minutes
**Cost:** Free (with usage limits)

**Recommended:** Railway.app 🚂
**Next Step:** Run `./quick-deploy.sh` or deploy manually

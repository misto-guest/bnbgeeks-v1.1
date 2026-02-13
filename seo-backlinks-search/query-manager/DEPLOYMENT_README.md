# SEO Query Manager - Cloud Deployment Files

This directory contains all necessary files for deploying the SEO Query Manager to cloud platforms.

## 📦 Deployment Files

### Railway.app Configuration
- **railway.json** - Railway project configuration
- **deploy-to-railway.sh** - Automated deployment script

### Render.com Configuration
- **render.yaml** - Render service configuration
- **Procfile** - Process file for Render deployment
- **.python-version** - Python version specification

### Documentation
- **CLOUD_DEPLOYMENT.md** - Complete deployment guide

## 🚀 Quick Deploy

### Option 1: Railway.app (Recommended)

```bash
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager

# Run automated deployment
./deploy-to-railway.sh
```

Or manually:

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager
railway init
railway variables set SERPER_API_KEY=your_api_key_here
railway variables set SECRET_KEY=$(openssl rand -hex 32)
railway variables set API_KEY=seo-query-manager-key
railway up
```

### Option 2: Render.com

1. Push deployment files to GitHub
2. Create account at https://render.com
3. Connect repository and set root directory to `seo-backlinks-search/query-manager`
4. Configure environment variables (see CLOUD_DEPLOYMENT.md)

See [CLOUD_DEPLOYMENT.md](CLOUD_DEPLOYMENT.md) for detailed instructions.

## 🔑 Environment Variables

Required for deployment:

```bash
SERPER_API_KEY=your_serper_api_key_here  # Get from serper.dev
SECRET_KEY=your_random_secret_key        # Auto-generated
API_KEY=seo-query-manager-key            # Default API key
PYTHON_VERSION=3.9.0                      # Python version
PORT=5001                                # App port
```

## 📦 Dependencies

All dependencies are in `requirements.txt`:

```
Flask==3.0.0
Flask-CORS==4.0.0
python-dotenv==1.0.0
requests==2.31.0
gunicorn==25.0.3
```

## ✅ What's Included

This package is now **self-contained** for cloud deployment:

- ✅ Flask web application (app.py)
- ✅ Database models (models.py)
- ✅ SEO Scraper (scraper.py) - copied locally
- ✅ Task scheduler (scheduler.py)
- ✅ Static files (HTML, CSS, JS)
- ✅ Database schema (auto-initialized)
- ✅ All Python dependencies
- ✅ Cloud deployment configs

## 🌐 After Deployment

You'll get:

- **Public HTTPS URL** (no port forwarding!)
- **API endpoints** at `/api/`
- **Web interface** at `/`
- **Dashboard** for management

Example: `https://seo-query-manager.up.railway.app`

## 📚 Documentation

- [CLOUD_DEPLOYMENT.md](CLOUD_DEPLOYMENT.md) - Full deployment guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Original deployment documentation
- [API.md](API.md) - API reference
- [README.md](README.md) - Project overview

## 🎯 Status

**Ready for cloud deployment!** ✅

Recommended platform: **Railway.app** (free tier, no cold starts)

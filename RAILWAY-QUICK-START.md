# Railway Quick Start - Complete Clawe Deployment

## Dashboard Link
🔗 **https://railway.com/project/3c382894-562f-444e-ba37-849dbcf25e26**

---

## Step-by-Step Manual Configuration (~5 minutes)

### 1. openclaw
1. Click "openclaw" service
2. Go to **Settings** → **Build**
3. Set:
   - **Root Directory**: `docker/openclaw`
   - **Dockerfile**: `./Dockerfile`
4. Click **Deploy**

### 2. web
1. Click "web" service
2. Go to **Settings** → **Build**
3. Set:
   - **Root Directory**: `docker/web`
   - **Dockerfile**: `./Dockerfile`
4. Click **Deploy**

### 3. watcher
1. Click "watcher" service
2. Go to **Settings** → **Build**
3. Set:
   - **Root Directory**: `docker/watcher`
   - **Dockerfile**: `./Dockerfile`
4. Click **Deploy**

---

## After Deployment

**Production URLs will be:**
- OpenClaw: `https://openclaw-production.up.railway.app`
- Web: `https://web-production.up.railway.app`
- Watcher: `https://watcher-production.up.railway.app`

**Verification:**
- OpenClaw should respond on port 18789
- Web should serve the Next.js app on port 3000
- Watcher should be running with z.ai integration

---

## Environment Variables (Already Configured ✅)

### openclaw
- `ZAI_API_KEY` = 048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv
- `OPENCLAW_PORT` = 18789

### web
- `NEXT_PUBLIC_CONVEX_URL` = https://clawe.convex.cloud
- `OPENCLAW_URL` = http://openclaw:18789
- `PORT` = 3000

### watcher
- `ZAI_API_KEY` = 048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv
- `NEXT_PUBLIC_CONVEX_URL` = https://clawe.convex.cloud
- `OPENCLAW_URL` = http://openclaw:18789

---

## Troubleshooting

### If deployment fails:
1. Check build logs in Railway Dashboard
2. Verify Dockerfile exists in the correct path
3. Check environment variables are set correctly
4. Verify z.ai API key is valid

### Service health checks:
```bash
# Check OpenClaw
curl https://openclaw-production.up.railway.app:18789/health

# Check Web
curl https://web-production.up.railway.app

# Check Watcher logs via Railway Dashboard
```

---

*Pre-configured via Railway API - 2025-02-11*

# Clawe Railway Deployment - Final Status and Instructions

## Current Status (2025-02-11)

### Project Information
- **Project Name**: clawe
- **Project ID**: 3c382894-562f-444e-ba37-849dbcf25e26
- **Dashboard**: https://railway.com/project/3c382894-562f-444e-ba37-849dbcf25e26

### Services Status

| Service | Status | Deployment | Public URL |
|---------|--------|------------|------------|
| openclaw | FAILED | b48a967d | https://openclaw-production-6a46.up.railway.app |
| web | FAILED | 03b6f4c3 | TBD |
| watcher | Not created | - | TBD |

### Environment Variables Configured

#### openclaw
- ✅ NEXT_PUBLIC_CONVEX_URL = https://clawe.convex.cloud
- ✅ OPENCLAW_PORT = 18789
- ✅ ZAI_API_KEY = 048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv

#### web
- ⚠️ Needs configuration
- NEXT_PUBLIC_CONVEX_URL = https://clawe.convex.cloud
- OPENCLAW_URL = http://openclaw:18789
- PORT = 3000

#### watcher
- ⚠️ Service not yet created
- NEXT_PUBLIC_CONVEX_URL = https://clawe.convex.cloud
- OPENCLAW_URL = http://openclaw:18789
- ZAI_API_KEY = 048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv

## Issue Identified

**Deployments are failing** because Railway is auto-detecting the build configuration (Nixpacks) instead of using the Dockerfiles in the `docker/` subdirectories.

Railway cannot find the correct Dockerfile because:
1. Each service needs its **Root Directory** set to the docker subdirectory
2. The **Dockerfile path** needs to be set to `./Dockerfile`

## Solution: Manual Configuration Required

### Step 1: Open Railway Dashboard
```
https://railway.com/project/3c382894-562f-444e-ba37-849dbcf25e26
```

### Step 2: Configure Each Service

#### For openclaw service:
1. Click on "openclaw" service
2. Go to **Settings** tab
3. Under **Root Directory**, enter: `docker/openclaw`
4. Under **Dockerfile**, enter: `./Dockerfile`
5. Click **Save Changes**
6. Go to **Variables** tab and verify:
   - `ZAI_API_KEY` = `048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv`
   - `OPENCLAW_PORT` = `18789`
   - `NEXT_PUBLIC_CONVEX_URL` = `https://clawe.convex.cloud`

#### For web service:
1. Click on "web" service
2. Go to **Settings** tab
3. Under **Root Directory**, enter: `docker/web`
4. Under **Dockerfile**, enter: `./Dockerfile`
5. Click **Save Changes**
6. Go to **Variables** tab and set:
   - `NEXT_PUBLIC_CONVEX_URL` = `https://clawe.convex.cloud`
   - `OPENCLAW_URL` = `http://openclaw:18789`
   - `PORT` = `3000`

#### For watcher service (needs to be created):
1. Click **New Service**
2. Select **Deploy from GitHub repo**
3. Enter the repo name/path
4. Set **Root Directory**: `docker/watcher`
5. Set **Dockerfile**: `./Dockerfile`
6. Go to **Variables** tab and set:
   - `NEXT_PUBLIC_CONVEX_URL` = `https://clawe.convex.cloud`
   - `OPENCLAW_URL` = `http://openclaw:18789`
   - `ZAI_API_KEY` = `048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv`

### Step 3: Trigger Deployments

After configuring each service:
1. Click the **Deploy** button
2. Wait for deployment to complete
3. Check the deployment logs for any errors

## Expected URLs After Deployment

Once all services are successfully deployed:
- **OpenClaw**: https://openclaw-production-6a46.up.railway.app
- **Web**: https://web-[hash].up.railway.app
- **Watcher**: https://watcher-[hash].up.railway.app

## Alternative: Using Railway CLI with Local Configuration

If you want to automate this, create `railway.toml` files in each service directory:

**docker/openclaw/railway.toml**:
```toml
[build]
dockerfile = "Dockerfile"

[service]
name = "openclaw"
```

**docker/web/railway.toml**:
```toml
[build]
dockerfile = "Dockerfile"

[service]
name = "web"
```

**docker/watcher/railway.toml**:
```toml
[build]
dockerfile = "Dockerfile"

[service]
name = "watcher"
```

Then for each service:
```bash
cd docker/openclaw
railway link
railway up
```

## Note

Railway's API does not currently support configuring build settings (Root Directory, Dockerfile path) via API. These settings must be configured via the Railway Dashboard or by deploying from a directory containing a `railway.toml` configuration file.

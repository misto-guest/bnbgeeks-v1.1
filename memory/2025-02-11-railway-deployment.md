# Railway Deployment Attempt - 2025-02-11

## Project: Clawe on Railway

### Mission
Deploy Clawe (openclaw, web, watcher services) to Railway using Railway API.

### What Was Done

1. **Railway API Authentication**
   - Token: 32ba5665-43d2-4a41-9d22-0c70e8a4bdfd
   - Project: clawe (ID: 3c382894-562f-444e-ba37-849dbcf25e26)

2. **Project Access Verified**
   - Successfully accessed Railway project
   - Project URL: https://railway.com/project/3c382894-562f-444e-ba37-849dbcf25e26

3. **Services Created**
   - openclaw: Created, deployment FAILED
   - web: Created, deployment FAILED

4. **Environment Variables Set (openclaw)**
   - ZAI_API_KEY=048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv
   - OPENCLAW_PORT=18789
   - NEXT_PUBLIC_CONVEX_URL=https://clawe.convex.cloud

### Issue Encountered

**Deployments FAILING with: "Error: No start command could be found"**

**Root Cause**: Railway uses Nixpacks auto-detection by default, but the code structure requires:
- Root Directory: docker/openclaw, docker/web, docker/watcher
- Dockerfile: ./Dockerfile

**Limitation Discovered**: Railway's GraphQL API does NOT expose endpoints to configure:
- Root Directory
- Dockerfile path

These settings MUST be configured via Railway Dashboard.

### Solution: Manual Configuration Required

**Railway Dashboard**: https://railway.com/project/3c382894-562f-444e-ba37-849dbcf25e26

#### Configure Each Service:

**openclaw:**
- Settings → Root Directory: `docker/openclaw`
- Dockerfile: `./Dockerfile`
- Variables: (already set ✅)

**web:**
- Settings → Root Directory: `docker/web`
- Dockerfile: `./Dockerfile`
- Variables:
  - NEXT_PUBLIC_CONVEX_URL=https://clawe.convex.cloud
  - OPENCLAW_URL=http://openclaw:18789
  - PORT=3000

**watcher (create new):**
- Add service from GitHub
- Settings → Root Directory: `docker/watcher`
- Dockerfile: `./Dockerfile`
- Variables:
  - NEXT_PUBLIC_CONVEX_URL=https://clawe.convex.cloud
  - OPENCLAW_URL=http://openclaw:18789
  - ZAI_API_KEY=048bff5da3bf4ae09c4be014dcc1161b.0F2qbUTBqyrkSrPv

### Production URLs (Expected After Configuration)

- OpenClaw: https://openclaw-production-6a46.up.railway.app
- Web: https://web-[hash].up.railway.app
- Watcher: https://watcher-[hash].up.railway.app

### Files Created

- railway_final_report.md - Complete deployment report
- railway_deployment_summary.md - Configuration guide
- railway.toml - Example configuration

### Status

⚠️ **INCOMPLETE** - Requires manual configuration via Railway Dashboard to complete deployment.

Railway API successfully created services and set variables, but cannot configure build settings (Root Directory, Dockerfile path). This is a Railway API limitation.

### Next Steps

1. Open Railway Dashboard
2. Configure build settings for each service
3. Trigger deployments
4. Record production URLs

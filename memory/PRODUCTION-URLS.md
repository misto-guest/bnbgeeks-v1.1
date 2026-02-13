# Clawe Production URLs - Railway Deployment

## Project: Clawe on Railway
**Project ID**: 3c382894-562f-444e-ba37-849dbcf25e26
**Dashboard**: https://railway.com/project/3c382894-562f-444e-ba37-849dbcf25e26

---

## Services

### openclaw
- **Service ID**: b6e5e8b3-7920-4a08-a2af-27e163b9f2a1
- **Status**: Configuration required
- **Root Directory**: `docker/openclaw`
- **Dockerfile**: `./Dockerfile`
- **Expected URL**: `https://openclaw-production.up.railway.app` (after deployment)
- **Port**: 18789
- **z.ai Key**: ✅ Configured

### web
- **Service ID**: 1a645bb6-9d21-4163-b9e5-c6923bd1ee09
- **Status**: Configuration required
- **Root Directory**: `docker/web`
- **Dockerfile**: `./Dockerfile`
- **Expected URL**: `https://web-production.up.railway.app` (after deployment)
- **Port**: 3000
- **Convex URL**: ✅ Configured (https://clawe.convex.cloud)
- **OpenClaw URL**: ✅ Configured (http://openclaw:18789)

### watcher
- **Service ID**: 47ad4e8f-a5f1-4693-816a-a4ce2ec669b2
- **Status**: Configuration required
- **Root Directory**: `docker/watcher`
- **Dockerfile**: `./Dockerfile`
- **Expected URL**: `https://watcher-production.up.railway.app` (after deployment)
- **z.ai Key**: ✅ Configured
- **Convex URL**: ✅ Configured (https://clawe.convex.cloud)
- **OpenClaw URL**: ✅ Configured (http://openclaw:18789)

---

## Configuration Status

### ✅ Completed via API
- All 3 services created
- All environment variables set
- Project environment (production) configured

### ⚠️ Manual Steps Required
- Configure build settings (Root Directory, Dockerfile)
- Connect GitHub repository (misto-guest/clawe)
- Trigger deployments

---

## Next Steps to Activate

1. Open Railway Dashboard
2. For each service (openclaw, web, watcher):
   - Settings → Build → Root Directory → Set to `docker/<service-name>`
   - Settings → Build → Dockerfile → Set to `./Dockerfile`
3. Deploy all services
4. Production URLs will be available after successful deployment

---

*Last updated: 2025-02-11 - Automated via Railway API*

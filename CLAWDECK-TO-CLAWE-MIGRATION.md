# ClawDeck to Clawe Migration Guide

**Date:** 2026-02-11
**Mission:** Replace outdated ClawDeck with modern Clawe multi-agent coordination system

## Current Status

### ClawDeck (OLD - To Be Replaced)
- **URL:** https://deputy-airplane-cohen-producer.trycloudflare.com
- **Location:** /Users/northsea/clawdeck
- **Tech:** Rails app with PostgreSQL
- **Status:** Running on port 3000 via Cloudflare tunnel

### Clawe (NEW - To Be Deployed)
- **Repository:** https://github.com/getclawe/clawe
- **Location:** /Users/northsea/clawe (cloned)
- **Tech:** Next.js + Convex + OpenClaw
- **Status:** Dependencies installed, awaiting configuration

## Architecture Comparison

### ClawDeck (Old)
```
Rails App → PostgreSQL → Cloudflare Tunnel → Public URL
```

### Clawe (New)
```
Web Dashboard → Convex Backend → OpenClaw Gateway → AI Agents
     ↓                ↓                  ↓
  Port 3000     Convex Cloud      Railway/Local
     ↓
Cloudflare Tunnel
```

## Deployment Strategy

Since Docker is not available on this system, we'll use **Railway** for deployment:

### Option 1: Railway (RECOMMENDED)
- Deploy OpenClaw gateway to Railway
- Deploy Clawe web dashboard to Railway or Vercel
- Use Convex cloud (free tier) for backend
- Update Cloudflare tunnel to point to Railway

### Option 2: Local with Cloudflare Tunnel
- Install Docker Desktop
- Run Clawe locally on port 3000
- Reuse existing Cloudflare tunnel
- Requires: Docker Desktop installation

## Prerequisites Checklist

- [ ] **Anthropic API Key**
  - Get from: https://console.anthropic.com
  - Required for Claude AI model access
  - Cost: Pay-per-use (trial credits available for new accounts)

- [ ] **Convex Account**
  - Sign up at: https://convex.dev
  - Free tier available
  - OpenClaw projects qualify for up to 1 year free Professional tier

- [ ] **Railway Account** (for Option 1)
  - Sign up at: https://railway.app
  - GitHub integration recommended
  - Free tier available with usage limits

## Setup Steps

### Step 1: Create Convex Project

```bash
cd /Users/northsea/clawe/packages/backend
npx convex dev
```

This will:
1. Prompt you to log in with GitHub
2. Create a new Convex project
3. Generate `CONVEX_URL` and save to `.env.local`
4. Create the `convex/` folder with backend schema

**Keep this terminal open** - it syncs your backend in real-time.

### Step 2: Configure Environment

Create `.env` file in `/Users/northsea/clawe/`:

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-your-key-here
CONVEX_URL=https://your-deployment.convex.cloud
OPENCLAW_TOKEN=your-secure-token-here

# Optional
OPENAI_API_KEY=sk-...  # For image generation
ENVIRONMENT=prod

# For Railway deployment
OPENCLAW_URL=http://openclaw:18789
```

**Generate a secure token:**
```bash
openssl rand -hex 32
```

### Step 3: Deploy to Railway

#### 3a. Deploy OpenClaw Gateway

1. Go to https://railway.app/new
2. Deploy from GitHub repo: `openclaw/openclaw`
3. Configure:
   - Add volume at `/data`
   - Set environment variables:
     ```
     SETUP_PASSWORD=your-password
     PORT=8080
     OPENCLAW_STATE_DIR=/data/.openclaw
     ```
4. Enable public networking on port 8080
5. Note your Railway URL (e.g., `https://openclaw-production.up.railway.app`)

#### 3b. Deploy Clawe Web Dashboard

1. In Railway, create new service from GitHub: `getclawe/clawe`
2. Set environment variables from `.env`
3. Deploy will auto-build (no Dockerfile needed)
4. Note your web URL (e.g., `https://clawe-production.up.railway.app`)

### Step 4: Update Cloudflare Tunnel

Stop current ClawDeck tunnel and start new one for Clawe:

```bash
# Kill existing ClawDeck processes
pkill -f clawdeck
pkill -f "puma.*3000"

# Start new tunnel pointing to Clawe
cloudflared tunnel --url http://localhost:3000
```

**Or for Railway:** Point tunnel to Railway URL:
```bash
cloudflared tunnel --url https://clawe-production.up.railway.app
```

### Step 5: Verify Deployment

1. Access your Clawe dashboard via Cloudflare tunnel URL
2. Check agent status (Clawe, Inky, Pixel, Scout)
3. Test task creation and agent heartbeat
4. Verify notifications work

### Step 6: Stop and Archive ClawDeck

```bash
# Stop all ClawDeck processes
cd /Users/northsea/clawdeck
# If using clawkeeper.sh
pkill -f clawkeeper
pkill -f "puma.*clawdeck"

# Stop PostgreSQL if dedicated
# brew services stop postgresql@14

# Archive old ClawDeck
cd /Users/northsea
tar -czf clawdeck-archive-$(date +%Y%m%d).tar.gz clawdeck/
```

## Post-Deployment

### Update Memory
Document new deployment URL in `/Users/northsea/clawd-dmitry/memory/2026-02-11.md`:

```markdown
## Clawe Deployment - 2026-02-11

**New URL:** https://[your-tunnel].trycloudflare.com
**Railway URLs:**
- OpenClaw: https://openclaw-production.up.railway.app
- Clawe Web: https://clawe-production.up.railway.app

**Status:** ✅ Successfully replaced ClawDeck
```

### Configure Agents
Clawe comes with 4 pre-configured agents:
- 🦞 **Clawe** - Squad Lead (heartbeat every 15 min)
- ✍️ **Inky** - Content Editor (heartbeat every 15 min)
- 🎨 **Pixel** - Designer (heartbeat every 15 min)
- 🔍 **Scout** - SEO (heartbeat every 15 min)

Customize agent workspaces in `docker/openclaw/templates/workspaces/`

## Troubleshooting

### Issue: No Anthropic API Key
**Solution:** Sign up at console.anthropic.com - new accounts get trial credits

### Issue: Convex authentication fails
**Solution:** Run `npx convex login` to re-authenticate with GitHub

### Issue: Railway deployment fails
**Solution:** Check Railway logs, ensure all environment variables are set

### Issue: Cloudflare tunnel disconnects
**Solution:** Use `--loglevel info` for debugging, consider Railway deployment instead

## Rollback Plan

If migration fails:
1. Restore ClawDeck from archive
2. Start ClawDeck on port 3000
3. Reconnect Cloudflare tunnel
4. Document issues and retry later

## Benefits of Clawe over ClawDeck

| Feature | ClawDeck (Old) | Clawe (New) |
|---------|---------------|-------------|
| Multi-Agent | ❌ Single agent | ✅ 4+ coordinated agents |
| Task Management | Basic | ✅ Kanban with subtasks |
| Notifications | Email only | ✅ Real-time + @mentions |
| Collaboration | ❌ | ✅ Shared workspaces |
| Scalability | Limited | ✅ Cloud-native |
| Dashboard | Basic | ✅ Modern web UI |
| Maintenance | Manual | ✅ Auto-updates |

## Next Actions

1. ✅ Clone Clawe repository
2. ✅ Install dependencies
3. ⏳ Get Anthropic API key
4. ⏳ Create Convex project
5. ⏳ Deploy to Railway
6. ⏳ Update Cloudflare tunnel
7. ⏳ Archive ClawDeck
8. ⏳ Document new URL

## Resources

- **Clawe GitHub:** https://github.com/getclawe/clawe
- **Clawe Docs:** https://github.com/getclawe/clawe#readme
- **Convex Docs:** https://docs.convex.dev
- **Railway Docs:** https://docs.railway.app
- **OpenClaw Docs:** https://docs.openclaw.ai

---

**Last Updated:** 2026-02-11 09:30 CET
**Status:** Awaiting API keys and Convex setup

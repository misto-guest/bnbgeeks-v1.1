# ClawDeck Current Status (Pre-Migration)

**Date:** 2026-02-11 09:35 CET
**Status:** Preparing for Clawe migration

## Running Services

### ClawDeck (Rails App)
- **Process ID:** 35642 (puma)
- **Port:** 3000
- **Database:** PostgreSQL (PID: 17488)
- **Directory:** /Users/northsea/clawdeck
- **Status:** RUNNING

### Cloudflare Tunnel
- **Process IDs:** 35672, 19377
- **Target:** http://localhost:3000
- **Public URL:** https://deputy-airplane-cohen-producer.trycloudflare.com
- **Status:** RUNNING

## Dependencies
- **Ruby:** 3.3.0
- **Database:** PostgreSQL (clawdeck_development)
- **Cloudflared:** /opt/homebrew/bin/cloudflared

## Current URL

The current Cloudflare tunnel URL is:
```
https://deputy-airplane-cohen-producer.trycloudflare.com
```

This URL points to the Rails ClawDeck app running on localhost:3000.

## Migration Readiness

### ✅ Completed
1. Clawe repository cloned to /Users/northsea/clawe
2. Dependencies installed via pnpm
3. Migration guide created
4. Current services documented

### ⏳ Requires Action
1. **Anthropic API Key** - Sign up at console.anthropic.com
2. **Convex Project** - Run `npx convex dev` to create
3. **Railway Account** - Sign up at railway.app (optional)
4. **Docker Desktop** - Install if using local deployment (optional)

### 📋 Rollback Plan
If migration fails, restore by:
1. Extract archive: `tar -xzf clawdeck-archive-YYYYMMDD.tar.gz`
2. Start Rails app: `cd clawdeck && bundle exec rails s -p 3000`
3. Start tunnel: `cloudflared tunnel --url http://localhost:3000`

## Commands to Stop ClawDeck (When Ready)

```bash
# Stop Rails server
pkill -f "puma.*clawdeck"

# Stop PostgreSQL (optional, if dedicated)
brew services stop postgresql@14

# Stop cloudflared
pkill -f cloudflared
```

## Files Created During Migration

1. `/Users/northsea/clawd-dmitry/CLAWDECK-TO-CLAWE-MIGRATION.md` - Full migration guide
2. `/Users/northsea/clawd-dmitry/CLAWDECK-CURRENT-STATUS.md` - This file

## Next Steps

1. **Manual Action Required:** Get Anthropic API key
2. **Manual Action Required:** Create Convex project
3. **Decision Point:** Deploy to Railway or install Docker?
4. **Once Decision Made:** Proceed with migration guide

---

**Note:** ClawDeck continues running normally. No services have been stopped yet.

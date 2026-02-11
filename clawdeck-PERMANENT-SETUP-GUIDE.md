# ClawDeck Permanent URL Setup Guide

## Overview

Setting up a permanent Cloudflare named tunnel so your URL never changes.

## What You'll Need

1. **Cloudflare account** (free)
2. **Domain name** - Options:
   - A domain you already own
   - A free subdomain from services like:
     - DuckDNS (free)
     - No-IP (free)
     - Your own domain

## Setup Steps

### Step 1: Login to Cloudflare

I'll start the login process for you:

```bash
cloudflared tunnel login
```

This will:
1. Open your browser
2. Let you login to Cloudflare (create free account if needed)
3. Authorize cloudflared to access your account

**What to do:**
- If you have a Cloudflare account: Login and select your domain
- If you don't: Create a free account, add a domain (or use one you own)

### Step 2: Choose Your Domain

**Option A: You own a domain**
- Use any domain you have
- Example: `clawdeck.yourdomain.com`

**Option B: Get a free subdomain**
Popular free services:
- **DuckDNS**: https://www.duckdns.org
  - Create subdomain like: `yourname.duckdns.org`
  - Free forever, no signup required
- **No-IP**: https://www.noip.com
  - Create subdomain like: `yourname.ddns.net`
  - Free with confirmation email every 30 days

**Recommendation:** DuckDNS (simplest, completely free)

### Step 3: Create Named Tunnel

Once logged in:

```bash
cloudflared tunnel create clawdeck
```

This creates a tunnel named "clawdeck" and gives you a tunnel ID.

### Step 4: Configure Tunnel

Create config file: `~/.cloudflared/config.yml`

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /Users/northsea/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: clawdeck.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

### Step 5: Route DNS

```bash
cloudflared tunnel route dns clawdeck clawdeck.yourdomain.com
```

This tells Cloudflare to send traffic for that domain to your tunnel.

### Step 6: Update ClawKeeper

Modify ClawKeeper to use named tunnel instead of quick tunnel.

---

## Ready to Start?

Let me know:
1. Do you have a domain you want to use?
2. Or should we use a free service like DuckDNS?

Then I'll run the commands for you!

---

**Estimated time:** 10-15 minutes
**Cost:** Free
**Result:** Permanent URL that never changes

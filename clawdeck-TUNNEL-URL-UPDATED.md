# ✅ ClawDeck Tunnel URL Updated

## Issue

You tried to access the old tunnel URL, but Cloudflare quick tunnels change their URL every time they restart. The old URL (jesse-prescribed-projects-yellow.trycloudflare.com) is no longer valid.

## New Public URL

**https://survivors-seen-correct-bullet.trycloudflare.com**

This URL is currently working ✅

## Why This Happens

Cloudflare **quick tunnels** (trycloudflare.com) are temporary by design:
- ✅ Free, no account required
- ✅ Auto-generates random URL
- ❌ URL changes on every restart
- ❌ No uptime guarantee

When ClawKeeper restarts the tunnel (due to crashes, system reboot, or service restart), you get a new URL.

## Current Status

| Service | Status |
|---------|--------|
| Rails Server | ✅ Running (localhost:3000) |
| Cloudflare Tunnel | ✅ Connected |
| New URL | ✅ Working |

## Solutions

### Option 1: Use the New URL (Current)

Just bookmark and use the new URL:
**https://survivors-seen-correct-bullet.trycloudflare.com**

**Note:** It will change again if the tunnel restarts.

### Option 2: Get a Permanent URL (Recommended)

For a stable URL that doesn't change, set up a **named tunnel**:

**Requirements:**
- Free Cloudflare account
- Your own domain name (or subdomain)

**Benefits:**
- ✅ Permanent URL (e.g., clawdeck.yourdomain.com)
- ✅ URL never changes
- ✅ Better reliability
- ✅ Still free

**Setup time:** ~10 minutes

Would you like me to help you set up a permanent named tunnel?

## Quick Reference

**Current URLs:**
- Public: https://survivors-seen-correct-bullet.trycloudflare.com
- Local: http://127.0.0.1:3000
- Network: http://192.168.1.159:3000

**To find the latest URL anytime:**
```bash
tail -20 /tmp/clawdeck-tunnel.log | grep "https://"
```

---

**Updated:** 2026-02-09 14:35 CET

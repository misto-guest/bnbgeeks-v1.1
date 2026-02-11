# 📘 No-IP + Cloudflare Setup Guide

## Overview

We'll set up a free subdomain from No-IP, add it to Cloudflare, then create your permanent tunnel.

## Step 1: Create No-IP Account & Hostname

### A. Create Account

1. Go to: https://www.noip.com/sign-up
2. Fill in:
   - Email address
   - Password
   - Click "Sign Up"

### B. Create Hostname

1. After signing up, you'll be redirected to the Dashboard
2. Click "Hostnames" → "Create Hostname"
3. Fill in:
   - **Hostname:** `clawdeck` (or whatever you want)
   - **Domain:** Choose from the dropdown (e.g., `ddns.net`, `no-ip.com`, etc.)
   - **Full hostname will be:** `clawdeck.ddns.net` (or your choice)
   - **Type:** DNS Host (A)
   - **IP Address:** Can be anything for now (we'll change it later)
   - Leave TTL as default
4. Click "Add Hostname"

### C. Confirm Email

1. Check your email for confirmation from No-IP
2. Click the confirmation link
3. You now have a free subdomain!

---

## Step 2: Add Domain to Cloudflare

### Before Completing Cloudflare Authorization

**Important:** Add your No-IP domain to Cloudflare FIRST, then complete authorization.

1. Go to: https://dash.cloudflare.com/sign-up (create account if needed)
2. After logging in, click "Add a Site"
3. Enter your No-IP hostname (e.g., `clawdeck.ddns.net`)
4. Select the **Free plan**
5. Cloudflare will scan your DNS records
6. For the setup, you'll need to point your domain's nameservers to Cloudflare
   - But since we're using a No-IP subdomain, we'll use **CNAME flattening** instead

**Simplified Approach:**
If Cloudflare asks for nameserver changes, just skip for now. We'll use a different method.

---

## Step 3: Complete Cloudflare Authorization

1. Go back to the authorization page:
   ```
   https://dash.cloudflare.com/argotunnel?aud=&callback=...
   ```
2. Login to your Cloudflare account
3. You should now see your No-IP domain listed
4. Select it and click "Authorize"

The terminal command should complete successfully.

---

## Step 4: Tell Me Your Hostname

Once you've created your No-IP hostname and completed the Cloudflare authorization, tell me:

**Your full hostname:** (e.g., `clawdeck.ddns.net`)

Then I'll:
1. Create the named tunnel
2. Configure it
3. Route the DNS
4. Update ClawKeeper
5. Test everything

---

## Checklist

- [ ] Create No-IP account
- [ ] Create hostname (e.g., clawdeck.ddns.net)
- [ ] Confirm email from No-IP
- [ ] Add domain to Cloudflare (or just login)
- [ ] Complete Cloudflare authorization in browser
- [ ] Tell me your hostname

---

**Questions:**
- No-IP hostname: What do you want to call it?
  - Example: `clawdeck.ddns.net`, `my-clawdeck.no-ip.com`, etc.

**Next:** Complete steps 1-3, then tell me your hostname!

# 🌙 Tonight's Setup Guide - No-IP Port Forwarding

## Quick Reference

**Goal:** Access ClawDeck via your No-IP hostname (e.g., `clawdeck.ddns.net`)

**Time needed:** 10-15 minutes

---

## Step 1: Update No-IP Hostname (2 minutes)

1. Go to: https://www.noip.com
2. Login
3. Click **"Hostnames"** → **"Manage"**
4. Click **"Modify"** next to your hostname
5. Set **IP Address** to: `87.208.4.155`
6. Click **"Save"**

✅ **Done!** Your hostname now points to your home network.

---

## Step 2: Access Your Router (3 minutes)

### Try These URLs in Your Browser:

```
http://192.168.1.1     ← Try first (most common)
http://192.168.0.1
http://10.0.0.1
```

### Login:

**Username:** `admin` (or leave blank)

**Password:** Try these:
- `admin`
- `password`
- `admin123`
- Check the router itself (often printed on label)

**Can't login?** Check the router manual or look for a sticker with default credentials.

---

## Step 3: Configure Port Forwarding (5-10 minutes)

### Find the Menu:

Look for one of these (varies by router):
- **"Port Forwarding"**
- **"NAT"** → **"Port Forwarding"**
- **"Advanced Setup"** → **"Port Forwarding"**
- **"Gaming"** → **"Port Forwarding"**
- **"Virtual Server"**

### Add New Rule:

| Field | Value |
|-------|-------|
| **Service Name** | ClawDeck |
| **External Port** | 80 |
| **Internal Port** | 3000 |
| **Internal IP** | 192.168.1.159 |
| **Protocol** | TCP |
| **Enabled** | ✅ Yes |

**Note:** Some routers split "External Port" and "Internal Port" into separate fields. Others use "Port Range" (start 80, end 80).

---

## Step 4: Test It (1 minute)

### From Your Phone (Turn off WiFi first):

```
http://your-noip-hostname.ddns.net
```

**Replace** `your-noip-hostname.ddns.net` with your actual No-IP hostname.

### From Terminal:

```bash
curl http://your-noip-hostname.ddns.net
```

You should see ClawDeck's HTML page.

---

## Current Status

| Item | Status |
|------|--------|
| No-IP hostname | ⏳ Update with IP: 87.208.4.155 |
| Rails server | ✅ Running (port 3000) |
| Router port forwarding | ⏳ Configure tonight |
| Cloudflare tunnel | ✅ Working (temporary) |

---

## Troubleshooting

### Port Forwarding Not Working?

**1. Check Mac Firewall:**
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /opt/homebrew/opt/ruby@3.3/bin/ruby
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /opt/homebrew/opt/ruby@3.3/bin/ruby
```

**2. Verify Port is Open:**
Go to: https://www.yougetsignal.com/tools/open-ports/
- Enter: `87.208.4.155`
- Port: `80`
- Should show: "Open"

**3. Try Different External Port:**
If your ISP blocks port 80, try port 8080:
- External Port: `8080`
- Access via: `http://your-noip-hostname.ddns.net:8080`

---

## After Tonight's Setup

**Your access URLs:**
- Public (HTTP): `http://your-noip-hostname.ddns.net`
- Local: `http://127.0.0.1:3000`
- Network: `http://192.168.1.159:3000`

**Cloudflare tunnel:** Can be disabled after port forwarding works (saves resources)

---

## Optional: Add HTTPS Later

Once HTTP is working, we can add free SSL using:
- **Caddy** (automatic HTTPS, easy setup)
- **Let's Encrypt** (traditional, requires nginx)

Let me know when you're ready for HTTPS!

---

## Summary Checklist

**Tonight:**
- [ ] Update No-IP IP to 87.208.4.155
- [ ] Login to router
- [ ] Find port forwarding section
- [ ] Add forwarding rule (80 → 3000 → 192.168.1.159)
- [ ] Test from external network (phone off WiFi)
- [ ] Tell me if it works or any issues

---

**Saved for reference:** `/Users/northsea/clawd-dmitry/clawdeck-TONIGHTS-SETUP.md`

**Questions?** Message me if you get stuck on any step!

---

**Good luck tonight! 🚀**

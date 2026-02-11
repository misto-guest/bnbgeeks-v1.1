# No-IP + Port Forwarding Setup Guide

## Overview

We'll configure your router to forward external port 80/3000 to your Mac's port 3000, allowing external access via your No-IP hostname.

## What You'll Need

- No-IP hostname (already created)
- Router admin access
- Your Mac's local IP: 192.168.1.159

---

## Step 1: Access Your Router

### Find Your Router

**Option A: Use default gateway IP**
```bash
route -n get default | grep gateway
```

**Option B: Common router IPs**
Try these in your browser:
- `http://192.168.1.1` (most common)
- `http://192.168.0.1`
- `http://10.0.0.1`
- `http://192.168.2.1`

### Login to Router

**Default credentials** (check your router manual):
- Username: `admin` or blank
- Password: `admin`, `password`, `admin123`, or printed on router

---

## Step 2: Configure Port Forwarding

### Find Port Forwarding Section

Look for one of these menu items:
- "Port Forwarding"
- "NAT" / "NAT Forwarding"
- "Virtual Server"
- "Gaming"
- "Applications"

### Add New Port Forward Rule

**Basic Setup:**
- **Service Name:** `ClawDeck` (or whatever you want)
- **External Port:** `80` (for HTTP) or `3000` (if you want to specify)
- **Internal Port:** `3000`
- **Protocol:** `TCP` (or `TCP/UDP`)
- **Internal IP:** `192.168.1.159`
- **Enable:** Yes/Checked

**Example for common routers:**

**ASUS:**
- WAN → Virtual Server/Port Forwarding
- Port Range: 80 to 80
- Local Port: 3000
- Local IP: 192.168.1.159
- Protocol: TCP

**TP-Link:**
- Forwarding → Virtual Servers
- Service Port: 80
- Internal Port: 3000
- IP Address: 192.168.1.159
- Protocol: TCP

**Netgear:**
- Advanced → Advanced Setup → Port Forwarding/Port Triggering
- Add Custom Service
- External Port: 80
- Internal IP: 192.168.1.159
- Internal Port: 3000

---

## Step 3: Configure No-IP

### Update Your No-IP Hostname

1. Go to: https://www.noip.com
2. Login
3. Click "Hostnames" → "Manage Hostnames"
4. Find your hostname and click "Modify"
5. Set **IP Address** to your public IP:
   - Go to: https://www.noip.com/ip (shows your public IP)
   - Enter that IP in No-IP
6. Click "Save"

### Install No-IP DUC (Dynamic Update Client)

This keeps your hostname pointing to your IP if it changes.

**For macOS:**
1. Download: https://www.noip.com/download?page=mac
2. Install and run No-IP DUC
3. Login with your No-IP account
4. Select your hostname
5. Start the service

---

## Step 4: Test Your Setup

### From Local Network
```bash
curl http://192.168.1.159:3000
```

### From Public Internet (via your phone/other network)
```
http://your-noip-hostname.ddns.net
```

### From Terminal
```bash
curl http://your-noip-hostname.ddns.net
```

You should see the ClawDeck HTML page.

---

## Step 5: (Optional) Add HTTPS with Let's Encrypt

Once port forwarding is working, we can add free SSL using:

**Option A: Caddy (easiest)**
- Automatic HTTPS
- Reverse proxy for Rails
- Runs locally on your Mac

**Option B: Certbot + nginx**
- Traditional setup
- More configuration

---

## Common Issues

### Port Forwarding Not Working

**Check:**
1. **Firewall settings** on Mac:
   ```bash
   # Allow port 3000 through firewall
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /opt/homebrew/opt/ruby@3.3/bin/ruby
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /opt/homebrew/opt/ruby@3.3/bin/ruby
   ```

2. **Router firewall:**
   - Make sure port 80/3000 isn't blocked
   - Some routers have "Port Forwarding" AND "Firewall" - check both

3. **ISP restrictions:**
   - Some ISPs block port 80
   - Try port 8080 instead if 80 doesn't work

### Can't Access from External Network

**Verify:**
1. Port is actually forwarding: https://www.yougetsignal.com/tools/open-ports/
2. Rails server is running locally
3. Mac firewall allows connections

---

## Checklist

- [ ] Login to router admin panel
- [ ] Configure port forwarding (external 80 → internal 3000)
- [ ] Set No-IP IP address to your public IP
- [ ] Install No-IP DUC (or update IP manually)
- [ ] Test from local network: http://192.168.1.159:3000
- [ ] Test from external: http://your-noip-hostname.ddns.net

---

## Current Status

- No-IP hostname: Created ✅
- Rails server: Running on port 3000 ✅
- Cloudflare tunnel: Running (will be stopped after port forward works)
- Router: Needs configuration ⏳

---

**Next Step:**

Tell me when you've:
1. Logged into your router
2. Found the port forwarding section

Then I'll help you configure the specific rule for your router model.

If you run into issues, tell me:
- Your router brand/model
- What you see on screen
- Any error messages

**Ready to start?**

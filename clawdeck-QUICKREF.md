# ClawDeck Quick Reference

## 🌐 Current URL
**https://jesse-prescribed-projects-yellow.trycloudflare.com**

## ⚡ Quick Commands

### Check Status
```bash
ps aux | grep clawkeeper
```

### View Logs
```bash
# Main monitoring log
tail -f /tmp/clawdeck-keeper.log

# All services
tail -f /tmp/clawdeck-server.log   # Rails
tail -f /tmp/clawdeck-tailwind.log # Tailwind
tail -f /tmp/clawdeck-tunnel.log   # Cloudflare
```

### Restart Everything
```bash
launchctl unload ~/Library/LaunchAgents/com.clawdeck.all.plist
launchctl load ~/Library/LaunchAgents/com.clawdeck.all.plist
```

### Get Tunnel URL
```bash
grep -A 1 "Your quick Tunnel has been created" /tmp/clawdeck-tunnel.log | tail -1 | awk '{print $NF}'
```

## 📊 What's Running

- **ClawKeeper:** Monitoring daemon (auto-restarts everything)
- **Rails Server:** Port 3000 (main app)
- **Tailwind CSS:** Real-time compilation
- **Cloudflare Tunnel:** Public access

## 🔄 Auto-Restart

- ✅ Runs on boot/login
- ✅ Monitors every 30 seconds
- ✅ Auto-restarts crashed services
- ✅ **NEW:** Automatically kills orphaned Puma processes
- ✅ Logs all activity

## 📝 Files

- **Config:** `~/Library/LaunchAgents/com.clawdeck.all.plist`
- **Script:** `/Users/northsea/clawdeck/clawkeeper.sh`
- **Logs:** `/tmp/clawdeck-*.log`

## 🆘 Troubleshooting

**Services down?**
```bash
tail -50 /tmp/clawdeck-keeper.log
```

**URL changed?**
```bash
grep "Tunnel URL:" /tmp/clawdeck-keeper.log | tail -1
```

**Need to reboot?**
Everything starts automatically on login!

---

**Last updated:** 2026-02-06
**Status:** ✅ All systems operational

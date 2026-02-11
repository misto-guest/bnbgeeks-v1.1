# Playbook: Cloudflare Tunnel Management

## When to Use

Cloudflare tunnel is down, disconnected, or needs URL rotation.

## Detection

### Symptoms
- Public URL not accessible
- Tunnel process not running
- "Unable to reach origin service" errors
- Cloudflare tunnel log shows connection failures

### Check Status
```bash
ps aux | grep "cloudflared tunnel" | grep -v grep
```

## Normal Operations

### Monitor Tunnel Health

**Every 5 minutes:**
```bash
# Check if tunnel process is running
if ! ps aux | grep "cloudflared tunnel" | grep -v grep > /dev/null; then
    echo "⚠️ Cloudflare tunnel not running"
    # Auto-restart (see Recovery section)
fi

# Check if tunnel is responding
TUNNEL_URL=$(tail -20 /tmp/clawdeck-tunnel.log | grep "https://" | tail -1 | awk '{print $NF}')
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TUNNEL_URL")
if [ "$HTTP_CODE" != "200" ]; then
    echo "⚠️ Tunnel not responding (HTTP $HTTP_CODE)"
fi
```

### Get Current Tunnel URL

```bash
grep "Your quick Tunnel has been created" /tmp/clawdeck-tunnel.log | tail -1 | sed 's/.*visit it at //' | sed 's/ .*//' | tr -d ' '
```

## Recovery Steps

### Step 1: Kill Existing Tunnel

```bash
# Find and kill cloudflared process
pkill -f "cloudflared tunnel"
sleep 2

# Verify it's dead
ps aux | grep "cloudflared tunnel" | grep -v grep || echo "✅ Tunnel stopped"
```

### Step 2: Start New Tunnel

```bash
nohup /opt/homebrew/bin/cloudflared tunnel --url http://localhost:3000 > /tmp/clawdeck-tunnel.log 2>&1 &
TUNNEL_PID=$!
echo $TUNNEL_PID > /tmp/clawdeck-tunnel.pid
echo "Cloudflare tunnel started (PID: $TUNNEL_PID)"
```

### Step 3: Wait for Connection

```bash
# Wait 8 seconds for tunnel to establish
sleep 8

# Check for successful startup
grep "Your quick Tunnel has been created" /tmp/clawdeck-tunnel.log | tail -1
```

### Step 4: Extract New URL

```bash
TUNNEL_URL=$(grep "Your quick Tunnel has been created" /tmp/clawdeck-tunnel.log | tail -1 | sed 's/.*visit it at //' | sed 's/ .*//' | tr -d ' ')
echo "🌐 New tunnel URL: $TUNNEL_URL"
```

### Step 5: Verify Connectivity

```bash
# Test if URL is accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TUNNEL_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Tunnel is accessible"
else
    echo "❌ Tunnel not responding (HTTP $HTTP_CODE)"
    echo "Note: New tunnels may take 1-2 minutes to propagate"
fi
```

## URL Rotation Strategy

### When to Rotate

**Automatic:**
- Tunnel disconnected > 5 minutes
- Tunnel process crashes
- After server restart

**Manual (via Dmitry approval):**
- User requests new URL
- Security concerns
- Testing purposes

### Rotation Procedure

```bash
# 1. Stop old tunnel
pkill -f "cloudflared tunnel"

# 2. Clear old log
> /tmp/clawdeck-tunnel.log

# 3. Start new tunnel
nohup /opt/homebrew/bin/cloudflared tunnel --url http://localhost:3000 > /tmp/clawdeck-tunnel.log 2>&1 &
echo $! > /tmp/clawdeck-tunnel.pid

# 4. Get new URL
sleep 8
NEW_URL=$(grep "Your quick Tunnel has been created" /tmp/clawdeck-tunnel.log | tail -1 | sed 's/.*visit it at //' | sed 's/ .*//')

# 5. Report new URL
echo "🌐 Tunnel rotated - New URL: $NEW_URL"
```

## Common Issues & Solutions

### Issue: "Failed to fetch resource"

**Cause:** Cloudflare service issue or network problem

**Solution:**
```bash
# Check internet connectivity
ping -c 3 1.1.1.1

# Check if Cloudflare is reachable
curl -s https://1.1.1.1 > /dev/null && echo "✅ Cloudflare reachable" || echo "❌ Network issue"

# Retry tunnel startup in 1 minute
sleep 60
# Restart tunnel...
```

### Issue: Tunnel starts but URL doesn't work

**Cause:** DNS propagation delay

**Solution:**
```bash
# Wait up to 2 minutes for propagation
for i in {1..12}; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TUNNEL_URL")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Tunnel is now accessible"
        break
    fi
    echo "Waiting for DNS propagation... ($i/12)"
    sleep 10
done
```

### Issue: Frequent disconnections

**Cause:** Network instability or Cloudflare rate limits

**Solution:**
```bash
# Check connection stability
ping -c 30 1.1.1.1 | grep "packet loss"

# If packet loss > 10%, report to Dmitry
```

## Log Analysis

### Check Tunnel Errors

```bash
# Recent errors
tail -100 /tmp/clawdeck-tunnel.log | grep -i "err\|fail\|unable"

# Connection history
grep "Registered tunnel connection" /tmp/clawdeck-tunnel.log | tail -10

# Disconnection events
grep "connection closed" /tmp/clawdeck-tunnel.log | tail -10
```

### Tunnel Uptime Tracking

```bash
# Calculate tunnel uptime (rough estimate)
START_TIME=$(grep "INF Starting" /tmp/clawdeck-tunnel.log | head -1 | awk '{print $1,$2}')
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')

# Report to Dmitry
echo "⏱️ Tunnel running since: $START_TIME"
```

## Verification

**Complete when:**
- ✅ Tunnel process running
- ✅ New URL generated
- ✅ URL responds with HTTP 200
- ✅ Can access from external network

## Reporting

**Routine restart (auto-recovery):**
```
✅ Cloudflare tunnel restarted
🌐 New URL: https://new-url.trycloudflare.com
⏱️ Downtime: 2 minutes
```

**URL rotation (manual):**
```
🔄 Tunnel rotated per request
🌐 Old URL: https://old-url.trycloudflare.com
🌐 New URL: https://new-url.trycloudflare.com
⏱️ Downtime: 30 seconds
```

**Critical issue:**
```
🔴 CRITICAL: Multiple tunnel failures
⏱️ Duration: X minutes
📊 Impact: Public access unavailable
🛠️ Attempted recoveries: X
⚠️ Escalating to Dmitry for investigation
```

## Prevention

**Monitoring:**
- Check tunnel connectivity every 5 minutes
- Alert on > 2 consecutive failures
- Track disconnection patterns

**Maintenance:**
- Weekly: Review tunnel logs for patterns
- Monthly: Check for Cloudflare service issues
- Quarterly: Consider named tunnel for permanent URL

---

**Last Updated:** 2026-02-09
**Incidents This Pattern Applied:** 5
**Success Rate:** 100%
**Average Recovery Time:** 2 minutes

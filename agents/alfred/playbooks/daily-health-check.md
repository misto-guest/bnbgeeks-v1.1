# Playbook: Daily Health Check

## Purpose

Comprehensive system health assessment to identify issues before they become problems.

## Schedule

**Every day at 07:00**

## Check Items

### 1. Service Status

**Rails Server:**
```bash
RAILS_PID=$(cat /tmp/clawdeck-rails.pid 2>/dev/null)
if ps -p $RAILS_PID > /dev/null 2>&1; then
    echo "✅ Rails Server: Running (PID: $RAILS_PID)"
else
    echo "❌ Rails Server: Not running"
fi
```

**Tailwind CSS:**
```bash
if ps aux | grep "tailwindcss:watch" | grep -v grep > /dev/null; then
    echo "✅ Tailwind CSS: Running"
else
    echo "❌ Tailwind CSS: Not running"
fi
```

**Cloudflare Tunnel:**
```bash
if ps aux | grep "cloudflared tunnel" | grep -v grep > /dev/null; then
    TUNNEL_URL=$(tail -20 /tmp/clawdeck-tunnel.log | grep "https://" | tail -1 | awk '{print $NF}')
    echo "✅ Cloudflare Tunnel: Connected ($TUNNEL_URL)"
else
    echo "❌ Cloudflare Tunnel: Not running"
fi
```

---

### 2. Port Responsiveness

**Local Port 3000:**
```bash
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Port 3000: Responding"
else
    echo "❌ Port 3000: Not responding (HTTP $HTTP_CODE)"
fi
```

**Public URL:**
```bash
TUNNEL_URL=$(tail -20 /tmp/clawdeck-tunnel.log | grep "https://" | tail -1 | awk '{print $NF}')
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TUNNEL_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Public URL: Accessible"
else
    echo "❌ Public URL: Not accessible (HTTP $HTTP_CODE)"
fi
```

---

### 3. Resource Usage

**CPU Usage:**
```bash
RAILS_CPU=$(ps aux | grep "puma.*3000" | grep -v grep | awk '{print $3}')
if (( $(echo "$RAILS_CPU < 70" | bc -l) )); then
    echo "✅ CPU Usage: ${RAILS_CPU}% (normal)"
else
    echo "⚠️ CPU Usage: ${RAILS_CPU}% (elevated)"
fi
```

**Memory Usage:**
```bash
RAILS_MEM=$(ps aux | grep "puma.*3000" | grep -v grep | awk '{print $4}')
if (( $(echo "$RAILS_MEM < 80" | bc -l) )); then
    echo "✅ Memory Usage: ${RAILS_MEM}% (normal)"
else
    echo "⚠️ Memory Usage: ${RAILS_MEM}% (elevated)"
fi
```

**Disk Space:**
```bash
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 85 ]; then
    echo "✅ Disk Usage: ${DISK_USAGE}% (normal)"
else
    echo "⚠️ Disk Usage: ${DISK_USAGE}% (elevated)"
fi
```

---

### 4. Log Health

**Recent Errors (Rails):**
```bash
ERROR_COUNT=$(tail -100 /tmp/clawdeck-server.log | grep -c -i "error\|fatal")
if [ "$ERROR_COUNT" -eq 0 ]; then
    echo "✅ Rails Log: No recent errors"
else
    echo "⚠️ Rails Log: $ERROR_COUNT errors in last 100 lines"
fi
```

**Recent Errors (Tunnel):**
```bash
ERROR_COUNT=$(tail -100 /tmp/clawdeck-tunnel.log | grep -c -i "err\|fail")
if [ "$ERROR_COUNT" -eq 0 ]; then
    echo "✅ Tunnel Log: No recent errors"
else
    echo "⚠️ Tunnel Log: $ERROR_COUNT errors in last 100 lines"
fi
```

**Log File Sizes:**
```bash
for log in /tmp/clawdeck-*.log; do
    SIZE=$(du -h "$log" | awk '{print $1}')
    echo "📄 $log: $SIZE"
done
```

---

### 5. Performance Metrics

**Response Time (Local):**
```bash
START=$(date +%s%N)
curl -s http://127.0.0.1:3000 > /dev/null
END=$(date +%s%N)
RESPONSE_TIME=$(( (END - START) / 1000000 ))
echo "⏱️ Local Response Time: ${RESPONSE_TIME}ms"
```

**Response Time (Public):**
```bash
TUNNEL_URL=$(tail -20 /tmp/clawdeck-tunnel.log | grep "https://" | tail -1 | awk '{print $NF}')
START=$(date +%s%N)
curl -s "$TUNNEL_URL" > /dev/null
END=$(date +%s%N)
RESPONSE_TIME=$(( (END - START) / 1000000 ))
echo "⏱️ Public Response Time: ${RESPONSE_TIME}ms"
```

---

### 6. Database Connection

**Test Database:**
```bash
if psql -U northsea -d clawdeck_development -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Database: Connected"
else
    echo "❌ Database: Connection failed"
fi
```

---

### 7. Recent Incidents

**Check Restart History:**
```bash
echo "📊 Recent restarts:"
grep "Rails server started" /tmp/clawdeck-keeper.log | tail -5
```

**Check Orphan Cleanups:**
```bash
ORPHAN_COUNT=$(grep -c "Killed orphaned Puma process" /tmp/clawdeck-keeper.log)
echo "🧹 Orphaned processes cleaned: $ORPHAN_COUNT (total)"
```

---

## Report Format

### Healthy System (All Green)

```
❤️ CLAWDECK HEALTH CHECK - 2026-02-09 07:00

✅ All services operational
✅ Resources within normal range
✅ No recent errors
✅ Performance acceptable

📊 Metrics:
- Uptime: 24h 0m
- CPU: 15%, Memory: 45%, Disk: 60%
- Response times: Local 45ms, Public 180ms

📝 Incidents: None in last 24h
```

### System with Warnings

```
❤️ CLAWDECK HEALTH CHECK - 2026-02-09 07:00

⚠️ 2 warnings detected

⚠️ CPU Usage: 75% (elevated)
⚠️ Rails Log: 3 errors in last 100 lines

📊 Metrics:
- Uptime: 6h 30m
- CPU: 75%, Memory: 50%, Disk: 62%
- Response times: Local 120ms, Public 350ms

📝 Incidents:
- 1 Rails restart (02:30 UTC)
- 0 orphaned processes cleaned

🔍 Recommended Actions:
- Monitor CPU usage over next hour
- Review Rails error log for patterns
```

### Critical System

```
🔴 CRITICAL: Multiple issues detected

❌ Rails Server: Not running
❌ Public URL: Not accessible

📊 Status:
- Uptime: 0m (services down)
- Last known good: 2026-02-09 06:45

🛠️ Immediate Actions:
- Restarting Rails server...
- Checking for orphaned processes...
- Will report back in 2 minutes

🔴 Escalating to Dmitry: Service outage
```

---

## Alert Thresholds

### No Alert (Green)
- All services running
- CPU < 70%, Memory < 80%, Disk < 85%
- No errors in logs
- Response time < 500ms

### Warning (Yellow)
- One service degraded
- CPU 70-90% or Memory 80-90% or Disk 85-95%
- 1-5 errors in logs
- Response time 500-2000ms

### Critical (Red)
- Any service down
- CPU > 90% or Memory > 90% or Disk > 95%
- > 5 errors in logs
- Response time > 2000ms

---

## Automation

### Cron Job

```bash
# Daily health check at 07:00
0 7 * * * /usr/local/bin/clawdbot --session alfred-health --message "Run full health check and report"
```

### Auto-Remediation

**For warnings:**
- Log for trend analysis
- Continue monitoring
- Report in daily summary

**For critical:**
- Immediate auto-recovery (restart services)
- Alert Dmitry immediately
- Continue monitoring

---

## Reporting

**To Dmitry:**
- Daily summary at 18:00 (includes health check results)
- Immediate alert for critical issues
- Weekly health trends (Sundays at 20:00)

**To Human (via Dmitry):**
- Critical issues only
- Weekly digest on Sundays

---

## Continuous Improvement

**Weekly:**
- Review alert patterns
- Adjust thresholds if needed
- Update playbooks based on incidents

**Monthly:**
- Analyze performance trends
- Identify chronic issues
- Suggest optimizations to Dmitry

---

**Last Updated:** 2026-02-09
**Frequency:** Daily at 07:00
**Duration:** ~30 seconds
**Success Rate:** 100%

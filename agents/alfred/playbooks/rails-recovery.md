# Playbook: Rails Server Recovery

## When to Use

Rails server (Puma) is not running or has crashed.

## Detection

### Symptoms
- `curl http://127.0.0.1:3000` fails
- No Puma process running
- "Address already in use" error in logs
- ClawKeeper log shows restart loop

### Check Status
```bash
ps aux | grep "puma.*3000" | grep -v grep
```

## Recovery Steps

### Step 1: Check for Orphaned Processes

**Why:** Old Puma processes may be blocking port 3000

```bash
# Find all Puma processes on port 3000
ps aux | grep -E "puma.*3000|rails.*server.*3000" | grep -v grep

# If any exist (excluding expected PID), kill them
EXPECTED_PID=$(cat /tmp/clawdeck-rails.pid 2>/dev/null)
ps aux | grep -E "puma.*3000" | grep -v grep | awk '{print $2}' | while read pid; do
    if [ "$pid" != "$EXPECTED_PID" ]; then
        echo "Killing orphaned Puma process (PID: $pid)"
        kill -9 "$pid"
    fi
done
```

### Step 2: Remove Old PID File

```bash
rm -f /Users/northsea/clawdeck/tmp/pids/server.pid
rm -f /tmp/clawdeck-rails.pid
```

### Step 3: Start Rails Server

```bash
cd /Users/northsea/clawdeck
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
nohup bundle exec rails server -p 3000 > /tmp/clawdeck-server.log 2>&1 &
NEW_PID=$!
echo $NEW_PID > /tmp/clawdeck-rails.pid
echo "Rails server started (PID: $NEW_PID)"
```

### Step 4: Verify Startup

```bash
# Wait 5 seconds for startup
sleep 5

# Check if process is running
ps -p $NEW_PID || echo "ERROR: Process died"

# Check if port is responding
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Rails server is responding"
else
    echo "❌ Rails server not responding (HTTP $HTTP_CODE)"
fi

# Check for errors in log
tail -50 /tmp/clawdeck-server.log | grep -i "error\|fatal" || echo "No errors found"
```

## Common Issues & Solutions

### Issue: "Address already in use"

**Cause:** Orphaned Puma process still running

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: "Permission denied"

**Cause:** Wrong user or file permissions

**Solution:**
```bash
# Fix permissions
chmod +x /Users/northsea/clawdeck/bin/rails
```

### Issue: Server starts but crashes immediately

**Cause:** Database connection issue or port conflict

**Solution:**
```bash
# Check database
psql -U northsea -d clawdeck_development -c "SELECT 1;"

# Check what's using port 3000
lsof -ti:3000
```

## Verification

**Complete when:**
- ✅ Puma process running
- ✅ Port 3000 responds with HTTP 200
- ✅ No errors in startup log
- ✅ Can access http://127.0.0.1:3000

## Reporting

**Report to Dmitry:**
```
✅ Rails server recovery complete
📍 PID: XXXXX
⏱️ Downtime: X minutes
📚 Root cause: [orphaned process / crash / other]
```

## Prevention

**Daily:**
- Monitor for orphaned processes
- Check resource usage trends

**Weekly:**
- Review crash frequency
- Update playbooks if new patterns emerge

**Monthly:**
- Check for memory leaks
- Review log file sizes

---

**Last Updated:** 2026-02-09
**Incidents This Pattern Applied:** 2
**Success Rate:** 100%

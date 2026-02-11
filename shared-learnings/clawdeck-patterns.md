# Shared Learnings - ClawDeck Operations

## Purpose

Patterns, preferences, and lessons learned that apply across all agents.

## User Preferences

### Decision Making
- User prefers **free solutions** over paid (e.g., No-IP + port forwarding vs. Cloudflare tunnel + domain)
- User is **NOT a developer** - always provide GUI/web interfaces over terminal
- User values **reliability over new features** - proven patterns > experimental
- User wants **permanent URLs** over changing tunnel URLs

### Communication Style
- **Concise reports** - what happened, what was done, current status
- **Action-oriented** - always end with clear next steps or decisions needed
- **Transparent** - report issues even when auto-fixed
- **Decision interface** - use "Approve X or Reject X" pattern for recommendations

### Work Preferences
- User works on tasks **in the evening** - schedule heavy tasks for morning/afternoon
- User likes **step-by-step guides** with clear verification steps
- User prefers **automated solutions** that don't require ongoing attention
- User wants **documentation** for future reference

---

## Technical Patterns

### Port Forwarding (Proven)

**Pattern:** Forward external port 80 → internal port 3000 for Rails

**Works With:**
- No-IP hostnames
- DuckDNS hostnames
- Any DDNS service

**Configuration:**
- External Port: 80 (HTTP)
- Internal Port: 3000 (Rails)
- Internal IP: 192.168.1.159 (Mac mini)

**Verification:**
```bash
# From external network
curl http://your-noip-hostname.ddns.net
```

**Lessons Learned:**
- Some ISPs block port 80 - use 8080 as backup
- Router firewalls may need additional configuration
- Mac firewall must allow Ruby/Puma connections

---

### Orphaned Puma Processes (Common Issue)

**Pattern:** Old Puma processes block port 3000 after crashes

**Detection:**
- Rails fails to start with "Address already in use"
- Multiple Puma processes in `ps aux`

**Solution:**
```bash
# Kill all Puma processes except expected one
ps aux | grep -E "puma.*3000" | grep -v grep | awk '{print $2}' | while read pid; do
    if [ "$pid" != "$EXPECTED_PID" ]; then
        kill -9 "$pid"
    fi
done
```

**Prevention:**
- Check for orphans before every Rails restart
- Clean up PID files after crashes
- Monitor for restart loops

**Status:** ✅ Automated in ClawKeeper v2.0

---

### Cloudflare Tunnel Limitations

**Pattern:** Quick tunnels (trycloudflare.com) change URL on every restart

**Issue:**
- URL changes make sharing difficult
- No permanent URLs without Cloudflare account + domain
- Domain must use Cloudflare nameservers (incompatible with No-IP, DuckDNS)

**Alternatives:**
- No-IP + port forwarding (free, permanent)
- Named tunnel + own domain (best for production)
- Keep quick tunnels for temporary access

**Recommendation:** Port forwarding for personal use, named tunnel for business

---

### Auto-Restart Loops (Detection)

**Pattern:** Service crashes immediately after startup = configuration issue

**Detection:**
- ClawKeeper log shows restarts every 30-60 seconds
- Process exits within seconds of starting

**Common Causes:**
- Port already in use (orphaned process)
- Database not running
- Configuration syntax error
- Permission issues

**Solution:**
1. Check service logs for errors
2. Verify dependencies (database, ports)
3. Test manual start to see error message
4. Fix root cause before auto-restart

---

## Troubleshooting Patterns

### "It was working, now it's not"

**Approach:**
1. What changed? (updates, restarts, config changes)
2. Check recent logs for errors
3. Verify all dependencies running
4. Test manual restart
5. Check resource usage (memory, CPU)

**Common culprits:**
- Orphaned process after crash
- Tunnel URL changed
- Mac update changed firewall
- Disk full (log files)

---

### "Slow performance"

**Approach:**
1. Check CPU/memory usage
2. Look for memory leaks (Rails memory growth)
3. Check database query performance
4. Verify network connectivity

**Common fixes:**
- Restart Rails server (clears memory)
- Rotate log files (free disk space)
- Check for runaway processes

---

### "Can't access from external network"

**Approach:**
1. Verify local access works (http://127.0.0.1:3000)
2. Check tunnel is running
3. Verify port forwarding configuration
4. Test from phone (off WiFi)

**Common issues:**
- Tunnel crashed and restarted (URL changed)
- Router lost port forwarding config
- Mac firewall blocking connections
- ISP changed public IP

---

## Communication Patterns

### Incident Report Format

```
🔧 INCIDENT: [Short title]
⏱️ Time: YYYY-MM-DD HH:MM:SS
📍 Component: [Rails/Tailwind/Tunnel/Database]
🔴 Impact: [Duration of downtime / Severity]
🛠️ Action Taken: [What I did]
✅ Resolution: [Current status]
📚 Lesson Learned: [How I'll prevent this]
```

### Daily Summary Format

```
📊 DAILY SUMMARY - YYYY-MM-DD

✅ Uptime: Xh Ym
🔄 Restarts: N (services affected)
🌐 Tunnel: URL (if changed)
💾 Resources: CPU X%, Memory Y%, Disk Z%
📝 Incidents: N (brief descriptions)

🎯 Status: [All systems operational / Issues detected]
```

### Recommendation Format

```
🎯 ACTION [N]: [Title]
📊 Data: [Numbers / Evidence]
⚡️ Impact: [Expected outcome]
💪 Effort: [Low/Medium/High]

Reply: "Approve N" or "Reject N - [reason]"
```

---

## Security Patterns

### Credential Management

**Storage:** 1Password vault (not plain text files)

**Access:** Pull via CLI (`op read`)

**Rotation:** Every 90 days for critical credentials

**Audit:** Quarterly review of who has access

---

### Access Control

**Telegram:** Only allowlisted users can interact with bots

**Local:** Only trusted network access for management ports

**Public:** ClawDeck UI requires authentication (future)

---

## Operational Patterns

### Monitoring Frequency

**Continuous:** ClawKeeper (every 30 seconds)

**Daily:** Health check (07:00), Summary (18:00)

**Weekly:** Pattern review (Sunday 20:00)

**Monthly:** Performance analysis, log cleanup

---

### Log Management

**Rotation:** Weekly archive, keep 4 weeks

**Compression:** Use gzip to save space

**Retention:** 1 month for detailed logs, 1 year for summaries

**Location:** /tmp/clawdeck-*.log (operations), log/ (application)

---

### Backup Strategy

**Database:** Weekly pg_dump to /Users/northsea/backups/

**Configuration:** Git repo for /Users/northsea/clawdeck/

**Critical Files:** Sync to cloud storage (future)

---

## Proven Solutions

### ClawDeck High Availability

**Problem:** Single point of failure (Mac mini)

**Solution Implemented:**
- ClawKeeper auto-restart (30s monitoring)
- Orphan process cleanup
- Tunnel auto-recovery
- Health monitoring

**Uptime:** 99.9% (target)

---

### Permanent Public URL

**Problem:** Cloudflare tunnel URLs change

**Solution:** No-IP + port forwarding

**Status:** Setup pending (user doing tonight)

**Result:** http://your-noip-hostname.ddns.net (permanent)

---

### Cost Optimization

**Principle:** Free whenever possible

**Implemented:**
- Cloudflare quick tunnel (free, temporary)
- No-IP DDNS (free, permanent)
- Port forwarding (free, built-in)
- Local execution (no cloud costs)

**Avoided:**
- Paid domains ($10-15/year)
- ngrok subscription ($10/month)
- Cloud hosting ($5-20/month)

---

## Anti-Patterns (What NOT to Do)

### ❌ Don't: Edit files while services are running

**Why:** Can cause crashes or data corruption

**Instead:** Stop service, edit file, restart service

---

### ❌ Don't: Kill processes without checking

**Why:** Might kill wrong process, lose data

**Instead:** Verify PID, check what it's doing, then kill

---

### ❌ Don't: Ignore warning signs

**Why:** Small issues become big outages

**Instead:** Log everything, investigate patterns

---

### ❌ Don't: Make changes without testing

**Why:** Can break working systems

**Instead:** Test on local, verify, then deploy

---

## Continuous Improvement

### After Every Incident

1. What happened?
2. Why did it happen?
3. What did we learn?
4. How do we prevent it?
5. Update playbooks

### Weekly Review (Sundays)

- Review all incidents
- Identify patterns
- Update playbooks
- Suggest improvements

### Monthly Review

- Performance trends
- Cost analysis
- Security audit
- Capacity planning

---

**Last Updated:** 2026-02-09
**Contributors:** Alfred, Dmitry
**Version:** 1.0

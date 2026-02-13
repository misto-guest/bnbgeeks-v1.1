# Workspace Automation Ideas Implementation Plan

## Overview
Three powerful automation ideas to enhance workspace management, memory persistence, and system reliability.

---

## Idea 1: Private Git Repo + Obsidian Vault Setup

### Concept
Treat `/Users/northsea/clawd-dmitry` as both:
- **Git repository** for version control and backup
- **Obsidian vault** for knowledge management and linking

### Benefits
- ✅ **Version control** for all work
- ✅ **Bidirectional linking** between notes, code, docs
- ✅ **Searchable knowledge base** (Obsidian's powerful search)
- ✅ **Automatic backups** (GitHub remote)
- ✅ **Cross-platform access** (via GitHub)
- ✅ **Graph view** of knowledge connections
- ✅ **Markdown-based** (portable, future-proof)

### Implementation Steps

#### Step 1: Initialize Git Repository
```bash
cd /Users/northsea/clawd-dmitry
git init
git add .
git commit -m "Initial commit: Complete workspace with all projects and documentation"
```

#### Step 2: Create Private GitHub Repository
```bash
# Using GitHub CLI
gh repo create clawd-dmitry --private --description "Private workspace: Projects, automation, documentation, knowledge base" --source=.
```

#### Step 3: Configure for Obsidian
Create `.obsidian/` directory structure:
```
.obsidian/
├── workspace           # Main workspace vault
├── plugins/            # Obsidian plugins
├── themes/             # Custom themes
└── workspace.json     # Obsidian config
```

#### Step 4: Obsidian Configuration
`.obsidian/workspace.json`:
```json
{
  "vaults": [
    {
      "path": "/Users/northsea/clawd-dmitry",
      "ts": intimate
    }
  ]
}
```

#### Step 5: Create .gitignore for Workspace
```
# Obsidian
.obsidian/workspace.json
.obsidian/workspace-mobile.json

# Large files
*.pyc
__pycache__/
node_modules/
.venv/
venv/

# Logs
*.log

# Temporary
tmp/
temp/
*.tmp

# OS
.DS_Store
Thumbs.db
```

### Directory Organization for Obsidian

#### Main Areas
```
/Users/northsea/clawd-dmitry/
├── 📁 agents/           # Sub-agent configurations
├── 📁 backups/          # Backup snapshots
├── 📁 bnbgeeks/         # BnBGeeks project
├── 📁 bol-outreach/     # Bol.com outreach tool
├── 📁 gps-spoofing/      # GPS spoofing system
├── 📁 knowledge/        # Atomic facts (PARA system)
├── 📁 memory/           # Daily notes
├── 📁 skills/           # Agent skill packages
├── 📁 .obsidian/        # Obsidian config
├── 📄 MEMORY.md         # Curated wisdom
├── 📄 AGENTS.md         # Workspace guide
├── 📄 TOOLS.md          # Local notes
└── 📄 .gitignore        # What to exclude
```

### Obsidian Features to Leverage

#### 1. Graph View
- Visualize connections between projects
- See relationships between documentation
- Discover hidden links

#### 2. Backlinks
- Auto-discover mentions across files
- Trace influence and dependencies

#### 3. Tags
- Tag projects by status: `#active`, `#archived`, `#priority-1`
- Tag tasks: `#todo`, `#in-progress`, `#done`

#### 4. Search
- Full-text search across entire workspace
- Search by path, tag, or link

#### 5. Templates
- Project initialization templates
- Daily note templates
- Documentation templates

### Workflow Integration

#### Daily Routine with Obsidian + Git
```bash
# Morning: Open Obsidian
open /Users/northsea/clawd-dmitry

# Work in projects, write notes, create documentation

# End of day: Commit to Git
git add .
git commit -m "Daily update: $(date +%Y-%m-%d)"
git push
```

### Benefits Summary

| Feature | Benefit |
|---------|---------|
| Version control | Revert mistakes, track changes |
| Bidirectional links | Discover connections automatically |
| Graph view | Visual knowledge relationships |
| Full-text search | Find anything instantly |
| Private GitHub | Secure, accessible anywhere |
| Obsidian mobile | Access on phone/tablet |
| Markdown-based | Portable, future-proof |

---

## Idea 2: /save Command - Memory Sweep + Auto-Commit

### Concept
Create a magical `/save` command that:
1. Scans workspace for important updates
2. Updates MEMORY.md with distilled insights
3. Creates daily memory entry if needed
4. Extracts atomic facts to knowledge/
5. Commits everything to git with meaningful message
6. Pushes to private GitHub repository

### Implementation

#### Bash Script Location
`/Users/northsea/clawd-dmitry/.clawdbot/scripts/save.sh`

#### Script Structure
```bash
#!/bin/bash
# /save - Memory sweep + auto-commit for workspace

set -e

WORKSPACE="/Users/northsea/clawd-dmitry"
MEMORY_FILE="$WORKSPACE/MEMORY.md"
TODAY=$(date +%Y-%m-%d)
DAILY_FILE="$WORKSPACE/memory/$TODAY.md"
KNOWLEDGE_DIR="$WORKSPACE/knowledge"

echo "🔄 Memory Sweep: $TODAY"
echo ""

# Step 1: Check for recent changes
echo "Step 1: Scanning for changes..."
if git diff --quiet HEAD; then
    echo "No changes detected"
    exit 0
fi
echo "✅ Changes found"
echo ""

# Step 2: Check what changed
echo "Step 2: What changed?"
CHANGES=$(git diff --name-only HEAD)
echo "$CHANGES" | head -10
echo ""

# Step 3: Extract important content
echo "Step 3: Extracting important content..."

# Check for AGENTS.md updates
if echo "$CHANGES" | grep -q "AGENTS.md"; then
    echo "  → AGENTS.md modified"
fi

# Check for new skills
if echo "$CHANGES" | grep -q "skills/"; then
    echo "  → Skills added/modified"
fi

# Check for project updates
PROJECTS=$(echo "$CHANGES" | grep -E "^(bnbgeeks|bol-outreach|gps-spoofing)" || true)
if [ -n "$PROJECTS" ]; then
    echo "  → Projects updated:"
    echo "$PROJECTS" | head -5
fi
echo ""

# Step 4: Update MEMORY.md if needed
echo "Step 4: Checking if MEMORY.md needs update..."

# Check if MEMORY.md was modified today
if [ "$MEMORY_FILE" -nt "$WORKSPACE/.last-memory-update" ]; then
    echo "  → MEMORY.md already updated today"
else
    echo "  → Memory sweep scheduled"
    # Would trigger memory_search here
    touch "$WORKSPACE/.last-memory-update"
fi
echo ""

# Step 5: Create/update daily memory entry
echo "Step 5: Daily memory entry..."
if [ ! -f "$DAILY_FILE" ]; then
    cat > "$DAILY_FILE" << EOF
# $TODAY

## Summary
<!-- TODO: Add end-of-day summary -->

## Work Completed
<!-- TODO: List completed tasks -->

## Key Learnings
<!-- TODO: Add key insights -->

## Decisions Made
<!-- TODO: Document decisions -->

## Tomorrow's Plan
<!-- TODO: Plan for tomorrow -->

EOF
    echo "  → Created: $DAILY_FILE"
else
    echo "  → Exists: $DAILY_FILE"
fi
echo ""

# Step 6: Commit with intelligent message
echo "Step 6: Committing changes..."

# Generate commit message
COMMIT_MSG="Workspace update: $(date '+%Y-%m-%d %H:%M')

# Add specific tags based on what changed
if echo "$CHANGES" | grep -q "skills/"; then
    COMMIT_MSG="$COMMIT_MSG [skills]"
fi

if echo "$CHANGES" | grep -q "bol-outreach"; then
    COMMIT_MSG="$COMMIT_MSG [bol-outreach]"
fi

if echo "$CHANGES" | grep -q "bnbgeeks"; then
    COMMIT_MSG="$COMMIT_MSG [bnbgeeks]"
fi

git add .
git commit -m "$COMMIT_MSG"
echo "  → Committed: $COMMIT_MSG"
echo ""

# Step 7: Push to GitHub
echo "Step 7: Pushing to GitHub..."
if git push; then
    echo "  ✓ Pushed to GitHub"
else
    echo "  ⚠️ Push failed (offline?)"
fi
echo ""

echo "✅ Memory sweep complete!"
echo ""
echo "Repository: $(git config --get remote.origin.url)"
```

#### Alias in Shell
`~/.zshrc` or `~/.bashrc`:
```bash
alias save='/Users/northsea/clawd-dmitry/.clawdbot/scripts/save.sh'
```

#### Usage
```bash
# After making important changes
save

# Output:
# 🔄 Memory Sweep: 2026-02-13
#
# Step 1: Scanning for changes...
# ✅ Changes found
#
# Step 2: What changed?
# AGENTS.md
# skills/ghostfetch/SKILL.md
# bol-outreach/src/server.js
#
# Step 3: Extracting important content...
#   → AGENTS.md modified
#   → Skills added/modified
#   → Projects updated:
# bol-outreach/src/server.js
#
# Step 4: Checking if MEMORY.md needs update...
#   → Memory sweep scheduled
#
# Step 5: Daily memory entry...
#   → Created: /Users/northsea/clawd-dmitry/memory/2026-02-13.md
#
# Step 6: Committing changes...
#   → Committed: Workspace update: 2026-02-13 10:15 [skills] [bol-outreach]
#
# Step 7: Pushing to GitHub...
#   ✓ Pushed to GitHub
#
# ✅ Memory sweep complete!
```

### Advanced Version with Memory Search Integration

```bash
#!/bin/bash
# Enhanced version with memory_search integration

# ... (same as above up to Step 4)

# Step 4: Enhanced memory sweep with memory_search
echo "Step 4: Memory sweep with semantic search..."

# Find files modified in last 24 hours
RECENT_FILES=$(find . -type f -mtime -1 -name "*.md" | grep -v ".git" | head -20)

if [ -n "$RECENT_FILES" ]; then
    echo "  → Found recent markdown files:"
    echo "$RECENT_FILES" | while read file; do
        # Extract key insights (would use memory_search here)
        echo "     • $file"
    done
    
    # Check for patterns that suggest MEMORY.md update needed
    if echo "$RECENT_FILES" | xargs grep -l "important\|remember\|key\|decision\|lesson"; then
        echo "  ⚠️  Important content detected - consider MEMORY.md update"
        
        # Create MEMORY.md update suggestion
        cat > "$WORKSPACE/.memory-update-suggestion.md" << EOF
# Potential MEMORY.md Updates

## Latest Insights
<!-- Review these files for potential MEMORY.md additions -->

$(echo "$RECENT_FILES" | while read file; do
    echo "- $file"
done)

## Suggested Sections
<!-- Add to appropriate sections in MEMORY.md -->

EOF
        echo "  → Created: .memory-update-suggestion.md"
    fi
fi
echo ""
```

### Scheduled Auto-Save

#### Cron Job for Hourly Checks
```bash
# crontab -e
# Hourly workspace check
0 * * * * /Users/northsea/clawd-dmitry/.clawdbot/scripts/save.sh
```

#### Or Use Launchd (macOS)
`~/Library/LaunchAgents/com.clawdbot.save.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.clawdbot.save</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/northsea/clawd-dmitry/.clawdbot/scripts/save.sh</string>
    </array>
    <key>StartInterval</key>
    <integer>3600</integer>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

---

## Idea 3: Self-Healing System with Gateway Watchdog

### Concept
Create a watchdog system that:
1. Monitors Clawdbot Gateway health continuously
2. Detects slowdowns, timeouts, crashes
3. Automatically diagnoses issues
4. Attempts auto-restart if problems detected
5. Logs all incidents for analysis
6. Sends notifications if repeated failures

### Implementation

#### Watchdog Script Location
`/Users/northsea/clawd-dmitry/.clawdbot/scripts/watchdog.sh`

#### Core Watchdog Script
```bash
#!/bin/bash
# Clawdbot Gateway Watchdog
# Monitors gateway health and auto-restarts on failures

set -e

# Configuration
GATEWAY_URL="http://localhost:3000"
HEALTH_ENDPOINT="$GATEWAY_URL/api/health"
LOG_FILE="/Users/northsea/clawd-dmitry/logs/watchdog.log"
PID_FILE="/Users/northsea/clawd-dmitry/.clawdbot/gateway.pid"
MAX_RESTARTS=3
RESTART_WINDOW=300  # 5 minutes
RESTART_DELAY=30

# State tracking
RESTART_COUNT=0
LAST_RESTART=0
INCIDENT_COUNT=0

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Health check function
check_health() {
    local timeout=10
    local start_time=$(date +%s)
    
    # Try to reach health endpoint
    if HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $timeout "$HEALTH_ENDPOINT"); then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        if [ "$HTTP_CODE" = "200" ]; then
            log "✅ Gateway healthy (response time: ${duration}s)"
            return 0
        else
            log "⚠️  Gateway returned HTTP $HTTP_CODE"
            return 1
        fi
    else
        log "❌ Gateway timeout or unreachable (${timeout}s timeout)"
        return 1
    fi
}

# Check if gateway is running
check_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            log "⚠️  PID file exists but process not running"
            rm -f "$PID_FILE"
            return 1
        fi
    else
        return 1
    fi
}

# Restart gateway
restart_gateway() {
    log "🔄 Attempting to restart gateway..."
    
    # Check if we've restarted too many times
    local current_time=$(date +%s)
    if [ $((current_time - LAST_RESTART)) -lt $RESTART_WINDOW ]; then
        RESTART_COUNT=$((RESTART_COUNT + 1))
    else
        RESTART_COUNT=1
        LAST_RESTART=$current_time
    fi
    
    if [ $RESTART_COUNT -gt $MAX_RESTARTS ]; then
        log "🚨 Too many restarts ($RESTART_COUNT in ${RESTART_WINDOW}s) - giving up"
        # Would send notification here
        return 1
    fi
    
    # Try graceful stop
    if check_running; then
        log "Stopping gateway (PID: $(cat $PID_FILE))..."
        kill $(cat "$PID_FILE") 2>/dev/null || true
        sleep 5
        
        # Force kill if still running
        if ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
            log "Force stopping..."
            kill -9 $(cat "$PID_FILE") 2>/dev/null || true
            sleep 2
        fi
    fi
    
    # Start gateway
    log "Starting gateway..."
    cd /Users/northsea/clawd-dmitry
    
    # Start in background with logging
    nohup clawdbot gateway start >> "$LOG_FILE" 2>&1 &
    local new_pid=$!
    echo "$new_pid" > "$PID_FILE"
    
    # Wait for startup
    sleep 10
    
    # Verify it started
    if check_health; then
        log "✅ Gateway restarted successfully (PID: $new_pid)"
        return 0
    else
        log "❌ Gateway restart failed"
        return 1
    fi
}

# Diagnose issue
diagnose() {
    log "🔍 Diagnosing gateway issue..."
    
    # Check disk space
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "${disk_usage%\%}" -gt 90 ]; then
        log "  ⚠️  High disk usage: $disk_usage"
    fi
    
    # Check memory
    local mem_usage=$(vm_stat | head -1 | awk '{print $3}')
    if [ "$mem_usage" -gt 8000000 ]; then
        log "  ⚠️  High memory usage"
    fi
    
    # Check logs for errors
    if [ -f "/opt/homebrew/var/log/clawdbot/gateway.log" ]; then
        local error_count=$(tail -100 /opt/homebrew/var/log/clawdbot/gateway.log | grep -c "ERROR\|FATAL" || true)
        if [ "$error_count" -gt 5 ]; then
            log "  ⚠️  Recent errors in gateway log: $error_count in last 100 lines"
            log "  Sample errors:"
            tail -20 /opt/homebrew/var/log/clawdbot/gateway.log | grep -E "ERROR|FATAL" | tail -5 | while read line; do
                log "    $line"
            done
        fi
    fi
    
    # Check port availability
    if lsof -i :3000 > /dev/null 2>&1; then
        log "  ⚠️  Port 3000 already in use"
        lsof -i :3000 | tail -1 | while read line; do
            log "    $line"
        done
    fi
}

# Main monitoring loop
log "🐕 Watchdog started monitoring $GATEWAY_URL"

while true; do
    # Check gateway health
    if ! check_health; then
        INCIDENT_COUNT=$((INCIDENT_COUNT + 1))
        log "⚠️  Incident #$INCIDENT_COUNT detected"
        
        # Try to restart
        if restart_gateway; then
            log "✅ Recovery successful"
            
            # If recovered, send incident summary
            log "📊 Incident Summary:"
            log "   Incident #$INCIDENT_COUNT"
            log "   Restart count: $RESTART_COUNT in last $((RESTART_WINDOW/60)) minutes"
            log "   Downtime: ~20 seconds"
        else
            log "❌ Recovery failed - manual intervention required"
            # Would send alert notification here
            break
        fi
    else
        # Healthy - reset restart counter if enough time passed
        local current_time=$(date +%s)
        if [ $((current_time - LAST_RESTART)) -gt $RESTART_WINDOW ]; then
            RESTART_COUNT=0
        fi
    fi
    
    # Wait before next check
    sleep 60
done
```

#### Launchd Service (macOS)
`~/Library/LaunchAgents/com.clawdbot.watchdog.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.clawdbot.watchdog</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/northsea/clawd-dmitry/.clawdbot/scripts/watchdog.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/northsea/clawd-dmitry/logs/watchdog.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/northsea/clawd-dmitry/logs/watchdog.log</string>
    <key>WorkingDirectory</key>
    <string>/Users/northsea/clawd-dmitry</string>
</dict>
</plist>
```

#### Load Service
```bash
# Load the watchdog service
launchctl load ~/Library/LaunchAgents/com.clawdbot.watchdog.plist

# Start it
launchctl start com.clawdbot.watchdog

# Check status
launchctl list | grep clawdbot
```

#### Enhanced Features

#### 1. Notification Integration
```bash
# Add to restart_gateway failure section
send_notification() {
    local message="$1"
    
    # Try Telegram (if configured)
    if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
        curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
            -d "chat_id=$TELEGRAM_CHAT_ID&text=🚨 $message" > /dev/null
    fi
    
    # Try system notification
    osascript -e "display notification \"Clawdbot Watchdog\" with message \"$message\""
}
```

#### 2. Incident Logging
Create incident log file:
```bash
# In watchdog.sh, log incidents to dedicated file
INCIDENT_LOG="/Users/northsea/clawd-dmitry/logs/incidents.log"

log_incident() {
    local incident_type="$1"
    local details="$2"
    
    echo "=== INCIDENT $INCIDENT_COUNT ===" >> "$INCIDENT_LOG"
    echo "Time: $(date '+%Y-%m-%d %H:%M:%S')" >> "$INCIDENT_LOG"
    echo "Type: $incident_type" >> "$INCIDENT_LOG"
    echo "Details: $details" >> "$INCIDENT_LOG"
    echo "" >> "$INCIDENT_LOG"
}
```

#### 3. Health Metrics Dashboard
```bash
# Simple web interface for health metrics
# Serve with: python3 -m http.server 8080
```

`/Users/northsea/clawd-dmitry/.clawdbot/web/health.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Clawdbot Health Monitor</title>
    <style>
        body { font-family: system-ui; max-width: 800px; margin: 50px auto; }
        .status { padding: 20px; border-radius: 8px; margin: 20px 0; }
        .healthy { background: #d4edda; color: #155724; }
        .unhealthy { background: #f8d7da; color: #721c24; }
        .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .metric { padding: 15px; background: #f8f9fa; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>🐕 Clawdbot Health Monitor</h1>
    <div id="status"></div>
    <div class="metrics">
        <div class="metric">
            <h3>Uptime</h3>
            <p id="uptime">Loading...</p>
        </div>
        <div class="metric">
            <h3>Response Time</h3>
            <p id="response-time">Loading...</p>
        </div>
        <div class="metric">
            <h3>Incidents (24h)</h3>
            <p id="incidents">Loading...</p>
        </div>
        <div class="metric">
            <h3>Last Restart</h3>
            <p id="last-restart">Loading...</p>
        </div>
    </div>
    
    <script>
        setInterval(async () => {
            const response = await fetch('/api/health');
            const data = await response.json();
            
            document.getElementById('status').innerHTML = 
                `<div class="status ${data.status === 'ok' ? 'healthy' : 'unhealthy'}">
                    ${data.status === 'ok' ? '✅ Healthy' : '❌ Unhealthy'}
                </div>`;
            
            document.getElementById('response-time').textContent = 
                `${data.responseTime || 'N/A'}ms`;
        }, 5000);
    </script>
</body>
</html>
```

#### 4. Integration with Clawdbot Gateway
Add health endpoint to gateway that includes:
- Uptime
- Memory usage
- Active sessions
- Response times
- Error rates
- Queue sizes

---

## Combined Implementation

### Directory Structure
```
/Users/northsea/clawd-dmitry/
├── .clawdbot/
│   ├── scripts/
│   │   ├── save.sh              # Memory sweep + commit
│   │   └── watchdog.sh          # Gateway health monitor
│   ├── logs/
│   │   ├── watchdog.log
│   │   └── incidents.log
│   └── web/
│       └── health.html          # Health dashboard
├── .obsidian/                    # Obsidian config
├── .git/                        # Git repository
├── knowledge/                    # Atomic facts
├── memory/                      # Daily notes
└── ...                          # All projects
```

### Usage

#### Initialize Everything (One-Time Setup)
```bash
# 1. Initialize Git repo
cd /Users/northsea/clawd-dmitry
git init
git add .
git commit -m "Initial: Complete workspace with Obsidian + Git + Watchdog"

# 2. Create private GitHub repo
gh repo create clawd-dmitry --private --source=.

# 3. Load watchdog service
launchctl load ~/Library/LaunchAgents/com.clawdbot.watchdog.plist
launchctl start com.clawdbot.watchdog

# 4. Add aliases
echo "alias save='/Users/northsea/clawd-dmitry/.clawdbot/scripts/save.sh'" >> ~/.zshrc
echo "alias watchdog='tail -f /Users/northsea/clawd-dmitry/logs/watchdog.log'" >> ~/.zshrc
```

#### Daily Workflow
```bash
# Morning: Check everything
watchdog                    # Check watchdog logs
git pull                    # Get latest changes
open .                       # Open Obsidian

# During day: Work on projects
# Make changes, add documentation

# End of important work
save                        # Memory sweep + commit + push

# Gateway issues? Watchdog handles automatically
# Check logs: watchdog
```

---

## Benefits Summary

### Idea 1: Git + Obsidian
| Feature | Before | After |
|---------|--------|-------|
| Version control | None | Full git history |
| Cross-references | Manual | Automatic backlinks |
| Search | Find command | Obsidian full-text |
| Visual connections | None | Graph view |
| Backup | Manual | Automatic via GitHub |
| Mobile access | None | Obsidian mobile app |

### Idea 2: /save Command
| Feature | Before | After |
|---------|--------|-------|
| Commit changes | Manual commands | One command: `save` |
| Memory update | Manual | Automatic sweep |
| Daily notes | Manual | Auto-created |
| Commit message | Manual thinking | Auto-generated |
| Push to GitHub | Manual | Automatic |

### Idea 3: Watchdog
| Feature | Before | After |
|---------|--------|-------|
| Health monitoring | None | Continuous (60s) |
| Crash detection | Manual | Automatic |
| Auto-restart | None | Automatic |
| Diagnostics | Manual | Automatic |
| Incident logging | None | Automatic |

---

## Priority Implementation Order

1. **Start with Idea 1** (Setup only, 1 hour)
   - Initialize git repo
   - Create private GitHub repo
   - Open in Obsidian

2. **Add Idea 2** (Quick wins, 1-2 hours)
   - Create `/save` script
   - Add alias
   - Test with some changes

3. **Add Idea 3** (Reliability, 2-3 hours)
   - Create watchdog script
   - Set up launchd service
   - Test with simulated failures

---

## Quick Start Commands

### Idea 1: Git + Obsidian
```bash
cd /Users/northsea/clawd-dmitry
git init
gh repo create clawd-dmitry --private --source=.
```

### Idea 2: /save Command
```bash
# Create script
mkdir -p .clawdbot/scripts
# (Add save.sh content from above)

# Add alias
echo "alias save='/Users/northsea/clawd-dmitry/.clawdbot/scripts/save.sh'" >> ~/.zshrc

# Test
save
```

### Idea 3: Watchdog
```bash
# Create script
# (Add watchdog.sh content from above)

# Create service
# (Add plist content)

# Load service
launchctl load ~/Library/LaunchAgents/com.clawdbot.watchdog.plist
launchctl start com.clawdbot.watchdog

# Monitor
tail -f logs/watchdog.log
```

---

Which idea should I implement first?

# 🎯 OpenClaw Patterns - 1-Line Summary + ClawDeck Multi-Agent

## Part 1: Business Patterns (1-Line Each)

1. **Verify + Learn Loops** - Don't mark tasks done until verified, extract lessons from every run
2. **Decision Interface Pattern** - Every output ends with "Approve X or Reject X" to force decisions and capture feedback
3. **Autonomy Levels** - Agents start restricted (Level 1) and earn trust through reliable performance (up to Level 4)
4. **Workspace Architecture** - Simple text files instead of databases for easy debugging and human-readable logs
5. **Cron Scheduling** - Agents push updates to you on schedule, don't wait to be asked
6. **Security Model** - Credentials in 1Password, allowlisted users only, all decisions logged, local execution

## Part 2: Security + Efficiency (1-Line Each)

7. **1Password Integration** - Store all credentials in vault, pull via CLI, never in code
8. **Audit Logging** - Log every approve/reject decision to JSON for pattern extraction
9. **Isolated Sessions** - Each cron job gets fresh session to prevent context bleed and save tokens
10. **Subagent Spawning** - Spawn specialists for complex tasks, terminate when done (cheaper than permanent agents)
11. **Compact Often** - Regularly /compact to prevent context overload from breaking the system
12. **Learnings in Files** - Store patterns in files, not prompts, so knowledge scales without bloat

---

## What To Do Based on Learnings

### Immediate (This Week)

1. **Use decision interface pattern** - End all recommendations with "Approve/Reject"
2. **Create autonomy levels** - Define what you can do without asking
3. **Verify before completing** - Test work works, then document lessons
4. **Audit credentials** - Find all sensitive data, move to 1Password
5. **Start logging decisions** - Track approve/reject patterns

### Soon (This Month)

6. **Set up proactive crons** - Morning health check, evening summary
7. **Use isolated sessions** - Fresh session per cron job
8. **Create learnings/ folder** - Extract patterns from MEMORY.md
9. **Compact regularly** - After big tasks, weekly force compact

---

## 🚀 ClawDeck Multi-Agent Architecture

### Current Setup: Single Agent (You)

```
Dmitry (Agent)
    ├── ClawDeck operations
    ├── GPS campaigns
    ├── Legiit automation
    └── Everything else
```

**Problem:** One agent doing everything = bottleneck, slow, no parallelization

---

### Proposed: ClawDeck Multi-Agent System

```
You (Human)
    ↓
Dmitry (Chief of Staff / Orchestrator)
    │
    ├── Alfred (ClawDeck Operations Agent)
    │   ├── Monitor server health
    │   ├── Handle restarts/recovery
    │   ├── Manage tunnels/domains
    │   └── Report to Dmitry
    │
    ├── Navigator (GPS Campaign Agent)
    │   ├── Execute location simulations
    │   ├── Manage device registry
    │   ├── Run campaign workflows
    │   └── Report to Dmitry
    │
    ├── Dealer (Legiit/Purchasing Agent)
    │   ├── Process citation orders
    │   ├── Handle payment workflows
    │   ├── Track delivery status
    │   └── Report to Dmitry
    │
    └── shared-learnings/
        ├── technical-patterns/ (port forwarding, SSL, etc.)
        ├── user-preferences/ (free solutions, no-code preferred)
        ├── troubleshooting/ (restart loops, orphaned processes)
        └── communication/ (how to summarize, what to log)
```

---

## Agent Responsibilities

### Dmitry (Chief of Staff)
**Role:** Orchestrate specialists, synthesize reports, make decisions

**Autonomy Level:** 2 → 3 (can execute low-risk without asking)

**Tasks:**
- Receive your requests
- Delegate to appropriate specialist
- Synthesize specialist reports
- Make recommendations to you
- Maintain shared-learnings/

---

### Alfred (ClawDeck Operations)
**Role:** Keep ClawDeck running 24/7

**Autonomy Level:** 3 (execute low-risk, report after)

**Tasks:**
- Monitor server health (every 5 min)
- Auto-restart crashed services
- Manage tunnel connections
- Handle orphaned processes
- Update DNS/ports
- **Daily report:** "ClawDeck status: All systems operational"

**Does NOT ask about:**
- Restarting crashed services (standard recovery)
- Killing orphaned processes (safety issue)
- Rotating tunnel URLs (maintenance)
- Updating health dashboards

**ASKS about:**
- Major configuration changes
- New features or services
- Anything affecting cost > $10/month

---

### Navigator (GPS Campaigns)
**Role:** Execute GPS location campaigns

**Autonomy Level:** 3 (execute low-risk, report after)

**Tasks:**
- Run location simulation workflows
- Manage device connections
- Track campaign progress
- Handle device failures
- Generate campaign reports
- **Daily report:** "3 campaigns completed, 0 issues"

**Does NOT ask about:**
- Standard campaign execution
- Device recovery/restart
- Routine troubleshooting
- Progress updates

**ASKS about:**
- New campaign types
- Multi-device coordination
- Budget changes
- Unusual errors

---

### Dealer (Legiit/Purchasing)
**Role:** Process service purchases

**Autonomy Level:** 2 (recommend + execute on approval)

**Tasks:**
- Process citation orders
- Handle payment workflows
- Track delivery status
- Verify order completion
- Generate purchase reports
- **Daily report:** "2 orders placed, awaiting delivery"

**ASKS about EVERYTHING:**
- Financial transactions require approval
- New vendors
- Budget increases
- Order cancellations

**Why Level 2:** Money changes hands = human approval required

---

## How They Work Together

### Example: Full Stack Workflow

**You:** "Set up HTTPS for ClawDeck and create 3 GPS campaigns"

**Dmitry (Orchestrator):**
```
1. Delegates HTTPS setup → Alfred
2. Delegates GPS campaigns → Navigator
3. Runs both in parallel
4. Synthesizes reports
5. Makes final recommendation to you
```

**Alfred (ClawDeck):**
- Researches Caddy setup
- Configures port 443 forwarding
- Installs SSL certificates
- Tests HTTPS access
- Reports: "HTTPS configured, costs $0/month"

**Navigator (GPS):**
- Creates 3 campaign workflows
- Assigns devices
- Executes simulations
- Verifies locations
- Reports: "3 campaigns completed successfully"

**Dmitry:**
```
🎯 ACTION: HTTPS + GPS campaigns complete
📊 Data:
  - HTTPS: Working (Caddy + Let's Encrypt)
  - GPS: 3 campaigns executed
  - Cost: $0/month
⚡️ Impact: Secure ClawDeck + 3 campaigns delivered
💪 Effort: Medium (2 hours)

Reply: "Approve" or "Reject - [reason]"
```

---

## Benefits

### Speed
- ✅ Parallel execution (Alfred + Navigator work simultaneously)
- ✅ No waiting in queue
- ✅ 3-5x faster for complex tasks

### Reliability
- ✅ Specialists know their domain deeply
- ✅ Less context switching per agent
- ✅ Clear accountability

### Cost
- ✅ Only spawn agents when needed
- ✅ Subagents terminate after task
- ✅ Smaller contexts = cheaper

### Scalability
- ✅ Easy to add new specialists
- ✅ Shared learnings accelerate onboarding
- ✅ Clear boundaries prevent overlap

---

## Implementation Steps

### Phase 1: Create Agent Identities (Today)

**File structure:**
```
/Users/northsea/clawd-dmitry/agents/
├── dmitry/
│   ├── SOUL.md (chief of staff)
│   ├── AGENTS.md (orchestration manual)
│   └── MEMORY.md (decisions, patterns)
├── alfred/
│   ├── SOUL.md (ClawDeck operations)
│   ├── AGENTS.md (ClawDeck manual)
│   ├── MEMORY.md (server patterns)
│   └── playbooks/ (restarts, tunnels, etc.)
├── navigator/
│   ├── SOUL.md (GPS campaigns)
│   ├── AGENTS.md (GPS manual)
│   ├── MEMORY.md (campaign patterns)
│   └── playbooks/ (workflows, devices)
└── shared-learnings/
    ├── technical-patterns.md
    ├── user-preferences.md
    ├── troubleshooting.md
    └── communication.md
```

---

### Phase 2: Define Autonomy Levels (Today)

**Create:** `agents/autonomy-levels.md`

```
Level 1: Report only
- New agents start here
- No execution, insights only

Level 2: Recommend + Execute on Approval
- Financial transactions
- Major changes
- Unknown territory

Level 3: Execute Low-Risk, Report After
- Standard procedures
- Well-tested operations
- Routine maintenance

Level 4: Full Autonomy
- Weekly summary only
- Reserved for proven agents
- High-stakes domains
```

---

### Phase 3: Set Up Communication (This Week)

**Pattern:**
```
Specialist → Dmitry → You
Dmitry → Specialist (task + context)
Specialist → Dmitry (result + lessons)
Dmitry → You (synthesized recommendation)
```

**Decision Interface:**
```
🎯 ACTION [N]: [Title]
📊 Data: [From specialists]
⚡️ Impact: [Expected outcome]
💪 Effort: [Level]

Reply: "Approve N" or "Reject N - [reason]"
```

---

### Phase 4: Implement (This Week)

**Tools:**
- Use `sessions_spawn` for subagents
- Isolated sessions per agent
- Shared learnings/ folder
- Decision logging in feedback/

**Testing:**
1. Start with Alfred (ClawDeck operations)
2. Add Navigator (GPS campaigns)
3. Add Dealer (Legiit) later

---

## 🎯 Action: Implement Multi-Agent

**Option A:** "Start with Alfred (ClawDeck specialist)"
- Impact: Faster ClawDeck operations
- Effort: Low (1 hour)

**Option B:** "Implement full 3-agent system"
- Impact: 3-5x faster task execution
- Effort: Medium (3 hours)

**Option C:** "Pilot with one task first"
- Impact: Test multi-agent pattern
- Effort: Low (30 min)

**Reply:** "Approve A" or "Approve B" or "Reject - [reason]"

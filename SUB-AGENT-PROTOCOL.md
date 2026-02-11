# 🎯 New Operational Protocol

## Effective Immediately: 2026-02-09 15:40

### Rule: **Always Use Sub-Agents for Tasks > 3 Seconds**

**Mandate from Human:**
> "ALWAYS create sub-agent for any task that takes more than 3 seconds from now on."

---

## What This Means

### Before (Old Pattern)
```
You → Dmitry → Does everything himself → Reports back
```

### After (New Pattern)
```
You → Dmitry → Spawns sub-agent → Sub-agent does work → Dmitry synthesizes → Reports to you
```

---

## Decision Framework

### Task Duration Estimation

**< 3 seconds:** Dmitry handles directly
- Quick status checks
- Simple queries
- File reads
- Basic calculations

**> 3 seconds:** Spawn sub-agent
- Any research
- Multi-step procedures
- Analysis tasks
- File operations
- System commands
- Complex decisions

---

## Sub-Agent Protocol

### When Dmitry Receives a Task

**Step 1: Estimate Duration**
```
Task: "Check system health"
Estimated time: ~10 seconds
Decision: SPAWN SUB-AGENT
```

**Step 2: Identify Specialist Type**
```
Task type: Health check
Specialist needed: Operations (Alfred-type)
or: General sub-agent for one-off tasks
```

**Step 3: Spawn Sub-Agent**
```bash
sessions_spawn(
    task="Check ClawDeck system health and report",
    label="health-check",
    cleanup="delete"  # Auto-delete when done
)
```

**Step 4: Wait for Results**
```
Sub-agent executes...
Dmitry monitors progress...
Sub-agent reports results...
```

**Step 5: Synthesize and Report**
```
Dmitry reviews results...
Formats output...
Presents recommendation to human...
```

---

## Sub-Agent Types

### 1. Specialist Sub-Agents

**Alfred-type (Operations):**
- Service health checks
- Recovery procedures
- Log analysis
- Performance metrics

**Navigator-type (GPS):**
- Campaign execution
- Device management
- Location simulation

**Dealer-type (Purchasing):**
- Order processing
- Payment handling
- Delivery tracking

### 2. General Sub-Agents

**For one-off or undefined tasks:**
- Research tasks
- File operations
- Analysis work
- Testing/validation

---

## Examples

### Example 1: Health Check (10 seconds)

**❌ Old way:**
```
Dmitry: Checks Rails, checks Tailwind, checks tunnel...
(10 seconds later)
Dmitry: Here's the status...
```

**✅ New way:**
```
Dmitry: Spawning Health-Check sub-agent...
Health-Check: [executing checks]
Health-Check: Rails ✅, Tailwind ✅, Tunnel ✅
Dmitry: Synthesizing report...
Dmitry: All systems operational
```

### Example 2: File Creation (5 seconds)

**❌ Old way:**
```
Dmitry: Writing file... reading sources... formatting...
(5 seconds later)
Dmitry: File created
```

**✅ New way:**
```
Dmitry: Spawning Writer sub-agent...
Writer: [reads sources, formats, writes]
Writer: File created: output.md
Dmitry: Confirmed
```

### Example 3: Research Task (30 seconds)

**❌ Old way:**
```
Dmitry: Searching... reading... analyzing...
(30 seconds later)
Dmitry: Here's what I found...
```

**✅ New way:**
```
Dmitry: Spawning Researcher sub-agent...
Researcher: [searches, reads, analyzes]
Researcher: Found 3 relevant sources...
Dmitry: Synthesizing findings...
Dmitry: Summary: [key points]
```

---

## Benefits

### Speed
- ✅ Parallel processing (multiple sub-agents at once)
- ✅ Dmitry available for new tasks immediately
- ✅ No waiting on long-running tasks

### Efficiency
- ✅ Smaller contexts (cheaper)
- ✅ Specialized expertise per task
- ✅ Clean separation of concerns

### Scalability
- ✅ Easy to add more capacity
- ✅ Sub-agents terminate when done
- ✅ No context bloat over time

---

## Dmitry's New Role

**Before:** Doer of tasks

**After:** Orchestrator of sub-agents

**Responsibilities:**
1. Receive task from human
2. Estimate duration
3. Decide: direct handle vs. spawn sub-agent
4. If spawning: identify specialist type, create sub-agent
5. Monitor progress
6. Synthesize results
7. Report to human

---

## Auto-Spawn Triggers

**Automatic sub-agent creation for:**

- Any exec command (estimated > 3s)
- File read/write operations (multiple files)
- Research tasks (web search, documentation)
- Analysis tasks (logs, metrics, patterns)
- Multi-step procedures
- Testing/validation

**Direct handling for:**

- Single file reads
- Quick status checks
- Simple queries
- Basic calculations
- User messages

---

## Implementation

### Updated AGENTS.md Section

```markdown
## Task Execution Protocol

### Duration-Based Routing

**< 3 seconds:** Handle directly
- Quick status checks
- Simple queries
- Single file operations

**> 3 seconds:** Spawn sub-agent
- Research tasks
- Multi-step procedures
- Analysis work
- System commands
- Complex decisions

### Sub-Agent Lifecycle

1. Spawn with clear task
2. Monitor progress
3. Receive results
4. Synthesize output
5. Terminate sub-agent
6. Report to human
```

---

## Examples in Practice

### Task: "Check ClawDeck health"

**Estimated:** 10 seconds

**Action:**
```
Dmitry: Spawning Health-Check sub-agent...
[Sub-agent executes checks]
[Sub-agent reports: Rails ✅, Tailwind ✅, Tunnel ✅]
Dmitry: All systems operational
```

### Task: "Create Alfred agent"

**Estimated:** 60 seconds

**Action:**
```
Dmitry: Spawning Agent-Creator sub-agent...
[Sub-agent creates files, writes content]
[Sub-agent reports: Agent created]
Dmitry: Alfred agent ready for testing
```

### Task: "What's my public IP?"

**Estimated:** 2 seconds

**Action:**
```
Dmitry: [checks directly]
Dmitry: Your public IP is 87.208.4.155
```

---

## Compliance

**Mandatory:** ALL tasks > 3 seconds must use sub-agents

**Verification:**
- Dmitry self-monitors task duration
- Logs all sub-agent spawns
- Reports sub-agent usage in summaries

**Exception:** Emergency situations requiring immediate action

---

**Effective:** Immediately
**Updated:** 2026-02-09 15:40
**Status:** Active protocol

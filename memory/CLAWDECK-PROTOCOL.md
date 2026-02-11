# 2026-02-09 - ClawDeck Protocol Established

## New Protocol: ALL Tasks → ClawDeck

**Rule:** Every task, action, or operation MUST be tracked in ClawDeck task board.

**Mandatory Process:**
1. Start work? → Add to ClawDeck FIRST
2. Spawn sub-agent? → Add task to ClawDeck
3. Run automation? → Add task to ClawDeck
4. User request? → Add task to ClawDeck

**Task Board Location:** `/Users/northsea/clawd-dmitry/CLAWDECK-TASKS.md`

---

## Task Status Codes

- 🔄 **In Progress** - actively working on it
- ⏳ **Queued** - planned but not started
- ✅ **Completed** - finished successfully
- ❌ **Failed** - failed with errors
- 🚫 **Cancelled** - cancelled before completion
- 📋 **Archive** - older than 7 days

---

## Minimum Task Information

Each task MUST include:
- **Title** (clear, descriptive)
- **Status** (using status codes above)
- **Agent** (who's doing it)
- **Started** (timestamp)
- **Priority** (HIGH/MEDIUM/LOW)
- **Context** (why doing this)
- **Tasks** (checklist of sub-tasks)
- **Expected Deliverables** (what we get when done)

---

## Examples

### Good Task Entry
```
### 🔍 QA Website Analysis - zonsimulatie.nl
**Status:** 🔄 In Progress
**Agent:** Quest-2
**Started:** 2026-02-09 16:35 CET
**Priority:** HIGH
**Context:** Previous report had errors, user provided screenshot
**Tasks:**
1. ✅ Spawn Quest-2
2. 🔄 Navigate site
3. ⏳ Update report
**Expected:** Corrected QA report with accurate findings
```

### Bad Task Entry
```
*Working on QA stuff*
```

---

## Enforcement

**Before ANY action:**
1. Check CD - is task already there?
2. If not → ADD IT
3. Update status as you work
4. Mark complete when done

**No exceptions.**

---

## Benefits

- Single source of truth
- Easy progress checking
- Agent coordination
- Work accountability
- Historical record

---

**Established:** 2026-02-09 17:17 CET
**Status:** ACTIVE PROTOCOL
**Compliance:** MANDATORY

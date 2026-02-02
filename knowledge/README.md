# PARA Memory System - Quick Reference

## Overview
Three-layer memory system based on Nat Eliason's AI memory framework:
1. **Knowledge Graph** (atomic facts in JSON) - Structured, queryable
2. **Daily Notes** (episodic memory) - Raw logs
3. **Tacit Knowledge** (MEMORY.md) - Curated wisdom

## Directory Structure
```
/Users/northsea/clawd-dmitry/
├── knowledge/
│   ├── facts.json              # Atomic facts database
│   ├── retrieval.js            # Query and management system
│   ├── heartbeat.sh            # Memory extraction script
│   ├── Projects/               # Active work with goals
│   ├── Areas/                  # Ongoing responsibilities
│   ├── Resources/              # Topics of interest
│   └── Archives/               # Completed/inactive items
├── memory/
│   ├── YYYY-MM-DD.md           # Daily notes (auto-created)
│   └── MEMORY_SYSTEM.md        # This system's documentation
├── MEMORY.md                   # Curated long-term memory
└── AGENTS.md                   # Agent workspace rules
```

## Usage Commands

### Search Facts
```bash
node knowledge/retrieval.js search "<query>"
```

### List Facts by Tier
```bash
node knowledge/retrieval.js list
```

### Add New Fact Manually
```bash
node knowledge/retrieval.js add "<entity>" "<fact text>"
```

### Run Heartbeat (Extract & Maintain)
```bash
./knowledge/heartbeat.sh
```

## Atomic Fact Schema
```json
{
  "id": "fact-20260131-001",
  "entity": "project-name",
  "fact": "Atomic statement (single fact)",
  "source": "daily-note-2026-01-31",
  "created_at": "2026-01-31T21:54:00Z",
  "last_accessed": "2026-01-31T21:54:00Z",
  "access_count": 1,
  "importance": 0.8,
  "status": "active",
  "tags": ["project", "completed"],
  "superseded_by": null
}
```

## Memory Decay Algorithm
```
score = base * (1.0 + log(accesses) * 0.1) * (1.0 - days_since_access * 0.01)
```

- **Base importance:** Manual rating (0.0-1.0)
- **Recency boost:** Decays 0.01 per day since access
- **Frequency multiplier:** More access = higher score

## Tiered Retrieval
- **Tier 1:** score > 0.7, accessed ≤ 7 days
- **Tier 2:** score > 0.4, accessed ≤ 30 days
- **Tier 3:** Everything else

Context window fills T1 → T2 → T3 before raw daily notes.

## PARA Method

### Projects (active work)
- Clear goals and deadlines
- Example: "Launch transcription app v2"
- Move to Archives/ when complete

### Areas (ongoing responsibilities)
- No completion date
- Example: "Health", "Finances", "Professional Development"

### Resources (topics of interest)
- Reference materials, learning topics
- Example: "AI/ML", "Web Development", "Productivity"

### Archives (completed/inactive)
- Completed projects (with date suffix)
- Inactive areas
- Outdated resources

## Session Workflow

### At Session Start
1. Read `SOUL.md` and `USER.md`
2. Read today's daily note: `memory/YYYY-MM-DD.md`
3. Search facts before answering: Use `memory_search` tool
4. (Main session only) Read `MEMORY.md`

### During Session
- Record important facts to `knowledge/facts.json`
- Update daily note with key events
- Move completed projects to Archives/

### Heartbeat (2-4x/day)
1. Run `heartbeat.sh` to extract facts from daily notes
2. Update importance scores (decay calculation)
3. Archive low-value facts
4. Update `MEMORY.md` with distilled insights
5. Organize `knowledge/` into PARA structure

## Facts Lifecycle
- **Created** → Extracted from daily notes or conversations
- **Active** → In regular rotation
- **Superseded** → Marked obsolete, retained for audit
- **Archived** → Low importance, cold storage
- **Never deleted** → All facts retained

## Example Facts (Current Database)
- 12 facts loaded (2026-01-31)
- Projects: transcription-app (completed)
- Areas: ai-development
- Top facts by importance: deployment preference, workspace location, completed projects

## Integration with Clawdbot
- `memory_search` tool queries `knowledge/facts.json`
- Heartbeat cron job runs extraction automatically
- Facts auto-load based on tiered retrieval
- Daily notes auto-created as needed

---

**Documentation:** `memory/MEMORY_SYSTEM.md` for full architecture details.

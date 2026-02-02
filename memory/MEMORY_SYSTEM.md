# PARA Memory System Architecture

*Based on Nat Eliason's AI memory framework*

## Three-Layer Memory Structure

### 1. Long-term Knowledge Graph (knowledge/)
- **Atomic facts** in JSON format
- Structured, queryable data
- Linked to entities (people, projects, concepts)
- Uses PARA organization

### 2. Daily Notes (memory/YYYY-MM-DD.md)
- **Episodic memory** - raw logs of interactions
- Auto-extracted facts feed into knowledge graph
- Never deleted, only archived
- Heartbeat process distills durable facts

### 3. Tacit Knowledge (MEMORY.md, AGENTS.md)
- **Procedural memory** - how to work, preferences
- Curated wisdom and patterns
- Updated manually during heartbeats

## PARA Organization

```
knowledge/
├── Projects/          # Active work with clear goals
├── Areas/            # Ongoing responsibilities
├── Resources/        # Reference material, topics of interest
└── Archives/         # Completed projects, inactive areas
```

## Atomic Facts Schema

```json
{
  "id": "fact-uuid",
  "entity": "person/project/concept",
  "fact": "Atomic statement",
  "source": "daily-note-2026-01-27",
  "created_at": "2026-01-27T09:23:00Z",
  "last_accessed": "2026-01-31T21:54:00Z",
  "access_count": 3,
  "importance_score": 0.8,
  "status": "active",
  "tags": ["technical", "preference"],
  "superseded_by": null
}
```

## Memory Decay Algorithm

Importance score updates based on:
- **Recency boost**: +0.1 per access (decays 0.01/day)
- **Frequency multiplier**: 1.0 + (log(access_count) * 0.1)
- **Base importance**: Manual rating or extraction confidence

Formula: `score = base * (1.0 + log(accesses) * 0.1) * (1.0 - days_since_access * 0.01)`

## Tiered Retrieval

**Tier 1 (High priority):** score > 0.7, accessed within 7 days
**Tier 2 (Medium priority):** score > 0.4, accessed within 30 days
**Tier 3 (Low priority):** score ≤ 0.4 or not accessed recently

Context window fills in tier order before looking at raw daily notes.

## Heartbeat Process

Runs periodically (configurable, default 2-4 times/day):

1. **Read recent daily notes** (last 24-48h)
2. **Extract atomic facts** using AI analysis
3. **Update importance scores** based on recency/frequency
4. **Archive low-value facts** (score < 0.2, not accessed in 90+ days)
5. **Update MEMORY.md** with significant insights
6. **Rebuild knowledge graph** if needed

## Facts Lifecycle

- **Created**: Extracted from daily notes or conversations
- **Active**: In regular rotation, accessible to queries
- **Superseded**: Marked as obsolete but retained (e.g., changed preference)
- **Archived**: Low importance, moved to cold storage
- **Never deleted**: All facts retained for audit trail

---

*This system enables durable, hierarchical memory that improves over time.*

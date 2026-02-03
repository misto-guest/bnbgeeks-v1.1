# Planning with Files - Manus-Style Workflow

**Work like Manus** — the AI agent company Meta acquired for $2 billion.

## Overview

This skill transforms your workflow to use persistent markdown files for planning, progress tracking, and knowledge storage. Instead of relying on volatile context windows, important information is written to disk as persistent files.

## When to Use This Skill

**Use for:**
- Multi-step tasks (3+ steps)
- Research tasks
- Building/creating projects
- Tasks spanning many tool calls
- Complex debugging sessions
- Feature implementation with multiple files

**Skip for:**
- Simple questions
- Single-file edits
- Quick lookups
- One-line fixes

## The 3-File Pattern

For every complex task, create THREE files in your workspace root:

```
task_plan.md      → Track phases and progress
findings.md       → Store research and discoveries
progress.md       → Session log and test results
```

### Core Principle

```
Context Window = RAM (volatile, limited)
Filesystem = Disk (persistent, unlimited)

→ Anything important gets written to disk.
```

## How to Use

### Step 1: Create Planning Files

When starting a complex task, create the three files using these templates:

**task_plan.md template:**
```markdown
# Task Plan

## Objective
[What you're trying to achieve]

## Context
[Relevant background, constraints, requirements]

## Phases

### Phase 1: [Name]
- [ ] Step 1.1
- [ ] Step 1.2
- [ ] Step 1.3

### Phase 2: [Name]
- [ ] Step 2.1
- [ ] Step 2.2

### Phase 3: [Name]
- [ ] Step 3.1
- [ ] Step 3.2

## Findings Summary
[Link to findings.md for detailed research]

## Progress Log
[Link to progress.md for session logs]
```

**findings.md template:**
```markdown
# Findings

## Research Notes

### [Topic 1]
[What you discovered]

### [Topic 2]
[What you discovered]

## Key Decisions
[Important decisions made and why]

## References
[Links, docs, resources]
```

**progress.md template:**
```markdown
# Progress Log

## Session 1 - [Date]
**Goal:** [What you aimed to accomplish]

### Actions Taken
- [Timestamp] Action 1
- [Timestamp] Action 2

### Results
[What happened]

### Errors Encountered
- [Error description] → [Solution or note]

### Next Steps
- [ ] Next action item
```

### Step 2: Work with Persistent Reminders

As you work:

1. **Before major decisions** — Re-read `task_plan.md` to stay aligned
2. **After every 2 operations** — Save findings to `findings.md`
3. **When errors occur** — Log them in `progress.md`
4. **After completing steps** — Update checkboxes in `task_plan.md`

### Step 3: Verify Completion

Before finishing:
1. Review all phases in `task_plan.md`
2. Ensure all checkboxes are checked
3. Document final outcomes in `progress.md`

## Key Rules

1. **Create Plan First** — Never start without `task_plan.md`
2. **The 2-Action Rule** — Save findings after every 2 view/browser operations
3. **Log ALL Errors** — They help avoid repetition
4. **Never Repeat Failures** — Track attempts, mutate approach
5. **Update Checkboxes** — Mark progress as you complete steps

## Workflow Example

### Research Task
```
1. Create task_plan.md with research phases
2. Search web → Save key findings to findings.md (every 2 searches)
3. Read docs → Save insights to findings.md
4. Synthesize → Update task_plan.md checkboxes
5. Document results → Add to progress.md
```

### Debugging Task
```
1. Create task_plan.md with debugging phases
2. Reproduce issue → Log in progress.md
3. Investigate → Save findings to findings.md
4. Try fixes → Document attempts in progress.md
5. Resolve → Update task_plan.md with solution
```

### Feature Implementation
```
1. Create task_plan.md with implementation phases
2. Design → Save decisions to findings.md
3. Implement → Mark checkboxes in task_plan.md
4. Test → Log results in progress.md
5. Deploy → Finalize task_plan.md
```

## Error Logging Pattern

When you encounter an error, log it like this in `progress.md`:

```markdown
### Error: [Brief description]
**When:** [Timestamp]
**Context:** [What you were doing]
**Error:** [Error message]
**Attempted fixes:**
- [Fix 1] → Failed because [reason]
- [Fix 2] → Success!
```

This prevents repeating the same mistakes.

## Session Recovery

If your context fills up and you need to continue:

1. Read `task_plan.md` to understand current state
2. Read `progress.md` for recent session history
3. Read `findings.md` for key discoveries
4. Continue from where you left off

The files are your persistent memory — they survive context resets.

## Benefits

✅ **No goal drift** — Plan is always visible
✅ **No hidden errors** — All failures logged
✅ **No context stuffing** — Research stored in files
✅ **Easy recovery** — Files persist across sessions
✅ **Clear progress** — Checkboxes show what's done
✅ **Better decisions** — Re-read plan before acting

## Advanced Tips

### For Long Projects
- Break `task_plan.md` into multiple phase files if needed
- Use `findings.md` as a knowledge base
- Date your sessions in `progress.md`

### For Team Collaboration
- Commit these files to git
- Use them as project documentation
- Share findings via `findings.md`

### For Learning
- Review `progress.md` to see what worked
- Build a knowledge library in `findings.md`
- Reuse successful patterns from `task_plan.md`

## Integration with Clawdbot

This skill is automatically available in your workspace. To use it:

1. Mention "Plan with files" in any prompt
2. Clawdbot will create the 3-file structure
3. Work with persistent reminders throughout

## Quick Start Command

```
Plan with files for [task description]
```

Example:
```
Plan with files for implementing YouTube transcription with fallback methods
```

This will:
1. Create task_plan.md with implementation phases
2. Set up findings.md for research notes
3. Initialize progress.md for logging
4. Begin execution with persistent tracking

---

**Remember:** The filesystem is your persistent memory. Use it.

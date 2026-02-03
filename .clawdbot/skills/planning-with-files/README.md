# Planning with Files - Manus-Style Workflow Skill

**Work like Manus** — the AI agent company Meta acquired for $2 billion.

## What This Does

Transforms your workflow to use persistent markdown files instead of volatile context windows. Based on the proven pattern from Manus AI that made them worth billions.

## Quick Start

### Option 1: Automatic (Recommended)

Simply mention "Plan with files" in any prompt:

```
Plan with files for implementing YouTube transcription with fallback methods
```

Clawdbot will automatically create the 3-file structure and begin working.

### Option 2: Manual Scripts

```bash
# Initialize planning files in current directory
~/.clawdbot/skills/planning-with-files/scripts/init.sh

# Check completion status
~/.clawdbot/skills/planning-with-files/scripts/check-complete.sh
```

## The 3-File Pattern

```
task_plan.md      → Track phases and progress (checkboxes)
findings.md       → Store research and discoveries
progress.md       → Session log and test results
```

## When to Use

✅ **Use for:**
- Multi-step tasks (3+ steps)
- Research projects
- Feature implementation
- Debugging sessions
- Complex refactoring

❌ **Skip for:**
- Simple questions
- Single-file edits
- Quick lookups

## Key Rules

1. **Create Plan First** — Never start without task_plan.md
2. **The 2-Action Rule** — Save findings after every 2 operations
3. **Log ALL Errors** — Prevents repeating mistakes
4. **Update Checkboxes** — Mark progress as you go

## Workflow Example

### For a Debugging Task:
```
1. Run init.sh → Creates task_plan.md with debugging phases
2. Reproduce issue → Log in progress.md
3. Investigate → Save findings to findings.md (every 2 steps)
4. Try fixes → Document attempts in progress.md
5. Resolve → Update task_plan.md checkboxes
6. Run check-complete.sh → Verify all done
```

### For a Feature Task:
```
1. Run init.sh → Creates task_plan.md with implementation phases
2. Design → Save decisions to findings.md
3. Implement → Mark checkboxes in task_plan.md
4. Test → Log results in progress.md
5. Deploy → Finalize task_plan.md
```

## File Templates

### task_plan.md Structure
```markdown
## Objective
[What you're achieving]

## Phases
### Phase 1: Name
- [ ] Step 1
- [ ] Step 2

## Findings Summary
[Link to findings.md]
```

### findings.md Structure
```markdown
## Research Notes
[What you discovered]

## Key Decisions
[Important choices and why]

## References
[Links and resources]
```

### progress.md Structure
```markdown
## Session 1 - Date
**Goal:** [Aim]

### Actions Taken
- [Time] Action 1
- [Time] Action 2

### Errors Encountered
[Error → Solution]

### Next Steps
[ ] Next action
```

## Benefits

✅ **No goal drift** — Plan always visible
✅ **No hidden errors** — All failures logged
✅ **No context stuffing** — Research stored in files
✅ **Easy recovery** — Files survive context resets
✅ **Clear progress** — Checkboxes show what's done

## Scripts

### init.sh
Creates the three planning files with templates:
- Checks for existing files (prompts to overwrite)
- Adds timestamps
- Sets up proper structure

### check-complete.sh
Verifies task completion:
- Counts checkboxes (completed vs remaining)
- Checks findings.md and progress.md
- Shows incomplete items
- Provides next steps

## Advanced Usage

### For Long Projects
- Break task_plan.md into multiple phase files
- Use findings.md as a knowledge base
- Date sessions in progress.md

### For Team Work
- Commit these files to git
- Use as project documentation
- Share findings via findings.md

### For Learning
- Review progress.md to see what worked
- Build knowledge library in findings.md
- Reuse successful patterns from task_plan.md

## Session Recovery

If context fills up:
1. Read task_plan.md → Understand current state
2. Read progress.md → See recent history
3. Read findings.md → Get key discoveries
4. Continue from where you left off

The files are your persistent memory!

## Error Logging Pattern

Log errors in progress.md like this:

```markdown
### Error: Can't connect to database
- **When:** 2026-02-02 14:30
- **Context:** Trying to run migrations
- **Error:** Connection refused
- **Attempted fixes:**
  - Restarted DB → Failed, still connection refused
  - Checked credentials → Success! Wrong password in .env
- **Final solution:** Updated .env with correct password
```

This prevents repeating the same debugging steps.

## Template Locations

Templates are stored in:
```
~/.clawdbot/skills/planning-with-files/templates/
├── task_plan.md
├── findings.md
└── progress.md
```

You can customize these templates to fit your workflow!

## Credits

Based on the [planning-with-files](https://github.com/OthmanAdi/planning-with-files) skill by OthmanAdi, inspired by Manus AI's context engineering patterns that made them worth $2 billion.

## License

MIT License — feel free to use, modify, and distribute.

---

**Remember:** The filesystem is your persistent memory. Use it! 🚀

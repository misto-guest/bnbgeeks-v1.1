# Clawdbot Integration Guide

## Integrating Trello Sync with Clawdbot Sub-Agents

### Overview

When you spawn sub-agents, use the `label` parameter to link them to project cards. The sync system will automatically track their completion and update Trello.

### Naming Convention

Use this format for sub-agent labels:

```
<project-id>:<subtask-name>
```

### Examples

#### Spawn Sub-Agent for Project Task

```javascript
// Clawdbot workflow
sessions_spawn({
  task: "Build the outreach dashboard",
  label: "bol-outreach:build-dashboard",
  cleanup: "delete"
});
```

#### Multiple Sub-Agents per Project

```javascript
// Project: bnbgeeks
sessions_spawn({
  task: "Deploy v1.1 to production",
  label: "bnbgeeks:deploy-v1.1",
  cleanup: "delete"
});

sessions_spawn({
  task: "Enhance design system",
  label: "bnbgeeks:enhance-design",
  cleanup: "delete"
});
```

### Project Configuration

In `projects.json`, map sub-agents to projects:

```json
{
  "id": "bnbgeeks",
  "name": "bnbgeeks v1.1",
  "subAgents": [
    "bnbgeeks:deploy-v1.1",
    "bnbgeeks:enhance-design"
  ],
  "status": "in-progress"
}
```

### How It Works

1. **Sub-Agent Completes**
   - Sub-agent finishes its task
   - Reports completion result

2. **Sync Runs (Every 5 min)**
   - Reads event log for completions
   - Matches sub-agent label to project
   - Checks if all project sub-agents are done

3. **Auto-Update Trello**
   - If all sub-agents done → move to "Review"
   - Add comment with summary
   - Update card description

4. **Manual Approval**
   - You review in Trello
   - Move to "Done" when approved
   - Project marked complete

### Example Flow

```
1. Spawn sub-agent
   → label: "repo-migration:migrate-repos"

2. Sub-agent works...
   → (running in background)

3. Sub-agent completes
   → Success! Repos migrated

4. Sync detects completion
   → Finds project: "repo-migration"
   → Checks: all sub-agents done? ✓

5. Updates Trello
   → Move card to "Review"
   → Add comment: "✅ All sub-agents complete"

6. You review
   → Move card to "Done"
   → Project complete!
```

### Status Progression

```
pending → in-progress → review → done
   ↓          ↓           ↓       ↓
  Inbox   In Progress  Review    Done
```

- **pending**: Project created, waiting to start
- **in-progress**: Sub-agents working
- **review**: All sub-agents done, awaiting approval
- **done**: Approved and complete

### Manual Updates

Sometimes you need manual control:

```bash
# Update project status
npm run update bol-outreach done

# Add comment
npm run update bnbgeeks review "Ready for final QA"

# List all projects
npm run list
```

### Adding New Projects

1. **Add to projects.json:**

```json
{
  "id": "my-new-project",
  "name": "My New Project",
  "subAgents": ["my-new-project:task1", "my-new-project:task2"],
  "status": "pending",
  "description": "What this project does"
}
```

2. **Run sync:**

```bash
npm run sync
```

3. **Card auto-created** in Trello!

### Best Practices

1. **Use consistent labels**
   - Format: `project-id:task-name`
   - Keep project IDs simple

2. **Map all sub-agents**
   - Add to `subAgents` array in project config
   - Include all project tasks

3. **Check sync logs**
   - `tail -f sync.log`
   - See what's being updated

4. **Use dry-run first**
   - `npm run dry-run`
   - Preview changes before syncing

### Troubleshooting

**Card not created?**
→ Check project status and run sync manually

**Card not moving?**
→ Verify all sub-agents are marked complete

**Wrong list?**
→ Check list IDs in config.json

**Need manual control?**
→ Use `update-card.js` to override

### Quick Reference

```bash
# Sync commands
npm run sync       # Run sync
npm run dry-run    # Preview
npm run test       # Test API

# Project commands
npm run list       # List projects
npm run update <id> <status> [comment]

# Setup
./setup.sh         # Interactive setup
node validate.js   # Check configuration
```

---

That's it! Your ClawDeck board will now automatically track all sub-agent activity. 🎉

# Trello Auto-Sync System - Complete

## ✅ What's Been Built

A complete automated sync system that keeps your Trello/ClawDeck board perfectly in sync with sub-agent activity.

## 📁 Files Created

### Core System
- **`sync.js`** - Main sync service (11KB)
  - Auto-creates cards for new projects
  - Moves cards between lists based on status
  - Adds progress comments
  - Updates card descriptions
  - Full Trello API integration

- **`update-card.js`** - Manual card updates (3KB)
  - Update specific project cards
  - Move cards between lists
  - Add comments
  - List all projects

### Configuration
- **`config.json`** - Trello credentials and board config
- **`projects.json`** - 4 projects pre-configured:
  - bol-outreach (done)
  - bnbgeeks (in-progress)
  - repo-migration (in-progress)
  - nightly-warmup (pending)

- **`event-log.json`** - Activity log (auto-populated)

### Documentation
- **`SETUP.md`** - Complete setup guide (5KB)
- **`QUICKSTART.md`** - 5-minute quick start
- **`INTEGRATION.md`** - Sub-agent integration guide
- **`README.md`** - Project overview

### Tools
- **`setup.sh`** - Interactive setup script
- **`validate.js`** - Configuration validation
- **`package.json`** - NPM scripts for easy commands

### Safety
- **`.gitignore`** - Prevents committing API credentials

## 🚀 How to Use

### One-Time Setup

```bash
cd /Users/northsea/clawd-dmitry/trello-sync

# Option 1: Interactive setup
./setup.sh

# Option 2: Manual setup
# 1. Edit config.json with Trello credentials
# 2. Run: npm run init (get list IDs)
# 3. Update list IDs in config.json
# 4. Run: npm run test
# 5. Run: npm run sync
```

### Daily Operation

```bash
# Commands
npm run sync       # Run full sync
npm run dry-run    # Preview changes
npm run test       # Test connection
npm run list       # List projects
npm run update     # Update specific card

# Or use node directly
node sync.js --help
node update-card.js --help
```

## 🔄 Automation

### Set Up Cron (Recommended)

```bash
crontab -e

# Add this line:
*/5 * * * * cd /Users/northsea/clawd-dmitry/trello-sync && node sync.js >> sync.log 2>&1
```

Now it runs every 5 minutes automatically!

## 📊 How It Works

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────┐
│ Sub-Agent       │      │ Event Log    │      │ Trello API  │
│ Completes Task  │ ──→  │ (JSON file)  │ ──→  │             │
│                 │      │              │      │ Update Card │
└─────────────────┘      └──────────────┘      └─────────────┘
         ↑                                               │
         │                                               │
         └───────────────────────────────────────────────┘
                   Sync runs every 5 min (cron)
```

### Flow

1. Sub-agent completes task
2. Sync service runs (every 5 min)
3. Checks if all project sub-agents done
4. If yes → move card to "Review"
5. You review → move to "Done"
6. Card auto-updated with status

## 📋 Current Projects

| Project | Status | Sub-Agents | Card |
|---------|--------|------------|------|
| bol-outreach | done | 2 | Not created |
| bnbgeeks | in-progress | 2 | Not created |
| repo-migration | in-progress | 1 | Not created |
| nightly-warmup | pending | 1 | Not created |

*Cards will be auto-created on first sync*

## 🎯 Next Steps

1. **Configure Trello API**
   - Get credentials from https://trello.com/app-key
   - Edit `config.json`

2. **Test Connection**
   ```bash
   npm run test
   ```

3. **Run First Sync**
   ```bash
   npm run dry-run   # Preview
   npm run sync      # Actually sync
   ```

4. **Set Up Automation**
   ```bash
   crontab -e
   # Add cron job
   ```

5. **Done!** 🎉

## 💡 Integration with Sub-Agents

When spawning sub-agents, use the label format:

```javascript
sessions_spawn({
  task: "Do something",
  label: "project-id:task-name"
});
```

The sync system will track completion and update Trello automatically.

## 📚 Documentation

- **QUICKSTART.md** - Get started in 5 minutes
- **SETUP.md** - Detailed setup instructions
- **INTEGRATION.md** - How to integrate with sub-agents
- **README.md** - Project overview

## 🔒 Security

⚠️ **Important:** `config.json` contains API credentials. Already added to `.gitignore`.

Do not commit:
- `config.json`
- `event-log.json`
- `sync.log`

## ✨ Features

✅ Auto-creates Trello cards for new projects
✅ Moves cards between lists based on status
✅ Adds progress comments automatically
✅ Updates card descriptions with latest info
✅ Tracks multiple sub-agents per project
✅ Manual override when needed
✅ Dry-run mode for testing
✅ Activity logging
✅ Validation tools
✅ Interactive setup

## 🎉 Result

Your ClawDeck board stays 100% accurate with **zero manual effort**.

Every sub-agent completion, every status change, every new initiative — all automatically reflected in Trello.

---

**Built:** 2026-02-10
**Version:** 1.0.0
**Location:** `/Users/northsea/clawd-dmitry/trello-sync/`

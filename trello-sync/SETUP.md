# Trello Auto-Sync Setup Guide

## Overview

This system automatically syncs project cards in Trello (ClawDeck board) based on sub-agent activity, keeping your project board always accurate with zero manual effort.

## Quick Setup (5 minutes)

### Step 1: Get Trello API Credentials

1. **Get API Key:**
   - Visit: https://trello.com/app-key
   - Copy your "Key" (API Key)

2. **Get API Token:**
   - On the same page, click "Token" → "Generate Token"
   - Give it a name like "Clawdbot Sync"
   - Copy the token

### Step 2: Get Board & List IDs

1. **Get Board ID:**
   - Open your Trello board in browser
   - Board ID is in URL: `https://trello.com/b/[BOARD_ID]/[board-name]`
   - Or run: `node sync.js --init` (after adding API credentials)

2. **Get List IDs:**
   - Run: `node sync.js --init`
   - This will list all lists on your board with their IDs
   - Copy the IDs for your workflow lists (Inbox, In Progress, Review, Done)

### Step 3: Configure

Edit `config.json`:

```json
{
  "trello": {
    "apiKey": "paste-your-api-key",
    "apiToken": "paste-your-token",
    "boardId": "paste-your-board-id",
    "lists": {
      "inbox": "paste-inbox-list-id",
      "inProgress": "paste-in-progress-list-id",
      "review": "paste-review-list-id",
      "done": "paste-done-list-id"
    }
  },
  "sync": {
    "intervalMinutes": 5,
    "dryRun": false,
    "autoCreateCards": true,
    "addComments": true
  }
}
```

### Step 4: Test

```bash
# Test connection
node sync.js --test

# Preview changes (dry run)
node sync.js --dry-run

# Run actual sync
node sync.js
```

## Usage

### Automatic Sync (Recommended)

Run every 5 minutes via cron:

```bash
# Edit crontab
crontab -e

# Add this line:
*/5 * * * * cd /Users/northsea/clawd-dmitry/trello-sync && node sync.js >> sync.log 2>&1
```

### Manual Commands

```bash
# Full sync
node sync.js

# Initialize board (get list IDs)
node sync.js --init

# Test connection
node sync.js --test

# Dry run (preview)
node sync.js --dry-run

# List tracked projects
node update-card.js --list

# Update specific project
node update-card.js <project-id> <status> [comment]

# Example:
node update-card.js bol-outreach done "Completed all sub-tasks"
```

## Project Tracking

Projects are defined in `projects.json`. Each project has:

- `id`: Unique identifier
- `name`: Card name in Trello
- `cardId`: Trello card ID (auto-filled)
- `subAgents`: Array of sub-agent labels to track
- `status`: Current status (pending/in-progress/review/done)
- `description`: Project description
- `lastUpdate`: Timestamp

### Adding New Projects

Add to `projects.json`:

```json
{
  "id": "my-project",
  "name": "My Awesome Project",
  "cardId": null,
  "subAgents": ["sub-agent-label-1", "sub-agent-label-2"],
  "status": "pending",
  "lastUpdate": "2026-02-10T00:00:00Z",
  "description": "Project description here"
}
```

## How It Works

1. **Sync Service** (`sync.js`):
   - Runs every 5 minutes (via cron)
   - Reads projects from `projects.json`
   - Checks Trello for existing cards
   - Creates new cards if needed
   - Moves cards based on status
   - Adds comments with updates
   - Updates card descriptions

2. **Event Log** (`event-log.json`):
   - Tracks all sync activity
   - Stats: cards created/updated
   - Last sync timestamp

3. **Card Updates** (`update-card.js`):
   - Manually update specific cards
   - Move to different lists
   - Add comments

## Status Workflow

Projects move through stages:

```
pending → in-progress → review → done
    ↓          ↓           ↓       ↓
  Inbox   In Progress  Review    Done
```

- **pending**: New project, not started
- **in-progress**: Active work in progress
- **review**: Ready for review/approval
- **done**: Complete

## Troubleshooting

### "Trello API credentials not configured"
→ Edit `config.json` with your API key and token

### "Cannot proceed without Trello connection"
→ Check your API credentials and board ID

### "Card not found, creating..."
→ This is normal! It will auto-create cards for new projects

### "Failed to update card"
→ Check that list IDs in config.json are correct

## Files

- `config.json` - Trello credentials and board config
- `projects.json` - Project definitions
- `event-log.json` - Sync activity log
- `sync.js` - Main sync service
- `update-card.js` - Manual card update utility
- `SETUP.md` - This file

## Security

⚠️ **Important:** `config.json` contains API credentials. Do not commit to git.

Add to `.gitignore`:
```
trello-sync/config.json
trello-sync/event-log.json
trello-sync/sync.log
```

## Next Steps

1. ✅ Set up Trello API credentials
2. ✅ Configure board and list IDs
3. ✅ Test with `node sync.js --dry-run`
4. ✅ Run first sync: `node sync.js`
5. ✅ Set up cron for automatic sync
6. ✅ Add new projects to `projects.json` as needed

Your ClawDeck board will now stay perfectly in sync with your project activity! 🎉

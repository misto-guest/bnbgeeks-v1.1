# Trello Auto-Sync System

Automatically keeps your ClawDeck (Trello) board in sync with project activity and sub-agent completions.

## What It Does

- ✅ Auto-creates Trello cards for new projects
- ✅ Moves cards between lists based on project status
- ✅ Adds progress comments to cards
- ✅ Updates card descriptions with latest info
- ✅ Zero manual effort required after setup

## Quick Start

1. **Get Trello API credentials** (see [SETUP.md](SETUP.md))
2. **Configure** `config.json`
3. **Run:** `node sync.js --test`
4. **Set up cron:** `*/5 * * * * cd /Users/northsea/clawd-dmitry/trello-sync && node sync.js`

## Documentation

See [SETUP.md](SETUP.md) for complete setup instructions.

## Commands

```bash
npm run sync        # Run full sync
npm run init        # Initialize board (get list IDs)
npm run test        # Test Trello connection
npm run dry-run     # Preview changes
npm run list        # List tracked projects
```

## Files

- `sync.js` - Main sync service
- `update-card.js` - Manual card updates
- `projects.json` - Project definitions
- `config.json` - Trello configuration (add this yourself)
- `event-log.json` - Activity log (auto-generated)

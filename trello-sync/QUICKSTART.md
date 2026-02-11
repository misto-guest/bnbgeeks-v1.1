# Quick Start Guide

## 5-Minute Setup

### 1. Get Trello Credentials (2 min)

```
→ https://trello.com/app-key
→ Copy "Key"
→ Click "Token" → "Generate Token"
→ Copy token
```

### 2. Configure (2 min)

Edit `config.json`:

```json
{
  "trello": {
    "apiKey": "paste-key",
    "apiToken": "paste-token",
    "boardId": "get-from-url",
    "lists": {
      "inbox": "will-get-next",
      "inProgress": "will-get-next",
      "review": "will-get-next",
      "done": "will-get-next"
    }
  }
}
```

Get board ID from URL: `trello.com/b/[BOARD_ID]/[name]`

### 3. Get List IDs (1 min)

```bash
npm run init
```

Copy list IDs into `config.json`.

### 4. Test & Run

```bash
npm run test      # Test connection
npm run dry-run   # Preview changes
npm run sync      # Run sync!
```

### 5. Automate

```bash
crontab -e
# Add: */5 * * * * cd /path/to/trello-sync && node sync.js >> sync.log 2>&1
```

## Done! 🎉

Your ClawDeck board will now auto-update every 5 minutes.

## Daily Usage

```bash
npm run list       # See all projects
npm run sync       # Manual sync
npm run update <id> <status>  # Manual update
```

## Need Help?

- `SETUP.md` - Detailed setup
- `INTEGRATION.md` - Sub-agent integration
- `README.md` - Overview

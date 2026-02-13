# Quick Start Guide

## Web Interface (Easiest)
```bash
# Open in browser
open web-app.html
```

Then:
1. Enter your query or paste a Google URL
2. Select number of pages
3. Click "🚀 Start Search"
4. Copy results

## Command-Line (Advanced)
```bash
# Basic search
node cli.js "your query"

# Multiple pages
node cli.js "your query" --pages 5

# From URL
node cli.js --url "https://google.com/search?q=test" --pages 3

# JSON output
node cli.js "your query" --format json
```

## Common Examples

### SEO Research
```bash
node cli.js "site:coinsnight.com" --pages 5
```

### Competitor Analysis
```bash
node cli.js "best crypto exchanges Netherlands" --pages 10
```

### Bulk Export
```bash
node cli.js "Dutch SEO agencies" --pages 20 --format json > results.json
```

## Features
✅ Pagination (1-20 pages)
✅ URL extraction
✅ Rate limiting
✅ Copy or JSON format
✅ Progress tracking
✅ Web interface

## API Info
- Endpoint: https://google.serper.dev/search
- Key: e09ed258e1c8db784354868198bd915e1fb7181d
- Limit: 2,500 searches/month

Need help? See README.md

# SEO Backlinks Scraper - Complete Guide

## Overview

An improved SEO backlinks scraper with deduplication, markdown output, and automated weekly scraping.

## Features

✅ **Simple Query Input** - CLI or web interface
✅ **Auto-Deduplication** - Only shows new unique links
✅ **Markdown Output** - Copy-paste ready results
✅ **JSON Storage** - Structured data for analysis
✅ **Comprehensive Logging** - All actions logged with timestamps
✅ **Weekly Automation** - Scheduled scrapes with summaries
✅ **Web UI** - Easy-to-use interface

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/northsea/clawd-dmitry/seo-backlinks-search
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Run Your First Scrape

**Option A: CLI**
```bash
./scrape.sh "seo link building services"
```

**Option B: Python Direct**
```bash
source venv/bin/activate
python3 scraper.py "seo link building services" --pages 2
```

**Option C: Web Interface**
```bash
source venv/bin/activate
python3 web.py
# Open http://localhost:5000
```

## Usage Examples

### Basic Scrape (1 page)
```bash
./scrape.sh "backlink indexer tools"
```

### Multi-Page Scrape
```bash
./scrape.sh "guest posting services" 3
```

### Different Region
```bash
python3 scraper.py "blogger outreach" --pages 2 --region uk
```

## Output Files

Results are saved to the `results/` directory:

```
results/
├── seo_link_building_20250212_143022.json    # Raw data
└── seo_link_building_20250212_143022.md     # Markdown report
```

### JSON Format
```json
{
  "query": "seo link building services",
  "scraped_at": "2025-02-12T14:30:22",
  "region": "us",
  "pages_requested": 2,
  "pages_scraped": 2,
  "total_results": 18,
  "new_results": 15,
  "duplicate_results": 3,
  "results": [
    {
      "position": 1,
      "title": "Example Title",
      "link": "https://example.com/page",
      "snippet": "...",
      "domain": "example.com",
      "scraped_at": "2025-02-12T14:30:22"
    }
  ]
}
```

## Deduplication System

The scraper maintains a master database of all URLs:

- **Database:** `data/master-urls.json`
- **How it works:**
  1. Each scrape is compared against master database
  2. Only new URLs are shown in results
  3. New URLs are automatically added to master database
  4. Duplicate URLs are filtered out

### Viewing Master Database
```bash
cat data/master-urls.json | jq '.urls | length'
```

### Resetting Database (if needed)
```bash
rm data/master-urls.json
```

## Logging System

All actions are logged to `logs/scrapes.log`:

```
2025-02-12 14:30:22 | INFO | SCRAPER START | Query: 'seo link building' | Pages: 2
2025-02-12 14:30:23 | INFO | Fetching page 1 (start=0)...
2025-02-12 14:30:25 | INFO | DEDUPLICATION | Total: 18 | Duplicates: 3 | Unique: 15
2025-02-12 14:30:25 | INFO | SCRAPER COMPLETE | Query: 'seo link building' | Pages: 2 | Total: 18 | New: 15
```

## Weekly Automation

### Setup Cron Job

```bash
./setup-cron.sh
```

This creates a cron job that:
- Runs every Monday at 9:00 AM
- Scrapes 5 predefined queries
- Generates a weekly summary
- Logs to `logs/cron.log`

### Manual Weekly Run

```bash
source venv/bin/activate
python3 schedule.py
```

### Custom Weekly Queries

```bash
python3 schedule.py --queries "query 1" "query 2" "query 3"
```

### Weekly Output

```
results/
├── weekly_seo_link_building_20250212_090000.json
├── weekly_seo_link_building_20250212_090000.md
├── weekly_backlink_indexer_20250212_090100.json
├── weekly_backlink_indexer_20250212_090100.md
└── weekly_summary_20250212_090100.md  # Combined report
```

## Web Interface

### Start Web Server
```bash
source venv/bin/activate
python3 web.py
```

### Features
- Query input with visual feedback
- Page selector (1-10)
- Region selection (US, UK, CA, AU, DE, NL)
- Real-time results display
- History of previous scrapes
- Markdown export
- Stats dashboard

### Access
Open browser to: `http://localhost:5000`

## API Reference

### Scraper Module

```python
from scraper import SEOScraper

scraper = SEOScraper()
results = scraper.scrape(
    query="seo link building",
    max_pages=2,
    region="us"
)
```

### Formatter Module

```python
from formatter import MarkdownFormatter

# Generate markdown
md = MarkdownFormatter.format_results(results)

# Save to file
MarkdownFormatter.save_markdown(results, "output.md")

# Weekly summary
summary = MarkdownFormatter.format_weekly_summary(current, previous)
```

## Troubleshooting

### API Key Error
```
ValueError: Serper API key not found
```
**Solution:** Ensure `.env` file contains valid SERPER_API_KEY

### Rate Limiting
If you hit rate limits:
- Increase delay in `scraper.py` (line with `time.sleep(0.5)`)
- Reduce pages per scrape

### No New Results
If all results are duplicates:
- Check master database size
- Try different queries
- Reset database if needed

### Cron Job Not Running
Check logs:
```bash
tail -f logs/cron.log
```

Verify cron:
```bash
crontab -l
```

## Configuration

### Environment Variables (.env)
```
SERPER_API_KEY=your_api_key_here
```

### Default Settings
- Pages: 1 (adjustable to 10)
- Region: us (United States)
- API: Serper.dev
- Rate limit: 0.5s between requests

## Advanced Usage

### Programmatic Usage

```python
from scraper import SEOScraper
from formatter import MarkdownFormatter

# Initialize
scraper = SEOScraper()

# Scrape multiple queries
queries = [
    "seo link building",
    "backlink indexer",
    "guest posting"
]

for query in queries:
    results = scraper.scrape(query, max_pages=2)
    print(f"{query}: {results['new_results']} new links")
```

### Export to CSV

```python
import csv
import json

with open('results/scrape_data.json') as f:
    data = json.load(f)

with open('output.csv', 'w') as f:
    writer = csv.DictWriter(f, fieldnames=['position', 'title', 'link', 'domain'])
    writer.writeheader()
    writer.writerows(data['results'])
```

## File Structure

```
seo-backlinks-search/
├── scraper.py              # Main scraper module
├── formatter.py             # Markdown formatter
├── schedule.py              # Weekly scheduler
├── web.py                   # Web interface
├── scrape.sh                # CLI wrapper
├── setup-cron.sh            # Cron setup
├── requirements.txt         # Python dependencies
├── .env                     # API key
├── data/
│   └── master-urls.json     # Master URL database
├── logs/
│   ├── scrapes.log          # Scrape logs
│   └── cron.log             # Cron logs
├── results/                 # Scrape results
│   ├── *.json
│   └── *.md
└── venv/                    # Python virtual environment
```

## Best Practices

1. **Start Small:** Test with 1 page first, then increase
2. **Vary Queries:** Use different query variations over time
3. **Check Weekly:** Monitor weekly reports for new opportunities
4. **Back Up Data:** Periodically back up `data/master-urls.json`
5. **Monitor Logs:** Check `logs/scrapes.log` for issues

## Integration with Other Tools

### Telegram Notifications

Add to `schedule.py`:
```python
# Send summary via Telegram
requests.post(
    'https://api.telegram.org/bot<TOKEN>/sendMessage',
    json={'chat_id': '<CHAT_ID>', 'text': summary}
)
```

### Webhook Notifications

Modify `schedule.py` to POST to webhook:
```python
requests.post('https://your-webhook.com/seo', json=results)
```

## Support

For issues or questions:
- Check logs in `logs/`
- Verify API key in `.env`
- Test with simple query first
- Check Serper.dev status

## License

MIT License - Use freely for your SEO projects!

---

**Happy Scraping! 🚀**

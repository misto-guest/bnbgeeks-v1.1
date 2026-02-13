# SEO Backlinks Scraper - Improved Version 🚀

An automated SEO backlink discovery tool with smart deduplication, markdown export, and weekly scheduling.

## 🎯 What's New

This improved version adds:

✅ **Python-based scraper** - Better error handling and data processing
✅ **Auto-deduplication** - Master URL database prevents duplicates
✅ **Markdown output** - Copy-paste ready reports
✅ **Web interface** - Easy-to-use UI at http://localhost:5000
✅ **Weekly automation** - Scheduled scrapes with cron
✅ **Comprehensive logging** - All actions logged with timestamps
✅ **Multiple formats** - JSON and Markdown output

## 📦 Quick Start

### 1. Install Dependencies

```bash
cd /Users/northsea/clawd-dmitry/seo-backlinks-search
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Run Your First Scrape

**CLI (Quickest):**
```bash
./scrape.sh "seo link building services"
```

**Python Direct:**
```bash
source venv/bin/activate
python3 scraper.py "backlink indexer tools" --pages 2
```

**Web Interface:**
```bash
source venv/bin/activate
python3 web.py
# Open http://localhost:5000
```

## 📁 File Structure

```
seo-backlinks-search/
├── scraper.py              # Main scraper (Python)
├── formatter.py             # Markdown formatter
├── schedule.py              # Weekly scheduler
├── web.py                   # Web UI (Flask)
├── scrape.sh                # CLI wrapper
├── setup-cron.sh            # Setup automated weekly scrapes
├── requirements.txt         # Dependencies
├── .env                     # API key configuration
├── USAGE.md                 # Detailed usage guide
├── data/
│   └── master-urls.json     # Master URL database
├── logs/
│   └── scrapes.log          # Activity logs
├── results/                 # Scrape results (JSON + MD)
└── venv/                    # Python environment
```

## 🔧 Key Features

### 1. Simple Query Input

```bash
# 1 page (default)
./scrape.sh "seo link building"

# Multiple pages
./scrape.sh "guest posting services" 3

# Different region
python3 scraper.py "backlink tools" --pages 2 --region uk
```

**Available regions:** us, uk, ca, au, de, nl

### 2. Results Output

Results are saved in two formats:

**JSON (`results/query_timestamp.json`):**
- Structured data for programmatic use
- All metadata included
- Easy to import into other tools

**Markdown (`results/query_timestamp.md`):**
- Human-readable report
- Copy-paste ready
- Includes domain breakdown
- Exportable links list

### 3. Deduplication System

The scraper maintains a master database (`data/master-urls.json`):

- Every URL is tracked
- Duplicates automatically filtered
- Only new links shown
- Database grows over time

**Example:**
```bash
# First scrape: finds 20 links (20 new)
# Second scrape: finds 25 total, but only 5 are new
# Report shows: "New Unique: 5 ✨"
```

### 4. Weekly Automated Scrapes

**Setup:**
```bash
./setup-cron.sh
```

This creates a cron job that:
- Runs every Monday at 9:00 AM
- Scrapes 5 predefined queries
- Generates weekly summary
- Logs to `logs/cron.log`

**Manual weekly run:**
```bash
source venv/bin/activate
python3 schedule.py
```

### 5. Web Interface

Start the web server:
```bash
source venv/bin/activate
python3 web.py
```

Features:
- Visual query input
- Real-time results
- History browser
- Export to markdown
- Stats dashboard

Access at: **http://localhost:5000**

## 📊 Example Output

### Console Output
```
============================================================
✅ SCRAPING COMPLETE
============================================================
Query: seo link building services
Pages: 2 of 2
Total Found: 18
New Unique: 15 ✨
Duplicates: 3

📁 JSON saved: results/seo_link_building_20250212_143022.json
📝 Markdown: results/seo_link_building_20250212_143022.md
============================================================
```

### Markdown Report
```markdown
# 🔍 SEO Backlinks Search Results

**Query:** `seo link building services`
**Scraped:** 2025-02-12 14:30:22
**Pages:** 2 of 2
**Total Found:** 18
**New Unique Links:** 15 ✨

## 📊 Results (15 new links)

| # | Domain | Title | Link |
|---|--------|-------|------|
| 1 | `loganiix.com` | Loganix - Premium link building | [Link](...) |
...
```

## 🧪 Testing

The scraper has been tested and verified:

✅ API integration (Serper.dev)
✅ Deduplication system
✅ Markdown formatting
✅ JSON output
✅ Logging system
✅ Multi-page scraping
✅ Error handling

Test run results:
```
Query: "seo backlinks test"
Pages: 1
Results: 10 found, 10 new, 0 duplicates
```

## 🔍 Viewing Logs

All scrapes are logged:

```bash
# View recent activity
tail -f logs/scrapes.log

# Search for specific query
grep "seo link building" logs/scrapes.log

# Check cron logs
tail -f logs/cron.log
```

## 🗄️ Master Database

Check database size:
```bash
cat data/master-urls.json | jq '.urls | length'
```

View top domains:
```bash
cat results/*.json | jq -r '.results[].domain' | sort | uniq -c | sort -rn | head -20
```

## 🔑 Configuration

### API Key

Edit `.env` file:
```
SERPER_API_KEY=your_api_key_here
```

### Default Settings

Edit these in `scraper.py`:
- `API_RATE_LIMIT`: Delay between requests (default: 0.5s)
- `MAX_PAGES`: Maximum pages per scrape (default: 10)
- `DEFAULT_REGION`: Default region (default: "us")

## 📖 Advanced Usage

### Custom Query Set

```python
from scraper import SEOScraper

scraper = SEOScraper()

queries = [
    "seo link building services",
    "backlink indexer tools",
    "guest posting services",
    "blogger outreach",
    "white hat backlinks"
]

for query in queries:
    results = scraper.scrape(query, max_pages=2)
    print(f"{query}: {results['new_results']} new links")
```

### Export to CSV

```bash
# Convert JSON to CSV
cat results/seo_link_building_*.json | jq -r '.results[] | [.position, .title, .link, .domain] | @csv' > output.csv
```

### Integration with Notifications

Add to `schedule.py`:

```python
# Send via Telegram (example)
import requests
requests.post(
    'https://api.telegram.org/bot<TOKEN>/sendMessage',
    json={'chat_id': '<CHAT_ID>', 'text': summary_md}
)
```

## 🚀 Deployment Options

### Local Development
- Use Flask web server (default)
- Perfect for testing and personal use

### Production Web Server

Using gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 web:app
```

### Docker Deployment

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "web:app"]
```

### Cloud Deployment

**Render/Railway/Heroku:**
1. Push to GitHub
2. Connect repo to platform
3. Set environment variable: `SERPER_API_KEY`
4. Deploy!

## 🤝 Migration from Old Version

### What's Preserved:
✅ API key (Serper.dev)
✅ Existing data (results/, data/)
✅ General functionality

### What's Changed:
🔄 Bash → Python (better error handling)
🔄 Manual dedup → Auto database
🔄 HTML static → Dynamic web UI
🔄 No logging → Comprehensive logs
🔄 Manual only → Scheduled automation

### Migrate Your Data:

Old results are still compatible:
```bash
# Move old results to new format
cp old-results.json results/
python3 scraper.py --convert old-results.json
```

## 🐛 Troubleshooting

### "API key not found"
- Check `.env` file exists
- Verify `SERPER_API_KEY` is set
- Run `source venv/bin/activate` first

### "No new links found"
- Normal if you've scraped recently
- Try different queries
- Check database: `cat data/master-urls.json | jq '.urls | length'`

### Cron not running
- Check: `crontab -l`
- View logs: `tail logs/cron.log`
- Test manually: `python3 schedule.py`

### Port 5000 already in use
```bash
# Change port in web.py:
app.run(debug=True, host='0.0.0.0', port=5001)
```

## 📚 Documentation

- **USAGE.md** - Complete usage guide
- **logs/scrapes.log** - Activity logs
- **results/** - All scrape results

## 🎓 Best Practices

1. **Start Small** - Test with 1 page first
2. **Check Logs** - Monitor `logs/scrapes.log` regularly
3. **Vary Queries** - Use different terms over time
4. **Back Up Data** - Copy `data/master-urls.json` periodically
5. **Review Weekly** - Check weekly reports for new opportunities

## 📞 Support

**For issues:**
1. Check logs: `logs/scrapes.log`
2. Verify API key in `.env`
3. Test with simple query: `./scrape.sh "test"`
4. Check Serper.dev status

**Useful Commands:**
```bash
# Check installation
python3 --version
pip list | grep -E "requests|flask"

# Verify API key
cat .env

# Test scraper
source venv/bin/activate
python3 scraper.py "test" --pages 1

# View database size
cat data/master-urls.json | jq '.urls | length'
```

## 🎉 Summary

This improved scraper provides:
- ✅ Easier usage (CLI + Web)
- ✅ Smart deduplication (master database)
- ✅ Better output (Markdown + JSON)
- ✅ Automation (weekly cron jobs)
- ✅ Professional logging (audit trail)
- ✅ Clean architecture (Python modules)

**Happy Scraping!** 🚀

---

**Last Updated:** 2025-02-12
**Version:** 2.0 (Improved)

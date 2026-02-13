# 🚀 Quick Start Guide - SEO Query Manager

Get up and running in 5 minutes!

## Step 1: Install (2 minutes)

```bash
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager
./setup.sh
```

This installs dependencies and creates the database.

## Step 2: Configure API Key (1 minute)

```bash
nano .env
```

Replace `your_serper_api_key_here` with your actual Serper API key:
```
SERPER_API_KEY=your_actual_api_key_here
```

Don't have one? Get it free at: https://serper.dev/

## Step 3: Start the Server (30 seconds)

```bash
./start.sh
```

You should see:
```
🚀 Starting SEO Query Manager...
📊 Dashboard: http://localhost:5001
🔑 API Key: seo-query-manager-key
```

## Step 4: Use It! (2 minutes)

1. Open http://localhost:5001 in your browser
2. Click "Queries" → "Add Query"
3. Enter a search term like "seo link building services"
4. Click "Save Query"
5. Click the play button ▶️ to run it

That's it! 🎉

---

## Want Automatic Scraping?

Run this to set up cron jobs:

```bash
./setup-cron.sh
```

This will automatically run your queries on schedule (daily/weekly/monthly).

---

## Quick Commands

| Command | Description |
|---------|-------------|
| `./start.sh` | Start the web server |
| `./setup.sh` | Install/update dependencies |
| `./setup-cron.sh` | Set up automatic scheduling |
| `python3 scheduler.py weekly` | Run all weekly queries manually |

---

## API Quick Test

```bash
# Add a query via API
curl -X POST http://localhost:5001/api/queries \
  -H "X-API-Key: seo-query-manager-key" \
  -H "Content-Type: application/json" \
  -d '{"query":"backlink services","schedule":"weekly"}'

# Get system status
curl http://localhost:5001/api/status \
  -H "X-API-Key: seo-query-manager-key"
```

---

## Need Help?

- Full Documentation: See `README.md`
- API Reference: See `API.md`
- Check Logs: `tail -f logs/scrapes.log`

---

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

**Scraping fails?**
- Check your Serper API key has credits
- Verify network connection
- Check logs: `cat logs/scrapes.log`

**Database errors?**
```bash
# Reset database (deletes all data!)
rm query_manager.db
./start.sh
```

---

## What's Next?

1. Add multiple queries with different schedules
2. Set up cron for automatic scraping
3. Export results to CSV for analysis
4. Build integrations using the REST API
5. Deploy to production (see README.md)

Enjoy your SEO scraping! 🚀

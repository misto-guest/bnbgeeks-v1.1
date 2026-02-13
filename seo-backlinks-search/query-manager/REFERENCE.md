# 🎯 SEO Query Manager - At a Glance

## Quick Reference

| Item | Value |
|------|-------|
| **Location** | `/Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager/` |
| **Server URL** | `http://localhost:5001` |
| **Default API Key** | `seo-query-manager-key` |
| **Database** | SQLite (`query_manager.db`) |
| **Port** | 5001 |

## Essential Commands

```bash
# Setup (first time only)
./setup.sh

# Start server
./start.sh

# Setup automatic scraping
./setup-cron.sh

# Manual scrape
python3 scheduler.py weekly
```

## Web Interface

- **Dashboard**: http://localhost:5001/
- **Queries**: http://localhost:5001/queries
- **Results**: http://localhost:5001/results
- **Logs**: http://localhost:5001/logs
- **Settings**: http://localhost:5001/settings

## API Endpoints (Quick Reference)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queries` | List all queries |
| POST | `/api/queries` | Add new query |
| GET | `/api/queries/{id}` | Get specific query |
| PUT | `/api/queries/{id}` | Update query |
| DELETE | `/api/queries/{id}` | Delete query |
| GET | `/api/results/{id}` | Get latest results |
| GET | `/api/results/{id}/all` | Get all results |
| POST | `/api/results/{id}/run` | Run scrape |
| GET | `/api/export/{id}` | Export JSON/CSV |
| GET | `/api/logs` | Get activity logs |
| GET | `/api/status` | System status |

## File Locations

| File | Purpose |
|------|---------|
| `app.py` | Flask application |
| `models.py` | Database models |
| `scheduler.py` | Cron scheduler |
| `query_manager.db` | SQLite database |
| `.env` | Configuration |
| `logs/scrapes.log` | Scraper logs |
| `logs/cron.log` | Cron output |

## Environment Variables

```bash
SERPER_API_KEY=your_key_here    # Required
SECRET_KEY=random_secret          # Optional
API_KEY=seo-query-manager-key    # Optional
```

## Database Schema

**Tables:**
- `queries` - Search queries with schedules
- `results` - Scraping results
- `run_logs` - Activity logs
- `api_keys` - API authentication

## Schedule Options

| Schedule | Cron Pattern | Description |
|----------|--------------|-------------|
| Daily | `0 2 * * *` | Every day at 2 AM |
| Weekly | `0 2 * * 1` | Every Monday at 2 AM |
| Monthly | `0 2 1 * *` | 1st of month at 2 AM |

## Export Formats

| Format | Usage |
|--------|-------|
| JSON | `/api/export/{id}?format=json` |
| CSV | `/api/export/{id}?format=csv` |

## Authentication

All API calls require API key:

```bash
# Header
X-API-Key: seo-query-manager-key

# Or query parameter
?api_key=seo-query-manager-key
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `lsof -ti:5001 | xargs kill -9` |
| Import errors | Run `./setup.sh` |
| Scraping fails | Check SERPER_API_KEY |
| Database corrupt | Delete `query_manager.db` and restart |

## Documentation Files

- `README.md` - Complete documentation
- `API.md` - API reference
- `QUICKSTART.md` - 5-minute guide
- `IMPLEMENTATION.md` - Implementation details

---

**Created:** 2025-01-12
**Version:** 1.0.0
**Status:** ✅ Production Ready

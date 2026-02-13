# 🔍 SEO Query Manager

A comprehensive web application for managing SEO backlink scraping operations with scheduling, history tracking, and data export capabilities.

## ✨ Features

- **Query Management**: Add, edit, delete, and schedule search queries
- **Automatic Scraping**: Schedule queries to run daily, weekly, or monthly
- **Real-time Dashboard**: Monitor system status and recent activity
- **Results Viewer**: Browse and export scraping results (JSON/CSV)
- **Activity Logs**: Track all scraping operations with detailed logs
- **REST API**: Full API for integration with external tools
- **Modern UI**: Clean, responsive web interface

## 📋 Prerequisites

- Python 3.7+
- pip (Python package manager)
- Serper.dev API key ([Get one here](https://serper.dev/))

## 🚀 Quick Start

### 1. Installation

```bash
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager
./setup.sh
```

This will:
- Create a Python virtual environment
- Install all dependencies
- Create a `.env` file
- Initialize the SQLite database

### 2. Configure API Key

Edit the `.env` file and add your Serper API key:

```bash
nano .env
```

```
SERPER_API_KEY=your_actual_api_key_here
SECRET_KEY=change-this-to-a-random-secret-key
API_KEY=seo-query-manager-key
```

### 3. Start the Server

```bash
./start.sh
```

The server will start at **http://localhost:5001**

### 4. Add Your First Query

1. Open http://localhost:5001 in your browser
2. Click "Queries" in the navigation
3. Click "Add Query"
4. Enter your search query (e.g., "seo link building services")
5. Select schedule (daily, weekly, or monthly)
6. Choose region and number of pages
7. Click "Save Query"

## 📅 Setting Up Automatic Scraping

To enable scheduled scraping, set up cron jobs:

```bash
./setup-cron.sh
```

This will install cron jobs for:
- **Daily**: Runs at 2 AM every day
- **Weekly**: Runs at 2 AM every Monday
- **Monthly**: Runs at 2 AM on the 1st of each month

Or manually edit crontab:

```bash
crontab -e
```

Add these entries:

```cron
# Daily scrape (2 AM)
0 2 * * * cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager && python3 scheduler.py daily >> logs/cron.log 2>&1

# Weekly scrape (Monday 2 AM)
0 2 * * 1 cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager && python3 scheduler.py weekly >> logs/cron.log 2>&1

# Monthly scrape (1st of month 2 AM)
0 2 1 * * cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager && python3 scheduler.py monthly >> logs/cron.log 2>&1
```

## 📡 API Documentation

All API endpoints require authentication. Use the API key in either:
- Header: `X-API-Key: seo-query-manager-key`
- Query parameter: `?api_key=seo-query-manager-key`

### Endpoints

#### Queries

**List all queries**
```http
GET /api/queries
X-API-Key: seo-query-manager-key
```

**Add a new query**
```http
POST /api/queries
X-API-Key: seo-query-manager-key
Content-Type: application/json

{
  "query": "seo link building services",
  "schedule": "weekly",
  "region": "us",
  "max_pages": 2
}
```

**Get a specific query**
```http
GET /api/queries/{query_id}
X-API-Key: seo-query-manager-key
```

**Update a query**
```http
PUT /api/queries/{query_id}
X-API-Key: seo-query-manager-key
Content-Type: application/json

{
  "schedule": "daily",
  "max_pages": 3
}
```

**Delete a query**
```http
DELETE /api/queries/{query_id}
X-API-Key: seo-query-manager-key
```

#### Results

**Get latest results for a query**
```http
GET /api/results/{query_id}
X-API-Key: seo-query-manager-key
```

**Get all historical results**
```http
GET /api/results/{query_id}/all?limit=100
X-API-Key: seo-query-manager-key
```

**Manually run a scrape**
```http
POST /api/results/{query_id}/run
X-API-Key: seo-query-manager-key
```

**Export results**
```http
GET /api/export/{query_id}?format=json
GET /api/export/{query_id}?format=csv
X-API-Key: seo-query-manager-key
```

#### System

**Get system status**
```http
GET /api/status
X-API-Key: seo-query-manager-key
```

**Get activity logs**
```http
GET /api/logs?limit=50
X-API-Key: seo-query-manager-key
```

### Example: Using the API with curl

```bash
# Add a query
curl -X POST http://localhost:5001/api/queries \
  -H "X-API-Key: seo-query-manager-key" \
  -H "Content-Type: application/json" \
  -d '{"query":"backlink outreach services","schedule":"weekly"}'

# Get results
curl http://localhost:5001/api/results/1 \
  -H "X-API-Key: seo-query-manager-key"

# Run a scrape
curl -X POST http://localhost:5001/api/results/1/run \
  -H "X-API-Key: seo-query-manager-key"

# Export as CSV
curl http://localhost:5001/api/export/1?format=csv \
  -H "X-API-Key: seo-query-manager-key" \
  -o results.csv
```

## 🗂️ Project Structure

```
query-manager/
├── app.py                 # Flask application
├── models.py              # Database models
├── scheduler.py           # Cron scheduler
├── requirements.txt       # Python dependencies
├── setup.sh              # Installation script
├── start.sh              # Start script
├── setup-cron.sh         # Cron setup script
├── .env.example          # Environment variables template
├── query_manager.db      # SQLite database (created automatically)
├── templates/            # HTML templates
│   ├── index.html        # Dashboard
│   ├── queries.html      # Query management
│   ├── results.html      # Results viewer
│   ├── logs.html         # Activity logs
│   └── settings.html     # Settings & API docs
├── static/
│   ├── css/
│   │   └── style.css     # Styles
│   └── js/
│       └── api.js        # API helper
└── logs/                 # Log files
    ├── scrapes.log       # Scraper logs
    └── cron.log          # Cron output
```

## 🔧 Configuration

### Environment Variables

Edit `.env` file:

```bash
# Required: Serper API key
SERPER_API_KEY=your_api_key_here

# Optional: Flask secret key (change in production)
SECRET_KEY=your-random-secret-key

# Optional: API key for this application
API_KEY=seo-query-manager-key
```

### Database

The application uses SQLite for data storage. The database file (`query_manager.db`) is created automatically on first run.

**Tables:**
- `queries` - Search queries and schedules
- `results` - Scraping results
- `run_logs` - Activity logs
- `api_keys` - API key management

## 📊 Dashboard Features

### Dashboard (`/`)
- System status overview
- Active queries count
- Total results and new links found
- Recent activity feed
- Quick action buttons

### Queries (`/queries`)
- List all active queries
- Add new queries with schedules
- Edit query settings
- Delete queries
- Run individual queries manually

### Results (`/results`)
- Select a query to view results
- Latest scraping results with stats
- Detailed list of found links
- Historical results comparison
- Export to JSON or CSV

### Logs (`/logs`)
- Complete activity history
- Scraping operation logs
- Error tracking
- Duration tracking

### Settings (`/settings`)
- API key information
- Cron setup instructions
- API documentation
- Environment variable reference

## 🔐 Security

**For Production Deployment:**

1. **Change the secret key** in `.env`:
   ```bash
   SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')
   ```

2. **Generate a secure API key**:
   ```bash
   API_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
   ```

3. **Use HTTPS** - Deploy behind a reverse proxy (nginx, Apache)

4. **Restrict API access** - Use firewall rules to limit access to the API

## 🚀 Deployment

### Local Development

```bash
./start.sh
```

### Production (using gunicorn)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

### Production (systemd service)

Create `/etc/systemd/system/seo-query-manager.service`:

```ini
[Unit]
Description=SEO Query Manager
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager
Environment="PATH=/Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager/venv/bin"
ExecStart=/Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager/venv/bin/gunicorn -w 4 -b 0.0.0.0:5001 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable seo-query-manager
sudo systemctl start seo-query-manager
```

## 🐛 Troubleshooting

**Server won't start**
- Check if port 5001 is available
- Verify Python dependencies are installed
- Check `.env` file exists and is valid

**Scraping fails**
- Verify SERPER_API_KEY is valid and has credits
- Check network connectivity
- View logs: `tail -f logs/scrapes.log`

**Cron jobs not running**
- Check crontab: `crontab -l`
- View cron logs: `tail -f logs/cron.log`
- Verify paths in cron entries are correct
- Make sure scheduler.py has execute permissions

**Database errors**
- Delete `query_manager.db` and restart server to recreate
- Check file permissions

## 📝 License

This project is part of the SEO Backlinks Search toolset.

## 🤝 Integration with Existing Scraper

The query manager integrates seamlessly with the existing SEO backlinks scraper at `/Users/northsea/clawd-dmitry/seo-backlinks-search/`. It:

- Uses the same `scraper.py` module
- Shares the same deduplication database (`data/master-urls.json`)
- Writes results to the same results directory structure
- Logs to the centralized logging system

This ensures consistency across all scraping operations.

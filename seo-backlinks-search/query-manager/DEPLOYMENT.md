# 🚀 SEO Query Manager - Production Deployment

**Deployment Status:** ✅ **LIVE & ACCESSIBLE**

**Deployment Date:** February 12, 2026
**Server:** Gunicorn (Production WSGI Server)
**Port:** 5001

---

## 🌐 Access URLs

### Public URLs
- **Web Interface:** `http://87.208.4.155:5001/`
- **API Base URL:** `http://87.208.4.155:5001/api/`
- **API Status:** `http://87.208.4.155:5001/api/status`

### Local URLs (from the server itself)
- **Web Interface:** `http://localhost:5001/`
- **API Base URL:** `http://localhost:5001/api/`

---

## 🔑 API Authentication

All API endpoints require authentication using an API key.

**API Key:** `seo-query-manager-key`

**Usage:**
```bash
# Via Header
curl -H "X-API-Key: seo-query-manager-key" http://87.208.4.155:5001/api/status

# Via Query Parameter
curl "http://87.208.4.155:5001/api/status?api_key=seo-query-manager-key"
```

---

## 📡 API Endpoints

### System Status
```bash
curl http://87.208.4.155:5001/api/status \
  -H "X-API-Key: seo-query-manager-key"
```

### Queries
```bash
# List all queries
curl http://87.208.4.155:5001/api/queries \
  -H "X-API-Key: seo-query-manager-key"

# Add a new query
curl -X POST http://87.208.4.155:5001/api/queries \
  -H "X-API-Key: seo-query-manager-key" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "seo link building services",
    "schedule": "weekly",
    "region": "us",
    "max_pages": 2
  }'

# Get a specific query
curl http://87.208.4.155:5001/api/queries/1 \
  -H "X-API-Key: seo-query-manager-key"

# Update a query
curl -X PUT http://87.208.4.155:5001/api/queries/1 \
  -H "X-API-Key: seo-query-manager-key" \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": "daily",
    "max_pages": 3
  }'

# Delete a query
curl -X DELETE http://87.208.4.155:5001/api/queries/1 \
  -H "X-API-Key: seo-query-manager-key"
```

### Results & Scraping
```bash
# Get latest results
curl http://87.208.4.155:5001/api/results/1 \
  -H "X-API-Key: seo-query-manager-key"

# Get all historical results
curl http://87.208.4.155:5001/api/results/1/all?limit=100 \
  -H "X-API-Key: seo-query-manager-key"

# Run a manual scrape
curl -X POST http://87.208.4.155:5001/api/results/1/run \
  -H "X-API-Key: seo-query-manager-key"

# Export as JSON
curl http://87.208.4.155:5001/api/export/1?format=json \
  -H "X-API-Key: seo-query-manager-key" \
  -o results.json

# Export as CSV
curl http://87.208.4.155:5001/api/export/1?format=csv \
  -H "X-API-Key: seo-query-manager-key" \
  -o results.csv
```

### Logs
```bash
# Get recent logs
curl http://87.208.4.155:5001/api/logs?limit=50 \
  -H "X-API-Key: seo-query-manager-key"
```

---

## 🔧 Server Configuration

### Production Server: Gunicorn
- **Worker Processes:** 4
- **Bind Address:** 0.0.0.0:5001 (all interfaces)
- **Access Log:** `logs/access.log`
- **Error Log:** `logs/error.log`

### Startup Script
```bash
/Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager/start-production.sh
```

### Process Management
The server is running as a background process. To manage it:

```bash
# Check if server is running
ps aux | grep gunicorn | grep -v grep

# Stop the server
pkill -f "gunicorn.*app:app"

# Restart the server
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager
bash start-production.sh
```

---

## 🔐 Security Configuration

### Environment Variables (`.env`)
```bash
SERPER_API_KEY=your_serper_api_key_here
SECRET_KEY=d3ab6bdedcf4326e4bbb4bb5c0e36da9b43a6e2e304dcf09e8cdc1e18df11570
API_KEY=seo-query-manager-key
```

**IMPORTANT:** For production use, you should:
1. Set a strong, unique `SERPER_API_KEY` from Serper.dev
2. The `SECRET_KEY` has been set to a cryptographically secure value
3. Consider rotating the `API_KEY` periodically
4. Set up a firewall to restrict access to port 5001 if needed

---

## 📊 Web Interface Features

- **Dashboard (`/`)**: System status, active queries, recent activity
- **Queries (`/queries`)**: Add, edit, delete queries with schedules
- **Results (`/results`)**: View and export scraping results
- **Logs (`/logs`)**: Complete activity history
- **Settings (`/settings`)**: API documentation and configuration

---

## 📝 Next Steps

### 1. Configure Serper API Key
Edit `.env` and add your actual Serper.dev API key:
```bash
nano /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager/.env
```

### 2. Set Up Scheduled Scraping (Optional)
To enable automatic daily/weekly/monthly scraping:
```bash
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager
./setup-cron.sh
```

### 3. Set Up Reverse Proxy (Recommended for Production)
For production use with HTTPS, set up nginx or Apache as a reverse proxy:

**Example nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. Set Up Systemd Service (Optional for Auto-Start)
Create a systemd service to auto-start the server on reboot.

---

## 🎯 Verification

The deployment has been verified and is working:

✅ **Gunicorn server running** (5 processes: 1 master + 4 workers)
✅ **Web interface accessible** at `http://87.208.4.155:5001/`
✅ **API responding** correctly with authentication
✅ **Database initialized** and ready to store queries
✅ **CORS enabled** for cross-origin API requests

---

## 📞 Support

For issues or questions, refer to:
- **README.md** - Full documentation
- **API.md** - Detailed API reference
- **logs/error.log** - Server error logs
- **logs/access.log** - Server access logs

---

**Status:** 🟢 **ONLINE & OPERATIONAL**

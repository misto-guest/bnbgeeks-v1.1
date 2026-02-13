#!/bin/bash
# Production startup script for SEO Query Manager
# Uses gunicorn for production-ready deployment

echo "🚀 Starting SEO Query Manager (Production Mode)..."

# Activate virtual environment
cd /Users/northsea/clawd-dmitry/seo-backlinks-search/query-manager
source venv/bin/activate

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start with gunicorn (production WSGI server)
# -w 4: 4 worker processes
# -b 0.0.0.0:5001: Bind to all interfaces on port 5001
# --access-logfile: Log access requests
# --error-logfile: Log errors
gunicorn -w 4 -b 0.0.0.0:5001 \
    --access-logfile logs/access.log \
    --error-logfile logs/error.log \
    --log-level info \
    app:app

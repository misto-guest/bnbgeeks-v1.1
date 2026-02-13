#!/bin/bash
# Setup weekly cron job for automated scraping

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🕒 Setting up weekly automated scraping..."
echo ""

# Create logs directory
mkdir -p logs
mkdir -p results
mkdir -p data

# Check if crontab exists
if ! crontab -l &>/dev/null; then
    echo "No existing crontab found. Creating new one..."
fi

# Create temporary crontab
TEMP_CRON=$(mktemp)

# Get existing crontab (if any)
crontab -l > "$TEMP_CRON" 2>/dev/null || true

# Check if our job already exists
if grep -q "seo-backlinks-search/schedule.py" "$TEMP_CRON" 2>/dev/null; then
    echo "⚠️  Cron job already exists. Skipping setup."
    echo ""
    echo "Current crontab:"
    crontab -l | grep "seo-backlinks-search"
    rm "$TEMP_CRON"
    exit 0
fi

# Add new cron job (runs every Monday at 9 AM)
echo "" >> "$TEMP_CRON"
echo "# Weekly SEO Backlinks Scraping - Every Monday at 9 AM" >> "$TEMP_CRON"
echo "0 9 * * 1 cd $SCRIPT_DIR && /usr/bin/python3 schedule.py >> logs/cron.log 2>&1" >> "$TEMP_CRON"

# Install new crontab
crontab "$TEMP_CRON"
rm "$TEMP_CRON"

echo "✅ Cron job installed successfully!"
echo ""
echo "📅 Schedule: Every Monday at 9:00 AM"
echo "📂 Working directory: $SCRIPT_DIR"
echo "📝 Logs: $SCRIPT_DIR/logs/cron.log"
echo ""
echo "To view cron jobs: crontab -l"
echo "To edit: crontab -e"
echo "To remove: crontab -e (then delete the seo-backlinks line)"
echo ""

# Show current crontab
echo "Current crontab entries:"
echo "========================"
crontab -l | grep -A1 -B1 "seo-backlinks" || echo "(none found)"

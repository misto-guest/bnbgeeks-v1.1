#!/bin/bash
# Cron setup script for SEO Query Manager Scheduler

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_CMD="python3"

echo "📅 Setting up cron jobs for SEO Query Manager"
echo "=============================================="
echo ""

# Prompt for confirmation
read -p "This will add cron entries for automatic scraping. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Create temporary cron file
TEMP_CRON=$(mktemp)

# Export existing crontab
crontab -l > "$TEMP_CRON" 2>/dev/null || touch "$TEMP_CRON"

# Add new entries if they don't exist
if ! grep -q "scheduler.py daily" "$TEMP_CRON"; then
    echo "" >> "$TEMP_CRON"
    echo "# SEO Query Manager - Daily scrape (2 AM)" >> "$TEMP_CRON"
    echo "0 2 * * * cd $SCRIPT_DIR && $PYTHON_CMD scheduler.py daily >> logs/cron.log 2>&1" >> "$TEMP_CRON"
fi

if ! grep -q "scheduler.py weekly" "$TEMP_CRON"; then
    echo "" >> "$TEMP_CRON"
    echo "# SEO Query Manager - Weekly scrape (Monday 2 AM)" >> "$TEMP_CRON"
    echo "0 2 * * 1 cd $SCRIPT_DIR && $PYTHON_CMD scheduler.py weekly >> logs/cron.log 2>&1" >> "$TEMP_CRON"
fi

if ! grep -q "scheduler.py monthly" "$TEMP_CRON"; then
    echo "" >> "$TEMP_CRON"
    echo "# SEO Query Manager - Monthly scrape (1st of month 2 AM)" >> "$TEMP_CRON"
    echo "0 2 1 * * cd $SCRIPT_DIR && $PYTHON_CMD scheduler.py monthly >> logs/cron.log 2>&1" >> "$TEMP_CRON"
fi

# Install new crontab
crontab "$TEMP_CRON"
rm "$TEMP_CRON"

echo "✅ Cron jobs installed successfully!"
echo ""
echo "Current crontab:"
echo "---------------"
crontab -l | grep -A 1 "SEO Query Manager"
echo ""
echo "💡 To edit cron jobs manually: crontab -e"
echo "💡 To view logs: tail -f logs/cron.log"
echo ""

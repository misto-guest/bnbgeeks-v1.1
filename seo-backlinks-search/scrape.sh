#!/bin/bash
# CLI wrapper for SEO scraper
# Usage: ./scrape.sh "your query" [pages]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check Python installation
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "Setting up Python environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -q -r requirements.txt
else
    source venv/bin/activate
fi

# Get query and pages
QUERY="${1:-}"
PAGES="${2:-1}"

if [ -z "$QUERY" ]; then
    echo "Usage: ./scrape.sh \"your search query\" [pages]"
    echo ""
    echo "Examples:"
    echo "  ./scrape.sh \"seo link building services\""
    echo "  ./scrape.sh \"backlink indexer tools\" 3"
    exit 1
fi

# Validate pages
if ! [[ "$PAGES" =~ ^[0-9]+$ ]] || [ "$PAGES" -lt 1 ] || [ "$PAGES" -gt 10 ]; then
    echo "Error: Pages must be between 1 and 10"
    exit 1
fi

echo "🔍 Scraping SERP for: $QUERY"
echo "📄 Pages: $PAGES"
echo ""

# Run scraper
python3 scraper.py "$QUERY" --pages "$PAGES"

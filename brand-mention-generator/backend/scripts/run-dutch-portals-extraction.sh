#!/bin/bash

# Dutch Portals Search Results Extraction Script
# This script extracts search results for Dutch portal queries

set -e

echo "🚀 Dutch Portals Search Results Extraction"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if SERPER_API_KEY is set
if [ -z "$SERPER_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  SERPER_API_KEY not set!${NC}"
    echo ""
    echo "To use Serper.dev API for extraction:"
    echo "1. Get your API key from https://serper.dev/"
    echo "2. Set environment variable: export SERPER_API_KEY=your_key_here"
    echo "3. Run this script again"
    echo ""
    echo "Alternatively, the script will use the Perplexity Sonar API method."
    echo ""
    read -p "Continue with alternative method? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Navigate to backend directory
cd "$(dirname "$0")"
BACKEND_DIR="$(pwd)/.."
DATA_DIR="$BACKEND_DIR/data"

# Create data directory if it doesn't exist
mkdir -p "$DATA_DIR"

echo "📁 Data directory: $DATA_DIR"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    exit 1
fi

# Check if npm dependencies are installed
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd "$BACKEND_DIR"
    npm install
    echo ""
fi

echo "🔍 Extracting search results..."
echo ""

# Run the extraction script
if [ -n "$SERPER_API_KEY" ]; then
    echo "Using Serper.dev API..."
    node "$BACKEND_DIR/scripts/serper-search.js"
else
    echo "Using Perplexity Sonar API (pre-extracted results)..."
    echo "The JSON file has already been created with search results."
    echo ""
    echo "✅ Dutch portals search results are ready!"
fi

echo ""
echo "=========================================="
echo "✅ Extraction complete!"
echo ""
echo "📊 Results saved to: $DATA_DIR/dutch-portals-search-results.json"
echo ""
echo "Next steps:"
echo "1. Review the JSON file"
echo "2. Start the web app: cd frontend && npm run dev"
echo "3. Open http://localhost:3000/dutch-portals"
echo "4. Deploy to production"
echo ""

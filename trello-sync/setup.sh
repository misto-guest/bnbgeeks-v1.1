#!/bin/bash

# Trello Sync Setup Helper
# This script helps you get the sync system running quickly

set -e

echo "🎯 Trello Auto-Sync Setup"
echo "========================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Install from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if config exists
if [ ! -f "config.json" ]; then
    echo "❌ config.json not found"
    exit 1
fi

# Check if credentials are set
if grep -q "YOUR_TRELLO" config.json; then
    echo "📝 Step 1: Get Trello API Credentials"
    echo "-------------------------------------"
    echo ""
    echo "1. Open: https://trello.com/app-key"
    echo "2. Copy your API Key"
    echo "3. Click 'Token' → 'Generate Token'"
    echo "4. Copy the token"
    echo ""
    read -p "Press Enter when you have both credentials..."
    echo ""

    read -p "Paste your API Key: " api_key
    read -p "Paste your API Token: " api_token
    read -p "Paste your Board ID (from URL or type 'skip'): " board_id

    # Update config.json
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|YOUR_TRELLO_API_KEY_HERE|$api_key|g" config.json
        sed -i '' "s|YOUR_TRELLO_API_TOKEN_HERE|$api_token|g" config.json
        if [ "$board_id" != "skip" ]; then
            sed -i '' "s|YOUR_BOARD_ID_HERE|$board_id|g" config.json
        fi
    else
        # Linux
        sed -i "s|YOUR_TRELLO_API_KEY_HERE|$api_key|g" config.json
        sed -i "s|YOUR_TRELLO_API_TOKEN_HERE|$api_token|g" config.json
        if [ "$board_id" != "skip" ]; then
            sed -i "s|YOUR_BOARD_ID_HERE|$board_id|g" config.json
        fi
    fi

    echo ""
    echo "✅ Credentials saved to config.json"
else
    echo "✅ config.json already configured"
fi

echo ""
echo "📋 Step 2: Get List IDs"
echo "----------------------"
echo ""
echo "Running: node sync.js --init"
echo ""

node sync.js --init

echo ""
read -p "Update config.json with the list IDs above, then press Enter to continue..."
echo ""

echo ""
echo "🧪 Step 3: Test Connection"
echo "-------------------------"
echo ""

node sync.js --test

echo ""
echo "👀 Step 4: Preview Changes"
echo "-------------------------"
echo ""

node sync.js --dry-run

echo ""
read -p "Review the changes above. Run full sync? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Step 5: Run First Sync"
    echo "------------------------"
    echo ""
    
    node sync.js
    
    echo ""
    echo "✅ Setup complete!"
fi

echo ""
echo "⏰ Step 6: Set Up Automatic Sync"
echo "-------------------------------"
echo ""
echo "To run sync every 5 minutes, add this to your crontab:"
echo ""
echo "*/5 * * * * cd $(pwd) && node sync.js >> sync.log 2>&1"
echo ""
echo "Run: crontab -e"
echo ""

read -p "Set up cron now? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    (crontab -l 2>/dev/null; echo "*/5 * * * * cd $(pwd) && node sync.js >> sync.log 2>&1") | crontab -
    echo "✅ Cron job added!"
    echo ""
    echo "View cron jobs: crontab -l"
    echo "View sync logs: tail -f sync.log"
fi

echo ""
echo "🎉 All done! Your ClawDeck board will now stay in sync."
echo ""
echo "Useful commands:"
echo "  npm run sync      - Run manual sync"
echo "  npm run dry-run   - Preview changes"
echo "  npm run list      - List tracked projects"
echo "  npm run update    - Update specific card"
echo ""

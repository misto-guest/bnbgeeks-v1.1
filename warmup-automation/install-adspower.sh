#!/bin/bash

# AdsPower Installation Helper for macOS
# This script will guide you through the installation process

echo "🔐 AdsPower Installation Helper"
echo "================================"
echo ""
echo "📋 Installation Instructions:"
echo ""
echo "1. Download AdsPower for macOS:"
echo "   - Visit: https://www.adspower.com/download"
echo "   - Click 'Download' button"
echo "   - Select 'macOS Version'"
echo "   - File: AdsPower.dmg will be downloaded"
echo ""
echo "2. Install AdsPower:"
echo "   - Open the downloaded .dmg file"
echo "   - Drag AdsPower to Applications folder"
echo "   - Eject the DMG when complete"
echo ""
echo "3. First Launch:"
echo "   - Open Applications folder"
echo "   - Double-click AdsPower"
echo "   - If you see a security warning:"
echo "     * Go to: System Preferences > Security & Privacy > General"
echo "     * Click 'Open Anyway' for AdsPower"
echo "   - Sign up or log in to your account"
echo ""
echo "4. Enable API:"
echo "   - Go to: Settings > API & MCP"
echo "   - Verify local server shows: Connected"
echo "   - Note the API URL (default: http://local.adspower.net:50325)"
echo "   - Generate/copy your API key"
echo ""
echo "5. After Installation:"
echo "   - Run this command to test connection:"
echo "     node /Users/northsea/clawd-dmitry/warmup-automation/test-adspower-profile-1.js"
echo ""
echo "================================"
echo ""
echo "Ready to proceed? (Press Enter after installing AdsPower)"
read

# Check if AdsPower is installed
if [ -d "/Applications/AdsPower.app" ]; then
    echo "✅ AdsPower detected in Applications folder!"
    echo ""
    echo "Attempting to start AdsPower..."
    open /Applications/AdsPower.app

    echo ""
    echo "⏳ Waiting for AdsPower to start (10 seconds)..."
    sleep 10

    echo ""
    echo "Testing API connection..."
    node /Users/northsea/clawd-dmitry/warmup-automation/test-adspower-profile-1.js
else
    echo "❌ AdsPower not found in Applications folder"
    echo "Please complete the installation steps above first"
    echo ""
    echo "Download link: https://www.adspower.com/download"
fi

#!/bin/bash

# Legiit Automation - One-Click Launcher for macOS

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "🖥️  Legiit Automation Dashboard"
echo "================================"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first time only, this takes about 30 seconds)..."
    npm install --silent
    echo "✅ Installation complete!"
    echo ""
fi

echo "📡 Starting dashboard..."
echo ""
echo "🌐 Opening your browser..."

# Start the setup server
npm run setup &
SERVER_PID=$!

# Wait for server to be ready
sleep 3

# Open in default browser
open http://localhost:8080

echo ""
echo "✅ Dashboard is running!"
echo ""
echo "   Browser should open automatically"
echo "   If not, open: http://localhost:8080"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

# Handle Ctrl+C gracefully
trap "echo ''; echo '🛑 Stopping dashboard...'; kill $SERVER_PID 2>/dev/null; exit 0" INT

# Keep running until interrupted
wait $SERVER_PID

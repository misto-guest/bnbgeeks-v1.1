#!/bin/bash

echo "🖥️  Legiit Automation - Setup Dashboard"
echo "======================================"
echo ""
echo "🚀 Starting setup dashboard..."
echo ""

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first time only)..."
    npm install
    echo ""
fi

echo "📡 Opening setup dashboard in browser..."
echo ""
echo "   URL: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the setup server"
echo ""

# Start the setup server
npm run setup

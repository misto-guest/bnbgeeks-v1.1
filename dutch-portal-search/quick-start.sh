#!/bin/bash

# Dutch Portal Search Automation - Quick Start Script

echo "================================================"
echo "Dutch Portal Search Automation - Quick Start"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if results directory exists
if [ ! -d "results" ]; then
    mkdir -p results/screenshots
    echo "📁 Created results directory"
    echo ""
fi

# Check if AdsPower is running
echo "🔍 Checking for AdsPower..."
if curl -s http://127.0.0.1:50325/status > /dev/null 2>&1; then
    echo "✓ AdsPower is running on port 50325"
else
    echo "⚠️  AdsPower not detected. Running in standalone mode."
    echo "   To use AdsPower profiles, start AdsPower application first."
fi

echo ""
echo "================================================"
echo "Starting automation..."
echo "================================================"
echo ""

# Start the automation
node search.js

echo ""
echo "================================================"
echo "Automation complete!"
echo "================================================"
echo "Results saved to: results/"
echo "Screenshots saved to: results/screenshots/"
echo "================================================"

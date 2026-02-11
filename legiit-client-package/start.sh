#!/bin/bash

echo "╔══════════════════════════════════════════════╗"
echo "║   Legiit Automation - Quick Start           ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Legiit credentials!"
    echo "   Then run this script again."
    echo ""
    echo "   Required fields:"
    echo "   - LEGIIT_EMAIL=your_email@example.com"
    echo "   - LEGIIT_PASSWORD=your_password"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start server
echo "🚀 Starting Legiit Automation server..."
echo ""
npm start

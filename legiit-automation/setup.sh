#!/bin/bash

echo "🚀 Legiit Automation Setup"
echo "==========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "⚙️  Configuration required:"
echo "1. Copy .env.example to .env"
echo "2. Edit .env with your Legiit credentials"
echo ""
echo "Run these commands:"
echo "  cp .env.example .env"
echo "  nano .env  # or use your preferred editor"
echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  npm start"
echo ""
echo "To test the API (after starting server):"
echo "  npm test"

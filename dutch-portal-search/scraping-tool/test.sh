#!/bin/bash

# Test Script for Dutch Portal Search Scraping Tool
# This script demonstrates various usage scenarios

echo "=================================="
echo "Dutch Portal Search Tool - Tests"
echo "=================================="
echo ""

# Test 1: CLI Help
echo "Test 1: CLI Usage Information"
echo "-------------------------------"
cd "$(dirname "$0")"
node cli.js 2>&1 | head -5
echo ""

# Test 2: Verify files exist
echo "Test 2: File Verification"
echo "-------------------------------"
echo "✓ CLI Tool: $(test -f cli.js && echo 'EXISTS' || echo 'MISSING')"
echo "✓ Web App: $(test -f web-app.html && echo 'EXISTS' || echo 'MISSING')"
echo "✓ README: $(test -f README.md && echo 'EXISTS' || echo 'MISSING')"
echo ""

# Test 3: File sizes
echo "Test 3: File Sizes"
echo "-------------------------------"
ls -lh cli.js web-app.html README.md | awk '{print $9 ": " $5}'
echo ""

echo "=================================="
echo "All tests complete!"
echo "=================================="
echo ""
echo "To test live search, run:"
echo "  node cli.js \"test query\" --pages 1"
echo ""
echo "To use web interface, open:"
echo "  open web-app.html"

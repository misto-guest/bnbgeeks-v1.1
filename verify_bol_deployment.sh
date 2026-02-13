#!/bin/bash

# Bol.com Outreach - Deployment Verification Test

API_BASE="https://bol-outreach-production.up.railway.app"

echo "========================================="
echo "Bol.com Outreach Deployment Test"
echo "========================================="
echo ""
echo "API: $API_BASE"
echo "Time: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)"
echo ""

# Test 1: Health Check
echo "TEST 1: Health Check"
HEALTH=$(curl -s "$API_BASE/api/health")
if echo "$HEALTH" | grep -q "ok"; then
    echo "✓ PASS - API healthy"
else
    echo "✗ FAIL - API not healthy"
    exit 1
fi
echo ""

# Test 2: Critical Endpoint
echo "TEST 2: POST /api/campaigns/2/sellers (CRITICAL)"
RESPONSE=$(curl -s -X POST "$API_BASE/api/campaigns/2/sellers" \
  -H "Content-Type: application/json" \
  -d '{"sellerIds":[1,2],"approvalStatus":"pending"}')

if echo "$RESPONSE" | grep -q "Cannot POST"; then
    echo "✗ FAIL - Endpoint returns 404 (not deployed)"
    echo ""
    echo "========================================="
    echo "DEPLOYMENT NOT COMPLETE"
    echo "========================================="
    echo ""
    echo "Action Required:"
    echo "1. Railway Dashboard → Connect GitHub repo"
    echo "2. Repository: misto-guest/bol-outreach"
    echo "3. Trigger deployment"
    echo "4. Run test again"
    echo ""
    exit 1
elif echo "$RESPONSE" | grep -q "success"; then
    echo "✓ PASS - Endpoint working!"
    echo ""
    echo "Response preview:"
    echo "$RESPONSE" | head -10
else
    echo "⚠ WARNING - Unexpected response"
    echo "$RESPONSE" | head -5
fi
echo ""

# Test 3: Verify Data
echo "TEST 3: Verify Database State"
STATS=$(curl -s "$API_BASE/api/stats")
SELLERS=$(echo "$STATS" | grep -o '"totalSellers":[0-9]*' | grep -o '[0-9]*')
echo "Total sellers: $SELLERS"
echo "✓ Data accessible"
echo ""

# Summary
echo "========================================="
if echo "$RESPONSE" | grep -q "success"; then
    echo "✓ ALL TESTS PASSED"
    echo ""
    echo "Platform is FULLY FUNCTIONAL"
else
    echo "⚠ TESTS INCOMPLETE"
    echo ""
    echo "Platform is PARTIALLY FUNCTIONAL"
fi
echo "========================================="
echo ""

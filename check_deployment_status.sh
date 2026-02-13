#!/bin/bash

# Bol.com Outreach - Deployment Status Check

echo "========================================="
echo "Railway Deployment Status Check"
echo "========================================="
echo ""
echo "Check Time: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)"
echo ""

# Health Check
echo "1. API Health Status:"
HEALTH=$(curl -s https://bol-outreach-production.up.railway.app/api/health)
if echo "$HEALTH" | grep -q "ok"; then
    echo "   ✓ API is healthy"
    echo "   $(echo "$HEALTH" | python3 -m json.tool 2>/dev/null)"
else
    echo "   ✗ API not responding"
fi
echo ""

# Critical Endpoint Test
echo "2. Critical Endpoint Test (POST /api/campaigns/2/sellers):"
RESPONSE=$(curl -s -X POST https://bol-outreach-production.up.railway.app/api/campaigns/2/sellers \
  -H "Content-Type: application/json" \
  -d '{"sellerIds":[1,2],"approvalStatus":"pending"}')

if echo "$RESPONSE" | grep -q "Cannot POST"; then
    echo "   ✗ FAIL - Returns 404"
    echo ""
    echo "   Current Status: NOT DEPLOYED"
    echo "   Expected: 200 OK with seller data"
elif echo "$RESPONSE" | grep -q "success"; then
    echo "   ✓ PASS - Endpoint working!"
    echo "   Response preview:"
    echo "$RESPONSE" | head -5
else
    echo "   ⚠ Unexpected response"
    echo "$RESPONSE" | head -5
fi
echo ""

# Database Check
echo "3. Database Status:"
SELLERS=$(curl -s https://bol-outreach-production.up.railway.app/api/sellers)
SELLER_COUNT=$(echo "$SELLERS" | grep -o '"id":' | wc -l | tr -d ' ')
echo "   Sellers in database: $SELLER_COUNT"
echo ""

# Campaigns Check
echo "4. Campaign Status:"
CAMPAIGNS=$(curl -s https://bol-outreach-production.up.railway.app/api/campaigns)
CAMPAIGN_COUNT=$(echo "$CAMPAIGNS" | grep -o '"id":' | wc -l | tr -d ' ')
echo "   Campaigns created: $CAMPAIGN_COUNT"
echo ""

# Summary
echo "========================================="
echo "STATUS SUMMARY"
echo "========================================="
echo ""
echo "Actions Taken by User:"
echo "  ✓ Visited Railway dashboard"
echo "  ✓ Confirmed GitHub repo connected"
echo "  ✓ Triggered 'Redeploy' from Railway UI"
echo ""
echo "Current Time: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)"
echo ""
echo "Railway Deployment Status: IN PROGRESS or PENDING"
echo ""
echo "What to Check in Railway Dashboard:"
echo "  1. Deployments tab - Look for new build"
echo "  2. Build logs - Check for errors"
echo "  3. Deployment status - Should show ACTIVE or BUILDING"
echo ""
echo "Expected Timeline:"
echo "  • Railway deployment: 2-5 minutes"
echo "  • Build process: 1-2 minutes"
echo "  • Health checks: 30 seconds"
echo "  • Total: 3-7 minutes"
echo ""
echo "If Deployment Stuck:"
echo "  1. Check deployment logs for errors"
echo "  2. Verify GitHub repo has latest commits"
echo "  3. Try 'New Deployment' instead of 'Redeploy'"
echo "  4. Check branch is set to 'main'"
echo ""
echo "Next Verification:"
echo "  Run: /Users/northsea/clawd-dmitry/verify_bol_deployment.sh"
echo "  Or: curl -X POST https://bol-outreach-production.up.railway.app/api/campaigns/2/sellers -H 'Content-Type: application/json' -d '{\"sellerIds\":[1,2]}'"
echo ""
echo "========================================="

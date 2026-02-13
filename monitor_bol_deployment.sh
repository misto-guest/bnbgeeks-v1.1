#!/bin/bash

# Bol.com Outreach - Deployment Monitor
# Checks every 30 seconds for deployment completion

API_BASE="https://bol-outreach-production.up.railway.app"
CHECK_INTERVAL=30  # seconds

echo "========================================="
echo "Bol.com Outreach Deployment Monitor"
echo "========================================="
echo ""
echo "Monitoring: $API_BASE"
echo "Check interval: ${CHECK_INTERVAL}s"
echo ""
echo "Press Ctrl+C to stop monitoring"
echo ""
echo "Started: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)"
echo ""

check_count=0
while true; do
    check_count=$((check_count + 1))
    echo "[$check_count] Checking deployment... $(date -u +%H:%M:%S\ UTC)"

    # Test critical endpoint
    RESPONSE=$(curl -s -X POST "$API_BASE/api/campaigns/2/sellers" \
      -H "Content-Type: application/json" \
      -d '{"sellerIds":[1,2]}' 2>/dev/null)

    if echo "$RESPONSE" | grep -q "Cannot POST"; then
        echo "  → Still waiting... (404)"
    elif echo "$RESPONSE" | grep -q "success"; then
        echo "  ✓ DEPLOYMENT COMPLETE!"
        echo ""
        echo "========================================="
        echo "✓ CRITICAL ENDPOINT DEPLOYED"
        echo "========================================="
        echo ""
        echo "Response:"
        echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
        echo ""
        echo "Time: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)"
        echo ""
        echo "Next: Run full workflow test"
        echo "Command: /Users/northsea/clawd-dmitry/verify_bol_deployment.sh"
        echo ""
        break
    else
        echo "  ⚠ Unexpected response"
        echo "$RESPONSE" | head -3
    fi
    echo ""

    # Wait before next check
    sleep $CHECK_INTERVAL
done
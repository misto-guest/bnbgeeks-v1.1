#!/bin/bash
# Network Diagnostic for SEO Query Manager
# This script helps diagnose why the service isn't accessible from the internet

echo "=== SEO Query Manager Network Diagnostic ==="
echo ""

echo "1. Checking if Gunicorn is running..."
ps aux | grep -E "gunicorn.*5001" | grep -v grep && echo "✅ Gunicorn is running" || echo "❌ Gunicorn is NOT running"
echo ""

echo "2. Checking port 5001 binding..."
nettop 2>/dev/null | grep 5001 || echo "Using Python to check..."
python3 -c "
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.bind(('0.0.0.0', 0))
    s.listen(1)
    print('✅ Can bind to 0.0.0.0 (all interfaces)')
except:
    print('❌ Cannot bind to 0.0.0.0')
s.close()
"
echo ""

echo "3. Testing local access (localhost:5001)..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/ | grep -q "200" && echo "✅ Local access works" || echo "❌ Local access FAILED"
echo ""

echo "4. Getting public IP..."
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null)
echo "📡 Public IP: $PUBLIC_IP"
echo ""

echo "5. Testing external access (from public IP)..."
curl -s -o /dev/null -w "%{http_code}" --connect-timeout 3 http://$PUBLIC_IP:5001/ | grep -q "200" && echo "✅ External access works" || echo "❌ External access FAILED"
echo ""

echo "6. Checking macOS Firewall..."
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate | grep -q "disabled" && echo "✅ Firewall is disabled" || echo "⚠️  Firewall is enabled (might block connections)"
echo ""

echo "=== DIAGNOSIS ==="
echo ""
echo "If tests 1-3 passed but test 5 failed, the issue is:"
echo "📋 ROUTER PORT FORWARDING NOT CONFIGURED"
echo ""
echo "To fix:"
echo "1. Log into your router (usually 192.168.1.1 or 192.168.0.1)"
echo "2. Find 'Port Forwarding' or 'NAT' section"
echo "3. Add a rule:"
echo "   - External Port: 5001"
echo "   - Internal Port: 5001"
echo "   - Internal IP: [Your Mac's local IP]"
echo "   - Protocol: TCP"
echo "4. Save and restart router"
echo ""
echo "Find your Mac's local IP:"
echo "   System Settings > Network > Wi-Fi/Ethernet > Details"
echo ""

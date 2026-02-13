# 🔍 SEO Query Manager - TROUBLESHOOTING REPORT
**Generated:** February 12, 2026 @ 13:47 CET

---

## ✅ WHAT'S WORKING

### 1. Gunicorn Process
```
✅ Status: RUNNING
✅ Process ID: 79849-79853 (1 master + 4 workers)
✅ Binding: 0.0.0.0:5001 (all interfaces)
✅ Uptime: Restarted successfully at 13:47
```

### 2. Local Service Access
```
✅ http://localhost:5001/ - 200 OK
✅ http://localhost:5001/api/status - 200 OK
✅ http://localhost:5001/api/queries - 200 OK
```

### 3. API Health Check
```json
{
  "status": "healthy",
  "active_queries": 0,
  "total_results": 0,
  "timestamp": "2026-02-12T13:47:00.938509"
}
```

### 4. Authentication
```
✅ API Key: seo-query-manager-key
✅ Working correctly
```

---

## ❌ WHAT'S NOT WORKING

### External Access from Internet
```
❌ http://87.208.4.155:5001/ - TIMEOUT/FAILED
❌ Public IP access blocked
```

**Diagnosis:** SERVICE IS RUNNING BUT NOT ACCESSIBLE FROM INTERNET

---

## 🎯 ROOT CAUSE

**Router Port Forwarding Not Configured**

The service is running perfectly on your Mac (local IP: 87.208.4.155:5001), but your **router is not forwarding incoming connections** on port 5001 to your Mac.

**Why this happens:**
- Your Mac has a local IP (e.g., 192.168.1.x)
- Your router has a public IP (87.208.4.155)
- When someone connects to 87.208.4.155:5001, the router doesn't know which device to forward it to
- Without port forwarding, the connection dies at the router

---

## 🔧 HOW TO FIX

### Step 1: Find Your Mac's Local IP
```bash
# On macOS:
System Settings → Network → Wi-Fi → Details
# Look for: "IPv4 Address" (e.g., 192.168.1.50)
```

### Step 2: Access Your Router
```
1. Open browser to: http://192.168.1.1 (or 192.168.0.1)
2. Log in with admin credentials
3. Look for "Port Forwarding", "NAT", or "Virtual Server"
```

### Step 3: Add Port Forwarding Rule
```
Name: SEO Query Manager
External Port: 5001
Internal Port: 5001
Internal IP: [Your Mac's local IP from Step 1]
Protocol: TCP
Status: Enabled
```

### Step 4: Save & Restart Router
```
Click "Apply" or "Save"
Restart router if prompted
```

### Step 5: Test from Outside Network
```
Option 1: Use your phone on mobile data (not WiFi)
Option 2: Ask a friend to test
Option 3: Use online tool: https://www.yougetsignal.com/tools/open-ports/

Test URL: http://87.208.4.155:5001/api/status
```

---

## 🧪 TESTING INSTRUCTIONS

After configuring port forwarding:

### Test 1: Local Access (Should Always Work)
```bash
curl http://localhost:5001/api/status
```
Expected: `{"status":"healthy",...}`

### Test 2: Public IP Access (Will Work After Port Forwarding)
```bash
curl http://87.208.4.155:5001/api/status
```
Expected: `{"status":"healthy",...}`

### Test 3: Web Interface
```
http://87.208.4.155:5001/
```
Expected: SEO Query Manager dashboard

---

## 📋 CURRENT CONFIGURATION

```
Service: Gunicorn (Production WSGI Server)
Port: 5001
Binding: 0.0.0.0 (all interfaces)
Workers: 4
Logs: logs/access.log, logs/error.log
Public IP: 87.208.4.155
API Key: seo-query-manager-key
```

---

## 🚀 QUICK DIAGNOSTIC SCRIPT

Run this to verify everything:
```bash
cd seo-backlinks-search/query-manager
./network-diagnostic.sh
```

This will check:
- Gunicorn process status
- Port binding
- Local access
- Public IP
- External access
- Firewall status

---

## ✅ NEXT STEPS

1. **Configure port forwarding** (most important!)
2. **Test from outside network** (phone on mobile data)
3. **Verify all API endpoints** work
4. **Update DEPLOYMENT.md** with "VERIFIED" status

---

## 📞 NEED HELP?

If port forwarding is confusing:
- Search YouTube for "port forwarding [router brand]"
- Common router brands: Netgear, TP-Link, ASUS, Linksys
- Each router has different UI, but concept is the same

**IMPORTANT:** Port forwarding configuration happens on your ROUTER, not on your Mac. I cannot configure it remotely.

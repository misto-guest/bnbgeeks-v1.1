# Legiit Automation - Quick Start

## ⚡ Easiest Way to Start

**Just double-click and go!**

### macOS:
Double-click `start.command`

### Windows:
Double-click `start.bat`

### Linux:
Run `./start-setup.sh`

Browser opens automatically → Fill in form → Done!

---

## 📖 Full Guide

See **[EASY-START.md](EASY-START.md)** for complete instructions with screenshots.

---

## 📡 API Endpoint (for Integration)

```
POST http://localhost:3000/api/purchase-citation
```

**Headers:**
```
X-API-Key: your_api_key
Content-Type: application/json
```

**Body:**
```json
{
  "domain": "mybusiness.com",
  "businessName": "My Business LLC",
  "address": "123 Main St, New York, NY 10001"
}
```

---

## 🎯 What This Does

Automatically purchases local citation packages from Legiit:
- ✅ Logs into your Legiit account
- ✅ Navigates to the gig page
- ✅ Selects Standard package
- ✅ Fills in business details
- ✅ Pays with wallet balance
- ✅ Returns order confirmation

---

## 📚 Documentation

- **[EASY-START.md](EASY-START.md)** - Complete setup guide (start here!)
- **[DASHBOARD-GUIDE.md](DASHBOARD-GUIDE.md)** - Dashboard features
- **[API-GUIDE.md](API-GUIDE.md)** - API documentation
- **[INTEGRATION.md](INTEGRATION.md)** - Code examples
- **[README-OLD.md](README-OLD.md)** - Original technical docs

---

## ✨ Features

- ✅ **Web dashboard** for easy setup
- ✅ **One-click launcher** - no terminal needed
- ✅ **API endpoint** for tool integration
- ✅ **Test form** to verify it works
- ✅ **Automatic** - hands-free purchasing
- ✅ **Secure** - credentials stay local

---

## 🚀 Ready?

Double-click `start.command` (Mac) or `start.bat` (Windows) and you're done!

**Dashboard opens:** http://localhost:8080  
**API runs on:** http://localhost:3000

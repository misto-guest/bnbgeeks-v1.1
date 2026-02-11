# 📁 Legiit Automation - Folder Guide

## 🎯 What to Double-Click

Open the `legiit-automation` folder and look for these files:

### macOS Users:
```
legiit-automation/
└── start.command          ⭐⭐⭐ DOUBLE-CLICK THIS ⭐⭐⭐
```

### Windows Users:
```
legiit-automation/
└── start.bat              ⭐⭐⭐ DOUBLE-CLICK THIS ⭐⭐⭐
```

### Linux Users:
```
legiit-automation/
└── start-setup.sh         ⭐⭐⭐ RUN THIS ⭐⭐⭐
```

---

## 📸 What Happens When You Double-Click

### 1. Terminal Window Opens
Shows:
```
🖥️  Legiit Automation Dashboard
================================

📦 Installing dependencies...
✅ Installation complete!

📡 Starting dashboard...
🌐 Opening your browser...

✅ Dashboard is running!
   URL: http://localhost:8080
```

### 2. Browser Opens Automatically
- Beautiful web interface appears
- URL: http://localhost:8080

### 3. Fill in the Form
```
Legiit Email: your@email.com
Legiit Password: ••••••••
```

### 4. Click Buttons
- "Save Configuration"
- "Start Server"

### 5. Done!
Dashboard shows your API info

---

## 🛑 How to Stop

When you're done:
- **Press Ctrl+C** in the terminal window
- Or just close the terminal window

---

## 🔄 Next Time You Use It

Just double-click again! Dependencies are already installed, so it starts in 3 seconds.

---

## 📂 All Files Explained

```
legiit-automation/
│
├── 📄 EASY-START.md           ← Start here! Complete guide
├── 📄 README-QUICK.md          ← Quick reference
│
├── 🖥️  start.command           ← Double-click (Mac)
├── 🖥️  start.bat               ← Double-click (Windows)
├── 🖥️  start-setup.sh          ← Run (Linux)
│
├── 📁 src/
│   ├── setup-server.js        ← Dashboard backend
│   ├── server.js              ← Automation API
│   └── legiit-automation.js    ← Puppeteer logic
│
├── 📁 public/
│   └── setup.html             ← Web dashboard UI
│
├── 📁 node_modules/            ← Auto-created dependencies
├── 📁 logs/                    ← Screenshot logs
│
└── 📄 .env                     ← Your credentials (auto-created)
```

---

## ✅ Checklist

**First Time:**
- [ ] Double-click `start.command` or `start.bat`
- [ ] Wait 30 seconds (installing)
- [ ] Browser opens automatically
- [ ] Fill in Legiit email & password
- [ ] Click "Save Configuration"
- [ ] Click "Start Server"
- [ ] Copy API key
- [ ] ✅ Done!

**Every Day:**
- [ ] Double-click `start.command` or `start.bat`
- [ ] Browser opens
- [ ] Click "Start Server"
- [ ] ✅ Ready!

---

## 💡 Tips

1. **Create a shortcut** - Drag `start.command` to your desktop
2. **Add to Dock** - Drag it to your Mac Dock
3. **Bookmark the dashboard** - http://localhost:8080
4. **Save your API key** - Copy it to a safe place

---

## 🎉 That's It!

**Double-click → Browser opens → Fill form → Done!**

No terminal knowledge needed. No coding. Just point and click.

---

**Need help?** See [EASY-START.md](EASY-START.md) for detailed instructions.

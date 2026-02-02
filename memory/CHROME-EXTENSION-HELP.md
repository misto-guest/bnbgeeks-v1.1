# How to Find & Load Clawdbot Chrome Extension

## The Issue
`.clawdbot` is a **hidden folder** (starts with dot), so it's invisible by default.

---

## 🔍 Find the Extension Path

### Option 1: Use Terminal (Easiest)
```bash
clawdbot browser extension path
```

This will output the exact path, e.g.:
```
/Users/northsea/.clawdbot/browser/chrome-extension
```

### Option 2: Use Finder
1. Open Finder
2. Press **Cmd + Shift + .** (period) to show hidden files
3. Navigate to your home folder
4. Look for `.clawdbot` folder
5. Open: `.clawdbot/browser/chrome-extension`

---

## 📦 Load in Chrome

### Step 1: Open Chrome Extensions Page
1. Open Chrome
2. Go to: `chrome://extensions`
3. Enable **Developer mode** (toggle in top-right)

### Step 2: Load the Extension
1. Click **"Load unpacked"** button
2. Navigate to the hidden folder:
   - Press **Cmd + Shift + G** in the file picker
   - Paste the path: `/Users/northsea/.clawdbot/browser/chrome-extension`
   - Or navigate manually with Cmd+Shift+. to see hidden files
3. Select the `chrome-extension` folder
4. Click **"Select"**

### Step 3: Pin Extension
1. Find "Clawdbot Browser Relay" in your extensions list
2. Click the **puzzle piece** icon in Chrome toolbar
3. Pin "Clawdbot Browser Relay"

---

## ✅ Verify Installation

1. Navigate to https://getnada.com
2. Click the Clawdbot extension icon
3. Badge should show **ON** ✅

---

## 🎯 Quick Copy-Paste Path

```bash
# Get the path
clawdbot browser extension path

# Output will be:
/Users/northsea/.clawdbot/browser/chrome-extension
```

Then in Chrome file picker: **Cmd + Shift + G** and paste that path!

---

*The extension is already installed, you just need to make hidden files visible!*

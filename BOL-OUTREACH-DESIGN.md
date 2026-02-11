# Bol.com Outreach Tool - Design Standards

**Project Location:** /Users/northsea/clawd-dmitry/bol-outreach
**Production URL:** https://bol-outreach-production.up.railway.app
**GitHub:** misto-guest/bol-outreach

---

## 🎨 Design System - MANDATORY

### Framework
- **Custom CSS** with **TailwindCSS-inspired design system**
- Use CSS Variables for theming
- Component-based architecture

### Theme
- **Light theme ONLY** - no dark mode
- White backgrounds
- Subtle, professional shadows
- Clean, minimal interface
- High contrast for readability

### Typography
- **Font Family:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700, 800
- Hierarchy: Clear heading/body/label distinctions

### Design Inspiration
- **Stripe** - Clean, professional, trust-building
- **Vercel** - Minimal, modern, developer-focused
- **Linear** - Polished, smooth interactions, excellent spacing

### Color Palette
```css
/* Primary - Modern Blue Gradient */
--primary-500: #00a0e3;

/* Accent - Purple Gradient */
--accent-500: #8b5cf6;

/* Semantic */
--success-500: #22c55e;
--danger-500: #ef4444;
--warning-500: #f59e0b;
```

---

## 🔧 Key Features

### Seller Discovery
- Keyword search with pagination
- Returns 25-50+ sellers (not just 2)
- Load more functionality
- Deduplication logic

### AdsPower Integration
- Anti-captcha browser automation
- Profile selector UI
- Graceful fallback to vanilla Puppeteer

### Template Management
- Save/edit/delete message templates
- Multi-language support
- Dutch templates commonly used

### Campaign Management
- Create outreach campaigns
- Track seller responses
- Approval queue workflow

---

## 📋 Technical Stack

- **Backend:** Node.js + Express
- **Database:** SQLite (path: /data/bol-outreach.db)
- **Browser Automation:** Puppeteer + AdsPower
- **Platform:** Railway (containerized deployment)
- **API:** RESTful endpoints

---

## 🚀 Deployment

### Railway Config
- Healthcheck: `/api/health`
- Persistent Volume: `/data` (1GB)
- Environment Variables:
  - `NODE_ENV=production`
  - `PORT=3000`
  - `DATABASE_PATH=/data/bol-outreach.db`

### Auto-Deployment
- Push to `main` branch triggers Railway rebuild
- Health check ensures app is responsive

---

## 📝 Notes

- **Always use light theme** - dark mode is NOT acceptable
- Design quality must match Stripe/Vercel/Linear
- Inter font is mandatory
- White backgrounds, subtle shadows
- Professional, clean aesthetic

---

**Last Updated:** 2026-02-10
**Status:** Active production use

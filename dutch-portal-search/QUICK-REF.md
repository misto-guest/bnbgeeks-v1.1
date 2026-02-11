# Quick Reference - Dutch Portal Search (Multi-Keyword Format)

## 🚀 Run Command

```bash
cd dutch-portal-search
npm start
```

## 📝 Search Format

### Multi-Keyword (NEW)
```
https://kb.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

Format: `{brand}+{delimiter phrase}`

### Not Single Keyword (OLD)
```
❌ https://kb.nl/zoeken?q=mrkortingscode.nl
```

## ✅ Validation Rule

**SUCCESS** = Brand **AND** Delimiter both in results
- Brand: "mrkortingscode" or "mr kortingscode"
- Delimiter: "Het laatste nieuws vind je op Nhd.nl" (or similar)

## 🎯 Target

Find **50+ unique Dutch domains** with combined mentions

## 📊 Output

### CSV
- Location: `results/dutch-portals-{timestamp}.csv`
- Columns: Domain, SearchURL, **DelimiterPhrase**, Found, ScreenshotPath, Timestamp, Snippet

### Screenshots
- Location: `results/screenshots/`
- Format: `{domain}-{timestamp}.png`

## 🔁 Delimiter Phrases (10 total)

1. "Het laatste nieuws vind je op Nhd.nl"
2. "Beste deals via mrkortingscode"
3. "Shop met mrkortingscode.nl"
4. "Profiteer van mrkortingscode aanbiedingen"
5. "Bespaar geld met mrkortingscode"
6. "Actuele mrkortingscode deals"
7. "Exclusieve mrkortingscode.nl codes"
8. "mrkortingscode.nl bespaartips"
9. "De beste mrkortingscode acties"
10. "mrkortingscode.nl kortingsbonnen"

*Randomly selected for each portal*

## 📈 Progress

Reported every 10 sites:
```
Sites checked: 10
Unique domains with combined mentions: 3
Target: 50
Progress: 6.0%
```

## ⏱️ Performance

- **Portals**: 100+
- **Estimated Time**: 2-4 hours
- **Success Rate**: ~30-40%
- **Delay**: 2000ms between requests

## 🛠️ Test Mode

```bash
cd dutch-portal-search
node test.js
```

Tests 3 sites for quick validation.

## 📚 Documentation

- **FORMAT-UPDATE.md** - Multi-keyword format details
- **README.md** - Full documentation
- **SETUP-COMPLETE.md** - Setup guide
- **IMPLEMENTATION-SUMMARY.md** - Technical summary

## 🎯 Core Sites (Priority 1)

1. Rijksoverheid.nl
2. Politie.nl
3. Overheid.nl
4. NU.nl
5. Nos.nl
6. KB.nl
7. Marktplaats.nl

## ✨ Benefits of Multi-Keyword

1. ✅ Higher success rate
2. ✅ Avoids "no results"
3. ✅ More natural patterns
4. ✅ Better validation
5. ✅ Diversified searches

## 🔄 How It Works

1. Select random delimiter phrase
2. Build multi-keyword search query
3. Navigate to search URL
4. Handle consent dialogs
5. Wait for Cloudflare
6. Check results for **BOTH** brand AND delimiter
7. Take screenshot
8. Log to CSV
9. Repeat until 50+ found

---

**Status**: Ready to run ✓
**Format**: Multi-keyword (brand + delimiter) ✓
**Target**: 50+ domains ✓

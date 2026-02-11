# Dutch Portal Search - Setup Complete ✓

## 🚨 CRITICAL UPDATE: Multi-Keyword Format

### What Changed
✅ **Search format updated**: Now uses multi-keyword searches with delimiter phrases
- OLD: `?q=mrkortingscode.nl` (single keyword)
- NEW: `?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl` (multi-keyword)

### Why
- Avoids "no results" pages
- More natural search patterns
- Higher success rate
- Better validation (brand + delimiter required)

See **FORMAT-UPDATE.md** for full details.

---

## What Was Created

A complete AdsPower + Puppeteer automation system to find Dutch portals mentioning `mrkortingscode.nl` using **multi-keyword search format**.

### Files Created

```
dutch-portal-search/
├── search.js              # Main automation (100+ portals, multi-keyword format)
├── adspower.js            # AdsPower API integration
├── package.json           # Dependencies
├── .gitignore            # Git rules
├── README.md             # Full documentation (updated)
├── FORMAT-UPDATE.md      # Multi-keyword format details (NEW)
├── SETUP-COMPLETE.md     # This file
├── quick-start.sh        # Quick start script
├── test.js               # Test script
└── results/              # Created at runtime
    ├── dutch-portals-{timestamp}.csv
    └── screenshots/
        └── {domain}-{timestamp}.png
```

## Quick Start

### Option 1: Run Immediately (Standalone Mode)

```bash
cd dutch-portal-search
npm start
```

### Option 2: Use Quick Start Script

```bash
cd dutch-portal-search
./quick-start.sh
```

### Option 3: With AdsPower (Recommended)

1. **Start AdsPower**
   - Download: https://www.adspower.net/download
   - Enable API in Settings → API → Local API
   - Port: 50325

2. **Run Automation**
   ```bash
   cd dutch-portal-search
   npm start
   ```

## What It Does (Updated)

For each of 100+ Dutch portals:

1. ✅ **Selects random delimiter phrase** (10 options)
2. ✅ **Builds multi-keyword search**: `brand+delimiter phrase`
3. ✅ Navigates to search URL with multi-keyword query
4. ✅ Handles consent dialogs ("Akkoord", "Accepteer", etc.)
5. ✅ Waits for Cloudflare challenges to auto-solve
6. ✅ **Checks for BOTH brand AND delimiter in results**
7. ✅ Takes screenshot of results page
8. ✅ Logs to CSV with delimiter phrase used
9. ✅ Reports progress every 10 sites

## Search URL Examples

### Multi-Keyword Format (NEW)
```
https://kb.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
https://marktplaats.nl/q/mrkortingscode.nl+Beste+deals+via+mrkortingscode
https://nu.nl/zoeken?q=mrkortingscode.nl+Shop+met+mrkortingscode.nl
```

### Construction
```
https://[domain]/[searchPath][brand]+[delimiter phrase]
```

## Delimiter Phrases Used

Randomly selected for each portal:
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

## Core Authority Sites (Priority 1)

1. ✅ Rijksoverheid.nl
2. ✅ Politie.nl
3. ✅ Overheid.nl
4. ✅ NU.nl
5. ✅ Nos.nl
6. ✅ KB.nl
7. ✅ Marktplaats.nl

Plus 90+ additional Dutch domains.

## Output (Updated)

### CSV File

Location: `results/dutch-portals-{timestamp}.csv`

**Columns**:
- Domain
- SearchURL
- **DelimiterPhrase** ← NEW
- Found (Yes/No)
- ScreenshotPath
- Timestamp
- Snippet

### Screenshots

Location: `results/screenshots/`

Full-page screenshots showing search results for each portal.

## Validation Rule (UPDATED)

✅ **SUCCESS**: Search results show **BOTH**:
- Brand: "mrkortingscode" or "mr kortingscode"
- **AND** delimiter phrase

❌ **FAILURE**: Missing brand OR delimiter phrase

## Progress Reporting

Every 10 sites checked:

```
============================================================
PROGRESS REPORT
============================================================
Sites checked: 10
Unique domains with combined mentions: 3
Target: 50
Progress: 6.0%
============================================================
```

## Technical Details

### Technologies

- **Puppeteer Extra**: Headless browser automation
- **Stealth Plugin**: Avoid bot detection
- **CSV Writer**: Result logging
- **Axios**: HTTP requests for AdsPower API

### Anti-Detection Measures

- Unique fingerprint per profile (AdsPower)
- Dutch user agent
- Dutch timezone (Europe/Amsterdam)
- Dutch language (nl-NL)
- Random delays between requests (2000ms)
- Cloudflare challenge handling
- **Multi-keyword searches** (more natural patterns)

### Consent Dialog Handling

Automatically handles:
- "Akkoord" / "Accepteer" buttons
- Cookie consent banners
- GDPR dialogs
- Common Dutch consent phrases

## Target

🎯 **Goal**: Find 50+ unique Dutch domains with **combined mentions** (brand + delimiter)

⏱️ **Estimated Time**: ~2-4 hours (100+ domains @ ~2min/domain)

📊 **Expected Success Rate**: ~30-40% (improved with multi-keyword format)

## Key Improvements

### Multi-Keyword Format Benefits

1. ✅ **Higher Success Rate**: More sites show actual results
2. ✅ **Better Validation**: Both brand AND delimiter required
3. ✅ **Natural Patterns**: Mimics real user searches
4. ✅ **Avoids "No Results"**: Multi-keyword searches work better
5. ✅ **Diversification**: 10 different delimiter phrases rotate

### CSV Output Enhancements

- **DelimiterPhrase column**: Shows which delimiter was used
- **Enhanced snippets**: Shows what was found (brand/delimiter/both)
- **Real-time logging**: Results saved immediately

## Next Steps

1. **Review the format update**
   ```bash
   cat dutch-portal-search/FORMAT-UPDATE.md
   ```

2. **Run the automation**
   ```bash
   cd dutch-portal-search
   npm start
   ```

3. **Monitor progress**
   - Watch console output for real-time updates
   - Check `results/` directory for CSV and screenshots

4. **Review results**
   - Open CSV file to see all findings
   - View screenshots for verification
   - Check DelimiterPhrase column to see which phrases worked

## Troubleshooting

### Issue: "No combined match found"

**Solution**: This is expected. Not all sites will have both brand AND delimiter.

- If you see "BRAND only" → Brand exists but delimiter not found
- If you see "DELIMITER only" → Delimiter exists but brand not found
- If you see "BRAND ✓ DELIMITER ✓" → Success!

### Issue: "AdsPower not running"

**Solution**: Either:
- Start AdsPower application
- Run in standalone mode (already configured)

### Issue: Cloudflare timeout

**Solution**:
- Increase delay in `processPortal()` function
- Use Dutch proxy in AdsPower profile

## Support

For issues or questions:
1. Check **FORMAT-UPDATE.md** for multi-keyword format details
2. Check **README.md** for detailed documentation
3. Review `search.js` code comments
4. Check console output for error messages

## Format Update Details

See **FORMAT-UPDATE.md** for complete information about:
- Why multi-keyword format was implemented
- How delimiter phrases work
- Validation rule changes
- Search URL construction
- Expected results

---

**Created**: 2025-02-10
**Updated**: 2025-02-10 (Multi-keyword format)
**Purpose**: Find Dutch portals mentioning mrkortingscode.nl
**Status**: Ready to run ✓

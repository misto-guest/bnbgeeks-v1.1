# Dutch Portal Search Automation

AdsPower + Puppeteer automation to find Dutch portals mentioning `mrkortingscode.nl` in their internal search results using **multi-keyword format**.

## ⚠️ IMPORTANT: Multi-Keyword Format

### Search Format (UPDATED)
```
https://kb.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

**NOT**: `https://kb.nl/zoeken?q=mrkortingscode.nl`

### Why Multi-Keyword?
- ✅ Avoids "no results" pages
- ✅ More natural search patterns
- ✅ Higher success rate
- ✅ Better validation (brand + delimiter required)

## Goal

Find **50+ unique Dutch domains** where search results contain **BOTH**:
1. Brand mention: "mrkortingscode" or "mr kortingscode"
2. Delimiter phrase: "Het laatste nieuws vind je op Nhd.nl" (or similar)

## Requirements

### AdsPower Setup

1. **Install AdsPower** (Free tier works)
   - Download: https://www.adspower.net/download
   - Or use cracked version

2. **Configure API**
   - Open AdsPower
   - Go to Settings → API
   - Enable Local API
   - Default port: `50325`

3. **Create Browser Profiles** (optional)
   - Each profile gets unique fingerprint
   - Set location: Netherlands (Europe/Amsterdam timezone)
   - Language: Dutch (nl-NL)
   - Proxy: No proxy (or use Dutch proxy)

### Dependencies

```bash
cd dutch-portal-search
npm install
```

## Usage

### Basic Mode (Puppeteer Standalone)

```bash
npm start
```

Runs without AdsPower integration. Good for testing.

### Test Mode

```bash
npm test
```

Process only first 3 sites for testing.

## How It Works

For each Dutch portal:

1. **Select random delimiter phrase** (e.g., "Het laatste nieuws vind je op Nhd.nl")
2. **Build multi-keyword search query**: `{brand}+{delimiter phrase}`
3. **Navigate** to search URL with multi-keyword query
4. **Handle consent dialogs** (click "Akkoord", "Accepteer", etc.)
5. **Wait for Cloudflare** challenges to auto-solve
6. **Check search results** for **BOTH** brand AND delimiter phrase
7. **Take screenshot** of results page
8. **Log to CSV** with timestamp and delimiter phrase used

## Output

### CSV File

`results/dutch-portals-{timestamp}.csv`

Columns:
- Domain
- SearchURL
- **DelimiterPhrase** (which delimiter was used)
- Found (Yes/No)
- ScreenshotPath
- Timestamp
- Snippet

### Screenshots

`results/screenshots/{domain}-{timestamp}.png`

Full-page screenshots of search results.

## Validation Rule (UPDATED)

✅ **SUCCESS**: Search results show **BOTH**:
- Brand: "mrkortingscode" or "mr kortingscode" or "mrkortingscode.nl"
- **AND** delimiter phrase (e.g., "Het laatste nieuws vind je op Nhd.nl")

❌ **FAILURE**: Missing brand OR missing delimiter phrase

## Delimiter Phrases Used

System randomly selects from these phrases for each portal:

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

## Core Dutch Authority Sites (Priority 1)

1. Rijksoverheid.nl
2. Politie.nl
3. Overheid.nl
4. NU.nl
5. Nos.nl
6. KB.nl
7. Marktplaats.nl

**Example search URL:**
```
https://www.rijksoverheid.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

## Additional Dutch Portals

The script includes 100+ Dutch domains across categories:
- News & Media
- Government & Public Services
- E-commerce
- Forums & Community
- Business & Professional
- Tech & Software
- Lifestyle
- Local News
- Education
- Travel & Leisure
- Real Estate
- Job Sites
- Health
- Automotive
- Sports
- Entertainment
- Banking & Finance
- Insurance
- Energy
- Classifieds
- Dating
- Weather
- Telecom
- And more...

## Consent Dialog Handling

Automatically handles common Dutch consent dialogs:
- "Akkoord" / "Accepteer"
- "Accept" / "Accept All"
- "Ja, ik ga akkoord"
- Cookiebot, Didomi, and more

## Cloudflare Handling

When Cloudflare detected:
- Waits for auto-solve
- 10-second timeout
- Logs warning in output

## Search URL Examples

### Marktplaats
```
https://www.marktplaats.nl/q/mrkortingscode.nl+Beste+deals+via+mrkortingscode
```

### NU.nl
```
https://www.nu.nl/zoeken?q=mrkortingscode.nl+Shop+met+mrkortingscode.nl
```

### KB.nl
```
https://www.kb.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

## Troubleshooting

### AdsPower Not Running

```
Error: connect ECONNREFUSED 127.0.0.1:50325
```

**Solution:** Start AdsPower application and enable API.

### Cloudflare Timeouts

**Solution**: 
- Use Dutch proxy
- Increase delay between requests
- Use AdsPower profiles with better fingerprints

### Rate Limiting

**Solution:**
- Increase delay between requests (currently 2000ms)
- Rotate IP addresses with proxies
- Reduce concurrent requests

## Extension Points

### Add More Portals

Edit `search.js` and add to `DUTCH_PORTALS` array:

```javascript
{ 
    domain: 'example.nl', 
    searchPath: '/zoeken?q=' 
}
```

### Add Delimiter Phrases

Edit `DELIMITER_PHRASES` in `search.js`:

```javascript
const DELIMITER_PHRASES = [
    'Your new delimiter phrase',
    'Another phrase',
];
```

### Add Consent Selectors

Edit `handleConsentDialogs()` function in `search.js`:

```javascript
const xpathSelectors = [
    "//button[contains(text(), 'Your Button Text')]",
];
```

## Format Update Details

See **FORMAT-UPDATE.md** for complete details on the multi-keyword format update.

**Key Points:**
- Uses brand + delimiter phrase (multi-keyword)
- Validates BOTH brand AND delimiter appear
- 10 different delimiter phrases rotate randomly
- Higher success rate than single-keyword searches
- More natural search patterns

## License

MIT

## Author

Generated for mrkortingscode.nl brand discovery project.

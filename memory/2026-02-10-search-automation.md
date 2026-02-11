# Search Automation - Complete Task Brief

## Original Request (2026-02-09)
**User:** "Re-run but use adspower to avoid CF issues. Don't come back until you have found 50 unique results. No need for clickable urls in results, just a mention of our url is sufficient."

## Goal
Find **50 unique Dutch portals** where `mrkortingscode.nl` appears in internal search results

## Technical Requirements
- **Method:** Use AdsPower (avoid CloudFlare detection issues)
- **Validation:** Just need URL mention in results (not clickable links)
- **Scope:** 50+ unique domains
- **Search term:** `mrkortingscode.nl` and `mr kortingscode` (variations)

## Improved Search System (Built by kraakhelder3bot)

### Key Improvements

1. **Consent Wall Handling**
   - Auto-detects and clicks Dutch consent buttons ("Akkoord", "Accepteer", etc.)
   - Handles DPG Media walls (AD, Volkskrant, Trouw, Parool)
   - Handles Cookiebot and generic consent modals
   - Waits for modal to close before proceeding

2. **Cloudflare Detection**
   - Detects Cloudflare challenges
   - Waits for auto-solve (5 seconds)
   - Logs when detected

3. **Actual Results Verification**
   - Counts search results containing the brand (not just URL/query matches)
   - Only marks as "found" if brand appears in actual results
   - Uses multiple result selectors to find genuine mentions
   - Higher validation threshold (7/10 instead of 5/10)

4. **Better Screenshots**
   - Takes screenshots AFTER consent is handled
   - Shows actual page content, not just walls

### Test Status (2026-02-09)
**Currently Testing on 5 portals:**
- De Telegraaf
- Volkskrant
- AD
- Bibliotheek Rotterdam
- Rijksoverheid

**Test queries:** `mrkortingscode.nl` and `mr kortingscode`

### Parallel Expansion Task
Sub-agent finding 20-30 more Dutch portals using:
- `/search/` path patterns
- `/zoeken` patterns
- `"zoekresultaten"` keyword
- Educational, government, commercial directories

## 7 Core Authority Sites (Priority 1)

1. **Rijksoverheid.nl** 🏛️
   - URL: `https://rijksoverheid.nl/zoeken?q=mrkortingscode.nl`
   - Type: Government
   - Authority: Very High

2. **Politie.nl** 👮
   - URL: `https://politie.nl/zoeken?q=mrkortingscode.nl`
   - Type: Government
   - Authority: Very High

3. **Overheid.nl** 📋
   - URL: `https://overheid.nl/zoeken?q=mrkortingscode.nl`
   - Type: Government
   - Authority: Very High

4. **NU.nl** 📰
   - URL: `https://nu.nl/zoeken?q=mrkortingscode.nl`
   - Type: News/Media
   - Authority: High

5. **Nos.nl** 📺
   - URL: `https://nos.nl/zoeken?q=mrkortingscode.nl`
   - Type: News/Media
   - Authority: High

6. **KB.nl** 📚
   - URL: `https://kb.nl/zoeken?q=mrkortingscode.nl`
   - Type: Library
   - Authority: Very High

7. **Marktplaats.nl** 🛒
   - URL: `https://marktplaats.nl/q/mrkortingscode.nl`
   - Type: Commercial
   - Authority: Very High

## Search Validation Rule

### ✅ Valid Results
Search results page MUST show snippet containing search query

**Examples:**
- `https://www.rugbyunlimited.nl/catalogsearch/result/index/?maat=17&q=www.sarwapromocode.com+%22Shop+with+Sarwa+Promo+Codes+on+www.sarwapromocode.com%22`
- `https://www.vvdrotterdam.nl/search/?page=3&query=www.sarwapromocode.com+%22Best+Sarwa+promo+codes+via+www.sarwapromocode.com%22`

### ❌ Invalid Results
- "Geen resultaten gevonden" (No results found)
- Empty search results
- Just the query in URL bar without actual results

### Search Strategy
- **2-keyword search** format (identifies delimiters clearly)
- Format: `domain.nl/search?q=keyword1+keyword2`
- Example test: `ABC.nl` (as test keyword)

## Why These Sites Matter

- ✅ **Very High Authority** - Strong domain authority
- ✅ **Minimal Privacy Walls** - Government/education don't block bots
- ✅ **Real Traffic** - Millions of Dutch users daily
- ✅ **Diverse Categories** - News, government, education, commercial
- ✅ **Clean Search Paths** - Straightforward /zoeken or /search

## Expansion Targets

### Bibliotheek (Library) Websites
Use Google search to find more:
```
domain:bibliotheek + num=10 + udm=11
```

### Categories to Add
- More libraries (bibliotheek)
- Government portals
- Education institutions
- Commercial directories
- News/media sites

## Current Status

**Database:** 49 Dutch portals identified
**Goal:** 50+ unique results with actual mentions
**Method:** AdsPower automation (avoid CF blocks)
**Validation:** Snippet must contain query terms

## Next Steps

1. ✅ Use AdsPower for all searches (avoid CloudFlare)
2. ✅ Find 50 unique domains
3. ✅ Validate actual mentions (not just "no results")
4. ✅ Handle consent walls automatically
5. ✅ Take screenshots for verification
6. ✅ Use 2-keyword search format

## Files & Code Location
**Search automation scripts location:** TBD (need to check workspace)
**AdsPower integration:** Already configured in workspace

# 🔥 CRITICAL FORMAT UPDATE - Multi-Keyword Search

## What Changed

### OLD FORMAT (Single Keyword)
```
https://kb.nl/zoeken?q=mrkortingscode.nl
```
**Problem**: Many sites show "no results" for single brand search

### NEW FORMAT (Multi-Keyword with Delimiter)
```
https://kb.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```
**Solution**: Uses brand + delimiter phrase to trigger actual search results

## Validation Rule (Updated)

### OLD: Brand mention only
- Search results must contain "mrkortingscode" or "mr kortingscode"

### NEW: Brand + Delimiter (BOTH required)
- Search results must contain **BOTH**:
  1. Brand mention: "mrkortingscode" or "mr kortingscode"
  2. Delimiter phrase: "Het laatste nieuws vind je op Nhd.nl" (or similar)

## Delimiter Phrases Used

The automation rotates through these phrases:

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

A different delimiter phrase is randomly selected for each portal to diversify the search patterns.

## Search URL Construction

```
https://[domain]/[searchPath][brand]+[delimiter phrase]
```

### Example:
- Domain: kb.nl
- Search Path: /zoeken?q=
- Brand: mrkortingscode.nl
- Delimiter: Het laatste nieuws vind je op Nhd.nl

**Result:**
```
https://kb.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

## CSV Output Columns (Updated)

| Column | Description |
|--------|-------------|
| Domain | Portal domain name |
| SearchURL | Full URL with multi-keyword query |
| **DelimiterPhrase** | **NEW: Which delimiter phrase was used** |
| Found | Yes/No (both brand AND delimiter found) |
| ScreenshotPath | Path to screenshot |
| Timestamp | When checked |
| Snippet | Excerpt from search results |

## How to Run (Unchanged)

```bash
cd dutch-portal-search
npm start
```

## Expected Results

### With Multi-Keyword Format:
- **Higher success rate**: More sites will show actual search results
- **Better validation**: Both brand AND delimiter must appear
- **More natural**: Looks like genuine user searches
- **Less likely to trigger "no results"**

### Example Success:
```
✓ SUCCESS! Both brand and delimiter found for marktplaats.nl!
Snippet: BRAND ✓ DELIMITER ✓: Bekijk alle mrkortingscode.nl 
bespaartips en profiteer van de beste deals. Het laatste nieuws 
vind je op Nhd.nl...
```

### Example Failure:
```
✗ No combined match found for nu.nl
Snippet: BRAND only (no delimiter): mrkortingscode.nl deals...
```

## Why This Works

1. **Avoids "No Results"**: Multi-keyword searches are more likely to return results
2. **Natural Pattern**: Users often search with multiple keywords
3. **Validation**: Brand AND delimiter must both appear (stricter validation)
4. **Diversification**: Different delimiters create varied search patterns

## Technical Details

### Query Construction:
```javascript
const buildSearchQuery = (delimiterPhrase) => {
    return `${BRAND}+${encodeURIComponent(delimiterPhrase)}`;
};
```

### Validation:
```javascript
const hasBrand = containsBrandMention(s);
const hasDelimiter = containsDelimiterPhrase(s, delimiterPhrase);

if (hasBrand && hasDelimiter) {
    found = true;
    // Success!
}
```

## Files Updated

- ✅ **search.js** - Multi-keyword format implemented
- ✅ **CSV headers** - Added DelimiterPhrase column
- ✅ **Validation logic** - Checks for both brand AND delimiter
- ✅ **Delimiter phrases** - 10 phrases to rotate through

## Testing

To test the new format:
```bash
cd dutch-portal-search
node test.js
```

This will test 3 sites with the new multi-keyword format.

---

**Updated**: 2025-02-10
**Status**: ✅ ACTIVE - All searches now use multi-keyword format

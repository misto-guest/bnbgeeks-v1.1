# Search Format Clarification - Multi-Keyword with Delimiter

## Critical Update (2026-02-10 15:40)

**User Requirement:** Use multi-keyword search format where second keyword acts as delimiter/snippet.

## Correct Search Format

### ❌ WRONG - Single keyword only
```
https://kb.nl/zoeken?q=mrkortingscode.nl
```
**Problem:** Can't identify delimiter between search terms

### ✅ CORRECT - Multi-keyword with delimiter
```
https://kb.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```
**Why correct:** Second keyword clearly marks the delimiter

## Purpose of Two-Keyword Format

**Keyword 1:** The brand we're searching for
- Example: `mrkortingscode.nl`

**Keyword 2:** Descriptive phrase acting as delimiter
- Example: `Het laatste nieuws vind je op Nhd.nl`
- Example: `"Best deals via mrkortingscode"`
- Example: `"Shop with Sarwa Promo Codes"`

**Benefits:**
- ✅ Clear delimiter identification
- ✅ Easier to parse search results
- ✅ Reduces false positives
- ✅ Better validation of actual search functionality

## Real Examples from Context

**Example 1:** Rugby Unlimited
```
https://www.rugbyunlimited.nl/catalogsearch/result/index/?maat=17&q=www.sarwapromocode.com+%22Shop+with+Sarwa+Promo+Codes+on+www.sarwapromocode.com%22
```
- Keyword 1: `www.sarwapromocode.com`
- Keyword 2 (delimiter): `"Shop with Sarwa Promo Codes on www.sarwapromocode.com"`

**Example 2:** VVD Rotterdam
```
https://www.vvdrotterdam.nl/search/?page=3&query=www.sarwapromocode.com+%22Best+Sarwa+promo+codes+via+www.sarwapromocode.com%22
```
- Keyword 1: `www.sarwapromocode.com`
- Keyword 2 (delimiter): `"Best Sarwa promo codes via www.sarwapromocode.com"`

## Updated Search Strategy for Dutch Portals

### Test Search (using ABC.nl as test)
```
https://kb.nl/zoeken?q=ABC.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
https://nu.nl/zoeken?q=ABC.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
https://nos.nl/zoeken?q=ABC.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

### Production Search (mrkortingscode.nl)
```
https://kb.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
https://nu.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
https://nos.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

## Alternative Delimiter Phrases

Use any descriptive phrase that includes the brand:

- `"Het laatste nieuws vind je op mrkortingscode.nl"`
- `"Beste deals via mrkortingscode"`
- `"Shop met mrkortingscode.nl`
- `"Promo codes door mrkortingscode"`
- `"De beste kortings via mrkortingscode"`

## Implementation Notes

1. **URL Encoding:** Spaces become `+` or `%20`
2. **Quotes:** Optional but helpful for multi-word phrases
3. **Format:** `keyword1+delimiter+phrase`
4. **Validation:** Check that BOTH keywords appear in results

## Updated Validation Rule

**Valid Result:** Search results page shows snippet containing:
- ✅ The brand (keyword 1)
- ✅ The delimiter phrase (keyword 2)
- ✅ In the actual results (not just "no results")

**Invalid Result:**
- ❌ "Geen resultaten gevonden" (No results found)
- ❌ Only one keyword appears
- ❌ Empty search results

## Summary

**Always use 2-keyword format:**
```
{brand} + {descriptive delimiter phrase}
```

**Example:**
```
mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

This ensures clear delimiter identification and better result validation.

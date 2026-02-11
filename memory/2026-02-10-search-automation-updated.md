# Search Automation Task - UPDATED WITH CORRECT FORMAT

## ⚠️ CRITICAL FORMAT REQUIREMENT

**Search Format:** Multi-keyword with delimiter phrase

### ❌ WRONG - Single keyword
```
https://kb.nl/zoeken?q=mrkortingscode.nl
```

### ✅ CORRECT - Multi-keyword with delimiter
```
https://kb.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

## Format Breakdown

**Keyword 1 (Brand):** `mrkortingscode.nl`
**Keyword 2 (Delimiter):** `Het laatste nieuws vind je op Nhd.nl`
**Separator:** `+` (URL-encoded space)

## Why This Format?

1. **Clear Delimiter** - Second keyword marks where search query ends
2. **Better Validation** - Can verify both keywords appear in results
3. **Reduces False Positives** - Easier to identify genuine search results
4. **Parsable** - Simpler to extract and validate results

## Examples from Valid Results

**Rugby Unlimited:**
```
q=www.sarwapromocode.com+%22Shop+with+Sarwa+Promo+Codes+on+www.sarwapromocode.com%22
```
- Brand: www.sarwapromocode.com
- Delimiter: "Shop with Sarwa Promo Codes on www.sarwapromocode.com"

**VVD Rotterdam:**
```
query=www.sarwapromocode.com+%22Best+Sarwa+promo+codes+via+www.sarwapromocode.com%22
```
- Brand: www.sarwapromocode.com
- Delimiter: "Best Sarwa promo codes via www.sarwapromocode.com"

## Search URLs for 7 Core Sites

Use this format for ALL searches:

```bash
# 1. Rijksoverheid
https://rijksoverheid.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl

# 2. Politie
https://politie.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl

# 3. Overheid
https://overheid.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl

# 4. NU.nl
https://nu.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl

# 5. Nos.nl
https://nos.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl

# 6. KB.nl
https://kb.nl/zoeken?q=mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl

# 7. Marktplaats
https://marktplaats.nl/q/mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

## Alternative Delimiter Phrases

Can use any descriptive phrase:

- `Het+laatste+nieuws+vind+je+op+Nhd.nl`
- `Beste+deals+via+mrkortingscode`
- `Shop+met+mrkortingscode.nl`
- `Promo+codes+door+mrkortingscode`
- `De+beste+kortings+via+mrkortingscode`

## Test Format (using ABC.nl)

```bash
https://kb.nl/zoeken?q=ABC.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
https://nu.nl/zoeken?q=ABC.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

## Validation Rule

**Valid Result:** Search results page MUST show:
- ✅ Brand name (keyword 1)
- ✅ Delimiter phrase (keyword 2)
- ✅ In actual search result snippets (not just URL)

**Invalid Result:**
- ❌ "Geen resultaten gevonden"
- ❌ Only one keyword appears
- ❌ Empty or no results
- ❌ Results don't contain both keywords

## Implementation in Code

```javascript
// Build search URL with 2-keyword format
const brand = 'mrkortingscode.nl';
const delimiter = 'Het laatste nieuws vind je op Nhd.nl';
const searchQuery = `${brand}+${delimiter.replace(/ /g, '+')}`;

const searchUrl = `https://kb.nl/zoeken?q=${searchQuery}`;
```

## Summary

**ALWAYS use 2-keyword format:**
```
{brand} + {delimiter phrase}
```

**Example:**
```
mrkortingscode.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

This is MANDATORY for all 50+ portal searches.

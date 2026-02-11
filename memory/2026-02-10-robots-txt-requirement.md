# Search Automation - UPDATED REQUIREMENTS (2026-02-10 15:51)

## Critical Changes

### ❌ REMOVED: Authority Sites Requirement
- NO LONGER restricted to government/news/library sites
- ANY website with internal search is valid

### ✅ NEW: robots.txt Validation
- MUST check domain.tld/robots.txt before testing
- Search path MUST be allowed (not in Disallow)
- If disallowed → SITE IS INVALID

## Updated Validation Requirements

### Step 1: Check robots.txt
```
https://domain.tld/robots.txt
```

**Example - nu.nl (INVALID):**
```txt
User-agent: *
Allow: /api/
Disallow: /zoeken/
```
Result: ❌ INVALID - `/zoeken/` is disallowed

**Example - Valid Site:**
```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
```
Result: ✅ VALID - Search paths not disallowed

### Step 2: Test Search Functionality

**Test Keyword:** `ABC.nl` (NOT mrkortingscode.nl)

**Search Format:**
```
domain.tld/search?q=ABC.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

### Step 3: Validate Snippet Visibility

**✅ VALID - Snippet shows on page:**
```
Search Results for "ABC.nl Het laatste nieuws vind je op Nhd.nl"

1. Title: Example Site
   URL: https://example.com/page
   SNIPPET: ...ABC.nl...Het laatste nieuws vind je op Nhd.nl...

2. Title: Another Result
   URL: https://example.com/another
   SNIPPET: ...Find more at ABC.nl with Nhd.nl...
```

**❌ INVALID - No visible snippet:**
```
Search Results for "ABC.nl Het laatste nieuws vind je op Nhd.nl"

1. Title: Example Site
   URL: https://example.com/page

2. Title: Another Result
   URL: https://example.com/another
```
(No snippet text visible)

## Complete Validation Checklist

For each site:

1. ✅ Fetch `https://domain.tld/robots.txt`
2. ✅ Check if search path (e.g., `/zoeken`, `/search`) is allowed
3. ✅ If disallowed → SKIP (mark as INVALID)
4. ✅ If allowed or not mentioned → Test search
5. ✅ Use test keyword: `ABC.nl`
6. ✅ Use format: `ABC.nl+delimiter+phrase`
7. ✅ Check if snippet shows in results
8. ✅ If snippet visible → VALID
9. ✅ If no snippet → INVALID

## Search Path Patterns to Test

Common search URL patterns:
- `/search?q=`
- `/zoeken?q=`
- `/search?query=`
- `/search?q=`
- `/s?q=`
- `/q/`
- `?s=`
- `?search=`
- `/?q=`
- `/?search=`

## Example Validation Process

### Site: example.com

**Step 1: Check robots.txt**
```
GET https://example.com/robots.txt

Response:
User-agent: *
Disallow: /admin
Disallow: /private

Result: ✅ No mention of /search or /zoeken - ALLOWED
```

**Step 2: Test Search**
```
GET https://example.com/search?q=ABC.nl+Het+laatste+nieuws+vind+je+op+Nhd.nl
```

**Step 3: Check Results**
```html
<div class="search-results">
  <div class="result">
    <h3>Example Page</h3>
    <p>SNIPPET: Find great deals at ABC.nl with latest news from Nhd.nl...</p>
  </div>
</div>
```

Result: ✅ VALID - Snippet contains search terms

### Site: nu.nl (KNOWN INVALID)

**Step 1: Check robots.txt**
```
GET https://nu.nl/robots.txt

Response:
User-agent: *
Allow: /api/
Disallow: /zoeken/

Result: ❌ /zoeken/ is disallowed - INVALID
```

Skip to next site (no need to test search)

## Output Format

```csv
Domain,RobotsTxtCheck,SearchPath,SearchURL,SnippetVisible,Valid
example.com,Allowed,/search,https://example.com/search?q=...,Yes,VALID
nu.nl,Disallow,/zoeken,https://nu.nl/zoeken?q=...,N/A,INVALID
another.com,Allowed,/search,https://another.com/search?q=...,No,INVALID
```

## Automation Priority

1. **High Priority:** Sites with `/robots.txt` allowing search paths
2. **Medium Priority:** Sites with no robots.txt (assume allowed)
3. **Skip:** Sites with robots.txt disallowing search paths

## Search Discovery Methods

1. **Google Dorks:**
   ```
   site:nu.nl inurl:search
   site:.nl inurl:zoeken
   site:.nl intitle:"zoeken"
   ```

2. **Common Paths:**
   - Try `/search`, `/zoeken`, `/s`, `?s=`, `?q=`
   - Look for search boxes in HTML source
   - Check for search forms

3. **Directory Sites:**
   - Startpagina.nl
   - Vinden.nl
   - Ikzoek.nl
   - Allsites.nl
   - Startnieuws.nl

## Remember

- Test with `ABC.nl` (NOT mrkortingscode.nl)
- Check robots.txt FIRST
- Snippet must be VISIBLE on page
- Any site type is valid (not just authority sites)
- Goal: 50+ VALID sites with visible snippets

## Invalid Site Examples

**nu.nl** - /zoeken disallowed in robots.txt
**Any site** where search path is blocked
**Any site** where snippet doesn't show in results
**Any site** returning "no results" consistently

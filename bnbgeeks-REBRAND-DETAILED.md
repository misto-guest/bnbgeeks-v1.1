# BNBGeeks Rebrand - Detailed Implementation Plan

## Brand Identity Changes

### Element Transformations

| Element | Current (HomeGeeks) | New (BNB Geeks) |
|---------|-------------------|----------------|
| **Name** | HomeGeeks | BNB Geeks |
| **Domain** | homegeeks.org | bnbgeeks.org |
| **Slogan** | Home24 SEO Experts | Guaranteed Airbnb Rankings |
| **Primary Color** | Orange (#F97316) | Coral/Pink-Red (#FF385C - Airbnb-inspired) |
| **Service** | Home24 product ranking | Airbnb listing ranking |
| **Guarantee** | Top 7 in 14 days | Page 1 in 30 days |
| **Active Since** | N/A | 2020 |
| **Pricing** | EUR-based | USD-based ($149/$199/$249 per month) |

---

## Files to Modify (17 Total)

### 1. **Color Theme** - `src/index.css`
```css
/* Change */
--primary: 24 95% 53%; /* Orange */
/* To */
--primary: 350 100% 61%; /* Coral/Pink-Red (#FF385C) */
```

**Also update:**
- `--accent` CSS variable
- `--ring` CSS variable
- All sidebar primary variables

---

### 2. **Homepage** - `src/pages/Index.tsx`

**MetaHead updates:**
```typescript
<title>Boost Airbnb SEO - Improve Search Ranking & Listing Visibility</title>
<meta name="description" content="Get your Airbnb listing on page 1. Guaranteed rankings or your money back. Proven SEO strategies for Airbnb hosts." />
```

**Content updates:**
- All "HomeGeeks" → "BNB Geeks"
- All "Home24" → "Airbnb"

---

### 3. **Hero Section** - `src/components/homegeeks/HeroSection.tsx`

**Headline:**
```
"Be Seen First on Airbnb. More Views, More Bookings."
```

**Subheadline:**
```
"We help your Airbnb show up where it matters - page one. That's where guests book, and that's where we'll get you."
```

**CTA Buttons:**
- "Start My Ranking Campaign"
- "Free Call: Let's Talk Airbnb Growth"

**Alt text:** Update hero image alt text

---

### 4. **Top Bar** - `src/components/homegeeks/TopBar.tsx`

**Discount code:**
```
"WELCOME50" - "Save 50% on Your First 3 Months"
```

**Stats:**
- "100+ Clients"
- "200+ Campaigns"

---

### 5. **Main Navigation** - `src/components/homegeeks/MainNav.tsx`

**Remove:**
- "Marketplaces" dropdown (not applicable for Airbnb)

**Add:**
- Pricing (anchor link)
- Case Studies
- About Us
- Contact Us
- FAQ

**Updates:**
- Logo alt text → "BNB Geeks"
- Aria labels → "BNB Geeks"

---

### 6. **What We Do Section** - `src/components/homegeeks/WhatWeDoSection.tsx`

**Rewrite for Airbnb:**
- Ranking higher in Airbnb search
- Page one visibility
- More bookings

**3-Step Process:**
1. Choose plan
2. Receive ranking guide
3. We launch campaign

**Timeline:** Change "14 days" → "30 days"

---

### 7. **Case Studies** - `src/components/homegeeks/CaseStudiesSection.tsx`

**Replace keywords:**
- Home24 product → Airbnb location-based examples
- Examples: "Alkmaar", "Dubai Marina", "Valencia"

**Update metrics:** Match Airbnb ranking context

---

### 8. **Testimonials** - `src/components/homegeeks/TestimonialsSection.tsx`

**Replace:**
- Home24-specific testimonials → Airbnb host testimonials
- "Furniture Seller, Home24.de" → "Airbnb Host, [City]"

---

### 9. **Pricing Section** - `src/components/homegeeks/PricingSection.tsx`

**3 Tiers:**
- Basic: $149/mo
- Standard: $199/mo
- Premium: $249/mo

**Duration:** All plans are 3-month duration

**Features:**
- Boost 1 Airbnb listing
- Max search results: 600/800/1000+
- Top 7 guarantee
- Free ranking guide
- Custom listing description
- Account manager
- Rank tracker

**Currency:** EUR → USD

---

### 10. **SEO Content** - `src/components/homegeeks/SEOContentSection.tsx`

**Remove:**
- Home24 country grid (not applicable)

**Replace with:**
- Airbnb SEO content
- How to rank higher on Airbnb
- Optimization tips
- Visibility improvement

---

### 11. **Partners Bar** - `src/components/homegeeks/PartnersBar.tsx`

**Options:**
- Replace with e-commerce platform logos (Allegro, etc.)
- Remove if not relevant

---

### 12. **Team Section** - `src/components/homegeeks/TeamSection.tsx`

**Update:**
- "Home24 and beyond" → "Airbnb hosts succeed"

---

### 13. **CTA Section** - `src/components/homegeeks/CTASection.tsx`

**Updates:**
- "Home24" → "Airbnb"
- contact@homegeeks.org → contact@bnbgeeks.org

---

### 14. **Footer** - `src/components/homegeeks/Footer.tsx`

**Updates:**
- Brand name → "BNB Geeks"
- Email → contact@bnbgeeks.org
- Description
- Remove Home24 marketplace links
- Add Airbnb-related links
- Keep "Etsy Geeks" as sister brand
- Copyright → "BNB Geeks"

---

### 15. **Logo Component** - `src/components/homegeeks/Logo.tsx`

**Alt text:**
```
"BNB Geeks - Guaranteed Airbnb Rankings"
```

---

### 16. **FAQ Section** - `src/components/homegeeks/FAQSection.tsx`

**Update all FAQ content:**
- Home24 context → Airbnb context

---

### 17. **Meta Head** - `src/components/MetaHead.tsx`

**No structural changes needed** - content handled in Index.tsx

---

### 18. **Site Config Hook** - `src/hooks/useSiteConfig.ts`

**Update default values:**
- Brand name
- Email
- Description
- Social links

---

## Color Scheme Technical Details

### Primary Color Change

**Reference:** Airbnb brand color #FF385C

**HSL Approximation:** 350 100% 61%

**Apply to:**
```css
:root {
  --primary: 350 100% 61%;  /* Was: 24 95% 53% */
  --accent: 350 100% 61%;
  --ring: 350 100% 61%;
}
```

---

## Content Strategy

### Terminology Changes

| From | To |
|------|-----|
| "Home24" | "Airbnb" |
| "product" | "listing" |
| "sellers" | "hosts" |
| "14 days guarantee" | "30 days (Page 1)" |
| EUR | USD |
| "Active since: N/A" | "Active since: 2020" |

### Messaging Additions

- "No cure, No pay" messaging
- "Guaranteed rankings" emphasis
- Airbnb-specific benefits

---

## What Will NOT Change

✅ **Protected Components:**
- Component structure and architecture
- Order system, checkout flow, payment integration
- Admin panel and dashboard
- Authentication system
- Database schema
- Edge functions
- Cart system

---

## Implementation Checklist

### Phase 1: Foundation (Day 1)
- [ ] Update color theme (src/index.css)
- [ ] Update site config hook
- [ ] Test color changes

### Phase 2: Core Pages (Days 2-3)
- [ ] Update homepage (Index.tsx)
- [ ] Update hero section
- [ ] Update navigation
- [ ] Update footer

### Phase 3: Components (Days 3-4)
- [ ] Update top bar
- [ ] Update what we do section
- [ ] Update case studies
- [ ] Update testimonials
- [ ] Update pricing
- [ ] Update SEO content
- [ ] Update partners bar
- [ ] Update team section
- [ ] Update CTA section
- [ ] Update FAQ section

### Phase 4: Polish (Day 5)
- [ ] Update logo component
- [ ] Update meta head
- [ ] Test all pages
- [ ] Verify all links
- [ ] Check responsive design
- [ ] SEO validation

---

## Success Criteria

**Rebrand Complete When:**
- ✅ No "HomeGeeks" references visible
- ✅ No "Home24" references visible
- ✅ All copy speaks to Airbnb hosts
- ✅ BNBGeeks branding (coral/pink-red) consistent
- ✅ All pages use new terminology
- ✅ No broken links or references
- ✅ SEO meta tags updated
- ✅ Color scheme matches Airbnb inspiration

---

## Testing Strategy

### Visual Testing
- Check all pages for color consistency
- Verify terminology changes
- Test responsive design
- Check mobile view

### Link Testing
- Verify all internal links work
- Check external links
- Test navigation
- Verify anchor links

### SEO Testing
- Validate meta tags
- Check OpenGraph tags
- Verify structured data
- Test social sharing

---

## Rollback Plan

### If Issues Arise

**Quick Revert:**
```bash
git checkout main
# Restores original HomeGeeks version
```

**Partial Revert:**
```bash
# Revert specific files
git checkout main -- src/index.css
git checkout main -- src/pages/Index.tsx
```

**Backup Before Starting:**
```bash
# Create backup branch
git checkout -b backup-before-bnbgeeks-rebrand
git push origin backup-before-bnbgeeks-rebrand
```

---

## Estimated Time

**Total:** 3-5 days

- Day 1: Color theme + core pages
- Day 2-3: Component updates
- Day 4: Testing and polish
- Day 5: Final validation

---

## Notes

**Created from:** Detailed brand specification provided by user
**Repository:** /Users/northsea/clawd-dmitry/bnbgeeks/
**Framework:** Next.js 15, React 19, Tailwind CSS
**Status:** Ready to implement
**Priority:** High (waiting on project setup completion)

---

**Created:** 2026-02-09
**Status:** Detailed spec complete, awaiting execution
**Next:** Spawn sub-agent to implement rebrand

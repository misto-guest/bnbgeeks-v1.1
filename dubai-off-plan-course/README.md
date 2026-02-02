# Dubai Off-Plan Course - Dutch Landing Page

A beautiful, production-grade single-page website for Dubai off-plan property investment education, targeting Dutch investors.

## 🎨 Design Features

- **Distinctive Dutch Design**: Minimalist but warm, bold typography
- **Custom Color Palette**: Ocean blue, gold sand, warm white (no generic AI gradients)
- **Premium Typography**: Playfair Display (headings), Source Sans 3 (body), JetBrains Mono (data)
- **Interactive Elements**: ROI calculator, smooth scrolling, hover effects
- **Mobile-First**: Fully responsive design
- **Performance Optimized**: No external dependencies, single HTML file

## 📊 Key Sections

1. **Hero**: Bold headline, trust badges, dual CTAs
2. **Stats**: Real 2024-2025 Dubai market data
3. **Modules**: 8 course modules with detailed content
4. **ROI Calculator**: Interactive tool with real market projections
5. **Testimonials**: Dutch investor reviews
6. **CTA**: Conversion-focused call to action
7. **Footer**: Links, legal, contact info

## 🚀 Quick Start

### Option 1: Local Preview

```bash
cd /Users/northsea/clawd-dmitry/dubai-off-plan-course

# Python 3
python3 -m http.server 8000

# Then open: http://localhost:8000
```

### Option 2: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /Users/northsea/clawd-dmitry/dubai-off-plan-course
vercel
```

### Option 3: Deploy to Netlify

```bash
# Drag and drop the folder to:
# https://app.netlify.com/drop
```

## 🎯 Customization

### Update Content

Edit `index.html` directly:

- **Text**: Search for Dutch text and replace
- **Colors**: Modify CSS variables in `:root`
- **Images**: Add to images/ folder and update paths
- **Links**: Update CTA buttons with real URLs

### Styling

All styles are in `<style>` tag. Key variables:

```css
:root {
    --ocean-blue: #0a2540;
    --gold-sand: #c9a227;
    --warm-white: #faf8f5;
}
```

## 📈 Analytics Integration

Add before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔗 Next Steps

1. **Review content** - Check Dutch text accuracy
2. **Add domain** - Connect your custom domain
3. **Set up payment** - Integrate Stripe/Mollie
4. **Add analytics** - Track conversions
5. **SEO optimization** - Add meta descriptions
6. **Launch marketing** - TikTok, LinkedIn, WhatsApp

## 💡 Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, grid, flexbox
- **Vanilla JavaScript** - No dependencies
- **Zero build step** - Deploy instantly

## 📱 Mobile Performance

- Fully responsive (320px to 4K)
- Touch-optimized interactions
- Fast load times (< 2s on 4G)
- Progressive enhancement

## 🎓 Course Modules

1. Market Fundamentals
2. How Off-Plan Works
3. Location Strategy
4. Due Diligence
5. Financing
6. Exit Strategies
7. Risks & Red Flags
8. Real Case Studies

## 🔐 Legal

Add to footer:
- Privacy Policy (GDPR compliant)
- Terms of Service
- Disclaimer (not financial advice)
- Cookie Policy

## 📧 Contact

- WhatsApp: +31 6 XX XX XX XX
- Email: info@dubaiinvest.nl
- LinkedIn: [Your Profile]

---

**Built with** ❤️ **for Dutch investors in Dubai real estate**

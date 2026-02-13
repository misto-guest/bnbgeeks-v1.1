#!/bin/bash
# Fix all homegeeks imports - replace with bnbgeeks or shared components

cd /Users/northsea/clawd-dmitry/bnbg

# Fix OurService.tsx
sed -i.bak 's|from "@/components/homegeeks/TopBar"|from "@/components/wtg/TopBar"|g' src/pages/OurService.tsx
sed -i.bak 's|from "@/components/homegeeks/MainNav"|from "@/components/bnbgeeks/MainNav"|g' src/pages/OurService.tsx
sed -i.bak 's|from "@/components/homegeeks/Footer"|from "@/components/checkout/Footer"|g' src/pages/OurService.tsx

# Fix RequestProductDescription.tsx
sed -i.bak 's|from "@/components/homegeeks/TopBar"|from "@/components/wtg/TopBar"|g' src/pages/RequestProductDescription.tsx
sed -i.bak 's|from "@/components/homegeeks/MainNav"|from "@/components/bnbgeeks/MainNav"|g' src/pages/RequestProductDescription.tsx
sed -i.bak 's|from "@/components/homegeeks/Footer"|from "@/components/checkout/Footer"|g' src/pages/RequestProductDescription.tsx

# Add TopBar, MainNav, Footer to pages that don't have them
# AboutUs, ContactUs, FAQ already have them now
# Need to add to other pages if needed

echo "Fixed imports in:"
echo "  - OurService.tsx"
echo "  - RequestProductDescription.tsx"
echo ""
echo "You may need to manually add navigation components to pages that are missing them."

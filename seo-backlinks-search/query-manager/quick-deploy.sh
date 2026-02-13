#!/bin/bash

# Quick Deploy Script - One command to deploy the SEO Query Manager

echo "🚀 SEO Query Manager - Quick Deploy"
echo "==================================="
echo ""
echo "Choose deployment platform:"
echo "1) Railway.app (Recommended - Free tier, no cold starts)"
echo "2) Render.com (Alternative - Free tier with cold starts)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
  1)
    echo ""
    echo "📦 Deploying to Railway.app..."
    echo ""
    chmod +x deploy-to-railway.sh
    ./deploy-to-railway.sh
    ;;
  2)
    echo ""
    echo "📦 Deploying to Render.com..."
    echo ""
    echo "⚠️  Manual deployment required. See CLOUD_DEPLOYMENT.md for instructions."
    echo ""
    echo "Quick steps:"
    echo "1. Push deployment files to GitHub:"
    echo "   git add render.yaml Procfile .python-version"
    echo "   git commit -m 'Add Render deployment configs'"
    echo "   git push origin main"
    echo ""
    echo "2. Go to https://dashboard.render.com and:"
    echo "   - Click 'New +' → 'Web Service'"
    echo "   - Connect your GitHub repo"
    echo "   - Set root directory to: seo-backlinks-search/query-manager"
    echo "   - Configure environment variables (see CLOUD_DEPLOYMENT.md)"
    echo "   - Click 'Deploy'"
    ;;
  *)
    echo "❌ Invalid choice. Exiting."
    exit 1
    ;;
esac

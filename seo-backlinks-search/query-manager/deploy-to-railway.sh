#!/bin/bash

# SEO Query Manager - Cloud Deployment Script
# This script deploys the Query Manager to Railway.app

set -e

echo "🚀 SEO Query Manager - Cloud Deployment"
echo "========================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
fi

# Login to Railway (interactive)
echo "📝 Please login to Railway.app..."
railway login

# Initialize project
echo "📦 Creating Railway project..."
cd "$(dirname "$0")"

railway init --name "seo-query-manager"

# Set environment variables
echo "🔧 Configuring environment variables..."
railway variables set SERPER_API_KEY="${SERPER_API_KEY:-your_serper_api_key_here}"
railway variables set SECRET_KEY="${SECRET_KEY:-$(openssl rand -hex 32)}"
railway variables set API_KEY="${API_KEY:-seo-query-manager-key}"
railway variables set PYTHON_VERSION="3.9.0"
railway variables set PORT="5001"

# Deploy
echo "🚀 Deploying to Railway.app..."
railway up

# Get the deployment URL
echo "⏳ Waiting for deployment to complete..."
sleep 10

DOMAIN=$(railway domains 2>&1 | grep -E 'https?://[^ ]+' | head -1 | sed 's/.*\(https[^ ]*\).*/\1/')

if [ -n "$DOMAIN" ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Public URL: $DOMAIN"
    echo "🔌 API Base URL: $DOMAIN/api/"
    echo "🔑 API Key: seo-query-manager-key"
    echo ""
    echo "📊 Dashboard: https://railway.app/project/$(railway project)"
    echo ""
    echo "✅ Next steps:"
    echo "   1. Set your SERPER_API_KEY in Railway dashboard"
    echo "   2. Test the API: curl $DOMAIN/api/status"
    echo "   3. Access the web interface at $DOMAIN"
else
    echo "⚠️  Deployment initiated. Check Railway dashboard for URL."
    echo "📊 Dashboard: https://railway.app/project/$(railway project)"
fi

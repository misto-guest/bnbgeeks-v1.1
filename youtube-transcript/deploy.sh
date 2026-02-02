#!/bin/bash
# Quick Deploy Script for YouTube Transcript Extractor

echo "🚀 YouTube Transcript Extractor - Deployment Options"
echo ""
echo "Choose deployment method:"
echo ""
echo "1) Local server (for testing)"
echo "2) Netlify (drag & drop)"
echo "3) Vercel (CLI)"
echo "4) GitHub Pages"
echo "5) Export for manual FTP upload"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "📡 Starting local server on http://localhost:3000"
        echo "Press Ctrl+C to stop"
        echo ""
        python3 -m http.server 3000
        ;;
    
    2)
        echo ""
        echo "📦 Preparing for Netlify deployment..."
        echo ""
        echo "Steps:"
        echo "1. Go to https://netlify.com/drop"
        echo "2. Drag and drop this entire folder"
        echo "3. Your site will be live instantly!"
        echo ""
        open "https://app.netlify.com/drop"
        ;;
    
    3)
        echo ""
        echo "🔧 Checking for Vercel CLI..."
        if command -v vercel &> /dev/null; then
            echo "Vercel CLI found. Deploying..."
            vercel --prod
        else
            echo "Vercel CLI not found. Install with:"
            echo "  npm install -g vercel"
            echo ""
            echo "Then run: vercel --prod"
        fi
        ;;
    
    4)
        echo ""
        echo "📝 Preparing for GitHub Pages..."
        echo ""
        echo "Steps:"
        echo "1. Initialize git repo (if not already):"
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'Initial commit'"
        echo ""
        echo "2. Create repo on GitHub: https://github.com/new"
        echo ""
        echo "3. Push to GitHub:"
        echo "   git remote add origin YOUR_REPO_URL"
        echo "   git push -u origin main"
        echo ""
        echo "4. Enable GitHub Pages:"
        echo "   - Go to repo Settings → Pages"
        echo "   - Select branch: main"
        echo "   - Click Save"
        echo ""
        read -p "Initialize git repo now? (y/n): " init_git
        if [ "$init_git" = "y" ]; then
            git init
            git add .
            git commit -m "Initial commit - YouTube Transcript Extractor"
            echo ""
            echo "✅ Git repo initialized!"
            echo "Next: Create repo on GitHub and push"
        fi
        ;;
    
    5)
        echo ""
        echo "📤 Creating deployment package..."
        cd ..
        zip -r youtube-transcript.zip youtube-transcript/ -x "*.git*" "node_modules/*"
        echo ""
        echo "✅ Package created: ../youtube-transcript.zip"
        echo ""
        echo "Upload this file to your web host via FTP or file manager"
        ;;
    
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

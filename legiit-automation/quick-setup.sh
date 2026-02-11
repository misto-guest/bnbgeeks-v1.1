#!/bin/bash

echo "🔐 Legiit Automation - Login Configuration"
echo "=========================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists"
    read -p "Overwrite? (y/N): " overwrite
    if [[ $overwrite != "y" && $overwrite != "Y" ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

echo ""
echo "📝 Please enter your Legiit credentials:"
echo ""

read -p "Legiit Email: " legiit_email
read -sp "Legiit Password: " legiit_password
echo ""
read -p "API Key (press Enter for auto-generated): " api_key

# Generate API key if not provided
if [ -z "$api_key" ]; then
    api_key=$(openssl rand -hex 32)
fi

# Create .env file
cat > .env << EOF
# Legiit Credentials
LEGIIT_EMAIL=$legiit_email
LEGIIT_PASSWORD=$legiit_password

# API Configuration
PORT=3000
API_KEY=$api_key

# Browser Configuration
HEADLESS=true
SLOW_MO=50
EOF

echo ""
echo "✅ Configuration saved to .env"
echo ""
echo "🔑 Your API Key: $api_key"
echo ""
echo "⚠️  Keep this key secret! Use it in your requests:"
echo "   X-API-Key: $api_key"
echo ""
echo "🚀 To start the server:"
echo "   npm start"
echo ""

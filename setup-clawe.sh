#!/bin/bash
# Clawe Quick Setup Script
# Run this after getting your API keys

set -e

echo "🦞 Clawe Setup Script"
echo "===================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CLAWDE_DIR="/Users/northsea/clawe"
ENV_FILE="$CLAWDE_DIR/.env"

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}Error: pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi

if ! command -v openssl &> /dev/null; then
    echo -e "${RED}Error: openssl not found${NC}"
    exit 1
fi

cd "$CLAWDE_DIR"

# Step 1: Check for Anthropic API Key
echo ""
echo -e "${YELLOW}Step 1: Anthropic API Key${NC}"
if grep -q "sk-ant-\.\.\." "$ENV_FILE" 2>/dev/null; then
    echo -e "${RED}ACTION REQUIRED: Get your Anthropic API key${NC}"
    echo "1. Visit: https://console.anthropic.com"
    echo "2. Sign up or log in"
    echo "3. Create an API key"
    echo "4. Edit $ENV_FILE and set ANTHROPIC_API_KEY=sk-ant-your-key-here"
    echo ""
    read -p "Press Enter when you've added your Anthropic API key..."
else
    echo -e "${GREEN}✓ Anthropic API key found${NC}"
fi

# Step 2: Setup Convex
echo ""
echo -e "${YELLOW}Step 2: Setup Convex Backend${NC}"
if grep -q "your-deployment.convex.cloud" "$ENV_FILE" 2>/dev/null; then
    echo -e "${BLUE}Setting up Convex project...${NC}"
    echo "This will open a browser for GitHub authentication"
    echo ""
    read -p "Press Enter to start Convex setup..."
    
    cd packages/backend
    
    # Check if convex is already configured
    if [ -f "convex/_generated/api.d.ts" ]; then
        echo -e "${GREEN}✓ Convex already configured${NC}"
    else
        echo "Running: npx convex dev"
        echo -e "${YELLOW}Follow the prompts to create your Convex project${NC}"
        npx convex dev --once
    fi
    
    # Update main .env with Convex URL
    if [ -f ".env.local" ]; then
        CONVEX_URL=$(grep CONVEX_DEPLOYMENT_NAME .env.local | cut -d'=' -f2)
        if [ -n "$CONVEX_URL" ]; then
            # Convert deployment name to URL
            CONVEX_FULL_URL="https://$CONVEX_URL.convex.cloud"
            sed -i '' "s|https://your-deployment.convex.cloud|$CONVEX_FULL_URL|" "$ENV_FILE"
            echo -e "${GREEN}✓ Updated CONVEX_URL in .env${NC}"
        fi
    fi
    
    cd "$CLAWDE_DIR"
else
    echo -e "${GREEN}✓ Convex URL found${NC}"
fi

# Step 3: Generate OpenClaw Token
echo ""
echo -e "${YELLOW}Step 3: OpenClaw Token${NC}"
if grep -q "your-secure-token-here" "$ENV_FILE" 2>/dev/null; then
    echo -e "${BLUE}Generating secure OpenClaw token...${NC}"
    TOKEN=$(openssl rand -hex 32)
    
    # Cross-platform sed
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your-secure-token-here/$TOKEN/" "$ENV_FILE"
    else
        sed -i "s/your-secure-token-here/$TOKEN/" "$ENV_FILE"
    fi
    
    echo -e "${GREEN}✓ Generated token: ${TOKEN:0:8}...${NC}"
else
    echo -e "${GREEN}✓ OpenClaw token already set${NC}"
fi

# Step 4: Build packages
echo ""
echo -e "${YELLOW}Step 4: Building packages...${NC}"
pnpm --filter @clawe/cli build
pnpm --filter @clawe/shared build
pnpm --filter @clawe/watcher build
echo -e "${GREEN}✓ Packages built${NC}"

# Step 5: Deployment decision
echo ""
echo -e "${YELLOW}Step 5: Deployment Method${NC}"
echo "Choose deployment method:"
echo "  1) Railway (recommended, no Docker needed)"
echo "  2) Local with Docker Desktop (requires installation)"
echo "  3) Manual (I'll handle it myself)"
echo ""
read -p "Enter choice [1-3]: " DEPLOY_CHOICE

case $DEPLOY_CHOICE in
    1)
        echo ""
        echo -e "${BLUE}Railway Deployment Instructions:${NC}"
        echo "1. Visit: https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. Deploy OpenClaw from template: https://docs.openclaw.ai/install/railway"
        echo "4. Deploy Clawe from: https://github.com/getclawe/clawe"
        echo "5. Set environment variables in Railway dashboard"
        echo "6. Update OPENCLAW_URL in .env to point to Railway deployment"
        echo ""
        echo -e "${GREEN}Railway URLs will be provided after deployment${NC}"
        ;;
    2)
        echo ""
        echo -e "${BLUE}Docker Deployment:${NC}"
        echo "1. Install Docker Desktop from: https://docker.com/products/docker-desktop"
        echo "2. Run: ./scripts/start.sh"
        echo "3. Access at: http://localhost:3000"
        echo ""
        read -p "Install Docker Desktop now? [y/N]: " INSTALL_DOCKER
        if [[ $INSTALL_DOCKER =~ ^[Yy]$ ]]; then
            open "https://docker.com/products/docker-desktop"
        fi
        ;;
    3)
        echo ""
        echo -e "${GREEN}Manual deployment selected${NC}"
        echo "Refer to /Users/northsea/clawd-dmitry/CLAWDECK-TO-CLAWE-MIGRATION.md"
        ;;
esac

# Final check
echo ""
echo -e "${YELLOW}Final Configuration Check${NC}"
echo "=========================="

# Validate all required variables
VALID=true

if grep -q "sk-ant-\.\.\." "$ENV_FILE"; then
    echo -e "${RED}✗ ANTHROPIC_API_KEY not set${NC}"
    VALID=false
else
    echo -e "${GREEN}✓ ANTHROPIC_API_KEY set${NC}"
fi

if grep -q "your-deployment.convex.cloud" "$ENV_FILE"; then
    echo -e "${RED}✗ CONVEX_URL not set${NC}"
    VALID=false
else
    echo -e "${GREEN}✓ CONVEX_URL set${NC}"
fi

if grep -q "your-secure-token-here" "$ENV_FILE"; then
    echo -e "${RED}✗ OPENCLAW_TOKEN not set${NC}"
    VALID=false
else
    echo -e "${GREEN}✓ OPENCLAW_TOKEN set${NC}"
fi

echo ""
if [ "$VALID" = true ]; then
    echo -e "${GREEN}🎉 Setup complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Complete deployment (see instructions above)"
    echo "  2. Start Clawe: ./scripts/start.sh (if using Docker)"
    echo "  3. Update Cloudflare tunnel to point to new deployment"
    echo "  4. Stop ClawDeck: pkill -f clawdeck"
    echo ""
    echo "Migration guide: /Users/northsea/clawd-dmitry/CLAWDECK-TO-CLAWE-MIGRATION.md"
else
    echo -e "${RED}⚠ Setup incomplete${NC}"
    echo "Please complete the missing configuration above"
fi

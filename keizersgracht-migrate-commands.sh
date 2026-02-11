#!/bin/bash
# Keizersgracht Repository Migration - Quick Commands
# Run these commands step-by-step as you follow the migration plan

set -e  # Exit on error

echo "========================================="
echo "Keizersgracht Migration Quick Commands"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
OLD_ACCOUNT="misto-guest"
NEW_ACCOUNT="Misto123"
REPO1="keizersgracht-legal"
REPO2="keizersgracht-legal-website"
WORK_DIR="/Users/northsea"

echo -e "${YELLOW}STEP 1: Create new repositories${NC}"
echo "Run these commands to create the new repos:"
echo ""
echo "gh repo create ${NEW_ACCOUNT}/${REPO1} --public --clone=false"
echo "gh repo create ${NEW_ACCOUNT}/${REPO2} --public --clone=false"
echo ""
read -p "Press Enter after creating both repos..."
echo ""

echo -e "${YELLOW}STEP 2: Migrate ${REPO1}${NC}"
echo "This repo is not cloned locally. Cloning and migrating..."
echo ""

cd "${WORK_DIR}"

if [ -d "${REPO1}" ]; then
    echo -e "${RED}Directory ${REPO1} already exists. Please remove it first.${NC}"
    exit 1
fi

git clone https://github.com/${OLD_ACCOUNT}/${REPO1}.git
cd ${REPO1}
git remote rename origin old-origin
git remote add origin https://github.com/${NEW_ACCOUNT}/${REPO1}.git
git push origin --all
git push origin --tags || echo "No tags to push"
git branch --set-upstream-to=origin/main main

echo -e "${GREEN}✓ ${REPO1} migrated successfully${NC}"
echo ""
read -p "Press Enter to continue..."
echo ""

echo -e "${YELLOW}STEP 3: Migrate ${REPO2}${NC}"
echo "This repo has a local clone. Updating remote..."
echo ""

cd "${WORK_DIR}/clawd-dmitry/keizersgracht-legal"

# Verify current remote
echo "Current remote:"
git remote -v
echo ""

read -p "Continue with migration? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled for ${REPO2}"
    exit 1
fi

git remote rename origin old-origin
git remote add origin https://github.com/${NEW_ACCOUNT}/${REPO2}.git
git push origin --all
git push origin --tags || echo "No tags to push"
git branch --set-upstream-to=origin/main main

echo ""
echo "Updated remote:"
git remote -v

echo -e "${GREEN}✓ ${REPO2} migrated successfully${NC}"
echo ""
read -p "Press Enter to continue..."
echo ""

echo -e "${YELLOW}STEP 4: Update Vercel Deployment${NC}"
echo "⚠️  MANUAL STEP REQUIRED"
echo ""
echo "1. Go to https://vercel.com/dashboard"
echo "2. Find project: keizersgracht-legal (ID: prj_WR0LZsxuPZMOrhWmeRJNj0PaZ5ko)"
echo "3. Go to Settings → Git"
echo "4. Disconnect: ${OLD_ACCOUNT}/${REPO2}"
echo "5. Connect: ${NEW_ACCOUNT}/${REPO2}"
echo "6. Trigger a deployment and verify it works"
echo ""
read -p "Press Enter after updating Vercel..."
echo ""

echo -e "${YELLOW}STEP 5: Clean up old remotes (optional)${NC}"
echo "After verifying everything works, you can remove old remotes:"
echo ""
echo "cd ${WORK_DIR}/${REPO1} && git remote remove old-origin"
echo "cd ${WORK_DIR}/clawd-dmitry/keizersgracht-legal && git remote remove old-origin"
echo ""

read -p "Remove old remotes now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd ${WORK_DIR}/${REPO1}
    git remote remove old-origin
    cd ${WORK_DIR}/clawd-dmitry/keizersgracht-legal
    git remote remove old-origin
    echo -e "${GREEN}✓ Old remotes removed${NC}"
else
    echo "Skipped. You can remove them later manually."
fi
echo ""

echo -e "${YELLOW}STEP 6: Handle old repositories${NC}"
echo "Choose what to do with old repos:"
echo ""
echo "Option A: Archive (recommended)"
echo "gh repo edit ${OLD_ACCOUNT}/${REPO1} --archived=true"
echo "gh repo edit ${OLD_ACCOUNT}/${REPO2} --archived=true"
echo ""
echo "Option B: Delete (permanent, cannot be undone!)"
echo "gh repo delete ${OLD_ACCOUNT}/${REPO1}"
echo "gh repo delete ${OLD_ACCOUNT}/${REPO2}"
echo ""

read -p "Archive old repos now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    gh repo edit ${OLD_ACCOUNT}/${REPO1} --archived=true
    gh repo edit ${OLD_ACCOUNT}/${REPO2} --archived=true
    echo -e "${GREEN}✓ Old repos archived${NC}"
else
    echo "Skipped. You can archive or delete them later."
fi
echo ""

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Migration Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "New repository locations:"
echo "  • https://github.com/${NEW_ACCOUNT}/${REPO1}"
echo "  • https://github.com/${NEW_ACCOUNT}/${REPO2}"
echo ""
echo "Next steps:"
echo "  • Update Vercel (if not done already)"
echo "  • Add redirect READMEs to old repos (optional)"
echo "  • Update any external references or documentation"
echo ""

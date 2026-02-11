#!/bin/bash
# Quick QA verification for GhostFetch skill

echo "👻 GhostFetch Skill - Quick QA Verification"
echo "=============================================="

# Test 1: GhostFetch installed
echo ""
echo "Test 1: Checking GhostFetch installation..."
if command -v ghostfetch &> /dev/null; then
    VERSION=$(ghostfetch --version 2>&1 | head -1)
    echo "✅ PASS: GhostFetch installed"
    echo "   $VERSION"
else
    echo "❌ FAIL: GhostFetch not found"
    exit 1
fi

# Test 2: Skill files exist
echo ""
echo "Test 2: Checking skill files..."
SKILL_DIR="/Users/northsea/.clawdbot/skills/ghostfetch"

if [ -d "$SKILL_DIR" ]; then
    echo "✅ Skill directory exists"

    # Check required files
    FILES=(
        "SKILL.md"
        "scripts/install_ghostfetch.sh"
        "scripts/ghostfetch_helper.sh"
    )

    for file in "${FILES[@]}"; do
        if [ -f "$SKILL_DIR/$file" ]; then
            echo "✅ $file"
        else
            echo "❌ $file - MISSING"
        fi
    done
else
    echo "❌ FAIL: Skill directory not found"
    exit 1
fi

# Test 3: Helper script
echo ""
echo "Test 3: Testing helper script..."
HELPER="$SKILL_DIR/scripts/ghostfetch_helper.sh"

if [ -x "$HELPER" ]; then
    OUTPUT=$(bash "$HELPER" 2>&1)
    if echo "$OUTPUT" | grep -q "GhostFetch Helper"; then
        echo "✅ PASS: Helper script works"
    else
        echo "❌ FAIL: Helper script error"
        echo "   $OUTPUT"
    fi
else
    echo "❌ FAIL: Helper script not executable"
fi

# Test 4: Skill package
echo ""
echo "Test 4: Checking skill package..."
PACKAGE="/Users/northsea/clawd-dmitry/ghostfetch.skill"

if [ -f "$PACKAGE" ]; then
    SIZE=$(ls -lh "$PACKAGE" | awk '{print $5}')
    echo "✅ PASS: Skill package created"
    echo "   Location: $PACKAGE"
    echo "   Size: $SIZE"
else
    echo "❌ FAIL: Skill package not found"
fi

echo ""
echo "=============================================="
echo "✅ Quick QA complete!"
echo ""
echo "GhostFetch skill is ready for deployment."
echo ""
echo "To deploy:"
echo "  clawdhub install $PACKAGE"
echo ""
echo "To use:"
echo "  ghostfetch serve"
echo "  bash $SKILL_DIR/scripts/ghostfetch_helper.sh fetch <url>"

#!/bin/bash
# /save - Memory sweep + auto-commit for workspace

set -e

WORKSPACE="/Users/northsea/clawd-dmitry"
MEMORY_FILE="$WORKSPACE/MEMORY.md"
TODAY=$(date +%Y-%m-%d)
DAILY_FILE="$WORKSPACE/memory/$TODAY.md"
KNOWLEDGE_DIR="$WORKSPACE/knowledge"

echo "🔄 Memory Sweep: $TODAY"
echo ""

# Step 1: Check for recent changes
echo "Step 1: Scanning for changes..."
if git diff --quiet HEAD 2>/dev/null; then
    echo "No changes detected"
    exit 0
fi
echo "✅ Changes found"
echo ""

# Step 2: Check what changed
echo "Step 2: What changed?"
CHANGES=$(git diff --name-only HEAD 2>/dev/null || git diff --name-only)
echo "$CHANGES" | head -10
echo ""

# Step 3: Extract important content
echo "Step 3: Extracting important content..."

# Check for AGENTS.md updates
if echo "$CHANGES" | grep -q "AGENTS.md"; then
    echo "  → AGENTS.md modified"
fi

# Check for new skills
if echo "$CHANGES" | grep -q "skills/"; then
    echo "  → Skills added/modified"
fi

# Check for project updates
PROJECTS=$(echo "$CHANGES" | grep -E "^(bnbgeeks|bol-outreach|gps-spoofing)" || true)
if [ -n "$PROJECTS" ]; then
    echo "  → Projects updated:"
    echo "$PROJECTS" | head -5
fi
echo ""

# Step 4: Update MEMORY.md if needed
echo "Step 4: Checking if MEMORY.md needs update..."

# Check if MEMORY.md was modified today
if [ -f "$WORKSPACE/.last-memory-update" ] && [ "$MEMORY_FILE" -nt "$WORKSPACE/.last-memory-update" ]; then
    echo "  → MEMORY.md already updated today"
else
    echo "  → Memory sweep scheduled"
    # Would trigger memory_search here
    touch "$WORKSPACE/.last-memory-update"
fi
echo ""

# Step 5: Create/update daily memory entry
echo "Step 5: Daily memory entry..."
if [ ! -f "$DAILY_FILE" ]; then
    cat > "$DAILY_FILE" << EOF
# $TODAY

## Summary
<!-- TODO: Add end-of-day summary -->

## Work Completed
<!-- TODO: List completed tasks -->

## Key Learnings
<!-- TODO: Add key insights -->

## Decisions Made
<!-- TODO: Document decisions -->

## Tomorrow's Plan
<!-- TODO: Plan for tomorrow -->

EOF
    echo "  → Created: $DAILY_FILE"
else
    echo "  → Exists: $DAILY_FILE"
fi
echo ""

# Step 6: Commit with intelligent message
echo "Step 6: Committing changes..."

# Generate commit message
COMMIT_MSG="Workspace update: $(date '+%Y-%m-%d %H:%M')"

# Add specific tags based on what changed
if echo "$CHANGES" | grep -q "skills/"; then
    COMMIT_MSG="$COMMIT_MSG [skills]"
fi

if echo "$CHANGES" | grep -q "bol-outreach"; then
    COMMIT_MSG="$COMMIT_MSG [bol-outreach]"
fi

if echo "$CHANGES" | grep -q "bnbgeeks"; then
    COMMIT_MSG="$COMMIT_MSG [bnbgeeks]"
fi

# Use -A to stage all changes including nested git repos
git add -A
git commit -m "$COMMIT_MSG"
echo "  → Committed: $COMMIT_MSG"
echo ""

# Step 7: Push to GitHub
echo "Step 7: Pushing to GitHub..."
if git push 2>/dev/null; then
    echo "  ✓ Pushed to GitHub"
else
    echo "  ⚠️ Push failed (offline?)"
fi
echo ""

echo "✅ Memory sweep complete!"
echo ""
echo "Repository: $(git config --get remote.origin.url || echo 'Not configured')"

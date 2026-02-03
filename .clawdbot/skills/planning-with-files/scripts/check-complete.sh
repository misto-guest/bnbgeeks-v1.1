#!/bin/bash
# Planning with Files - Completion Check Script
# Verifies all phases in task_plan.md are complete

# Don't exit on error - we handle errors manually

echo "🔍 Checking task_plan.md for completion..."
echo ""

if [ ! -f "task_plan.md" ]; then
    echo "❌ No task_plan.md found!"
    echo "   Run init.sh first to create planning files."
    exit 1
fi

# Count total checkboxes
TOTAL=$(grep -c '\[ \]' task_plan.md 2>/dev/null)
COMPLETED=$(grep -c '\[x\]' task_plan.md 2>/dev/null)

# Set to 0 if grep failed
TOTAL=${TOTAL:-0}
COMPLETED=${COMPLETED:-0}

TOTAL_CHECKS=$((TOTAL + COMPLETED))
PERCENT=0

if [ "$TOTAL_CHECKS" -gt 0 ]; then
    PERCENT=$((COMPLETED * 100 / TOTAL_CHECKS))
fi

echo "📊 Progress Summary:"
echo "   ✓ Completed: $COMPLETED"
echo "   ○ Remaining: $TOTAL"
echo "   📈 Progress: ${PERCENT}%"
echo ""

# Find unchecked items
if [ "$TOTAL" -gt 0 ]; then
    echo "⚠️  Incomplete items:"
    grep -n '\[ \]' task_plan.md | while read -r line; do
        LINE_NUM=$(echo "$line" | cut -d: -f1)
        CONTENT=$(echo "$line" | cut -d: -f2-)
        echo "   Line $LINE_NUM: $CONTENT"
    done
    echo ""
fi

# Check for specific sections
echo "📋 File Status:"

# Check findings.md
if [ -f "findings.md" ]; then
    FINDINGS_SIZE=$(wc -c < findings.md)
    if [ $FINDINGS_SIZE -gt 500 ]; then
        echo "   ✓ findings.md populated (${FINDINGS_SIZE} bytes)"
    else
        echo "   ⚠️  findings.md needs more content (${FINDINGS_SIZE} bytes)"
    fi
else
    echo "   ⚠️  findings.md not found"
fi

# Check progress.md
if [ -f "progress.md" ]; then
    SESSIONS=$(grep -c "## Session" progress.md 2>/dev/null || echo 0)
    echo "   ✓ progress.md has $SESSIONS session(s) logged"
else
    echo "   ⚠️  progress.md not found"
fi

echo ""

# Final verdict
if [ "$TOTAL" -eq 0 ] && [ "$COMPLETED" -gt 0 ]; then
    echo "🎉 All tasks completed!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Review task_plan.md for accuracy"
    echo "   2. Update findings.md with final insights"
    echo "   3. Add completion summary to progress.md"
    echo "   4. Commit/push if working with git"
    exit 0
elif [ "$TOTAL" -eq 0 ] && [ "$COMPLETED" -eq 0 ]; then
    echo "⚠️  No tasks found in task_plan.md"
    echo "   Add phases and checkboxes to get started."
    exit 1
else
    echo "🚧 Work remaining: $TOTAL task(s)"
    echo ""
    echo "💡 Tips:"
    echo "   - Focus on one phase at a time"
    echo "   - Save findings as you go"
    echo "   - Log errors in progress.md"
    echo "   - Re-read task_plan.md before decisions"
    exit 1
fi

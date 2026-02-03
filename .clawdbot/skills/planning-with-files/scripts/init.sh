#!/bin/bash
# Planning with Files - Session Initialization Script
# Creates task_plan.md, findings.md, and progress.md with current date

set -e

# Get current date
DATE=$(date +"%Y-%m-%d %H:%M:%S")
DATE_SHORT=$(date +"%Y-%m-%d")

# Check if files already exist
if [ -f "task_plan.md" ] || [ -f "findings.md" ] || [ -f "progress.md" ]; then
    echo "⚠️  Planning files already exist in this directory!"
    echo ""
    echo "Existing files:"
    ls -la task_plan.md findings.md progress.md 2>/dev/null || true
    echo ""
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted"
        exit 1
    fi
    echo "🗑️  Backing up existing files..."
    [ -f "task_plan.md" ] && mv task_plan.md "task_plan.md.backup.$(date +%s)"
    [ -f "findings.md" ] && mv findings.md "findings.md.backup.$(date +%s)"
    [ -f "progress.md" ] && mv progress.md "progress.md.backup.$(date +%s)"
fi

# Create task_plan.md
echo "📝 Creating task_plan.md..."
cat > task_plan.md << EOF
# Task Plan

## Objective
<!-- What you're trying to achieve -->

## Context
<!-- Relevant background, constraints, requirements -->

## Phases

### Phase 1: Planning
- [ ] Define objectives and success criteria
- [ ] Gather requirements
- [ ] Identify constraints

### Phase 2: Execution
- [ ] Execute step 1
- [ ] Execute step 2
- [ ] Execute step 3

### Phase 3: Verification
- [ ] Test results
- [ ] Verify completion
- [ ] Document outcomes

## Findings Summary
<!-- See findings.md for detailed research -->

## Progress Log
<!-- See progress.md for session logs -->

---
**Created:** $DATE
**Last updated:** $DATE
EOF

# Create findings.md
echo "📝 Creating findings.md..."
cat > findings.md << EOF
# Findings

## Research Notes

### [Topic 1]
<!-- What you discovered -->

### [Topic 2]
<!-- What you discovered -->

## Key Decisions
<!-- Important decisions made and why -->

## Technical Discoveries
<!-- Technical insights and learnings -->

## Alternatives Considered
<!-- Options you evaluated -->

## References
<!-- Links, docs, resources -->

---
**Created:** $DATE
**Last updated:** $DATE
EOF

# Create progress.md
echo "📝 Creating progress.md..."
cat > progress.md << EOF
# Progress Log

## Session 1 - $DATE_SHORT
**Goal:** <!-- What you aim to accomplish in this session -->

### Actions Taken
- **[$(date +"%H:%M")**] Session started
- Planning files created

### Results
<!-- Initial results -->

### Errors Encountered
<!-- Log errors as they occur -->

### Next Steps
- [ ] Begin execution
- [ ] Update plan as needed

---

## Summary

### Completed
- [x] Planning files initialized

### In Progress
- [ ] Current task

### Blocked
- [ ] Any blockers

### Upcoming
<!-- Future tasks -->

---
**Created:** $DATE
**Last updated:** $DATE
EOF

echo ""
echo "✅ Planning files created successfully!"
echo ""
echo "📁 Files created:"
echo "  - task_plan.md    (Phases and progress tracking)"
echo "  - findings.md     (Research and discoveries)"
echo "  - progress.md     (Session logs and test results)"
echo ""
echo "🚀 Start working! Remember to:"
echo "  1. Update task_plan.md checkboxes as you complete steps"
echo "  2. Save findings to findings.md after every 2 operations"
echo "  3. Log errors in progress.md"
echo "  4. Re-read task_plan.md before major decisions"
echo ""

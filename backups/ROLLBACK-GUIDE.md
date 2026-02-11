# ClawDeck Rollback Guide - Task Items Feature
**Implementation Date:** 2026-02-09
**Feature Branch:** feature/task-items-system
**Baseline:** main branch (commit c4b0fb5)
**Tag:** pre-task-items-20260209

---

## Quick Reference

| Rollback Type | Time to Complete | Data Impact | When to Use |
|---------------|------------------|-------------|-------------|
| **Feature Flags** | 2 minutes | None (data preserved) | Disable new UI temporarily |
| **Branch Switch** | 5 minutes | None (code only) | Revert to original code |
| **Full Database** | 30 minutes | Restores baseline | Critical data corruption |

---

## Level 1: Feature Flag Rollback (Recommended First Step)

**Use Case:** Disable new UI without touching code or database

### Steps:

1. **Edit Feature Flags**
   ```bash
   nano /Users/northsea/clawdeck/config/feature_flags.yml
   ```

2. **Set all features to false**
   ```yaml
   task_items_enabled: false
   task_timers_enabled: false
   task_chat_enabled: false
   ```

3. **Save and restart Rails**
   ```bash
   # If Rails is running
   kill -HUP $(cat tmp/pids/server.pid)

   # Or restart your services
   ./start-services.sh
   ```

4. **Verify**
   - Visit ClawDeck in browser
   - Should see original task-only UI
   - All data remains intact

### Result:
- ✅ Original UI restored
- ✅ New data preserved (if any created)
- ✅ Code still on feature branch

---

## Level 2: Branch Rollback (Code Revert)

**Use Case:** Complete code revert, keep database as-is

### Steps:

1. **Commit any changes** (if needed)
   ```bash
   cd /Users/northsea/clawdeck
   git add .
   git commit -m "Snapshot before rollback"
   ```

2. **Switch back to main**
   ```bash
   git checkout main
   ```

3. **Verify you're on main**
   ```bash
   git branch --show-current
   # Should output: main
   ```

4. **Restart services**
   ```bash
   ./start-services.sh
   ```

### Result:
- ✅ Original code restored
- ⚠️ Database changes remain (if migrations ran)
- ⚠️ New tables still exist (needs Level 3 to remove)

---

## Level 3: Full Database Rollback

**Use Case:** Revert both code AND database to baseline

### Prerequisites:
- PostgreSQL access (psql or pg_dump)
- Database: clawdeck_development

### Steps:

#### 3.1 Rollback Migrations (Recommended First)

```bash
cd /Users/northsea/clawdeck

# Check current migration version
rails db:version

# Rollback one migration at a time
rails db:rollback

# Repeat until you're at baseline: 2026_01_31_142501
# Or rollback multiple steps at once:
rails db:rollback STEP=5
```

#### 3.2 If Migration Rollback Fails

**Option A: Restore from Schema Backup**

```bash
# Drop and recreate database
rails db:drop
rails db:create

# Load baseline schema
rails db:schema:load

# Verify
rails db:version
# Should show: 2026_01_31_142501
```

**Option B: Manual SQL Cleanup**

```sql
-- Connect to database
psql -U northsea clawdeck_development

-- Drop new tables (in reverse order of creation)
DROP TABLE IF EXISTS task_item_messages CASCADE;
DROP TABLE IF EXISTS task_items CASCADE;

-- Exit
\q
```

#### 3.3 Restore Code (Level 2)

```bash
cd /Users/northsea/clawdeck
git checkout main
```

### Result:
- ✅ Complete revert to baseline
- ✅ Database schema restored
- ❌ All new data lost (by design)

---

## Level 4: Emergency Rollback (Data Corruption)

**Use Case:** Critical data corruption, need full restore

### Prerequisites:
- Full SQL dump exists (if pg_dump was available)
- OR: Working baseline backup

### Steps:

#### 4.1 Create Emergency Backup (Before Restore!)

```bash
# Export current state (even if corrupted)
# This gives you a chance to recover partial data
pg_dump -U northsea clawdeck_development > emergency-backup-$(date +%Y%m%d).sql
```

#### 4.2 Restore from Backup

**If you have a full SQL dump:**
```bash
psql -U northsea clawdeck_development < /path/to/backup-file.sql
```

**If using schema restore:**
```bash
cd /Users/northsea/clawdeck

# Reset to baseline schema
rails db:drop
rails db:create
rails db:schema:load

# Seed if needed
rails db:seed
```

#### 4.3 Verify Integrity

```bash
# Check database
rails db

# Check task count
rails runner "puts Task.count"

# Check schema version
rails db:version
```

---

## Post-Rollback Verification

### Checklist:

- [ ] Rails server starts without errors
- [ ] Database connects successfully
- [ ] Original UI loads in browser
- [ ] Can create/edit tasks
- [ ] No error logs in `log/development.log`
- [ ] Feature flags set correctly (if using Level 1)

### Test Commands:

```bash
# Test Rails
rails runner "puts 'Rails is working'"

# Test database
rails runner "puts Task.count"

# Test feature flags
rails runner "puts FeatureFlag.all"
```

---

## Migration-Specific Rollbacks

### If Task Items Migration Exists

**Migration file:** `TIMESTAMP_create_task_items.rb`

**To rollback:**
```bash
rails db:rollback
```

**Expected result:**
- task_items table dropped
- task_item_messages table dropped (if created)
- Tasks table unchanged

---

## Feature-Specific Rollbacks

### Disable Only Chat (Keep Items)

1. Edit `config/feature_flags.yml`
2. Set:
   ```yaml
   task_items_enabled: true
   task_timers_enabled: true
   task_chat_enabled: false  # Disable only chat
   ```
3. Restart Rails

### Disable Only Timers (Keep Items)

1. Edit `config/feature_flags.yml`
2. Set:
   ```yaml
   task_items_enabled: true
   task_timers_enabled: false  # Disable only timers
   task_chat_enabled: false
   ```
3. Restart Rails

---

## Recovery After Rollback

### If You Rolled Back by Mistake

**Scenario:** Accidentally ran Level 3 rollback but wanted to keep data

**Recovery:**

1. **Check git reflog** (to find feature branch)
   ```bash
   git reflog
   ```

2. **Restore feature branch**
   ```bash
   git checkout feature/task-items-system
   ```

3. **Re-apply migrations**
   ```bash
   rails db:migrate
   ```

4. **Check for data loss**
   - Any data created after migration is lost
   - Plan accordingly

---

## Decision Tree

```
Issue Detected
    |
    v
Is it UI/Display only?
    |
    +---> YES ---> Use Level 1 (Feature Flags)
    |
    v
NO
    |
    v
Is it data corruption?
    |
    +---> YES ---> Use Level 4 (Emergency Restore)
    |
    v
NO
    |
    v
Is it code bug?
    |
    +---> YES ---> Use Level 2 (Branch Switch)
    |
    v
Is it database schema issue?
    |
    +---> YES ---> Use Level 3 (Database Rollback)
```

---

## Common Issues & Solutions

### Issue: Migration Won't Rollback

**Error:** `ActiveRecord::IrreversibleMigration`

**Solution:**
```bash
# Drop and recreate schema
rails db:drop
rails db:create
rails db:schema:load
```

### Issue: Git Checkout Fails

**Error:** `Uncommitted changes`

**Solution:**
```bash
# Stash changes
git stash

# Checkout main
git checkout main

# Apply stash later if needed
git stash pop
```

### Issue: Rails Won't Start After Rollback

**Error:** ` uninitialized constant FeatureFlag`

**Solution:**
```bash
# Remove initializer
rm config/initializers/feature_flags.rb

# Restart Rails
./start-services.sh
```

---

## Backup Files Created (2026-02-09)

- `/Users/northsea/clawd-dmitry/backups/schema-before-items-20260209.rb`
- `/Users/northsea/clawd-dmitry/backups/current-state-20260209.md`
- Git tag: `pre-task-items-20260209` (commit c4b0fb5)

---

## Contact & Support

**Documentation:**
- Strategy: `/Users/northsea/clawd-dmitry/clawdeck-IMPLEMENTATION-STRATEGY.md`
- This Guide: `/Users/northsea/clawd-dmitry/backups/ROLLBACK-GUIDE.md`

**Emergency Commands:**
```bash
# Quick revert to main
git checkout main && rails db:rollback && ./start-services.sh

# Full reset
rails db:drop && rails db:create && rails db:schema:load && git checkout main
```

---

**Remember:** Start with Level 1 (Feature Flags) - it's the safest and fastest!

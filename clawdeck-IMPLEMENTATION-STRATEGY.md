# ClawDeck Feature Implementation - Rollback-Safe Strategy

## Requirements

**User Request:** Implement per-item status, play/pause buttons, and per-item chat
**Constraint:** Must be able to revert to current version in future

## Rollback Strategy

### 1. Git Branch Management

```bash
# Current state (baseline)
git checkout main
git checkout -b feature/task-items-system

# Implement features on branch
# Can always revert: git checkout main
```

### 2. Feature Flags

**Enable/disable new UI without code changes:**

```ruby
# config/feature_flags.yml
task_items_enabled: true
task_timers_enabled: true
task_chat_enabled: true
```

**In views:**
```erb
<% if FeatureFlag.enabled?(:task_items) %>
  <!-- Show new item-based UI -->
<% else %>
  <!-- Show original task-only UI -->
<% end %>
```

### 3. Database Migration Strategy

**Reversible migrations:**

```ruby
class CreateTaskItems < ActiveRecord::Migration[8.1]
  def change
    create_table :task_items do |t|
      t.references :task, null: false, foreign_key: true
      t.string :title, null: false
      t.string :status, default: 'todo', null: false
      t.datetime :started_at
      t.datetime :paused_at
      t.integer :total_time_spent, default: 0
      t.timestamps
    end

    # Can rollback: rails db:rollback
  end
end
```

**Rollback command:**
```bash
rails db:rollback  # Remove task_items table
```

### 4. Backward Compatibility

**Keep old UI working alongside new:**

```ruby
# Task model
class Task < ApplicationRecord
  # Original behavior (works without items)
  def status
    items.any? ? items.pluck(:status).uniq : super
  end

  # New behavior (with items)
  def items
    @items ||= task_items
  end
end
```

### 5. Data Export

**Before changes: Export current database**

```bash
# Full backup
pg_dump -U northsea clawdeck_development > backup-before-items-$(date +%Y%m%d).sql

# Tasks data only
pg_dump -U northsea clawdeck_development -t tasks > tasks-backup-$(date +%Y%m%d).sql
```

### 6. Configuration Backup

```bash
# Backup current code state
cd /Users/northsea/clawdeck
git add .
git commit -m "Backup before implementing task items feature"
git tag pre-task-items-$(date +%Y%m%d)
```

---

## Implementation Plan (Rollback-Safe)

### Phase 1: Prepare & Backup (Day 1)

**1. Create feature branch**
```bash
cd /Users/northsea/clawdeck
git checkout -b feature/task-items-system
```

**2. Database backup**
```bash
pg_dump -U northsea clawdeck_development > /Users/northsea/clawd-dmitry/backups/clawdeck-pre-items-$(date +%Y%m%d).sql
```

**3. Current state documentation**
```bash
# Record current schema
rails db:schema:dump > /Users/northsea/clawd-dmitry/backups/schema-before-items.rb

# Record current task count
rails runner "puts Task.count" > /Users/northsea/clawd-dmitry/backups/task-count-before.txt
```

**4. Add feature flag system**
```ruby
# config/initializers/feature_flags.rb
class FeatureFlag
  def self.enabled?(feature)
    settings = YAML.load_file(Rails.root.join('config', 'feature_flags.yml'))
    settings[feature.to_s] == true
  end
end
```

---

### Phase 2: Core Model (Days 2-3)

**1. Create TaskItem model**
```bash
rails generate model TaskItem task:references title:string status:string started_at:datetime paused_at:datetime total_time_spent:integer
rails db:migrate
```

**2. Add feature flag checks**
```erb
<!-- app/views/tasks/show.html.erb -->
<% if FeatureFlag.enabled?(:task_items) %>
  <%= render 'tasks/items_interface' %>
<% else %>
  <%= render 'tasks/original_interface' %>
<% end %>
```

**3. Keep original UI working**
- Move current UI to `original_interface` partial
- Build new UI in `items_interface` partial
- Toggle with feature flag

---

### Phase 3: Feature 1 - Per-Item Status (Days 4-6)

**Implementation:**
- Add status enum to TaskItem
- Create status badges UI
- Add click handlers (Stimulus)

**Rollback:**
```bash
# Disable feature flag
# config/feature_flags.yml: task_items_enabled: false
# Restart Rails server
```

---

### Phase 4: Feature 2 - Play/Pause (Days 7-10)

**Implementation:**
- Add timer fields to TaskItem
- Create play/pause buttons
- Add real-time timer display

**Rollback:**
```bash
# Disable feature flag
# config/feature_flags.yml: task_timers_enabled: false
```

---

### Phase 5: Feature 3 - Per-Item Chat (Days 11-16)

**Implementation:**
- Create TaskItemMessage model
- Add chat interface
- Implement real-time messaging

**Rollback:**
```bash
# Disable feature flag
# config/feature_flags.yml: task_chat_enabled: false
```

---

## Rollback Procedures

### Quick Rollback (Feature Flags)

**Disable new UI without touching database:**

```bash
# Edit feature flags
nano /Users/northsea/clawdeck/config/feature_flags.yml

# Set all to false
task_items_enabled: false
task_timers_enabled: false
task_chat_enabled: false

# Restart Rails
kill -HUP $(cat tmp/pids/server.pid)
```

**Result:** Original UI restored, data preserved

---

### Full Rollback (Code + Database)

**1. Revert to main branch**
```bash
cd /Users/northsea/clawdeck
git checkout main
```

**2. Remove new tables**
```bash
rails db:rollback  # Remove all new migrations
```

**3. Restore database (if needed)**
```bash
psql -U northsea clawdeck_development < /Users/northsea/clawd-dmitry/backups/clawdeck-pre-items-DATE.sql
```

**Result:** Complete revert to pre-implementation state

---

### Partial Rollback (Specific Features)

**Remove only chat, keep items:**

```bash
# Create branch without chat
git checkout -b feature/task-items-no-chat
git checkout feature/task-items-system -- app/models/task_item_message.rb
git checkout feature/task-items-system -- app/models/task_item.rb
git checkout feature/task-items-system -- db/migrate/*create_task_items.rb

# Rollback chat migrations only
rails db:rollback STEP=3  # Assuming 3 chat migrations
```

---

## Testing Strategy

### Before Each Phase

**1. Test rollback works**
```bash
# Make a small change
# Test feature flag toggle
# Verify both UIs work
```

**2. Verify data integrity**
```bash
rails runner "puts Task.count"  # Should match before.txt
rails runner "puts TaskItem.count"  # Should be 0
```

### After Each Phase

**1. Test both UIs**
```bash
# Original UI (feature flag off)
# New UI (feature flag on)
# Both should work
```

**2. Test data migration**
```bash
# Create tasks in new UI
# Toggle feature flag off
# Verify tasks still visible in old UI
```

---

## Rollback Decision Points

### When to Consider Rollback

**Critical issues:**
- Data loss or corruption
- Performance degradation >50%
- Security vulnerabilities
- User workflow broken

**Minor issues:**
- Fix in place, don't rollback

### Rollback Checklist

**Before rollback:**
- [ ] Document what went wrong
- [ ] Export current data
- [ ] Create rollback branch
- [ ] Notify stakeholders (if applicable)

**After rollback:**
- [ ] Verify system works
- [ ] Data integrity check
- [ ] Performance baseline
- [ ] Document lessons learned

---

## Deployment Strategy

### Staging First

```bash
# Test on staging before production
git checkout feature/task-items-system
rails db:migrate
# Test thoroughly
```

### Production Rollout

**Option A: Feature Flag (Recommended)**
```bash
# Deploy with features disabled
# Test with small group
# Enable flag gradually
```

**Option B: Blue-Green Deployment**
```bash
# Run both versions side-by-side
# Switch traffic when ready
# Keep old version running for quick rollback
```

---

## Documentation

### For Future Reference

**Files to create:**
1. `IMPLEMENTATION-LOG.md` - What was done, when, why
2. `ROLLBACK-GUIDE.md` - Step-by-step rollback procedures
3. `SCHEMA-CHANGES.md` - Database changes made
4. `MIGRATION-NOTES.md` - Data migration details

### For Onboarding

**For future developers:**
- Why we implemented features
- How to use feature flags
- How to rollback if needed
- Known issues and workarounds

---

## Success Criteria

### Implementation Success

- ✅ All features working
- ✅ Feature flags working
- ✅ Original UI still accessible
- ✅ Data integrity maintained
- ✅ Performance acceptable

### Rollback Readiness

- ✅ Backup confirmed
- ✅ Rollback procedures tested
- ✅ Documentation complete
- ✅ Team trained on rollback

---

**Bottom Line:** We can implement everything with full rollback safety through feature flags, git branches, and reversible migrations. At any point, you can disable new features or revert completely without losing data.

**Estimated Time:** 2-3 weeks
**Rollback Time:** 5-15 minutes (feature flags) or 1 hour (full rollback)

---

**Created:** 2026-02-09
**Status:** Ready to implement
**Next Step:** Get user approval to start Phase 1 (Prepare & Backup)

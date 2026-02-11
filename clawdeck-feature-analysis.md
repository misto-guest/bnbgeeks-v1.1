# ClawDeck Feature Analysis Report
**Date:** 2025-02-09
**Analysis of:** Per-item status tracking, Play/Pause buttons, Per-item chat

---

## Executive Summary

This report analyzes the ClawDeck Rails application to implement three major features:
1. **Per-item status tracking** - Independent status for sub-items within tasks
2. **Play/Pause buttons** - Individual controls for each item
3. **Per-item chat** - Chat functionality for each item

**Key Finding:** ClawDeck currently operates at the **Task level** only. There is no concept of "items" or "subtasks" in the current architecture. Implementing these features requires introducing a new `TaskItem` model and significant UI/UX changes.

---

## 1. Current Architecture Analysis

### 1.1 Data Model

**Current Models:**
- **User** - Account management, agent settings (emoji, name, last_active)
- **Board** - Kanban boards with position ordering
- **Task** - Main work unit with:
  - Status enum: `inbox`, `up_next`, `in_progress`, `in_review`, `done`
  - Priority enum: `none`, `low`, `medium`, `high`
  - Fields: `name`, `description`, `tags`, `due_date`, `completed`, `position`
  - Agent assignment: `assigned_to_agent`, `assigned_at`
  - Blocking: `blocked` boolean
- **TaskActivity** - Activity tracking for tasks (created, updated, moved)
- **ApiToken** - API authentication for agents

**Key Observations:**
- No sub-task or item model exists
- Tasks have a flat hierarchy (one level deep)
- Status tracking is at the task level only
- Activities are tracked via TaskActivity model
- Real-time updates via Turbo Streams (Hotwire)

### 1.2 UI/UX Structure

**Views:**
- `boards/show.html.erb` - Main kanban board with columns
- `boards/_column.html.erb` - Status column with task cards
- `boards/_task_card.html.erb` - Individual task card display
- `boards/tasks/_panel.html.erb` - Slide-in panel for task details
- `boards/tasks/agent_assignment` - Agent assignment UI

**Current UI Flow:**
1. Tasks displayed as cards in kanban columns
2. Click card → slide-in panel opens
3. Panel shows: title, description, priority, agent assignment, activity feed
4. Context menu (right-click) for priority, agent assignment, delete

### 1.3 Controllers & APIs

**Controllers:**
- `Boards::TasksController` - Web UI task management
- `Api::V1::TasksController` - REST API for agents
- Full CRUD + assign/unassign endpoints

**Real-time:**
- Turbo Streams broadcasts for create/update/delete
- Channel: `"board_#{board_id}"`
- Activity tracking with source attribution (web vs api)

---

## 2. Database Schema Changes Required

### 2.1 New Model: `TaskItem`

**Purpose:** Represent individual work items within a task

**Table Schema:**
```ruby
create_table "task_items" do |t|
  # Basic fields
  t.string "name", null: false
  t.text "description"
  t.integer "position", default: 0, null: false
  
  # Status tracking (Feature 1)
  t.integer "status", default: 0, null: false  # todo: 0, doing: 1, done: 2
  
  # Play/Pause tracking (Feature 2)
  t.boolean "playing", default: false, null: false
  t.datetime "started_at"
  t.datetime "paused_at"
  t.decimal "total_time_spent", precision: 10, scale: 2, default: 0
  
  # Associations
  t.bigint "task_id", null: false
  t.bigint "user_id"
  
  # Timestamps
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
  
  # Indexes
  t.index ["task_id"], name: "index_task_items_on_task_id"
  t.index ["status"], name: "index_task_items_on_status"
  t.index ["playing"], name: "index_task_items_on_playing"
end
```

### 2.2 New Model: `TaskItemMessage` (Feature 3)

**Purpose:** Chat messages for individual items

**Table Schema:**
```ruby
create_table "task_item_messages" do |t|
  t.text "content", null: false
  t.bigint "task_item_id", null: false
  t.bigint "user_id"
  t.string "sender_type"  # "user" or "agent"
  t.string "sender_name"
  t.string "sender_emoji"
  
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
  
  t.index ["task_item_id"], name: "index_task_item_messages_on_task_item_id"
  t.index ["created_at"], name: "index_task_item_messages_on_created_at"
end
```

### 2.3 Model Relationships

```ruby
# Task model (appended)
has_many :items, class_name: "TaskItem", dependent: :destroy
has_one :active_item, -> { where(playing: true) }, class_name: "TaskItem"

# TaskItem model
belongs_to :task
belongs_to :user, optional: true
has_many :messages, class_name: "TaskItemMessage", dependent: :destroy

enum :status, { todo: 0, doing: 1, done: 2 }, default: :todo
```

### 2.4 Migration Sequence

1. **Migration 1:** Create `task_items` table
2. **Migration 2:** Create `task_item_messages` table
3. **Migration 3:** Add indexes for performance
4. **Migration 4:** Backfill existing tasks (optional: create default item)

---

## 3. UI/UX Design Recommendations

### 3.1 Feature 1: Per-Item Status Tracking

**Visual Design:**
- Status badges on each item (similar to task cards)
- Color coding:
  - Todo: Gray/neutral
  - Doing: Blue/accent
  - Done: Green/success
- Position items within task panel
- Drag-and-drop reordering

**Interaction Design:**
- Click status badge → cycle through statuses (todo → doing → done → todo)
- Or: right-click context menu for status selection
- Visual feedback with smooth transitions

**Layout:**
```
┌─────────────────────────────────────┐
│ Task Name                           │
│ ────────────────────────────────── │
│                                     │
│ 📝 Items (3)                        │
│                                     │
│ ☐ Item 1         [Todo]      ▾     │
│ ☑ Item 2         [Doing]     ▾     │
│ ✓ Item 3         [Done]      ▾     │
│                                     │
│ + Add item                          │
└─────────────────────────────────────┘
```

### 3.2 Feature 2: Play/Pause Buttons

**Visual Design:**
- Play button (▶) when item is not active
- Pause button (⏸) when item is active
- Only ONE item can be "playing" per task at a time
- Timer display showing active duration

**Interaction Design:**
- Click play → pause any other playing item, start this one
- Click pause → stop timer, record time spent
- Visual indicator for currently playing item (highlight/border)

**Layout:**
```
┌─────────────────────────────────────┐
│ Item 1         [Todo]      ▾        │
│                 ⏱ 00:15:32          │
│                 ▶                    │
├─────────────────────────────────────┤
│ Item 2         [Doing]     ▾        │
│                 ⏱ 00:42:18          │
│                 ⏸                    │
└─────────────────────────────────────┘
```

### 3.3 Feature 3: Per-Item Chat

**Visual Design:**
- Chat bubble icon next to each item
- Badge showing unread message count
- Slide-out chat panel when clicked
- Message bubbles with sender identification

**Interaction Design:**
- Click chat icon → expand chat inline or slide panel
- Agent can post messages via API
- Users can type messages in real-time
- Turbo Streams for live updates

**Layout:**
```
┌─────────────────────────────────────┐
│ 💬 Item 1    [Todo]      ▾         │
│   (3 unread)                        │
├─────────────────────────────────────┤
│ Item 2         [Doing]     ▾        │
│                 ▾                   │
└─────────────────────────────────────┘

[Chat Panel]
┌─────────────────────────────────────┐
│ 💬 Chat: Item 1              ✕     │
│ ────────────────────────────────── │
│                                     │
│ User (10:30 AM):                   │
│ Hey, can you check this?           │
│                                     │
│ 🦞 Agent (10:32 AM):               │
│ On it! Starting analysis now.      │
│                                     │
│ ────────────────────────────────── │
│ [Type a message...]          [Send] │
└─────────────────────────────────────┘
```

---

## 4. Technical Implementation Steps

### 4.1 Backend Implementation

**Phase 1: Models & Migrations (2-3 hours)**
1. Create `TaskItem` model with validations
2. Create `TaskItemMessage` model with associations
3. Write migrations
4. Add enum definitions
5. Add scopes (`todo`, `doing`, `done`, `playing`)

**Phase 2: Controllers (3-4 hours)**
1. Create `TaskItemsController` (nested under tasks)
2. Create `TaskItemMessagesController` (nested under items)
3. Add REST actions (index, create, update, destroy)
4. Add custom actions:
   - `play` - Start item timer
   - `pause` - Pause item timer
   - `chat` - Send message
5. Add Turbo Streams responders

**Phase 3: API Extensions (2 hours)**
1. Add items to API responses
2. Add item CRUD endpoints to `Api::V1::TaskItemsController`
3. Add chat endpoints to `Api::V1::TaskItemMessagesController`
4. Update API documentation

**Phase 4: Real-time Updates (2 hours)**
1. Add Turbo Streams broadcasts for items
2. Add channel subscriptions for item updates
3. Add chat message broadcasting
4. Handle playing state synchronization

**Phase 5: Business Logic (2-3 hours)**
1. Timer tracking logic
2. Ensure only one item playing per task
3. Status change validation
4. Activity tracking for items

### 4.2 Frontend Implementation

**Phase 1: Item CRUD UI (4-5 hours)**
1. Add items section to task panel
2. Create item partial views
3. Add "Add item" form
4. Implement inline editing
5. Add item deletion

**Phase 2: Status UI (2-3 hours)**
1. Status badge component
2. Status change interactions
3. Visual feedback
4. Context menu integration

**Phase 3: Play/Pause UI (3-4 hours)**
1. Play/pause button component
2. Timer display (HH:MM:SS format)
3. Active state styling
4. Auto-update timer every second
5. Pause other items when playing

**Phase 4: Chat UI (4-5 hours)**
1. Chat icon with unread badge
2. Chat panel component
3. Message list with avatars
4. Message input form
5. Auto-scroll to newest message
6. Real-time message updates

**Phase 5: Stimulus Controllers (3-4 hours)**
1. `item-status` controller
2. `item-timer` controller (handles play/pause)
3. `item-chat` controller
4. `items-list` controller (drag-and-drop)
5. Integrate with existing `task-modal` controller

### 4.3 Testing (4-5 hours)
1. Model tests
2. Controller tests
3. System tests (play/pause flow)
4. Integration tests for API
5. Turbo Streams tests

---

## 5. Effort Estimates

### Total Estimate: **30-40 hours**

**Breakdown by Feature:**

#### Feature 1: Per-Item Status Tracking
| Component | Hours |
|-----------|-------|
| Model + Migration | 2 |
| Controller | 2 |
| UI Implementation | 4 |
| Testing | 2 |
| **Subtotal** | **10 hours** |

#### Feature 2: Play/Pause Buttons
| Component | Hours |
|-----------|-------|
| Timer Logic | 3 |
| Controller Actions | 2 |
| UI Implementation | 5 |
| Stimulus Controller | 3 |
| Testing | 3 |
| **Subtotal** | **16 hours** |

#### Feature 3: Per-Item Chat
| Component | Hours |
|-----------|-------|
| Model + Migration | 2 |
| Controller + API | 3 |
| UI Implementation | 6 |
| Real-time Updates | 3 |
| Testing | 2 |
| **Subtotal** | **16 hours** |

### Additional Overhead
| Component | Hours |
|-----------|-------|
| Setup + Config | 2 |
| Code Review + Refactoring | 3 |
| Documentation | 2 |
| Bug Fixes | 4 |
| **Total Overhead** | **11 hours** |

---

## 6. Potential Challenges & Solutions

### Challenge 1: Timer Accuracy & Persistence
**Problem:** Browser timers can drift; time tracking must be accurate.

**Solutions:**
- Store `started_at` timestamp in DB
- Calculate elapsed time server-side on pause
- Use client-side timer only for display
- Sync with server every 30 seconds

### Challenge 2: Real-time Synchronization
**Problem:** Multiple users/tabs viewing same task; timer must stay in sync.

**Solutions:**
- Turbo Streams broadcasts on play/pause
- Server-side validation (only one playing item)
- Optimistic UI updates with rollback on error
- WebSocket connection status checks

### Challenge 3: Performance with Many Items
**Problem:** Tasks could have 100+ items; UI may lag.

**Solutions:**
- Pagination for items (>20 items)
- Virtual scrolling for chat
- Efficient database queries (eager loading)
- Debounced updates for timer display

### Challenge 4: Chat Message Ordering
**Problem:** Messages from multiple sources (user, agent) must be ordered correctly.

**Solutions:**
- Use database timestamps (created_at)
- Include millisecond precision
- Handle clock skew with server-generated timestamps

### Challenge 5: Data Migration
**Problem:** Existing tasks have no items; users may be confused.

**Solutions:**
- Optional backfill migration (create default item per task)
- Show "Add your first item" prompt for empty tasks
- Maintain backward compatibility (tasks without items still work)

### Challenge 6: UI Space Constraints
**Problem:** Task panel already full; adding items/clutter.

**Solutions:**
- Collapsible items section
- Expandable chat panel
- Minimal design (small icons, compact layout)
- Progressive disclosure (show only active items by default)

### Challenge 7: Agent Integration
**Problem:** Agents need to understand item-level operations.

**Solutions:**
- Extend API with item endpoints
- Update agent documentation
- Add item status to activity feed
- Allow agents to create/update items via API

---

## 7. Recommended Implementation Order

**Phase 1: Foundation (Week 1)**
1. Create TaskItem model and migrations
2. Basic CRUD UI for items
3. Status tracking (Feature 1)

**Phase 2: Interactivity (Week 2)**
4. Play/pause functionality (Feature 2)
5. Timer tracking
6. Real-time updates

**Phase 3: Collaboration (Week 2-3)**
7. Chat model and API (Feature 3)
8. Chat UI
9. Agent integration

**Phase 4: Polish (Week 3)**
10. Testing
11. Bug fixes
12. Documentation
13. Performance optimization

---

## 8. Future Enhancements (Out of Scope)

- Item dependencies (Item B blocked until Item A done)
- Sub-items (nested hierarchy)
- Item templates
- Bulk item operations
- Item labels/tags
- Time estimation per item
- Burndown charts based on items
- Voice notes for chat
- File attachments to items

---

## 9. Conclusion

Implementing per-item status tracking, play/pause buttons, and per-item chat requires:
- **2 new models** (TaskItem, TaskItemMessage)
- **2 new tables** with proper indexes
- **Significant UI changes** to task panel
- **Real-time infrastructure** for timers and chat
- **30-40 hours** of development time

The current architecture is well-suited for these additions:
- Hotwire (Turbo + Stimulus) provides excellent real-time capabilities
- Existing activity tracking pattern can be extended to items
- Clean separation between web UI and API

**Recommendation:** Proceed in phases, starting with items and status tracking, then adding play/pause, finally chat. This allows incremental value delivery and testing at each stage.

---

## Appendix: Code Snippets

### A. TaskItem Model (Skeleton)
```ruby
class TaskItem < ApplicationRecord
  belongs_to :task
  belongs_to :user, optional: true
  has_many :messages, class_name: "TaskItemMessage", dependent: :destroy
  
  enum :status, { todo: 0, doing: 1, done: 2 }, default: :todo
  
  validates :name, presence: true
  validates :task, presence: true
  
  before_save :update_total_time, if: :playing_changed?
  
  scope :playing, -> { where(playing: true) }
  
  def play!
    # Pause other items in task
    task.items.where.not(id: id).update_all(playing: false, paused_at: Time.current)
    update!(playing: true, started_at: Time.current, status: :doing)
  end
  
  def pause!
    return unless playing?
    time_spent = Time.current - started_at
    increment!(:total_time_spent, time_spent)
    update!(playing: false, paused_at: Time.current)
  end
  
  private
  
  def update_total_time
    # Timer persistence logic
  end
end
```

### B. Migration Example
```ruby
class CreateTaskItems < ActiveRecord::Migration[8.1]
  def change
    create_table :task_items do |t|
      t.string :name, null: false
      t.text :description
      t.integer :position, default: 0, null: false
      t.integer :status, default: 0, null: false
      t.boolean :playing, default: false, null: false
      t.datetime :started_at
      t.datetime :paused_at
      t.decimal :total_time_spent, precision: 10, scale: 2, default: 0
      
      t.references :task, null: false, foreign_key: true
      t.references :user, foreign_key: true
      
      t.timestamps
    end
    
    add_index :task_items, :task_id
    add_index :task_items, :status
    add_index :task_items, :playing
  end
end
```

### C. Stimulus Controller (Timer)
```javascript
// app/frontend/controllers/item_timer_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["display", "button"]
  static values = { 
    itemId: Number,
    isPlaying: Boolean,
    startedAt: String
  }
  
  connect() {
    if (this.isPlayingValue) {
      this.startTimer()
    }
  }
  
  toggle(event) {
    event.preventDefault()
    
    if (this.isPlayingValue) {
      this.pause()
    } else {
      this.play()
    }
  }
  
  async play() {
    const response = await fetch(`/tasks/${this.taskIdValue}/items/${this.itemIdValue}/play`, {
      method: "PATCH",
      headers: { "Accept": "text/vnd.turbo-stream.html" }
    })
    
    if (response.ok) {
      this.isPlayingValue = true
      this.startTimer()
    }
  }
  
  async pause() {
    const response = await fetch(`/tasks/${this.taskIdValue}/items/${this.itemIdValue}/pause`, {
      method: "PATCH",
      headers: { "Accept": "text/vnd.turbo-stream.html" }
    })
    
    if (response.ok) {
      this.isPlayingValue = false
      this.stopTimer()
    }
  }
  
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.updateDisplay()
    }, 1000)
    this.updateDisplay()
  }
  
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
  }
  
  updateDisplay() {
    const started = new Date(this.startedAtValue)
    const now = new Date()
    const elapsed = Math.floor((now - started) / 1000)
    
    const hours = Math.floor(elapsed / 3600)
    const minutes = Math.floor((elapsed % 3600) / 60)
    const seconds = elapsed % 60
    
    this.displayTarget.textContent = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  disconnect() {
    this.stopTimer()
  }
}
```

---

**Report prepared by:** ClawDeck Sub-Agent
**Repository:** /Users/northsea/clawdeck
**Analysis Date:** 2025-02-09

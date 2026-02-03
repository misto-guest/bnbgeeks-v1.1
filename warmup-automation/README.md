# 🚀 Warmup Automation - Multi-User Edition

Chrome warm-up automation with comprehensive user management, scheduling, and a web-based admin panel. Designed for 100+ concurrent users with individual configurations and behavioral profiles.

## ✨ Features

### Core Functionality
- ✅ Automated Chrome warm-up using Google Trends and Google News
- ✅ Human-like browsing behavior with randomized delays
- ✅ Anti-detection measures (hidden webdriver, fake plugins/languages)
- ✅ Multi-user support with individual configurations
- ✅ Cron-based scheduling per user
- ✅ Execution logging and history tracking

### User Management
- 👥 Create, read, update, delete users (CRUD)
- ⚙️ User-specific configurations for timing, scrolling, mouse movements
- 📅 Schedule automation per user with cron expressions
- 📊 Track execution history and statistics
- 🎭 Behavioral presets (Conservative, Moderate, Aggressive)

### Web Admin Panel
- 🖥️ Beautiful web interface at `/admin`
- 📱 Responsive design for desktop and mobile
- 🔄 Real-time user status updates
- 📈 System statistics dashboard
- 🔧 Visual configuration editor

## 📦 Installation

```bash
cd warmup-automation
npm install
```

## 🚀 Quick Start

### 1. Create Default Users
```bash
npm run create-admin
```
This creates 3 default users:
- **Admin**: Conservative settings, headless mode
- **Test User**: Moderate settings, daily 9 AM schedule
- **Performance**: Aggressive settings (disabled)

### 2. Start the Server
```bash
npm run server
```

Server starts on `http://localhost:3000`
Admin panel: `http://localhost:3000/admin`

### 3. Use the Web Panel
Open `http://localhost:3000/admin` in your browser to:
- Create new users
- Configure user-specific settings
- Schedule automated runs
- Monitor execution logs
- Run warm-ups manually

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run single-user warmup (legacy mode) |
| `npm run server` | Start admin panel server |
| `npm run dev` | Alias for `npm run server` |
| `npm run create-admin` | Create default users |

## 🎯 Behavioral Presets

### Conservative (Slower, More Natural)
- **Trends page**: 15-25 seconds
- **News search**: 10-20 seconds
- **Article reading**: 45-90 seconds
- **Scrolling**: 50-200px, 1-2 times
- **Typing delay**: 100-200ms per character

**Use case**: Long-term accounts, high-value profiles, maximum safety

### Moderate (Balanced) ⭐ **DEFAULT**
- **Trends page**: 8-15 seconds
- **News search**: 5-12 seconds
- **Article reading**: 20-45 seconds
- **Scrolling**: 100-400px, 1-4 times
- **Typing delay**: 50-150ms per character

**Use case**: Daily warm-ups, standard usage, good balance

### Aggressive (Faster Processing)
- **Trends page**: 3-8 seconds
- **News search**: 2-5 seconds
- **Article reading**: 10-20 seconds
- **Scrolling**: 200-600px, 2-6 times
- **Typing delay**: 30-80ms per character

**Use case**: Quick warm-ups, batch processing, testing

## 🔧 Configuration Options

### Time on Page Settings
```json
{
  "timeOnPage": {
    "trends": { "min": 8, "max": 15 },
    "newsSearch": { "min": 5, "max": 12 },
    "article": { "min": 20, "max": 45 }
  }
}
```

### Scrolling Behavior
```json
{
  "scroll": {
    "amount": { "min": 100, "max": 400 },
    "count": { "min": 1, "max": 4 }
  }
}
```

### Automation
```json
{
  "automation": {
    "numTrendsToProcess": 1
  }
}
```

### Browser Settings
```json
{
  "browser": {
    "headless": true,
    "viewport": { "width": 1920, "height": 1080 }
  }
}
```

### Scheduling
```json
{
  "schedule": {
    "enabled": true,
    "cron": "0 9 * * *"
  }
}
```

**Cron Examples:**
- `0 9 * * *` - Daily at 9 AM
- `0 */4 * * *` - Every 4 hours
- `0 9,12,18 * * *` - 9 AM, 12 PM, 6 PM
- `0 9 * * 1-5` - Weekdays at 9 AM

## 🌐 REST API

### System Info
```bash
GET /api/info
```
Returns system statistics and metadata.

### Users
```bash
# List all users
GET /api/users

# Get user details with logs
GET /api/users/:id

# Create new user
POST /api/users
Body: { name, description, enabled, config, schedule }

# Update user
PUT /api/users/:id
Body: { name, description, enabled, config, schedule }

# Delete user
DELETE /api/users/:id
```

### Actions
```bash
# Run warmup now
POST /api/users/:id/run

# Stop running warmup
POST /api/users/:id/stop

# Get user logs
GET /api/users/:id/logs?limit=50
```

### Presets
```bash
# Get behavioral presets
GET /api/presets

# Apply preset to user
POST /api/users/:id/apply-preset
Body: { preset: "conservative" | "moderate" | "aggressive" }
```

## 📊 File Structure

```
warmup-automation/
├── server/
│   └── index.js              # Express server & REST API
├── lib/
│   └── user-manager.js       # User management logic
├── public/
│   └── admin/
│       ├── index.html        # Admin panel UI
│       ├── styles.css        # Styling
│       └── app.js            # Frontend logic
├── scripts/
│   └── create-admin-user.js  # Default user creation
├── users/
│   └── users.json            # User database
├── logs/
│   └── {userId}.jsonl        # Execution logs per user
├── warmup-user-aware.js      # Multi-user warmup engine
├── package.json
└── README.md
```

## 🔒 Security & Anti-Detection

### Built-in Protections
- ✅ `navigator.webdriver = false`
- ✅ Fake plugins data
- ✅ Fake languages property
- ✅ Random viewport offsets
- ✅ Human-like typing delays
- ✅ Randomized scrolling
- ✅ Natural mouse movements

### Best Practices
1. **Use Conservative settings** for important accounts
2. **Space out runs** - don't run multiple users simultaneously
3. **Vary schedules** - avoid identical cron patterns
4. **Monitor logs** - check for errors or anomalies
5. **Headless mode** - enables for production, disable for testing

## 📈 Scalability

This system is designed for **100+ concurrent users**:

### Performance Features
- ⚡ Non-blocking execution with background processes
- 💾 Efficient JSON-based storage
- 📝 Per-user log files (no database bottleneck)
- 🔄 Asynchronous API endpoints
- 🎯 Optimized Puppeteer instance management

### Deployment Tips
1. **Use headless mode** for better performance
2. **Limit concurrent runs** to 5-10 at a time
3. **Schedule users** throughout the day, not all at once
4. **Monitor system resources** (CPU, RAM)
5. **Consider cron staggering**: `0 9 * * *`, `5 9 * * *`, `10 9 * * *`

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Use different port
PORT=3001 npm run server
```

### Puppeteer Issues
```bash
# Reinstall Puppeteer
npx puppeteer browsers install chrome

# Check Chrome installation
npx puppeteer browsers
```

### User Not Running
- Check if user is enabled (green badge)
- Verify status is not already "running"
- Check logs for errors in admin panel

### Scheduled Task Not Firing
- Verify cron expression is valid
- Check server timezone: `process.env.TZ`
- Restart server after schedule changes

## 📝 Example Workflows

### Daily Warm-up Routine
1. Create user with "Moderate" preset
2. Enable schedule: `0 9 * * *` (9 AM daily)
3. Enable headless mode
4. Let it run automatically!

### Quick Test Run
1. Create user with "Aggressive" preset
2. Disable scheduling
3. Click "Run Now" in admin panel
4. Monitor real-time status

### Batch Account Maintenance
1. Create 10 users with "Conservative" preset
2. Stagger schedules: `0 9 * * *`, `30 9 * * *`, `0 10 * * *`...
3. Enable headless mode
4. Monitor logs daily

## 🤝 Contributing

Contributions welcome! Areas for enhancement:
- WebSocket support for real-time updates
- Advanced analytics dashboard
- Export/import user configurations
- Multi-language support
- Dark mode for admin panel

## 📄 License

ISC

## 🎉 What's New in v2.0

- ✨ **Multi-user support** with individual configurations
- 🖥️ **Web admin panel** for easy management
- 📅 **Cron scheduling** per user
- 📊 **Execution logging** and history
- 🎭 **Behavioral presets** for quick setup
- 🌐 **REST API** for programmatic access
- 🔧 **User CRUD operations** via UI or API
- 📈 **System statistics** dashboard
- 🎨 **Beautiful responsive UI**
- 🚀 **100+ user scalability**

---

**Ready to automate!** 🚀

Start the server with `npm run server` and visit `http://localhost:3000/admin` to get started.

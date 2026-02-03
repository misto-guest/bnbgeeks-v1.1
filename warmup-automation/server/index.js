import express from 'express';
import cors from 'cors';
import UserManager from '../lib/user-manager.js';
import runWarmupForUser from '../warmup-user-aware.js';
import cron from 'node-cron';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store scheduled tasks
const scheduledTasks = new Map();

// ===== REST API Endpoints =====

// GET: System info
app.get('/api/info', async (req, res) => {
  try {
    const users = await UserManager.getAllUsers();
    const metadata = await UserManager.getUserMetadata();
    
    res.json({
      version: '2.0.0',
      totalUsers: users.length,
      activeUsers: users.filter(u => u.enabled).length,
      runningUsers: users.filter(u => u.status === 'running').length,
      metadata
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: All users
app.get('/api/users', async (req, res) => {
  try {
    const users = await UserManager.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Single user
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await UserManager.getUser(req.params.id);
    const logs = await UserManager.getUserLogs(req.params.id, 20);
    res.json({ user, logs });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// POST: Create user
app.post('/api/users', async (req, res) => {
  try {
    const user = await UserManager.createUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await UserManager.updateUser(req.params.id, req.body);
    
    // Update scheduled task if schedule changed
    if (req.body.schedule !== undefined) {
      updateScheduledTask(user.id, user.schedule);
    }
    
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Remove user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await UserManager.deleteUser(req.params.id);
    
    // Remove scheduled task
    if (scheduledTasks.has(req.params.id)) {
      scheduledTasks.get(req.params.id).stop();
      scheduledTasks.delete(req.params.id);
    }
    
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// POST: Run warmup for user now
app.post('/api/users/:id/run', async (req, res) => {
  try {
    const user = await UserManager.getUser(req.params.id);
    
    if (!user.enabled) {
      return res.status(400).json({ error: 'User is disabled' });
    }
    
    if (user.status === 'running') {
      return res.status(400).json({ error: 'User is already running' });
    }
    
    // Run in background
    runWarmupForUser(req.params.id);
    
    res.json({ message: 'Started warmup for user', userId: req.params.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST: Stop running warmup
app.post('/api/users/:id/stop', async (req, res) => {
  try {
    await UserManager.updateUserStatus(req.params.id, 'stopped');
    res.json({ message: 'Stop signal sent', userId: req.params.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: User logs
app.get('/api/users/:id/logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const logs = await UserManager.getUserLogs(req.params.id, limit);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Behavioral presets
app.get('/api/presets', (req, res) => {
  res.json({ presets: UserManager.getBehavioralPresets() });
});

// POST: Apply preset to user
app.post('/api/users/:id/apply-preset', async (req, res) => {
  try {
    const { preset } = req.body;
    const presets = UserManager.getBehavioralPresets();
    
    if (!presets[preset]) {
      return res.status(400).json({ error: 'Invalid preset' });
    }
    
    const user = await UserManager.getUser(req.params.id);
    user.config = { ...user.config, ...presets[preset] };
    await UserManager.updateUser(req.params.id, user);
    
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST: Toggle schedule for user
app.post('/api/users/:id/schedule', async (req, res) => {
  try {
    const { enabled, cron: cronExpression } = req.body;
    
    const user = await UserManager.getUser(req.params.id);
    user.schedule = { enabled: !!enabled, cron: cronExpression || '0 9 * * *' };
    await UserManager.updateUser(req.params.id, user);
    
    updateScheduledTask(req.params.id, user.schedule);
    
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== Scheduling Functions =====

function updateScheduledTask(userId, schedule) {
  // Remove existing task
  if (scheduledTasks.has(userId)) {
    scheduledTasks.get(userId).stop();
    scheduledTasks.delete(userId);
  }
  
  // Create new task if enabled
  if (schedule && schedule.enabled && schedule.cron) {
    try {
      const task = cron.schedule(schedule.cron, async () => {
        console.log(`🕐 Scheduled warmup triggered for user ${userId}`);
        runWarmupForUser(userId);
      }, {
        scheduled: true,
        timezone: process.env.TZ || 'UTC'
      });
      
      scheduledTasks.set(userId, task);
      console.log(`✅ Scheduled task created for user ${userId}: ${schedule.cron}`);
    } catch (error) {
      console.error(`❌ Invalid cron expression for user ${userId}:`, error.message);
    }
  }
}

// Initialize all scheduled tasks on startup
async function initializeSchedules() {
  try {
    const users = await UserManager.getAllUsers();
    
    for (const user of users) {
      if (user.schedule && user.schedule.enabled && user.schedule.cron) {
        updateScheduledTask(user.id, user.schedule);
      }
    }
    
    console.log(`📅 Initialized ${scheduledTasks.size} scheduled tasks`);
  } catch (error) {
    console.error('❌ Error initializing schedules:', error.message);
  }
}

// ===== Start Server =====

app.listen(PORT, async () => {
  console.log(`🚀 Warmup Automation Server running on http://localhost:${PORT}`);
  console.log(`📋 Admin panel: http://localhost:${PORT}/admin`);
  await initializeSchedules();
});

export default app;

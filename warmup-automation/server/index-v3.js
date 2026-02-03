import express from 'express';
import cors from 'cors';
import UserManager from '../lib/user-manager.js';
import PersonaManager from '../lib/persona-manager.js';
import PersonaWarmupEngine from '../lib/persona-warmup-engine.js';
import cron from 'node-cron';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store scheduled tasks and running engines
const scheduledTasks = new Map();
const runningEngines = new Map();
const globalKillSwitch = { active: false };
const geoPauseList = new Set();
const profilePauseList = new Set();

// ===== USER MANAGEMENT ENDPOINTS =====

// GET: System info
app.get('/api/info', async (req, res) => {
  try {
    const users = await UserManager.getAllUsers();
    const personas = await PersonaManager.loadPersonas();
    const metadata = await UserManager.getUserMetadata();

    res.json({
      version: '3.0.0',
      totalUsers: users.length,
      totalPersonas: personas.length,
      activeUsers: users.filter(u => u.enabled).length,
      runningUsers: users.filter(u => u.status === 'running').length,
      pausedGeos: Array.from(geoPauseList),
      pausedProfiles: Array.from(profilePauseList),
      globalKillSwitch: globalKillSwitch.active,
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

    // Attach persona data to each user
    const usersWithPersonas = await Promise.all(
      users.map(async user => {
        const persona = await PersonaManager.getUserPersona(user.id);
        return { ...user, has_persona: !!persona, persona };
      })
    );

    res.json({ users: usersWithPersonas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Single user with persona
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await UserManager.getUser(req.params.id);
    const persona = await PersonaManager.getUserPersona(req.params.id);
    const logs = await UserManager.getUserLogs(req.params.id, 20);
    res.json({ user, persona, logs });
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
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Remove user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await UserManager.deleteUser(req.params.id);
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ===== PERSONA MANAGEMENT ENDPOINTS =====

// GET: All personas
app.get('/api/personas', async (req, res) => {
  try {
    const personas = await PersonaManager.loadPersonas();
    res.json({ personas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Persona by user ID
app.get('/api/personas/user/:userId', async (req, res) => {
  try {
    const persona = await PersonaManager.getUserPersona(req.params.userId);
    if (!persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }
    res.json({ persona });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create persona
app.post('/api/personas', async (req, res) => {
  try {
    const persona = await PersonaManager.createPersona(req.body.user_id, req.body);
    res.status(201).json({ persona });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update persona
app.put('/api/personas/:personaId', async (req, res) => {
  try {
    const persona = await PersonaManager.updatePersona(req.params.personaId, req.body);
    res.json({ persona });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST: Get persona preview
app.post('/api/personas/preview', (req, res) => {
  try {
    const profile = req.body;
    const model = PersonaManager.getBehavioralModel(profile);
    const weights = PersonaManager.calculateBehavioralWeights(profile);

    res.json({
      search_engines: model.search_engines,
      sites: model.sites,
      session_duration: model.session_duration[0],
      sessions_per_day: weights.session_pattern_weights.sessions_per_day,
      pages_per_session: weights.session_pattern_weights.pages_per_session,
      navigation_speed: model.navigation_speed,
      noise: {
        typos_rate: weights.noise_parameters.typos_rate,
        misclicks_rate: weights.noise_parameters.misclicks_rate,
        hesitation_rate: weights.noise_parameters.hesitation_rate
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Persona models reference
app.get('/api/personas/models', (req, res) => {
  res.json({ models: PersonaManager.getAllModels() });
});

// GET: Profile options
app.get('/api/personas/options', (req, res) => {
  res.json({ options: PersonaManager.getProfileOptions() });
});

// ===== CAMPAIGN EXECUTION ENDPOINTS =====

// POST: Run warmup for user (persona-aware)
app.post('/api/users/:id/run', async (req, res) => {
  try {
    const user = await UserManager.getUser(req.params.id);

    if (!user.enabled) {
      return res.status(400).json({ error: 'User is disabled' });
    }

    if (user.status === 'running') {
      return res.status(400).json({ error: 'User is already running' });
    }

    // Check kill switches
    if (globalKillSwitch.active) {
      return res.status(403).json({ error: 'Global kill switch is active' });
    }

    const persona = await PersonaManager.getUserPersona(req.params.id);
    if (persona && geoPauseList.has(persona.geo)) {
      return res.status(403).json({ error: `GEO ${persona.geo} is paused` });
    }

    // Run in background
    runPersonaWarmup(req.params.id);

    res.json({ message: 'Started persona-aware warmup', userId: req.params.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST: Stop running warmup
app.post('/api/users/:id/stop', async (req, res) => {
  try {
    await UserManager.updateUserStatus(req.params.id, 'stopped');

    // Stop engine if running
    const engine = runningEngines.get(req.params.id);
    if (engine && engine.browser) {
      await engine.browser.close();
      runningEngines.delete(req.params.id);
    }

    res.json({ message: 'Stop signal sent', userId: req.params.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== ADMIN CONTROL ENDPOINTS =====

// POST: Pause by GEO or profile
app.post('/api/admin/pause', (req, res) => {
  try {
    const { type, value } = req.body;

    if (type === 'geo') {
      geoPauseList.add(value);
    } else if (type === 'profile') {
      profilePauseList.add(value);
    }

    res.json({ message: `Paused ${type}: ${value}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Resume by GEO or profile
app.post('/api/admin/resume', (req, res) => {
  try {
    const { type, value } = req.body;

    if (type === 'geo') {
      geoPauseList.delete(value);
    } else if (type === 'profile') {
      profilePauseList.delete(value);
    }

    res.json({ message: `Resumed ${type}: ${value}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Emergency stop all
app.post('/api/admin/emergency-stop', async (req, res) => {
  try {
    globalKillSwitch.active = true;

    // Stop all running engines
    for (const [userId, engine] of runningEngines) {
      if (engine.browser) {
        await engine.browser.close();
      }
      await UserManager.updateUserStatus(userId, 'stopped');
    }

    runningEngines.clear();

    res.json({ message: 'Emergency stop activated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Reset emergency stop
app.post('/api/admin/reset-emergency', (req, res) => {
  try {
    globalKillSwitch.active = false;
    res.json({ message: 'Emergency stop reset' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== TRUST SCORING ENDPOINTS =====

// GET: Trust score for user
app.get('/api/users/:id/trust-score', async (req, res) => {
  try {
    const persona = await PersonaManager.getUserPersona(req.params.id);
    if (!persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }
    res.json({ trust_score: persona.trust_score, maturity_score: persona.maturity_score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Update trust score (called after warmup)
app.post('/api/users/:id/update-trust', async (req, res) => {
  try {
    const persona = await PersonaManager.getUserPersona(req.params.id);
    if (!persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }

    const metrics = req.body;
    const updatedPersona = await PersonaManager.updateTrustScore(persona.id, metrics);

    res.json({ persona: updatedPersona });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== SCHEDULING =====

// Initialize scheduled tasks
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

function updateScheduledTask(userId, schedule) {
  if (scheduledTasks.has(userId)) {
    scheduledTasks.get(userId).stop();
    scheduledTasks.delete(userId);
  }

  if (schedule && schedule.enabled && schedule.cron) {
    try {
      const task = cron.schedule(schedule.cron, async () => {
        console.log(`🕐 Scheduled warmup triggered for user ${userId}`);
        runPersonaWarmup(userId);
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

// ===== PERSONA-AWARE WARMUP EXECUTOR =====

async function runPersonaWarmup(userId) {
  try {
    // Check kill switches
    if (globalKillSwitch.active) {
      console.log(`⛔ Global kill switch active, skipping user ${userId}`);
      return;
    }

    const persona = await PersonaManager.getUserPersona(userId);
    if (persona && geoPauseList.has(persona.geo)) {
      console.log(`⛔ GEO ${persona.geo} paused, skipping user ${userId}`);
      return;
    }

    const user = await UserManager.getUser(userId);
    if (user.status === 'running') {
      console.log(`⚠️ User ${userId} already running, skipping`);
      return;
    }

    await UserManager.updateUserStatus(userId, 'running');

    // Create and run engine
    const engine = new PersonaWarmupEngine(userId);
    runningEngines.set(userId, engine);

    await engine.run();

    runningEngines.delete(userId);

    // Update trust score
    const sessionMetrics = engine.sessionMetrics;
    await PersonaManager.updateTrustScore(persona.id, {
      account_age_days: Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)),
      warmup_sessions_completed: user.runCount + 1,
      expected_sessions: 30, // Adjust based on schedule
      unique_sites_visited: sessionMetrics.sites_visited.size,
      email_replies: Math.floor(sessionMetrics.emails * 0.4),
      emails_received: sessionMetrics.emails,
      google_products_used: persona.cross_product_enabled ? 3 : 1,
      spam_folder_touches: 0
    });

    await UserManager.updateLastRun(userId, true);

  } catch (error) {
    console.error(`❌ Error running warmup for user ${userId}:`, error.message);
    runningEngines.delete(userId);
    await UserManager.updateLastRun(userId, false, error.message);
    await UserManager.updateUserStatus(userId, 'idle');
  }
}

// ===== START SERVER =====

app.listen(PORT, async () => {
  console.log(`🚀 Warmup Automation Server v3.0 running on http://localhost:${PORT}`);
  console.log(`📋 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`🎭 Persona system enabled`);
  await initializeSchedules();
});

export default app;

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';

const USERS_FILE = path.join(process.cwd(), 'users', 'users.json');
const LOGS_DIR = path.join(process.cwd(), 'logs');

// Ensure directories exist
async function ensureDirectories() {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.mkdir(LOGS_DIR, { recursive: true });
}

// Read users database
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    const db = JSON.parse(data);
    return db.users || [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write users database
async function writeUsers(users) {
  const existingDb = await readDatabase();
  const db = {
    users,
    metadata: {
      created: existingDb.metadata?.created || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: '2.0.0'
    }
  };
  await fs.writeFile(USERS_FILE, JSON.stringify(db, null, 2));
}

// Helper to read full database
async function readDatabase() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], metadata: {} };
  }
}

// User Manager Class
class UserManager {
  // CREATE: Add new user
  static async createUser(userData) {
    await ensureDirectories();
    
    const users = await readUsers();
    
    // Validate required fields
    if (!userData.name || !userData.name.trim()) {
      throw new Error('User name is required');
    }
    
    // Check for duplicate names
    if (users.some(u => u.name.toLowerCase() === userData.name.toLowerCase())) {
      throw new Error('User with this name already exists');
    }
    
    // Create user object with defaults
    const user = {
      id: uuidv4(),
      name: userData.name.trim(),
      description: userData.description || '',
      enabled: userData.enabled !== undefined ? userData.enabled : true,
      config: userData.config || this.getDefaultConfig(),
      schedule: userData.schedule || null, // { cron: '0 9 * * *', enabled: false }
      createdAt: new Date().toISOString(),
      lastRun: null,
      runCount: 0,
      status: 'idle' // idle, running, paused, error
    };
    
    users.push(user);
    await writeUsers(users);
    
    return user;
  }
  
  // READ: Get all users
  static async getAllUsers() {
    await ensureDirectories();
    return await readUsers();
  }
  
  // READ: Get single user by ID
  static async getUser(userId) {
    const users = await readUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  
  // READ: Get user by name
  static async getUserByName(name) {
    const users = await readUsers();
    return users.find(u => u.name.toLowerCase() === name.toLowerCase());
  }
  
  // UPDATE: Update user
  static async updateUser(userId, updates) {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const user = users[userIndex];
    
    // Validate name change
    if (updates.name && updates.name.trim() !== user.name) {
      if (users.some(u => u.id !== userId && u.name.toLowerCase() === updates.name.toLowerCase())) {
        throw new Error('User with this name already exists');
      }
    }
    
    // Update fields (excluding immutable ones)
    const allowedUpdates = ['name', 'description', 'enabled', 'config', 'schedule'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    });
    
    user.updatedAt = new Date().toISOString();
    users[userIndex] = user;
    
    await writeUsers(users);
    return user;
  }
  
  // DELETE: Remove user
  static async deleteUser(userId) {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    await writeUsers(users);
    
    return deletedUser;
  }
  
  // Update user status
  static async updateUserStatus(userId, status) {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex].status = status;
    users[userIndex].updatedAt = new Date().toISOString();
    
    await writeUsers(users);
    return users[userIndex];
  }
  
  // Update last run info
  static async updateLastRun(userId, success, error = null) {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return;
    }
    
    users[userIndex].lastRun = new Date().toISOString();
    users[userIndex].runCount = (users[userIndex].runCount || 0) + 1;
    users[userIndex].lastRunStatus = success ? 'success' : 'error';
    users[userIndex].lastError = error;
    users[userIndex].updatedAt = new Date().toISOString();
    
    await writeUsers(users);
  }
  
  // Get default config
  static getDefaultConfig() {
    return {
      timeOnPage: {
        trends: { min: 8, max: 15, description: 'Time to scan Google Trends page' },
        newsSearch: { min: 5, max: 12, description: 'Time to review search results' },
        article: { min: 20, max: 45, description: 'Time to read the article' },
        scrollPause: { min: 0.5, max: 2, description: 'Pause between scrolls' }
      },
      scroll: {
        amount: { min: 100, max: 400, description: 'Pixels to scroll per action' },
        count: { min: 1, max: 4, description: 'Number of scrolls' }
      },
      mouse: {
        moveCount: { min: 2, max: 5, description: 'Random mouse movements' }
      },
      typing: {
        delay: { min: 50, max: 150, description: 'Milliseconds per character' }
      },
      browser: {
        headless: false,
        viewport: { width: 1920, height: 1080 }
      },
      automation: {
        numTrendsToProcess: 1,
        description: 'Number of trends to process'
      },
      antiDetection: {
        hideWebdriver: true,
        fakePlugins: true,
        fakeLanguages: true,
        randomViewportOffset: true
      }
    };
  }
  
  // Behavioral presets
  static getBehavioralPresets() {
    return {
      conservative: {
        timeOnPage: { trends: { min: 15, max: 25 }, newsSearch: { min: 10, max: 20 }, article: { min: 45, max: 90 }, scrollPause: { min: 1, max: 3 } },
        scroll: { amount: { min: 50, max: 200 }, count: { min: 1, max: 2 } },
        mouse: { moveCount: { min: 3, max: 6 } },
        typing: { delay: { min: 100, max: 200 } }
      },
      moderate: {
        timeOnPage: { trends: { min: 8, max: 15 }, newsSearch: { min: 5, max: 12 }, article: { min: 20, max: 45 }, scrollPause: { min: 0.5, max: 2 } },
        scroll: { amount: { min: 100, max: 400 }, count: { min: 1, max: 4 } },
        mouse: { moveCount: { min: 2, max: 5 } },
        typing: { delay: { min: 50, max: 150 } }
      },
      aggressive: {
        timeOnPage: { trends: { min: 3, max: 8 }, newsSearch: { min: 2, max: 5 }, article: { min: 10, max: 20 }, scrollPause: { min: 0.3, max: 1 } },
        scroll: { amount: { min: 200, max: 600 }, count: { min: 2, max: 6 } },
        mouse: { moveCount: { min: 1, max: 3 } },
        typing: { delay: { min: 30, max: 80 } }
      }
    };
  }
  
  // Get database metadata
  static async getUserMetadata() {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      const db = JSON.parse(data);
      return db.metadata || {};
    } catch {
      return {};
    }
  }
  
  // Log execution
  static async logExecution(userId, logData) {
    await fs.mkdir(LOGS_DIR, { recursive: true });
    
    const logFile = path.join(LOGS_DIR, `${userId}.jsonl`);
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...logData
    };
    
    await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
  }
  
  // Get logs for user
  static async getUserLogs(userId, limit = 50) {
    const logFile = path.join(LOGS_DIR, `${userId}.jsonl`);
    
    try {
      const data = await fs.readFile(logFile, 'utf-8');
      const lines = data.trim().split('\n').reverse();
      const logs = lines.slice(0, limit).map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      }).filter(Boolean);
      
      return logs;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }
}

export default UserManager;

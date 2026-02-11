#!/usr/bin/env node

/**
 * Trello Sync Service
 * Automatically updates Trello cards based on sub-agent activity
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG_PATH = path.join(__dirname, 'config.json');
const PROJECTS_PATH = path.join(__dirname, 'projects.json');
const EVENT_LOG_PATH = path.join(__dirname, 'event-log.json');

// Trello API base URL
const TRELLO_API = 'https://api.trello.com/1';

class TrelloSync {
  constructor() {
    this.config = null;
    this.projects = null;
    this.eventLog = null;
  }

  async loadConfig() {
    try {
      const configContent = await fs.readFile(CONFIG_PATH, 'utf8');
      this.config = JSON.parse(configContent);

      if (this.config.trello.apiKey.includes('YOUR_')) {
        throw new Error('Trello API credentials not configured. Please edit config.json');
      }

      return this.config;
    } catch (error) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
  }

  async loadProjects() {
    try {
      const projectsContent = await fs.readFile(PROJECTS_PATH, 'utf8');
      this.projects = JSON.parse(projectsContent);
      return this.projects;
    } catch (error) {
      throw new Error(`Failed to load projects: ${error.message}`);
    }
  }

  async loadEventLog() {
    try {
      const logContent = await fs.readFile(EVENT_LOG_PATH, 'utf8');
      this.eventLog = JSON.parse(logContent);
      return this.eventLog;
    } catch (error) {
      // Initialize new log if doesn't exist
      this.eventLog = {
        events: [],
        lastSync: null,
        stats: {
          totalEvents: 0,
          syncsPerformed: 0,
          cardsUpdated: 0,
          cardsCreated: 0
        }
      };
      return this.eventLog;
    }
  }

  async saveEventLog() {
    await fs.writeFile(EVENT_LOG_PATH, JSON.stringify(this.eventLog, null, 2));
  }

  async saveProjects() {
    await fs.writeFile(PROJECTS_PATH, JSON.stringify(this.projects, null, 2));
  }

  // Trello API calls
  async trelloRequest(endpoint, method = 'GET', body = null) {
    const { apiKey, apiToken } = this.config.trello;
    const url = new URL(`${TRELLO_API}${endpoint}`);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('token', apiToken);

    const options = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), options);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Trello API error: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Trello request failed: ${error.message}`);
    }
  }

  async testConnection() {
    try {
      const member = await this.trelloRequest('/members/me');
      console.log(`✅ Connected to Trello as: ${member.fullName}`);
      return true;
    } catch (error) {
      console.error(`❌ Connection failed: ${error.message}`);
      return false;
    }
  }

  async getBoardLists() {
    const { boardId } = this.config.trello;
    const lists = await this.trelloRequest(`/boards/${boardId}/lists`);
    return lists;
  }

  async findCardByName(name) {
    const { boardId } = this.config.trello;
    const cards = await this.trelloRequest(`/boards/${boardId}/cards`, 'GET');

    const card = cards.find(c => c.name.toLowerCase() === name.toLowerCase());
    return card || null;
  }

  async createCard(project) {
    if (this.config.sync.dryRun) {
      console.log(`[DRY RUN] Would create card: ${project.name}`);
      return null;
    }

    const { lists } = this.config.trello;
    const targetList = project.status === 'done' ? lists.done :
                      project.status === 'in-progress' ? lists.inProgress :
                      project.status === 'review' ? lists.review :
                      lists.inbox;

    const cardData = {
      name: project.name,
      desc: project.description || `Project: ${project.name}\n\nSub-agents:\n${project.subAgents.map(sa => `- ${sa}`).join('\n')}`,
      idList: targetList
    };

    try {
      const card = await this.trelloRequest('/cards', 'POST', cardData);
      console.log(`✅ Created card: ${card.name} (${card.shortUrl})`);

      // Add label based on status
      if (project.status !== 'pending') {
        await this.addStatusLabel(card.id, project.status);
      }

      this.eventLog.stats.cardsCreated++;
      return card;
    } catch (error) {
      console.error(`❌ Failed to create card for ${project.name}: ${error.message}`);
      return null;
    }
  }

  async addStatusLabel(cardId, status) {
    // Check if label exists or create it
    const { boardId } = this.config.trello;
    const labels = await this.trelloRequest(`/boards/${boardId}/labels`);
    
    let label = labels.find(l => l.name === status);
    
    if (!label) {
      // Create new label
      const colors = {
        'in-progress': 'orange',
        'review': 'yellow',
        'done': 'green'
      };
      
      label = await this.trelloRequest(`/boards/${boardId}/labels`, 'POST', {
        name: status,
        color: colors[status] || 'null'
      });
    }

    // Add label to card
    await this.trelloRequest(`/cards/${cardId}/labels`, 'POST', {
      value: label.id
    });
  }

  async updateCardStatus(project, cardId) {
    if (this.config.sync.dryRun) {
      console.log(`[DRY RUN] Would move card "${project.name}" to ${project.status}`);
      return;
    }

    const { lists } = this.config.trello;
    const targetListId = project.status === 'done' ? lists.done :
                        project.status === 'in-progress' ? lists.inProgress :
                        project.status === 'review' ? lists.review :
                        lists.inbox;

    try {
      await this.trelloRequest(`/cards/${cardId}`, 'PUT', {
        idList: targetListId
      });
      console.log(`✅ Moved "${project.name}" to ${project.status}`);
      this.eventLog.stats.cardsUpdated++;
    } catch (error) {
      console.error(`❌ Failed to update card: ${error.message}`);
    }
  }

  async addCardComment(cardId, comment) {
    if (!this.config.sync.addComments || this.config.sync.dryRun) {
      console.log(`[DRY RUN] Would add comment to card ${cardId}`);
      return;
    }

    try {
      await this.trelloRequest(`/cards/${cardId}/comments`, 'POST', {
        text: comment
      });
      console.log(`✅ Added comment to card`);
    } catch (error) {
      console.error(`❌ Failed to add comment: ${error.message}`);
    }
  }

  async syncProjects() {
    console.log('\n🔄 Starting Trello sync...\n');

    await this.loadConfig();
    await this.loadProjects();
    await this.loadEventLog();

    // Test connection first
    const connected = await this.testConnection();
    if (!connected) {
      throw new Error('Cannot proceed without Trello connection');
    }

    let updatesMade = 0;

    for (const project of this.projects.projects) {
      console.log(`\n📋 Processing: ${project.name}`);
      console.log(`   Status: ${project.status}`);

      // Find or create card
      let card = await this.findCardByName(project.name);

      if (!card) {
        console.log(`   Card not found, creating...`);
        card = await this.createCard(project);
        if (card) {
          project.cardId = card.id;
          updatesMade++;
        }
      } else {
        // Update existing card
        console.log(`   Card found: ${card.shortUrl}`);

        // Store card ID if not set
        if (!project.cardId) {
          project.cardId = card.id;
        }

        // Check if card needs to be moved
        const cardList = await this.trelloRequest(`/cards/${card.id}/list`);
        const shouldMove = project.status === 'done' && cardList.name !== 'Done' ||
                          project.status === 'in-progress' && cardList.name !== 'In Progress' &&
                          cardList.name !== 'In Progress' && cardList.name !== 'Review' ||
                          project.status === 'review' && cardList.name !== 'Review';

        if (shouldMove) {
          await this.updateCardStatus(project, card.id);
          await this.addCardComment(card.id, `🤖 Auto-sync: Moved to ${project.status}`);
          updatesMade++;
        }

        // Update card description with latest info
        const desc = `${project.description || ''}\n\n---\n**Status:** ${project.status}\n**Last Sync:** ${new Date().toISOString()}\n\n**Sub-agents:**\n${project.subAgents.map(sa => `- \`${sa}\``).join('\n')}`;
        
        if (!this.config.sync.dryRun) {
          await this.trelloRequest(`/cards/${card.id}`, 'PUT', { desc });
        }
      }

      // Update last sync time
      project.lastUpdate = new Date().toISOString();
    }

    // Save updates
    await this.saveProjects();

    // Update event log
    this.eventLog.lastSync = new Date().toISOString();
    this.eventLog.stats.syncsPerformed++;
    await this.saveEventLog();

    console.log(`\n✨ Sync complete! ${updatesMade} update(s) made.`);
    console.log(`📊 Stats: ${this.eventLog.stats.cardsCreated} cards created, ${this.eventLog.stats.cardsUpdated} cards updated\n`);
  }

  async initBoard() {
    console.log('🔍 Setting up board configuration...\n');

    await this.loadConfig();
    await this.testConnection();

    // Get board info
    const board = await this.trelloRequest(`/boards/${this.config.trello.boardId}`);
    console.log(`Board: ${board.name}`);
    console.log(`URL: ${board.shortUrl}\n`);

    // Get lists
    const lists = await this.getBoardLists();
    console.log('📋 Available lists:');
    lists.forEach(list => {
      console.log(`   - ${list.name} (ID: ${list.id})`);
    });

    console.log('\n✅ Update config.json with these list IDs to enable auto-sync');
    return lists;
  }
}

// CLI interface
async function main() {
  const sync = new TrelloSync();
  const args = process.argv.slice(2);

  try {
    if (args.includes('--init')) {
      await sync.initBoard();
    } else if (args.includes('--test')) {
      await sync.loadConfig();
      await sync.testConnection();
    } else if (args.includes('--dry-run')) {
      // Force dry run
      await sync.loadConfig();
      sync.config.sync.dryRun = true;
      await sync.syncProjects();
    } else if (args.includes('--help')) {
      console.log(`
Trello Sync Service

Usage:
  node sync.js              Run full sync
  node sync.js --init       Initialize board config (get list IDs)
  node sync.js --test       Test Trello API connection
  node sync.js --dry-run    Preview changes without making them
  node sync.js --help       Show this help

Setup:
  1. Add Trello API credentials to config.json
  2. Run: node sync.js --init
  3. Update list IDs in config.json
  4. Run: node sync.js
      `);
    } else {
      await sync.syncProjects();
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TrelloSync;

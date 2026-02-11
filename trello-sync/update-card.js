#!/usr/bin/env node

/**
 * Update Individual Card Utility
 * Quick helper to manually update a specific project's card
 */

const fs = require('fs').promises;
const path = require('path');
const TrelloSync = require('./sync');

class CardUpdater extends TrelloSync {
  async updateProject(projectId, newStatus, comment = null) {
    await this.loadConfig();
    await this.loadProjects();

    const project = this.projects.projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    console.log(`\n📋 Updating: ${project.name}`);
    console.log(`   Current status: ${project.status}`);
    console.log(`   New status: ${newStatus}`);

    // Find card
    let card;
    if (project.cardId) {
      card = await this.trelloRequest(`/cards/${project.cardId}`);
    } else {
      card = await this.findCardByName(project.name);
    }

    if (!card) {
      console.log(`   Card not found, creating...`);
      card = await this.createCard(project);
      if (!card) {
        throw new Error('Failed to create card');
      }
      project.cardId = card.id;
    }

    // Update status
    if (newStatus && newStatus !== project.status) {
      project.status = newStatus;
      await this.updateCardStatus(project, card.id);
    }

    // Add comment
    if (comment) {
      await this.addCardComment(card.id, comment);
    }

    // Update project description
    const desc = `${project.description || ''}\n\n---\n**Status:** ${project.status}\n**Last Update:** ${new Date().toISOString()}\n\n**Sub-agents:**\n${project.subAgents.map(sa => `- \`${sa}\``).join('\n')}`;
    
    await this.trelloRequest(`/cards/${card.id}`, 'PUT', { desc });

    // Save
    project.lastUpdate = new Date().toISOString();
    await this.saveProjects();

    console.log(`\n✅ Card updated: ${card.shortUrl}\n`);
  }

  async listProjects() {
    await this.loadProjects();
    console.log('\n📋 Tracked Projects:\n');
    this.projects.projects.forEach(p => {
      console.log(`   ${p.id}: ${p.name}`);
      console.log(`      Status: ${p.status}`);
      console.log(`      Card ID: ${p.cardId || 'Not linked'}`);
      console.log(`      Sub-agents: ${p.subAgents.join(', ')}`);
      console.log('');
    });
  }
}

// CLI
async function main() {
  const updater = new CardUpdater();
  const args = process.argv.slice(2);

  if (args.includes('--list') || args.includes('-l')) {
    await updater.listProjects();
  } else if (args.includes('--help') || args.length === 0) {
    console.log(`
Card Update Utility

Usage:
  node update-card.js --list                          List all tracked projects
  node update-card.js <project-id> <status> [comment] Update a project's card

Examples:
  node update-card.js --list
  node update-card.js bol-outreach done "Completed deployment"
  node update-card.js bnbgeeks review "Ready for QA"
    `);
  } else {
    const [projectId, newStatus, ...commentParts] = args;
    const comment = commentParts.join(' ');
    
    await updater.updateProject(projectId, newStatus, comment);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = CardUpdater;

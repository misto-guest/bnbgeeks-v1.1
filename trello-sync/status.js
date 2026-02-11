#!/usr/bin/env node

/**
 * System Status Check
 * Quick overview of Trello sync system status
 */

const fs = require('fs').promises;
const path = require('path');

async function getStatus() {
  console.log('🔍 Trello Sync System Status\n');
  console.log('═'.repeat(50));
  console.log('');

  // Check config
  try {
    const config = JSON.parse(await fs.readFile(path.join(__dirname, 'config.json'), 'utf8'));
    
    const hasKey = !config.trello.apiKey.includes('YOUR_');
    const hasToken = !config.trello.apiToken.includes('YOUR_');
    const hasBoard = !config.trello.boardId.includes('YOUR_');
    const hasLists = !Object.values(config.trello.lists).some(id => id.includes('_ID'));

    console.log('📋 Configuration:');
    console.log(`   API Key: ${hasKey ? '✅' : '❌'}`);
    console.log(`   API Token: ${hasToken ? '✅' : '❌'}`);
    console.log(`   Board ID: ${hasBoard ? '✅' : '❌'}`);
    console.log(`   List IDs: ${hasLists ? '✅' : '⚠️ '}`);
    console.log('');
  } catch (error) {
    console.log('❌ Configuration not found or invalid\n');
  }

  // Check projects
  try {
    const projects = JSON.parse(await fs.readFile(path.join(__dirname, 'projects.json'), 'utf8'));
    
    console.log(`📊 Projects: ${projects.projects.length} tracked`);
    
    const byStatus = {
      pending: 0,
      'in-progress': 0,
      review: 0,
      done: 0
    };

    projects.projects.forEach(p => {
      byStatus[p.status]++;
    });

    console.log(`   Pending: ${byStatus.pending}`);
    console.log(`   In Progress: ${byStatus['in-progress']}`);
    console.log(`   Review: ${byStatus.review}`);
    console.log(`   Done: ${byStatus.done}`);
    console.log('');
  } catch (error) {
    console.log('❌ Projects not found\n');
  }

  // Check event log
  try {
    const log = JSON.parse(await fs.readFile(path.join(__dirname, 'event-log.json'), 'utf8'));
    
    console.log('📈 Activity:');
    console.log(`   Total Events: ${log.stats.totalEvents}`);
    console.log(`   Syncs Performed: ${log.stats.syncsPerformed}`);
    console.log(`   Cards Created: ${log.stats.cardsCreated}`);
    console.log(`   Cards Updated: ${log.stats.cardsUpdated}`);
    console.log(`   Last Sync: ${log.lastSync || 'Never'}`);
    console.log('');
  } catch (error) {
    console.log('ℹ️  No sync activity yet\n');
  }

  // Check for sync.log
  try {
    await fs.access(path.join(__dirname, 'sync.log'));
    const { size } = await fs.stat(path.join(__dirname, 'sync.log'));
    console.log(`📝 Sync Log: ${(size / 1024).toFixed(2)} KB`);
    console.log('');
  } catch (error) {
    console.log('ℹ️  No sync log yet\n');
  }

  // Ready status
  try {
    const config = JSON.parse(await fs.readFile(path.join(__dirname, 'config.json'), 'utf8'));
    const isReady = !config.trello.apiKey.includes('YOUR_') && 
                   !config.trello.apiToken.includes('YOUR_') &&
                   !config.trello.boardId.includes('YOUR_');

    console.log('═'.repeat(50));
    console.log('');
    
    if (isReady) {
      console.log('✅ System is READY to sync!');
      console.log('');
      console.log('Next steps:');
      console.log('  1. Test: npm run test');
      console.log('  2. Preview: npm run dry-run');
      console.log('  3. Sync: npm run sync');
      console.log('  4. Automate: crontab -e');
    } else {
      console.log('⚠️  Setup required');
      console.log('');
      console.log('Run: ./setup.sh');
      console.log('Or: npm run init');
    }
    
    console.log('');
    console.log('Documentation: QUICKSTART.md');
  } catch (error) {
    console.log('❌ Cannot determine status');
  }
}

getStatus().catch(console.error);

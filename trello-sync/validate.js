#!/usr/bin/env node

/**
 * Validation Script
 * Checks that the Trello sync system is properly configured
 */

const fs = require('fs').promises;
const path = require('path');

async function checkFile(filePath, required = true) {
  try {
    await fs.access(filePath);
    const content = JSON.parse(await fs.readFile(filePath, 'utf8'));
    return { exists: true, content };
  } catch (error) {
    if (required) {
      return { exists: false, error: error.message };
    }
    return { exists: false };
  }
}

async function validate() {
  console.log('🔍 Validating Trello Sync Setup\n');
  console.log('================================\n');

  let allGood = true;

  // Check config.json
  console.log('📋 Checking config.json...');
  const configCheck = await checkFile(path.join(__dirname, 'config.json'));
  
  if (!configCheck.exists) {
    console.log('   ❌ config.json not found');
    allGood = false;
  } else {
    const config = configCheck.content;
    
    if (config.trello.apiKey.includes('YOUR_')) {
      console.log('   ❌ Trello API Key not configured');
      allGood = false;
    } else {
      console.log('   ✅ API Key configured');
    }

    if (config.trello.apiToken.includes('YOUR_')) {
      console.log('   ❌ Trello API Token not configured');
      allGood = false;
    } else {
      console.log('   ✅ API Token configured');
    }

    if (config.trello.boardId.includes('YOUR_')) {
      console.log('   ❌ Board ID not configured');
      allGood = false;
    } else {
      console.log('   ✅ Board ID configured');
    }

    const listIds = Object.values(config.trello.lists);
    if (listIds.some(id => id.includes('_ID'))) {
      console.log('   ⚠️  Some list IDs not configured');
      console.log('      Run: node sync.js --init');
    } else {
      console.log('   ✅ All list IDs configured');
    }
  }

  // Check projects.json
  console.log('\n📋 Checking projects.json...');
  const projectsCheck = await checkFile(path.join(__dirname, 'projects.json'));
  
  if (!projectsCheck.exists) {
    console.log('   ❌ projects.json not found');
    allGood = false;
  } else {
    const projects = projectsCheck.content;
    console.log(`   ✅ Found ${projects.projects.length} projects`);
    
    projects.projects.forEach(p => {
      const hasCard = !!p.cardId;
      console.log(`      ${p.id}: ${p.status} ${hasCard ? '✅' : '⚠️  no card'}`);
    });
  }

  // Check Node.js version
  console.log('\n📋 Checking Node.js version...');
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 18) {
    console.log(`   ✅ Node.js ${nodeVersion} (supported)`);
  } else {
    console.log(`   ⚠️  Node.js ${nodeVersion} (18+ recommended)`);
  }

  // Check files
  console.log('\n📋 Checking system files...');
  
  const files = [
    'sync.js',
    'update-card.js',
    'package.json',
    '.gitignore'
  ];

  for (const file of files) {
    const check = await checkFile(path.join(__dirname, file));
    if (check.exists) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} missing`);
      allGood = false;
    }
  }

  // Check for sync.log (optional)
  const logCheck = await checkFile(path.join(__dirname, 'sync.log'), false);
  if (logCheck.exists) {
    console.log(`   ✅ sync.log (activity log)`);
  }

  // Summary
  console.log('\n================================');
  console.log('\n');
  
  if (allGood) {
    console.log('✅ All checks passed!');
    console.log('\nNext steps:');
    console.log('  1. Test connection: node sync.js --test');
    console.log('  2. Preview changes: node sync.js --dry-run');
    console.log('  3. Run first sync:  node sync.js');
    console.log('  4. Set up cron:     crontab -e');
  } else {
    console.log('⚠️  Some issues found. Please fix them before running sync.');
    console.log('\nSee SETUP.md for detailed instructions.');
  }

  console.log('\n');
}

validate().catch(console.error);

import UserManager from '../lib/user-manager.js';

async function createDefaultUsers() {
  console.log('🔧 Creating default users...\n');

  try {
    // Create admin user with conservative settings
    const admin = await UserManager.createUser({
      name: 'Admin',
      description: 'Default admin user with conservative settings',
      enabled: true,
      config: {
        timeOnPage: {
          trends: { min: 15, max: 25, description: 'Time to scan Google Trends page' },
          newsSearch: { min: 10, max: 20, description: 'Time to review search results' },
          article: { min: 45, max: 90, description: 'Time to read the article' },
          scrollPause: { min: 1, max: 3, description: 'Pause between scrolls' }
        },
        scroll: {
          amount: { min: 50, max: 200, description: 'Pixels to scroll per action' },
          count: { min: 1, max: 2, description: 'Number of scrolls' }
        },
        mouse: { moveCount: { min: 3, max: 6, description: 'Random mouse movements' } },
        typing: { delay: { min: 100, max: 200, description: 'Milliseconds per character' } },
        browser: { headless: true, viewport: { width: 1920, height: 1080 } },
        automation: { numTrendsToProcess: 1, description: 'Number of trends to process' },
        antiDetection: {
          hideWebdriver: true,
          fakePlugins: true,
          fakeLanguages: true,
          randomViewportOffset: true
        }
      },
      schedule: {
        enabled: false,
        cron: '0 9 * * *'
      }
    });

    console.log(`✅ Created user: ${admin.name} (ID: ${admin.id})`);

    // Create test user with moderate settings
    const testUser = await UserManager.createUser({
      name: 'Test User',
      description: 'Test user with moderate settings and daily schedule',
      enabled: true,
      config: UserManager.getBehavioralPresets().moderate,
      schedule: {
        enabled: true,
        cron: '0 9 * * *' // Daily at 9 AM
      }
    });

    console.log(`✅ Created user: ${testUser.name} (ID: ${testUser.id})`);
    console.log(`   Schedule: ${testUser.schedule.cron}`);

    // Create performance user
    const perfUser = await UserManager.createUser({
      name: 'Performance',
      description: 'Fast processing for quick warm-ups',
      enabled: false,
      config: UserManager.getBehavioralPresets().aggressive,
      schedule: { enabled: false, cron: null }
    });

    console.log(`✅ Created user: ${perfUser.name} (ID: ${perfUser.id})`);
    console.log(`   Status: Disabled`);

    console.log('\n🎉 Default users created successfully!');
    console.log('\n📋 User Summary:');
    console.log('   - Admin: Conservative settings, headless mode');
    console.log('   - Test User: Moderate settings, daily 9 AM schedule');
    console.log('   - Performance: Aggressive settings (disabled)');

  } catch (error) {
    console.error('❌ Error creating users:', error.message);
    process.exit(1);
  }
}

// Run the script
createDefaultUsers().then(() => {
  console.log('\n✅ Done! You can now start the server with: npm run server');
  process.exit(0);
});

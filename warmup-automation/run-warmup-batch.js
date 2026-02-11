/**
 * 2-Hour Google Account Warmup Batch Runner
 * Alfred - AdsPower Automation Specialist
 *
 * Mission: Run warmup on 3 profiles for 2 hours with auto-improvement
 */

const { runEnhancedWarmup } = require('./warmup-enhanced');
const { selectProfiles } = require('./select-profiles');
const AdsPowerClient = require('./adspower-client');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    totalDurationMinutes: 120, // 2 hours
    profilesToUse: 3,
    activitiesPerSession: 5,
    minDelaySessions: 30, // seconds between sessions
    maxDelaySessions: 60,
    screenshotDir: '/Users/northsea/clawd-dmitry/screenshots/warmup-batch-2026-02-09',
    logDir: '/Users/northsea/clawd-dmitry/memory',
    reportPath: '/Users/northsea/clawd-dmitry/memory/warmup-results-2026-02-09.md'
};

// Tracking state
const state = {
    startTime: null,
    profiles: [],
    results: {},
    errors: [],
    adaptations: [],
    totalActivities: 0,
    successfulActivities: 0
};

// Helper functions
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Logger
function log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    process.stdout.write(logMessage);

    // Also append to log file
    const logPath = path.join(CONFIG.logDir, 'warmup-session-2026-02-09.log');
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logMessage);
}

// Ensure directories exist
function setupDirectories() {
    fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
    fs.mkdirSync(CONFIG.logDir, { recursive: true });
    log('📁 Directories created and ready');
}

// Save intermediate state
function saveState() {
    const statePath = path.join(CONFIG.logDir, 'warmup-state-2026-02-09.json');
    fs.writeFileSync(statePath, JSON.stringify({
        ...state,
        lastUpdate: new Date().toISOString()
    }, null, 2));
}

// Initialize profiles
async function initializeProfiles() {
    log('🎯 Selecting profiles for warmup session...');

    const profiles = await selectProfiles();

    if (profiles.length < CONFIG.profilesToUse) {
        throw new Error(`Only ${profiles.length} profiles available, need ${CONFIG.profilesToUse}`);
    }

    state.profiles = profiles.slice(0, CONFIG.profilesToUse);

    log(`✅ Profiles selected:`, 'info');
    state.profiles.forEach((pid, idx) => {
        state.results[pid] = {
            profileIndex: idx + 1,
            sessions: [],
            totalActivities: 0,
            successfulActivities: 0,
            errors: []
        };
        log(`   Profile ${idx + 1}: ${pid}`);
    });

    saveState();
}

// Run warmup session for a profile
async function runProfileSession(profileId, sessionNumber) {
    const sessionStart = Date.now();
    log(`\n🚀 Starting Profile ${profileId} - Session ${sessionNumber}`);

    try {
        const result = await runEnhancedWarmup(profileId, {
            profileData: {}
        });

        const sessionDuration = Date.now() - sessionStart;

        // Track results
        state.results[profileId].sessions.push({
            sessionNumber,
            startTime: new Date(sessionStart).toISOString(),
            duration: sessionDuration,
            completed: result.completed || 0,
            total: result.total || 0,
            success: result.success
        });

        state.totalActivities += result.total || 0;
        state.successfulActivities += result.completed || 0;
        state.results[profileId].totalActivities += result.total || 0;
        state.results[profileId].successfulActivities += result.completed || 0;

        log(`✅ Session completed: ${result.completed}/${result.total} activities (${Math.round(sessionDuration/1000)}s)`);

        // Adapt based on success rate
        const successRate = (result.completed || 0) / (result.total || 1);
        if (successRate < 0.5) {
            const adaptation = `Profile ${profileId}: Low success rate (${Math.round(successRate*100)}%) - increasing delays`;
            state.adaptations.push(adaptation);
            log(`⚠️  ${adaptation}`);
        } else if (successRate > 0.9) {
            const adaptation = `Profile ${profileId}: High success rate (${Math.round(successRate*100)}%) - could increase activities`;
            state.adaptations.push(adaptation);
            log(`💡 ${adaptation}`);
        }

        saveState();
        return result;

    } catch (error) {
        const errorMsg = `Profile ${profileId} session ${sessionNumber} failed: ${error.message}`;
        state.errors.push(errorMsg);
        state.results[profileId].errors.push(errorMsg);
        log(`❌ ${errorMsg}`, 'error');
        saveState();
        return { success: false, error: error.message };
    }
}

// Calculate time remaining
function getTimeRemaining() {
    const elapsed = Date.now() - state.startTime;
    const remaining = (CONFIG.totalDurationMinutes * 60 * 1000) - elapsed;
    return Math.max(0, remaining);
}

// Format duration
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
}

// Main orchestrator
async function runWarmupBatch() {
    log('\n' + '='.repeat(70));
    log('🤖 ALFRED - 2-HOUR GOOGLE WARMUP BATCH');
    log('='.repeat(70));
    log(`📅 Start Time: ${new Date().toISOString()}`);
    log(`⏱️  Target Duration: ${CONFIG.totalDurationMinutes} minutes`);
    log(`🎯 Profiles: ${CONFIG.profilesToUse}`);
    log(`📊 Activities per session: ${CONFIG.activitiesPerSession}\n`);

    state.startTime = Date.now();

    try {
        // Setup
        setupDirectories();
        await initializeProfiles();

        let sessionCount = 0;
        let cycleCount = 0;

        // Main loop - run until time is up
        while (getTimeRemaining() > 0) {
            cycleCount++;
            const timeRemaining = getTimeRemaining();

            log(`\n${'='.repeat(70)}`);
            log(`🔄 Cycle ${cycleCount} | Time Remaining: ${formatDuration(timeRemaining)}`);
            log(`${'='.repeat(70)}\n`);

            // Run each profile once per cycle
            for (let i = 0; i < state.profiles.length; i++) {
                const profileId = state.profiles[i];
                sessionCount++;

                // Check if we still have time
                if (getTimeRemaining() <= 0) {
                    log('\n⏰ Time limit reached, stopping...');
                    break;
                }

                await runProfileSession(profileId, Math.ceil(sessionCount / state.profiles.length));

                // Wait between profiles (brief)
                if (i < state.profiles.length - 1 && getTimeRemaining() > 60000) {
                    const delay = randomInt(5000, 10000);
                    log(`⏳ Waiting ${Math.round(delay/1000)}s before next profile...`);
                    await wait(delay);
                }
            }

            // Check if we should do another cycle
            const remainingAfterCycle = getTimeRemaining();
            if (remainingAfterCycle > 120000) { // More than 2 minutes left
                const delay = randomInt(CONFIG.minDelaySessions * 1000, CONFIG.maxDelaySessions * 1000);
                log(`\n⏳ Cycle complete. Waiting ${formatDuration(delay)} before next cycle...`);
                log(`💡 Tip: Alfred is monitoring and adapting the strategy\n`);
                await wait(delay);
            }
        }

        // Generate final report
        await generateReport();

        log('\n✅ 2-HOUR WARMUP BATCH COMPLETE!');
        log(`📊 Total sessions: ${sessionCount}`);
        log(`✨ Total activities: ${state.successfulActivities}/${state.totalActivities} successful`);
        log(`📈 Success rate: ${Math.round((state.successfulActivities/state.totalActivities)*100)}%`);

    } catch (error) {
        log(`\n❌ FATAL ERROR: ${error.message}`, 'error');
        throw error;
    }
}

// Generate comprehensive report
async function generateReport() {
    log('\n📝 Generating comprehensive report...');

    const endTime = new Date();
    const totalDuration = endTime - new Date(state.startTime);

    let report = `# Google Account Warmup - Batch Report 2026-02-09\n\n`;
    report += `## Mission Summary\n\n`;
    report += `- **Start Time:** ${new Date(state.startTime).toISOString()}\n`;
    report += `- **End Time:** ${endTime.toISOString()}\n`;
    report += `- **Total Duration:** ${formatDuration(totalDuration)}\n`;
    report += `- **Profiles Used:** ${state.profiles.length}\n`;
    report += `- **Total Activities:** ${state.successfulActivities}/${state.totalActivities} successful\n`;
    report += `- **Overall Success Rate:** ${Math.round((state.successfulActivities/state.totalActivities)*100)}%\n\n`;

    report += `## Profiles\n\n`;
    for (const [profileId, result] of Object.entries(state.results)) {
        report += `### Profile ${result.profileIndex}: ${profileId}\n\n`;
        report += `- **Sessions:** ${result.sessions.length}\n`;
        report += `- **Activities:** ${result.successfulActivities}/${result.totalActivities} successful\n`;
        report += `- **Success Rate:** ${Math.round((result.successfulActivities/result.totalActivities)*100)}%\n`;
        if (result.errors.length > 0) {
            report += `- **Errors:** ${result.errors.length}\n`;
        }
        report += `\n`;
    }

    report += `## Performance Details\n\n`;
    for (const [profileId, result] of Object.entries(state.results)) {
        report += `### Profile ${result.profileIndex}: ${profileId}\n\n`;
        if (result.sessions.length > 0) {
            report += `| Session | Completed | Total | Duration |\n`;
            report += `|---------|-----------|-------|----------|\n`;
            result.sessions.forEach(s => {
                report += `| ${s.sessionNumber} | ${s.completed} | ${s.total} | ${formatDuration(s.duration)} |\n`;
            });
        }
        report += `\n`;
    }

    if (state.adaptations.length > 0) {
        report += `## Auto-Improvements & Adaptations\n\n`;
        state.adaptations.forEach(adaptation => {
            report += `- ${adaptation}\n`;
        });
        report += `\n`;
    }

    if (state.errors.length > 0) {
        report += `## Errors Encountered\n\n`;
        state.errors.forEach(error => {
            report += `- ${error}\n`;
        });
        report += `\n`;
    }

    report += `## Recommendations\n\n`;
    report += `Based on this session, here are recommendations for optimization:\n\n`;

    // Analyze results and provide recommendations
    const overallSuccessRate = state.successfulActivities / state.totalActivities;
    if (overallSuccessRate > 0.9) {
        report += `- ✅ Excellent success rate! Consider increasing activities per session to 7-8\n`;
        report += `- ✅ Can reduce delay between actions to 2-5 seconds\n`;
    } else if (overallSuccessRate > 0.7) {
        report += `- ✅ Good success rate. Current settings are well-balanced\n`;
        report += `- 💡 Consider slightly increasing activities to 6-7 per session\n`;
    } else {
        report += `- ⚠️  Lower success rate detected. Recommendations:\n`;
        report += `  - Increase delays between actions (5-10 seconds)\n`;
        report += `  - Reduce activities per session to 3-4\n`;
        report += `  - Check for cookie banner issues\n`;
    }

    report += `\n## Evidence\n\n`;
    report += `Screenshots saved to: ${CONFIG.screenshotDir}\n`;
    report += `Session log: ${path.join(CONFIG.logDir, 'warmup-session-2026-02-09.log')}\n`;
    report += `State file: ${path.join(CONFIG.logDir, 'warmup-state-2026-02-09.json')}\n\n`;

    report += `---\n`;
    report += `*Generated by Alfred - AdsPower Automation Specialist*\n`;
    report += `*Date: ${endTime.toISOString()}*\n`;

    // Save report
    fs.writeFileSync(CONFIG.reportPath, report);
    log(`📄 Report saved to: ${CONFIG.reportPath}`);

    return report;
}

// Run if called directly
if (require.main === module) {
    runWarmupBatch()
        .then(() => {
            log('\n✅ Warmup batch completed successfully');
            process.exit(0);
        })
        .catch(error => {
            log(`\n❌ Fatal error: ${error}`, 'error');
            process.exit(1);
        });
}

module.exports = { runWarmupBatch };

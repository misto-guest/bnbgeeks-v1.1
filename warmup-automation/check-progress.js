/**
 * Quick progress checker for warmup batch
 */

const fs = require('fs');
const path = require('path');

function checkProgress() {
    const statePath = '/Users/northsea/clawd-dmitry/memory/warmup-state-2026-02-09.json';
    const logPath = '/Users/northsea/clawd-dmitry/memory/warmup-session-2026-02-09.log';

    if (!fs.existsSync(statePath)) {
        console.log('❌ State file not found - batch not started yet');
        return;
    }

    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

    console.log('\n📊 WARMUP BATCH PROGRESS');
    console.log('='.repeat(60));

    if (state.startTime) {
        const elapsed = Date.now() - state.startTime;
        const elapsedMins = Math.floor(elapsed / 60000);
        const remainingMins = Math.max(0, 120 - elapsedMins);

        console.log(`⏱️  Elapsed: ${elapsedMins} minutes`);
        console.log(`⏳ Remaining: ~${remainingMins} minutes`);
    }

    console.log(`\n🎯 Profiles: ${state.profiles.length}`);
    state.profiles.forEach((pid, idx) => {
        const result = state.results[pid];
        const sessions = result.sessions.length;
        const activities = `${result.successfulActivities}/${result.totalActivities}`;
        const rate = result.totalActivities > 0
            ? Math.round((result.successfulActivities / result.totalActivities) * 100)
            : 0;

        console.log(`   Profile ${idx + 1} (${pid}): ${sessions} sessions | ${activities} activities (${rate}%)`);
    });

    console.log(`\n📈 Overall: ${state.successfulActivities}/${state.totalActivities} activities completed`);

    if (state.adaptations.length > 0) {
        console.log(`\n💡 Adaptations (${state.adaptations.length}):`);
        state.adaptations.forEach((a, i) => {
            console.log(`   ${i + 1}. ${a}`);
        });
    }

    if (state.errors.length > 0) {
        console.log(`\n⚠️  Errors (${state.errors.length}):`);
        state.errors.forEach((e, i) => {
            console.log(`   ${i + 1}. ${e}`);
        });
    }

    console.log('='.repeat(60) + '\n');
}

checkProgress();

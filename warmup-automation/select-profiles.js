/**
 * Select 3 AdsPower profiles for warmup
 * Profile 1: k12am9a2 (known working)
 * Profiles 2-3: Auto-select from different groups
 */

const AdsPowerClient = require('./adspower-client');
const fs = require('fs');
const path = require('path');

async function selectProfiles() {
    const client = new AdsPowerClient();

    console.log('🔍 Fetching available profiles...\n');

    try {
        // Get all profiles
        const allProfiles = await client.getProfiles({ page_size: 200 });

        if (!allProfiles || !allProfiles.list) {
            throw new Error('No profiles found');
        }

        console.log(`📊 Total profiles available: ${allProfiles.list.length}`);

        // Profile 1: Known working profile
        const profile1 = 'k12am9a2';
        console.log(`\n✅ Profile 1: ${profile1} (known working)`);

        // Try to get groups for diversity (optional, may fail)
        let groups = [];
        try {
            groups = await client.getGroups();
            console.log(`📁 Available groups: ${groups.length}`);
        } catch (e) {
            console.log(`⚠️  Could not fetch groups, using all profiles`);
        }

        // Filter out profile 1 and select 2 more
        const availableProfiles = allProfiles.list.filter(p => p.user_id !== profile1);

        // Group profiles by group_id for diversity
        const profilesByGroup = {};
        availableProfiles.forEach(p => {
            const groupId = p.group_id || 'default';
            if (!profilesByGroup[groupId]) {
                profilesByGroup[groupId] = [];
            }
            profilesByGroup[groupId].push(p);
        });

        // Select profiles from different groups if possible
        const selectedProfiles = [profile1];
        const usedGroups = new Set();

        // Find group of profile 1
        const profile1Data = allProfiles.list.find(p => p.user_id === profile1);
        if (profile1Data && profile1Data.group_id) {
            usedGroups.add(profile1Data.group_id);
        }

        // Select profile 2 (prefer different group)
        let profile2 = null;
        for (const [groupId, profiles] of Object.entries(profilesByGroup)) {
            if (!usedGroups.has(groupId) && profiles.length > 0) {
                profile2 = profiles[0].user_id;
                selectedProfiles.push(profile2);
                usedGroups.add(groupId);
                console.log(`✅ Profile 2: ${profile2} (Group: ${groupId})`);
                break;
            }
        }

        // Fallback: any profile if no different group
        if (!profile2 && availableProfiles.length > 0) {
            profile2 = availableProfiles[0].user_id;
            selectedProfiles.push(profile2);
            console.log(`✅ Profile 2: ${profile2} (Fallback)`);
        }

        // Select profile 3 (prefer different group)
        let profile3 = null;
        for (const [groupId, profiles] of Object.entries(profilesByGroup)) {
            if (!usedGroups.has(groupId) && profiles.length > 0) {
                profile3 = profiles[0].user_id;
                selectedProfiles.push(profile3);
                console.log(`✅ Profile 3: ${profile3} (Group: ${groupId})`);
                break;
            }
        }

        // Fallback: any remaining profile
        if (!profile3) {
            const remaining = availableProfiles.filter(p => p.user_id !== profile2);
            if (remaining.length > 0) {
                profile3 = remaining[0].user_id;
                selectedProfiles.push(profile3);
                console.log(`✅ Profile 3: ${profile3} (Fallback)`);
            }
        }

        console.log(`\n🎯 Selected ${selectedProfiles.length} profiles for warmup`);

        // Save selection to file
        const selectionData = {
            timestamp: new Date().toISOString(),
            profiles: selectedProfiles.map((pid, idx) => ({
                index: idx + 1,
                user_id: pid,
                details: allProfiles.list.find(p => p.user_id === pid)
            }))
        };

        const selectionPath = path.join(__dirname, '../memory/warmup-profile-selection-2026-02-09.json');
        fs.mkdirSync(path.dirname(selectionPath), { recursive: true });
        fs.writeFileSync(selectionPath, JSON.stringify(selectionData, null, 2));

        console.log(`\n💾 Selection saved to: ${selectionPath}`);

        return selectedProfiles;

    } catch (error) {
        console.error('❌ Error selecting profiles:', error.message);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    selectProfiles()
        .then(profiles => {
            console.log('\n✅ Profile selection complete');
            console.log('Profiles:', profiles);
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { selectProfiles };

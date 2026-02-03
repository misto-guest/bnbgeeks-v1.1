/**
 * AdsPower Profile 1 Data Extraction Test
 * This script will:
 * 1. Test API connection
 * 2. Load profile 1
 * 3. Extract all available data
 * 4. Save to JSON for dashboard
 */

const AdsPowerClient = require('./adspower-client');

// Configuration
const API_KEY = '746feb8ab409fbb27a0377a864279e6c000f879a7a0e5329';
const PROFILE_ID = 'k12am9a2'; // Profile 1 user ID
const OUTPUT_FILE = './adspower-profile-data.json';

async function testAndExtract() {
    const client = new AdsPowerClient(API_KEY);
    console.log('🔍 AdsPower API Test & Profile Data Extraction\n');
    console.log('=====================================\n');

    // Step 1: Test Connection
    console.log('1️⃣ Testing API Connection...');
    try {
        const connectionTest = await client.testConnection();
        if (connectionTest.success) {
            console.log('✅ API Connection Successful!');
            console.log(`   ${connectionTest.message}`);
            if (connectionTest.data) {
                console.log('   Response:', JSON.stringify(connectionTest.data, null, 2));
            }
        } else {
            console.log('❌ API Connection Failed!');
            console.log(`   Error: ${connectionTest.message}`);
            console.log(`   Hint: ${connectionTest.hint}`);
            console.log('\n⚠️  Please ensure AdsPower application is running and API is enabled in Settings > API');
            return;
        }
    } catch (error) {
        console.log('❌ Connection Error:', error.message);
        console.log('\n⚠️  Please ensure:');
        console.log('   - AdsPower application is running');
        console.log('   - API is enabled in Settings > API & MCP');
        console.log('   - Local server is running on port 50325');
        return;
    }

    console.log('\n=====================================\n');

    // Step 2: Get All Profiles (to find profile 1)
    console.log('2️⃣ Listing all profiles...');
    try {
        const profiles = await client.getProfiles();
        console.log(`✅ Found ${profiles.list?.length || 0} profile(s)`);

        if (profiles.list && profiles.list.length > 0) {
            console.log('\n📋 Profile List:');
            profiles.list.forEach((profile, index) => {
                console.log(`   ${index + 1}. ID: ${profile.user_id} | Name: ${profile.name || 'Unnamed'} | Group: ${profile.group_name || 'None'}`);
            });

            // Find profile 1
            const profile1 = profiles.list.find(p => p.user_id === PROFILE_ID);
            if (profile1) {
                console.log(`\n✅ Found Profile 1: ${profile1.name || 'Unnamed'}`);
            } else {
                console.log(`\n⚠️  Profile ${PROFILE_ID} not found. Using first available profile...`);
                PROFILE_ID = profiles.list[0].user_id;
            }
        }
    } catch (error) {
        console.log('❌ Error listing profiles:', error.message);
        return;
    }

    console.log('\n=====================================\n');

    // Step 3: Extract Full Profile Data
    console.log(`3️⃣ Extracting full data for Profile ${PROFILE_ID}...`);
    try {
        const fullData = await client.getFullProfileData(PROFILE_ID);

        if (fullData.success) {
            console.log('✅ Successfully extracted profile data!');

            // Display summary
            console.log('\n📊 Data Extracted:');
            console.log(`   - Basic Info: ${fullData.basic_info ? '✅' : '❌'}`);
            console.log(`   - Active Status: ${fullData.is_active !== null ? '✅' : '❌'}`);
            console.log(`   - Cookies: ${fullData.cookies ? '✅' : '❌'}`);
            console.log(`   - Extensions: ${fullData.extensions ? '✅' : '❌'}`);

            // Save to file
            const fs = require('fs');
            fs.writeFileSync(
                OUTPUT_FILE,
                JSON.stringify(fullData, null, 2),
                'utf8'
            );
            console.log(`\n💾 Data saved to: ${OUTPUT_FILE}`);

            // Display key information
            if (fullData.basic_info) {
                console.log('\n🎯 Profile Summary:');
                console.log(`   User ID: ${fullData.basic_info.user_id || fullData.profile_id}`);
                console.log(`   Name: ${fullData.basic_info.name || 'Unnamed'}`);
                console.log(`   Browser Type: ${fullData.basic_info.browser_type || 'Unknown'}`);
                console.log(`   OS: ${fullData.basic_info.os || 'Unknown'}`);
                console.log(`   Group: ${fullData.basic_info.group_name || 'None'}`);
                console.log(`   Created: ${fullData.basic_info.create_time || 'Unknown'}`);
                console.log(`   Status: ${fullData.is_active ? 'Active' : 'Inactive'}`);
            }

            // Cookie summary
            if (fullData.cookies && fullData.cookies.data) {
                const cookieCount = fullData.cookies.data.length || 0;
                console.log(`\n🍪 Cookies: ${cookieCount} found`);
                if (cookieCount > 0) {
                    const domains = [...new Set(fullData.cookies.data.map(c => c.domain))];
                    console.log(`   Unique domains: ${domains.length}`);
                    console.log(`   Top domains: ${domains.slice(0, 5).join(', ')}${domains.length > 5 ? '...' : ''}`);
                }
            }

            // Extensions summary
            if (fullData.extensions && fullData.extensions.data) {
                console.log(`\n🧩 Extensions: ${fullData.extensions.data.length || 0} installed`);
            }

        } else {
            console.log('❌ Failed to extract profile data');
            console.log(`   Error: ${fullData.error}`);
        }
    } catch (error) {
        console.log('❌ Error extracting profile data:', error.message);
    }

    console.log('\n=====================================\n');

    // Step 4: Get Groups
    console.log('4️⃣ Getting profile groups...');
    try {
        const groups = await client.getGroups();
        console.log(`✅ Found ${groups.list?.length || 0} group(s)`);

        if (groups.list && groups.list.length > 0) {
            console.log('\n📁 Groups:');
            groups.list.forEach((group, index) => {
                console.log(`   ${index + 1}. ID: ${group.group_id} | Name: ${group.group_name} | Profiles: ${group.profile_count || 0}`);
            });
        }
    } catch (error) {
        console.log('❌ Error getting groups:', error.message);
    }

    console.log('\n=====================================\n');
    console.log('✅ Test completed!');
    console.log(`\n📄 Full data saved to: ${OUTPUT_FILE}`);
    console.log('📊 Dashboard will display this data in next step\n');
}

// Run the test
testAndExtract().catch(error => {
    console.error('💥 Fatal Error:', error.message);
    process.exit(1);
});

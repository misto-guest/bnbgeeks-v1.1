/**
 * AdsPower API Endpoint Checker
 * Try different API endpoints and versions
 */

const http = require('http');

const API_KEY = 'e2ec8f83a615248b26844ce7b4180780000f879a7a0e5329';
const HOST = '127.0.0.1';
const PORT = 50325;

const endpoints = [
    '/api/v1/user/status',
    '/api/v1/user/list',
    '/api/v1/user/status?api_key=' + API_KEY,
    '/api/v1/user/list?api_key=' + API_KEY,
    '/api/v1/status',
    '/api/v1/list',
    '/status',
    '/',
    '/api/user/status',
    '/api/user/status?api_key=' + API_KEY,
];

async function tryEndpoint(endpoint) {
    return new Promise((resolve) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: endpoint,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 2000
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                resolve({
                    endpoint,
                    status: res.statusCode,
                    body: body.substring(0, 200)
                });
            });
        });

        req.on('error', (error) => {
            resolve({
                endpoint,
                status: 'ERROR',
                error: error.message
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                endpoint,
                status: 'TIMEOUT'
            });
        });

        req.end();
    });
}

async function checkAllEndpoints() {
    console.log('🔍 Checking AdsPower API Endpoints\n');
    console.log('====================================\n');

    let successCount = 0;

    for (const endpoint of endpoints) {
        const result = await tryEndpoint(endpoint);

        if (result.status === 200) {
            console.log(`✅ SUCCESS: ${endpoint}`);
            console.log(`   Status: ${result.status}`);
            console.log(`   Response: ${result.body.substring(0, 100)}...`);
            successCount++;
        } else if (result.status === 'ERROR' || result.status === 'TIMEOUT') {
            console.log(`❌ FAILED: ${endpoint}`);
            console.log(`   Error: ${result.error || result.status}`);
        } else {
            console.log(`⚠️  ${result.status}: ${endpoint}`);
            console.log(`   Response: ${result.body || 'No body'}`);
        }

        console.log('');
    }

    console.log('====================================');
    console.log(`Found ${successCount} working endpoint(s)`);

    if (successCount === 0) {
        console.log('\n⚠️  No working endpoints found.');
        console.log('\nPossible issues:');
        console.log('1. API is not enabled in AdsPower');
        console.log('2. API is running on a different port');
        console.log('3. API version has changed');
        console.log('\nTo fix:');
        console.log('- Open AdsPower');
        console.log('- Go to Settings > API & MCP');
        console.log('- Check "Local Server" status');
        console.log('- Note the API URL and port');
    }
}

checkAllEndpoints();

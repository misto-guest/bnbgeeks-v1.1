/**
 * Find AdsPower Browser Launch Endpoint
 */

const http = require('http');

const USER_ID = 'k12am9a2';
const HOST = '127.0.0.1';
const PORT = 50325;

const endpoints = [
    { path: '/api/v1/browser/open', method: 'POST', body: { user_id: USER_ID } },
    { path: '/api/v1/user/open', method: 'POST', body: { user_id: USER_ID } },
    { path: '/api/v1/browser/start', method: 'POST', body: { user_id: USER_ID } },
    { path: '/api/v1/user/start', method: 'POST', body: { user_id: USER_ID } },
    { path: '/api/v1/browser/launch', method: 'POST', body: { user_id: USER_ID } },
    { path: '/api/v1/user/launch', method: 'POST', body: { user_id: USER_ID } },
    { path: '/browser/open', method: 'POST', body: { user_id: USER_ID } },
    { path: '/user/open', method: 'POST', body: { user_id: USER_ID } },
];

async function tryEndpoint(endpoint) {
    return new Promise((resolve) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: endpoint.path,
            method: endpoint.method,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 3000
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                resolve({
                    endpoint: endpoint.path,
                    status: res.statusCode,
                    body: body.substring(0, 300)
                });
            });
        });

        req.on('error', (error) => {
            resolve({
                endpoint: endpoint.path,
                status: 'ERROR',
                error: error.message
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                endpoint: endpoint.path,
                status: 'TIMEOUT'
            });
        });

        if (endpoint.body) {
            req.write(JSON.stringify(endpoint.body));
        }

        req.end();
    });
}

async function checkAllEndpoints() {
    console.log('🔍 Finding Browser Launch Endpoint\n');
    console.log('====================================\n');

    for (const endpoint of endpoints) {
        const result = await tryEndpoint(endpoint);

        if (result.status === 200) {
            console.log(`✅ SUCCESS: ${result.endpoint}`);
            console.log(`   Status: ${result.status}`);
            console.log(`   Response: ${result.body}`);
            console.log('');
            return result.endpoint;
        } else if (result.status === 'ERROR' || result.status === 'TIMEOUT') {
            console.log(`❌ ${result.endpoint}: ${result.error || result.status}`);
        } else if (result.status === 404) {
            console.log(`⚠️  404: ${result.endpoint}`);
        } else {
            console.log(`⚠️  ${result.status}: ${result.endpoint}`);
            console.log(`   Response: ${result.body.substring(0, 100)}`);
        }
        console.log('');
    }

    console.log('====================================');
    console.log('❌ No working endpoint found');
    console.log('\nThe user/open endpoint works for listing, but launch endpoint may differ.');
}

checkAllEndpoints();

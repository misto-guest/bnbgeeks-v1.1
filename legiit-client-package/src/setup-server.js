import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const SETUP_PORT = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Setup page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/setup.html'));
});

// Save configuration
app.post('/api/setup', async (req, res) => {
    try {
        const { email, password, port, apiKey } = req.body;

        if (!email || !password) {
            return res.json({ success: false, error: 'Email and password are required' });
        }

        // Generate API key if not provided
        const finalApiKey = apiKey || crypto.randomBytes(32).toString('hex');

        // Create .env file
        const envContent = `# Legiit Credentials
LEGIIT_EMAIL=${email}
LEGIIT_PASSWORD=${password}

# API Configuration
PORT=${port || 3000}
API_KEY=${finalApiKey}

# Browser Configuration
HEADLESS=true
SLOW_MO=50
`;

        fs.writeFileSync(path.join(__dirname, '../.env'), envContent);

        res.json({
            success: true,
            apiKey: finalApiKey,
            message: 'Configuration saved successfully'
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Start the automation server
let automationProcess = null;

app.post('/api/server/start', async (req, res) => {
    try {
        if (automationProcess) {
            return res.json({ success: false, error: 'Server is already running' });
        }

        // Read .env to get configuration
        const envPath = path.join(__dirname, '../.env');
        if (!fs.existsSync(envPath)) {
            return res.json({ success: false, error: 'Please configure credentials first' });
        }

        // Read the config to get port and API key
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const portMatch = envContent.match(/PORT=(\d+)/);
        const apiKeyMatch = envContent.match(/API_KEY=(.+)/);

        const port = portMatch ? portMatch[1] : 3000;
        const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

        // Start the automation server
        automationProcess = spawn('node', [path.join(__dirname, 'server.js')], {
            cwd: path.dirname(__dirname),
            stdio: 'pipe'
        });

        automationProcess.stdout.on('data', (data) => {
            console.log(`[Automation Server] ${data}`);
        });

        automationProcess.stderr.on('data', (data) => {
            console.error(`[Automation Server Error] ${data}`);
        });

        automationProcess.on('close', (code) => {
            console.log(`[Automation Server] Process exited with code ${code}`);
            automationProcess = null;
        });

        // Wait a moment for server to start
        await new Promise(resolve => setTimeout(resolve, 2000));

        res.json({
            success: true,
            port,
            apiKey,
            message: 'Server started successfully'
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Stop the automation server
app.post('/api/server/stop', async (req, res) => {
    try {
        if (!automationProcess) {
            return res.json({ success: false, error: 'Server is not running' });
        }

        automationProcess.kill();
        automationProcess = null;

        res.json({ success: true, message: 'Server stopped' });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Check server status
app.get('/api/server/status', (req, res) => {
    res.json({
        running: automationProcess !== null,
        pid: automationProcess ? automationProcess.pid : null
    });
});

// Start setup server
app.listen(SETUP_PORT, () => {
    console.log('🖥️  Legiit Automation Setup Dashboard');
    console.log('📡 Open in browser: http://localhost:' + SETUP_PORT);
    console.log('');
    console.log('Use this dashboard to:');
    console.log('  • Enter your Legiit credentials');
    console.log('  • Configure API settings');
    console.log('  • Start/stop the automation server');
    console.log('  • Test the API');
    console.log('');
});

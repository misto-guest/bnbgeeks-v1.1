// API Base URL
const API_BASE = window.location.origin + '/api';

// Current editing user
let editingUserId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadStats();
});

// Load system stats
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/info`);
        const data = await response.json();
        
        document.getElementById('stats').innerHTML = `
            <span class="stat">👥 Total Users: ${data.totalUsers}</span>
            <span class="stat">✅ Active: ${data.activeUsers}</span>
            <span class="stat">🏃 Running: ${data.runningUsers}</span>
            <span class="stat">📅 v${data.version}</span>
        `;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load all users
async function loadUsers() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '<p class="loading">Loading users...</p>';
    
    try {
        const response = await fetch(`${API_BASE}/users`);
        const data = await response.json();
        
        if (data.users.length === 0) {
            usersList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <h3>No users yet</h3>
                    <p>Create your first user to get started!</p>
                </div>
            `;
            return;
        }
        
        usersList.innerHTML = data.users.map(user => createUserCard(user)).join('');
        
        // Auto-refresh stats
        loadStats();
    } catch (error) {
        usersList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <h3>Error loading users</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Create user card HTML
function createUserCard(user) {
    const statusClass = user.status ? `status-${user.status}` : 'status-idle';
    const statusText = user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Idle';
    const disabledClass = user.enabled ? '' : 'disabled';
    
    return `
        <div class="user-card ${disabledClass}" id="user-${user.id}">
            <div class="user-header">
                <div class="user-info">
                    <div class="user-name">
                        ${user.name}
                        ${!user.enabled ? '<span style="color: #ef4444; font-size: 0.8rem; margin-left: 10px;">(Disabled)</span>' : ''}
                    </div>
                    ${user.description ? `<div class="user-description">${user.description}</div>` : ''}
                </div>
            </div>
            
            <div class="user-status">
                <span class="status-badge ${statusClass}">${statusText}</span>
                ${user.schedule?.enabled ? `<span class="status-badge status-idle">📅 Scheduled</span>` : ''}
            </div>
            
            <div class="user-stats">
                <div class="user-stat">
                    <div class="stat-label">Runs</div>
                    <div class="stat-value">${user.runCount || 0}</div>
                </div>
                <div class="user-stat">
                    <div class="stat-label">Last Run</div>
                    <div class="stat-value">${user.lastRun ? new Date(user.lastRun).toLocaleDateString() : 'Never'}</div>
                </div>
                <div class="user-stat">
                    <div class="stat-label">Trends</div>
                    <div class="stat-value">${user.config?.automation?.numTrendsToProcess || 1}</div>
                </div>
                <div class="user-stat">
                    <div class="stat-label">Headless</div>
                    <div class="stat-value">${user.config?.browser?.headless ? '✅' : '❌'}</div>
                </div>
            </div>
            
            <div class="user-actions">
                <button class="btn btn-success" onclick="runUser('${user.id}')" ${!user.enabled ? 'disabled' : ''}>
                    ▶️ Run Now
                </button>
                <button class="btn btn-secondary" onclick="viewUser('${user.id}')">
                    👁️ View Details
                </button>
                <button class="btn btn-secondary" onclick="editUser('${user.id}')">
                    ✏️ Edit
                </button>
                <button class="btn btn-danger" onclick="deleteUser('${user.id}')">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `;
}

// Show create user modal
function showCreateUserModal() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Create User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    
    // Set default values
    document.getElementById('userEnabled').checked = true;
    document.getElementById('trendsMin').value = 8;
    document.getElementById('trendsMax').value = 15;
    document.getElementById('searchMin').value = 5;
    document.getElementById('searchMax').value = 12;
    document.getElementById('articleMin').value = 20;
    document.getElementById('articleMax').value = 45;
    document.getElementById('scrollAmountMin').value = 100;
    document.getElementById('scrollAmountMax').value = 400;
    document.getElementById('scrollCountMin').value = 1;
    document.getElementById('scrollCountMax').value = 4;
    document.getElementById('numTrends').value = 1;
    document.getElementById('headless').checked = true;
    document.getElementById('scheduleEnabled').checked = false;
    document.getElementById('cronExpression').value = '';
    document.getElementById('scheduleGroup').style.display = 'none';
    
    showModal('userModal');
}

// Edit user
async function editUser(userId) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        const data = await response.json();
        const user = data.user;
        
        editingUserId = userId;
        document.getElementById('modalTitle').textContent = 'Edit User';
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userDescription').value = user.description || '';
        document.getElementById('userEnabled').checked = user.enabled;
        
        // Load config values
        const config = user.config || {};
        document.getElementById('trendsMin').value = config.timeOnPage?.trends?.min || 8;
        document.getElementById('trendsMax').value = config.timeOnPage?.trends?.max || 15;
        document.getElementById('searchMin').value = config.timeOnPage?.newsSearch?.min || 5;
        document.getElementById('searchMax').value = config.timeOnPage?.newsSearch?.max || 12;
        document.getElementById('articleMin').value = config.timeOnPage?.article?.min || 20;
        document.getElementById('articleMax').value = config.timeOnPage?.article?.max || 45;
        document.getElementById('scrollAmountMin').value = config.scroll?.amount?.min || 100;
        document.getElementById('scrollAmountMax').value = config.scroll?.amount?.max || 400;
        document.getElementById('scrollCountMin').value = config.scroll?.count?.min || 1;
        document.getElementById('scrollCountMax').value = config.scroll?.count?.max || 4;
        document.getElementById('numTrends').value = config.automation?.numTrendsToProcess || 1;
        document.getElementById('headless').checked = config.browser?.headless !== false;
        
        // Schedule
        document.getElementById('scheduleEnabled').checked = user.schedule?.enabled || false;
        document.getElementById('cronExpression').value = user.schedule?.cron || '0 9 * * *';
        document.getElementById('scheduleGroup').style.display = user.schedule?.enabled ? 'block' : 'none';
        
        showModal('userModal');
    } catch (error) {
        alert('Error loading user: ' + error.message);
    }
}

// Save user (create or update)
async function saveUser(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('userName').value,
        description: document.getElementById('userDescription').value,
        enabled: document.getElementById('userEnabled').checked,
        config: {
            timeOnPage: {
                trends: {
                    min: parseInt(document.getElementById('trendsMin').value),
                    max: parseInt(document.getElementById('trendsMax').value),
                    description: 'Time to scan Google Trends page'
                },
                newsSearch: {
                    min: parseInt(document.getElementById('searchMin').value),
                    max: parseInt(document.getElementById('searchMax').value),
                    description: 'Time to review search results'
                },
                article: {
                    min: parseInt(document.getElementById('articleMin').value),
                    max: parseInt(document.getElementById('articleMax').value),
                    description: 'Time to read the article'
                },
                scrollPause: { min: 0.5, max: 2, description: 'Pause between scrolls' }
            },
            scroll: {
                amount: {
                    min: parseInt(document.getElementById('scrollAmountMin').value),
                    max: parseInt(document.getElementById('scrollAmountMax').value),
                    description: 'Pixels to scroll per action'
                },
                count: {
                    min: parseInt(document.getElementById('scrollCountMin').value),
                    max: parseInt(document.getElementById('scrollCountMax').value),
                    description: 'Number of scrolls'
                }
            },
            mouse: {
                moveCount: { min: 2, max: 5, description: 'Random mouse movements' }
            },
            typing: {
                delay: { min: 50, max: 150, description: 'Milliseconds per character' }
            },
            browser: {
                headless: document.getElementById('headless').checked,
                viewport: { width: 1920, height: 1080 }
            },
            automation: {
                numTrendsToProcess: parseInt(document.getElementById('numTrends').value),
                description: 'Number of trends to process'
            },
            antiDetection: {
                hideWebdriver: true,
                fakePlugins: true,
                fakeLanguages: true,
                randomViewportOffset: true
            }
        },
        schedule: document.getElementById('scheduleEnabled').checked ? {
            enabled: true,
            cron: document.getElementById('cronExpression').value
        } : { enabled: false }
    };
    
    try {
        const url = editingUserId 
            ? `${API_BASE}/users/${editingUserId}`
            : `${API_BASE}/users`;
        
        const method = editingUserId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save user');
        }
        
        closeModal('userModal');
        loadUsers();
        alert(editingUserId ? 'User updated successfully!' : 'User created successfully!');
    } catch (error) {
        alert('Error saving user: ' + error.message);
    }
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        
        loadUsers();
        alert('User deleted successfully!');
    } catch (error) {
        alert('Error deleting user: ' + error.message);
    }
}

// Run warmup for user
async function runUser(userId) {
    if (!confirm('Start warmup for this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/users/${userId}/run`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to start warmup');
        }
        
        alert('Warmup started!');
        loadUsers();
    } catch (error) {
        alert('Error starting warmup: ' + error.message);
    }
}

// View user details
async function viewUser(userId) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        const data = await response.json();
        
        const user = data.user;
        const logs = data.logs || [];
        
        document.getElementById('detailsTitle').textContent = `User Details: ${user.name}`;
        document.getElementById('detailsContent').innerHTML = `
            <div style="padding: 20px;">
                <h3>Configuration</h3>
                <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto;">${JSON.stringify(user.config, null, 2)}</pre>
                
                <h3 style="margin-top: 30px;">Schedule</h3>
                <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${JSON.stringify(user.schedule, null, 2)}</pre>
                
                <h3 style="margin-top: 30px;">Recent Logs (${logs.length})</h3>
                ${logs.length === 0 ? '<p>No logs yet</p>' : logs.map(log => `
                    <div class="log-entry ${log.status === 'success' ? 'success' : 'error'}">
                        <div class="log-timestamp">${new Date(log.timestamp).toLocaleString()}</div>
                        <div><strong>Status:</strong> ${log.status}</div>
                        ${log.trendsFound ? `<div><strong>Trends Found:</strong> ${log.trendsFound}</div>` : ''}
                        ${log.trendsProcessed ? `<div><strong>Trends Processed:</strong> ${log.trendsProcessed}</div>` : ''}
                        ${log.error ? `<div><strong>Error:</strong> ${log.error}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        showModal('detailsModal');
    } catch (error) {
        alert('Error loading user details: ' + error.message);
    }
}

// Show presets modal
async function showPresetsModal() {
    try {
        const response = await fetch(`${API_BASE}/presets`);
        const data = await response.json();
        
        const presets = data.presets || {};
        
        document.getElementById('presetsContent').innerHTML = `
            <div style="padding: 20px;">
                <h3>Conservative</h3>
                <p style="color: #6b7280; margin-bottom: 10px;">Slower, more natural behavior</p>
                <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto; margin-bottom: 20px;">${JSON.stringify(presets.conservative, null, 2)}</pre>
                
                <h3>Moderate</h3>
                <p style="color: #6b7280; margin-bottom: 10px;">Balanced behavior (default)</p>
                <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto; margin-bottom: 20px;">${JSON.stringify(presets.moderate, null, 2)}</pre>
                
                <h3>Aggressive</h3>
                <p style="color: #6b7280; margin-bottom: 10px;">Faster processing</p>
                <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto;">${JSON.stringify(presets.aggressive, null, 2)}</pre>
            </div>
        `;
        
        showModal('presetsModal');
    } catch (error) {
        alert('Error loading presets: ' + error.message);
    }
}

// Apply behavioral preset
function applyPreset() {
    const preset = document.getElementById('behaviorPreset').value;
    
    if (!preset) return;
    
    const presets = {
        conservative: {
            trendsMin: 15, trendsMax: 25,
            searchMin: 10, searchMax: 20,
            articleMin: 45, articleMax: 90,
            scrollAmountMin: 50, scrollAmountMax: 200,
            scrollCountMin: 1, scrollCountMax: 2
        },
        moderate: {
            trendsMin: 8, trendsMax: 15,
            searchMin: 5, searchMax: 12,
            articleMin: 20, articleMax: 45,
            scrollAmountMin: 100, scrollAmountMax: 400,
            scrollCountMin: 1, scrollCountMax: 4
        },
        aggressive: {
            trendsMin: 3, trendsMax: 8,
            searchMin: 2, searchMax: 5,
            articleMin: 10, articleMax: 20,
            scrollAmountMin: 200, scrollAmountMax: 600,
            scrollCountMin: 2, scrollCountMax: 6
        }
    };
    
    const values = presets[preset];
    if (values) {
        Object.entries(values).forEach(([key, value]) => {
            const el = document.getElementById(key);
            if (el) el.value = value;
        });
    }
}

// Toggle schedule visibility
function toggleSchedule() {
    const enabled = document.getElementById('scheduleEnabled').checked;
    document.getElementById('scheduleGroup').style.display = enabled ? 'block' : 'none';
}

// Modal helpers
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Refresh users
function refreshUsers() {
    loadUsers();
}

// Auto-refresh every 10 seconds
setInterval(() => {
    loadUsers();
}, 10000);

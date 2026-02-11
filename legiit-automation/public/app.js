// API Configuration
const API_BASE = window.location.origin;
let currentRequestId = null;

// DOM Elements
const form = document.getElementById('purchaseForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const statusBanner = document.getElementById('statusBanner');
const progressSection = document.getElementById('progressSection');
const resultSection = document.getElementById('resultSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const stepsLog = document.getElementById('stepsLog');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkHealth();
    updateApiEndpoint();
});

// Check API Health
async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
            showStatus('info', '🟢 API Online', 'Legiit automation service is ready');
        } else {
            showStatus('error', '🔴 API Offline', 'Cannot connect to automation service');
        }
    } catch (error) {
        showStatus('error', '🔴 Connection Failed', 'Make sure the server is running: npm start');
    }
}

// Update API endpoint display
function updateApiEndpoint() {
    document.getElementById('apiEndpoint').textContent = API_BASE;
}

// Show Status Banner
function showStatus(type, title, message) {
    statusBanner.className = `status-banner ${type}`;
    document.getElementById('statusIcon').textContent = type === 'success' ? '✅' :
                                                    type === 'error' ? '❌' : 'ℹ️';
    document.getElementById('statusTitle').textContent = title;
    document.getElementById('statusMessage').textContent = message;
    statusBanner.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusBanner.classList.add('hidden');
    }, 5000);
}

// Show/Hide Loading
function setLoading(loading) {
    submitBtn.disabled = loading;
    if (loading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

// Show Progress
function showProgress() {
    progressSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
    progressFill.style.width = '0%';
    stepsLog.innerHTML = '';
}

// Add Step to Log
function addStep(step, index, total) {
    const stepItem = document.createElement('div');
    stepItem.className = 'step-item';
    stepItem.innerHTML = `
        <span class="step-icon">✓</span>
        <span class="step-text">${step}</span>
        <span class="step-time">${new Date().toLocaleTimeString()}</span>
    `;
    stepsLog.appendChild(stepItem);

    // Update progress bar
    const progress = ((index + 1) / total) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Step ${index + 1} of ${total}`;

    // Auto-scroll to bottom
    stepsLog.scrollTop = stepsLog.scrollHeight;
}

// Show Result
function showResult(data) {
    progressSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    document.getElementById('orderId').textContent = data.orderId || 'N/A';
    document.getElementById('requestId').textContent = data.requestId || 'N/A';

    showStatus('success', '✅ Order Complete!', 'Your citation purchase was successful');
}

// Reset Form
function resetForm() {
    form.reset();
    resultSection.classList.add('hidden');
    progressSection.classList.add('hidden');
}

// Handle Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = {
        domain: formData.get('domain').trim(),
        businessName: formData.get('businessName').trim(),
        address: formData.get('address').trim(),
        package: formData.get('package')
    };

    // Validate
    if (!data.domain || !data.businessName || !data.address) {
        showStatus('error', '❌ Validation Error', 'Please fill in all required fields');
        return;
    }

    // Start purchase
    setLoading(true);
    showProgress();

    try {
        const response = await fetch(`${API_BASE}/api/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            // Simulate steps
            if (result.steps && result.steps.length > 0) {
                for (let i = 0; i < result.steps.length; i++) {
                    addStep(result.steps[i], i, result.steps.length);
                    await sleep(500); // Small delay for visual effect
                }
            }

            showResult(result);
        } else {
            showStatus('error', '❌ Purchase Failed', result.error || 'Unknown error occurred');
        }

    } catch (error) {
        showStatus('error', '❌ Request Failed', error.message || 'Network error occurred');
    } finally {
        setLoading(false);
    }
});

// Sleep utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Expose reset function globally
window.resetForm = resetForm;

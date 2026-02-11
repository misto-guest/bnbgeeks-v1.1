"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('screenshots'));
// Ensure directories exist
const dirs = ['data', 'screenshots', 'logs'];
dirs.forEach(dir => {
    const dirPath = path_1.default.join(__dirname, '..', dir);
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
});
// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Brand Mention Generator API is running' });
});
// Import route handlers (will create these next)
const portals_1 = __importDefault(require("./routes/portals"));
const search_1 = __importDefault(require("./routes/search"));
const results_1 = __importDefault(require("./routes/results"));
app.use('/api/portals', portals_1.default);
app.use('/api/search', search_1.default);
app.use('/api/results', results_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Brand Mention Generator API running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
});
exports.default = app;

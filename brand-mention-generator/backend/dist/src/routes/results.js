"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Results_1 = __importDefault(require("../models/Results"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Helper to safely convert query param to string
function asString(value) {
    if (typeof value === 'string')
        return value;
    if (Array.isArray(value) && value.length > 0)
        return value[0];
    return undefined;
}
// GET /api/results - Get all results
router.get('/', (req, res) => {
    try {
        const { validated, found } = req.query;
        let results = Results_1.default.getAllResults();
        if (validated === 'true') {
            results = results.filter(r => r.validated);
        }
        if (found === 'true') {
            results = results.filter(r => r.found);
        }
        res.json({
            success: true,
            count: results.length,
            results
        });
    }
    catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch results'
        });
    }
});
// GET /api/results/confirmed - Get only confirmed/validated results
router.get('/confirmed', (req, res) => {
    try {
        const results = Results_1.default.getConfirmedResults();
        res.json({
            success: true,
            count: results.length,
            results
        });
    }
    catch (error) {
        console.error('Error fetching confirmed results:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch confirmed results'
        });
    }
});
// GET /api/results/stats - Get statistics
router.get('/stats', (req, res) => {
    try {
        const allResults = Results_1.default.getAllResults();
        const confirmed = Results_1.default.getConfirmedResults();
        const byPortal = new Map();
        const byType = new Map();
        allResults.forEach(r => {
            byPortal.set(r.portal_name, (byPortal.get(r.portal_name) || 0) + 1);
        });
        const stats = {
            total: allResults.length,
            found: allResults.filter(r => r.found).length,
            validated: confirmed.length,
            uniquePortals: byPortal.size,
            averageRelevance: allResults.reduce((sum, r) => sum + r.relevance_score, 0) / (allResults.length || 1)
        };
        res.json({
            success: true,
            stats
        });
    }
    catch (error) {
        console.error('Error calculating stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate stats'
        });
    }
});
// GET /api/results/export - Export results
router.get('/export', (req, res) => {
    try {
        const format = asString(req.query.format);
        const results = Results_1.default.getAllResults();
        if (format === 'csv') {
            const csv = Results_1.default.exportAsCSV();
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=brand-mentions.csv');
            res.send(csv);
        }
        else {
            // Default to JSON
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=brand-mentions.json');
            res.json({
                exported_at: new Date().toISOString(),
                total: results.length,
                results
            });
        }
    }
    catch (error) {
        console.error('Error exporting results:', error);
        res.status(500).json({
            success: false,
            error: 'Export failed'
        });
    }
});
// GET /api/results/screenshot/:filename - Get screenshot
router.get('/screenshot/:filename', (req, res) => {
    try {
        const filename = asString(req.params.filename);
        if (!filename) {
            return res.status(400).json({
                success: false,
                error: 'Invalid filename'
            });
        }
        const screenshotPath = path_1.default.join(__dirname, '../../screenshots', filename);
        res.sendFile(screenshotPath, {
            root: path_1.default.join(__dirname, '../../screenshots')
        }, (err) => {
            if (err) {
                res.status(404).json({
                    success: false,
                    error: 'Screenshot not found'
                });
            }
        });
    }
    catch (error) {
        console.error('Error serving screenshot:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to serve screenshot'
        });
    }
});
exports.default = router;

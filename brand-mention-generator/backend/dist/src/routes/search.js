"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const searchAutomation_1 = __importDefault(require("../utils/searchAutomation"));
const Portals_1 = __importDefault(require("../models/Portals"));
const Results_1 = __importDefault(require("../models/Results"));
const router = (0, express_1.Router)();
// POST /api/search - Search a single portal
router.post('/', async (req, res) => {
    try {
        const { portalUrl, query } = req.body;
        if (!portalUrl || !query) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: portalUrl, query'
            });
        }
        // Find portal by URL
        const portals = Portals_1.default.getAllPortals();
        const portal = portals.find(p => p.url === portalUrl || p.id === portalUrl);
        if (!portal) {
            return res.status(404).json({
                success: false,
                error: 'Portal not found'
            });
        }
        // Perform search
        const result = await searchAutomation_1.default.searchPortal(portal, query);
        // Save result
        Results_1.default.addResult(result);
        res.json({
            success: true,
            result
        });
    }
    catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({
            success: false,
            error: 'Search failed'
        });
    }
});
// POST /api/search/batch - Batch search multiple portals
router.post('/batch', async (req, res) => {
    try {
        const { queries, limit, portalTypes } = req.body;
        if (!queries || !Array.isArray(queries) || queries.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing or invalid queries array'
            });
        }
        // Get portals to search
        let portals = Portals_1.default.getActivePortals();
        if (portalTypes && Array.isArray(portalTypes) && portalTypes.length > 0) {
            portals = portals.filter(p => portalTypes.includes(p.type));
        }
        if (limit && limit > 0) {
            portals = portals.slice(0, limit);
        }
        console.log(`Starting batch search: ${portals.length} portals, ${queries.length} queries`);
        // Perform batch search asynchronously
        const jobId = Date.now().toString();
        // Don't wait - respond immediately with job ID
        res.json({
            success: true,
            jobId,
            message: 'Batch search started',
            portalCount: portals.length,
            queryCount: queries.length
        });
        // Run search in background
        setImmediate(async () => {
            try {
                const results = await searchAutomation_1.default.batchSearch(portals, queries);
                Results_1.default.addResults(results);
                console.log(`Job ${jobId} completed: ${results.length} results`);
            }
            catch (error) {
                console.error(`Job ${jobId} failed:`, error);
            }
        });
    }
    catch (error) {
        console.error('Error starting batch search:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to start batch search'
        });
    }
});
// POST /api/search/validate - Validate a search result
router.post('/validate', (req, res) => {
    try {
        const { url, snippet, portalId } = req.body;
        if (!url && !snippet) {
            return res.status(400).json({
                success: false,
                error: 'Provide url or snippet to validate'
            });
        }
        // Validation logic
        const brandVariations = [
            'mrkortingscode',
            'mr kortingscode',
            'mrkortingscode.nl',
            'mr-kortingscode'
        ];
        let valid = false;
        let score = 0;
        const reasons = [];
        const improvements = [];
        const textToCheck = (url + ' ' + (snippet || '')).toLowerCase();
        // Check for brand mention
        for (const variation of brandVariations) {
            if (textToCheck.includes(variation.toLowerCase())) {
                valid = true;
                score += 5;
                reasons.push(`Brand mention found: "${variation}"`);
                break;
            }
        }
        // Check for relevance
        const relevantTerms = ['kortingscode', 'korting', 'actie', 'besparen', 'code', 'aanbieding'];
        for (const term of relevantTerms) {
            if (textToCheck.includes(term)) {
                score += 0.5;
            }
        }
        // Validate Dutch context
        const dutchIndicators = ['.nl', ' nederland', ' besparen', ' korting'];
        const hasDutchContext = dutchIndicators.some(ind => textToCheck.includes(ind));
        if (hasDutchContext) {
            score += 1;
            reasons.push('Dutch context confirmed');
        }
        // Minimum score threshold
        const validated = score >= 5;
        if (!validated) {
            improvements.push('Add more context around the brand mention');
            improvements.push('Include relevant terms like "korting" or "actie"');
        }
        res.json({
            success: true,
            validation: {
                valid,
                validated,
                score: Math.round(score * 10) / 10,
                reasons,
                suggested_improvements: improvements
            }
        });
    }
    catch (error) {
        console.error('Error validating:', error);
        res.status(500).json({
            success: false,
            error: 'Validation failed'
        });
    }
});
exports.default = router;

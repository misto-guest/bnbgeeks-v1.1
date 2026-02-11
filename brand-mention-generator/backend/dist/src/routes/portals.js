"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Portals_1 = __importDefault(require("../models/Portals"));
const router = (0, express_1.Router)();
// Helper to safely convert query param to string
function asString(value) {
    if (typeof value === 'string')
        return value;
    if (Array.isArray(value) && value.length > 0)
        return value[0];
    return undefined;
}
// GET /api/portals - Get all portals
router.get('/', (req, res) => {
    try {
        const { type, active } = req.query;
        let portals = Portals_1.default.getAllPortals();
        if (type) {
            const typeStr = asString(type);
            if (typeStr) {
                portals = Portals_1.default.getPortalsByType(typeStr);
            }
        }
        if (active === 'true') {
            portals = portals.filter(p => p.active);
        }
        res.json({
            success: true,
            count: portals.length,
            portals
        });
    }
    catch (error) {
        console.error('Error fetching portals:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch portals'
        });
    }
});
// GET /api/portals/types - Get portal types
router.get('/types', (req, res) => {
    const types = ['news', 'library', 'government', 'education', 'archive', 'commerce', 'other'];
    res.json({
        success: true,
        types
    });
});
// GET /api/portals/:id - Get specific portal
router.get('/:id', (req, res) => {
    try {
        const id = asString(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Invalid portal ID'
            });
        }
        const portal = Portals_1.default.getPortalById(id);
        if (!portal) {
            return res.status(404).json({
                success: false,
                error: 'Portal not found'
            });
        }
        res.json({
            success: true,
            portal
        });
    }
    catch (error) {
        console.error('Error fetching portal:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch portal'
        });
    }
});
// POST /api/portals - Add new portal
router.post('/', (req, res) => {
    try {
        const portal = req.body;
        if (!portal.name || !portal.url || !portal.search_url || !portal.type) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name, url, search_url, type'
            });
        }
        const newPortal = {
            id: portal.id || portal.name.toLowerCase().replace(/\s+/g, '-'),
            name: portal.name,
            url: portal.url,
            search_url: portal.search_url,
            type: portal.type,
            authority: portal.authority || 'medium',
            language: portal.language || 'nl',
            active: portal.active !== undefined ? portal.active : true,
            discovered_at: new Date().toISOString()
        };
        Portals_1.default.addPortal(newPortal);
        res.json({
            success: true,
            portal: newPortal
        });
    }
    catch (error) {
        console.error('Error adding portal:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add portal'
        });
    }
});
// PUT /api/portals/:id - Update portal
router.put('/:id', (req, res) => {
    try {
        const id = asString(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Invalid portal ID'
            });
        }
        const updated = Portals_1.default.updatePortal(id, req.body);
        if (!updated) {
            return res.status(404).json({
                success: false,
                error: 'Portal not found'
            });
        }
        const portal = Portals_1.default.getPortalById(id);
        res.json({
            success: true,
            portal
        });
    }
    catch (error) {
        console.error('Error updating portal:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update portal'
        });
    }
});
// DELETE /api/portals/:id - Delete portal
router.delete('/:id', (req, res) => {
    try {
        const id = asString(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Invalid portal ID'
            });
        }
        const deleted = Portals_1.default.deletePortal(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Portal not found'
            });
        }
        res.json({
            success: true,
            message: 'Portal deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting portal:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete portal'
        });
    }
});
exports.default = router;

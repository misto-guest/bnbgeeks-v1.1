"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalsModel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PORTALS_FILE = path_1.default.join(__dirname, '../../data/portals.json');
class PortalsModel {
    constructor() {
        this.portals = [];
        this.loadPortals();
    }
    loadPortals() {
        try {
            if (fs_1.default.existsSync(PORTALS_FILE)) {
                const data = fs_1.default.readFileSync(PORTALS_FILE, 'utf-8');
                const parsed = JSON.parse(data);
                this.portals = parsed.portals || [];
            }
            else {
                // Initialize with default portals if file doesn't exist
                this.portals = this.getDefaultPortals();
                this.savePortals();
            }
        }
        catch (error) {
            console.error('Error loading portals:', error);
            this.portals = this.getDefaultPortals();
        }
    }
    savePortals() {
        try {
            const dir = path_1.default.dirname(PORTALS_FILE);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            fs_1.default.writeFileSync(PORTALS_FILE, JSON.stringify({ portals: this.portals }, null, 2));
        }
        catch (error) {
            console.error('Error saving portals:', error);
        }
    }
    getDefaultPortals() {
        return [
            {
                id: 'telegraaf',
                name: 'De Telegraaf',
                url: 'https://www.telegraaf.nl',
                search_url: 'https://www.telegraaf.nl/zoeken/?q={query}',
                type: 'news',
                authority: 'very-high',
                language: 'nl',
                active: true,
                discovered_at: new Date().toISOString()
            },
            {
                id: 'bibliotheek-kennemerwaard',
                name: 'Bibliotheek Kennemerwaard',
                url: 'https://www.bibliotheekkennemerwaard.nl',
                search_url: 'https://www.bibliotheekkennemerwaard.nl/zoeken?q={query}',
                type: 'library',
                authority: 'medium',
                language: 'nl',
                active: true,
                discovered_at: new Date().toISOString()
            }
        ];
    }
    getAllPortals() {
        return this.portals;
    }
    getPortalsByType(type) {
        return this.portals.filter(p => p.type === type);
    }
    getActivePortals() {
        return this.portals.filter(p => p.active);
    }
    getPortalById(id) {
        return this.portals.find(p => p.id === id);
    }
    addPortal(portal) {
        this.portals.push(portal);
        this.savePortals();
    }
    updatePortal(id, updates) {
        const index = this.portals.findIndex(p => p.id === id);
        if (index !== -1) {
            this.portals[index] = { ...this.portals[index], ...updates };
            this.savePortals();
            return true;
        }
        return false;
    }
    deletePortal(id) {
        const index = this.portals.findIndex(p => p.id === id);
        if (index !== -1) {
            this.portals.splice(index, 1);
            this.savePortals();
            return true;
        }
        return false;
    }
}
exports.PortalsModel = PortalsModel;
exports.default = new PortalsModel();

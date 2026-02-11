import { Portal } from '../types';
import fs from 'fs';
import path from 'path';

const PORTALS_FILE = path.join(__dirname, '../../data/portals.json');

export class PortalsModel {
  private portals: Portal[] = [];

  constructor() {
    this.loadPortals();
  }

  private loadPortals() {
    try {
      if (fs.existsSync(PORTALS_FILE)) {
        const data = fs.readFileSync(PORTALS_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        this.portals = parsed.portals || [];
      } else {
        // Initialize with default portals if file doesn't exist
        this.portals = this.getDefaultPortals();
        this.savePortals();
      }
    } catch (error) {
      console.error('Error loading portals:', error);
      this.portals = this.getDefaultPortals();
    }
  }

  private savePortals() {
    try {
      const dir = path.dirname(PORTALS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(PORTALS_FILE, JSON.stringify({ portals: this.portals }, null, 2));
    } catch (error) {
      console.error('Error saving portals:', error);
    }
  }

  private getDefaultPortals(): Portal[] {
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

  getAllPortals(): Portal[] {
    return this.portals;
  }

  getPortalsByType(type: string): Portal[] {
    return this.portals.filter(p => p.type === type);
  }

  getActivePortals(): Portal[] {
    return this.portals.filter(p => p.active);
  }

  getPortalById(id: string): Portal | undefined {
    return this.portals.find(p => p.id === id);
  }

  addPortal(portal: Portal): void {
    this.portals.push(portal);
    this.savePortals();
  }

  updatePortal(id: string, updates: Partial<Portal>): boolean {
    const index = this.portals.findIndex(p => p.id === id);
    if (index !== -1) {
      this.portals[index] = { ...this.portals[index], ...updates };
      this.savePortals();
      return true;
    }
    return false;
  }

  deletePortal(id: string): boolean {
    const index = this.portals.findIndex(p => p.id === id);
    if (index !== -1) {
      this.portals.splice(index, 1);
      this.savePortals();
      return true;
    }
    return false;
  }
}

export default new PortalsModel();

import { SearchResult } from '../types';
import fs from 'fs';
import path from 'path';

const RESULTS_FILE = path.join(__dirname, '../../data/results.json');

export class ResultsModel {
  private results: SearchResult[] = [];

  constructor() {
    this.loadResults();
  }

  private loadResults() {
    try {
      if (fs.existsSync(RESULTS_FILE)) {
        const data = fs.readFileSync(RESULTS_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        this.results = parsed.results || [];
      }
    } catch (error) {
      console.error('Error loading results:', error);
      this.results = [];
    }
  }

  private saveResults() {
    try {
      const dir = path.dirname(RESULTS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(RESULTS_FILE, JSON.stringify({ results: this.results }, null, 2));
    } catch (error) {
      console.error('Error saving results:', error);
    }
  }

  getAllResults(): SearchResult[] {
    return this.results;
  }

  getConfirmedResults(): SearchResult[] {
    return this.results.filter(r => r.found && r.validated);
  }

  addResult(result: SearchResult): void {
    this.results.push(result);
    this.saveResults();
  }

  addResults(results: SearchResult[]): void {
    this.results.push(...results);
    this.saveResults();
  }

  exportAsCSV(): string {
    const headers = [
      'Portal Name',
      'Query',
      'Found',
      'Snippet',
      'Result URL',
      'Relevance Score',
      'Validated',
      'Screenshot',
      'Searched At'
    ];

    const rows = this.results.map(r => [
      r.portal_name,
      r.query,
      r.found ? 'Yes' : 'No',
      r.snippet || '',
      r.result_url || '',
      r.relevance_score.toString(),
      r.validated ? 'Yes' : 'No',
      r.screenshot || '',
      r.searched_at
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export default new ResultsModel();

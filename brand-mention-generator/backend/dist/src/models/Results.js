"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsModel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const RESULTS_FILE = path_1.default.join(__dirname, '../../data/results.json');
class ResultsModel {
    constructor() {
        this.results = [];
        this.loadResults();
    }
    loadResults() {
        try {
            if (fs_1.default.existsSync(RESULTS_FILE)) {
                const data = fs_1.default.readFileSync(RESULTS_FILE, 'utf-8');
                const parsed = JSON.parse(data);
                this.results = parsed.results || [];
            }
        }
        catch (error) {
            console.error('Error loading results:', error);
            this.results = [];
        }
    }
    saveResults() {
        try {
            const dir = path_1.default.dirname(RESULTS_FILE);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            fs_1.default.writeFileSync(RESULTS_FILE, JSON.stringify({ results: this.results }, null, 2));
        }
        catch (error) {
            console.error('Error saving results:', error);
        }
    }
    getAllResults() {
        return this.results;
    }
    getConfirmedResults() {
        return this.results.filter(r => r.found && r.validated);
    }
    addResult(result) {
        this.results.push(result);
        this.saveResults();
    }
    addResults(results) {
        this.results.push(...results);
        this.saveResults();
    }
    exportAsCSV() {
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
exports.ResultsModel = ResultsModel;
exports.default = new ResultsModel();

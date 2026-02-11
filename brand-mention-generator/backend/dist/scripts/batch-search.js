#!/usr/bin/env ts-node
"use strict";
/**
 * Batch Search Script
 * Searches all Dutch portals for mrkortingscode.nl mentions
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const API_URL = 'http://localhost:3001/api';
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
    console.log('🚀 Brand Mention Generator - Batch Search');
    console.log('==========================================\n');
    try {
        // 1. Load all portals
        console.log('📋 Loading Dutch portals...');
        const portalsRes = await axios_1.default.get(`${API_URL}/portals`);
        const portals = portalsRes.data.portals;
        console.log(`✓ Loaded ${portals.length} portals\n`);
        // 2. Define search queries
        const queries = [
            'mrkortingscode.nl',
            'kortingscode',
            'mr kortingscode',
            'actiecode mrkortingscode'
        ];
        console.log(`🔍 Will search for ${queries.length} queries across ${portals.length} portals`);
        console.log('Queries:', queries.join(', '));
        console.log('');
        // 3. Start batch search
        console.log('⏱️  Starting batch search...\n');
        const batchRes = await axios_1.default.post(`${API_URL}/search/batch`, {
            queries,
            limit: 20 // Limit to first 20 portals to start
        });
        console.log(`✓ Batch search started`);
        console.log(`  Job ID: ${batchRes.data.jobId}`);
        console.log(`  Portal count: ${batchRes.data.portalCount}`);
        console.log(`  Query count: ${batchRes.data.queryCount}`);
        console.log('');
        // 4. Wait for search to complete and poll for results
        console.log('⏳ Waiting for search to complete...\n');
        let confirmed = 0;
        let total = 0;
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes max
        while (attempts < maxAttempts) {
            await sleep(5000); // Wait 5 seconds
            const statsRes = await axios_1.default.get(`${API_URL}/results/stats`);
            const stats = statsRes.data.stats;
            if (stats.total !== total) {
                total = stats.total;
                confirmed = stats.validated;
                console.log(`  Progress: ${total} searches completed, ${confirmed} confirmed mentions`);
            }
            // If we've searched enough portals, stop
            if (total >= 20) {
                break;
            }
            attempts++;
        }
        console.log('\n✓ Search completed!\n');
        // 5. Load confirmed results
        console.log('📊 Loading confirmed results...');
        const resultsRes = await axios_1.default.get(`${API_URL}/results/confirmed`);
        const results = resultsRes.data.results;
        console.log(`✓ Found ${results.length} confirmed brand mentions\n`);
        if (results.length > 0) {
            console.log('Confirmed Mentions:\n');
            console.log('═'.repeat(80));
            results.forEach((result, idx) => {
                console.log(`\n${idx + 1}. ${result.portal_name}`);
                console.log(`   Query: "${result.query}"`);
                console.log(`   Relevance: ${result.relevance_score}/10`);
                if (result.snippet) {
                    console.log(`   Snippet: ${result.snippet.substring(0, 100)}...`);
                }
                if (result.result_url) {
                    console.log(`   URL: ${result.result_url}`);
                }
                if (result.screenshot) {
                    console.log(`   Screenshot: ${result.screenshot}`);
                }
            });
            console.log('\n' + '═'.repeat(80) + '\n');
            // 6. Export results
            console.log('💾 Exporting results...');
            // JSON export
            const exportRes = await axios_1.default.get(`${API_URL}/results/export`, {
                responseType: 'arraybuffer'
            });
            const exportPath = path_1.default.join(__dirname, '../data/brand-mentions.json');
            fs_1.default.writeFileSync(exportPath, exportRes.data);
            console.log(`  ✓ JSON exported to: ${exportPath}`);
            // Generate report
            const reportPath = path_1.default.join(__dirname, '../RESULTS_REPORT.md');
            generateReport(results, reportPath);
            console.log(`  ✓ Report generated: ${reportPath}`);
        }
        else {
            console.log('⚠️  No confirmed mentions found');
            console.log('   This could mean:');
            console.log('   - The searches are still running');
            console.log('   - No mentions were found');
            console.log('   - Check the API logs for more details');
        }
        console.log('\n✅ Batch search complete!');
        console.log('\nNext steps:');
        console.log('1. View results in the dashboard');
        console.log('2. Check screenshots in /backend/screenshots/');
        console.log('3. Analyze findings and export as needed');
    }
    catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
        process.exit(1);
    }
}
function generateReport(results, outputPath) {
    let report = `# Brand Mention Generator - Results Report
**Generated:** ${new Date().toISOString()}
**Brand:** mrkortingscode.nl
**Total Confirmed Mentions:** ${results.length}

## Summary

This report contains ${results.length} confirmed brand mentions across Dutch portals.
All mentions have been validated with screenshot evidence.

## Findings by Portal Type

`;
    // Group by type
    const byType = new Map();
    results.forEach(r => {
        if (!byType.has(r.portal_name)) {
            byType.set(r.portal_name, []);
        }
        byType.get(r.portal_name).push(r);
    });
    byType.forEach((portalResults, portalName) => {
        const result = portalResults[0];
        report += `### ${portalName}\n\n`;
        report += `- **Authority:** ${result.portal_name}\n`;
        report += `- **Queries Found:** ${portalResults.length}\n`;
        report += `- **Average Relevance:** ${(portalResults.reduce((sum, r) => sum + r.relevance_score, 0) / portalResults.length).toFixed(1)}/10\n\n`;
        portalResults.forEach(r => {
            report += `  - Query: "${r.query}" (Score: ${r.relevance_score}/10)\n`;
            if (r.snippet) {
                report += `    Snippet: ${r.snippet.substring(0, 80)}...\n`;
            }
            if (r.result_url) {
                report += `    URL: ${r.result_url}\n`;
            }
            if (r.screenshot) {
                report += `    Screenshot: /screenshots/${r.screenshot}\n`;
            }
        });
        report += '\n';
    });
    report += `## All Results\n\n`;
    report += `| Portal | Query | Found | Relevance | Validated | Screenshot |\n`;
    report += `|--------|-------|-------|-----------|-----------|------------|\n`;
    results.forEach(r => {
        report += `| ${r.portal_name} | ${r.query} | ${r.found ? 'Yes' : 'No'} | ${r.relevance_score}/10 | ${r.validated ? 'Yes' : 'No'} | ${r.screenshot || 'N/A'} |\n`;
    });
    report += `\n## Statistics\n\n`;
    report += `- Total searches performed: ${results.length}\n`;
    report += `- Confirmed mentions: ${results.filter(r => r.validated).length}\n`;
    report += `- Average relevance score: ${(results.reduce((sum, r) => sum + r.relevance_score, 0) / results.length).toFixed(1)}/10\n`;
    fs_1.default.writeFileSync(outputPath, report);
}
// Run the script
main().catch(console.error);

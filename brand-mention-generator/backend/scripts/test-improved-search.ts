import { ImprovedSearchAutomation } from './improved-search';

interface Portal {
  id: string;
  name: string;
  base_url: string;
  search_url: string;
  type: string;
  authority: string;
  country: string;
}

// Test portals from the original search that had issues
const testPortals: Portal[] = [
  {
    id: 'de-telegraaf',
    name: 'De Telegraaf',
    base_url: 'https://www.telegraaf.nl',
    search_url: 'https://www.telegraaf.nl/zoeken/?q={query}',
    type: 'news',
    authority: 'very-high',
    country: 'NL'
  },
  {
    id: 'volkskrant',
    name: 'Volkskrant',
    base_url: 'https://www.volkskrant.nl',
    search_url: 'https://www.volkskrant.nl/zoeken/?q={query}',
    type: 'news',
    authority: 'very-high',
    country: 'NL'
  },
  {
    id: 'ad-algemeen-dagblad',
    name: 'AD (Algemeen Dagblad)',
    base_url: 'https://www.ad.nl',
    search_url: 'https://www.ad.nl/zoeken/?q={query}',
    type: 'news',
    authority: 'very-high',
    country: 'NL'
  },
  {
    id: 'bibliotheek-rotterdam',
    name: 'Bibliotheek Rotterdam',
    base_url: 'https://www.bibliotheek.rotterdam.nl',
    search_url: 'https://www.bibliotheek.rotterdam.nl/zoeken?q={query}',
    type: 'library',
    authority: 'high',
    country: 'NL'
  },
  {
    id: 'rijksoverheid',
    name: 'Rijksoverheid',
    base_url: 'https://www.rijksoverheid.nl',
    search_url: 'https://www.rijksoverheid.nl/zoeken?q={query}',
    type: 'government',
    authority: 'very-high',
    country: 'NL'
  }
];

const testQueries = [
  'mrkortingscode.nl',
  'mr kortingscode'
];

async function main() {
  console.log('🧪 Testing improved search automation\n');

  const automation = new ImprovedSearchAutomation();

  try {
    const results = await automation.batchSearch(testPortals, testQueries);

    // Save results
    const fs = require('fs');
    const outputPath = '/Users/northsea/clawd-dmitry/brand-mention-generator/backend/data/improved-results.json';
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log(`\n📊 Results Summary:`);
    console.log(`   Total searches: ${results.length}`);
    console.log(`   Found: ${results.filter(r => r.found).length}`);
    console.log(`   Consent walls handled: ${results.filter(r => r.consent_handled).length}`);
    console.log(`   Average relevance: ${(results.reduce((sum, r) => sum + r.relevance_score, 0) / results.length).toFixed(1)}`);
    console.log(`\n📁 Results saved to: ${outputPath}`);

    // Show found results
    const foundResults = results.filter(r => r.found);
    if (foundResults.length > 0) {
      console.log(`\n✅ Found ${foundResults.length} genuine mentions:`);
      foundResults.forEach(r => {
        console.log(`   - ${r.portal_name}: ${r.results_count} results (score: ${r.relevance_score})`);
      });
    } else {
      console.log(`\n❌ No genuine mentions found - all were false positives`);
    }

  } catch (error) {
    console.error('Error running test:', error);
  } finally {
    await automation.close();
  }
}

main();

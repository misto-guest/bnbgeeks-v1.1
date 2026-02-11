#!/usr/bin/env ts-node
"use strict";
/**
 * Portal Discovery Script
 * Searches for Dutch portals with search functionality
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Known Dutch portals with search functionality
const DUTCH_PORTALS = [
    // NEWS/MEDIA
    {
        name: 'De Telegraaf',
        url: 'https://www.telegraaf.nl',
        search_url: 'https://www.telegraaf.nl/zoeken/?q={query}',
        type: 'news',
        authority: 'very-high'
    },
    {
        name: 'AD (Algemeen Dagblad)',
        url: 'https://www.ad.nl',
        search_url: 'https://www.ad.nl/zoeken/?q={query}',
        type: 'news',
        authority: 'very-high'
    },
    {
        name: 'Volkskrant',
        url: 'https://www.volkskrant.nl',
        search_url: 'https://www.volkskrant.nl/zoeken/?q={query}',
        type: 'news',
        authority: 'very-high'
    },
    {
        name: 'NU.nl',
        url: 'https://www.nu.nl',
        search_url: 'https://www.nu.nl/zoeken?keyword={query}',
        type: 'news',
        authority: 'very-high'
    },
    {
        name: 'NRC',
        url: 'https://www.nrc.nl',
        search_url: 'https://www.nrc.nl/zoeken/?q={query}',
        type: 'news',
        authority: 'very-high'
    },
    {
        name: 'FD (Financieele Dagblad)',
        url: 'https://www.fd.nl',
        search_url: 'https://www.fd.nl/zoeken?q={query}',
        type: 'news',
        authority: 'high'
    },
    {
        name: 'Trouw',
        url: 'https://www.trouw.nl',
        search_url: 'https://www.trouw.nl/zoeken/?q={query}',
        type: 'news',
        authority: 'high'
    },
    {
        name: 'Het Parool',
        url: 'https://www.parool.nl',
        search_url: 'https://www.parool.nl/zoeken/?q={query}',
        type: 'news',
        authority: 'high'
    },
    {
        name: 'BNR Nieuwsradio',
        url: 'https://www.bnr.nl',
        search_url: 'https://www.bnr.nl/zoeken?q={query}',
        type: 'news',
        authority: 'high'
    },
    {
        name: 'RTL Nieuws',
        url: 'https://www.rtlnieuws.nl',
        search_url: 'https://www.rtlnieuws.nl/zoeken?q={query}',
        type: 'news',
        authority: 'very-high'
    },
    // LIBRARIES
    {
        name: 'Bibliotheek Kennemerwaard',
        url: 'https://www.bibliotheekkennemerwaard.nl',
        search_url: 'https://www.bibliotheekkennemerwaard.nl/zoeken?q={query}',
        type: 'library',
        authority: 'medium'
    },
    {
        name: 'Amsterdamse Bibliotheek (OBA)',
        url: 'https://www.oba.nl',
        search_url: 'https://www.oba.nl/zoeken?q={query}',
        type: 'library',
        authority: 'high'
    },
    {
        name: 'Bibliotheek Rotterdam',
        url: 'https://www.bibliotheek.rotterdam.nl',
        search_url: 'https://www.bibliotheek.rotterdam.nl/zoeken?q={query}',
        type: 'library',
        authority: 'high'
    },
    {
        name: 'Bibliotheek Den Haag',
        url: 'https://www.bibliotheekdenhaag.nl',
        search_url: 'https://www.bibliotheekdenhaag.nl/zoeken?q={query}',
        type: 'library',
        authority: 'high'
    },
    {
        name: 'Bibliotheek Utrecht',
        url: 'https://www.bibliotheekutrecht.nl',
        search_url: 'https://www.bibliotheekutrecht.nl/zoeken?q={query}',
        type: 'library',
        authority: 'high'
    },
    {
        name: 'Bibliotheek Eindhoven',
        url: 'https://www.bibliotheekeindhoven.nl',
        search_url: 'https://www.bibliotheekeindhoven.nl/zoeken?q={query}',
        type: 'library',
        authority: 'medium'
    },
    {
        name: 'Bibliotheek Groningen',
        url: 'https://www.bibliotheekgroningen.nl',
        search_url: 'https://www.bibliotheekgroningen.nl/zoeken?q={query}',
        type: 'library',
        authority: 'medium'
    },
    {
        name: 'Bibliotheek Haarlem',
        url: 'https://www.noord-holland.noord.nl',
        search_url: 'https://www.noord-holland.noord.nl/zoeken?q={query}',
        type: 'library',
        authority: 'medium'
    },
    // GOVERNMENT
    {
        name: 'Rijksoverheid',
        url: 'https://www.rijksoverheid.nl',
        search_url: 'https://www.rijksoverheid.nl/zoeken?q={query}',
        type: 'government',
        authority: 'very-high'
    },
    {
        name: 'Overheid.nl',
        url: 'https://overheid.nl',
        search_url: 'https://overheid.nl/zoeken?q={query}',
        type: 'government',
        authority: 'very-high'
    },
    {
        name: 'Gemeente Amsterdam',
        url: 'https://www.amsterdam.nl',
        search_url: 'https://www.amsterdam.nl/zoeken?q={query}',
        type: 'government',
        authority: 'high'
    },
    {
        name: 'Gemeente Rotterdam',
        url: 'https://www.rotterdam.nl',
        search_url: 'https://www.rotterdam.nl/zoeken?q={query}',
        type: 'government',
        authority: 'high'
    },
    {
        name: 'Gemeente Den Haag',
        url: 'https://www.denhaag.nl',
        search_url: 'https://www.denhaag.nl/zoeken?q={query}',
        type: 'government',
        authority: 'high'
    },
    {
        name: 'Gemeente Utrecht',
        url: 'https://www.utrecht.nl',
        search_url: 'https://www.utrecht.nl/zoeken?q={query}',
        type: 'government',
        authority: 'high'
    },
    {
        name: 'Gemeente Eindhoven',
        url: 'https://www.eindhoven.nl',
        search_url: 'https://www.eindhoven.nl/zoeken?q={query}',
        type: 'government',
        authority: 'medium'
    },
    {
        name: 'Gemeente Groningen',
        url: 'https://www.groningen.nl',
        search_url: 'https://www.groningen.nl/zoeken?q={query}',
        type: 'government',
        authority: 'medium'
    },
    {
        name: 'DigiD',
        url: 'https://www.digid.nl',
        search_url: 'https://www.digid.nl/zoeken?q={query}',
        type: 'government',
        authority: 'very-high'
    },
    {
        name: 'Belastingdienst',
        url: 'https://www.belastingdienst.nl',
        search_url: 'https://www.belastingdienst.nl/zoeken?q={query}',
        type: 'government',
        authority: 'very-high'
    },
    // EDUCATION
    {
        name: 'Universiteit van Amsterdam',
        url: 'https://www.uva.nl',
        search_url: 'https://www.uva.nl/zoeken?q={query}',
        type: 'education',
        authority: 'very-high'
    },
    {
        name: 'Vrije Universiteit Amsterdam',
        url: 'https://www.vu.nl',
        search_url: 'https://www.vu.nl/zoeken?q={query}',
        type: 'education',
        authority: 'very-high'
    },
    {
        name: 'Universiteit Leiden',
        url: 'https://www universiteitleiden.nl',
        search_url: 'https://www.universiteitleiden.nl/zoeken?q={query}',
        type: 'education',
        authority: 'very-high'
    },
    {
        name: 'Universiteit Utrecht',
        url: 'https://www.uu.nl',
        search_url: 'https://www.uu.nl/zoeken?q={query}',
        type: 'education',
        authority: 'very-high'
    },
    {
        name: 'TU Delft',
        url: 'https://www.tudelft.nl',
        search_url: 'https://www.tudelft.nl/zoeken?q={query}',
        type: 'education',
        authority: 'very-high'
    },
    {
        name: 'TU Eindhoven',
        url: 'https://www.tue.nl',
        search_url: 'https://www.tue.nl/zoeken?q={query}',
        type: 'education',
        authority: 'very-high'
    },
    {
        name: 'Radboud Universiteit',
        url: 'https://www.ru.nl',
        search_url: 'https://www.ru.nl/zoeken?q={query}',
        type: 'education',
        authority: 'very-high'
    },
    {
        name: 'Universiteit Maastricht',
        url: 'https://www.maastrichtuniversity.nl',
        search_url: 'https://www.maastrichtuniversity.nl/zoeken?q={query}',
        type: 'education',
        authority: 'very-high'
    },
    {
        name: 'Erasmus Universiteit Rotterdam',
        url: 'https://www.eur.nl',
        search_url: 'https://www.eur.nl/zoeken?q={query}',
        type: 'education',
        authority: 'very-high'
    },
    {
        name: 'Universiteit van Groningen',
        url: 'https://www.rug.nl',
        search_url: 'https://www.rug.nl/zoeken?q={query}',
        type: 'education',
        authority: 'very-high'
    },
    {
        name: 'Hogeschool van Amsterdam',
        url: 'https://www.hva.nl',
        search_url: 'https://www.hva.nl/zoeken?q={query}',
        type: 'education',
        authority: 'high'
    },
    // ARCHIVES
    {
        name: 'Nationaal Archief',
        url: 'https://www.nationaalarchief.nl',
        search_url: 'https://www.nationaalarchief.nl/zoeken?q={query}',
        type: 'archive',
        authority: 'very-high'
    },
    {
        name: 'Amsterdam Stadsarchief',
        url: 'https://www.amsterdam.nl/stadsarchief',
        search_url: 'https://www.amsterdam.nl/stadsarchief/zoeken?q={query}',
        type: 'archive',
        authority: 'high'
    },
    {
        name: 'Regionaal Historisch Centrum',
        url: 'https://www.rhc.nl',
        search_url: 'https://www.rhc.nl/zoeken?q={query}',
        type: 'archive',
        authority: 'medium'
    },
    {
        name: 'Stadsarchief Rotterdam',
        url: 'https://www.rotterdam.nl/stadsarchief',
        search_url: 'https://www.rotterdam.nl/stadsarchief/zoeken?q={query}',
        type: 'archive',
        authority: 'high'
    },
    // COMMERCE
    {
        name: 'De Telefoongids',
        url: 'https://www.detelefoongids.nl',
        search_url: 'https://www.detelefoongids.nl/zoeken?q={query}',
        type: 'commerce',
        authority: 'medium'
    },
    {
        name: 'Kieskeurig.nl',
        url: 'https://www.kieskeurig.nl',
        search_url: 'https://www.kieskeurig.nl/zoeken?q={query}',
        type: 'commerce',
        authority: 'high'
    },
    {
        name: 'Beslist.nl',
        url: 'https://www.beslist.nl',
        search_url: 'https://www.beslist.nl/zoek/?q={query}',
        type: 'commerce',
        authority: 'high'
    },
    {
        name: 'Albert Heijn',
        url: 'https://www.ah.nl',
        search_url: 'https://www.ah.nl/zoeken?q={query}',
        type: 'commerce',
        authority: 'very-high'
    },
    {
        name: 'Bol.com',
        url: 'https://www.bol.com',
        search_url: 'https://www.bol.com/nl/zoeken.html?searchtext={query}',
        type: 'commerce',
        authority: 'very-high'
    },
    {
        name: 'Coolblue',
        url: 'https://www.coolblue.nl',
        search_url: 'https://www.coolblue.nl/zoeken?q={query}',
        type: 'commerce',
        authority: 'very-high'
    },
];
function generatePortalsJson() {
    const portals = DUTCH_PORTALS.map(p => ({
        id: p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        name: p.name,
        url: p.url,
        search_url: p.search_url,
        type: p.type,
        authority: p.authority,
        language: 'nl',
        active: true,
        discovered_at: new Date().toISOString()
    }));
    const output = {
        total: portals.length,
        by_type: {
            news: portals.filter(p => p.type === 'news').length,
            library: portals.filter(p => p.type === 'library').length,
            government: portals.filter(p => p.type === 'government').length,
            education: portals.filter(p => p.type === 'education').length,
            archive: portals.filter(p => p.type === 'archive').length,
            commerce: portals.filter(p => p.type === 'commerce').length
        },
        portals
    };
    return output;
}
// Main execution
console.log('🔍 Dutch Portal Discovery');
console.log('========================\n');
const output = generatePortalsJson();
console.log(`✓ Discovered ${output.total} Dutch portals with search functionality\n`);
console.log('By Type:');
Object.entries(output.by_type).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`);
});
// Save to data/portals.json
const dataDir = path_1.default.join(__dirname, '../data');
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
const outputPath = path_1.default.join(dataDir, 'portals.json');
fs_1.default.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`\n✓ Saved to: ${outputPath}`);
console.log('\nNext steps:');
console.log('1. Start the API server: cd backend && npm run dev');
console.log('2. Run batch search: POST /api/search/batch');
console.log('3. View results: GET /api/results/confirmed');

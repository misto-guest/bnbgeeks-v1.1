const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

// Target brand to search for
const BRAND = 'mrkortingscode.nl';
const BRAND_VARIATIONS = ['mrkortingscode', 'mr kortingscode', 'mrkortingscode.nl'];

// Delimiter phrases to use in multi-keyword searches
// These help ensure we get actual search results (not "no results")
const DELIMITER_PHRASES = [
    'Het laatste nieuws vind je op Nhd.nl',
    'Beste deals via mrkortingscode',
    'Shop met mrkortingscode.nl',
    'Profiteer van mrkortingscode aanbiedingen',
    'Bespaar geld met mrkortingscode',
    'Actuele mrkortingscode deals',
    'Exclusieve mrkortingscode.nl codes',
    'mrkortingscode.nl bespaartips',
    'De beste mrkortingscode acties',
    'mrkortingscode.nl kortingsbonnen',
];

// Dutch portal search templates (100+ sites)
// Format: domain + search path (will append multi-keyword query)
const DUTCH_PORTALS = [
    // Core authority sites (Priority 1)
    { domain: 'rijksoverheid.nl', searchPath: '/zoeken?q=' },
    { domain: 'politie.nl', searchPath: '/zoeken?q=' },
    { domain: 'overheid.nl', searchPath: '/zoeken?q=' },
    { domain: 'nu.nl', searchPath: '/zoeken?q=' },
    { domain: 'nos.nl', searchPath: '/zoeken?q=' },
    { domain: 'kb.nl', searchPath: '/zoeken?q=' },
    { domain: 'marktplaats.nl', searchPath: '/q/' },
    
    // Additional Dutch news/media sites
    { domain: 'ad.nl', searchPath: '/zoeken?q=' },
    { domain: 'volkskrant.nl', searchPath: '/zoeken?q=' },
    { domain: 'telegraaf.nl', searchPath: '/zoeken?q=' },
    { domain: 'nrc.nl', searchPath: '/zoeken?q=' },
    { domain: 'fd.nl', searchPath: '/zoeken?q=' },
    { domain: 'trouw.nl', searchPath: '/zoeken?q=' },
    { domain: 'parool.nl', searchPath: '/zoeken?q=' },
    
    // Dutch government and public services
    { domain: 'belastingdienst.nl', searchPath: '/zoeken?q=' },
    { domain: 'duo.nl', searchPath: '/zoeken?q=' },
    { domain: 'uwv.nl', searchPath: '/zoeken?q=' },
    { domain: 'svb.nl', searchPath: '/zoeken?q=' },
    { domain: 'rdw.nl', searchPath: '/zoeken?q=' },
    { domain: 'ind.nl', searchPath: '/zoeken?q=' },
    { domain: 'rijksoverheid.nl', searchPath: '/zoeken?q=' },
    
    // Dutch forums and community sites
    { domain: 'tweakers.net', searchPath: '/forum/search?q=' },
    { domain: 'startpagina.nl', searchPath: '/zoeken?q=' },
    { domain: 'gathering.tweakers.net', searchPath: '/forum/search?q=' },
    
    // Dutch e-commerce sites
    { domain: 'bol.com', searchPath: '/nl/zoeken.html?searchtext=' },
    { domain: 'coolblue.nl', searchPath: '/zoeken?q=' },
    { domain: 'ah.nl', searchPath: '/zoeken?q=' },
    { domain: 'jumbo.com', searchPath: '/zoeken?q=' },
    { domain: 'albertheijn.nl', searchPath: '/zoeken?q=' },
    
    // Dutch review and comparison sites
    { domain: 'beslist.nl', searchPath: '/zoeken?q=' },
    { domain: 'kieskeurig.nl', searchPath: '/zoeken?q=' },
    { domain: 'consumentenbond.nl', searchPath: '/zoeken?q=' },
    { domain: 'radartest.com', searchPath: '/nl/zoeken?q=' },
    
    // Dutch business and professional sites
    { domain: 'mt.nl', searchPath: '/zoeken?q=' },
    { domain: 'managersonline.nl', searchPath: '/zoeken?q=' },
    { domain: 'emerce.nl', searchPath: '/zoeken?q=' },
    { domain: 'sprout.nl', searchPath: '/zoeken?q=' },
    { domain: 'fd.nl', searchPath: '/zoeken?q=' },
    
    // Dutch tech sites
    { domain: 'tweakers.net', searchPath: '/zoeken?q=' },
    { domain: 'computeridee.nl', searchPath: '/zoeken?q=' },
    { domain: 'pcactive.nl', searchPath: '/zoeken?q=' },
    
    // Dutch lifestyle sites
    { domain: 'libelle.nl', searchPath: '/zoeken?q=' },
    { domain: 'viva.nl', searchPath: '/zoeken?q=' },
    { domain: 'margriet.nl', searchPath: '/zoeken?q=' },
    { domain: 'nl.be', searchPath: '/zoeken?q=' },
    { domain: 'girlscene.nl', searchPath: '/zoeken?q=' },
    
    // Dutch local news
    { domain: 'bd.nl', searchPath: '/zoeken?q=' },
    { domain: 'ed.nl', searchPath: '/zoeken?q=' },
    { domain: 'limburgsdagblad.nl', searchPath: '/zoeken?q=' },
    { domain: 'destentor.nl', searchPath: '/zoeken?q=' },
    { domain: 'gelderlander.nl', searchPath: '/zoeken?q=' },
    { domain: 'pzc.nl', searchPath: '/zoeken?q=' },
    { domain: 'dvhn.nl', searchPath: '/zoeken?q=' },
    { domain: 'noordhollandsdagblad.nl', searchPath: '/zoeken?q=' },
    { domain: 'hdcmedia.nl', searchPath: '/zoeken?q=' },
    
    // Dutch education sites
    { domain: 'surf.nl', searchPath: '/zoeken?q=' },
    { domain: 'universiteit.nl', searchPath: '/zoeken?q=' },
    { domain: 'loonwijzer.nl', searchPath: '/zoeken?q=' },
    { domain: 'onderwijs.nl', searchPath: '/zoeken?q=' },
    
    // Dutch travel and leisure
    { domain: 'ns.nl', searchPath: '/zoeken?q=' },
    { domain: 'veiling.nl', searchPath: '/zoeken?q=' },
    { domain: 'catawiki.nl', searchPath: '/zoeken?q=' },
    { domain: '2dehands.be', searchPath: '/zoeken?q=' },
    { domain: 'anketravel.nl', searchPath: '/zoeken?q=' },
    
    // Dutch real estate
    { domain: 'funda.nl', searchPath: '/zoeken?q=' },
    { domain: 'jaap.nl', searchPath: '/zoeken?q=' },
    { domain: 'huislijn.nl', searchPath: '/zoeken?q=' },
    { domain: 'pararius.nl', searchPath: '/zoeken?q=' },
    { domain: 'huislijn.nl', searchPath: '/zoeken?q=' },
    
    // Dutch job sites
    { domain: 'indeed.nl', searchPath: '/jobs?q=' },
    { domain: 'monsterboard.nl', searchPath: '/zoeken?q=' },
    { domain: 'nationalevacaturebank.nl', searchPath: '/zoeken?q=' },
    { domain: 'werkenbij.nl', searchPath: '/zoeken?q=' },
    
    // Dutch health sites
    { domain: 'thuisarts.nl', searchPath: '/zoeken?q=' },
    { domain: 'zorgkaartnederland.nl', searchPath: '/zoeken?q=' },
    { domain: 'patient.nl', searchPath: '/zoeken?q=' },
    { domain: 'dokter.nl', searchPath: '/zoeken?q=' },
    
    // Dutch automotive
    { domain: 'autoweek.nl', searchPath: '/zoeken?q=' },
    { domain: 'autotrack.nl', searchPath: '/zoeken?q=' },
    { domain: 'gaspedaal.nl', searchPath: '/zoeken?q=' },
    { domain: 'autokampioen.nl', searchPath: '/zoeken?q=' },
    
    // Dutch sports
    { domain: 'vi.nl', searchPath: '/zoeken?q=' },
    { domain: 'voetbalzone.nl', searchPath: '/zoeken?q=' },
    { domain: 'nusport.nl', searchPath: '/zoeken?q=' },
    { domain: 'ziggosport.nl', searchPath: '/zoeken?q=' },
    
    // Dutch entertainment
    { domain: 'film1.nl', searchPath: '/zoeken?q=' },
    { domain: 'viaplay.nl', searchPath: '/zoeken?q=' },
    { domain: 'npoplus.nl', searchPath: '/zoeken?q=' },
    { domain: 'rtl.nl', searchPath: '/zoeken?q=' },
    { domain: 'sbs.nl', searchPath: '/zoeken?q=' },
    { domain: 'videoland.nl', searchPath: '/zoeken?q=' },
    
    // Dutch comparison sites
    { domain: 'pricewise.nl', searchPath: '/zoeken?q=' },
    { domain: 'geld.nl', searchPath: '/zoeken?q=' },
    { domain: 'independer.nl', searchPath: '/zoeken?q=' },
    
    // Dutch food & grocery
    { domain: 'jumbo.com', searchPath: '/zoeken?q=' },
    { domain: 'plus.nl', searchPath: '/zoeken?q=' },
    { domain: 'c1000.nl', searchPath: '/zoeken?q=' },
    { domain: 'deen.nl', searchPath: '/zoeken?q=' },
    
    // Dutch fashion & retail
    { domain: 'wehkamp.nl', searchPath: '/zoeken?q=' },
    { domain: 'zalando.nl', searchPath: '/zoeken?q=' },
    { domain: 'aboutyou.nl', searchPath: '/zoeken?q=' },
    { domain: 'hema.nl', searchPath: '/zoeken?q=' },
    
    // Dutch telecom
    { domain: 'kpn.com', searchPath: '/zoeken?q=' },
    { domain: 'vodafoneziggo.nl', searchPath: '/zoeken?q=' },
    { domain: 't-mobile.nl', searchPath: '/zoeken?q=' },
    { domain: 'tele2.nl', searchPath: '/zoeken?q=' },
    
    // Dutch banking & finance
    { domain: 'ing.nl', searchPath: '/zoeken?q=' },
    { domain: 'rabobank.nl', searchPath: '/zoeken?q=' },
    { domain: 'abnamro.nl', searchPath: '/zoeken?q=' },
    { domain: 'snsbank.nl', searchPath: '/zoeken?q=' },
    { domain: 'triodos.nl', searchPath: '/zoeken?q=' },
    
    // Dutch insurance
    { domain: 'achmea.nl', searchPath: '/zoeken?q=' },
    { domain: 'aegon.nl', searchPath: '/zoeken?q=' },
    { domain: 'nn.nl', searchPath: '/zoeken?q=' },
    { domain: 'centraalbeheer.nl', searchPath: '/zoeken?q=' },
    
    // Dutch energy
    { domain: 'energiedirect.nl', searchPath: '/zoeken?q=' },
    { domain: 'eneco.nl', searchPath: '/zoeken?q=' },
    { domain: 'essent.nl', searchPath: '/zoeken?q=' },
    { domain: 'nuon.nl', searchPath: '/zoeken?q=' },
    
    // Dutch classifieds
    { domain: 'marktplaats.nl', searchPath: '/a/zoeken?q=' },
    { domain: '2dehands.be', searchPath: '/zoeken?q=' },
    { domain: 'speurders.nl', searchPath: '/zoeken?q=' },
    
    // Dutch dating
    { domain: 'lexa.nl', searchPath: '/zoeken?q=' },
    { domain: 'relatieplanet.nl', searchPath: '/zoeken?q=' },
    { domain: 'parship.nl', searchPath: '/zoeken?q=' },
    
    // Dutch weather
    { domain: 'weeronline.nl', searchPath: '/zoeken?q=' },
    { domain: 'buienradar.nl', searchPath: '/zoeken?q=' },
    { domain: 'knmi.nl', searchPath: '/zoeken?q=' },
];

// State tracking
let results = [];
let uniqueDomains = new Set();
let checkedCount = 0;
const TARGET_SUCCESS_COUNT = 50;

// Initialize CSV output
const csvWriter = createObjectCsvWriter({
    path: path.join(__dirname, 'results', `dutch-portals-${Date.now()}.csv`),
    header: [
        { id: 'domain', title: 'Domain' },
        { id: 'searchUrl', title: 'SearchURL' },
        { id: 'delimiterPhrase', title: 'DelimiterPhrase' },
        { id: 'found', title: 'Found' },
        { id: 'screenshotPath', title: 'ScreenshotPath' },
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'snippet', title: 'Snippet' },
    ]
});

// Ensure results directory exists
const resultsDir = path.join(__dirname, 'results');
const screenshotsDir = path.join(resultsDir, 'screenshots');
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// Helper function to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to check if text contains brand mention
const containsBrandMention = (text) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return BRAND_VARIATIONS.some(variation => 
        lowerText.includes(variation.toLowerCase())
    );
};

// Helper function to check if text contains delimiter phrase
const containsDelimiterPhrase = (text, phrase) => {
    if (!text || !phrase) return false;
    const lowerText = text.toLowerCase();
    const lowerPhrase = phrase.toLowerCase();
    return lowerText.includes(lowerPhrase);
};

// Get random delimiter phrase
const getRandomDelimiterPhrase = () => {
    return DELIMITER_PHRASES[Math.floor(Math.random() * DELIMITER_PHRASES.length)];
};

// Build multi-keyword search query
const buildSearchQuery = (delimiterPhrase) => {
    // Format: brand + " + " + delimiter phrase (spaces become + in URL)
    return `${BRAND}+${encodeURIComponent(delimiterPhrase)}`;
};

// Handle consent dialogs
async function handleConsentDialogs(page) {
    try {
        // Try XPath for text-based selectors
        const xpathSelectors = [
            "//button[contains(text(), 'Akkoord')]",
            "//button[contains(text(), 'Accepteer')]",
            "//button[contains(text(), 'Accept')]",
            "//button[contains(text(), 'OK')]",
            "//button[contains(text(), 'Ja, ik ga akkoord')]",
            "//button[contains(text(), 'Accepteer alles')]",
            "//button[contains(text(), 'Accept all cookies')]",
        ];
        
        for (const xpath of xpathSelectors) {
            try {
                const elements = await page.$x(xpath);
                if (elements.length > 0) {
                    await elements[0].click();
                    await delay(500);
                    console.log('✓ Clicked consent button');
                    return;
                }
            } catch (e) {
                // Continue
            }
        }
        
        // Also try aria-label and data attributes
        const ariaButtons = await page.$$('[aria-label*="accept" i], [aria-label*="cookie" i], button[id*="accept" i], button[class*="accept" i]');
        for (const btn of ariaButtons) {
            try {
                await btn.click();
                await delay(500);
                console.log('✓ Clicked consent button via attributes');
                return;
            } catch (e) {
                // Continue
            }
        }
    } catch (e) {
        console.log('Note: No consent dialog found');
    }
}

// Check if page has no results
async function hasNoResults(page) {
    try {
        const pageText = await page.evaluate(() => document.body.innerText);
        
        const noResultsPhrases = [
            'geen resultaten gevonden',
            'geen resultaten',
            'niets gevonden',
            '0 resultaten',
            'no results found',
            'uw zoekopdracht leverde geen resultaten op',
            'helaas, geen resultaten',
            'geen zoekresultaten'
        ];
        
        const lowerText = pageText.toLowerCase();
        return noResultsPhrases.some(phrase => lowerText.includes(phrase));
    } catch (e) {
        return false;
    }
}

// Extract search result snippets
async function extractSnippets(page) {
    try {
        const snippets = await page.evaluate(() => {
            const results = [];
            
            const selectors = [
                '.search-result',
                '.result-item',
                'article',
                '[data-testid*="result"]',
                '.search-item',
                'li.result',
                'div.searchHit',
                '.snippet',
                '.search-result-item',
                'div[class*="result"]',
                'li[class*="result"]',
                'article[class*="result"]',
                '.item',
                '.entry',
                'div[class*="search"]',
            ];
            
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    for (const el of elements) {
                        const text = el.textContent?.trim();
                        if (text && text.length > 10 && text.length < 500) {
                            results.push(text);
                        }
                        if (results.length >= 5) break;
                    }
                    if (results.length > 0) break;
                }
            }
            
            return results;
        });
        
        return snippets;
    } catch (e) {
        return [];
    }
}

// Process a single portal
async function processPortal(portal, browser) {
    const { domain, searchPath } = portal;
    
    // Get random delimiter phrase
    const delimiterPhrase = getRandomDelimiterPhrase();
    
    // Build search URL with multi-keyword format
    const searchQuery = buildSearchQuery(delimiterPhrase);
    const searchUrl = `https://www.${domain}${searchPath}${searchQuery}`;
    
    console.log(`\n[${checkedCount + 1}/${DUTCH_PORTALS.length}] Processing: ${domain}`);
    console.log(`Delimiter: "${delimiterPhrase}"`);
    console.log(`URL: ${searchUrl}`);
    
    let found = false;
    let snippet = '';
    let screenshotPath = '';
    
    try {
        const page = await browser.newPage();
        
        // Set viewport and user agent
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Navigate to search URL
        try {
            await page.goto(searchUrl, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
        } catch (e) {
            console.log(`⚠️  Navigation timeout for ${domain}, retrying...`);
            await page.goto(searchUrl, { 
                waitUntil: 'domcontentloaded',
                timeout: 60000 
            });
        }
        
        // Handle consent dialogs
        await handleConsentDialogs(page);
        await delay(2000);
        
        // Check for Cloudflare challenge
        const isCloudflare = await page.evaluate(() => {
            const bodyText = document.body.textContent || '';
            return bodyText.includes('Checking your browser') ||
                   bodyText.includes('Just a moment') ||
                   bodyText.includes('Checking browser');
        });
        
        if (isCloudflare) {
            console.log(`⚠️  Cloudflare challenge detected for ${domain}`);
            await delay(10000);
        }
        
        // Check if no results found
        const noResults = await hasNoResults(page);
        
        if (noResults) {
            console.log(`✗ No results found for ${domain}`);
        } else {
            // Extract snippets
            const snippets = await extractSnippets(page);
            
            // Check if any snippet contains BOTH brand AND delimiter phrase
            for (const s of snippets) {
                const hasBrand = containsBrandMention(s);
                const hasDelimiter = containsDelimiterPhrase(s, delimiterPhrase);
                
                if (hasBrand && hasDelimiter) {
                    found = true;
                    snippet = `BRAND ✓ DELIMITER ✓: ${s.substring(0, 200)}${s.length > 200 ? '...' : ''}`;
                    break;
                } else if (hasBrand) {
                    snippet = `BRAND only (no delimiter): ${s.substring(0, 200)}${s.length > 200 ? '...' : ''}`;
                } else if (hasDelimiter) {
                    snippet = `DELIMITER only (no brand): ${s.substring(0, 200)}${s.length > 200 ? '...' : ''}`;
                }
            }
            
            if (found) {
                console.log(`✓ SUCCESS! Both brand and delimiter found for ${domain}!`);
                console.log(`Snippet: ${snippet}`);
            } else {
                console.log(`✗ No combined match found for ${domain}`);
                if (!snippet) {
                    snippet = snippets[0] ? snippets[0].substring(0, 200) : 'No snippets extracted';
                }
            }
        }
        
        // Take screenshot
        screenshotPath = path.join(screenshotsDir, `${domain}-${Date.now()}.png`);
        await page.screenshot({ 
            path: screenshotPath,
            fullPage: false
        });
        
        await page.close();
        
    } catch (e) {
        console.log(`✗ Error processing ${domain}:`, e.message);
    }
    
    // Store result
    const result = {
        domain,
        searchUrl,
        delimiterPhrase,
        found: found ? 'Yes' : 'No',
        screenshotPath,
        timestamp: new Date().toISOString(),
        snippet
    };
    
    results.push(result);
    
    if (found) {
        uniqueDomains.add(domain);
    }
    
    checkedCount++;
    
    // Write to CSV immediately
    await csvWriter.writeRecords([result]);
    
    // Progress report every 10 sites
    if (checkedCount % 10 === 0) {
        console.log('\n' + '='.repeat(60));
        console.log('PROGRESS REPORT');
        console.log('='.repeat(60));
        console.log(`Sites checked: ${checkedCount}`);
        console.log(`Unique domains with mentions: ${uniqueDomains.size}`);
        console.log(`Target: ${TARGET_SUCCESS_COUNT}`);
        console.log(`Progress: ${((uniqueDomains.size / TARGET_SUCCESS_COUNT) * 100).toFixed(1)}%`);
        console.log('='.repeat(60) + '\n');
    }
    
    return found;
}

// Main function
async function main() {
    console.log('='.repeat(70));
    console.log('Dutch Portal Search Automation - MULTI-KEYWORD FORMAT');
    console.log(`Target: ${TARGET_SUCCESS_COUNT} unique domains with combined matches`);
    console.log(`Format: Brand + Delimiter Phrase (multi-keyword search)`);
    console.log(`Total portals to check: ${DUTCH_PORTALS.length}`);
    console.log('='.repeat(70));
    
    // Launch browser with system Chrome
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-blink-features=AutomationControlled',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });
    
    try {
        for (const portal of DUTCH_PORTALS) {
            // Stop if we've reached the target
            if (uniqueDomains.size >= TARGET_SUCCESS_COUNT) {
                console.log(`\n🎉 TARGET ACHIEVED! Found ${uniqueDomains.size} domains with combined matches!`);
                break;
            }
            
            await processPortal(portal, browser);
            
            // Delay between requests
            await delay(2000);
        }
        
        // Final report
        console.log('\n' + '='.repeat(70));
        console.log('FINAL REPORT');
        console.log('='.repeat(70));
        console.log(`Total sites checked: ${checkedCount}`);
        console.log(`Unique domains with combined matches: ${uniqueDomains.size}`);
        console.log(`Target achieved: ${uniqueDomains.size >= TARGET_SUCCESS_COUNT ? 'YES ✓' : 'NO ✗'}`);
        console.log(`Results CSV: ${csvWriter.path}`);
        console.log(`Screenshots: ${screenshotsDir}`);
        console.log('='.repeat(70));
        
        // List all successful domains
        if (uniqueDomains.size > 0) {
            console.log('\n✓ Successful Domains (Brand + Delimiter found):');
            const successfulResults = results.filter(r => r.found === 'Yes');
            successfulResults.forEach(r => {
                console.log(`  - ${r.domain}`);
                console.log(`    Delimiter: "${r.delimiterPhrase}"`);
            });
        }
        
    } catch (e) {
        console.error('Error in main execution:', e);
    } finally {
        await browser.close();
    }
}

// Run
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main, processPortal };

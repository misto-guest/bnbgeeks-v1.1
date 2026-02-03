import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';
import PersonaManager from './persona-manager.js';
import UserManager from './user-manager.js';

// Search engine URLs
const SEARCH_ENGINES = {
  google: 'https://google.com',
  bing: 'https://bing.com',
  duckduckgo: 'https://duckduckgo.com',
  ecosia: 'https://ecosia.org'
};

// Persona-Aware Warm-up Engine
class PersonaWarmupEngine {
  constructor(userId) {
    this.userId = userId;
    this.persona = null;
    this.browser = null;
    this.page = null;
    this.sessionMetrics = {
      searches: 0,
      pages: 0,
      emails: 0,
      sites_visited: new Set(),
      start_time: null,
      end_time: null
    };
  }

  // Initialize persona
  async initialize() {
    const user = await UserManager.getUser(this.userId);
    this.persona = await PersonaManager.getUserPersona(this.userId);

    if (!this.persona) {
      throw new Error('No persona found for user. Please create a persona first.');
    }

    console.log(`🎭 Initializing warm-up with persona:`);
    console.log(`   Gender: ${this.persona.gender}`);
    console.log(`   Age Group: ${this.persona.age_group}`);
    console.log(`   GEO: ${this.persona.geo}`);
    console.log(`   Activity: ${this.persona.activity_level}`);
    console.log(`   Tech Savviness: ${this.persona.tech_savvy}`);
  }

  // Select search engine based on persona
  selectSearchEngine() {
    return PersonaManager.selectSearchEngine(this.persona);
  }

  // Generate search query based on persona
  generateSearchQuery() {
    return PersonaManager.generateSearchQuery(this.persona);
  }

  // Run persona-driven warm-up
  async run() {
    try {
      await this.initialize();

      // Check if within active hours
      if (!PersonaManager.isWithinActiveHours(this.persona)) {
        console.log('⏰ Outside active hours for this persona. Skipping.');
        return;
      }

      // Launch browser
      await this.launchBrowser();

      // Determine session parameters
      const sessionDuration = PersonaManager.calculateSessionDuration(this.persona);
      const weeklyPattern = PersonaManager.getWeeklyPattern(new Date().getDay());

      console.log(`📊 Session Parameters:`);
      console.log(`   Duration: ${Math.round(sessionDuration / 1000)}s`);
      console.log(`   Day Pattern: ${weeklyPattern.focus}`);
      console.log(`   Time Distribution:`, this.persona.behavioral_weights.session_pattern_weights.time_distribution);

      this.sessionMetrics.start_time = new Date().toISOString();

      // Session flow
      await this.executeSessionFlow(sessionDuration, weeklyPattern);

      this.sessionMetrics.end_time = new Date().toISOString();

      // Log metrics
      await this.logSessionMetrics();

      console.log('✅ Persona-driven warm-up completed!');
      console.log(`📊 Session Metrics:`);
      console.log(`   Searches: ${this.sessionMetrics.searches}`);
      console.log(`   Pages: ${this.sessionMetrics.pages}`);
      console.log(`   Emails: ${this.sessionMetrics.emails}`);
      console.log(`   Unique Sites: ${this.sessionMetrics.sites_visited.size}`);

    } catch (error) {
      console.error('❌ Error in persona warm-up:', error.message);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  // Launch browser with persona settings
  async launchBrowser() {
    const model = PersonaManager.getBehavioralModel(this.persona);

    this.browser = await puppeteer.launch({
      headless: this.persona.headless || false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    this.page = await this.browser.newPage();

    // Set viewport based on age group (mobile vs desktop preference)
    const mobilePref = PERSONA_MODELS.age_groups[this.persona.age_group].mobile_preference;
    const isMobile = Math.random() < mobilePref;

    await this.page.setViewport(isMobile ? { width: 375, height: 667 } : { width: 1920, height: 1080 });

    // Set user agent
    const userAgents = {
      desktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    };

    await this.page.setUserAgent(isMobile ? userAgents.mobile : userAgents.desktop);

    // Anti-detection
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    });

    console.log(`🚀 Browser launched (${isMobile ? 'mobile' : 'desktop'})`);
  }

  // Execute session flow with persona-driven behaviors
  async executeSessionFlow(sessionDuration, weeklyPattern) {
    const startTime = Date.now();
    const endTime = startTime + sessionDuration;

    // Session entry points
    const entryPoints = this.getEntryPoints(weeklyPattern);
    const entryPoint = entryPoints[Math.floor(Math.random() * entryPoints.length)];

    console.log(`📍 Session entry: ${entryPoint}`);

    switch (entryPoint) {
      case 'google_search':
        await this.performSearch();
        break;
      case 'direct_site':
        await this.visitDirectSite();
        break;
      case 'gmail':
        await this.visitGmail();
        break;
    }

    // Continue session until duration expires
    while (Date.now() < endTime) {
      const remaining = endTime - Date.now();

      // Decide next action
      const action = this.decideNextAction(weeklyPattern);

      switch (action) {
        case 'search':
          await this.performSearch();
          break;
        case 'visit_site':
          await this.visitSite();
          break;
        case 'gmail':
          await this.visitGmail();
          break;
        case 'pause':
          await this.humanPause();
          break;
        case 'tab_switch':
          await this.tabSwitch();
          break;
        case 'abandon':
          if (Math.random() < 0.3) { // 30% chance to actually abandon
            console.log('🚪 Session abandoned (human-like)');
            return;
          }
          break;
      }

      // Check if we should inject noise
      if (PersonaManager.shouldInjectNoise(this.persona, 'hesitation')) {
        await this.hesitationPause();
      }
    }
  }

  // Get session entry points based on day pattern
  getEntryPoints(weeklyPattern) {
    const basePoints = ['google_search', 'direct_site', 'gmail'];

    if (weeklyPattern.email_heavy) {
      return ['gmail', 'google_search', 'direct_site'];
    }

    return basePoints;
  }

  // Decide next action in session
  decideNextAction(weeklyPattern) {
    const actions = ['search', 'visit_site', 'gmail', 'pause', 'tab_switch'];

    // Adjust probabilities based on day pattern
    if (weeklyPattern.focus === 'productivity') {
      actions.push('gmail');
      actions.push('gmail'); // Weight towards email
    } else if (weeklyPattern.focus === 'personal') {
      actions.push('visit_site');
      actions.push('visit_site');
    }

    return actions[Math.floor(Math.random() * actions.length)];
  }

  // Perform search with persona behavior
  async performSearch() {
    const searchEngine = this.selectSearchEngine();
    const query = this.generateSearchQuery();

    console.log(`🔍 Searching ${searchEngine} for: "${query}"`);

    // Navigate to search engine
    await this.page.goto(SEARCH_ENGINES[searchEngine] || SEARCH_ENGINES.google, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Inject noise: Typing with mistakes
    if (PersonaManager.shouldInjectNoise(this.persona, 'typo')) {
      await this.typeWithMistakes(query);
    } else {
      await this.typeHumanLike(query);
    }

    await this.page.keyboard.press('Enter');
    await setTimeout(2000 + Math.random() * 2000);

    // Click result (with potential misclick)
    if (PersonaManager.shouldInjectNoise(this.persona, 'misclick')) {
      await this.performMisclick();
    } else {
      await this.clickSearchResult();
    }

    this.sessionMetrics.searches++;
  }

  // Type search query with human-like variation
  async typeHumanLike(text) {
    const techSavvy = PERSONA_MODELS.tech_savvy[this.persona.tech_savvy];
    const baseDelay = techSavvy.navigation === 'efficient' ? 50 : 100;

    for (const char of text) {
      await this.page.keyboard.type(char, {
        delay: baseDelay + Math.random() * 100
      });
    }
  }

  // Type with mistakes (noise injection)
  async typeWithMistakes(text) {
    const techSavvy = PERSONA_MODELS.tech_savvy[this.persona.tech_savvy];
    const mistakeRate = techSavvy.mistakes_rate;

    for (let i = 0; i < text.length; i++) {
      // Make mistake
      if (Math.random() < mistakeRate) {
        const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        await this.page.keyboard.type(wrongChar);
        await setTimeout(300 + Math.random() * 500);

        // Backspace to correct
        await this.page.keyboard.press('Backspace');
        await setTimeout(200 + Math.random() * 300);
      }

      await this.page.keyboard.type(text[i], {
        delay: 50 + Math.random() * 100
      });
    }
  }

  // Click search result
  async clickSearchResult() {
    try {
      const results = await this.page.$$('a h3, a h2, .g a, .b_algo h2 a');

      if (results.length > 0) {
        const randomResult = results[Math.floor(Math.random() * Math.min(results.length, 5))];
        await randomResult.click();
        await setTimeout(1000 + Math.random() * 2000);

        // Dwell on page
        await this.dwellOnPage();

        this.sessionMetrics.pages++;
      }
    } catch (error) {
      console.log('⚠️  Could not click result');
    }
  }

  // Perform misclick (noise)
  async performMisclick() {
    try {
      const results = await this.page.$$('a h3, a h2, .g a');
      if (results.length > 1) {
        // Click wrong result
        await results[results.length - 1].click();
        await setTimeout(1000 + Math.random() * 1000);
        console.log('❌ Misclicked - going back');
        await this.page.goBack();
        await setTimeout(1000 + Math.random() * 1000);
      }
    } catch (error) {
      console.log('⚠️  Misclick failed');
    }
  }

  // Dwell on page with human-like behavior
  async dwellOnPage() {
    const model = PersonaManager.getBehavioralModel(this.persona);
    const dwellTime = model.navigation_speed === 'fast' ? 5000 : 15000;
    const actualDwell = Math.floor(dwellTime + Math.random() * 10000);

    console.log(`👀 Dwelling for ${Math.round(actualDwell / 1000)}s`);

    // Scroll during dwell
    const scrollCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < scrollCount; i++) {
      await this.page.evaluate(() => {
        window.scrollBy({
          top: Math.random() * 500,
          left: 0,
          behavior: 'smooth'
        });
      });
      await setTimeout(actualDwell / scrollCount);
    }

    // Track unique site
    const url = this.page.url();
    const domain = new URL(url).hostname;
    this.sessionMetrics.sites_visited.add(domain);
  }

  // Visit direct site (bookmark/direct navigation)
  async visitDirectSite() {
    const model = PersonaManager.getBehavioralModel(this.persona);
    const site = model.sites[Math.floor(Math.random() * model.sites.length)];

    console.log(`🔗 Direct visit: ${site}`);

    await this.page.goto(`https://${site}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await this.dwellOnPage();
    this.sessionMetrics.pages++;
  }

  // Visit Gmail
  async visitGmail() {
    console.log('📧 Visiting Gmail');

    await this.page.goto('https://gmail.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Simulate email check
    await setTimeout(3000 + Math.random() * 5000);

    this.sessionMetrics.emails++;
    this.sessionMetrics.sites_visited.add('gmail.com');
  }

  // Human pause
  async humanPause() {
    const pauseDuration = 2000 + Math.random() * 5000;
    console.log(`💭 Pausing for ${Math.round(pauseDuration / 1000)}s`);
    await setTimeout(pauseDuration);
  }

  // Hesitation pause (noise)
  async hesitationPause() {
    const duration = 500 + Math.random() * 1500;
    console.log(`😟 Hesitating for ${Math.round(duration)}ms`);
    await setTimeout(duration);
  }

  // Tab switching (noise)
  async tabSwitch() {
    if (Math.random() < 0.3) { // 30% chance to switch back
      console.log('🔄 Tab switch');
      await this.page.goBack();
      await setTimeout(1000 + Math.random() * 2000);
    }
  }

  // Log session metrics
  async logSessionMetrics() {
    const logEntry = {
      user_id: this.userId,
      persona_id: this.persona.id,
      session_metrics: {
        ...this.sessionMetrics,
        sites_visited: Array.from(this.sessionMetrics.sites_visited)
      },
      persona_snapshot: {
        gender: this.persona.gender,
        age_group: this.persona.age_group,
        geo: this.persona.geo,
        activity_level: this.persona.activity_level,
        tech_savvy: this.persona.tech_savvy
      },
      timestamp: new Date().toISOString()
    };

    await UserManager.logExecution(this.userId, logEntry);
  }
}

// Helper constant
const PERSONA_MODELS = {
  age_groups: {
    "18-24": { mobile_preference: 0.75, navigation_speed: "fast" },
    "25-34": { mobile_preference: 0.50, navigation_speed: "medium" },
    "35-44": { mobile_preference: 0.35, navigation_speed: "medium" },
    "45-60": { mobile_preference: 0.25, navigation_speed: "slow" }
  },
  tech_savvy: {
    low: { navigation: "cautious", mistakes_rate: 0.08 },
    medium: { navigation: "confident", mistakes_rate: 0.05 },
    high: { navigation: "efficient", mistakes_rate: 0.02 }
  }
};

export default PersonaWarmupEngine;

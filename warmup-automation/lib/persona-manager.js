import fs from 'fs/promises';
import path from 'path';

// Persona Database
const PERSONAS_FILE = path.join(process.cwd(), 'users', 'personas.json');

// Persona Behavioral Models
const PERSONA_MODELS = {
  // Gender-based patterns (statistical weights, not absolutes)
  gender: {
    male: {
      search_weights: { tech: 0.25, finance: 0.18, tools: 0.15, gaming: 0.12, news: 0.10, sports: 0.10, general: 0.10 },
      site_preferences: { reddit: 0.20, youtube: 0.18, stackoverflow: 0.12, github: 0.10, forums: 0.15, news: 0.15, other: 0.10 },
      behavioral_patterns: { avg_dwell_time_ms: 45000, pages_per_session: 8, email_reply_rate: 0.35, video_watch_time: 180000 }
    },
    female: {
      search_weights: { lifestyle: 0.20, health: 0.15, ecommerce: 0.18, travel: 0.12, food: 0.10, education: 0.10, general: 0.15 },
      site_preferences: { pinterest_style: 0.18, instagram: 0.15, ecommerce: 0.20, health: 0.12, blogs: 0.15, other: 0.10 },
      behavioral_patterns: { avg_dwell_time_ms: 35000, pages_per_session: 12, email_reply_rate: 0.55, video_watch_time: 120000 }
    }
  },

  // Age group patterns
  age_groups: {
    "18-24": {
      navigation_speed: "fast",
      attention_span: "short",
      mobile_preference: 0.75,
      keywords: ["best apps for", "how to", "tutorial", "reddit", "free", "online"],
      sites: ["youtube.com", "reddit.com", "instagram.com", "tiktok.com", "twitter.com"],
      session_duration_range: [180000, 420000], // 3-7 minutes
      time_distribution: { morning: 0.15, afternoon: 0.35, evening: 0.40, late_night: 0.10 }
    },
    "25-34": {
      navigation_speed: "medium",
      attention_span: "medium",
      mobile_preference: 0.50,
      keywords: ["best software", "compare", "reviews", "productivity", "tools", "tutorial"],
      sites: ["youtube.com", "gmail.com", "docs.google.com", "notion.so", "medium.com"],
      session_duration_range: [420000, 900000], // 7-15 minutes
      time_distribution: { morning: 0.30, afternoon: 0.40, evening: 0.25, late_night: 0.05 }
    },
    "35-44": {
      navigation_speed: "medium",
      attention_span: "long",
      mobile_preference: 0.35,
      keywords: ["news", "finance", "business", "analysis", "market", "strategy"],
      sites: ["nytimes.com", "linkedin.com", "bloomberg.com", "gmail.com", "wsj.com"],
      session_duration_range: [600000, 1200000], // 10-20 minutes
      time_distribution: { morning: 0.35, afternoon: 0.40, evening: 0.20, late_night: 0.05 }
    },
    "45-60": {
      navigation_speed: "slow",
      attention_span: "long",
      mobile_preference: 0.25,
      keywords: ["local news", "weather", "health", "recipes", "near me", "official"],
      sites: ["news sites", "gmail.com", "weather.com", "amazon.com", "webmd.com"],
      session_duration_range: [900000, 1500000], // 15-25 minutes
      time_distribution: { morning: 0.40, afternoon: 0.30, evening: 0.25, late_night: 0.05 }
    }
  },

  // GEO-specific patterns
  geo: {
    US: {
      timezone: "America/New_York",
      search_engines: { google: 0.85, bing: 0.10, duckduckgo: 0.05 },
      sites: ["nytimes.com", "reddit.com", "amazon.com", "youtube.com", "cnn.com", "github.com"],
      keyword_style: "casual",
      keywords_prefix: ["best", "top", "cheap", "near me", "how to"],
      active_hours: { start: 7, end: 23 }
    },
    UK: {
      timezone: "Europe/London",
      search_engines: { google: 0.80, bing: 0.15, duckduckgo: 0.05 },
      sites: ["bbc.co.uk", "gov.uk", "theguardian.com", "amazon.co.uk", "reddit.com"],
      keyword_style: "polite",
      keywords_prefix: ["reviews", "compare", "best", "please"],
      active_hours: { start: 7, end: 23 }
    },
    DE: {
      timezone: "Europe/Berlin",
      search_engines: { google: 0.70, bing: 0.15, ecosia: 0.15 },
      sites: ["spiegel.de", "zeit.de", "idealo.de", "amazon.de", "bild.de"],
      keyword_style: "formal",
      keywords_prefix: ["vergleich", "beste", "test", "kaufen"],
      active_hours: { start: 6, end: 23 }
    },
    NL: {
      timezone: "Europe/Amsterdam",
      search_engines: { google: 0.75, bing: 0.15, duckduckgo: 0.10 },
      sites: ["nu.nl", "tweakers.net", "bol.com", "amazon.nl", "telegraaf.nl"],
      keyword_style: "practical",
      keywords_prefix: ["beste", "goedkoop", "review", "waar"],
      active_hours: { start: 7, end: 23 }
    }
  },

  // Activity levels
  activity_level: {
    low: {
      sessions_per_day: [2, 3],
      searches_per_session: [2, 3],
      pages_per_session: [3, 5],
      emails_per_day: [1, 2]
    },
    medium: {
      sessions_per_day: [4, 6],
      searches_per_session: [4, 6],
      pages_per_session: [6, 10],
      emails_per_day: [3, 5]
    },
    high: {
      sessions_per_day: [8, 12],
      searches_per_session: [6, 10],
      pages_per_session: [10, 15],
      emails_per_day: [5, 10]
    }
  },

  // Tech savviness
  tech_savvy: {
    low: {
      navigation: "cautious",
      mistakes_rate: 0.08,
      backspace_usage: "high",
      click_accuracy: 0.75,
      help_page_visits: "often"
    },
    medium: {
      navigation: "confident",
      mistakes_rate: 0.05,
      backspace_usage: "medium",
      click_accuracy: 0.85,
      keyboard_shortcuts: "some"
    },
    high: {
      navigation: "efficient",
      mistakes_rate: 0.02,
      backspace_usage: "low",
      click_accuracy: 0.95,
      keyboard_shortcuts: "heavy",
      developer_tools: true
    }
  },

  // Weekly rhythm
  weekly_pattern: {
    monday: { email_heavy: true, session_length: "medium", focus: "productivity" },
    tuesday: { email_heavy: false, session_length: "medium", focus: "balanced" },
    wednesday: { email_heavy: false, session_length: "medium", focus: "balanced" },
    thursday: { email_heavy: false, session_length: "medium", focus: "balanced" },
    friday: { email_heavy: false, session_length: "short", focus: "light" },
    saturday: { email_heavy: false, session_length: "variable", focus: "personal" },
    sunday: { email_heavy: false, session_length: "long", focus: "reading" }
  },

  // Noise injection
  noise: {
    typos: { rate: 0.05, correction_rate: 0.90 },
    misclicks: { rate: 0.03, recovery_time: [1000, 2000] },
    hesitation_pauses: { rate: 0.10, duration: [500, 2000] },
    abandonment: { rate: 0.08, return_rate: 0.30 },
    tab_switching: { rate: 0.15, return_rate: 0.70 }
  },

  // Email evolution
  email_evolution: {
    week_1: {
      style: "brief_neutral",
      length: "short",
      attachments: false,
      thread_participation: "single_response"
    },
    week_3: {
      style: "conversational",
      length: "medium",
      attachments: false,
      thread_participation: "multi_response"
    },
    week_5: {
      style: "professional",
      length: "variable",
      attachments: "light",
      thread_participation: "ongoing",
      calendar_invites: true,
      forwards: "occasional"
    }
  }
};

// Persona Manager Class
class PersonaManager {
  // Get persona for user
  static async getUserPersona(userId) {
    const personas = await this.loadPersonas();
    return personas.find(p => p.user_id === userId) || null;
  }

  // Create persona
  static async createPersona(userId, profileData) {
    const personas = await this.loadPersonas();

    // Check if persona already exists
    if (personas.find(p => p.user_id === userId)) {
      throw new Error('Persona already exists for this user');
    }

    const persona = {
      id: this.generateId(),
      user_id: userId,
      ...profileData,
      behavioral_weights: this.calculateBehavioralWeights(profileData),
      maturity_score: 0,
      trust_score: 0,
      created_at: new Date().toISOString(),
      last_used: null
    };

    personas.push(persona);
    await this.savePersonas(personas);

    return persona;
  }

  // Update persona
  static async updatePersona(personaId, updates) {
    const personas = await this.loadPersonas();
    const index = personas.findIndex(p => p.id === personaId);

    if (index === -1) {
      throw new Error('Persona not found');
    }

    personas[index] = {
      ...personas[index],
      ...updates,
      behavioral_weights: this.calculateBehavioralWeights({ ...personas[index], ...updates }),
      updated_at: new Date().toISOString()
    };

    await this.savePersonas(personas);
    return personas[index];
  }

  // Calculate behavioral weights based on profile
  static calculateBehavioralWeights(profile) {
    const weights = {
      search_engine_distribution: {},
      site_preference_weights: {},
      session_pattern_weights: {},
      email_behavior_weights: {},
      noise_parameters: {}
    };

    // Combine gender, age, and GEO influences
    const genderInfluence = PERSONA_MODELS.gender[profile.gender] || PERSONA_MODELS.gender.male;
    const ageInfluence = PERSONA_MODELS.age_groups[profile.age_group] || PERSONA_MODELS.age_groups["25-34"];
    const geoInfluence = PERSONA_MODELS.geo[profile.geo] || PERSONA_MODELS.geo.US;
    const activityInfluence = PERSONA_MODELS.activity_level[profile.activity_level] || PERSONA_MODELS.activity_level.medium;
    const techInfluence = PERSONA_MODELS.tech_savvy[profile.tech_savvy] || PERSONA_MODELS.tech_savvy.medium;

    // Search engine distribution (GEO-based)
    weights.search_engine_distribution = { ...geoInfluence.search_engines };

    // Site preferences (combine gender + age + GEO)
    weights.site_preference_weights = this.combineWeights(
      genderInfluence.site_preferences,
      { general_sites: ageInfluence.sites }
    );

    // Session patterns (age + activity level)
    weights.session_pattern_weights = {
      session_duration_range: ageInfluence.session_duration_range,
      sessions_per_day: activityInfluence.sessions_per_day,
      searches_per_session: activityInfluence.searches_per_session,
      pages_per_session: activityInfluence.pages_per_session,
      emails_per_day: activityInfluence.emails_per_day,
      time_distribution: ageInfluence.time_distribution
    };

    // Email behavior (gender-based)
    weights.email_behavior_weights = {
      reply_rate: genderInfluence.behavioral_patterns.email_reply_rate,
      avg_dwell_time_ms: genderInfluence.behavioral_patterns.avg_dwell_time_ms
    };

    // Noise parameters (tech savviness)
    weights.noise_parameters = {
      mistakes_rate: techInfluence.mistakes_rate,
      backspace_usage: techInfluence.backspace_usage,
      click_accuracy: techInfluence.click_accuracy,
      typos_rate: PERSONA_MODELS.noise.typos.rate * (techInfluence.mistakes_rate / 0.05),
      misclicks_rate: PERSONA_MODELS.noise.misclicks.rate,
      hesitation_rate: PERSONA_MODELS.noise.hesitation_pauses.rate
    };

    return weights;
  }

  // Get behavioral model for specific profile
  static getBehavioralModel(profile) {
    return {
      search_engines: PERSONA_MODELS.geo[profile.geo]?.search_engines || PERSONA_MODELS.geo.US.search_engines,
      keywords: PERSONA_MODELS.age_groups[profile.age_group]?.keywords || PERSONA_MODELS.age_groups["25-34"].keywords,
      sites: PERSONA_MODELS.geo[profile.geo]?.sites || PERSONA_MODELS.geo.US.sites,
      navigation_speed: PERSONA_MODELS.age_groups[profile.age_group]?.navigation_speed || "medium",
      session_duration: PERSONA_MODELS.age_groups[profile.age_group]?.session_duration_range || [420000, 900000],
      active_hours: PERSONA_MODELS.geo[profile.geo]?.active_hours || { start: 7, end: 23 },
      timezone: PERSONA_MODELS.geo[profile.geo]?.timezone || "America/New_York"
    };
  }

  // Get weekly pattern adjustment
  static getWeeklyPattern(dayOfWeek) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return PERSONA_MODELS.weekly_pattern[days[dayOfWeek]] || PERSONA_MODELS.weekly_pattern.monday;
  }

  // Get email evolution stage
  static getEmailEvolutionStage(accountAgeWeeks) {
    if (accountAgeWeeks < 2) return PERSONA_MODELS.email_evolution.week_1;
    if (accountAgeWeeks < 5) return PERSONA_MODELS.email_evolution.week_3;
    return PERSONA_MODELS.email_evolution.week_5;
  }

  // Generate random search query based on persona
  static generateSearchQuery(persona) {
    const model = this.getBehavioralModel(persona);
    const geoPrefix = PERSONA_MODELS.geo[persona.geo].keywords_prefix;

    const prefix = geoPrefix[Math.floor(Math.random() * geoPrefix.length)];
    const keywords = model.keywords[Math.floor(Math.random() * model.keywords.length)];

    // Combine with some randomness
    const patterns = [
      `${prefix} ${keywords}`,
      `${keywords} ${prefix}`,
      keywords,
      `${prefix} ${keywords} near me`
    ];

    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  // Select search engine based on persona
  static selectSearchEngine(persona) {
    const distribution = PERSONA_MODELS.geo[persona.geo].search_engines;
    const rand = Math.random();

    let cumulative = 0;
    for (const [engine, weight] of Object.entries(distribution)) {
      cumulative += weight;
      if (rand <= cumulative) {
        return engine;
      }
    }

    return 'google'; // Default
  }

  // Check if current time is within active hours
  static isWithinActiveHours(persona) {
    const activeHours = PERSONA_MODELS.geo[persona.geo].active_hours;
    const currentHour = new Date().getHours();
    return currentHour >= activeHours.start && currentHour <= activeHours.end;
  }

  // Calculate session duration based on persona and day of week
  static calculateSessionDuration(persona) {
    const model = this.getBehavioralModel(persona);
    const dayPattern = this.getWeeklyPattern(new Date().getDay());

    // Base duration from age group
    const [min, max] = model.session_duration;

    // Adjust based on day pattern
    const dayAdjustments = {
      short: 0.7,
      medium: 1.0,
      long: 1.3,
      variable: Math.random() * 0.6 + 0.7
    };

    const adjustment = dayAdjustments[dayPattern.session_length] || 1.0;
    const adjustedMin = Math.floor(min * adjustment);
    const adjustedMax = Math.ceil(max * adjustment);

    return Math.floor(Math.random() * (adjustedMax - adjustedMin + 1)) + adjustedMin;
  }

  // Generate noise behaviors
  static shouldInjectNoise(persona, noiseType) {
    const weights = this.calculateBehavioralWeights(persona);
    const noiseParams = weights.noise_parameters;

    const rates = {
      typo: noiseParams.typos_rate || 0.05,
      misclick: noiseParams.misclicks_rate || 0.03,
      hesitation: noiseParams.hesitation_rate || 0.10,
      abandonment: PERSONA_MODELS.noise.abandonment.rate,
      tab_switch: PERSONA_MODELS.noise.tab_switching.rate
    };

    return Math.random() < (rates[noiseType] || 0);
  }

  // Update trust score
  static async updateTrustScore(personaId, metrics) {
    const personas = await this.loadPersonas();
    const persona = personas.find(p => p.id === personaId);

    if (!persona) return null;

    // Calculate trust score based on various factors
    const weights = {
      account_age: 0.20,
      warmup_consistency: 0.25,
      session_diversity: 0.15,
      reply_ratio: 0.15,
      product_usage: 0.15,
      spam_folder_touches: -0.10
    };

    // Normalize metrics to 0-100 scale
    const normalized = {
      account_age: Math.min(metrics.account_age_days / 365 * 100, 100),
      warmup_consistency: metrics.warmup_sessions_completed / metrics.expected_sessions * 100,
      session_diversity: Math.min(metrics.unique_sites_visited / 50 * 100, 100),
      reply_ratio: Math.min(metrics.email_replies / metrics.emails_received * 100, 100),
      product_usage: Math.min(metrics.google_products_used / 5 * 100, 100),
      spam_folder_touches: metrics.spam_folder_touches * 10
    };

    let trustScore = 0;
    for (const [key, weight] of Object.entries(weights)) {
      trustScore += (normalized[key] || 0) * weight;
    }

    // Clamp to 0-100
    trustScore = Math.max(0, Math.min(100, trustScore));

    persona.trust_score = Math.round(trustScore);
    persona.maturity_score = Math.min(100, Math.floor(metrics.account_age_days / 7 * 100)); // Maturity based on weeks

    await this.savePersonas(personas);
    return persona;
  }

  // Helper: Combine multiple weight objects
  static combineWeights(...weightObjects) {
    const combined = {};
    for (const obj of weightObjects) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object') {
          combined[key] = { ...(combined[key] || {}), ...value };
        } else {
          combined[key] = (combined[key] || 0) + value;
        }
      }
    }
    return combined;
  }

  // Load personas from file
  static async loadPersonas() {
    try {
      const data = await fs.readFile(PERSONAS_FILE, 'utf-8');
      const db = JSON.parse(data);
      return db.personas || [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // Save personas to file
  static async savePersonas(personas) {
    const db = {
      personas,
      metadata: {
        last_updated: new Date().toISOString(),
        version: '3.0.0',
        total_personas: personas.length
      }
    };
    await fs.mkdir(path.dirname(PERSONAS_FILE), { recursive: true });
    await fs.writeFile(PERSONAS_FILE, JSON.stringify(db, null, 2));
  }

  // Generate unique ID
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get all persona models (for reference)
  static getAllModels() {
    return PERSONA_MODELS;
  }

  // Get available profile options
  static getProfileOptions() {
    return {
      genders: ['male', 'female'],
      age_groups: ['18-24', '25-34', '35-44', '45-60'],
      geos: ['US', 'UK', 'DE', 'NL'],
      activity_levels: ['low', 'medium', 'high'],
      tech_savviness: ['low', 'medium', 'high']
    };
  }
}

export default PersonaManager;

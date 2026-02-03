# 🎭 Persona System Design

## Profile Schema

```json
{
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Professional Male 25-34 US",
    
    "dimensions": {
      "gender": "male | female",
      "age_group": "18-24 | 25-34 | 35-44 | 45-60",
      "geo": "US | UK | DE | NL",
      "profession": "optional",
      "activity_level": "low | medium | high",
      "tech_savvy": "low | medium | high"
    },
    
    "behavioral_weights": {
      "search_engine_distribution": {},
      "site_preference_weights": {},
      "session_pattern_weights": {},
      "email_behavior_weights": {}
    },
    
    "maturity_score": 0,
    "trust_score": 0,
    "created_at": "timestamp",
    "last_used": "timestamp"
  }
}
```

## Persona Behavioral Models

### Gender-Based Behavioral Bias

#### Male-Leaning Pattern
```javascript
{
  search_topics: {
    tech: 0.25,
    finance: 0.18,
    tools: 0.15,
    gaming: 0.12,
    news: 0.10,
    sports: 0.10,
    general: 0.10
  },
  
  site_preferences: {
    reddit: 0.20,
    youtube: 0.18,
    stackoverflow: 0.12,
    github: 0.10,
    news_sites: 0.15,
    forums: 0.15,
    other: 0.10
  },
  
  behavioral_patterns: {
    avg_dwell_time_ms: 45000,
    pages_per_session: 8,
    email_reply_rate: 0.35,
    forum_engagement: 0.25,
    video_watch_time: 180000
  }
}
```

#### Female-Leaning Pattern
```javascript
{
  search_topics: {
    lifestyle: 0.20,
    health: 0.15,
    ecommerce: 0.18,
    travel: 0.12,
    food: 0.10,
    education: 0.10,
    general: 0.15
  },
  
  site_preferences: {
    pinterest_style: 0.18,
    instagram: 0.15,
    ecommerce: 0.20,
    health_sites: 0.12,
    recipe_sites: 0.10,
    blogs: 0.15,
    other: 0.10
  },
  
  behavioral_patterns: {
    avg_dwell_time_ms: 35000,
    pages_per_session: 12,
    email_reply_rate: 0.55,
    forum_engagement: 0.15,
    video_watch_time: 120000
  }
}
```

### Age Group Behaviors

#### 18-24 (Digital Native)
```javascript
{
  characteristics: {
    navigation_speed: "fast",
    attention_span: "short",
    mobile_preference: 0.75,
    video_consumption: "high",
    social_media_usage: "high"
  },
  
  typical_flow: [
    "google_search",
    "youtube",
    "gmail",
    "social_media",
    "back_to_search"
  ],
  
  keywords: [
    "best apps for",
    "how to",
    "tutorial",
    "reddit",
    "free",
    "online"
  ],
  
  time_distribution: {
    morning: 0.15,
    afternoon: 0.35,
    evening: 0.40,
    late_night: 0.10
  }
}
```

#### 25-34 (Young Professional)
```javascript
{
  characteristics: {
    navigation_speed: "medium",
    attention_span: "medium",
    mobile_preference: 0.50,
    video_consumption: "medium",
    productivity_tools: "high"
  },
  
  typical_flow: [
    "gmail",
    "google_docs",
    "calendar",
    "search",
    "youtube"
  ],
  
  keywords: [
    "best software",
    "compare",
    "reviews",
    "productivity",
    "tools",
    "tutorial"
  ],
  
  time_distribution: {
    morning: 0.30,
    afternoon: 0.40,
    evening: 0.25,
    late_night: 0.05
  }
}
```

#### 35-44 (Established Professional)
```javascript
{
  characteristics: {
    navigation_speed: "medium",
    attention_span: "long",
    mobile_preference: 0.35,
    video_consumption: "low",
    business_focused: "high"
  },
  
  typical_flow: [
    "news_sites",
    "gmail",
    "linkedin",
    "search",
    "finance_sites"
  ],
  
  keywords: [
    "news",
    "finance",
    "business",
    "analysis",
    "market",
    "strategy"
  ],
  
  time_distribution: {
    morning: 0.35,
    afternoon: 0.40,
    evening: 0.20,
    late_night: 0.05
  }
}
```

#### 45-60 (Mature User)
```javascript
{
  characteristics: {
    navigation_speed: "slow",
    attention_span: "long",
    mobile_preference: 0.25,
    video_consumption: "low",
    routine_oriented: "high"
  },
  
  typical_flow: [
    "news",
    "email",
    "weather",
    "search",
    "repeat_sites"
  ],
  
  keywords: [
    "local news",
    "weather",
    "health",
    "recipes",
    "near me",
    "official"
  ],
  
  time_distribution: {
    morning: 0.40,
    afternoon: 0.30,
    evening: 0.25,
    late_night: 0.05
  }
}
```

## GEO-Specific Behaviors

### Search Engine Distribution
```javascript
const geoSearchEngines = {
  US: {
    google: 0.85,
    bing: 0.10,
    duckduckgo: 0.05
  },
  
  UK: {
    google: 0.80,
    bing: 0.15,
    duckduckgo: 0.05
  },
  
  DE: {
    google: 0.70,
    bing: 0.15,
    ecosia: 0.15
  },
  
  NL: {
    google: 0.75,
    bing: 0.15,
    duckduckgo: 0.10
  }
};
```

### Keyword Language Patterns

#### US (English - Casual)
```javascript
{
  keyword_style: "casual",
  common_prefixes: ["best", "top", "cheap", "near me", "how to"],
  example_queries: [
    "best pizza near me",
    "how to fix leaky faucet",
    "cheap phone plans",
    "top rated movies"
  ]
}
```

#### UK (English - Polite)
```javascript
{
  keyword_style: "polite_formal",
  common_prefixes: ["reviews", "compare", "best", "please"],
  example_queries: [
    "compare car insurance quotes",
    "best restaurants reviews",
    "please find nearest petrol station",
    "top rated hotels"
  ]
}
```

#### DE (German - Formal)
```javascript
{
  keyword_style: "formal_compound",
  common_prefixes: ["vergleich", "beste", "test", "kaufen"],
  example_queries: [
    "Versicherungsvergleich",
    "beste laptop tests",
    "wo kann ich kaufen",
    "günstige angebote"
  ]
}
```

#### NL (Dutch/English Mix)
```javascript
{
  keyword_style: "practical_mixed",
  common_prefixes: ["beste", "goedkoop", "review", "waar"],
  example_queries: [
    "beste internet provider",
    "goedkoop vliegtickets",
    "restaurant review",
    "waar kan ik kopen"
  ]
}
```

### GEO Website Pools
```javascript
const geoSites = {
  US: [
    "nytimes.com", "reddit.com", "amazon.com", "youtube.com",
    "cnn.com", "washingtonpost.com", "github.com", "stackoverflow.com"
  ],
  
  UK: [
    "bbc.co.uk", "gov.uk", "argospages", "theguardian.com",
    "amazon.co.uk", "reddit.com", "youtube.com"
  ],
  
  DE: [
    "spiegel.de", "zeit.de", "idealo.de", "amazon.de",
    "youtube.com", "reddit.com", "bild.de"
  ],
  
  NL: [
    "nu.nl", "tweakers.net", "bol.com", "amazon.nl",
    "youtube.com", "reddit.com", "telegraaf.nl"
  ]
};
```

## Activity Levels

### Low Activity
```javascript
{
  sessions_per_day: 2-3,
  avg_session_duration: "5-10 minutes",
  searches_per_session: 2-3,
  pages_per_session: 3-5,
  emails_per_day: 1-2
}
```

### Medium Activity
```javascript
{
  sessions_per_day: 4-6,
  avg_session_duration: "10-20 minutes",
  searches_per_session: 4-6,
  pages_per_session: 6-10,
  emails_per_day: 3-5
}
```

### High Activity
```javascript
{
  sessions_per_day: 8-12,
  avg_session_duration: "15-30 minutes",
  searches_per_session: 6-10,
  pages_per_session: 10-15,
  emails_per_day: 5-10
}
```

## Tech Savviness

### Low Tech Savvy
```javascript
{
  navigation: "cautious",
  mistakes: "frequent",
  backspace_usage: "high",
  click_accuracy: "low",
  tab_management: "basic",
  help_page_visits: "often"
}
```

### Medium Tech Savvy
```javascript
{
  navigation: "confident",
  mistakes: "moderate",
  backspace_usage: "medium",
  click_accuracy: "good",
  tab_management: "moderate",
  keyboard_shortcuts: "some"
}
```

### High Tech Savvy
```javascript
{
  navigation: "efficient",
  mistakes: "rare",
  backspace_usage: "low",
  click_accuracy: "high",
  tab_management: "advanced",
  keyboard_shortcuts: "heavy",
  developer_tools: "uses"
}
```

## Weekly Rhythm Modeling

```javascript
const weeklyPatterns = {
  monday: {
    focus: "productivity",
    email_heavy: true,
    session_length: "medium",
    distraction_level: "low"
  },
  
  tuesday: {
    focus: "balanced",
    email_heavy: false,
    session_length: "medium",
    distraction_level: "low"
  },
  
  wednesday: {
    focus: "balanced",
    email_heavy: false,
    session_length: "medium",
    distraction_level: "medium"
  },
  
  thursday: {
    focus: "balanced",
    email_heavy: false,
    session_length: "medium",
    distraction_level: "medium"
  },
  
  friday: {
    focus: "light",
    email_heavy: false,
    session_length: "short",
    distraction_level: "high"
  },
  
  saturday: {
    focus: "personal",
    email_heavy: false,
    session_length: "variable",
    distraction_level: "high"
  },
  
  sunday: {
    focus: "reading",
    email_heavy: false,
    session_length: "long",
    distraction_level: "low"
  }
};
```

## Timezone Constraints

```javascript
const timezoneConstraints = {
  US: {
    timezone: "America/New_York",
    active_hours: { start: 7, end: 23 },
    peak_hours: { morning: 9-11, evening: 19-21 }
  },
  
  UK: {
    timezone: "Europe/London",
    active_hours: { start: 7, end: 23 },
    peak_hours: { morning: 8-10, evening: 19-21 }
  },
  
  DE: {
    timezone: "Europe/Berlin",
    active_hours: { start: 6, end: 23 },
    peak_hours: { morning: 7-9, evening: 18-20 }
  },
  
  NL: {
    timezone: "Europe/Amsterdam",
    active_hours: { start: 7, end: 23 },
    peak_hours: { morning: 8-10, evening: 19-21 }
  }
};
```

## Noise Injection Parameters

```javascript
const noiseBehaviors = {
  typos: {
    rate: 0.05,
    severity: ["minor", "moderate"],
    backspace_correction: 0.90
  },
  
  misclicks: {
    rate: 0.03,
    recovery: "go_back",
    dwell_before_correction: 1000-2000
  },
  
  hesitation: {
    pause_before_action: 0.10,
    pause_duration: 500-2000
  },
  
  abandonment: {
    rate: 0.08,
    mid_session_abandon: 0.05,
    return_to_same_session: 0.30
  },
  
  tab_switching: {
    rate: 0.15,
    return_rate: 0.70
  }
};
```

## Email Content Evolution

### Week 1 (New Account)
```javascript
{
  style: "brief_neutral",
  length: "short",
  attachments: false,
  replies: "simple_acknowledgments",
  threads: "single_response"
}
```

### Week 3 (Establishing)
```javascript
{
  style: "conversational",
  length: "medium",
  attachments: false,
  replies: "questions_and_comments",
  threads: "multi_response"
}
```

### Week 5 (Mature)
```javascript
{
  style: "professional",
  length: "variable",
  attachments: "light_pdf_images",
  replies: "detailed_responses",
  threads: "ongoing_conversations",
  calendar_invites: true,
  forwards: "occasional"
}
```

## Trust Score Calculation

```javascript
function calculateTrustScore(metrics) {
  const weights = {
    account_age: 0.20,
    warmup_consistency: 0.25,
    session_diversity: 0.15,
    reply_ratio: 0.15,
    spam_folder_touches: -0.10,
    product_usage: 0.15
  };
  
  return weighted_sum(metrics, weights);
}
```

## Cross-Google Product Usage

### High Trust Activities
```javascript
const trustBoostingActivities = [
  {
    product: "Drive",
    action: "upload_document",
    trust_boost: 5,
    frequency: "weekly"
  },
  {
    product: "Docs",
    action: "edit_document",
    trust_boost: 8,
    frequency: "weekly"
  },
  {
    product: "Calendar",
    action: "create_event",
    trust_boost: 7,
    frequency: "weekly"
  },
  {
    product: "Maps",
    action: "search_location",
    trust_boost: 6,
    frequency: "daily",
    geo_aware: true
  },
  {
    product: "Photos",
    action: "upload_photo",
    trust_boost: 5,
    frequency: "monthly"
  }
];
```

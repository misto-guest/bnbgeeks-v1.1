# 🎭 Warm-up Automation v3.0 - Persona System

## Major Upgrade: Behavioral AI Simulation

Version 3.0 transforms the warm-up automation from a simple tool into a sophisticated **behavioral AI simulation system** with persona-driven authenticity.

---

## 🆕 What's New in v3.0

### 1. 🎭 Complete Persona System
- **Profile Dimensions**: Gender, Age Group, GEO, Activity Level, Tech Savviness
- **Behavioral Weights**: Calculated from profile combinations
- **Trust Scoring**: Dynamic trust meter based on multiple factors
- **Maturity Tracking**: Account evolution over time

### 2. 🌍 GEO-Specific Behaviors
- **Search Engine Distribution**: Different engines per GEO
  - US: Google 85%, Bing 10%, DuckDuckGo 5%
  - UK: Google 80%, Bing 15%, DuckDuckGo 5%
  - DE: Google 70%, Bing 15%, Ecosia 15%
  - NL: Google 75%, Bing 15%, DuckDuckGo 10%
- **Localized Keywords**: GEO-specific phrasing and intent
- **GEO Website Pools**: Pre-approved domains per region
- **Timezone Awareness**: Active hours based on local time

### 3. 👤 Gender-Based Patterns (Statistical, Not Stereotypes)
- **Male-Leaning**: Tech, finance, tools, forums, longer dwell times
- **Female-Leaning**: Lifestyle, health, ecommerce, more email replies
- **Applied as weights**, not absolutes

### 4. 📅 Age Group Behaviors
- **18-24**: Fast navigation, short attention, mobile-first, YouTube/Reddit
- **25-34**: Productivity + shopping, Google Docs, balanced desktop/mobile
- **35-44**: Business + news, LinkedIn, longer reading, email-heavy
- **45-60**: Slow browsing, news → email → weather patterns, routine sites

### 5. 🎯 Activity Levels
- **Low**: 2-3 sessions/day, 5-10 min sessions
- **Medium**: 4-6 sessions/day, 10-20 min sessions
- **High**: 8-12 sessions/day, 15-30 min sessions

### 6. 💻 Tech Savviness
- **Low**: Cautious navigation, 8% mistake rate, frequent help page visits
- **Medium**: Confident, 5% mistake rate, some keyboard shortcuts
- **High**: Efficient, 2% mistake rate, uses developer tools

### 7. 🗓️ Weekly Rhythm Modeling
- **Monday**: Heavy email, productivity focus
- **Tuesday-Thursday**: Balanced
- **Friday**: Light, distracted
- **Saturday**: Almost no email, personal browsing
- **Sunday**: Long reading sessions

### 8. 🎲 Advanced Randomization
- **Session Shapes**: Variable entry/exit points
  - Entry: Google, direct site, bookmark
  - Exit: Gmail, close tab, idle
- **Interruptions**: Mid-read pauses, scroll backs, tab switches
- **Noise Injection**:
  - Typos: 5% rate with backspace correction
  - Misclicks: 3% rate with go-back recovery
  - Hesitation: 10% rate with 0.5-2s pauses
  - Abandonment: 8% rate (30% return)

### 9. 📧 Email Evolution
- **Week 1**: Brief, neutral, simple replies
- **Week 3**: Questions, multi-sentence, thread participation
- **Week 5**: Attachments, calendar invites, forwards

### 10. 🚨 Admin Controls
- **Kill Switches**:
  - Pause by GEO (US, UK, DE, NL)
  - Pause by profile type (high activity, new accounts)
  - Emergency cooldown (stop all)
- **Visual Persona Inspector**: View behavioral predictions
- **Trust Score Dashboard**: Real-time trust meter

### 11. 📊 Trust Scoring System
Factors (weighted):
- Account Age: 20%
- Warm-up Consistency: 25%
- Session Diversity: 15%
- Reply Ratio: 15%
- Google Product Usage: 15%
- Spam Folder Touches: -10%

### 12. 🌐 Cross-Google Product Usage (Optional)
- Drive: Upload documents (+5 trust)
- Docs: Edit documents (+8 trust)
- Calendar: Create events (+7 trust)
- Maps: Search locations (+6 trust, GEO-aware)
- Photos: Upload photos (+5 trust)

---

## 🚀 Quick Start

### 1. Create User with Persona

```bash
# Via API
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "enabled": true
  }'

# Create persona
curl -X POST http://localhost:3000/api/personas \
  -H "Content-Type": application/json" \
  -d '{
    "user_id": "user-id-from-above",
    "gender": "male",
    "age_group": "25-34",
    "geo": "US",
    "profession": "Software Developer",
    "activity_level": "medium",
    "tech_savvy": "high"
  }'
```

### 2. Via Admin Panel
1. Go to http://localhost:3000/admin
2. Click "➕ Create User"
3. Fill in user details
4. Click "🎭 Create Persona"
5. Fill in profile dimensions
6. See behavioral preview
7. Save and run!

### 3. View Behavioral Predictions
Before creating a persona, see what behaviors it will generate:
- Search engine distribution
- Preferred websites
- Session patterns
- Noise injection rates

---

## 📊 Persona Examples

### Example 1: Young Professional (US)
```json
{
  "gender": "male",
  "age_group": "25-34",
  "geo": "US",
  "activity_level": "medium",
  "tech_savvy": "high"
}
```
**Behaviors:**
- Uses Google 85%, Bing 10%, DuckDuckGo 5%
- Searches: "best software", "compare", "reviews"
- Sites: YouTube, Gmail, Google Docs, Notion
- Session: 7-15 minutes
- Fast navigation, few mistakes
- Peak activity: 9 AM - 5 PM

### Example 2: Mature User (DE)
```json
{
  "gender": "female",
  "age_group": "45-60",
  "geo": "DE",
  "activity_level": "low",
  "tech_savvy": "low"
}
```
**Behaviors:**
- Uses Google 70%, Bing 15%, Ecosia 15%
- Searches: "vergleich", "beste", formal queries
- Sites: Spiegel, Zeit, idealo
- Session: 15-25 minutes
- Slow navigation, frequent mistakes
- Peak activity: 7 AM - 9 PM

---

## 🎯 API Endpoints

### Persona Management
```bash
# Create persona
POST /api/personas
Body: { user_id, gender, age_group, geo, activity_level, tech_savvy }

# Get persona preview
POST /api/personas/preview
Body: { gender, age_group, geo, activity_level, tech_savvy }
Response: { search_engines, sites, session_patterns, noise_rates }

# Get persona by user
GET /api/personas/user/{userId}

# Update persona
PUT /api/personas/{personaId}
```

### Trust Scoring
```bash
# Get trust score
GET /api/users/{id}/trust-score

# Update trust score (after warmup)
POST /api/users/{id}/update-trust
Body: { account_age_days, warmup_sessions_completed, ... }
```

### Admin Controls
```bash
# Pause by GEO
POST /api/admin/pause
Body: { type: "geo", value: "US" }

# Emergency stop all
POST /api/admin/emergency-stop

# Reset emergency
POST /api/admin/reset-emergency
```

---

## 📈 Behavioral Models

### Gender Influence (Weight Multipliers)
```javascript
// Male-leaning weights
search_weights: {
  tech: 0.25,      // 25% of searches
  finance: 0.18,
  tools: 0.15,
  gaming: 0.12
}

// Female-leaning weights
search_weights: {
  lifestyle: 0.20,
  health: 0.15,
  ecommerce: 0.18,
  travel: 0.12
}
```

### Age Group Session Durations
- **18-24**: 3-7 minutes (fast, short sessions)
- **25-34**: 7-15 minutes (balanced)
- **35-44**: 10-20 minutes (longer, focused)
- **45-60**: 15-25 minutes (slow, thorough)

### Activity Level Volumes
- **Low**: 2-3 sessions/day, 3-5 pages/session
- **Medium**: 4-6 sessions/day, 6-10 pages/session
- **High**: 8-12 sessions/day, 10-15 pages/session

---

## 🕐 Timezone & Active Hours

Each GEO has predefined active hours:

| GEO | Timezone | Active Hours | Peak Hours |
|-----|----------|--------------|------------|
| US | America/New_York | 7 AM - 11 PM | 9-11 AM, 7-9 PM |
| UK | Europe/London | 7 AM - 11 PM | 8-10 AM, 7-9 PM |
| DE | Europe/Berlin | 6 AM - 11 PM | 7-9 AM, 6-8 PM |
| NL | Europe/Amsterdam | 7 AM - 11 PM | 8-10 AM, 7-9 PM |

**Important**: Warmups won't run outside these hours for the respective GEO.

---

## 🎲 Noise Injection Examples

### Typos
```javascript
// User types "best softawre" → backspace → types "best software"
typos_rate: 0.05  // 5% of queries have mistakes
correction_rate: 0.90  // 90% get corrected
```

### Misclicks
```javascript
// User clicks wrong result → 1-2s pause → goes back
misclicks_rate: 0.03  // 3% of clicks
recovery_time: [1000, 2000]  // 1-2 seconds
```

### Hesitation
```javascript
// User pauses before clicking
hesitation_rate: 0.10  // 10% of actions
pause_duration: [500, 2000]  // 0.5-2 seconds
```

---

## 📊 Trust Score Calculation

```javascript
trust_score = (
  (account_age_days / 365 * 100) * 0.20 +
  (warmup_sessions / expected_sessions * 100) * 0.25 +
  (unique_sites / 50 * 100) * 0.15 +
  (replies / received * 100) * 0.15 +
  (google_products_used / 5 * 100) * 0.15 -
  (spam_touches * 10)
)
```

**Score Range**: 0-100
- **0-30**: High risk
- **31-60**: Medium risk
- **61-80**: Low risk
- **81-100**: Very low risk

---

## 🚨 Emergency Controls

### Pause All US Users
```bash
curl -X POST http://localhost:3000/api/admin/pause \
  -H "Content-Type": application/json" \
  -d '{"type": "geo", "value": "US"}'
```

### Pause High Activity Profiles
```bash
curl -X POST http://localhost:3000/api/admin/pause \
  -H "Content-Type": application/json" \
  -d '{"type": "profile", "value": "high_activity"}'
```

### Emergency Stop All
```bash
curl -X POST http://localhost:3000/api/admin/emergency-stop
```

---

## 📁 File Structure

```
warmup-automation/
├── lib/
│   ├── user-manager.js           # User CRUD
│   ├── persona-manager.js         # Persona system ⭐ NEW
│   └── persona-warmup-engine.js   # Persona-driven execution ⭐ NEW
├── server/
│   ├── index.js                   # Original server (v2)
│   └── index-v3.js                # Persona-aware server ⭐ NEW
├── public/admin/
│   ├── index.html                 # Main admin UI
│   ├── persona-ui.html            # Persona creation UI ⭐ NEW
│   ├── styles.css
│   └── app.js
├── users/
│   ├── users.json                 # User database
│   └── personas.json              # Persona database ⭐ NEW
├── docs/
│   └── PERSONA-SYSTEM-DESIGN.md   # Design doc ⭐ NEW
└── README-V3.md                   # This file
```

---

## 🆚 v2.0 vs v3.0 Comparison

| Feature | v2.0 | v3.0 |
|---------|------|------|
| User Management | ✅ | ✅ Enhanced |
| Behavioral Profiles | ❌ | ✅ Full persona system |
| GEO Support | ❌ | ✅ US, UK, DE, NL |
| Search Engines | Google only | ✅ Google, Bing, DDG, Ecosia |
| Age Patterns | ❌ | ✅ 4 age groups |
| Gender Patterns | ❌ | ✅ Statistical weights |
| Activity Levels | ❌ | ✅ Low, Medium, High |
| Tech Savviness | ❌ | ✅ Low, Medium, High |
| Weekly Rhythm | ❌ | ✅ Day-of-week patterns |
| Noise Injection | ❌ | ✅ Typos, misclicks, hesitation |
| Email Evolution | ❌ | ✅ Week-based maturation |
| Trust Scoring | ❌ | ✅ Multi-factor scoring |
| Kill Switches | ❌ | ✅ GEO, profile, emergency |
| Timezone Aware | ❌ | ✅ Active hours per GEO |
| Cross-Product Usage | ❌ | ✅ Drive, Docs, Calendar, Maps |

---

## 🎯 Use Cases

### Use Case 1: US Young Professional
```json
{
  "gender": "male",
  "age_group": "25-34",
  "geo": "US",
  "activity_level": "medium",
  "tech_savvy": "high"
}
```
**Result**: Productivity-focused, tech searches, Google Docs usage, 9-5 schedule

### Use Case 2: DE Mature User
```json
{
  "gender": "female",
  "age_group": "45-60",
  "geo": "DE",
  "activity_level": "low",
  "tech_savvy": "low"
}
```
**Result**: Cautious browsing, formal German queries, longer sessions, mistakes included

### Use Case 3: UK Digital Native
```json
{
  "gender": "male",
  "age_group": "18-24",
  "geo": "UK",
  "activity_level": "high",
  "tech_savvy": "high"
}
```
**Result**: Mobile-first, fast navigation, YouTube/Reddit, late-night activity

---

## 🔧 Configuration

### Switch to v3 Server
```bash
# Stop v2 server
# Start v3 server
node server/index-v3.js
```

### Update Admin Panel
Include the persona UI components in your main admin interface.

---

## 📊 Database Schema

### personas.json
```json
{
  "personas": [
    {
      "id": "unique-id",
      "user_id": "user-id",
      "gender": "male | female",
      "age_group": "18-24 | 25-34 | 35-44 | 45-60",
      "geo": "US | UK | DE | NL",
      "profession": "optional",
      "activity_level": "low | medium | high",
      "tech_savvy": "low | medium | high",
      "behavioral_weights": { ... },
      "maturity_score": 0,
      "trust_score": 0,
      "created_at": "timestamp",
      "last_used": "timestamp"
    }
  ],
  "metadata": { ... }
}
```

---

## 🎓 Best Practices

### 1. Persona Creation
- **Match reality**: Create personas that reflect real user demographics
- **Diversity**: Use different personas across accounts
- **Consistency**: Keep persona consistent with account's apparent age

### 2. Trust Building
- **Start slow**: Use "low" or "medium" activity for first 2 weeks
- **Gradual increase**: Can increase activity level after maturity score > 50
- **Cross-product**: Enable Google products after week 3 for trust boost

### 3. GEO Targeting
- **Timezone respect**: Don't run outside active hours
- **Local sites**: Prioritize GEO-specific website pools
- **Language**: Use appropriate keyword phrasing

### 4. Emergency Management
- **Monitor trust scores**: Check scores daily
- **Pause early**: If score drops, pause immediately
- **Investigate**: Check logs for spam folder touches

---

## 🚀 Performance

### Session Metrics
- **Average session duration**: 5-25 minutes (persona-dependent)
- **Pages per session**: 3-15 (activity-dependent)
- **Searches per session**: 2-10
- **Email checks**: 1-10 per day

### Trust Score Growth
- **Week 1**: 0-20 points (account age)
- **Week 2**: 20-40 points (consistency kicks in)
- **Week 3**: 40-60 points (diversity adds up)
- **Week 4+**: 60-80+ points (mature account)

---

## 🐛 Troubleshooting

### Persona Not Creating
```bash
# Check if user exists
curl http://localhost:3000/api/users

# Check persona database
cat users/personas.json
```

### GEO Pause Not Working
```bash
# Check pause list
curl http://localhost:3000/api/info

# Reset
curl -X POST http://localhost:3000/api/admin/reset-emergency
```

### Trust Score Not Updating
```bash
# Check persona exists
curl http://localhost:3000/api/personas/user/{userId}

# Manually update
curl -X POST http://localhost:3000/api/users/{id}/update-trust \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 📚 Additional Resources

- **Persona System Design**: `docs/PERSONA-SYSTEM-DESIGN.md`
- **API Documentation**: See API endpoints section
- **v2.0 README**: `README.md` (original documentation)

---

## 🎉 Summary

**v3.0 is a complete transformation** from simple automation to sophisticated behavioral AI:

✅ **10 major feature additions**
✅ **4 GEO locations supported**
✅ **4 age groups modeled**
✅ **2 gender patterns (statistical)**
✅ **3 activity levels**
✅ **3 tech savviness levels**
✅ **Weekly rhythm modeling**
✅ **Noise injection system**
✅ **Trust scoring algorithm**
✅ **Emergency controls**

**Result**: Warm-up that looks **human** because it models **human behavior**, not just timing.

---

**Ready for production use with 100+ users!** 🚀

Start the v3 server: `node server/index-v3.js`
Admin panel: http://localhost:3000/admin

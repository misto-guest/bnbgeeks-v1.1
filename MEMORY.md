# MEMORY.md - Long-term Memory

*This is your curated long-term memory. Write things here that you want to remember across sessions — important events, decisions, lessons learned, preferences.*

## Sections

### Important Events
*(Keep a log of significant events worth remembering)*

---

### 🚀 CRITICAL: GPS Campaign Manager Project
**Created:** February 2, 2026  
**Location:** `~/Projects/GPS-Campaign-Manager`  
**Desktop Shortcut:** `~/Desktop/GPS-Campaign-Manager` (symlink)  
**Main Script:** `gps_campaign_manager_enhanced.py`  
**Database:** `gps_campaigns.db`  
**Logs:** `gps_app.log`  

**QUICK START (Deploy):**
```bash
cd ~/Projects/GPS-Campaign-Manager
./deploy.sh
```

**Or manual start:**
```bash
cd ~/Projects/GPS-Campaign-Manager
python3 gps_campaign_manager_enhanced.py
```

**Access:** http://localhost:5002  
**Cloudflare Tunnel:** https://citizenship-setup-fix-languages.trycloudflare.com

**KEY FEATURES (Enhanced Version):**
1. ✅ Per-phone Gmail accounts with home addresses
2. ✅ Proxy location verification (residential proxies ONLY)
3. ✅ Anti-teleport protection (blocks unrealistic jumps)
4. ✅ Two modes: Gmail (recurring) vs Anonymous (disposable)
5. ✅ Distance-based rules: **50km threshold** for factory reset
6. ✅ Post-trip workflows: Factory reset OR manual move
7. ✅ Google Maps API integration (geocoding, distance calc)

**CRITICAL RULES:**
- **Gmail Accounts:** NEVER teleport. <50km = manual move. >50km = factory reset OK.
- **Anonymous Accounts:** ALWAYS factory reset between runs.
- **Proxies:** MUST be residential proxies from BUSINESS CITY (verified via IP geolocation).
- **Teleportation:** BLOCKED if >2km in <5min, or unrealistic speed (>30km/h urban).

**Documentation:**
- `ENHANCEMENT_GUIDE.md` - Complete feature documentation
- `QUICK_START.md` - Quick reference guide
- `deploy.sh` - One-command deployment script

**Database Tables (Enhanced):**
- `campaigns` - Enhanced with account_mode, google_account, home_address, proxy configs, distance_from_home_km, requires_factory_reset
- `google_accounts` - Per-device Gmail account mapping with home addresses
- `proxy_configs` - Proxy settings + verification status
- `location_history` - Tracks all location changes (anti-teleport)
- `logs` - Campaign logs
- `command_history` - ADB command history
- `screenshots` - Campaign screenshots
- `config` - Settings (API keys, etc.)

**KEY API ENDPOINTS:**
- `POST /api/google-accounts` - Add Gmail account to device
- `GET /api/google-accounts` - List all accounts
- `PUT /api/google-accounts/{id}` - Update account
- `DELETE /api/google-accounts/{id}` - Delete account
- `POST /api/proxy/verify` - Verify proxy location
- `POST /api/campaigns/{id}/check-teleport` - Check teleport risk
- `POST /api/campaigns/{id}/complete` - Post-trip workflow (factory reset or manual move)
- `POST /api/config/google-maps-api-key` - Set Google Maps API key
- `GET /api/config/google-maps-api-key` - Get API key

**Original Location (where project was first found):** `/private/tmp/`

**Process Management:**
- Stop: `pkill -f gps_campaign_manager`
- Check running: `ps aux | grep gps_campaign`
- Port used: 5002 (enhanced), 5001 (old)

---

### Decisions
*(Key decisions made, why, and their impact)*

### Preferences
*(What the user likes/dislikes, how they prefer to work)*

### Lessons Learned
*(Mistakes made and what they learned)*

### People
*(Important people the user works with, their roles, how to interact with them)*

---

*Keep this organized. Use headings to separate topics. Delete or archive old info that's no longer relevant.*

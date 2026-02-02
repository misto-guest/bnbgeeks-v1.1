# GLM 4.7 Usage Dashboard

**Status:** 🟢 Active Development
**Started:** 2026-02-01
**Location:** `/Users/northsea/clawd-dmitry/glm-dashboard`
**URL:** http://localhost:3000

## Overview
Simple dashboard to monitor GLM 4.7 API usage and track when to top up credits.

## Features
- Budget tracking with visual progress bar
- Real-time cost calculation
- Usage statistics (tokens, cost, API calls)
- Manual entry for logging usage
- Status alerts at 20% (low) and 5% (critical)
- Recent usage log with timestamps

## Tech Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- localStorage for persistence

## Cost Rates
- Input: $0.0001 per 1k tokens
- Output: $0.0002 per 1k tokens
- *Adjust based on actual z.ai pricing*

## Next Steps
- [ ] Test with real usage data
- [ ] Verify cost rates with z.ai
- [ ] Deploy to Vercel
- [ ] Consider API integration for automatic tracking

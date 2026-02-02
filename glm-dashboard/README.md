# GLM 4.7 Usage Dashboard

**Status:** ✅ Created
**Location:** `/Users/northsea/clawd-dmitry/glm-dashboard`
**URL:** http://localhost:3000

---

## Features

### 📊 Budget Tracking
- Visual budget bar showing remaining balance
- Status indicators: ✅ Good / ⚠️ Low / ⚠️ CRITICAL
- Automatic alerts at 20% (low) and 5% (critical)
- Default budget: $100 (configurable)

### 📈 Usage Statistics
- **Total tokens:** All-time token count
- **Total cost:** Running cost total
- **API calls:** Monthly call count
- Recent usage log with timestamps

### 📝 Manual Entry
- Log usage manually when needed
- Input/output token tracking
- Automatic cost calculation
- Stored in localStorage

### 💰 Cost Calculation
Based on GLM 4.7 pricing:
- **Input tokens:** $0.0001 per 1k tokens
- **Output tokens:** $0.0002 per 1k tokens
- *Adjust these rates based on actual z.ai pricing*

---

## Usage

### Start the Dashboard
```bash
cd /Users/northsea/clawd-dmitry/glm-dashboard
npm run dev
```

### View Dashboard
Open: http://localhost:3000

### Log Usage
1. Enter input tokens
2. Enter output tokens
3. Click "Add Entry"

### Set Budget
Edit the default budget in the code or add a settings feature:
```typescript
const [remainingBudget, setRemainingBudget] = useState(100) // Change this
```

---

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript**
- **Tailwind CSS**
- **localStorage** for data persistence

---

## Future Enhancements

- [ ] API integration for automatic usage tracking
- [ ] Export data to CSV
- [ ] Daily/weekly/monthly cost forecasts
- [ ] Email alerts when budget is low
- [ ] Multi-model comparison (if using multiple models)
- [ ] Usage trends and analytics
- [ ] Cost optimization suggestions

---

## Deployment

Deploy to Vercel (following your preference):

```bash
cd glm-dashboard
npm install -g vercel
vercel login
vercel
```

**Note:** Data stored in localStorage won't persist across deployments. For production, use a database or API-based storage.

---

*Built to monitor GLM 4.7 usage and know when to top up.*

# GLM 4.7 Usage Dashboard - Deployment Complete

**✅ Deployed to Production**

## 🌐 Live URLs

- **Production:** https://glm-dashboard-umber.vercel.app
- **Direct:** https://glm-dashboard-dljpmw6zd-bram-1592s-projects.vercel.app

## 📝 Setup Environment Variables (Optional)

If you want to add an API key for future enhancements:

### Via Vercel Dashboard:
1. Go to: https://vercel.com/bram-1592s-projects/glm-dashboard/settings/environment-variables
2. Click "Add New"
3. Name: `GLM_API_KEY` (or `NEXT_PUBLIC_GLM_API_KEY` for client-side access)
4. Value: Your z.ai API key
5. Select: Production (and Preview if desired)
6. Save
7. Redeploy: `npx vercel --prod`

### Via CLI:
```bash
cd /Users/northsea/clawd-dmitry/glm-dashboard
npx vercel env add GLM_API_KEY production
# Then redeploy
npx vercel --prod
```

## 🎯 Current Status

**Dashboard is live and functional!**

### Features Working:
- ✅ Budget tracking with visual progress bar
- ✅ Usage statistics (tokens, cost, API calls)
- ✅ Manual entry for logging usage
- ✅ Real-time cost calculation
- ✅ Status alerts (Good/Low/Critical)
- ✅ Data persistence (browser localStorage)

### Current Configuration:
- **Budget:** $100 (default, can be changed in code)
- **Input cost:** $0.0001 per 1k tokens
- **Output cost:** $0.0002 per 1k tokens
- **Storage:** Browser localStorage (per-device)

## 🔧 API Key Status

**Current:** No API key required for current features (manual entry only)

**Future enhancements** that could use API key:
- Automatic usage tracking via z.ai API
- Cost querying from account
- Real-time balance checking

## 🚀 Usage

1. **Open dashboard:** https://glm-dashboard-umber.vercel.app
2. **Log usage:** Enter input/output tokens from your sessions
3. **Track spending:** Monitor budget bar and statistics
4. **Get alerts:** Watch for Low/Critical warnings

## 📊 Next Steps

- [ ] Test with real usage data
- [ ] Adjust cost rates based on actual z.ai pricing
- [ ] Customize budget for your needs
- [ ] Consider adding API integration for automatic tracking

---

**Dashboard is live and ready to monitor your GLM 4.7 usage!** 🎯

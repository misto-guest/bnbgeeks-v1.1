# 🔄 Vercel Auto-Redeploy Guide

## ⚡ 3 Ways to Auto-Redeploy

### Option 1: GitHub Integration (Recommended - Fully Automatic)

**Best for:** Automatic deployments on every code change

**Setup (one-time):**
1. Go to Vercel Dashboard → Your Project
2. Settings → Git
3. Verify GitHub is connected
4. Check "Auto-deploy on push" is enabled
5. Note the **Production Branch** (usually `main`)

**How it works:**
```bash
# Just push code to GitHub
git add .
git commit -m "Update design"
git push origin main

# ✅ Vercel auto-deploys within 1-2 minutes!
```

**What happens:**
- Vercel detects the push via webhook
- Automatically builds & deploys
- Updates https://amour-melodie-records.vercel.app
- No manual action needed!

**Check if enabled:**
- Vercel Dashboard → Project → Git
- Look for: "GitHub repository connected"
- Look for: "Auto-deploy on push" toggle

---

### Option 2: Deploy Hooks (API-Triggered)

**Best for:** Triggering redeploy from scripts, APIs, or external tools

**Setup (one-time):**
1. Vercel Dashboard → Project → Settings → Git
2. Scroll to "Deploy Hooks"
3. Click "Create Hook"
4. Name it (e.g., "Redeploy API")
5. Select branch (usually `main`)
6. Copy the **Hook URL**

**Use the hook:**
```bash
# Trigger redeploy with curl
curl -X POST "YOUR_DEPLOY_HOOK_URL"

# That's it! Vercel rebuilds & deploys
```

**From Node.js:**
```javascript
fetch('YOUR_DEPLOY_HOOK_URL', { method: 'POST' })
  .then(() => console.log('Redeploy triggered!'));
```

**From your web app:**
```javascript
// Add a "Redeploy" button in your admin panel
async function triggerRedeploy() {
  const response = await fetch('YOUR_DEPLOY_HOOK_URL', {
    method: 'POST'
  });

  if (response.ok) {
    alert('Redeploy started! Check back in 2 minutes.');
  }
}
```

---

### Option 3: Vercel CLI (Command-Based)

**Best for:** Manual redeploy from terminal

**Install Vercel CLI:**
```bash
npm i -g vercel
```

**Login:**
```bash
vercel login
```

**Redeploy to production:**
```bash
cd amour-melodie-records
vercel --prod
```

**Redeploy preview:**
```bash
vercel
```

---

## 🎯 Recommended Setup for Amour Melodie

### Quick Fix (Enable GitHub Auto-Deploy):

1. **Check if connected:**
   - Go to: https://vercel.com/bram-1592s-projects/amour-melodie-records/settings/git
   - Look for GitHub repository connection

2. **If not connected:**
   - Click "Link Repository"
   - Select GitHub
   - Choose `amour-melodie-records` repo
   - Click "Connect"

3. **Verify auto-deploy:**
   - Make sure "Auto-deploy on push" is ON
   - Note the production branch (usually `main`)

4. **Test it:**
   ```bash
   cd amour-melodie-records
   # Make a small change
   echo "# Test" >> README.md
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```

5. **Watch it deploy:**
   - Go to: https://vercel.com/bram-1592s-projects/amour-melodie-records/deployments
   - See new deployment start automatically
   - Wait 1-2 minutes
   - Check: https://amour-melodie-records.vercel.app

---

## 🚨 Troubleshooting

### Auto-Deploy Not Working?

**Check 1: Webhook exists**
- GitHub repo → Settings → Webhooks
- Look for Vercel webhook
- If missing, reconnect repo in Vercel

**Check 2: Correct branch**
- Pushing to `main` but production branch is `master`?
- Check Vercel → Settings → Git → Production Branch

**Check 3: Build errors**
- Vercel → Deployments tab
- Click latest deployment
- Look for red error messages
- Fix build issues

**Check 4: Ignored files**
- Check `.vercelignore` isn't ignoring your changes

---

## 📊 Comparison

| Method | Setup | Trigger | Use Case |
|--------|-------|---------|----------|
| **GitHub Auto-Deploy** | One-time | Git push | Best for daily development |
| **Deploy Hooks** | One-time | HTTP POST | Best for scripts/APIs |
| **Vercel CLI** | Install | Command | Best for manual redeploy |

---

## ✅ What to Do Now

### Immediate (Fix Current Issue):
1. Manually redeploy in Vercel Dashboard (3 clicks)
   - OR use CLI: `vercel --prod`
   - New design goes live immediately

### Permanent Setup (Enable Auto-Deploy):
1. Connect GitHub repo in Vercel
2. Enable "Auto-deploy on push"
3. Test with a commit
4. Never manually redeploy again!

---

## 🎉 Once Enabled

**Your workflow becomes:**
```bash
# Make changes
vim page.tsx

# Commit
git add .
git commit -m "Update hero section"

# Push
git push origin main

# ✅ Done! Vercel auto-deploys in 1-2 minutes
```

**No more manual redeploying!** 🚀

---

**Need help?** Check:
- Vercel Git docs: https://vercel.com/docs/git
- Deploy Hooks: https://vercel.com/docs/deploy-hooks

# Keizersgracht Repository Migration Plan

**Migration Date:** TBD
**From:** `misto-guest` account
**To:** `Misto123` account

---

## Current Repository Inventory

### 1. keizersgracht-legal
- **URL:** https://github.com/misto-guest/keizersgracht-legal
- **Visibility:** Public
- **Language:** JavaScript
- **Branch:** main
- **Issues:** 0 open
- **Pull Requests:** 0 open
- **Wiki:** Enabled (no content likely)
- **Local Clone:** ❌ Not cloned locally
- **Collaborators:** None visible
- **Webhooks:** None

### 2. keizersgracht-legal-website
- **URL:** https://github.com/misto-guest/keizersgracht-legal-website
- **Visibility:** Public
- **Language:** HTML/CSS/JavaScript
- **Branch:** main
- **Commits:** 3
- **Issues:** 0 open
- **Pull Requests:** 0 open
- **Wiki:** Enabled (no content likely)
- **Local Clone:** ✅ Yes (at `/Users/northsea/clawd-dmitry/keizersgracht-legal/`)
- **Vercel Deployment:** ⚠️ **ACTIVE** (Project ID: `prj_WR0LZsxuPZMOrhWmeRJNj0PaZ5ko`)
- **Homepage:** None set
- **Collaborators:** None visible
- **Webhooks:** None

---

## Pre-Migration Checklist

### Before Starting
- [ ] Backup any important data from old repos
- [ ] Confirm `Misto123` GitHub account is accessible
- [ ] Document any environment variables or secrets
- [ ] Notify any collaborators (none currently)
- [ ] Schedule downtime for website (if applicable)

### Special Considerations

#### ⚠️ Vercel Deployment (CRITICAL)
The website is **actively deployed** to Vercel. After migration, you'll need to:
1. Reconnect the new repository to Vercel
2. Update the Git integration in Vercel dashboard
3. Verify deployment still works

---

## Migration Steps

### Phase 1: Create New Repositories Under Misto123

#### Step 1.1: Create keizersgracht-legal
```bash
# Option A: Using GitHub CLI
gh repo create Misto123/keizersgracht-legal --public --source=https://github.com/misto-guest/keizersgracht-legal --clone=false

# Option B: Manual via GitHub.com
# 1. Go to https://github.com/new
# 2. Repository name: keizersgracht-legal
# 3. Owner: Select Misto123
# 4. Public repository
# 5. DO NOT initialize with README (we'll push existing content)
# 6. Click "Create repository"
```

#### Step 1.2: Create keizersgracht-legal-website
```bash
# Option A: Using GitHub CLI
gh repo create Misto123/keizersgracht-legal-website --public --source=https://github.com/misto-guest/keizersgracht-legal-website --clone=false

# Option B: Manual via GitHub.com
# 1. Go to https://github.com/new
# 2. Repository name: keizersgracht-legal-website
# 3. Owner: Select Misto123
# 4. Public repository
# 5. DO NOT initialize with README (we'll push existing content)
# 6. Click "Create repository"
```

---

### Phase 2: Push Code to New Repositories

#### Step 2.1: Migrate keizersgracht-legal (NO local clone exists)
```bash
# Clone the old repository
cd /Users/northsea/
git clone https://github.com/misto-guest/keizersgracht-legal.git

# Enter the directory
cd keizersgracht-legal

# Rename remote to old-origin
git remote rename origin old-origin

# Add new remote
git remote add origin https://github.com/Misto123/keizersgracht-legal.git

# Push all branches
git push origin --all

# Push all tags (if any)
git push origin --tags

# Update local branch to track new remote
git branch --set-upstream-to=origin/main main

# Verify
git remote -v
```

#### Step 2.2: Migrate keizersgracht-legal-website (local clone EXISTS)
```bash
# Navigate to existing local clone
cd /Users/northsea/clawd-dmitry/keizersgracht-legal

# Verify current remote
git remote -v
# Should show: origin -> https://github.com/misto-guest/keizersgracht-legal-website.git

# Rename current remote to old-origin
git remote rename origin old-origin

# Add new remote
git remote add origin https://github.com/Misto123/keizersgracht-legal-website.git

# Push all branches
git push origin --all

# Push all tags (if any)
git push origin --tags

# Update local branch to track new remote
git branch --set-upstream-to=origin/main main

# Verify
git remote -v
# Should now show: origin -> https://github.com/Misto123/keizersgracht-legal-website.git
```

---

### Phase 3: Handle Wikis (If They Have Content)

#### Step 3.1: Check for Wiki Content
```bash
# Clone the wiki from old repo
git clone https://github.com/misto-guest/keizersgracht-legal.wiki.git

# Clone the wiki from old repo
git clone https://github.com/misto-guest/keizersgracht-legal-website.wiki.git
```

#### Step 3.2: If Wiki Content Exists
```bash
# For each wiki with content:
cd keizersgracht-legal.wiki  # or keizersgracht-legal-website.wiki

# Add new remote
git remote add new-origin https://github.com/Misto123/keizersgracht-legal.wiki.git

# Push to new wiki
git push new-origin main

# OR if the wiki uses master:
git push new-origin master
```

**Note:** Wikis are separate Git repositories. The wiki must be enabled in the new repo settings first.

---

### Phase 4: Handle Issues and Pull Requests

#### Step 4.1: Check for Open Issues
```bash
# List open issues
gh issue list --repo misto-guest/keizersgracht-legal --state open
gh issue list --repo misto-guest/keizersgracht-legal-website --state open
```

**Current Status:** Both repos have 0 open issues.

#### Step 4.2: Check for Open Pull Requests
```bash
# List open PRs
gh pr list --repo misto-guest/keizersgracht-legal --state open
gh pr list --repo misto-guest/keizersgracht-legal-website --state open
```

**Current Status:** Both repos have 0 open PRs.

#### Step 4.3: If Issues/PRs Existed (Future Reference)
For repos with issues or PRs, you have two options:

**Option A: Manual Recreation**
- Create new issues in new repo
- Copy/paste content and comments
- Close old issues with reference to new location

**Option B: Use GitHub's Import API**
```bash
# This requires authentication and is more complex
# See: https://docs.github.com/en/rest/migrations/source-imports
```

---

### Phase 5: Update Vercel Deployment (CRITICAL)

#### Step 5.1: Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Find project: `keizersgracht-legal` (Project ID: `prj_WR0LZsxuPZMOrhWmeRJNj0PaZ5ko`)
3. Go to Settings → Git

#### Step 5.2: Update Git Integration
1. **Disconnect** the old repository (`misto-guest/keizersgracht-legal-website`)
2. **Connect** the new repository (`Misto123/keizersgracht-legal-website`)
3. Select the same branch (main)
4. Update build settings if needed (current config is in `vercel.json`):
   ```json
   {
     "cleanUrls": true,
     "trailingSlash": false
   }
   ```

#### Step 5.3: Verify Deployment
1. Trigger a manual deployment from Vercel dashboard
2. Check deployment logs
3. Verify the site is accessible

#### Step 5.4: Update Environment Variables (if any)
The `.env.local` file exists locally but should NOT be committed. Check Vercel environment variables:
- Vercel Dashboard → Project → Settings → Environment Variables
- Ensure all necessary variables are set

---

### Phase 6: Update Local Clone

#### Step 6.1: Verify Remote Update
```bash
cd /Users/northsea/clawd-dmitry/keizersgracht-legal

git remote -v
# Expected output:
# origin    https://github.com/Misto123/keizersgracht-legal-website.git (fetch)
# origin    https://github.com/Misto123/keizersgracht-legal-website.git (push)
# old-origin    https://github.com/misto-guest/keizersgracht-legal-website.git (fetch)
# old-origin    https://github.com/misto-guest/keizersgracht-legal-website.git (push)
```

#### Step 6.2: Clean Up Old Remote (Optional)
```bash
# Once you're sure everything works, remove old remote
git remote remove old-origin

# Verify
git remote -v
```

---

### Phase 7: Handle Old Repositories

#### Option A: Archive (Recommended)
```bash
# Archive the old repositories
gh repo edit misto-guest/keizersgracht-legal --archived=true
gh repo edit misto-guest/keizersgracht-legal-website --archived=true
```

**OR via GitHub.com:**
1. Go to repository Settings
2. Scroll to "Danger Zone"
3. Click "Archive this repository"

#### Option B: Redirect (Best for Public Repos)
1. Archive the old repo (see above)
2. Create a README in the old repo with:
   ```markdown
   # ⚠️ Repository Moved

   This repository has been moved to:

   **New Location:** https://github.com/Misto123/keizersgracht-legal

   Please update your bookmarks and clones.

   ## How to Update Your Local Clone

   ```bash
   cd keizersgracht-legal
   git remote set-url origin https://github.com/Misto123/keizersgracht-legal.git
   git fetch --all
   git checkout main
   git branch --set-upstream-to=origin/main main
   ```
   ```

#### Option C: Delete (Use with Caution)
⚠️ **WARNING:** This cannot be undone!
```bash
gh repo delete misto-guest/keizersgracht-legal
gh repo delete misto-guest/keizersgracht-legal-website
```

**Only delete if:**
- No important data remains
- No external services reference these repos
- You're 100% certain migration is complete

---

## Post-Migration Checklist

### Verification Steps
- [ ] New repositories exist: https://github.com/Misto123/keizersgracht-legal and https://github.com/Misto123/keizersgracht-legal-website
- [ ] All code is pushed to new repositories
- [ ] All branches are migrated
- [ ] All tags are migrated (if any)
- [ ] Vercel deployment is working with new repository
- [ ] Website is accessible and functioning
- [ ] Local clones point to new remote
- [ ] Old repositories are archived or deleted
- [ ] Any documentation links are updated

### Documentation Updates
- [ ] Update any README files with new repository URLs
- [ ] Update package.json `repository` field (if exists)
- [ ] Update any deployment scripts
- [ ] Update any external references

### Collaboration
- [ ] Add collaborators to new repositories (if needed)
- [ ] Update team permissions
- [ ] Notify stakeholders of new location

---

## Rollback Plan

If something goes wrong:

### For Vercel Deployment
1. Go to Vercel Dashboard → Project Settings → Git
2. Disconnect new repository
3. Reconnect old repository (`misto-guest/keizersgracht-legal-website`)
4. Redeploy

### For Git Repositories
```bash
# Restore local remote to old location
git remote remove origin
git remote rename old-origin origin
git fetch --all
```

---

## Estimated Time

- **Phase 1 (Create repos):** 5 minutes
- **Phase 2 (Push code):** 10 minutes
- **Phase 3 (Wikis):** 5 minutes (if content exists)
- **Phase 4 (Issues/PRs):** 0 minutes (none exist)
- **Phase 5 (Vercel):** 10-15 minutes
- **Phase 6 (Update local):** 2 minutes
- **Phase 7 (Handle old repos):** 5 minutes

**Total:** ~40-50 minutes

---

## Troubleshooting

### Issue: Permission Denied When Pushing
```bash
# Ensure you're authenticated to GitHub as Misto123
gh auth status
gh auth login

# Or use SSH instead of HTTPS:
git remote set-url origin git@github.com:Misto123/keizersgracht-legal-website.git
```

### Issue: Vercel Can't Find New Repository
1. Ensure GitHub app is installed for Misto123 account
2. Grant Vercel access to the new repository
3. Try reconnecting the Git integration

### Issue: Local Clone Has Uncommitted Changes
```bash
# Stash or commit changes before updating remote
git status
git stash  # or git commit
git push origin --all
```

---

## Summary

**What You're Doing:**
- Migrating 2 repositories from `misto-guest` to `Misto123`
- Updating Vercel deployment for website
- Updating local git remotes

**Key Considerations:**
- ⚠️ Vercel deployment is **critical** - must be updated
- Local clone only exists for website repo
- No issues, PRs, or wikis to migrate (currently)
- No collaborators to transfer

**Recommended Approach:**
1. Create new repos
2. Push code
3. Update Vercel
4. Update local clone
5. Archive old repos (with redirect README)

---

*Last Updated: 2026-02-10*
*Created by: Clawdbot Sub-Agent*

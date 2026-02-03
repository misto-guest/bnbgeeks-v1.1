# Standard Operating Procedure: Find-Skills First Approach

## 🎯 Core Principle
**ALWAYS search for existing skills before implementing any solution from scratch.**

## 🔄 Workflow

```
User Request → Skill Search → Install (if found) → Direct Help (if not)
     ↓              ↓               ↓                  ↓
  "Help me X"   "npx skills   "Use the skill    "Implement
                find X"       or install it"     directly"
```

## 📋 Step-by-Step Process

### 1. Identify User Intent
When user asks:
- "How do I do X?"
- "Can you help me with X?"
- "I need to implement X"
- "What's the best way to X?"

**Action**: Extract keywords for skill search
- Domain: react, testing, deployment, etc.
- Task: performance, review, automation, etc.

### 2. Search for Skills
```bash
npx skills find "[domain] [task]"
```

**Examples**:
```bash
npx skills find "react performance"
npx skills find "testing jest"
npx skills find "deployment docker"
```

### 3. Present Findings
When skills are found, present:
```
✅ Found [number] skills for "[query]"

📦 [skill-name]
   └─ Description: [what it does]
   └─ Install: npx skills add <owner/repo@skill> -g -y
   └─ Learn more: https://skills.sh/[path]

🤔 Would you like me to install the best match?
```

### 4. Install (if user agrees)
```bash
npx skills add <best-match> -g -y
```

### 5. Fallback to Direct Help
If no skills found:
```
❌ No existing skills found for "[query]"

I can help you directly! Would you like me to:
1. Implement a solution from scratch?
2. Create a custom skill for this (npx skills init [name])?
```

## 🎪 Skill Categories & Search Terms

### Web Development
- **Frontend**: `react`, `vue`, `angular`, `frontend`, `css`, `tailwind`
- **Backend**: `nodejs`, `python`, `api`, `server`, `backend`
- **Full Stack**: `nextjs`, `nuxt`, `fullstack`, `web dev`

### Testing
- **Unit Testing**: `jest`, `testing`, `unit test`
- **E2E Testing**: `playwright`, `cypress`, `e2e`, `end to end`
- **Testing Patterns**: `tdd`, `test driven`, `testing patterns`

### DevOps & Deployment
- **Deployment**: `deploy`, `vercel`, `netlify`, `deployment`
- **Containers**: `docker`, `kubernetes`, `container`, `k8s`
- **CI/CD**: `ci`, `cd`, `github actions`, `pipeline`

### Code Quality
- **Best Practices**: `best practices`, `clean code`, `patterns`
- **Review**: `code review`, `pr review`, `peer review`
- **Linting**: `eslint`, `prettier`, `lint`, `formatting`

### Design
- **UI/UX**: `ui`, `ux`, `design`, `interface`
- **Design Systems**: `design system`, `components`, `styling`
- **Accessibility**: `a11y`, `accessibility`, `wcag`

### Productivity
- **Git**: `git`, `version control`, `workflow`
- **Automation**: `automation`, `script`, `productivity`
- **Documentation**: `docs`, `readme`, `documentation`

## 💡 Pro Tips

### Effective Searching
1. **Be Specific**: `"react testing"` > `"testing"`
2. **Try Synonyms**: `"deploy"`, `"deployment"`, `"ci-cd"`
3. **Check Popular Sources**: 
   - `vercel-labs/skills`
   - `anthropics/skills`
   - `antfu/skills`

### Installation Best Practices
- Always use `-g` (global) for consistent availability
- Always use `-y` (yes) to skip prompts
- Check skill compatibility with your agent

### When to Skip Skill Search
- Simple one-off questions
- General knowledge queries
- Creative tasks (writing, brainstorming)
- Quick code snippets (< 5 lines)

## 🔧 Current Setup

### Installed Skills
```bash
npx skills list -g
```

### Available Skills CLI Commands
```bash
npx skills find [query]    # Search for skills
npx skills add <package>   # Install a skill
npx skills list            # List installed skills
npx skills check           # Check for updates
npx skills update          # Update all skills
npx skills remove          # Remove installed skills
```

## 📊 Success Metrics

Track effectiveness of this approach:
- **Skill Usage**: How often skills are found vs. implemented
- **Time Savings**: Compare skill-based vs. custom implementation
- **User Satisfaction**: Preference for skills vs. custom solutions
- **Skill Quality**: Feedback on installed skills

## 🚀 Automation Opportunities

### Automatic Triggers
Consider auto-searching when user asks:
- "How do I..."
- "Can you help me with..."
- "I need to..."
- "Best way to..."

### Smart Suggestions
If a task is requested multiple times, suggest:
> "This is the 3rd time you've asked about X. Would you like me to find/install a skill for this?"

## 📝 Example Conversations

### Example 1: Skill Found
```
User: "How do I optimize React performance?"

Agent: "Let me search for existing skills...
✅ Found 'vercel-react-best-practices' skill!

This skill provides official React/Next.js optimization guidelines
from Vercel Engineering.

Install: npx skills add vercel-labs/skills@vercel-react-best-practices -g -y
Learn: https://skills.sh/vercel-labs/skills/vercel-react-best-practices

Would you like me to install it?"
```

### Example 2: No Skill Found
```
User: "How do I integrate with XYZ API?"

Agent: "Let me search for existing skills...
❌ No skills found for 'XYZ API integration'

I can help you directly! I'll:
1. Research the XYZ API documentation
2. Create integration code
3. Provide usage examples

Shall I proceed?"
```

## 🎯 Key Principles

1. **Skills First**: Always check before implementing
2. **Quality Over Speed**: Use vetted skills over quick hacks
3. **User Choice**: Present options, let user decide
4. **Continuous Learning**: Update skills regularly
5. **Fallback Ready**: Have direct help ready when skills fail

## 🔄 Continuous Improvement

### Regular Maintenance
- **Weekly**: Check for skill updates (`npx skills check`)
- **Monthly**: Review and update installed skills
- **Quarterly**: Evaluate skill quality and relevance

### Feedback Loop
- Track which skills are most useful
- Identify skill gaps in the ecosystem
- Contribute back missing skills

---

**Status**: ✅ ACTIVE - This approach is now the standard operating procedure
**Last Updated**: 2026-02-02
**Next Review**: 2026-03-02
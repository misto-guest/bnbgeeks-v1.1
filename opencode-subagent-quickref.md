# OpenCode Kimi-K25 Sub-Agent Quick Reference

## TL;DR
OpenCode is now installed with Kimi K2.5 support. Add an API key to `~/.config/opencode/opencode.json` to activate it.

## Quick Start
```bash
# Add API key first (Option 1: OpenRouter)
vim ~/.config/opencode/opencode.json
# Replace YOUR_OPENROUTER_API_KEY_HERE

# Test it
opencode run "What is 2+2?"

# See all models
opencode models
```

## Sub-Agent Usage Patterns

### Pattern 1: Instant Mode (Quick Tasks, < 30s)
```bash
opencode run --model openrouter/kimi-k2.5-instant "YOUR_PROMPT"
```
Best for: Simple snippets, boilerplate, quick fixes

### Pattern 2: Thinking Mode (Complex Tasks, 30-120s)
```bash
opencode run --model openrouter/kimi-k2.5-thinking "YOUR_PROMPT"
```
Best for: Architecture, debugging, refactoring, complex algorithms

### Pattern 3: Visual Coding (UI → Code)
```bash
opencode run --model openrouter/kimi-k2.5-thinking "Generate React component" <image.png>
```
Best for: Converting designs to code

## When to Use OpenCode vs Full Agent

**Use OpenCode:**
- ✅ Quick code generation (5-30s)
- ✅ Simple refactoring
- ✅ Bug fixes
- ✅ Code explanations
- ✅ Boilerplate generation

**Use Full Agent:**
- ✅ Multi-file changes
- ✅ Complex architecture
- ✅ Deep context analysis
- ✅ Long-running tasks

## Model Selection Guide

| Task | Model | Speed | Quality |
|------|-------|-------|---------|
| Quick snippet | kimi-k2.5-instant | 🚀 Fast | Good |
| Complex task | kimi-k2.5-thinking | 🐢 Slow | Excellent |
| Visual coding | kimi-k2.5-thinking | 🐢 Slow | Excellent |

## API Key Options

**OpenRouter** (Recommended)
- Get key: https://openrouter.ai
- Cost: $0.50-2.80/M tokens
- Best for: International users, multi-model access

**Moonshot AI** (Official)
- Get key: https://platform.moonshot.ai
- Cost: ~$0.60-3.00/M tokens
- Best for: China users, lowest latency

## Example Prompts

```bash
# Quick function
opencode run --model openrouter/kimi-k2.5-instant \
  "Write a Python function to validate email addresses"

# Explain code
opencode run --model openrouter/kimi-k2.5-instant \
  "Explain this code: <paste code>"

# Fix bug
opencode run --model openrouter/kimi-k2.5-thinking \
  "Find and fix the bug in: <paste code>"

# Refactor
opencode run --model openrouter/kimi-k2.5-thinking \
  "Refactor this for better maintainability: <paste code>"

# Generate tests
opencode run --model openrouter/kimi-k2.5-instant \
  "Write Jest tests for: <paste code>"
```

## Performance Tips

1. **Use instant mode by default** - only use thinking mode for complex tasks
2. **Set appropriate timeouts** - thinking mode can take 30-60s
3. **Be specific with prompts** - more context = better results
4. **Leverage visual coding** - provide screenshots for UI tasks
5. **Cache when possible** - Kimi K2.5 is consistent with similar prompts

## Troubleshooting

| Problem | Solution |
|---------|----------|
| API key error | Add key to `~/.config/opencode/opencode.json` |
| Slow response | Switch to `kimi-k2.5-instant` |
| Model not found | Run `opencode models` to verify |
| Rate limit | Wait a few minutes or switch providers |

## Key Files

- **Config:** `~/.config/opencode/opencode.json`
- **Full Guide:** `~/clawd-dmitry/OPencode-Kimi-K25-Guide.md`
- **Install Report:** `~/clawd-dmitry/OPencode-Kimi-K25-Installation-Report.md`
- **Quick Script:** `~/clawd-dmitry/opencode-quick.sh`

## Kimi K2.5 vs Claude

| Task | Kimi K2.5 | Claude |
|------|-----------|--------|
| Coding | ✅ Better | Good |
| Math | ✅ Better | Good |
| Visual Coding | ✅ Native | Limited |
| Long Text | Good | ✅ Better |
| Conversation | Good | ✅ Better |

**Bottom Line:** Use Kimi K2.5 for coding tasks. Use Claude for natural language.

## Documentation

- OpenCode: https://opencode.ai/docs
- Kimi K2.5: https://huggingface.co/moonshotai/Kimi-K2.5
- OpenRouter: https://openrouter.ai
- Moonshot: https://platform.moonshot.ai

---

**Need help?** Check the full guide at `~/clawd-dmitry/OPencode-Kimi-K25-Guide.md`

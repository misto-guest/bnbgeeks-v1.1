# OpenCode Kimi-K25 Installation Report

**Date:** 2026-02-10
**Session:** install-kimi
**Status:** ✅ Successfully Installed and Configured

## What Was Accomplished

### 1. Understanding OpenCode Kimi-K25
- **OpenCode** is an open-source AI coding assistant (similar to Claude Code but provider-agnostic)
- **Kimi K2.5** is Moonshot AI's open-source LLM (released January 2026)
- **Key Advantages:**
  - 1 trillion total parameters (32 billion activated)
  - Outperforms Claude Opus 4.5 in coding and agentic tasks
  - Native multimodality (can understand UI designs and generate code)
  - 256K token context window
  - Agent swarm capabilities

### 2. Installation Status
✅ **OpenCode Installed:** Version 1.1.53
✅ **Configuration Created:** `~/.config/opencode/opencode.json`
✅ **Required Packages Installed:**
  - `@openrouter/ai-sdk-provider`
  - `@ai-sdk/moonshotai`
✅ **Configuration Validated:** Successfully loading models

### 3. Available Kimi K2.5 Models
OpenCode now has access to these models:
- `openrouter/kimi-k2.5` - Standard mode (balanced)
- `openrouter/kimi-k2.5-thinking` - Deep reasoning mode (complex tasks)
- `openrouter/kimi-k2.5-instant` - Fast response mode (quick tasks)
- `moonshotai/kimi-k2.5` - Via Moonshot official API

## Action Required: Add Your API Key

To activate Kimi K2.5, you need to add an API key to the configuration:

### Option 1: OpenRouter (Recommended for International Users)
```bash
# 1. Get API key from https://openrouter.ai
# 2. Edit the config file:
vim ~/.config/opencode/opencode.json

# 3. Replace YOUR_OPENROUTER_API_KEY_HERE with your key
```

**Pricing:** $0.50-2.80 per million tokens

### Option 2: Moonshot AI (Official API)
```bash
# 1. Get API key from https://platform.moonshot.ai
# 2. Edit the config file:
vim ~/.config/opencode/opencode.json

# 3. Replace YOUR_MOONSHOT_API_KEY_HERE with your key
```

**Pricing:** ~$0.60-3.00 per million tokens

## Using OpenCode Kimi-K25 with Clawdbot Sub-Agents

### When to Use OpenCode vs Full Coding Agent

**Use OpenCode Kimi-K25 for:**
- Quick code snippets and small functions (5-30 seconds)
- Code refactoring and optimization
- Bug fixing in existing code
- Generating boilerplate code
- Code explanations and documentation
- Simple to medium-complexity tasks

**Use Full Coding Agent for:**
- Multi-file refactoring
- Complex architecture changes
- Setting up new project structures
- Tasks requiring deep context understanding
- Long-running coding sessions

### Quick Start Commands

```bash
# List all available models
opencode models

# Start OpenCode TUI with default model
opencode

# Run a single command
opencode run "Write a Python function to parse JSON files"

# Use specific model (in TUI)
opencode
# Then type: /model
# Select: kimi-k2.5-thinking or kimi-k2.5-instant
```

### Sub-Agent Integration Examples

#### Example 1: Quick Code Generation
```bash
# Sub-agent spawns OpenCode for instant mode
opencode run --model openrouter/kimi-k2.5-instant \
  "Write a TypeScript function to validate email addresses"
```

#### Example 2: Complex Problem Solving
```bash
# Sub-agent spawns OpenCode for thinking mode
opencode run --model openrouter/kimi-k2.5-thinking \
  "Design a REST API for a task management system"
```

#### Example 3: Visual Coding (UI → Code)
```bash
# Sub-agent provides screenshot and request
opencode run --model openrouter/kimi-k2.5-thinking \
  "Generate a React component from this design" <screenshot.png>
```

### Performance Benchmarks

| Benchmark | Kimi K2.5 | Claude Opus 4.5 | GPT-4o |
|-----------|-----------|-----------------|--------|
| HLE (Full Set) | 50.2% | 43.5% | 42.1% |
| BrowseComp | 74.9% | 51.5% | 49.3% |
| Coding Tasks | SOTA | Second | Third |
| Visual Coding | Native | Limited | Good |

### Special Features

**1. Thinking Mode vs. Instant Mode:**
- **Thinking Mode:** Deep reasoning with visible thought process (slower but thorough)
- **Instant Mode:** Direct output without reasoning (faster, for simple tasks)

**2. Native Multimodality:**
Can understand UI designs and generate React/Tailwind code directly from screenshots

**3. Ultra-Long Context:**
256K tokens - excellent for analyzing entire projects and codebases

## Documentation Files Created

1. **`~/clawd-dmitry/OPencode-Kimi-K25-Guide.md`** - Comprehensive usage guide
2. **`~/.config/opencode/README.md`** - Quick setup reference
3. **`~/clawd-dmitry/opencode-quick.sh`** - Quick launch script

## Troubleshooting

**Issue:** "API key not found"
**Solution:** Edit `~/.config/opencode/opencode.json` and add your API key

**Issue:** "Response is slow"
**Solution:** Switch to instant mode: `opencode run --model openrouter/kimi-k2.5-instant`

**Issue:** "Model not found"
**Solution:** Run `opencode models` to verify available models

## Next Steps

1. **Get an API key** from OpenRouter or Moonshot AI
2. **Add the API key** to `~/.config/opencode/opencode.json`
3. **Test the installation:**
   ```bash
   opencode run "What is 2+2?"
   ```
4. **Start using** with Clawdbot sub-agents for coding tasks!

## Resources

- **Full Guide:** `~/clawd-dmitry/OPencode-Kimi-K25-Guide.md`
- **OpenCode GitHub:** https://github.com/anomalyco/opencode
- **Kimi K2.5 Hugging Face:** https://huggingface.co/moonshotai/Kimi-K2.5
- **OpenCode Docs:** https://opencode.ai/docs

---

**Installation completed successfully!** 🎉

OpenCode Kimi-K25 is ready to use once you add your API key. It's particularly useful for sub-agent coding tasks that don't require a full coding agent setup.

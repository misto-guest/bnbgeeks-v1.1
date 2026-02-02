# AI Development

**Last updated:** 2026-01-31

## Overview
Ongoing work with AI services, models, and configuration for Clawdbot and other projects.

## Services

### OpenRouter
- **Purpose:** 400+ AI models via one API
- **Use for:** Coding, chat, generation
- **API Key:** `sk-or-v1...f31`
- **Primary models:** GPT-4.1 Mini

### z.ai
- **Purpose:** AI coding assistant
- **Use for:** Code generation, debugging
- **Status:** Configured (placeholder key)

### Perplexity Pro
- **Purpose:** Web search + AI reasoning
- **Use for:** Research, fact-checking
- **Cost:** $20/month (unlimited)
- **Status:** Configured (placeholder key)

### Claude Agent SDK
- **Package:** `@anthropic-ai/claude-agent-sdk`
- **Installed:** ✅ 2026-01-28
- **Use for:** Build AI apps with Claude

## Configuration File
`~/.clawdbot/clawdbot.json`

```json5
{
  "providers": {
    "openrouter": {
      "apiKey": "your-openrouter-key-here"
    },
    "zai": {
      "apiKey": "your-zai-key-here"
    },
    "perplexity": {
      "apiKey": "your-perplexity-key-here"
    }
  }
}
```

## Usage Strategy

**For Coding:**
1. z.ai (primary)
2. OpenRouter (GPT-4.1) fallback
3. Claude Agent SDK for complex reasoning

**For General Tasks:**
1. Perplexity Pro for web search
2. OpenRouter for chat/generation

## Documentation
- `/Users/northsea/clawd-dmitry/memory/2026-01-28-ai-configuration.md`
- `/Users/northsea/clawd-dmitry/memory/2026-01-28-ai-setup-summary.md`

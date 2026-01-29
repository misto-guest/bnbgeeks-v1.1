# AI Configuration for Clawdbot

**Status:** All research complete, ready to configure

---

## What's Been Prepared

I've created a complete configuration guide at:
`/Users/northsea/clawd-dmitry/memory/2026-01-28-ai-configuration.md`

---

## AI Services Overview

| Service | What It Does | Use For |
|---------|---------------|----------|
| **OpenRouter** | 400+ AI models via one API | Coding, chat, generation |
| **z.ai** | AI coding assistant | Code generation, debugging |
| **Perplexity Pro** | Web search + AI reasoning | Research, fact-checking |
| **Claude Agent SDK** | Build AI apps with Claude | Agents, tools |

---

## Installed ✅

- **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`)

---

## Ready to Configure ❌

| Service | Action Needed |
|---------|--------------|
| **OpenRouter** | Get API key from https://openrouter.ai/ |
| **z.ai** | Get API key from https://z.ai/ |
| **Perplexity Pro** | Get API key from https://www.perplexity.ai/pro |

---

## How to Add to Clawdbot

Add this to `~/.clawdbot/clawdbot.json`:

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

---

## Usage Strategy

**For Coding:**
1. z.ai (primary) → OpenRouter (GPT-4.1) as fallback
2. Claude Agent SDK for complex reasoning

**For General Tasks:**
1. Perplexity Pro for web search
2. OpenRouter for chat/generation

**Cost:**
- Perplexity Pro: $20/month (unlimited)
- OpenRouter: Pay per usage
- z.ai: Check pricing

---

**Guide:** See `memory/2026-01-28-ai-configuration.md` for full details.

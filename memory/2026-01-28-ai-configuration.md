# Clawdbot AI Configuration Guide

**Date:** 2026-01-28 08:59 GMT+1
**User:** B (@rozhiu)

---

## Overview

Setting up multiple AI services for Clawdbot to use:

| Service | Purpose | Use For |
|---------|-----------|----------|
| **OpenRouter** | Access 400+ AI models | Coding, chat, generation |
| **z.ai** | AI coding assistant | Code generation, debugging |
| **Perplexity Pro** | Web search + AI | Research, information gathering |

---

## 1. OpenRouter API

### What It Is
- **400+ AI models** in one API
- **Unified endpoint** for all providers
- **Automatic fallbacks** between models
- **Cost tracking** across providers

### Getting Started

1. **Sign up:** https://openrouter.ai/
2. **Get API key:** From dashboard
3. **Configure in Clawdbot:**

```json5
// ~/.clawdbot/clawdbot.json
{
  "providers": {
    "openrouter": {
      "apiKey": "your-openrouter-api-key"
    }
  }
}
```

### Usage Examples

**Via OpenAI SDK (recommended):**

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://your-app.com'
  }
});

const response = await openai.chat.completions.create({
  model: 'openai/gpt-4.1',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

**Via OpenRouter SDK:**

```javascript
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://your-app.com'
  }
});

const response = await openRouter.chat.completions.create({
  model: 'openai/gpt-4.1',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

### Popular Models

| Model | Provider | Best For |
|-------|----------|----------|
| `openai/gpt-4.1` | OpenAI | Coding, chat |
| `anthropic/claude-3.5-sonnet` | Anthropic | Reasoning, complex tasks |
| `google/gemini-pro-1.5` | Google | Multimodal, coding |
| `meta-llama-3.1-70b` | Meta | Fast, cost-effective |

---

## 2. z.ai for Coding

### What It Is
- AI-powered coding assistant
- Code generation and debugging
- Similar to Claude Code, Cursor

### Setup Instructions

1. **Sign up:** https://z.ai/
2. **Get API key:** From dashboard
3. **Configure in Clawdbot:**

```json5
{
  "providers": {
    "zai": {
      "apiKey": "your-zai-api-key"
    }
  }
}
```

### Integration

Direct API calls to z.ai for code generation:

```javascript
// Example z.ai API call
const response = await fetch('https://api.z.ai/v1/code', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ZAI_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Write a React component...',
    language: 'typescript'
  })
});
```

---

## 3. Perplexity Pro

### What It Is
- **Web search + AI** combined
- **Real-time web search** with citations
- **Reasoning over search results**

### Setup Instructions

1. **Sign up:** https://www.perplexity.ai/pro
2. **Get API key:** From dashboard
3. **Configure in Clawdbot:**

```json5
{
  "providers": {
    "perplexity": {
      "apiKey": "your-perplexity-pro-api-key"
    }
  }
}
```

### Usage Examples

**Web search with citations:**

```javascript
const response = await fetch('https://api.perplexity.ai/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_PERPLEXITY_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'sonar-pro',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: 'What is the latest AI news?'
      }
    ],
    search_domain_filter: ['perplexity.ai', 'wired.com', 'techcrunch.com']
  })
});
```

---

## 4. Claude Agent SDK (Installed)

**Status:** ✅ Already installed

```bash
npm list -g --json
```

Should show: `@anthropic-ai/claude-agent-sdk`

### Usage

Building AI-powered applications with Claude:

```javascript
import { anthropic } from '@anthropic-ai/claude-agent-sdk';

const client = anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const agent = await client.agents.create({
  name: 'my-agent',
  instructions: 'You help with coding tasks.'
});

const response = await client.messages.create({
  agent: agent.id,
  content: 'Write a function to...'
});
```

---

## Configuration File

### Complete Configuration

```json5
// ~/.clawdbot/clawdbot.json
{
  "providers": {
    "openrouter": {
      "apiKey": "your-openrouter-api-key",
      "baseURL": "https://openrouter.ai/api/v1"
    },
    "zai": {
      "apiKey": "your-zai-api-key",
      "baseURL": "https://api.z.ai/v1"
    },
    "perplexity": {
      "apiKey": "your-perplexity-pro-api-key",
      "baseURL": "https://api.perplexity.ai/v1"
    },
    "anthropic": {
      "apiKey": "your-anthropic-api-key",
      "baseURL": "https://api.anthropic.com/v1"
    }
  },
  "defaults": {
    "coding": "openrouter",
    "chat": "openrouter",
    "webSearch": "perplexity"
  }
}
```

---

## Implementation Strategy

### How Clawdbot Can Use These

**For Coding Tasks:**
1. Try z.ai → fallback to OpenRouter (GPT-4.1)
2. Use Claude Agent SDK for reasoning
3. Use Perplexity for code searches

**For General Tasks:**
1. Use Perplexity Pro for web search + AI
2. Use OpenRouter for chat/generation
3. Mix providers based on task type

**Cost Optimization:**
- Perplexity Pro: $20/month flat fee
- OpenRouter: Pay-per-model (GPT-4.1 ~$0.50/1M tokens)
- z.ai: Check their pricing (typically cheaper for pure coding)

---

## Tool Integration

### Transcription App Updates

The existing transcription app can use these APIs:

1. **Add API selector** to UI
2. **Summarize transcripts** using Perplexity Pro
3. **Generate blog posts** using z.ai or OpenRouter
4. **Search transcripts** using Perplexity

---

## Next Steps

1. **Get API keys** from:
   - OpenRouter: https://openrouter.ai/
   - z.ai: https://z.ai/
   - Perplexity: https://www.perplexity.ai/pro

2. **Add to Clawdbot config**

3. **Test integration**

4. **Update apps** to use these APIs

---

## Summary

| Service | Status | Next Step |
|---------|--------|-----------|
| OpenRouter | Ready to configure | Get API key |
| z.ai | Ready to configure | Get API key |
| Perplexity Pro | Ready to configure | Get API key |
| Claude Agent SDK | ✅ Installed | Get Anthropic API key |

All services ready for use once API keys are added.

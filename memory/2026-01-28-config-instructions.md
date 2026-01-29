# AI Configuration Instructions

**Created:** 2026-01-28 09:00 GMT+1
**For:** B (@rozhiu)

---

## What's Been Configured

✅ **Claude Agent SDK** — Installed and ready
✅ **Research completed** — OpenRouter, z.ai, Perplexity Pro documented

---

## Current Clawdbot Config

Your `~/.clawdbot/clawdbot.json` already has some providers configured:

```json5
{
  "auth": {
    "profiles": {
      "openrouter": {
        "provider": "openrouter",
        "mode": "token"
      },
      "zai": {
        "provider": "zai", 
        "mode": "api_key"
      }
    }
  }
}
```

---

## Add Your API Keys

Add these three services to the `auth.profiles` section:

### Option 1: Add All Three

```json5
{
  "auth": {
    "profiles": {
      "openrouter": {
        "provider": "openrouter",
        "mode": "token",
        "token": "your-openrouter-api-key-here"
      },
      "zai": {
        "provider": "zai",
        "mode": "api_key",
        "apiKey": "your-zai-api-key-here"
      },
      "perplexity": {
        "provider": "perplexity",
        "mode": "api_key",
        "apiKey": "your-perplexity-pro-api-key-here"
      }
    }
  }
}
```

### Option 2: Add Only OpenRouter (if you provide it)

```json5
{
  "auth": {
    "profiles": {
      "openrouter": {
        "provider": "openrouter",
        "mode": "token",
        "token": "your-openrouter-api-key-here"
      }
    }
  }
}
```

### Option 3: Add Only z.ai (if you provide it)

```json5
{
  "auth": {
    "profiles": {
      "zai": {
        "provider": "zai",
        "mode": "api_key",
        "apiKey": "your-zai-api-key-here"
      }
    }
  }
}
```

---

## How to Get API Keys

| Service | URL |
|---------|-----|
| **OpenRouter** | https://openrouter.ai/ (dashboard) |
| **z.ai** | https://z.ai/ (dashboard) |
| **Perplexity Pro** | https://www.perplexity.ai/pro (dashboard) |

1. Sign up for each service
2. Get your API key from dashboard
3. Replace placeholders in config file

---

## Configuration Location

**File:** `~/.clawdbot/clawdbot.json`

**Edit using:**
```bash
nano ~/.clawdbot/clawdbot.json
# Or your favorite editor
```

**Then restart Clawdbot:**
```bash
clawdbot gateway restart
```

---

## How These Will Be Used

| Provider | Primary Use | Model | Cost |
|----------|-------------|-------|--------|
| **OpenRouter** | Chat, generation | GPT-4.1 | $0.50/1M tokens |
| **z.ai** | Coding | Zai models | Check pricing |
| **Perplexity Pro** | Web search | Sonar Pro | $20/month |

---

## Usage in Tools

Once configured, I can:

1. **Use OpenRouter** for AI coding tasks via multiple models
2. **Use z.ai** for code generation (if configured)
3. **Use Perplexity Pro** for web searches with citations
4. **Use Claude Agent SDK** for complex reasoning (already installed)

---

## Quick Example Configuration

```json5
{
  "auth": {
    "profiles": {
      "openrouter": {
        "provider": "openrouter",
        "mode": "token",
        "token": "sk-or-v1-xxxxxxxxxxxxx"
      },
      "zai": {
        "provider": "zai",
        "mode": "api_key",
        "apiKey": "sk-zai-xxxxxxxxxxxxx"
      },
      "perplexity": {
        "provider": "perplexity",
        "mode": "api_key",
        "apiKey": "pplx-xxxxxxxxxxxxx"
      }
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

## Next Steps

1. **Get API keys** from:
   - OpenRouter: https://openrouter.ai/
   - z.ai: https://z.ai/
   - Perplexity Pro: https://www.perplexity.ai/pro

2. **Edit config:** `~/.clawdbot/clawdbot.json`
3. **Restart:** `clawdbot gateway restart`
4. **Test:** Ask me to use a tool to verify

---

## Full Documentation

See `memory/2026-01-28-ai-configuration.md` for complete API documentation.

---

**Summary:**
- ✅ Claude Agent SDK installed
- ✅ AI services researched and documented
- ⏳ Waiting for your API keys to complete setup

# Session: 2026-01-29 - Perplexity Test

- **Date**: 2026-01-29 11:26 GMT+1
- **User**: B (@rozhiu)

---

## What We Tried

**Task:** Tell me a funny programming joke (using Perplexity Pro)

**Execution:**
```bash
curl -s "https://api.perplexity.ai/v1/chat/completions" \
  -H "Authorization: Bearer pplx-xxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar-pro",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant. Tell me a very short, funny programming joke (2 sentences max)."
      },
      {
        "role": "user",
        "content": "tell me a funny programming joke"
      }
    ]
  }'
```

**Result:** Empty response (likely failed due to placeholder API key)

---

## Problem Identified

**The Perplexity Pro API key is a placeholder:**
`pplx-xxxxxxxxxxxxx`

When you say "use perplexity: tell me joke and add you llm model name," the system tries to:
1. Use Perplexity Pro for web search
2. Add a new model alias to the configuration

But the API key `pplx-xxxxxxxxxxxxx` is **not a real key**, so the request fails silently.

---

## Summary

| Component | Status | Issue |
|-----------|--------|----------|
| **Perplexity Pro** | ❌ API key is placeholder | Can't make API calls |
| **Web Search** | ❌ Gateway tools failing | Can't use skills search |
| **LLM Model Addition** | ⚠️ Requires real API key | Can't test `add llm model name` |

---

## Next Steps

1. **Provide real Perplexity Pro API key**
   - Get from: https://www.perplexity.ai/pro
   - It will be `pplx-` followed by actual key

2. **Alternative: Use OpenRouter for joke**
   - I can switch to a different AI provider temporarily
   - Command: `"disable openrouter"`
   - Then use GPT-4.1 Mini via OpenRouter

3. **Keep current setup**
   - Perplexity Pro for web searches
   - OpenRouter for coding/chat
   - Both can work together

---

## What "add you llm model name" Means

This would add a new model alias to your configuration. For example:
- `use zai` — Adds Z.ai as an alias
- `use claude` — Adds Claude as an alias
- `use gpt` — Adds GPT as an alias

You would then be able to say:
- `"use zai: tell me a joke"`
- `"use claude: write this code"`

---

**Your Choice:**

1. **Get real Perplexity Pro API key** (recommended)
2. **Switch to OpenRouter temporarily** (for this test)
3. **Keep current setup** (Perplexity + OpenRouter)

---

**Current Model Priority:**
- **Web Search**: Perplexity Pro (primary)
- **Coding/Chat**: OpenRouter (fallback available)
- **Reasoning**: Z.ai GLM-4.7 (fallback available)

---

**Ready to proceed!** Let me know what you'd like to do.

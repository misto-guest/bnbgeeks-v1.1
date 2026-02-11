# OpenCode Kimi-K25 for Clawdbot Sub-Agents

## What is OpenCode Kimi-K25?

**OpenCode** is an open-source AI coding assistant (similar to Claude Code, but provider-agnostic).

**Kimi K2.5** is Moonshot AI's open-source LLM (released January 2026) with:
- 1 trillion total parameters (32 billion activated)
- **Outperforms Claude Opus 4.5** in coding and agentic tasks
- Native multimodality (can understand UI designs and generate code)
- 256K token context window
- Agent swarm capabilities (automatic task decomposition)

## Installation Status

✅ **OpenCode Installed:** Version 1.1.53  
✅ **Configuration Created:** `~/.config/opencode/opencode.json`  
⚠️ **Action Required:** Add your API key to enable Kimi K2.5

## Getting Your API Key

Choose **one** of these options:

### Option 1: OpenRouter (Recommended for International Users)
1. Visit https://openrouter.ai
2. Sign up with GitHub or Google
3. Go to Dashboard → Keys → Create Key
4. Copy the key (starts with `sk-or-`)
5. Add to config: Replace `YOUR_OPENROUTER_API_KEY_HERE` in `~/.config/opencode/opencode.json`

**Pricing:** $0.50-2.80 per million tokens  
**Pros:** Multi-model support, easy setup, good for beginners  
**Cons:** Slightly higher latency than official API

### Option 2: Moonshot Official API (Best for China Users)
1. Visit https://platform.moonshot.ai
2. Complete registration with phone verification
3. Go to Console → API Keys → Create Key
4. Copy the key (starts with `sk-`)
5. Add to config: Replace `YOUR_MOONSHOT_API_KEY_HERE`

**Pricing:** ~$0.60-3.00 per million tokens  
**Pros:** Best stability, lowest latency, official support  
**Cons:** Requires phone verification

### Option 3: Synthetic (Limited Free Access)
1. Visit https://synthetic.new
2. Complete registration
3. Get API key and endpoint from settings
4. Add to config: Replace `YOUR_SYNTHETIC_API_KEY_HERE`

**Pricing:** Limited free credits for testing  
**Pros:** Free to try  
**Cons:** Limited credits, higher latency

## Configuration File Location

```bash
~/.config/opencode/opencode.json
```

Edit this file and replace `YOUR_*_API_KEY_HERE` with your actual API key.

## Using OpenCode Kimi-K25 with Clawdbot Sub-Agents

### When to Use OpenCode vs. Full Coding Agent

**Use OpenCode Kimi-K25 for:**
- Quick code snippets and small functions
- Code refactoring and optimization
- Bug fixing in existing code
- Generating boilerplate code
- Code explanations and documentation
- Simple to medium-complexity tasks (5-30 seconds)

**Use Full Coding Agent for:**
- Multi-file refactoring
- Complex architecture changes
- Setting up new project structures
- Tasks requiring deep context understanding
- Long-running coding sessions

### Sub-Agent Usage Patterns

#### Pattern 1: Quick Code Generation
```bash
# Sub-agent spawns OpenCode for instant mode
opencode --model kimi-k2.5-instant "Write a Python function to parse JSON files"

# Returns: Clean, fast response without deep reasoning
```

#### Pattern 2: Complex Problem Solving
```bash
# Sub-agent spawns OpenCode for thinking mode
opencode --model kimi-k2.5-thinking "Design a REST API for a task management system"

# Returns: Deep reasoning with step-by-step architecture
```

#### Pattern 3: Visual Coding (UI → Code)
```bash
# Sub-agent provides screenshot and request
opencode --model kimi-k2.5-thinking "Generate a React component from this design" <screenshot.png>

# Returns: Production-ready React + Tailwind code
```

### Command-Line Interface

```bash
# List available models
opencode --list-models

# Use Kimi K2.5 Thinking Mode (complex tasks)
opencode --model kimi-k2.5-thinking

# Use Kimi K2.5 Instant Mode (quick responses)
opencode --model kimi-k2.5-instant

# Specify model inline
opencode --model kimi-k2.5-instant "Explain this function"
```

### Interactive Mode

```bash
# Start OpenCode with Kimi K2.5
opencode --model kimi-k2.5-thinking

# Inside OpenCode:
> /models                    # List available models
> /model set kimi-k2.5-instant  # Switch models
> /help                       # Show help
> /exit                       # Exit
```

## Kimi K2.5 Special Features

### 1. Native Multimodality (Visual Coding)
Kimi K2.5 can understand UI designs and generate code directly:

```bash
# Provide a screenshot or image
opencode --model kimi-k2.5-thinking "Create a React login form matching this design" design.png
```

**Output:** Complete React component with Tailwind CSS, including colors, spacing, and styling.

### 2. Thinking Mode vs. Instant Mode

**Thinking Mode (Default):**
- Deep reasoning with visible thought process
- Ideal for: Architecture design, complex algorithms, debugging
- Trade-off: Slower response (2-3x)

**Instant Mode:**
- Direct output without reasoning
- Ideal for: Quick snippets, simple queries, code generation
- Trade-off: Less thorough analysis

### 3. Ultra-Long Context (256K Tokens)
Perfect for working with large codebases:
- Analyze entire projects
- Understand complex dependencies
- Refactor across multiple files

## Example Use Cases for Sub-Agents

### Use Case 1: Quick Function Writing
```bash
opencode --model kimi-k2.5-instant \
  "Write a TypeScript function to validate email addresses with regex"
```

### Use Case 2: Code Explanation
```bash
opencode --model kimi-k2.5-instant \
  "Explain what this code does: <paste code>"
```

### Use Case 3: Bug Fix
```bash
opencode --model kimi-k2.5-thinking \
  "Find and fix the bug in this function: <paste code>"
```

### Use Case 4: Refactoring
```bash
opencode --model kimi-k2.5-thinking \
  "Refactor this code to be more maintainable: <paste code>"
```

### Use Case 5: Test Generation
```bash
opencode --model kimi-k2.5-instant \
  "Write unit tests for this function using Jest: <paste code>"
```

## Performance Benchmarks

| Benchmark | Kimi K2.5 | Claude Opus 4.5 | GPT-4o |
|-----------|-----------|-----------------|--------|
| HLE (Full Set) | 50.2% | 43.5% | 42.1% |
| BrowseComp | 74.9% | 51.5% | 49.3% |
| Coding Tasks | SOTA | Second | Third |
| Visual Coding | Native | Limited | Good |

## Comparison: Kimi K2.5 vs Claude

**Kimi K2.5 excels at:**
- Complex mathematical reasoning
- Visual coding (design-to-code)
- Tasks requiring deep thinking
- Coding and agentic benchmarks
- Cost-effective (open source)

**Claude excels at:**
- Long text comprehension and summarization
- Nuanced language expression
- Multi-turn conversation consistency
- Natural language tasks

## Tips for Sub-Agent Integration

1. **Use Instant Mode by default** for sub-agents unless the task requires deep reasoning
2. **Set timeouts appropriately** - thinking mode can take 10-30 seconds for complex tasks
3. **Cache results** when possible - Kimi K2.5 is consistent with similar prompts
4. **Leverage visual coding** - provide screenshots for UI tasks
5. **Use context wisely** - 256K tokens means you can include lots of code context

## Troubleshooting

### Issue: "API key not found"
**Solution:** Edit `~/.config/opencode/opencode.json` and add your API key

### Issue: "Response is slow"
**Solution:** Switch to instant mode (`--model kimi-k2.5-instant`)

### Issue: "Model not found"
**Solution:** Ensure your OpenCode version is 1.1.0+ (check with `opencode --version`)

### Issue: "Rate limit exceeded"
**Solution:** Switch providers (OpenRouter → Moonshot) or wait a few minutes

## Resources

- **OpenCode GitHub:** https://github.com/anomalyco/opencode
- **Kimi K2.5 Hugging Face:** https://huggingface.co/moonshotai/Kimi-K2.5
- **Moonshot Platform:** https://platform.moonshot.ai
- **OpenRouter:** https://openrouter.ai
- **OpenCode Docs:** https://opencode.ai/docs

## License

Kimi K2.5 uses a modified MIT license with additional commercial terms. Check the complete license on Hugging Face for commercial use details.

---

**Last Updated:** 2026-02-10  
**OpenCode Version:** 1.1.53  
**Kimi K2.5 Release:** January 2026

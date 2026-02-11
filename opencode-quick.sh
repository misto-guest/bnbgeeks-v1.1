#!/bin/bash
# OpenCode Kimi-K25 Quick Reference for Clawdbot Sub-Agents

# Usage: ./opencode-quick.sh [model] [prompt]
# Models: instant, thinking, moonshot

MODEL="${1:-instant}"
PROMPT="${2:-}"
CONFIG="$HOME/.config/opencode/opencode.json"

case "$MODEL" in
  instant)
    MODEL_NAME="kimi-k2.5-instant"
    echo "🚀 Using Kimi K2.5 Instant Mode (fast responses)"
    ;;
  thinking)
    MODEL_NAME="kimi-k2.5-thinking"
    echo "🧠 Using Kimi K2.5 Thinking Mode (deep reasoning)"
    ;;
  moonshot)
    MODEL_NAME="kimi-k2.5-moonshot"
    echo "🌙 Using Kimi K2.5 via Moonshot API (lowest latency)"
    ;;
  *)
    echo "❌ Unknown model: $MODEL"
    echo "Usage: $0 [instant|thinking|moonshot] [prompt]"
    exit 1
    ;;
esac

# Check if API key is configured
if grep -q "YOUR_.*_API_KEY_HERE" "$CONFIG"; then
  echo "⚠️  WARNING: API key not configured in $CONFIG"
  echo "Please edit the config file and add your API key"
  echo ""
  echo "Choose one of:"
  echo "  1. OpenRouter: https://openrouter.ai"
  echo "  2. Moonshot AI: https://platform.moonshot.ai"
  echo "  3. Synthetic: https://synthetic.new (free, limited)"
  exit 1
fi

# Run OpenCode
if [ -z "$PROMPT" ]; then
  # Interactive mode
  opencode --model "$MODEL_NAME"
else
  # Single-shot mode
  opencode --model "$MODEL_NAME" "$PROMPT"
fi

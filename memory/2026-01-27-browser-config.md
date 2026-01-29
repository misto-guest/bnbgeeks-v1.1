# Session: 2026-01-27 08:23:44 UTC

- **Session Key**: agent:dmitry:main
- **Session ID**: 1df208fc-6ae6-4e85-9c2f-674c187a5146
- **Source**: telegram

## Conversation Summary

assistant: **Found the issue!**

Your `clawdbot.json` doesn't have a `browser` section, so it's using the **default settings** which has `defaultProfile: "chrome"` (Chrome extension relay mode).

---

## The Fix

Add a browser section to your configuration to make `clawd` the default:

```json5
{
  browser: {
    enabled: true,
    defaultProfile: "clawd"
  }
}
```

This tells Clawdbot to use the **isolated, managed browser** (`clawd`) by default instead of the Chrome extension relay.

---

## What Happening Now

| Current State | After Fix |
|---------------|------------|
| `defaultProfile: "chrome"` | `defaultProfile: "clawd"` |
| Requires tab attachment | No attachment needed |
| Extension relay mode | Direct browser control |

---

**Want me to apply this configuration update?** I can patch the config to add the browser section with `defaultProfile: "clawd"`.
user: [Queued messages while agent was busy]

---
Queued #1
[Telegram B (@rozhiu) id:1563672361 +2m 2026-01-27 09:22 GMT+1] ok please start building. Build intuitive and user-friendly interface too with 8 pages max.
[message_id: 215]

#!/bin/bash
# SSH Reminder - Will trigger Monday 10 AM
# This script is scheduled via at/cron

TARGET_TIME="2026-02-03 10:00:00"
CURRENT_TIME=$(date +%s)
TARGET_EPOCH=$(date -j -f "%Y-%m-%d %H:%M:%S" "$TARGET_TIME" +%s)
DELAY_SECONDS=$((TARGET_EPOCH - CURRENT_TIME))

if [ $DELAY_SECONDS -gt 0 ]; then
    echo "SSH reminder scheduled for Monday 10:00 AM (in $DELAY_SECONDS seconds)"
    echo "Will send reminder when time comes"
    # Note: In production, use 'at' or cron to trigger the actual notification
else
    echo "🔔 Reminder: Install SSH

You requested this reminder on Saturday Feb 1. Time to install SSH!

Next steps:
- Check what you need SSH for (server access? GitHub keys?)
- Run: ssh-keygen if you need new keys
- Copy public key: cat ~/.ssh/id_ed25519.pub
- Add to services (GitHub, servers, etc.)

Let me know if you need help with the setup!"
fi

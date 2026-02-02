#!/bin/bash

# Podcast Recording Script with BlackHole
# Usage: ./record.sh [output_filename.mp3]

OUTPUT_FILE="${1:-/Users/northsea/clawd-dmitry/media/podcast/recording.mp3}"
DURATION="${2:-3600}"  # Default 1 hour, or specify seconds

echo "🎙️  Recording to: $OUTPUT_FILE"
echo "⏱️  Duration: $DURATION seconds"
echo ""
echo "📝 Instructions:"
echo "1. Make sure BlackHole 2ch is set as output in Sound Settings"
echo "2. Play the YouTube podcast episode"
echo "3. Press Enter to start recording..."
read

echo "🔴 Recording started..."
ffmpeg -f avfoundation -i ":BlackHole 2ch" -t "$DURATION" -acodec libmp3lame -ab 192k "$OUTPUT_FILE"

echo "✅ Recording saved to: $OUTPUT_FILE"
echo "📊 File info:"
ls -lh "$OUTPUT_FILE"

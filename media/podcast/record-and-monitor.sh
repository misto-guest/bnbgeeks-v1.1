#!/bin/bash

OUTPUT="/Users/northsea/clawd-dmitry/media/podcast/dubai-podcast-recording.mp3"

echo "🎙️  BlackHole Recording Script"
echo "================================"
echo ""
echo "Step 1: Starting FFmpeg..."
echo ""

# Start recording in background, redirect output to log
ffmpeg -f avfoundation -i ":0" -acodec libmp3lame -ab 192k "$OUTPUT" > /tmp/ffmpeg.log 2>&1 &
FFPID=$!
echo $FFPID > /tmp/recording.pid

echo "✅ Recording started (PID: $FFPID)"
echo "📁 Output: $OUTPUT"
echo ""
echo "Step 2: PLAY THE PODCAST NOW!"
echo "   Open YouTube and play the podcast episode"
echo "   Start from timestamp 33:26"
echo ""
echo "Step 3: Monitoring..."
echo ""

# Monitor for 10 seconds
for i in {1..10}; do
  sleep 1
  if [ -f "$OUTPUT" ]; then
    SIZE=$(du -h "$OUTPUT" | cut -f1)
    echo "  [$i/10] Recording... Size: $SIZE"
  else
    echo "  [$i/10] Waiting for audio input..."
  fi

  # Check if ffmpeg is still running
  if ! ps -p $FFPID > /dev/null; then
    echo ""
    echo "❌ FFmpeg stopped unexpectedly"
    echo "📋 Log:"
    cat /tmp/ffmpeg.log | tail -20
    exit 1
  fi
done

echo ""
echo "✅ Recording is running smoothly!"
echo "📝 Let it run until the podcast ends"
echo "   Then tell me to stop it"
echo ""
echo "💡 To stop manually, run:"
echo "   kill $(cat /tmp/recording.pid)"

# 🎙️ Podcast Recording Guide (BlackHole + macOS)

## Quick Setup (One-Time)

### 1. Install BlackHole (if not already)
```bash
brew install blackhole-2ch
```

### 2. Configure Audio Settings
1. Open **Audio MIDI Setup** (Cmd+Space, type "Audio MIDI")
2. Click **+** button → **Create Multi-Output Device**
3. Check both:
   - Built-in Output (or your speakers)
   - BlackHole 2ch
4. Right-click → **Use This Device For Sound Output**
5. Also set BlackHole 2ch as input for recording

## Recording the Podcast

### Option A: Use the Script (Recommended)
```bash
cd /Users/northsea/clawd-dmitry/media/podcast
./record.sh podcast-dubai.mp3
```
Then:
1. Play the YouTube podcast episode (from 33:26 as you wanted)
2. Press Enter in terminal to start recording
3. When done, press Ctrl+C to stop

### Option B: Use QuickTime Player
1. Open QuickTime Player
2. File → New Audio Recording
3. Select **BlackHole 2ch** as input
4. Click record, play the podcast
5. Save the file

### Option C: Use GarageBand (Free with macOS)
1. Create new project → Audio
2. Set input to BlackHole 2ch
3. Record while playing the podcast
4. Export as MP3

## After Recording

Send me the file and I'll transcribe it using OpenAI Whisper:
- Full transcription
- Timestamps (if needed)
- Summary
- Key quotes

Save the file to: `/Users/northsea/clawd-dmitry/media/podcast/`
Then tell me the filename and I'll transcribe it immediately.

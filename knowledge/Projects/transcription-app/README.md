# Transcription App

**Status:** ✅ Completed (2026-01-29)
**Location:** `/Users/northsea/clawd-dmitry/transcription-app`
**URL:** http://localhost:3000 (local)

## Overview
Full-featured transcription app supporting YouTube, Spotify, and direct audio file upload using AssemblyAI API.

## Features
- YouTube transcript extraction (yt-dlp + AssemblyAI)
- Spotify download & transcription (spotdl + AssemblyAI)
- Audio file upload (AssemblyAI API)
- 3-tab modern UI (Tailwind CSS)
- Stats display: word count, duration

## Tech Stack
- Next.js 15
- AssemblyAI API
- yt-dlp (YouTube)
- spotdl (Spotify)
- Tailwind CSS

## Configuration
| Service | API Key |
|---------|----------|
| AssemblyAI | `da00adef1147469191157b3a562d82b3` |
| OpenRouter | `sk-or-v1...f31` |
| z.ai | `sk-zai...xxxxx` (placeholder) |
| Perplexity Pro | `pplx-...xxxxx` (placeholder) |

## Automation Scripts
- `spotify-recorder.sh` - Automated Spotify recording
- `setup-spotify-recorder.sh` - One-time setup

## Cost
- AssemblyAI: $0.04 (testing)
- Development: $0 (built by Dmitry)
- Spotify automation: $0 (free CLI tools)

## Next Steps
1. Create GitHub repository
2. Deploy to Vercel
3. Add environment variables

## Documentation
- `SPOTIFY_DRM_GUIDE.md` - NoteBurner manual method
- `AUTOMATED_RECORDING.md` - Automated scripts
- `SPOTIFY_AUTOMATION_SUMMARY.md` - Implementation summary

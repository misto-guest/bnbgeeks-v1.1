# Session: 2026-01-27 - AssemblyAI Integration

- **Date**: 2026-01-27 12:10 GMT+1
- **User**: B (@rozhiu)
- **Request**: Update app to use AssemblyAI API
- **Selected**: AssemblyAI (cheapest option: $0.15/hour vs Deepgram $0.55/hour)

## Changes Made

### 1. Installed Dependencies
- `assemblyai` npm package
- `youtube-dl-exec` npm package
- `glob` npm package for file finding

### 2. System Tools Installed
- **yt-dlp** via Homebrew (`/opt/homebrew/bin/yt-dlp`)
- **spotdl** via pipx (`/Users/northsea/.local/bin/spotdl`)
- **pipx** (was already installed)

### 3. Updated API Routes

**YouTube (`app/api/youtube/route.ts`)**:
- Downloads audio using yt-dlp
- Uploads to AssemblyAI
- Transcribes via AssemblyAI API
- Falls back to youtube-transcript if download fails
- Uses temp directory for audio files

**Spotify (`app/api/spotify/route.ts`)**:
- Downloads audio using spotdl
- Uploads to AssemblyAI
- Transcribes via AssemblyAI API
- Uses temp directory for audio files

### 4. Updated Configuration Files
- `.gitignore` - Added `/temp/` to exclude audio files
- `.env.example` - Added ASSEMBLYAI_API_KEY template
- `README.md` - Updated with AssemblyAI setup instructions

### 5. Updated Cost Comparison
| Service | Base Cost | Free Tier |
|---------|-----------|-----------|
| **AssemblyAI** | $0.15/hour | 185 hours free |
| Deepgram | $0.55/hour | $200 credit (~362 hours) |

## Requirements for Use

**User must provide:**
1. AssemblyAI API key (from https://www.assemblyai.com/)
2. Set `ASSEMBLYAI_API_KEY` in `.env.local` or Vercel env vars

**System requirements (already installed):**
- yt-dlp (for YouTube audio)
- spotdl (for Spotify audio)
- FFmpeg (required by both tools)

## Dev Server
- Running at: http://localhost:3000
- Ready for testing with API key

## Next Steps for User
1. Get AssemblyAI API key from https://www.assemblyai.com/
2. Create `.env.local` file with API key
3. Test with YouTube URL
4. Deploy to Vercel with API key in environment variables

# YouTube Transcription Attempt - 2026-02-01

**Video URL:** https://m.youtube.com/watch?v=ExzAiMjT6jg
**Video ID:** ExzAiMjT6jg

---

## Attempted Methods

### 1. Transcription App (localhost:3000)
- **Method:** Web UI with AssemblyAI backend
- **Result:** API returned 200 but empty transcript
- **Note:** Fallback to YouTube transcript failed

### 2. AssemblyAI Direct API
- **Transcript ID:** efe98774-8d48-4c8c-bd84-a223af1c462c
- **Status:** Error (unable to process YouTube URL directly)
- **Issue:** YouTube blocking direct audio access

### 3. yt-dlp Audio Download
- **Attempts:** Multiple formats and user-agents
- **Result:** HTTP Error 403: Forbidden
- **Issue:** YouTube blocking automated downloads

### 4. Python youtube-transcript-api
- **Status:** Not installed, system restrictions

---

## Root Cause

YouTube is actively blocking automated access to this video's audio and transcript. This is likely due to:
- Video content restrictions
- YouTube's anti-scraping measures
- Copyright protection on the content

---

## Alternative Solutions

### Option 1: Manual Download & Upload
1. Use browser extension to download audio manually
2. Upload to transcription app via "Upload File" tab
3. AssemblyAI will transcribe successfully

### Option 2: Use Screen Recording
1. Open video in browser
2. Use BlackHole + QuickTime to record audio
3. Upload recording to transcription app

### Option 3: Third-party Services
- Online transcription services that accept YouTube URLs
- Services with different YouTube access methods

### Option 4: Check if Video Has Built-in Captions
- Open video on YouTube
- Click CC button
- If captions exist, copy them manually

---

## Recommendation

**Best approach:** Manual download or screen recording, then upload to the transcription app. The AssemblyAI transcription service itself works perfectly - it's accessing the YouTube audio that's the bottleneck.

Would you like me to:
1. Help set up screen recording automation?
2. Guide you through manual download/upload?
3. Try alternative transcription services?

---

*This video has strong access restrictions from YouTube's side.*

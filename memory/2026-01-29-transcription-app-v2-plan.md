# Transcription App - V2 Enhancement Plan

**Date:** 2026-01-29
**User:** B (@rozhiu)

---

## Features to Build

### Core V1 Features (Existing)
| Feature | Status |
|---------|--------|
| YouTube Transcription | ✅ Working | AssemblyAI |
| Spotify Download | ✅ Working | AssemblyAI |
| Audio File Upload | ✅ Working | AssemblyAI |
| OpenRouter API | ✅ Working | GPT-4.1 Mini |

### New V2 Features to Build

| Feature | Priority | Description |
|---------|----------|
| **Saved Transcripts** | High | Store all transcripts with timestamps for later access |
| **User Settings Modal** | High | Theme toggle, provider selection, customization |
| **Transcript History** | Medium | Sidebar list of all past transcriptions |
| **Analytics Dashboard** | Medium | Track usage, costs, transcription stats |
| **Search History** | Low | Remember all searches made |
| **One-Click Deploy** | High | Push to Vercel without terminal |
| **Responsive Design** | Medium | Mobile-friendly UI |

---

## Architecture

### Frontend Structure
```
/app/
├── components/
│   ├── TranscriptionHistory.tsx
│   ├── UserSettings.tsx
│   ├── AnalyticsDashboard.tsx
│   └── SearchHistory.tsx
├── lib/
│   ├── hooks/
│   │   └── localStorage.ts
├── services/
│   ├── assemblyAI.ts
│   ├── openRouter.ts
│   └── storage.ts
└── app/
    ├── page.tsx
    ├── tabs/
    │   ├── youtube.tsx
    │   ├── spotify.tsx
    │   └── upload.tsx
    └── api/
        ├── youtube/route.ts
        ├── spotify/route.ts
        └── upload/route.ts
```

### Backend API Updates
```
/api/history
├── POST    /save (transcript, metadata)
├── GET     /list (all transcripts with pagination)
├── DELETE  /:id

/api/settings
├── GET     /get
├── POST    /update (theme, defaultProvider)

/api/analytics
├── GET     /overview (total cost, usage stats)
├── GET     /breakdown (by service, by time)
```

---

## Implementation Phase 1: Saved Transcripts

**File:** `app/components/TranscriptionHistory.tsx`

**Component:**
```typescript
'use client'

interface Transcript {
  id: string
  timestamp: string
  text: string
  metadata: {
    filename?: string
    duration?: number
    wordCount?: number
  }
}

export default function TranscriptionHistory({ transcripts, onSave }: { transcripts, onSave }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Transcripts</h2>
          {transcripts.length === 0 ? (
            <p className="text-gray-500 text-center mb-4">No transcripts saved yet</p>
          ) : (
            <div className="space-y-4">
              {transcripts.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-900">{new Date(t.timestamp).toLocaleDateString()}</div>
                    <p className="text-xs text-gray-500">{t.metadata.duration}s</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{t.text.substring(0, 100)}...</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleView(t)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={onSave}
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Save New Transcript
            </button>
          </div>
        </div>
      )
}
```

---

## Implementation Phase 2: User Settings

**File:** `app/components/UserSettings.tsx`

**Features:**
- Theme toggle (light/dark)
- Default provider selection (OpenRouter/Perplexity/Z.ai)
- Customizable preferences

---

## Implementation Phase 3: Analytics Dashboard

**File:** `app/components/AnalyticsDashboard.tsx`

**Features:**
- Total transcriptions
- Total words processed
- Total audio duration
- Cost breakdown by API
- Usage over time

---

## Implementation Phase 4: Search History

**File:** `app/components/SearchHistory.tsx`

**Features:**
- Recent searches list
- Search term suggestions
- Re-run previous searches

---

## API Endpoints to Create

### History API
```typescript
// POST /api/history/save
{
  id: string
  transcript: string
  metadata: {
    filename?: string
    duration?: number
  }
}

interface SaveHistoryRequest {
  transcript: string
  metadata?: {
    filename?: string
    duration?: number
  }
}

export async function POST(request: Request) {
  const { transcript, metadata } = request.body
  const id = crypto.randomUUID()
  
  // Save to localStorage
  const history: JSON.parse(localStorage.getItem('transcriptionHistory') || '[]')
  history.push({
    id,
    timestamp: new Date().toISOString(),
    transcript,
    metadata
  })
  localStorage.setItem('transcriptionHistory', JSON.stringify(history))
  
  return { id }
}

// GET /api/history/list
export async function GET() {
  const history = JSON.parse(localStorage.getItem('transcriptionHistory') || '[]')
  return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).reverse())
}
```

### Settings API
```typescript
interface UserSettings {
  theme: 'light' | 'dark'
  defaultProvider: 'openrouter' | 'perplexity' | 'zai'
}

interface GetSettingsResponse {
  settings: UserSettings
}

// GET /api/settings
export async function GET() {
  const settings = JSON.parse(localStorage.getItem('userSettings') || '{}')
  return { settings }
}

// POST /api/settings/update
interface UpdateSettingsRequest {
  settings: Partial<UserSettings>
}

export async function POST(request: Request) {
  const newSettings = { ...settings, ...request.body }
  
  localStorage.setItem('userSettings', JSON.stringify(newSettings))
  return { success: true }
}
```

---

## Implementation Phase 5: One-Click Deploy

**File:** `app/components/OneClickDeploy.tsx`

**Features:**
- Vercel integration
- Pre-configured build command
- Auto-deploy on push

---

## UI Improvements

**File:** `app/page.tsx`

**Changes:**
1. Add analytics section to footer
2. Implement responsive design for mobile
3. Add loading states for all async operations
4. Improve color contrast and accessibility

---

## Deployment Preparation

1. **Create GitHub repository**: Push all code
2. **Configure Vercel project**: Add environment variables
3. **Deploy**: Connect and push

---

## Summary

**Phase 1**: Saved Transcripts
**Phase 2**: User Settings
**Phase 3**: Analytics Dashboard
**Phase 4**: Search History
**Phase 5**: One-Click Deploy
**Phase 6**: UI Improvements
**Phase 7**: Deployment

---

## Estimated Development Time

| Phase | Time |
|-------|----------|
| Architecture | 2 hours |
| API Endpoints | 3 hours |
| Frontend Components | 2 hours |
| UI Improvements | 1 hour |
| Deployment Prep | 1 hour |
| **Total** | 9 hours |

---

## What I Can Do Now

I can start implementing these features immediately, or you can provide feedback on:
- Which feature to prioritize?
- Do you want full implementation or proof-of-concept first?
- Specific UI preferences?

---

**Ready to build!** Just say the word and I'll start coding! 🔧

# V2 Transcription App

A modern, full-featured transcription application with analytics, user settings, and Vercel deployment.

## Features

- **Transcript Management**: Save, search, and organize transcripts
- **Rich Metadata**: Timestamps, word count, duration tracking
- **Analytics Dashboard**: Usage statistics, cost tracking, trends
- **User Settings**: Theme customization, provider selection
- **Modern UI**: Dark mode, mobile-responsive, accessible
- **Search**: Full-text search across transcripts

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: SQLite (local) / PostgreSQL (Vercel)
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Analytics dashboard
│   ├── transcripts/      # Transcript management
│   └── settings/         # User settings
├── components/
│   ├── ui/               # shadcn/ui components
│   └── features/         # Feature components
├── lib/
│   ├── db/               # Database utilities
│   └── utils/            # Helper functions
└── types/                # TypeScript types
```

## API Endpoints

### Transcripts
- `POST /api/transcripts` - Create transcript
- `GET /api/transcripts` - List all transcripts
- `GET /api/transcripts/[id]` - Get single transcript
- `PUT /api/transcripts/[id]` - Update transcript
- `DELETE /api/transcripts/[id]` - Delete transcript
- `GET /api/transcripts/search?q=` - Search transcripts

### Analytics
- `GET /api/analytics` - Get usage statistics

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

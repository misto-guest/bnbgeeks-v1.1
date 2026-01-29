import { z } from 'zod'

// Transcript schemas
export const TranscriptSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  audioUrl: z.string().url().optional(),
  duration: z.number().min(0, 'Duration must be positive'),
  wordCount: z.number().int().min(0, 'Word count must be positive'),
  timestamps: z.array(z.object({
    time: z.number(),
    word: z.string(),
  })).optional(),
  provider: z.string().default('openai'),
  model: z.string().default('gpt-4'),
  cost: z.number().min(0, 'Cost must be positive').default(0),
})

export type Transcript = z.infer<typeof TranscriptSchema>

// Settings schemas
export const SettingSchema = z.object({
  key: z.string(),
  value: z.any(), // Will be JSON stringified
})

export type Setting = z.infer<typeof SettingSchema>

// User settings structure
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  defaultProvider: 'openai' | 'anthropic' | 'google'
  defaultModel: string
  autoSave: boolean
  maxTranscripts: number
}

// Analytics data
export interface AnalyticsData {
  totalTranscripts: number
  totalWords: number
  totalDuration: number // in seconds
  totalCost: number
  averageWordsPerTranscript: number
  averageDurationPerTranscript: number
  providerBreakdown: Record<string, {
    count: number
    cost: number
    percentage: number
  }>
  dailyStats: Array<{
    date: string
    transcripts: number
    words: number
    duration: number
    cost: number
  }>
}

// Search result
export interface SearchResult {
  transcript: Transcript
  highlights: string[] // Words/phrases that matched
  relevanceScore: number
}

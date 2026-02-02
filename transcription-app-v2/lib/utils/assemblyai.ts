/**
 * AssemblyAI Transcription Utility
 * Handles audio transcription using AssemblyAI API
 */

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY || ''
const ASSEMBLYAI_API_URL = 'https://api.assemblyai.com/v2'

export interface TranscriptionResult {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'error'
  text: string
  confidence: number
  duration: number
  words: Array<{
    text: string
    start: number
    end: number
    confidence: number
  }>
  utterances?: Array<{
    speaker: string
    text: string
    start: number
    end: number
    confidence: number
  }>
}

export interface TranscriptionOptions {
  language_code?: string
  speaker_labels?: boolean
  speakers_expected?: number
  punctuate?: boolean
  format_text?: boolean
  dual_channel?: boolean
}

/**
 * Transcribe an audio file from URL
 */
export async function transcribeAudio(
  audioUrl: string,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
  if (!ASSEMBLYAI_API_KEY) {
    throw new Error('ASSEMBLYAI_API_KEY is not configured')
  }

  // Default options
  const transcriptionOptions: TranscriptionOptions = {
    language_code: 'en', // Default to English
    punctuate: true,
    format_text: true,
    speaker_labels: false,
    ...options,
  }

  try {
    // Submit transcription request
    const submitResponse = await fetch(`${ASSEMBLYAI_API_URL}/transcript`, {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        ...transcriptionOptions,
      }),
    })

    if (!submitResponse.ok) {
      const error = await submitResponse.json()
      throw new Error(`Failed to submit transcription: ${error.error || 'Unknown error'}`)
    }

    const { id } = await submitResponse.json()

    // Poll for completion
    return await pollTranscriptionStatus(id)
  } catch (error) {
    console.error('Transcription error:', error)
    throw error
  }
}

/**
 * Upload local audio file and transcribe
 */
export async function transcribeAudioFile(
  audioFile: File | Buffer | Blob,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
  if (!ASSEMBLYAI_API_KEY) {
    throw new Error('ASSEMBLYAI_API_KEY is not configured')
  }

  try {
    // Convert Buffer to Blob if needed
    let body: Blob | File
    if (Buffer.isBuffer(audioFile)) {
      body = new Blob([new Uint8Array(audioFile)])
    } else if (audioFile instanceof Blob) {
      body = audioFile
    } else {
      body = new Blob([audioFile])
    }

    // Upload the file
    const uploadResponse = await fetch(`${ASSEMBLYAI_API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLYAI_API_KEY,
      },
      body,
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload audio file')
    }

    const { upload_url } = await uploadResponse.json()

    // Transcribe using the uploaded URL
    return await transcribeAudio(upload_url, options)
  } catch (error) {
    console.error('Audio file transcription error:', error)
    throw error
  }
}

/**
 * Poll transcription status until complete
 */
async function pollTranscriptionStatus(
  transcriptionId: string,
  maxAttempts = 60,
  interval = 2000
): Promise<TranscriptionResult> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `${ASSEMBLYAI_API_URL}/transcript/${transcriptionId}`,
        {
          headers: {
            'Authorization': ASSEMBLYAI_API_KEY,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to check transcription status')
      }

      const result: TranscriptionResult = await response.json()

      if (result.status === 'completed') {
        return result
      }

      if (result.status === 'error') {
        throw new Error('Transcription failed')
      }

      // Still processing, wait and retry
      await new Promise(resolve => setTimeout(resolve, interval))
    } catch (error) {
      console.error('Polling error:', error)
      throw error
    }
  }

  throw new Error('Transcription timed out')
}

/**
 * Get transcription cost estimation
 */
export function estimateTranscriptionCost(
  durationSeconds: number
): number {
  // AssemblyAI pricing: Free tier includes 3 hours/month
  // After free tier: $0.00025 per second
  const FREE_TIER_SECONDS = 3 * 60 * 60 // 3 hours
  const PAID_RATE_PER_SECOND = 0.00025

  // This is a rough estimate - actual usage is tracked by AssemblyAI
  return durationSeconds * PAID_RATE_PER_SECOND
}

/**
 * Check if AssemblyAI is configured
 */
export function isAssemblyAIConfigured(): boolean {
  return !!ASSEMBLYAI_API_KEY && ASSEMBLYAI_API_KEY.length > 0
}

/**
 * Format transcription for storage
 */
export function formatTranscriptForStorage(
  result: TranscriptionResult
): {
  content: string
  wordCount: number
  duration: number
  timestamps?: Array<{ time: number; word: string }>
} {
  const wordCount = result.text.split(/\s+/).filter(w => w.length > 0).length
  const duration = Math.round(result.duration)

  // Generate simple timestamps from word-level data
  const timestamps = result.words?.map(word => ({
    time: word.start,
    word: word.text,
  }))

  return {
    content: result.text,
    wordCount,
    duration,
    timestamps,
  }
}

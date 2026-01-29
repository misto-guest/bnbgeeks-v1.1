import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { TranscriptSchema } from '@/types'

/**
 * GET /api/transcripts
 * List all transcripts with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const provider = searchParams.get('provider')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where = provider ? { provider } : {}

    const [transcripts, total] = await Promise.all([
      prisma.transcript.findMany({
        where,
        orderBy: { [sortBy]: sortOrder as 'asc' | 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.transcript.count({ where }),
    ])

    return NextResponse.json({
      transcripts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching transcripts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transcripts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/transcripts
 * Create a new transcript
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = TranscriptSchema.parse(body)

    // Create transcript
    const transcript = await prisma.transcript.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        audioUrl: validatedData.audioUrl,
        duration: validatedData.duration,
        wordCount: validatedData.wordCount,
        timestamps: validatedData.timestamps
          ? JSON.stringify(validatedData.timestamps)
          : null,
        provider: validatedData.provider,
        model: validatedData.model,
        cost: validatedData.cost,
        searchVector: validatedData.content.toLowerCase(),
      },
    })

    // Update analytics
    await updateAnalytics(transcript)

    return NextResponse.json(transcript, { status: 201 })
  } catch (error) {
    console.error('Error creating transcript:', error)
    return NextResponse.json(
      { error: 'Failed to create transcript' },
      { status: 500 }
    )
  }
}

/**
 * Helper function to update analytics
 */
async function updateAnalytics(transcript: any) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.analytics.upsert({
    where: { date: today },
    create: {
      date: today,
      totalTranscripts: 1,
      totalWords: transcript.wordCount,
      totalDuration: transcript.duration,
      totalCost: transcript.cost,
      providerStats: JSON.stringify({
        [transcript.provider]: {
          cost: transcript.cost,
          count: 1,
        },
      }),
    },
    update: {
      totalTranscripts: { increment: 1 },
      totalWords: { increment: transcript.wordCount },
      totalDuration: { increment: transcript.duration },
      totalCost: { increment: transcript.cost },
    },
  })
}

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { calculateRelevanceScore } from '@/lib/utils/transcript'

/**
 * GET /api/transcripts/search
 * Search transcripts by query
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        total: 0,
        query,
      })
    }

    // Get all transcripts (in production, use database full-text search)
    const allTranscripts = await prisma.transcript.findMany()

    // Calculate relevance scores
    const results = allTranscripts
      .map(transcript => ({
        transcript: {
          ...transcript,
          timestamps: transcript.timestamps
            ? JSON.parse(transcript.timestamps)
            : null,
        },
        relevanceScore: calculateRelevanceScore(
          transcript.content + ' ' + transcript.title,
          query
        ),
      }))
      .filter(result => result.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)

    // Save to search history
    await prisma.searchHistory.create({
      data: {
        query,
        resultsCount: results.length,
      },
    })

    return NextResponse.json({
      results,
      total: results.length,
      query,
    })
  } catch (error) {
    console.error('Error searching transcripts:', error)
    return NextResponse.json(
      { error: 'Failed to search transcripts' },
      { status: 500 }
    )
  }
}

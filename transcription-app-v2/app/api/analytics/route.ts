import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { AnalyticsData } from '@/types'

/**
 * GET /api/analytics
 * Get analytics data including stats, trends, and breakdowns
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')

    // Get overall stats
    const [
      totalTranscripts,
      totalWords,
      totalDuration,
      totalCost,
    ] = await Promise.all([
      prisma.transcript.count(),
      prisma.transcript.aggregate({ _sum: { wordCount: true } }),
      prisma.transcript.aggregate({ _sum: { duration: true } }),
      prisma.transcript.aggregate({ _sum: { cost: true } }),
    ])

    // Get daily stats for the last N days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const recentTranscripts = await prisma.transcript.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Group by date
    const dailyStatsMap = new Map<string, {
      transcripts: number
      words: number
      duration: number
      cost: number
    }>()

    recentTranscripts.forEach(t => {
      const dateKey = t.createdAt.toISOString().split('T')[0]
      const existing = dailyStatsMap.get(dateKey) || {
        transcripts: 0,
        words: 0,
        duration: 0,
        cost: 0,
      }

      dailyStatsMap.set(dateKey, {
        transcripts: existing.transcripts + 1,
        words: existing.words + t.wordCount,
        duration: existing.duration + t.duration,
        cost: existing.cost + t.cost,
      })
    })

    const dailyStats = Array.from(dailyStatsMap.entries()).map(([date, stats]) => ({
      date,
      ...stats,
    }))

    // Provider breakdown
    const allTranscripts = await prisma.transcript.findMany()
    const providerBreakdown: Record<string, { count: number; cost: number }> = {}

    allTranscripts.forEach(t => {
      if (!providerBreakdown[t.provider]) {
        providerBreakdown[t.provider] = { count: 0, cost: 0 }
      }
      providerBreakdown[t.provider].count++
      providerBreakdown[t.provider].cost += t.cost
    })

    const total = totalTranscripts || 1
    const providerBreakdownWithPercentage = Object.entries(providerBreakdown)
      .map(([provider, stats]) => ({
        provider,
        count: stats.count,
        cost: stats.cost,
        percentage: Math.round((stats.count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)

    const analytics: AnalyticsData = {
      totalTranscripts,
      totalWords: totalWords._sum.wordCount || 0,
      totalDuration: totalDuration._sum.duration || 0,
      totalCost: totalCost._sum.cost || 0,
      averageWordsPerTranscript: totalTranscripts
        ? Math.round((totalWords._sum.wordCount || 0) / totalTranscripts)
        : 0,
      averageDurationPerTranscript: totalTranscripts
        ? Math.round((totalDuration._sum.duration || 0) / totalTranscripts)
        : 0,
      providerBreakdown: providerBreakdownWithPercentage.reduce((acc, item) => {
        acc[item.provider] = {
          count: item.count,
          cost: item.cost,
          percentage: item.percentage,
        }
        return acc
      }, {} as any),
      dailyStats,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

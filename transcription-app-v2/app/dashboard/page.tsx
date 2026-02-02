'use client'

import { useEffect, useState } from 'react'
import { BarChart3, FileText, Clock, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDuration, formatCost } from '@/lib/utils/transcript'

interface AnalyticsData {
  totalTranscripts: number
  totalWords: number
  totalDuration: number
  totalCost: number
  averageWordsPerTranscript: number
  averageDurationPerTranscript: number
  providerBreakdown: Record<string, { count: number; cost: number; percentage: number }>
  dailyStats: Array<{
    date: string
    transcripts: number
    words: number
    duration: number
    cost: number
  }>
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Analytics Dashboard</h1>
            <div className="text-muted-foreground">
              No analytics data available. The database may not be configured yet.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your transcription usage and costs
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<FileText className="w-6 h-6" />}
            label="Total Transcripts"
            value={(analytics.totalTranscripts || 0).toLocaleString()}
            color="blue"
          />
          <MetricCard
            icon={<FileText className="w-6 h-6" />}
            label="Total Words"
            value={(analytics.totalWords || 0).toLocaleString()}
            color="green"
          />
          <MetricCard
            icon={<Clock className="w-6 h-6" />}
            label="Total Duration"
            value={formatDuration(analytics.totalDuration || 0)}
            color="purple"
          />
          <MetricCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Total Cost"
            value={formatCost(analytics.totalCost || 0)}
            color="orange"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Averages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Words per transcript</span>
                  <span className="text-2xl font-semibold">
                    {(analytics.averageWordsPerTranscript || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration per transcript</span>
                  <span className="text-2xl font-semibold">
                    {formatDuration(analytics.averageDurationPerTranscript || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Provider Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.providerBreakdown || {}).map(([provider, stats]) => (
                  <div key={provider}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{provider}</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.count} transcripts ({stats.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Cost: {formatCost(stats.cost)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Daily Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!(analytics.dailyStats || []).length ? (
              <div className="text-center text-muted-foreground py-8">
                No activity data available yet
              </div>
            ) : (
              <div className="space-y-3">
                {(analytics.dailyStats || []).slice(-10).reverse().map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium min-w-[100px]">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {day.transcripts} transcript{day.transcripts !== 1 ? 's' : ''} · {day.words.toLocaleString()} words
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {formatCost(day.cost)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className={`${colorClasses[color]} mb-2`}>{icon}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Clock, FileText, DollarSign, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDuration, formatCost, formatDateTime } from '@/lib/utils/general'

interface Transcript {
  id: string
  title: string
  content: string
  audioUrl?: string
  duration: number
  wordCount: number
  provider: string
  model: string
  cost: number
  timestamps?: Array<{ time: number; word: string }>
  createdAt: string
  updatedAt: string
}

export default function TranscriptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [transcript, setTranscript] = useState<Transcript | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTranscript()
  }, [params.id])

  const fetchTranscript = async () => {
    try {
      const response = await fetch(`/api/transcripts/${params.id}`)
      if (!response.ok) {
        router.push('/transcripts')
        return
      }
      const data = await response.json()
      setTranscript(data)
    } catch (error) {
      console.error('Error fetching transcript:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this transcript?')) return

    try {
      await fetch(`/api/transcripts/${params.id}`, { method: 'DELETE' })
      router.push('/transcripts')
    } catch (error) {
      console.error('Error deleting transcript:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!transcript) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Transcript not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/transcripts">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Transcripts
            </Button>
          </Link>

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{transcript.title}</h1>
              <p className="text-sm text-muted-foreground">
                Created {formatDateTime(transcript.createdAt)}
                {transcript.updatedAt !== transcript.createdAt && (
                  <> · Updated {formatDateTime(transcript.updatedAt)}</>
                )}
              </p>
            </div>

            <div className="flex gap-2">
              <Link href={`/transcripts/${transcript.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            label="Duration"
            value={formatDuration(transcript.duration)}
          />
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            label="Words"
            value={transcript.wordCount.toLocaleString()}
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Cost"
            value={formatCost(transcript.cost)}
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Provider"
            value={`${transcript.provider} / ${transcript.model}`}
          />
        </div>

        {transcript.audioUrl && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <audio controls className="w-full" src={transcript.audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {transcript.content}
            </div>
          </CardContent>
        </Card>

        {transcript.timestamps && transcript.timestamps.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transcript.timestamps.map((timestamp, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <span className="font-mono text-muted-foreground shrink-0">
                      {formatDuration(timestamp.time)}
                    </span>
                    <span>{timestamp.word}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          {icon}
          <span className="text-sm">{label}</span>
        </div>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}

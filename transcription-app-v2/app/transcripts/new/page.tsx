'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateWordCount, calculateCost } from '@/lib/utils/transcript'

export default function NewTranscriptPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audioUrl: '',
    provider: 'openai',
    model: 'gpt-4',
    duration: 0,
  })

  const wordCount = calculateWordCount(formData.content)
  const estimatedCost = calculateCost(
    formData.provider,
    formData.model,
    formData.duration,
    wordCount
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/transcripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          wordCount,
          cost: estimatedCost,
        }),
      })

      if (!response.ok) throw new Error('Failed to create transcript')

      const data = await response.json()
      router.push(`/transcripts/${data.id}`)
    } catch (error) {
      console.error('Error creating transcript:', error)
      alert('Failed to create transcript')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/transcripts">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transcripts
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-6">New Transcript</h1>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter transcript title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Paste transcript content here..."
                  className="w-full min-h-[300px] px-3 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Audio URL (optional)</label>
                <Input
                  type="url"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Provider Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Provider</label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="google">Google</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <Input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="gpt-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
                <Input
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-primary">{wordCount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Words</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-primary">
                    {formData.duration > 0 ? `${Math.floor(formData.duration / 60)}m ${Math.floor(formData.duration % 60)}s` : '--'}
                  </div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-primary">${estimatedCost.toFixed(4)}</div>
                  <div className="text-sm text-muted-foreground">Est. Cost</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Transcript'}
            </Button>
            <Link href="/transcripts">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

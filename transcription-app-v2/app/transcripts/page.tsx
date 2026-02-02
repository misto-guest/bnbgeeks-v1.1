'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Clock, FileText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDuration, formatCost } from '@/lib/utils/transcript'
import { formatRelativeTime } from '@/lib/utils/general'

interface Transcript {
  id: string
  title: string
  content: string
  duration: number
  wordCount: number
  provider: string
  model: string
  cost: number
  createdAt: string
}

export default function TranscriptsPage() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    fetchTranscripts()
  }, [])

  const fetchTranscripts = async () => {
    try {
      const response = await fetch('/api/transcripts')
      if (!response.ok) {
        throw new Error('Failed to fetch transcripts')
      }
      const data = await response.json()
      setTranscripts(data.transcripts || [])
    } catch (error) {
      console.error('Error fetching transcripts:', error)
      setTranscripts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/transcripts/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Search failed')
      }
      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transcript?')) return

    try {
      await fetch(`/api/transcripts/${id}`, { method: 'DELETE' })
      setTranscripts(transcripts.filter(t => t.id !== id))
      setSearchResults(searchResults.filter(r => r.transcript.id !== id))
    } catch (error) {
      console.error('Error deleting transcript:', error)
    }
  }

  const displayTranscripts: Transcript[] = searchQuery.length >= 2
    ? searchResults.map((r: any) => r.transcript)
    : (transcripts || [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transcripts</h1>
            <p className="text-muted-foreground mt-1">
              {searchQuery.length >= 2
                ? `${searchResults.length} search results`
                : `${transcripts?.length || 0} transcripts`}
            </p>
          </div>
          <Link href="/transcripts/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Transcript
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="Search transcripts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : displayTranscripts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery.length >= 2 ? 'No results found' : 'No transcripts yet'}
          </div>
        ) : (
          <div className="grid gap-4">
            {displayTranscripts.map((transcript) => (
              <Card key={transcript.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        <Link
                          href={`/transcripts/${transcript.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {transcript.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(transcript.createdAt)}
                          </span>
                          <span>{formatDuration(transcript.duration)}</span>
                          <span>{transcript.wordCount} words</span>
                          <span>{transcript.provider} / {transcript.model}</span>
                          <span>{formatCost(transcript.cost)}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transcript.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {transcript.content.slice(0, 200)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

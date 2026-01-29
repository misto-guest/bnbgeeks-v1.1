/**
 * Calculate word count from text
 */
export function calculateWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Calculate transcription cost based on provider, model, and duration
 */
export function calculateCost(
  provider: string,
  model: string,
  duration: number,
  wordCount: number
): number {
  // Pricing per minute/word (in USD)
  const pricing: Record<string, { perMinute: number; perWord?: number }> = {
    'openai-gpt-4': { perMinute: 0.006, perWord: 0.00003 },
    'openai-whisper': { perMinute: 0.006 },
    'anthropic-claude-3': { perMinute: 0.003, perWord: 0.00002 },
    'google-chirp': { perMinute: 0.0024 },
  }

  const key = `${provider}-${model}`
  const price = pricing[key]

  if (!price) {
    // Default pricing
    return (duration / 60) * 0.006
  }

  let cost = (duration / 60) * price.perMinute

  if (price.perWord) {
    cost += wordCount * price.perWord
  }

  return Math.round(cost * 100000) / 100000 // Round to 5 decimal places
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

/**
 * Format cost in USD
 */
export function formatCost(cost: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(cost)
}

/**
 * Generate search vector for full-text search
 */
export function generateSearchVector(content: string): string {
  return content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(text: string, query: string): string {
  const terms = query.toLowerCase().split(/\s+/)
  let highlighted = text

  terms.forEach(term => {
    if (term.length < 2) return
    const regex = new RegExp(`(${term})`, 'gi')
    highlighted = highlighted.replace(regex, '<mark>$1</mark>')
  })

  return highlighted
}

/**
 * Calculate relevance score for search
 */
export function calculateRelevanceScore(
  content: string,
  query: string
): number {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1)
  const contentLower = content.toLowerCase()

  let score = 0
  queryTerms.forEach(term => {
    const count = (contentLower.match(new RegExp(term, 'g')) || []).length
    score += count * (term.length / query.length)
  })

  return score
}

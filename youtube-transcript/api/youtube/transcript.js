// Vercel serverless function for YouTube transcript extraction
const { YoutubeTranscript } = require('youtube-transcript');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, format = 'text', include_timestamp = true, include_metadata = false } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Extract video ID
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!videoIdMatch) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const videoId = videoIdMatch[1];

    console.log(`[INFO] Fetching transcript for video: ${videoId}`);

    // Fetch transcript using Node.js package with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout after 30s')), 30000)
    );

    const transcriptPromise = YoutubeTranscript.fetchTranscript(videoId);

    const transcript = await Promise.race([transcriptPromise, timeoutPromise]);

    if (!transcript || transcript.length === 0) {
      console.log(`[WARN] No transcript found for video: ${videoId}`);
      return res.status(404).json({ error: 'No transcript found for this video' });
    }

    console.log(`[INFO] Successfully fetched ${transcript.length} segments`);

    // Format response based on requested format
    let responseData;

    if (format === 'json') {
      responseData = {
        video_id: videoId,
        transcript: transcript.map(entry => ({
          text: entry.text,
          start: entry.start,
          duration: entry.duration,
          lang: entry.lang || 'en'
        }))
      };
    } else {
      // Plain text format
      if (include_timestamp) {
        responseData = {
          video_id: videoId,
          transcript: transcript.map(entry => {
            const minutes = Math.floor(entry.start / 60);
            const seconds = Math.floor(entry.start % 60);
            const timestamp = `[${minutes}:${seconds.toString().padStart(2, '0')}]`;
            return `${timestamp} ${entry.text}`;
          }).join('\n')
        };
      } else {
        responseData = {
          video_id: videoId,
          transcript: transcript.map(entry => entry.text).join(' ')
        };
      }
    }

    // Add metadata if requested
    if (include_metadata) {
      responseData.metadata = {
        video_id: videoId,
        segment_count: transcript.length,
        total_duration: transcript[transcript.length - 1].start + transcript[transcript.length - 1].duration,
        languages: [...new Set(transcript.map(t => t.lang || 'en'))],
        source: 'youtube-transcript-nodejs'
      };
    }

    // Return success response
    return res.status(200).json({
      success: true,
      data: responseData,
      source: 'youtube-transcript-nodejs',
      performance: {
        segments: transcript.length,
        package: 'youtube-transcript',
        version: '1.2.1'
      }
    });

  } catch (error) {
    console.error('[ERROR] YouTube transcript error:', error.message, error.stack);

    // Handle specific errors
    if (error.message.includes('TranscriptsDisabled')) {
      return res.status(400).json({
        error: 'Transcripts are disabled for this video',
        code: 'TRANSCRIPTS_DISABLED'
      });
    }

    if (error.message.includes('VideoUnavailable') || error.message.includes('Could not retrieve')) {
      return res.status(404).json({
        error: 'Video is unavailable or private',
        code: 'VIDEO_UNAVAILABLE'
      });
    }

    if (error.message.includes('TooManyRequests') || error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'Rate limit exceeded, please try again later',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }

    if (error.message.includes('timeout')) {
      return res.status(504).json({
        error: 'Request timeout - YouTube API took too long to respond',
        code: 'TIMEOUT'
      });
    }

    // Generic error with full details
    return res.status(500).json({
      error: 'Failed to extract transcript',
      message: error.message,
      code: 'EXTRACTION_FAILED',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

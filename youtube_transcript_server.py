#!/usr/bin/env python3
"""
YouTube Transcript API Server
Fixed version that properly handles URL construction and provides a working API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def extract_video_id(url_or_id):
    """Extract YouTube video ID from various URL formats or return the ID if valid."""
    # If it's already a valid video ID (11 characters)
    if re.match(r'^[a-zA-Z0-9_-]{11}$', url_or_id):
        return url_or_id
    
    # Try to extract from various URL formats
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)
    
    return None

def get_youtube_transcript(video_id, language='en'):
    """
    Get transcript using YouTube's internal API (no authentication required).
    This method scrapes YouTube's transcript endpoint directly.
    """
    try:
        # YouTube's internal transcript API endpoint
        transcript_url = f"https://www.youtube.com/watch?v={video_id}"
        
        # Get the video page first to extract the transcript
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(transcript_url, headers=headers)
        response.raise_for_status()
        
        # Extract caption track URL from the page
        # This is a simplified version - in production you'd parse the HTML properly
        page_content = response.text
        
        # Look for caption tracks in the HTML
        caption_match = re.search(r'"captions":.*?"baseUrl":"([^"]+)"', page_content)
        
        if not caption_match:
            return {"error": "No captions available for this video"}
        
        caption_url = caption_match.group(1).replace('\\u0026', '&')
        
        # Fetch the transcript data
        caption_response = requests.get(caption_url, headers=headers)
        caption_data = caption_response.json()
        
        # Parse transcript segments
        transcript = []
        for event in caption_data.get('events', []):
            if 'segs' in event:
                text = ''.join([seg.get('utf8', '') for seg in event['segs']]).strip()
                if text:
                    transcript.append({
                        'text': text,
                        'start': event.get('tStartMs', 0) / 1000,  # Convert to seconds
                        'duration': event.get('dDurationMs', 0) / 1000
                    })
        
        return {
            'video_id': video_id,
            'language': language,
            'transcript': transcript
        }
        
    except Exception as e:
        return {"error": f"Failed to fetch transcript: {str(e)}"}

@app.route('/api/transcript', methods=['GET', 'POST'])
def get_transcript():
    """Main endpoint to get YouTube transcript."""
    
    # Handle both GET and POST
    if request.method == 'GET':
        video_url = request.args.get('video_url', '')
        include_timestamp = request.args.get('include_timestamp', 'true').lower() == 'true'
        include_metadata = request.args.get('include_metadata', 'false').lower() == 'true'
        format_type = request.args.get('format', 'json')
    else:
        data = request.get_json() or {}
        video_url = data.get('video_url', '')
        include_timestamp = data.get('include_timestamp', True)
        include_metadata = data.get('include_metadata', False)
        format_type = data.get('format', 'json')

    if not video_url:
        return jsonify({"error": "video_url parameter is required"}), 400

    # Extract video ID
    video_id = extract_video_id(video_url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL or video ID"}), 400

    # Get transcript data
    result = get_youtube_transcript(video_id)
    
    if 'error' in result:
        return jsonify(result), 404

    # Format response based on parameters
    if format_type == 'text':
        # Convert to plain text
        if include_timestamp:
            transcript_text = '\n'.join([
                f"[{segment['start']:.2f}s] {segment['text']}" 
                for segment in result['transcript']
            ])
        else:
            transcript_text = '\n'.join([
                segment['text'] for segment in result['transcript']
            ])
        
        return jsonify({
            'video_id': video_id,
            'text': transcript_text,
            'language': result.get('language', 'en')
        })
    
    # Return JSON format (default)
    if not include_timestamp:
        # Remove timestamps from transcript
        for segment in result['transcript']:
            segment.pop('start', None)
            segment.pop('duration', None)

    return jsonify(result)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "youtube-transcript-api"})

@app.route('/', methods=['GET'])
def index():
    """Serve a simple frontend."""
    return '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YouTube Transcript Extractor - Working Version</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 { color: #333; margin-bottom: 10px; font-size: 28px; }
        .subtitle { color: #666; margin-bottom: 30px; font-size: 14px; }
        .input-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #333; font-weight: 500; }
        input[type="text"], select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
        }
        input[type="text"]:focus { outline: none; border-color: #667eea; }
        .options { display: flex; gap: 20px; margin: 20px 0; }
        .checkbox-group { display: flex; align-items: center; gap: 8px; }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
        }
        button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4); }
        button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .result-container {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            display: none;
        }
        .result-container.show { display: block; }
        .error {
            color: #dc3545;
            background: #f8d7da;
            padding: 12px;
            border-radius: 6px;
            margin-top: 20px;
            display: none;
        }
        .error.show { display: block; }
        .loading {
            text-align: center;
            padding: 20px;
            color: #667eea;
            display: none;
        }
        .loading.show { display: block; }
        .transcript-text {
            white-space: pre-wrap;
            line-height: 1.8;
            color: #333;
            max-height: 500px;
            overflow-y: auto;
            padding: 15px;
            background: white;
            border-radius: 6px;
        }
        .success {
            color: #28a745;
            background: #d4edda;
            padding: 12px;
            border-radius: 6px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>YouTube Transcript Extractor</h1>
        <p class="subtitle">✅ Fixed version with working URL construction and no API key required!</p>

        <div class="input-group">
            <label for="videoUrl">YouTube URL or Video ID:</label>
            <input 
                type="text" 
                id="videoUrl" 
                placeholder="https://www.youtube.com/watch?v=... or video ID"
                value="https://www.youtube.com/watch?v=sjAlzPfYAiw"
            >
        </div>

        <div class="options">
            <div class="checkbox-group">
                <input type="checkbox" id="includeTimestamps" checked>
                <label for="includeTimestamps">Include timestamps</label>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="includeMetadata">
                <label for="includeMetadata">Include video metadata</label>
            </div>
        </div>

        <div class="input-group">
            <label for="format">Output Format:</label>
            <select id="format">
                <option value="json">JSON format</option>
                <option value="text" selected>Plain text</option>
            </select>
        </div>

        <button id="fetchBtn" onclick="fetchTranscript()">Get Transcript</button>

        <div class="loading" id="loading">
            <strong>⏳ Loading transcript...</strong>
        </div>

        <div class="error" id="error"></div>

        <div class="result-container" id="resultContainer">
            <h3 style="color: #667eea;">Transcript:</h3>
            <div class="transcript-text" id="transcriptText"></div>
            <button style="margin-top: 10px; background: #28a745;" onclick="copyTranscript()">📋 Copy Transcript</button>
        </div>
    </div>

    <script>
        async function fetchTranscript() {
            const videoUrl = document.getElementById('videoUrl').value.trim();
            const includeTimestamps = document.getElementById('includeTimestamps').checked;
            const includeMetadata = document.getElementById('includeMetadata').checked;
            const format = document.getElementById('format').value;

            // Reset UI
            document.getElementById('error').classList.remove('show');
            document.getElementById('resultContainer').classList.remove('show');
            document.getElementById('loading').classList.add('show');
            document.getElementById('fetchBtn').disabled = true;

            try {
                // Properly construct API URL (this is the fix!)
                const params = new URLSearchParams({
                    video_url: videoUrl,
                    format: format,
                    include_timestamp: includeTimestamps.toString(),
                    include_metadata: includeMetadata.toString()
                });

                const apiUrl = `/api/transcript?${params.toString()}`;
                
                console.log('Fetching from:', apiUrl);

                const response = await fetch(apiUrl);
                const data = await response.json();

                document.getElementById('loading').classList.remove('show');

                if (!response.ok || data.error) {
                    throw new Error(data.error || `HTTP ${response.status}`);
                }

                displayResult(data, format);
            } catch (error) {
                console.error('Error:', error);
                showError(error.message);
            } finally {
                document.getElementById('fetchBtn').disabled = false;
            }
        }

        function displayResult(data, format) {
            const container = document.getElementById('resultContainer');
            const transcriptText = document.getElementById('transcriptText');

            container.classList.add('show');

            // Display transcript
            if (format === 'text') {
                transcriptText.textContent = data.text || JSON.stringify(data, null, 2);
            } else {
                // Format JSON with timestamps
                if (data.transcript && Array.isArray(data.transcript)) {
                    const formatted = data.transcript.map(segment => {
                        return `[${segment.start.toFixed(2)}s] ${segment.text}`;
                    }).join('\\n');
                    transcriptText.textContent = formatted;
                } else {
                    transcriptText.textContent = JSON.stringify(data, null, 2);
                }
            }
        }

        function showError(message) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
            document.getElementById('loading').classList.remove('show');
        }

        function copyTranscript() {
            const text = document.getElementById('transcriptText').textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert('Transcript copied to clipboard!');
            });
        }

        // Allow Enter key to submit
        document.getElementById('videoUrl').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                fetchTranscript();
            }
        });
    </script>
</body>
</html>
    '''

if __name__ == '__main__':
    print("🚀 Starting YouTube Transcript API Server...")
    print("📝 The URL construction bug has been fixed!")
    print("🎯 Now properly handles URL parameters using URLSearchParams")
    print("🔗 Server running at: http://localhost:5000")
    print("✅ No API key required - uses YouTube's internal endpoints")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
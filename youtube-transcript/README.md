# YouTube Transcript Extractor

A modern, fast web application for extracting transcripts from YouTube videos using the TranscriptAPI service.

## ✨ Features

- **Instant Transcript Extraction** - Get transcripts in seconds
- **Multiple Output Formats** - JSON or plain text
- **Timestamps** - Optional timestamp inclusion
- **Video Metadata** - Title, author, thumbnail
- **Search Functionality** - Search within transcripts
- **Copy & Download** - Easy export options
- **Rate Limiting** - Built-in rate limit handling
- **Error Handling** - Graceful error handling with retries
- **Responsive Design** - Works on desktop and mobile
- **Dark Theme** - Easy on the eyes

## 🚀 Quick Start

### Option 1: Static Hosting (Recommended)

1. **Upload to any static host:**
   - Netlify: Drag and drop the folder
   - Vercel: `vercel deploy`
   - GitHub Pages: Push to repo and enable Pages

2. **Or use a local server:**
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Node.js
   npx serve
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

### Option 2: Edit API Key

The app includes a pre-configured API key. To use your own:

1. Open `js/config.js`
2. Replace the API key:
   ```javascript
   API_KEY: 'your_api_key_here'
   ```

## 📁 Project Structure

```
youtube-transcript/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── config.js       # API configuration
│   ├── api.js          # API client
│   └── app.js          # App controller
└── README.md           # This file
```

## 🔧 Configuration

### API Settings (`js/config.js`)

```javascript
const CONFIG = {
    API_BASE_URL: 'https://transcriptapi.com',
    API_KEY: 'sk_w43cQAOjub9kDKrJeyr4HR5WTJRkhXEm1Av2vZvUasY',
    API_VERSION: 'v2',
    
    RATE_LIMIT: {
        REQUESTS_PER_MINUTE: 200,
        RETRY_DELAY: 1000,
        MAX_RETRIES: 3
    },
    
    CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
};
```

## 📖 Usage

### Basic Usage

1. **Enter YouTube URL** - Paste any YouTube video URL or video ID
2. **Choose Options:**
   - Include timestamps (default: yes)
   - Include video metadata (default: no)
   - Output format: JSON or plain text (default: text)
3. **Click "Get Transcript"** - Fetch the transcript
4. **Use Results:**
   - Copy to clipboard
   - Download as file
   - Search within transcript

### Supported Inputs

- Full YouTube URLs:
  - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
  - `https://youtu.be/dQw4w9WgXcQ`
  - `https://youtube.com/watch?v=dQw4w9WgXcQ&t=30s`
- Video IDs only:
  - `dQw4w9WgXcQ`

### Output Formats

#### JSON Format
```json
{
  "video_id": "dQw4w9WgXcQ",
  "language": "en",
  "transcript": [
    {
      "text": "Never gonna give you up",
      "start": 0.0,
      "duration": 4.12
    }
  ]
}
```

#### Text Format
```
[0.0s] Never gonna give you up
[4.12s] Never gonna let you down
```

## 🛡️ Error Handling

The app handles various error scenarios:

| Status | Handling |
|--------|----------|
| **401** | Shows invalid API key error |
| **402** | Shows insufficient credits with link to top up |
| **404** | Shows video not found or no transcript |
| **429** | Waits and retries using Retry-After header |
| **408/503** | Retries with exponential backoff (up to 3 times) |
| **500** | Shows server error message |

## 🚦 Rate Limiting

- **Limit**: 200 requests per minute per API key
- **Handling**: Automatic with exponential backoff
- **Display**: Shows remaining credits in header
- **Caching**: 5-minute cache to reduce API calls

## 🎨 Features in Detail

### Search Functionality
- Real-time search as you type
- Navigate between matches with Previous/Next buttons
- Shows match count (e.g., "3 of 10 matches")
- Highlights matches in context

### Video Metadata
When enabled, displays:
- Video thumbnail (320x180)
- Video title
- Channel/author name
- Link to watch on YouTube

### Export Options
- **Copy**: Copies transcript text to clipboard
- **Download**: Downloads as `.txt` or `.json` file
- Filename format: `{video_id}-transcript.{ext}`

## 🔒 Security

- **No backend required** - Runs entirely in the browser
- **API key in client** - For production, consider proxy requests through a backend
- **Input validation** - Validates YouTube URLs and IDs
- **XSS protection** - Escapes HTML in transcript output
- **HTTPS only** - API communication over secure connection

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 API Endpoints Used

The app uses these TranscriptAPI endpoints:

- **GET /api/v2/youtube/transcript** - Get video transcript (1 credit)
- Additional endpoints available for:
  - Channel search
  - Playlist videos
  - Video search

See [API Documentation](https://transcriptapi.com/docs/api/) for details.

## 🚀 Deployment

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### GitHub Pages
1. Push code to repository
2. Go to repository Settings → Pages
3. Select branch (usually `main` or `master`)
4. Site will be live at `https://username.github.io/repo-name`

### Traditional Hosting
Upload all files to any web server (Apache, Nginx, cPanel, etc.)

## 🛠️ Customization

### Changing Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --color-primary: #ff0000;
    --color-bg: #0f0f0f;
    --color-surface: #1f1f1f;
}
```

### Adding Features
The modular structure makes it easy to extend:
- `api.js` - Add new API methods
- `app.js` - Add new UI features
- `styles.css` - Add new styles

## 📝 TODO / Future Enhancements

- [ ] Add batch processing (multiple videos)
- [ ] Export to SRT format for subtitles
- [ ] Save transcripts to localStorage
- [ ] Share transcript links
- [ ] Export as PDF
- [ ] Language detection
- [ ] Multi-language support
- [ ] Timestamp click to seek (in embedded player)

## 🐛 Troubleshooting

### "Invalid API Key"
- Check `js/config.js` for correct API key
- Ensure key is active at https://transcriptapi.com

### "Insufficient Credits"
- Top up credits at https://transcriptapi.com/top-up

### "Video Not Found"
- Verify video URL is correct
- Check if video is publicly accessible
- Some videos may not have transcripts

### Rate Limit Issues
- Wait for rate limit to reset (shown in header)
- Upgrade plan for higher limits

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📞 Support

- **API Issues**: https://transcriptapi.com/docs/api/
- **Email**: hello@transcriptapi.com

---

**Built with ❤️ using TranscriptAPI.com**

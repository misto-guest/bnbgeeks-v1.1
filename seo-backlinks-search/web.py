#!/usr/bin/env python3
"""
Simple Web UI for SEO Backlinks Scraper
Flask-based interface for querying and viewing results
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import json
import glob
from datetime import datetime
from scraper import SEOScraper
from formatter import MarkdownFormatter

app = Flask(__name__)

# Configuration
RESULTS_DIR = 'results'
DATA_DIR = 'data'
LOGS_DIR = 'logs'

# Ensure directories exist
for dir_path in [RESULTS_DIR, DATA_DIR, LOGS_DIR]:
    os.makedirs(dir_path, exist_ok=True)


@app.route('/')
def index():
    """Main page"""
    return '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Backlinks Scraper</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 2rem;
        }
        .subtitle {
            color: #666;
            margin-bottom: 2rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #444;
        }
        input[type="text"], input[type="number"], select {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        #results {
            margin-top: 2rem;
            display: none;
        }
        .result-box {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1rem;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .stat {
            background: white;
            padding: 1rem;
            border-radius: 6px;
            text-align: center;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
        }
        .stat-label {
            font-size: 0.875rem;
            color: #666;
            margin-top: 0.25rem;
        }
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 0.875rem;
            max-height: 400px;
            overflow-y: auto;
        }
        .loading {
            display: none;
            text-align: center;
            padding: 2rem;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .history {
            margin-top: 2rem;
        }
        .history-item {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 0.5rem;
            cursor: pointer;
            transition: background 0.2s;
        }
        .history-item:hover {
            background: #e9ecef;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 SEO Backlinks Scraper</h1>
        <p class="subtitle">Find backlink opportunities with deduplication</p>
        
        <form id="scrapeForm">
            <div class="form-group">
                <label for="query">Search Query</label>
                <input type="text" id="query" placeholder="e.g., seo link building services" required>
            </div>
            
            <div class="form-group">
                <label for="pages">Pages to Scrape (1-10)</label>
                <input type="number" id="pages" min="1" max="10" value="1">
            </div>
            
            <div class="form-group">
                <label for="region">Region</label>
                <select id="region">
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="nl">Netherlands</option>
                </select>
            </div>
            
            <button type="submit" id="submitBtn">Start Scraping</button>
        </form>
        
        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p style="margin-top: 1rem;">Scraping in progress...</p>
        </div>
        
        <div id="results">
            <div class="result-box">
                <h2>Results</h2>
                <div class="stats" id="stats"></div>
                <pre id="markdown"></pre>
            </div>
        </div>
        
        <div class="history" id="history"></div>
    </div>

    <script>
        document.getElementById('scrapeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const query = document.getElementById('query').value;
            const pages = document.getElementById('pages').value;
            const region = document.getElementById('region').value;
            
            document.getElementById('submitBtn').disabled = true;
            document.getElementById('loading').style.display = 'block';
            document.getElementById('results').style.display = 'none';
            
            try {
                const response = await fetch('/api/scrape', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, pages: parseInt(pages), region })
                });
                
                const data = await response.json();
                
                if (data.error) {
                    alert('Error: ' + data.error);
                    return;
                }
                
                // Show stats
                const statsHtml = `
                    <div class="stat">
                        <div class="stat-value">${data.total_results}</div>
                        <div class="stat-label">Total Found</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${data.new_results} ✨</div>
                        <div class="stat-label">New Unique</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${data.pages_scraped}</div>
                        <div class="stat-label">Pages</div>
                    </div>
                `;
                document.getElementById('stats').innerHTML = statsHtml;
                
                // Show markdown
                document.getElementById('markdown').textContent = data.markdown;
                document.getElementById('results').style.display = 'block';
                
                // Reload history
                loadHistory();
                
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                document.getElementById('submitBtn').disabled = false;
                document.getElementById('loading').style.display = 'none';
            }
        });
        
        // Load history
        async function loadHistory() {
            const response = await fetch('/api/history');
            const files = await response.json();
            
            if (files.length === 0) {
                document.getElementById('history').innerHTML = '<p style="color: #666;">No previous scrapes</p>';
                return;
            }
            
            const html = files.map(file => `
                <div class="history-item" onclick="loadResult('${file.name}')">
                    <strong>${file.query}</strong><br>
                    <small>${file.date} - ${file.new_results} new links</small>
                </div>
            `).join('');
            
            document.getElementById('history').innerHTML = '<h3>Recent Scrapes</h3>' + html;
        }
        
        // Load specific result
        async function loadResult(filename) {
            const response = await fetch('/api/result/' + filename);
            const data = await response.json();
            
            document.getElementById('query').value = data.query;
            document.getElementById('pages').value = data.pages_requested;
            document.getElementById('region').value = data.region;
            
            const statsHtml = `
                <div class="stat">
                    <div class="stat-value">${data.total_results}</div>
                    <div class="stat-label">Total Found</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${data.new_results} ✨</div>
                    <div class="stat-label">New Unique</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${data.pages_scraped}</div>
                    <div class="stat-label">Pages</div>
                </div>
            `;
            document.getElementById('stats').innerHTML = statsHtml;
            
            const mdResponse = await fetch('/api/markdown/' + filename.replace('.json', '.md'));
            const markdown = await mdResponse.text();
            document.getElementById('markdown').textContent = markdown;
            document.getElementById('results').style.display = 'block';
        }
        
        // Load history on page load
        loadHistory();
    </script>
</body>
</html>
    '''


@app.route('/api/scrape', methods=['POST'])
def api_scrape():
    """API endpoint to trigger scraping"""
    try:
        data = request.json
        query = data.get('query')
        pages = data.get('pages', 1)
        region = data.get('region', 'us')
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Initialize scraper
        scraper = SEOScraper()
        
        # Scrape
        results = scraper.scrape(query, max_pages=pages, region=region)
        
        # Generate markdown
        markdown = MarkdownFormatter.format_results(results)
        
        # Save results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_query = "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in query)
        safe_query = safe_query.replace(' ', '_')[:50]
        base_filename = f"{safe_query}_{timestamp}"
        
        json_path = os.path.join(RESULTS_DIR, f"{base_filename}.json")
        with open(json_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        md_path = os.path.join(RESULTS_DIR, f"{base_filename}.md")
        with open(md_path, 'w') as f:
            f.write(markdown)
        
        # Return results
        return jsonify({
            'query': query,
            'total_results': results['total_results'],
            'new_results': results['new_results'],
            'pages_scraped': results['pages_scraped'],
            'pages_requested': results['pages_requested'],
            'region': region,
            'markdown': markdown,
            'filename': base_filename
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/history')
def api_history():
    """Get list of previous scrapes"""
    files = []
    
    for json_file in glob.glob(os.path.join(RESULTS_DIR, '*.json')):
        try:
            with open(json_file, 'r') as f:
                data = json.load(f)
                files.append({
                    'name': os.path.basename(json_file),
                    'query': data.get('query', 'Unknown'),
                    'date': data.get('scraped_at', ''),
                    'new_results': data.get('new_results', 0)
                })
        except:
            continue
    
    # Sort by date (newest first)
    files.sort(key=lambda x: x['date'], reverse=True)
    
    return jsonify(files[:20])  # Return last 20


@app.route('/api/result/<filename>')
def api_result(filename):
    """Get specific result"""
    try:
        path = os.path.join(RESULTS_DIR, filename)
        with open(path, 'r') as f:
            return jsonify(json.load(f))
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@app.route('/api/markdown/<filename>')
def api_markdown(filename):
    """Get markdown file"""
    try:
        path = os.path.join(RESULTS_DIR, filename)
        with open(path, 'r') as f:
            return f.read()
    except Exception as e:
        return str(e), 404


if __name__ == '__main__':
    print("🌐 Starting web server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)

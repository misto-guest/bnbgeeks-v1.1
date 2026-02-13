const fs = require('fs');

const data = JSON.parse(fs.readFileSync('results-final.json', 'utf8'));

// Escape JavaScript strings
function escapeJs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Backlinks Services - Search Results</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header {
            background: white;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .header h1 {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 15px;
        }
        .query-list {
            color: #718096;
            font-size: 0.95rem;
            margin-bottom: 20px;
        }
        .query-list span {
            display: inline-block;
            background: #f0f4ff;
            padding: 4px 12px;
            border-radius: 20px;
            margin: 4px;
            font-size: 0.85rem;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .stat-card {
            background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
        }
        .stat-card .number {
            font-size: 2.5rem;
            font-weight: 700;
            color: #667eea;
        }
        .stat-card .label {
            color: #718096;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 5px;
        }
        .controls {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        .search-box { flex: 1; min-width: 250px; }
        .search-box input {
            width: 100%;
            padding: 12px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1rem;
        }
        .search-box input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .view-toggle { display: flex; gap: 10px; }
        .toggle-btn {
            padding: 12px 24px;
            border: 2px solid #e2e8f0;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        .toggle-btn.active {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
        .results-grid { display: grid; gap: 20px; }
        .result-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            transition: all 0.3s;
        }
        .result-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .result-header {
            padding: 20px;
            cursor: pointer;
            display: flex;
            gap: 15px;
            align-items: start;
        }
        .position-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            flex-shrink: 0;
        }
        .result-content { flex: 1; min-width: 0; }
        .result-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 8px;
            line-height: 1.4;
        }
        .result-link {
            color: #667eea;
            font-size: 0.9rem;
            text-decoration: none;
            margin-bottom: 10px;
            display: block;
            word-break: break-all;
        }
        .result-link:hover { text-decoration: underline; }
        .result-snippet {
            color: #718096;
            font-size: 0.95rem;
            line-height: 1.6;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .result-details {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
            border-top: 1px solid #e2e8f0;
        }
        .result-card.expanded .result-details { max-height: 500px; }
        .details-content { padding: 20px; background: #f7fafc; }
        .detail-row { margin-bottom: 12px; display: flex; gap: 10px; }
        .detail-label { font-weight: 600; color: #4a5568; min-width: 80px; }
        .detail-value { color: #718096; flex: 1; }
        .expand-icon {
            margin-left: auto;
            transition: transform 0.3s;
            color: #a0aec0;
        }
        .result-card.expanded .expand-icon { transform: rotate(180deg); }
        .no-results {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 12px;
            color: #718096;
        }
        @media (max-width: 768px) {
            .header h1 { font-size: 1.8rem; }
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
            .controls { flex-direction: column; }
            .search-box, .view-toggle { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 SEO Backlinks Services</h1>
            <div class="query-list">
                <strong>Queries searched:</strong><br>
                ${data.queries.map(q => `<span>"${q}"</span>`).join('')}
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="number" id="totalCount">${data.totalResults}</div>
                    <div class="label">Total Results</div>
                </div>
                <div class="stat-card">
                    <div class="number" id="visibleCount">${data.totalResults}</div>
                    <div class="label">Visible</div>
                </div>
                <div class="stat-card">
                    <div class="number" id="queriesCount">${data.queries.length}</div>
                    <div class="label">Queries</div>
                </div>
            </div>
        </div>
        <div class="controls">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="🔎 Filter results by title, domain, or snippet...">
            </div>
            <div class="view-toggle">
                <button class="toggle-btn active" data-view="all">All (${data.totalResults})</button>
                <button class="toggle-btn" data-view="top25">Top 25</button>
                <button class="toggle-btn" data-view="top50">Top 50</button>
            </div>
        </div>
        <div class="results-grid" id="resultsGrid"></div>
    </div>
    <script>
        const data = ${JSON.stringify(data)};
        let currentView = 'all';
        let searchTerm = '';

        function updateStats(results) {
            document.getElementById('visibleCount').textContent = results.length;
        }

        function filterResults() {
            let results = [...data.results];
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                results = results.filter(r =>
                    r.title.toLowerCase().includes(term) ||
                    r.snippet.toLowerCase().includes(term) ||
                    r.domain.toLowerCase().includes(term)
                );
            }
            if (currentView === 'top25') results = results.slice(0, 25);
            else if (currentView === 'top50') results = results.slice(0, 50);
            return results;
        }

        function renderResults() {
            const results = filterResults();
            const grid = document.getElementById('resultsGrid');
            if (results.length === 0) {
                grid.innerHTML = '<div class="no-results"><h3>No results found</h3><p>Try adjusting your search or filters</p></div>';
                return;
            }
            grid.innerHTML = results.map(r => \`
                <div class="result-card" onclick="this.classList.toggle('expanded')">
                    <div class="result-header">
                        <div class="position-badge">\${r.position}</div>
                        <div class="result-content">
                            <div class="result-title">\${r.title}</div>
                            <a href="\${r.link}" target="_blank" class="result-link" onclick="event.stopPropagation()">🔗 \${r.domain}</a>
                            <div class="result-snippet">\${r.snippet}</div>
                        </div>
                        <div class="expand-icon">▼</div>
                    </div>
                    <div class="result-details">
                        <div class="details-content">
                            <div class="detail-row"><div class="detail-label">Position:</div><div class="detail-value">#\${r.position}</div></div>
                            <div class="detail-row"><div class="detail-label">Title:</div><div class="detail-value">\${r.title}</div></div>
                            <div class="detail-row"><div class="detail-label">Domain:</div><div class="detail-value">\${r.domain}</div></div>
                            <div class="detail-row"><div class="detail-label">URL:</div><div class="detail-value">\${r.link}</div></div>
                            <div class="detail-row"><div class="detail-label">Snippet:</div><div class="detail-value">\${r.snippet}</div></div>
                        </div>
                    </div>
                </div>
            \`).join('');
            updateStats(results);
        }

        document.getElementById('searchInput').addEventListener('input', e => { searchTerm = e.target.value; renderResults(); });
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentView = btn.dataset.view;
                renderResults();
            });
        });
        renderResults();
    </script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('✅ Generated index.html with all 80 results');
console.log('   File size: ' + (html.length / 1024).toFixed(2) + ' KB');

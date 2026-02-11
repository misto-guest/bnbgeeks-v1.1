'use client';

import { useState, useEffect } from 'react';

interface Portal {
  id: string;
  name: string;
  url: string;
  search_url: string;
  type: string;
  authority: string;
  active: boolean;
}

interface SearchResult {
  portal_id: string;
  portal_name: string;
  query: string;
  found: boolean;
  snippet?: string;
  result_url?: string;
  screenshot?: string;
  relevance_score: number;
  validated: boolean;
  searched_at: string;
}

export default function Home() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'portals' | 'results' | 'search'>('portals');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('mrkortingscode.nl');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadPortals();
    loadStats();
  }, []);

  const loadPortals = async () => {
    try {
      const res = await fetch('/api/portals');
      const data = await res.json();
      setPortals(data.portals);
    } catch (error) {
      console.error('Error loading portals:', error);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch('/api/results/stats');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadResults = async () => {
    try {
      const res = await fetch('/api/results/confirmed');
      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const runBatchSearch = async () => {
    setSearching(true);
    try {
      const res = await fetch('/api/search/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries: [searchQuery, 'kortingscode', 'mr kortingscode'],
          limit: 20
        })
      });
      const data = await res.json();
      alert(`Batch search started! Job ID: ${data.jobId}`);
    } catch (error) {
      console.error('Error starting batch search:', error);
      alert('Failed to start batch search');
    } finally {
      setSearching(false);
    }
  };

  const filteredPortals = selectedType === 'all'
    ? portals
    : portals.filter(p => p.type === selectedType);

  const confirmedResults = results.filter(r => r.validated && r.found);

  const getAuthorityColor = (authority: string) => {
    switch (authority) {
      case 'very-high': return 'bg-purple-100 text-purple-800';
      case 'high': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Brand Mention Generator
              </h1>
              <p className="text-gray-600 mt-1">
                mrkortingscode.nl - Dutch Portal Discovery Tool
              </p>
            </div>
            {stats && (
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total Searches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.validated}</div>
                  <div className="text-sm text-gray-500">Confirmed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.uniquePortals}</div>
                  <div className="text-sm text-gray-500">Portals</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('portals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'portals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Portals ({portals.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('results');
                loadResults();
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Results ({confirmedResults.length})
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Search
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'portals' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                {['all', 'news', 'library', 'government', 'education', 'archive', 'commerce'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm capitalize ${
                      selectedType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPortals.map(portal => (
                <div key={portal.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {portal.name}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getAuthorityColor(portal.authority)}`}>
                      {portal.authority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 capitalize">
                    Type: {portal.type}
                  </p>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Visit Portal →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Confirmed Mentions ({confirmedResults.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={loadResults}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Refresh
                </button>
                <a
                  href="/api/results/export"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export JSON
                </a>
              </div>
            </div>

            {confirmedResults.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">
                  No confirmed mentions yet. Run a search to find brand mentions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {confirmedResults.map((result, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {result.portal_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Query: "{result.query}"
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {result.relevance_score}/10
                        </div>
                        <div className="text-sm text-gray-500">Relevance</div>
                      </div>
                    </div>

                    {result.snippet && (
                      <div className="bg-gray-50 rounded p-4 mb-4">
                        <p className="text-sm text-gray-700">{result.snippet}</p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      {result.result_url && (
                        <a
                          href={result.result_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Result →
                        </a>
                      )}
                      {result.screenshot && (
                        <a
                          href={`/api/results/screenshot/${result.screenshot}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline text-sm"
                        >
                          View Screenshot →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Batch Search
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Query
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="mrkortingscode.nl"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>This will:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Search across all {portals.length} Dutch portals</li>
                    <li>• Test multiple query variations</li>
                    <li>• Take screenshots of results</li>
                    <li>• Validate and score findings</li>
                  </ul>
                  <p className="text-sm text-blue-800 mt-3">
                    <strong>⏱️ Estimated time:</strong> ~{portals.length * 5} seconds
                  </p>
                </div>

                <button
                  onClick={runBatchSearch}
                  disabled={searching || !searchQuery}
                  className={`w-full py-3 rounded-lg font-medium text-white ${
                    searching || !searchQuery
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {searching ? 'Searching...' : 'Start Batch Search'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

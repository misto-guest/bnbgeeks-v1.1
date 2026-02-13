'use client';

import { useState, useEffect } from 'react';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

interface QueryData {
  query: string;
  searchResults: SearchResult[];
  totalResults: number;
  method: string;
  analysis?: string;
}

interface DutchPortalsData {
  extractedAt: string;
  queries: QueryData[];
  summary: {
    totalQueries: number;
    totalResults: number;
    extractionMethod: string;
    extractedAt: string;
    note: string;
  };
}

export default function DutchPortalsPage() {
  const [data, setData] = useState<DutchPortalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/dutch-portals');
      const jsonData = await res.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error loading Dutch portals data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dutch portals data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load data. Please try again.</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentQuery = data.queries[selectedQuery];
  const filteredResults = currentQuery.searchResults.filter(result =>
    result.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    result.snippet.toLowerCase().includes(searchFilter.toLowerCase()) ||
    result.link.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dutch Portals Search Results
              </h1>
              <p className="text-gray-600 mt-1">
                Coinsnight.com Analysis - {data.summary.totalResults} total results
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.summary.totalQueries}</div>
                <div className="text-sm text-gray-500">Queries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.summary.totalResults}</div>
                <div className="text-sm text-gray-500">Results</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Query Selector */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold mb-4">Select Query</h2>
          <div className="flex flex-wrap gap-2">
            {data.queries.map((queryData, index) => (
              <button
                key={index}
                onClick={() => setSelectedQuery(index)}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  selectedQuery === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Query {index + 1}: {queryData.query.substring(0, 40)}...
              </button>
            ))}
          </div>
        </div>

        {/* Current Query Info */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold mb-2">Current Query</h2>
          <p className="text-gray-900 font-mono text-sm bg-gray-50 p-3 rounded">
            {currentQuery.query}
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Results Found</div>
              <div className="text-2xl font-bold text-blue-600">{currentQuery.totalResults}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Extraction Method</div>
              <div className="text-lg font-semibold text-gray-900">{currentQuery.method}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Extracted</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(data.extractedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          {currentQuery.analysis && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-semibold text-yellow-800 mb-2">Analysis</h3>
              <p className="text-sm text-yellow-700">{currentQuery.analysis}</p>
            </div>
          )}
        </div>

        {/* Search Filter */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Filter results by title, snippet, or URL..."
              />
            </div>
            <div className="px-4 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-800">
                Showing {filteredResults.length} of {currentQuery.totalResults} results
              </span>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {filteredResults.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500">No results match your filter.</p>
            </div>
          ) : (
            filteredResults.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {result.position}
                      </span>
                      <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                        <a
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {result.title}
                        </a>
                      </h3>
                    </div>
                    <p className="text-sm text-green-700 mb-2 truncate">{result.link}</p>
                    <p className="text-gray-700">{result.snippet}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Export Options */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Export Options</h2>
          <div className="flex gap-4">
            <a
              href="/api/dutch-portals"
              download="dutch-portals-search-results.json"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download JSON
            </a>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(data, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'dutch-portals-search-results.json';
                a.click();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Export All Results
            </button>
          </div>
        </div>

        {/* Summary Note */}
        {data.summary.note && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> {data.summary.note}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

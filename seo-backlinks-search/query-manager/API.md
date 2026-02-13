# 📡 SEO Query Manager - API Documentation

Complete API reference for the SEO Query Manager REST API.

## Base URL

```
http://localhost:5001
```

## Authentication

All API endpoints require authentication using an API key.

### Methods

**Header (Recommended)**
```http
X-API-Key: seo-query-manager-key
```

**Query Parameter**
```http
?api_key=seo-query-manager-key
```

### Example

```bash
curl http://localhost:5001/api/status \
  -H "X-API-Key: seo-query-manager-key"
```

---

## Endpoints

### Queries

#### List All Queries

Get a list of all queries in the system.

```http
GET /api/queries
```

**Query Parameters:**
- `active` (boolean, optional): Filter active queries only (default: true)

**Response:**
```json
{
  "queries": [
    {
      "id": 1,
      "query": "seo link building services",
      "schedule": "weekly",
      "region": "us",
      "max_pages": 2,
      "active": 1,
      "created_at": "2025-01-12 10:30:00",
      "updated_at": "2025-01-12 10:30:00"
    }
  ]
}
```

---

#### Add New Query

Create a new query with scheduling.

```http
POST /api/queries
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "seo link building services",
  "schedule": "weekly",
  "region": "us",
  "max_pages": 2
}
```

**Parameters:**
- `query` (string, required): The search query
- `schedule` (string, required): One of `daily`, `weekly`, `monthly`
- `region` (string, optional): Region code (default: `us`)
- `max_pages` (integer, optional): Pages to scrape (1-10, default: 2)

**Response:**
```json
{
  "message": "Query added successfully",
  "query_id": 1
}
```

---

#### Get Specific Query

Retrieve details of a specific query.

```http
GET /api/queries/{query_id}
```

**Response:**
```json
{
  "id": 1,
  "query": "seo link building services",
  "schedule": "weekly",
  "region": "us",
  "max_pages": 2,
  "active": 1,
  "created_at": "2025-01-12 10:30:00",
  "updated_at": "2025-01-12 10:30:00"
}
```

---

#### Update Query

Update an existing query.

```http
PUT /api/queries/{query_id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "schedule": "daily",
  "max_pages": 3,
  "region": "uk"
}
```

**Parameters:**
- `query` (string, optional): New search query
- `schedule` (string, optional): One of `daily`, `weekly`, `monthly`
- `region` (string, optional): New region code
- `max_pages` (integer, optional): New page limit

**Response:**
```json
{
  "message": "Query updated successfully"
}
```

---

#### Delete Query

Soft delete a query (sets active to false).

```http
DELETE /api/queries/{query_id}
```

**Response:**
```json
{
  "message": "Query deleted successfully"
}
```

---

### Results

#### Get Latest Results

Get the most recent scraping results for a query.

```http
GET /api/results/{query_id}
```

**Response:**
```json
{
  "id": 1,
  "query_id": 1,
  "query": "seo link building services",
  "scraped_at": "2025-01-12T10:30:00",
  "region": "us",
  "pages_requested": 2,
  "pages_scraped": 2,
  "total_results": 20,
  "new_results": 15,
  "duplicate_results": 5,
  "results": [
    {
      "position": 1,
      "title": "Example Title",
      "link": "https://example.com",
      "snippet": "Example snippet...",
      "domain": "example.com",
      "scraped_at": "2025-01-12T10:30:00"
    }
  ]
}
```

---

#### Get All Historical Results

Get all historical results for a query.

```http
GET /api/results/{query_id}/all
```

**Query Parameters:**
- `limit` (integer, optional): Maximum results to return (default: 100)

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "query_id": 1,
      "scraped_at": "2025-01-12T10:30:00",
      "total_results": 20,
      "new_results": 15,
      "results": [...]
    },
    {
      "id": 2,
      "query_id": 1,
      "scraped_at": "2025-01-11T10:30:00",
      "total_results": 18,
      "new_results": 12,
      "results": [...]
    }
  ]
}
```

---

#### Run Manual Scrape

Manually trigger a scraping operation for a query.

```http
POST /api/results/{query_id}/run
```

**Response:**
```json
{
  "message": "Scrape completed successfully",
  "result_id": 42,
  "new_results": 15
}
```

---

#### Export Results

Export results as JSON or CSV file.

```http
GET /api/export/{query_id}?format=json
GET /api/export/{query_id}?format=csv
```

**Query Parameters:**
- `format` (string, required): Either `json` or `csv`

**Response (JSON):**
```json
[
  {
    "id": 1,
    "query": "seo link building services",
    "scraped_at": "2025-01-12T10:30:00",
    "total_results": 20,
    "new_results": 15,
    "results": [...]
  }
]
```

**Response (CSV):**
```csv
Date,Query,Region,Total Results,New Results,Title,URL,Snippet,Position
2025-01-12T10:30:00,seo link building services,us,20,15,Example,https://example.com,...
```

---

### System

#### Get System Status

Get current system status and statistics.

```http
GET /api/status
```

**Response:**
```json
{
  "status": "healthy",
  "active_queries": 5,
  "total_results": 1234,
  "total_new_results": 567,
  "timestamp": "2025-01-12T10:30:00"
}
```

---

#### Get Activity Logs

Get recent activity logs.

```http
GET /api/logs
```

**Query Parameters:**
- `limit` (integer, optional): Maximum logs to return (default: 50)

**Response:**
```json
{
  "logs": [
    {
      "id": 1,
      "query_id": 1,
      "query": "seo link building services",
      "run_type": "weekly_scrape",
      "status": "completed",
      "started_at": "2025-01-12T10:30:00",
      "completed_at": "2025-01-12T10:32:00",
      "duration_seconds": 120.5,
      "message": "Scraped 15 new results",
      "error": null
    }
  ]
}
```

---

## Error Responses

### 401 Unauthorized

Invalid or missing API key.

```json
{
  "error": "Invalid or missing API key"
}
```

### 404 Not Found

Resource not found.

```json
{
  "error": "Query not found"
}
```

### 400 Bad Request

Invalid request parameters.

```json
{
  "error": "Invalid schedule. Must be daily, weekly, or monthly"
}
```

### 500 Internal Server Error

Server error.

```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently, there are no rate limits. However, for production use, consider:

- Implementing rate limiting based on API key
- Adding request queuing for bulk operations
- Caching frequently accessed data

---

## SDK Examples

### Python

```python
import requests

class SEOQueryManager:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.headers = {'X-API-Key': api_key}
    
    def add_query(self, query, schedule='weekly'):
        data = {'query': query, 'schedule': schedule}
        response = requests.post(
            f'{self.base_url}/api/queries',
            json=data,
            headers=self.headers
        )
        return response.json()
    
    def get_results(self, query_id):
        response = requests.get(
            f'{self.base_url}/api/results/{query_id}',
            headers=self.headers
        )
        return response.json()
    
    def run_scrape(self, query_id):
        response = requests.post(
            f'{self.base_url}/api/results/{query_id}/run',
            headers=self.headers
        )
        return response.json()

# Usage
client = SEOQueryManager(
    'http://localhost:5001',
    'seo-query-manager-key'
)

# Add a query
result = client.add_query('seo link building services', 'weekly')
print(f"Query ID: {result['query_id']}")

# Run a scrape
results = client.run_scrape(1)
print(f"New results: {results['new_results']}")
```

### JavaScript (Node.js)

```javascript
class SEOQueryManager {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.headers = { 'X-API-Key': apiKey };
    }

    async addQuery(query, schedule = 'weekly') {
        const response = await fetch(`${this.baseUrl}/api/queries`, {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, schedule })
        });
        return response.json();
    }

    async getResults(queryId) {
        const response = await fetch(
            `${this.baseUrl}/api/results/${queryId}`,
            { headers: this.headers }
        );
        return response.json();
    }

    async runScrape(queryId) {
        const response = await fetch(
            `${this.baseUrl}/api/results/${queryId}/run`,
            {
                method: 'POST',
                headers: this.headers
            }
        );
        return response.json();
    }
}

// Usage
const client = new SEOQueryManager(
    'http://localhost:5001',
    'seo-query-manager-key'
);

// Add a query
const result = await client.addQuery('seo link building services', 'weekly');
console.log(`Query ID: ${result.query_id}`);

// Run a scrape
const results = await client.runScrape(1);
console.log(`New results: ${results.new_results}`);
```

---

## Changelog

### Version 1.0.0 (2025-01-12)
- Initial release
- Query management endpoints
- Results retrieval and export
- Activity logging
- System status endpoint

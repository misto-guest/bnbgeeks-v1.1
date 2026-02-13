#!/usr/bin/env python3
"""
SEO Query Manager - Flask Web Application
Main application with REST API and web interface
"""

import os
import sys
import json
import csv
import io
from datetime import datetime
from functools import wraps
from typing import Optional

from flask import Flask, render_template, request, jsonify, send_file, Response
from flask_cors import CORS

# Import local modules (now self-contained for cloud deployment)
from models import Database, QueryManager, ResultManager, LogManager, APIKeyManager
from scraper import SEOScraper

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
app.config['API_KEY'] = os.getenv('API_KEY', 'seo-query-manager-key')

# Initialize database
db = Database()
query_manager = QueryManager(db)
result_manager = ResultManager(db)
log_manager = LogManager(db)
api_key_manager = APIKeyManager(db)

# Add default API key if none exists
if not api_key_manager.list_keys():
    api_key_manager.add_key('default', app.config['API_KEY'])


def require_api_key(f):
    """Decorator to require API key authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key:
            api_key = request.args.get('api_key')
        
        if not api_key or not api_key_manager.validate_key(api_key):
            return jsonify({'error': 'Invalid or missing API key'}), 401
        
        return f(*args, **kwargs)
    return decorated_function


# ==================== Web Interface Routes ====================

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')

@app.route('/queries')
def queries_page():
    """Query management page"""
    return render_template('queries.html')

@app.route('/results')
def results_page():
    """Results viewer page"""
    return render_template('results.html')

@app.route('/logs')
def logs_page():
    """Logs viewer page"""
    return render_template('logs.html')

@app.route('/settings')
def settings_page():
    """Settings page"""
    return render_template('settings.html')


# ==================== API Routes - Queries ====================

@app.route('/api/queries', methods=['GET'])
@require_api_key
def get_queries():
    """Get all queries"""
    active_only = request.args.get('active', 'true').lower() == 'true'
    queries = query_manager.list_queries(active_only=active_only)
    return jsonify({'queries': queries})


@app.route('/api/queries', methods=['POST'])
@require_api_key
def add_query():
    """Add a new query"""
    data = request.json
    
    query = data.get('query')
    schedule = data.get('schedule', 'weekly')
    region = data.get('region', 'us')
    max_pages = data.get('max_pages', 2)
    
    if not query:
        return jsonify({'error': 'Query is required'}), 400
    
    if schedule not in ['daily', 'weekly', 'monthly']:
        return jsonify({'error': 'Invalid schedule. Must be daily, weekly, or monthly'}), 400
    
    query_id = query_manager.add_query(query, schedule, region, max_pages)
    
    # Log the action
    log_id = log_manager.log_start(None, 'add_query')
    log_manager.log_complete(log_id, f'Added query: {query}')
    
    return jsonify({
        'message': 'Query added successfully',
        'query_id': query_id
    }), 201


@app.route('/api/queries/<int:query_id>', methods=['GET'])
@require_api_key
def get_query(query_id: int):
    """Get a specific query"""
    query = query_manager.get_query(query_id)
    if not query:
        return jsonify({'error': 'Query not found'}), 404
    return jsonify(query)


@app.route('/api/queries/<int:query_id>', methods=['PUT'])
@require_api_key
def update_query(query_id: int):
    """Update a query"""
    data = request.json
    
    if query_manager.update_query(query_id, **data):
        return jsonify({'message': 'Query updated successfully'})
    
    return jsonify({'error': 'Query not found or no valid fields to update'}), 404


@app.route('/api/queries/<int:query_id>', methods=['DELETE'])
@require_api_key
def delete_query(query_id: int):
    """Delete a query (soft delete)"""
    if query_manager.delete_query(query_id):
        return jsonify({'message': 'Query deleted successfully'})
    
    return jsonify({'error': 'Query not found'}), 404


# ==================== API Routes - Results ====================

@app.route('/api/results/<int:query_id>', methods=['GET'])
@require_api_key
def get_latest_results(query_id: int):
    """Get the latest results for a query"""
    result = result_manager.get_latest_result(query_id)
    
    if not result:
        return jsonify({'error': 'No results found for this query'}), 404
    
    return jsonify(result)


@app.route('/api/results/<int:query_id>/all', methods=['GET'])
@require_api_key
def get_all_results(query_id: int):
    """Get all historical results for a query"""
    limit = request.args.get('limit', 100, type=int)
    results = result_manager.get_all_results(query_id, limit=limit)
    
    return jsonify({'results': results})


@app.route('/api/results/<int:query_id>/run', methods=['POST'])
@require_api_key
def run_scrape(query_id: int):
    """Manually trigger a scrape for a query"""
    query = query_manager.get_query(query_id)
    
    if not query:
        return jsonify({'error': 'Query not found'}), 404
    
    # Log start
    log_id = log_manager.log_start(query_id, 'manual_scrape')
    
    try:
        # Initialize scraper
        scraper = SEOScraper()
        
        # Scrape
        scrape_data = scraper.scrape(
            query['query'],
            max_pages=query['max_pages'],
            region=query['region']
        )
        
        # Save results
        result_id = result_manager.add_result(query_id, scrape_data)
        
        # Log completion
        log_manager.log_complete(
            log_id,
            f"Scraped {scrape_data['new_results']} new results"
        )
        
        return jsonify({
            'message': 'Scrape completed successfully',
            'result_id': result_id,
            'new_results': scrape_data['new_results']
        })
        
    except Exception as e:
        log_manager.log_error(log_id, str(e))
        return jsonify({'error': str(e)}), 500


# ==================== API Routes - Export ====================

@app.route('/api/export/<int:query_id>', methods=['GET'])
@require_api_key
def export_results(query_id: int):
    """Export results as JSON or CSV"""
    format_type = request.args.get('format', 'json').lower()
    
    if format_type not in ['json', 'csv']:
        return jsonify({'error': 'Invalid format. Use json or csv'}), 400
    
    results = result_manager.get_all_results(query_id, limit=1000)
    
    if not results:
        return jsonify({'error': 'No results found for this query'}), 404
    
    query = query_manager.get_query(query_id)
    query_name = query['query'].replace(' ', '_')[:50] if query else 'query'
    
    if format_type == 'json':
        # Export as JSON
        output = io.StringIO()
        json.dump(results, output, indent=2)
        
        return Response(
            output.getvalue(),
            mimetype='application/json',
            headers={
                'Content-Disposition': f'attachment; filename={query_name}_results.json'
            }
        )
    
    elif format_type == 'csv':
        # Export as CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Date', 'Query', 'Region', 'Total Results', 'New Results',
            'Title', 'URL', 'Snippet', 'Position'
        ])
        
        # Write data
        for result in results:
            for item in result.get('results', []):
                writer.writerow([
                    result.get('scraped_at', ''),
                    result.get('query', ''),
                    result.get('region', ''),
                    result.get('total_results', 0),
                    result.get('new_results', 0),
                    item.get('title', ''),
                    item.get('link', ''),
                    item.get('snippet', ''),
                    item.get('position', 0)
                ])
        
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={
                'Content-Disposition': f'attachment; filename={query_name}_results.csv'
            }
        )


# ==================== API Routes - Logs ====================

@app.route('/api/logs', methods=['GET'])
@require_api_key
def get_logs():
    """Get recent logs"""
    limit = request.args.get('limit', 50, type=int)
    logs = log_manager.get_recent_logs(limit=limit)
    return jsonify({'logs': logs})


# ==================== API Routes - Status ====================

@app.route('/api/status', methods=['GET'])
@require_api_key
def get_status():
    """Get system status"""
    queries = query_manager.list_queries(active_only=True)
    total_results = 0
    total_new = 0
    
    for query in queries:
        latest = result_manager.get_latest_result(query['id'])
        if latest:
            total_results += latest.get('total_results', 0)
            total_new += latest.get('new_results', 0)
    
    return jsonify({
        'status': 'healthy',
        'active_queries': len(queries),
        'total_results': total_results,
        'total_new_results': total_new,
        'timestamp': datetime.now().isoformat()
    })


# ==================== Error Handlers ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    print("🚀 Starting SEO Query Manager...")
    print(f"📊 Dashboard: http://localhost:5001")
    print(f"🔑 API Key: {app.config['API_KEY']}")
    print("")
    
    app.run(debug=True, host='0.0.0.0', port=5001)

#!/usr/bin/env python3
"""
Database Models for SEO Query Manager
SQLite database schema for queries, results, and logs
"""

import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Optional
import json


class Database:
    """Database connection and schema management"""
    
    def __init__(self, db_path: str = "query_manager.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.init_db()
    
    def init_db(self):
        """Initialize database tables"""
        cursor = self.conn.cursor()
        
        # Queries table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS queries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query TEXT NOT NULL,
                schedule TEXT NOT NULL DEFAULT 'weekly',
                region TEXT DEFAULT 'us',
                max_pages INTEGER DEFAULT 2,
                active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Results table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query_id INTEGER NOT NULL,
                query TEXT NOT NULL,
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                region TEXT,
                pages_requested INTEGER,
                pages_scraped INTEGER,
                total_results INTEGER,
                new_results INTEGER,
                duplicate_results INTEGER,
                results_json TEXT,
                FOREIGN KEY (query_id) REFERENCES queries(id)
            )
        ''')
        
        # Run logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS run_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query_id INTEGER,
                run_type TEXT NOT NULL,
                status TEXT NOT NULL,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                duration_seconds REAL,
                message TEXT,
                error TEXT,
                FOREIGN KEY (query_id) REFERENCES queries(id)
            )
        ''')
        
        # API keys table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS api_keys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key_name TEXT NOT NULL UNIQUE,
                api_key TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_used TIMESTAMP,
                active BOOLEAN DEFAULT 1
            )
        ''')
        
        self.conn.commit()
    
    def close(self):
        """Close database connection"""
        self.conn.close()


class QueryManager:
    """Manager for query CRUD operations"""
    
    def __init__(self, db: Database):
        self.db = db
    
    def add_query(self, query: str, schedule: str = 'weekly', 
                  region: str = 'us', max_pages: int = 2) -> int:
        """Add a new query"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            INSERT INTO queries (query, schedule, region, max_pages)
            VALUES (?, ?, ?, ?)
        ''', (query, schedule, region, max_pages))
        self.db.conn.commit()
        return cursor.lastrowid
    
    def get_query(self, query_id: int) -> Optional[Dict]:
        """Get a query by ID"""
        cursor = self.db.conn.cursor()
        cursor.execute('SELECT * FROM queries WHERE id = ?', (query_id,))
        row = cursor.fetchone()
        if row:
            return dict(row)
        return None
    
    def list_queries(self, active_only: bool = True) -> List[Dict]:
        """List all queries"""
        cursor = self.db.conn.cursor()
        if active_only:
            cursor.execute('SELECT * FROM queries WHERE active = 1 ORDER BY created_at DESC')
        else:
            cursor.execute('SELECT * FROM queries ORDER BY created_at DESC')
        return [dict(row) for row in cursor.fetchall()]
    
    def update_query(self, query_id: int, **kwargs) -> bool:
        """Update a query"""
        allowed = ['query', 'schedule', 'region', 'max_pages', 'active']
        updates = {k: v for k, v in kwargs.items() if k in allowed}
        
        if not updates:
            return False
        
        updates['updated_at'] = datetime.now().isoformat()
        
        query = ', '.join(f'{k} = ?' for k in updates.keys())
        values = list(updates.values()) + [query_id]
        
        cursor = self.db.conn.cursor()
        cursor.execute(f'UPDATE queries SET {query} WHERE id = ?', values)
        self.db.conn.commit()
        return cursor.rowcount > 0
    
    def delete_query(self, query_id: int) -> bool:
        """Soft delete a query (set active = 0)"""
        cursor = self.db.conn.cursor()
        cursor.execute('UPDATE queries SET active = 0 WHERE id = ?', (query_id,))
        self.db.conn.commit()
        return cursor.rowcount > 0
    
    def get_scheduled_queries(self, schedule: str) -> List[Dict]:
        """Get all queries with a specific schedule"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            SELECT * FROM queries 
            WHERE schedule = ? AND active = 1
            ORDER BY created_at DESC
        ''', (schedule,))
        return [dict(row) for row in cursor.fetchall()]


class ResultManager:
    """Manager for scraping results"""
    
    def __init__(self, db: Database):
        self.db = db
    
    def add_result(self, query_id: int, scrape_data: Dict) -> int:
        """Add a scraping result"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            INSERT INTO results (
                query_id, query, scraped_at, region, pages_requested,
                pages_scraped, total_results, new_results, duplicate_results, results_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            query_id,
            scrape_data.get('query'),
            scrape_data.get('scraped_at'),
            scrape_data.get('region'),
            scrape_data.get('pages_requested'),
            scrape_data.get('pages_scraped'),
            scrape_data.get('total_results'),
            scrape_data.get('new_results'),
            scrape_data.get('duplicate_results'),
            json.dumps(scrape_data.get('results', []))
        ))
        self.db.conn.commit()
        return cursor.lastrowid
    
    def get_latest_result(self, query_id: int) -> Optional[Dict]:
        """Get the latest result for a query"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            SELECT * FROM results 
            WHERE query_id = ? 
            ORDER BY scraped_at DESC 
            LIMIT 1
        ''', (query_id,))
        row = cursor.fetchone()
        if row:
            result = dict(row)
            result['results'] = json.loads(result['results_json'])
            return result
        return None
    
    def get_all_results(self, query_id: int, limit: int = 100) -> List[Dict]:
        """Get all historical results for a query"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            SELECT * FROM results 
            WHERE query_id = ? 
            ORDER BY scraped_at DESC 
            LIMIT ?
        ''', (query_id, limit))
        results = []
        for row in cursor.fetchall():
            result = dict(row)
            result['results'] = json.loads(result['results_json'])
            results.append(result)
        return results
    
    def get_result(self, result_id: int) -> Optional[Dict]:
        """Get a specific result by ID"""
        cursor = self.db.conn.cursor()
        cursor.execute('SELECT * FROM results WHERE id = ?', (result_id,))
        row = cursor.fetchone()
        if row:
            result = dict(row)
            result['results'] = json.loads(result['results_json'])
            return result
        return None


class LogManager:
    """Manager for run logs"""
    
    def __init__(self, db: Database):
        self.db = db
    
    def log_start(self, query_id: Optional[int], run_type: str) -> int:
        """Log the start of a run"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            INSERT INTO run_logs (query_id, run_type, status, started_at)
            VALUES (?, ?, 'running', CURRENT_TIMESTAMP)
        ''', (query_id, run_type))
        self.db.conn.commit()
        return cursor.lastrowid
    
    def log_complete(self, log_id: int, message: str = None):
        """Log successful completion"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            UPDATE run_logs 
            SET status = 'completed', 
                completed_at = CURRENT_TIMESTAMP,
                duration_seconds = CAST((julianday(CURRENT_TIMESTAMP) - julianday(started_at)) * 86400 AS REAL),
                message = ?
            WHERE id = ?
        ''', (message, log_id))
        self.db.conn.commit()
    
    def log_error(self, log_id: int, error: str):
        """Log an error"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            UPDATE run_logs 
            SET status = 'error',
                completed_at = CURRENT_TIMESTAMP,
                duration_seconds = CAST((julianday(CURRENT_TIMESTAMP) - julianday(started_at)) * 86400 AS REAL),
                error = ?
            WHERE id = ?
        ''', (error, log_id))
        self.db.conn.commit()
    
    def get_recent_logs(self, limit: int = 50) -> List[Dict]:
        """Get recent logs"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            SELECT l.*, q.query 
            FROM run_logs l
            LEFT JOIN queries q ON l.query_id = q.id
            ORDER BY l.started_at DESC 
            LIMIT ?
        ''', (limit,))
        return [dict(row) for row in cursor.fetchall()]


class APIKeyManager:
    """Manager for API keys"""
    
    def __init__(self, db: Database):
        self.db = db
    
    def add_key(self, key_name: str, api_key: str) -> int:
        """Add an API key"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            INSERT INTO api_keys (key_name, api_key)
            VALUES (?, ?)
        ''', (key_name, api_key))
        self.db.conn.commit()
        return cursor.lastrowid
    
    def validate_key(self, api_key: str) -> bool:
        """Validate an API key"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            SELECT id FROM api_keys 
            WHERE api_key = ? AND active = 1
        ''', (api_key,))
        return cursor.fetchone() is not None
    
    def list_keys(self) -> List[Dict]:
        """List all API keys (without showing the actual keys)"""
        cursor = self.db.conn.cursor()
        cursor.execute('''
            SELECT id, key_name, created_at, last_used, active 
            FROM api_keys 
            ORDER BY created_at DESC
        ''')
        return [dict(row) for row in cursor.fetchall()]
    
    def deactivate_key(self, key_id: int) -> bool:
        """Deactivate an API key"""
        cursor = self.db.conn.cursor()
        cursor.execute('UPDATE api_keys SET active = 0 WHERE id = ?', (key_id,))
        self.db.conn.commit()
        return cursor.rowcount > 0

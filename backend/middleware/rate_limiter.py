"""
PhishGuard - Rate Limiter Middleware
Simple in-memory rate limiting for API endpoints.
For production with multiple workers, Redis is recommended.
"""

from functools import wraps
from flask import request, jsonify
from datetime import datetime, timedelta
import time
from utils.logger import logger

# In-memory store: { ip_address: [(timestamp1), (timestamp2), ...] }
_request_records = {}

def rate_limit(limit=100, period=3600):
    """
    Rate limit decorator.
    
    Args:
        limit (int): Maximum number of requests allowed within the period.
        period (int): Time period in seconds (e.g., 3600 for 1 hour).
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            ip_address = request.remote_addr
            now = time.time()
            
            # Initialize record for IP if not exists
            if ip_address not in _request_records:
                _request_records[ip_address] = []
                
            # Filter out requests older than the period
            _request_records[ip_address] = [
                req_time for req_time in _request_records[ip_address] 
                if now - req_time < period
            ]
            
            # Check limit
            if len(_request_records[ip_address]) >= limit:
                logger.warning(f"Rate limit exceeded for IP: {ip_address}")
                return jsonify({
                    "error": "Rate limit exceeded. Please try again later.",
                    "limit": limit,
                    "period": period
                }), 429
                
            # Add current request
            _request_records[ip_address].append(now)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

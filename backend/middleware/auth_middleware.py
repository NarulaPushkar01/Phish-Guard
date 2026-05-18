"""
PhishGuard - Auth Middleware
Middleware for handling JWT authentication.
"""

from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from utils.logger import logger


def require_auth(f):
    """
    Decorator to require JWT authentication for a route.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Verify JWT in the request headers
            verify_jwt_in_request()
            
            # Get the user ID from the token
            current_user_id = get_jwt_identity()
            
            # Add user_id to kwargs to pass it to the route handler
            kwargs['user_id'] = current_user_id
            
            return f(*args, **kwargs)
            
        except Exception as e:
            logger.warning(f"Unauthorized access attempt: {str(e)}")
            return jsonify({"error": "Unauthorized access or invalid token"}), 401

    return decorated_function

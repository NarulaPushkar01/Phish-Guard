"""
PhishGuard - Auth Routes
API endpoints for authentication.
"""

from flask import Blueprint, request
from controllers.auth_controller import AuthController
from middleware.auth_middleware import require_auth
from middleware.rate_limiter import rate_limit
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@rate_limit(limit=10, period=3600)  # Strict limit for registration
def register():
    data = request.get_json()
    return AuthController.register(data)

@auth_bp.route('/login', methods=['POST'])
@rate_limit(limit=20, period=3600)  # Strict limit for login
def login():
    data = request.get_json()
    return AuthController.login(data)

@auth_bp.route('/profile', methods=['GET'])
@require_auth
def get_profile(user_id):
    return AuthController.get_profile(user_id)

@auth_bp.route('/profile', methods=['PUT'])
@require_auth
def update_profile(user_id):
    data = request.get_json()
    return AuthController.update_profile(user_id, data)

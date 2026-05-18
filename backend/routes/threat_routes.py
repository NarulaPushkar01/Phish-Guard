"""
PhishGuard - Threat Routes
API endpoints for standalone threat intelligence lookups and stats.
"""

from flask import Blueprint, request
from controllers.threat_controller import ThreatController
from middleware.auth_middleware import require_auth
from middleware.rate_limiter import rate_limit

threat_bp = Blueprint('threats', __name__)

@threat_bp.route('/check-url', methods=['POST'])
@require_auth
@rate_limit(limit=30, period=3600)
def check_url(user_id):
    data = request.get_json()
    return ThreatController.check_url(data)

@threat_bp.route('/check-ip', methods=['POST'])
@require_auth
@rate_limit(limit=30, period=3600)
def check_ip(user_id):
    data = request.get_json()
    return ThreatController.check_ip(data)

@threat_bp.route('/stats', methods=['GET'])
@require_auth
def get_stats(user_id):
    return ThreatController.get_dashboard_stats(user_id)

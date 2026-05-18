"""
PhishGuard - Tools Routes
API endpoints for standalone security tools.
"""

from flask import Blueprint, request
from controllers.tools_controller import ToolsController
from middleware.auth_middleware import require_auth
from middleware.rate_limiter import rate_limit

tools_bp = Blueprint('tools', __name__)


@tools_bp.route('/ssl-check', methods=['POST'])
@require_auth
@rate_limit(limit=30, period=3600)
def ssl_check(user_id):
    data = request.get_json()
    return ToolsController.ssl_check(data)


@tools_bp.route('/dns-lookup', methods=['POST'])
@require_auth
@rate_limit(limit=30, period=3600)
def dns_lookup(user_id):
    data = request.get_json()
    return ToolsController.dns_lookup(data)


@tools_bp.route('/expand-link', methods=['POST'])
@require_auth
@rate_limit(limit=30, period=3600)
def expand_link(user_id):
    data = request.get_json()
    return ToolsController.expand_link(data)


@tools_bp.route('/whois', methods=['POST'])
@require_auth
@rate_limit(limit=30, period=3600)
def whois_lookup(user_id):
    data = request.get_json()
    return ToolsController.whois_lookup(data)


@tools_bp.route('/password-check', methods=['POST'])
@require_auth
@rate_limit(limit=20, period=3600)
def password_check(user_id):
    data = request.get_json()
    return ToolsController.password_check(data)

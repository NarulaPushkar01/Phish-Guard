"""
PhishGuard - Report Routes
API endpoints for managing security reports.
"""

from flask import Blueprint, request
from controllers.report_controller import ReportController
from middleware.auth_middleware import require_auth
from middleware.rate_limiter import rate_limit

report_bp = Blueprint('reports', __name__)

@report_bp.route('/generate', methods=['POST'])
@require_auth
@rate_limit(limit=20, period=3600)
def generate_report(user_id):
    data = request.get_json()
    return ReportController.generate_report(user_id, data)

@report_bp.route('', methods=['GET'])
@require_auth
def get_reports(user_id):
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    return ReportController.get_reports(user_id, page, limit)

@report_bp.route('/<report_id>/pdf', methods=['GET'])
@require_auth
@rate_limit(limit=50, period=3600)
def download_report(user_id, report_id):
    return ReportController.download_report(user_id, report_id)

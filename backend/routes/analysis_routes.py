"""
PhishGuard - Analysis Routes
API endpoints for email analysis.
"""

from flask import Blueprint, request, jsonify
from controllers.analysis_controller import AnalysisController
from middleware.auth_middleware import require_auth
from middleware.rate_limiter import rate_limit

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/upload', methods=['POST'])
@require_auth
@rate_limit(limit=50, period=3600)  # 50 analyses per hour per IP
def upload_email(user_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400
        
    file = request.files['file']
    return AnalysisController.upload_and_analyze(user_id, file)

@analysis_bp.route('/history', methods=['GET'])
@require_auth
def get_history(user_id):
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    return AnalysisController.get_history(user_id, page, limit)

@analysis_bp.route('/<analysis_id>', methods=['GET'])
@require_auth
def get_analysis(user_id, analysis_id):
    return AnalysisController.get_analysis(user_id, analysis_id)

@analysis_bp.route('/<analysis_id>', methods=['DELETE'])
@require_auth
def delete_analysis(user_id, analysis_id):
    return AnalysisController.delete_analysis(user_id, analysis_id)

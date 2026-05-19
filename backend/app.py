"""
PhishGuard - Main Application Entry Point
Initializes Flask app, configures extensions, and registers blueprints.
"""

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database.connection import init_db, close_db
from utils.logger import logger
import os

# Import Blueprints
from routes.auth_routes import auth_bp
from routes.analysis_routes import analysis_bp
from routes.threat_routes import threat_bp
from routes.report_routes import report_bp
from routes.tools_routes import tools_bp

def create_app():
    """Application Factory."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize Extensions
    CORS(app)
    jwt = JWTManager(app)
    
    # Ensure upload directory exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
        
    # Ensure reports directory exists
    if not os.path.exists(Config.REPORTS_FOLDER):
        os.makedirs(Config.REPORTS_FOLDER)

    # Initialize Database
    with app.app_context():
        init_db()
        
    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(analysis_bp, url_prefix='/api/analysis')
    app.register_blueprint(threat_bp, url_prefix='/api/threats')
    app.register_blueprint(report_bp, url_prefix='/api/reports')
    app.register_blueprint(tools_bp, url_prefix='/api/tools')
    
    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        from database.connection import db
        db_status = "connected" if db is not None else "disconnected"
        return jsonify({
            "status": "online",
            "service": "PhishGuard API",
            "database": db_status
        }), 200

    # Error Handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(413)
    def payload_too_large(error):
        return jsonify({"error": "File too large. Maximum size is 16MB"}), 413

    # JWT Error Handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token has expired"}), 401
        
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"error": "Invalid token"}), 401
        
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"error": "Missing authorization token"}), 401

    return app

app = create_app()

if __name__ == '__main__':
    logger.info("🚀 Starting PhishGuard Backend Server...")
    app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'])

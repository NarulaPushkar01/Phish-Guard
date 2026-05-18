"""
PhishGuard - Analysis Controller
Orchestrates email parsing, threat analysis, IOC extraction, and scoring.
"""

from flask import jsonify, current_app
import traceback
from werkzeug.utils import secure_filename
import os
from database.connection import get_db
from database.models import create_analysis, serialize_doc
from services.email_parser import EmailParser
from services.threat_engine import ThreatEngine
from services.ioc_extractor import IOCExtractor
from services.threat_scorer import ThreatScorer
from utils.validators import validate_file_extension
from utils.logger import logger
from bson import ObjectId

class AnalysisController:
    @staticmethod
    def upload_and_analyze(user_id, file):
        """Handle file upload and run full analysis pipeline."""
        if not file or file.filename == '':
            return jsonify({"error": "No file provided"}), 400
            
        if not validate_file_extension(file.filename):
            return jsonify({"error": "Invalid file type. Only .eml and .txt allowed"}), 400
            
        filename = secure_filename(file.filename)
        
        try:
            # Read file content directly into memory
            file_content = file.read()
            
            # 1. Parse Email
            logger.info(f"Parsing email: {filename}")
            parser = EmailParser(content=file_content)
            parsed_data = parser.parse()
            
            # 2. Threat Analysis
            logger.info(f"Running threat analysis for: {filename}")
            engine = ThreatEngine()
            threat_data = {
                "url_analysis": engine.analyze_urls(parsed_data["urls"]),
                "ip_analysis": engine.analyze_ips(parsed_data["ips"]),
                "content_analysis": engine.analyze_content(
                    parsed_data["body"]["text"], 
                    parsed_data["headers"].get("Subject", "")
                ),
                "spoofing": engine.detect_spoofing(parsed_data["headers"])
            }
            
            # 3. Extract IOCs and MITRE
            logger.info(f"Extracting IOCs for: {filename}")
            iocs, mitre = IOCExtractor.extract_iocs(parsed_data, threat_data)
            
            # 4. Calculate Threat Score
            logger.info(f"Calculating threat score for: {filename}")
            scoring_results = ThreatScorer.calculate_score(parsed_data, threat_data)
            
            # Prepare full results object
            full_results = {
                **parsed_data,
                **threat_data,
                "iocs": iocs,
                "mitre_techniques": mitre,
                "threat_score": scoring_results["score"],
                "severity": scoring_results["severity"],
                "threat_details": scoring_results["details"]
            }
            
            # 5. Save to Database
            db = get_db()
            analysis_doc = create_analysis(user_id, filename, full_results)
            result = db.analyses.insert_one(analysis_doc)
            
            # Update user stats
            db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$inc": {"analyses_count": 1}}
            )
            
            analysis_doc['_id'] = result.inserted_id
            
            return jsonify({
                "message": "Analysis complete",
                "analysis_id": str(result.inserted_id),
                "results": serialize_doc(analysis_doc)
            }), 200
            
        except Exception as e:
            with open("error_log.txt", "w") as f:
                f.write(traceback.format_exc())
            logger.error(f"Analysis error: {e}", exc_info=True)
            return jsonify({
                "error": "Invalid email format or corrupted file. Please upload a valid .eml or structured phishing email text file."
            }), 400

    @staticmethod
    def get_history(user_id, page=1, limit=10):
        """Get analysis history for a user."""
        db = get_db()
        try:
            skip = (page - 1) * limit
            cursor = db.analyses.find(
                {"user_id": ObjectId(user_id)},
                {"headers.Subject": 1, "headers.From": 1, "filename": 1, "created_at": 1, "threat_score": 1, "severity": 1}
            ).sort("created_at", -1).skip(skip).limit(limit)
            
            total = db.analyses.count_documents({"user_id": ObjectId(user_id)})
            analyses = [serialize_doc(doc) for doc in cursor]
            
            return jsonify({
                "analyses": analyses,
                "total": total,
                "page": page,
                "pages": (total + limit - 1) // limit
            }), 200
            
        except Exception as e:
            logger.error(f"Error fetching history: {e}")
            return jsonify({"error": "Failed to fetch history"}), 500

    @staticmethod
    def get_analysis(user_id, analysis_id):
        """Get full details of a specific analysis."""
        db = get_db()
        try:
            doc = db.analyses.find_one({
                "_id": ObjectId(analysis_id),
                "user_id": ObjectId(user_id)
            })
            
            if not doc:
                return jsonify({"error": "Analysis not found"}), 404
                
            return jsonify({"analysis": serialize_doc(doc)}), 200
            
        except Exception as e:
            logger.error(f"Error fetching analysis {analysis_id}: {e}")
            return jsonify({"error": "Failed to fetch analysis"}), 500

    @staticmethod
    def delete_analysis(user_id, analysis_id):
        """Delete an analysis record."""
        db = get_db()
        try:
            result = db.analyses.delete_one({
                "_id": ObjectId(analysis_id),
                "user_id": ObjectId(user_id)
            })
            
            if result.deleted_count == 0:
                return jsonify({"error": "Analysis not found"}), 404
                
            return jsonify({"message": "Analysis deleted successfully"}), 200
            
        except Exception as e:
            logger.error(f"Error deleting analysis {analysis_id}: {e}")
            return jsonify({"error": "Failed to delete analysis"}), 500

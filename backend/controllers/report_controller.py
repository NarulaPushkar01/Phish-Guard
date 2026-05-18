"""
PhishGuard - Report Controller
Handles PDF report generation and retrieval.
"""

from flask import jsonify, send_file
import os
from database.connection import get_db
from database.models import create_report, serialize_doc
from services.pdf_generator import PDFGenerator
from utils.logger import logger
from bson import ObjectId
from config import Config

class ReportController:
    @staticmethod
    def generate_report(user_id, data):
        """Generate a PDF report for a specific analysis."""
        analysis_id = data.get('analysis_id')
        if not analysis_id:
            return jsonify({"error": "analysis_id is required"}), 400
            
        db = get_db()
        try:
            # Check if report already exists
            existing_report = db.reports.find_one({
                "analysis_id": ObjectId(analysis_id),
                "user_id": ObjectId(user_id)
            })
            
            if existing_report:
                return jsonify({
                    "message": "Report already exists",
                    "report": serialize_doc(existing_report)
                }), 200
                
            # Fetch analysis
            analysis = db.analyses.find_one({
                "_id": ObjectId(analysis_id),
                "user_id": ObjectId(user_id)
            })
            
            if not analysis:
                return jsonify({"error": "Analysis not found"}), 404
                
            # Generate PDF
            generator = PDFGenerator()
            # Need to pass serializable dictionary
            analysis_dict = serialize_doc(analysis)
            filepath, filename = generator.generate_report(analysis_dict)
            
            # Save report metadata to db
            report_data = {
                "filename": filename,
                "threat_score": analysis.get('threat_score', 0),
                "severity": analysis.get('severity', 'Unknown'),
                "pdf_path": filepath
            }
            
            report_doc = create_report(user_id, analysis_id, report_data)
            result = db.reports.insert_one(report_doc)
            report_doc['_id'] = result.inserted_id
            
            return jsonify({
                "message": "Report generated successfully",
                "report": serialize_doc(report_doc)
            }), 201
            
        except Exception as e:
            logger.error(f"Error generating report: {e}")
            return jsonify({"error": "Failed to generate report"}), 500

    @staticmethod
    def get_reports(user_id, page=1, limit=10):
        """Get list of generated reports."""
        db = get_db()
        try:
            skip = (page - 1) * limit
            cursor = db.reports.find(
                {"user_id": ObjectId(user_id)}
            ).sort("created_at", -1).skip(skip).limit(limit)
            
            total = db.reports.count_documents({"user_id": ObjectId(user_id)})
            reports = [serialize_doc(doc) for doc in cursor]
            
            return jsonify({
                "reports": reports,
                "total": total,
                "page": page,
                "pages": (total + limit - 1) // limit
            }), 200
            
        except Exception as e:
            logger.error(f"Error fetching reports: {e}")
            return jsonify({"error": "Failed to fetch reports"}), 500

    @staticmethod
    def download_report(user_id, report_id):
        """Download a generated PDF report."""
        db = get_db()
        try:
            report = db.reports.find_one({
                "_id": ObjectId(report_id),
                "user_id": ObjectId(user_id)
            })
            
            if not report:
                return jsonify({"error": "Report not found"}), 404
                
            filepath = report.get('pdf_path')
            if not filepath or not os.path.exists(filepath):
                return jsonify({"error": "PDF file not found on server"}), 404
                
            return send_file(
                filepath,
                mimetype='application/pdf',
                as_attachment=True,
                download_name=report.get('filename', 'report.pdf')
            )
            
        except Exception as e:
            logger.error(f"Error downloading report: {e}")
            return jsonify({"error": "Failed to download report"}), 500

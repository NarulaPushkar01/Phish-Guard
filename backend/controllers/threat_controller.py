"""
PhishGuard - Threat Controller
Handles standalone threat intelligence lookups and dashboard statistics.
"""

from flask import jsonify
from database.connection import get_db
from services.threat_engine import ThreatEngine
from utils.logger import logger
from bson import ObjectId

class ThreatController:
    @staticmethod
    def check_url(data):
        """Check a single URL reputation."""
        url = data.get('url', '').strip()
        if not url:
            return jsonify({"error": "URL is required"}), 400
            
        try:
            engine = ThreatEngine()
            # Wrap in list as engine expects list, return first item
            result = engine.analyze_urls([url])[0]
            return jsonify({"result": result}), 200
        except Exception as e:
            logger.error(f"URL check error: {e}")
            return jsonify({"error": "Failed to check URL"}), 500

    @staticmethod
    def check_ip(data):
        """Check a single IP reputation."""
        ip = data.get('ip', '').strip()
        if not ip:
            return jsonify({"error": "IP is required"}), 400
            
        import re
        if not re.match(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$', ip):
            return jsonify({"error": "Invalid IP address format"}), 400
            
        try:
            engine = ThreatEngine()
            result = engine.analyze_ips([ip])[0]
            return jsonify({"result": result}), 200
        except Exception as e:
            logger.error(f"IP check error: {e}")
            return jsonify({"error": "Failed to check IP"}), 500

    @staticmethod
    def get_dashboard_stats(user_id):
        """Get aggregate statistics for the user's dashboard."""
        db = get_db()
        try:
            user_oid = ObjectId(user_id)
            
            # Total analyses
            total_emails = db.analyses.count_documents({"user_id": user_oid})
            
            # Severity counts
            pipeline = [
                {"$match": {"user_id": user_oid}},
                {"$group": {"_id": "$severity", "count": {"$sum": 1}}}
            ]
            severity_counts = list(db.analyses.aggregate(pipeline))
            
            severity_stats = {
                "Low": 0, "Medium": 0, "High": 0, "Critical": 0
            }
            for stat in severity_counts:
                severity_name = str(stat.get("_id", "Low")).capitalize()
                if severity_name in severity_stats:
                    severity_stats[severity_name] += stat["count"]
                else:
                    severity_stats[severity_name] = stat["count"]
                
            # Aggregate threats (Malicious URLs, Suspicious IPs)
            # A bit complex to do in MongoDB without unwinding, so we approximate
            # by counting analyses that have malicious URLs/IPs
            
            malicious_urls_count = db.analyses.count_documents({
                "user_id": user_oid,
                "url_analysis.status": "malicious"
            })
            
            suspicious_ips_count = db.analyses.count_documents({
                "user_id": user_oid,
                "ip_analysis.status": {"$in": ["suspicious", "malicious"]}
            })
            
            # Threat trend (last 7 days)
            from datetime import datetime, timedelta, timezone
            seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
            
            trend_pipeline = [
                {"$match": {
                    "user_id": user_oid,
                    "created_at": {"$gte": seven_days_ago}
                }},
                {"$group": {
                    "_id": {
                        "$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}
                    },
                    "avg_score": {"$avg": "$threat_score"},
                    "count": {"$sum": 1}
                }},
                {"$sort": {"_id": 1}}
            ]
            trend_data = list(db.analyses.aggregate(trend_pipeline))
            
            return jsonify({
                "stats": {
                    "total_analyzed": total_emails,
                    "malicious_urls": malicious_urls_count,
                    "suspicious_ips": suspicious_ips_count,
                    "critical_threats": severity_stats.get("Critical", 0),
                    "severity_distribution": severity_stats
                },
                "trend": trend_data
            }), 200
            
        except Exception as e:
            logger.error(f"Error fetching dashboard stats: {e}")
            return jsonify({"error": "Failed to fetch statistics"}), 500

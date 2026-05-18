"""
PhishGuard - Database Models
Defines MongoDB document schemas and helper functions.
"""

from datetime import datetime, timezone
from bson import ObjectId


def create_user(username, email, password_hash):
    """
    Create a new user document.

    Args:
        username: Unique username
        email: User email address
        password_hash: Bcrypt hashed password

    Returns:
        dict: User document ready for MongoDB insertion
    """
    return {
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "analyses_count": 0,
        "profile": {
            "full_name": "",
            "organization": "",
            "role": "Analyst",
            "avatar_color": "#00ff88",  # Default neon green
        },
    }


def create_analysis(user_id, filename, results):
    """
    Create an analysis document from parsed email results.

    Args:
        user_id: ObjectId of the user who uploaded the email
        filename: Original filename of the uploaded email
        results: Dict containing all analysis results

    Returns:
        dict: Analysis document ready for MongoDB insertion
    """
    return {
        "user_id": ObjectId(user_id),
        "filename": filename,
        "created_at": datetime.now(timezone.utc),
        # Email headers
        "headers": results.get("headers", {}),
        # Extracted data
        "urls": results.get("urls", []),
        "ips": results.get("ips", []),
        "domains": results.get("domains", []),
        "email_addresses": results.get("email_addresses", []),
        "attachments": results.get("attachments", []),
        # Authentication results
        "auth_results": results.get("auth_results", {}),
        # Threat analysis
        "threat_score": results.get("threat_score", 0),
        "severity": results.get("severity", "Low"),
        "threat_details": results.get("threat_details", {}),
        # IOC data
        "iocs": results.get("iocs", {}),
        # MITRE ATT&CK mappings
        "mitre_techniques": results.get("mitre_techniques", []),
        # URL scan results
        "url_analysis": results.get("url_analysis", []),
        # IP reputation results
        "ip_analysis": results.get("ip_analysis", []),
        # Raw content indicators
        "content_analysis": results.get("content_analysis", {}),
    }


def create_report(user_id, analysis_id, report_data):
    """
    Create a report document.

    Args:
        user_id: ObjectId of the user
        analysis_id: ObjectId of the associated analysis
        report_data: Dict containing report metadata

    Returns:
        dict: Report document ready for MongoDB insertion
    """
    return {
        "user_id": ObjectId(user_id),
        "analysis_id": ObjectId(analysis_id),
        "created_at": datetime.now(timezone.utc),
        "filename": report_data.get("filename", "report.pdf"),
        "threat_score": report_data.get("threat_score", 0),
        "severity": report_data.get("severity", "Low"),
        "summary": report_data.get("summary", ""),
        "pdf_path": report_data.get("pdf_path", ""),
    }


def serialize_doc(doc):
    """
    Convert MongoDB document to JSON-serializable dict.
    Converts ObjectId and datetime fields to strings.
    """
    if doc is None:
        return None

    serialized = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        elif isinstance(value, datetime):
            serialized[key] = value.isoformat()
        elif isinstance(value, dict):
            serialized[key] = serialize_doc(value)
        elif isinstance(value, list):
            serialized[key] = [
                serialize_doc(item) if isinstance(item, dict) else
                str(item) if isinstance(item, ObjectId) else
                item.isoformat() if isinstance(item, datetime) else
                item
                for item in value
            ]
        else:
            serialized[key] = value

    return serialized

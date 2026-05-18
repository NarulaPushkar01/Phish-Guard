"""
PhishGuard - Configuration Module
Loads environment variables and provides centralized config management.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Application configuration loaded from environment variables."""

    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/phishguard")
    DATABASE_NAME = "phishguard"

    # JWT Authentication
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds

    # Flask
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"

    # File Upload
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", 16 * 1024 * 1024))  # 16MB
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
    ALLOWED_EXTENSIONS = {"eml", "txt"}

    # External API Keys
    VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY", "")
    ABUSEIPDB_API_KEY = os.getenv("ABUSEIPDB_API_KEY", "")
    URLSCAN_API_KEY = os.getenv("URLSCAN_API_KEY", "")

    # Report Generation
    REPORTS_FOLDER = "generated_reports"

    # Rate Limiting
    RATE_LIMIT_DEFAULT = "100/hour"
    RATE_LIMIT_AUTH = "20/hour"

    @classmethod
    def has_virustotal_key(cls):
        """Check if VirusTotal API key is configured."""
        return bool(cls.VIRUSTOTAL_API_KEY)

    @classmethod
    def has_abuseipdb_key(cls):
        """Check if AbuseIPDB API key is configured."""
        return bool(cls.ABUSEIPDB_API_KEY)

    @classmethod
    def has_urlscan_key(cls):
        """Check if URLScan.io API key is configured."""
        return bool(cls.URLSCAN_API_KEY)

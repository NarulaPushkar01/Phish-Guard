"""
PhishGuard - Tools Controller
Handles standalone security tool lookups.
"""

import re
from flask import jsonify
from services.ssl_checker import SSLChecker
from services.dns_lookup import DNSLookup
from services.link_expander import LinkExpander
from services.whois_checker import WhoisChecker
from services.password_checker import PasswordChecker
from utils.logger import logger


class ToolsController:
    @staticmethod
    def ssl_check(data):
        """Check SSL certificate for a domain."""
        domain = data.get("domain", "").strip()
        if not domain:
            return jsonify({"error": "Domain is required"}), 400

        try:
            result = SSLChecker.check(domain)
            return jsonify({"result": result}), 200
        except Exception as e:
            logger.error(f"SSL check error: {e}")
            return jsonify({"error": "SSL check failed"}), 500

    @staticmethod
    def dns_lookup(data):
        """Perform DNS lookup for a domain."""
        domain = data.get("domain", "").strip()
        if not domain:
            return jsonify({"error": "Domain is required"}), 400

        try:
            result = DNSLookup.lookup(domain)
            return jsonify({"result": result}), 200
        except Exception as e:
            logger.error(f"DNS lookup error: {e}")
            return jsonify({"error": "DNS lookup failed"}), 500

    @staticmethod
    def expand_link(data):
        """Expand a shortened URL."""
        url = data.get("url", "").strip()
        if not url:
            return jsonify({"error": "URL is required"}), 400

        try:
            result = LinkExpander.expand(url)
            return jsonify({"result": result}), 200
        except Exception as e:
            logger.error(f"Link expansion error: {e}")
            return jsonify({"error": "Link expansion failed"}), 500

    @staticmethod
    def whois_lookup(data):
        """Perform WHOIS lookup."""
        domain = data.get("domain", "").strip()
        if not domain:
            return jsonify({"error": "Domain is required"}), 400

        try:
            result = WhoisChecker.check(domain)
            return jsonify({"result": result}), 200
        except Exception as e:
            logger.error(f"WHOIS error: {e}")
            return jsonify({"error": "WHOIS lookup failed"}), 500

    @staticmethod
    def password_check(data):
        """Check if a password has been breached."""
        password = data.get("password", "")
        if not password:
            return jsonify({"error": "Password is required"}), 400

        try:
            result = PasswordChecker.check_password(password)
            return jsonify({"result": result}), 200
        except Exception as e:
            logger.error(f"Password check error: {e}")
            return jsonify({"error": "Password check failed"}), 500

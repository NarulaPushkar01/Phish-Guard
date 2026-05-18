"""
PhishGuard - Password Breach Checker Service
Uses HaveIBeenPwned k-anonymity API to check if a password has been breached.
Only sends the first 5 characters of the SHA1 hash — fully private.
"""

import hashlib
import requests
from utils.logger import logger


class PasswordChecker:
    HIBP_API = "https://api.pwnedpasswords.com/range/"

    @staticmethod
    def check_password(password):
        """Check if a password has appeared in known data breaches."""
        result = {
            "breached": False,
            "breach_count": 0,
            "strength": "unknown",
            "suggestions": [],
            "error": None
        }

        # Password strength analysis
        result["strength"] = PasswordChecker._analyze_strength(password)
        result["suggestions"] = PasswordChecker._get_suggestions(password)

        try:
            sha1 = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
            prefix = sha1[:5]
            suffix = sha1[5:]

            response = requests.get(
                f"{PasswordChecker.HIBP_API}{prefix}",
                timeout=5,
                headers={"User-Agent": "PhishGuard-Security-Scanner"}
            )

            if response.status_code == 200:
                for line in response.text.splitlines():
                    hash_suffix, count = line.split(":")
                    if hash_suffix.strip() == suffix:
                        result["breached"] = True
                        result["breach_count"] = int(count.strip())
                        break
            else:
                result["error"] = f"HIBP API returned status {response.status_code}"

        except requests.exceptions.ConnectionError:
            result["error"] = "Could not connect to breach database"
        except Exception as e:
            logger.error(f"Password breach check error: {e}")
            result["error"] = str(e)

        return result

    @staticmethod
    def _analyze_strength(password):
        """Analyze password strength."""
        score = 0
        if len(password) >= 8: score += 1
        if len(password) >= 12: score += 1
        if len(password) >= 16: score += 1
        if any(c.isupper() for c in password): score += 1
        if any(c.islower() for c in password): score += 1
        if any(c.isdigit() for c in password): score += 1
        if any(c in "!@#$%^&*()_+-=[]{}|;':\",./<>?" for c in password): score += 1

        if score <= 2: return "weak"
        if score <= 4: return "moderate"
        if score <= 5: return "strong"
        return "very_strong"

    @staticmethod
    def _get_suggestions(password):
        """Generate improvement suggestions."""
        suggestions = []
        if len(password) < 12:
            suggestions.append("Use at least 12 characters")
        if not any(c.isupper() for c in password):
            suggestions.append("Add uppercase letters")
        if not any(c.islower() for c in password):
            suggestions.append("Add lowercase letters")
        if not any(c.isdigit() for c in password):
            suggestions.append("Add numbers")
        if not any(c in "!@#$%^&*()_+-=[]{}|;':\",./<>?" for c in password):
            suggestions.append("Add special characters (!@#$%)")
        if len(set(password)) < len(password) * 0.5:
            suggestions.append("Avoid repeating characters")
        return suggestions

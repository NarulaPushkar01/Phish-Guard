"""
PhishGuard - WHOIS / Domain Age Checker Service
Performs WHOIS lookups to determine domain registration info and age.
"""

from datetime import datetime, timezone
from utils.logger import logger


class WhoisChecker:
    @staticmethod
    def check(domain):
        """Perform WHOIS lookup on a domain."""
        domain = domain.strip().lower()
        if domain.startswith("https://"):
            domain = domain[8:]
        if domain.startswith("http://"):
            domain = domain[7:]
        domain = domain.split("/")[0]
        domain = domain.split(":")[0]

        result = {
            "domain": domain,
            "registrar": None,
            "creation_date": None,
            "expiration_date": None,
            "updated_date": None,
            "domain_age_days": None,
            "is_new_domain": False,
            "name_servers": [],
            "status": [],
            "country": None,
            "error": None
        }

        try:
            import whois
            w = whois.whois(domain)

            if w.domain_name is None:
                result["error"] = f"No WHOIS data found for '{domain}'"
                return result

            result["registrar"] = w.registrar or "Unknown"

            # Handle creation_date (can be list or single value)
            creation = w.creation_date
            if isinstance(creation, list):
                creation = creation[0]
            if creation:
                if isinstance(creation, str):
                    try:
                        creation = datetime.strptime(creation, "%Y-%m-%d %H:%M:%S")
                    except Exception:
                        creation = None
                if creation:
                    result["creation_date"] = creation.isoformat()
                    now = datetime.now(timezone.utc)
                    if creation.tzinfo is None:
                        creation = creation.replace(tzinfo=timezone.utc)
                    age_days = (now - creation).days
                    result["domain_age_days"] = age_days
                    result["is_new_domain"] = age_days < 30

            # Expiration
            expiration = w.expiration_date
            if isinstance(expiration, list):
                expiration = expiration[0]
            if expiration:
                if isinstance(expiration, str):
                    try:
                        expiration = datetime.strptime(expiration, "%Y-%m-%d %H:%M:%S")
                    except Exception:
                        expiration = None
                if expiration:
                    result["expiration_date"] = expiration.isoformat()

            # Updated date
            updated = w.updated_date
            if isinstance(updated, list):
                updated = updated[0]
            if updated:
                if isinstance(updated, str):
                    try:
                        updated = datetime.strptime(updated, "%Y-%m-%d %H:%M:%S")
                    except Exception:
                        updated = None
                if updated:
                    result["updated_date"] = updated.isoformat()

            # Name servers
            ns = w.name_servers
            if ns:
                if isinstance(ns, list):
                    result["name_servers"] = [str(n).lower() for n in ns]
                else:
                    result["name_servers"] = [str(ns).lower()]

            # Status
            status = w.status
            if status:
                if isinstance(status, list):
                    result["status"] = status
                else:
                    result["status"] = [status]

            result["country"] = w.country or None

        except ImportError:
            result["error"] = "python-whois package not installed"
        except Exception as e:
            logger.error(f"WHOIS check error for {domain}: {e}")
            result["error"] = str(e)

        return result

"""
PhishGuard - SSL Certificate Checker Service
Checks SSL certificate validity, issuer, expiry for any domain.
"""

import ssl
import socket
from datetime import datetime, timezone
from utils.logger import logger


class SSLChecker:
    @staticmethod
    def check(domain):
        """Check SSL certificate for a domain."""
        domain = domain.strip().lower()
        # Remove protocol prefix if present
        if domain.startswith("https://"):
            domain = domain[8:]
        if domain.startswith("http://"):
            domain = domain[7:]
        # Remove path
        domain = domain.split("/")[0]
        # Remove port
        domain = domain.split(":")[0]

        result = {
            "domain": domain,
            "valid": False,
            "issuer": None,
            "subject": None,
            "not_before": None,
            "not_after": None,
            "days_remaining": None,
            "is_expired": True,
            "is_self_signed": False,
            "protocol": None,
            "serial_number": None,
            "error": None
        }

        try:
            context = ssl.create_default_context()
            conn = context.wrap_socket(
                socket.socket(socket.AF_INET),
                server_hostname=domain
            )
            conn.settimeout(5)
            conn.connect((domain, 443))
            cert = conn.getpeercert()
            conn.close()

            # Parse issuer
            issuer_dict = dict(x[0] for x in cert.get("issuer", []))
            subject_dict = dict(x[0] for x in cert.get("subject", []))

            not_before = datetime.strptime(cert["notBefore"], "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
            not_after = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)

            days_remaining = (not_after - now).days

            result["valid"] = True
            result["issuer"] = issuer_dict.get("organizationName", issuer_dict.get("commonName", "Unknown"))
            result["subject"] = subject_dict.get("commonName", domain)
            result["not_before"] = not_before.isoformat()
            result["not_after"] = not_after.isoformat()
            result["days_remaining"] = days_remaining
            result["is_expired"] = days_remaining < 0
            result["is_self_signed"] = (
                issuer_dict.get("commonName") == subject_dict.get("commonName") and
                issuer_dict.get("organizationName", "") == subject_dict.get("organizationName", "")
            )
            result["serial_number"] = cert.get("serialNumber", "N/A")

        except ssl.SSLCertVerificationError as e:
            result["error"] = f"SSL verification failed: {str(e)}"
        except socket.gaierror:
            result["error"] = f"Domain '{domain}' could not be resolved"
        except socket.timeout:
            result["error"] = "Connection timed out"
        except ConnectionRefusedError:
            result["error"] = "Connection refused — port 443 may be closed"
        except Exception as e:
            logger.error(f"SSL check error for {domain}: {e}")
            result["error"] = str(e)

        return result

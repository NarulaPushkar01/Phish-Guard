"""
PhishGuard - Threat Engine Service
Handles external API integrations (VirusTotal, AbuseIPDB) and content analysis.
"""

import requests
import base64
from config import Config
from utils.logger import logger
from utils.constants import PHISHING_KEYWORDS, SUSPICIOUS_TLDS, URL_SHORTENERS, COMMONLY_SPOOFED_BRANDS

class ThreatEngine:
    def __init__(self):
        self.vt_key = Config.VIRUSTOTAL_API_KEY
        self.abuseipdb_key = Config.ABUSEIPDB_API_KEY

    def analyze_urls(self, urls):
        """Analyze a list of URLs using VirusTotal and internal checks."""
        results = []
        for url in urls[:5]:  # Limit to first 5 URLs to avoid rate limits
            url_data = {
                "url": url,
                "is_shortened": any(short in url.lower() for short in URL_SHORTENERS),
                "suspicious_tld": any(url.lower().endswith(tld) or f"{tld}/" in url.lower() for tld in SUSPICIOUS_TLDS),
                "vt_results": None,
                "status": "clean"
            }
            
            if self.vt_key:
                try:
                    vt_res = self._check_virustotal_url(url)
                    url_data["vt_results"] = vt_res
                    if vt_res.get("malicious", 0) > 0 or vt_res.get("suspicious", 0) > 0:
                        url_data["status"] = "malicious"
                except Exception as e:
                    logger.warning(f"VirusTotal check failed for {url}: {e}")
            else:
                # Mock result for demo mode
                url_data["vt_results"] = {"malicious": 0, "suspicious": 0, "harmless": 10, "undetected": 80}
                
            if url_data["is_shortened"] or url_data["suspicious_tld"]:
                if url_data["status"] == "clean":
                    url_data["status"] = "suspicious"
                    
            results.append(url_data)
        return results

    def analyze_ips(self, ips):
        """Analyze a list of IPs using AbuseIPDB."""
        results = []
        for ip in ips[:3]:  # Limit to 3 IPs
            ip_data = {
                "ip": ip,
                "abuse_score": 0,
                "country": "Unknown",
                "isp": "Unknown",
                "status": "clean"
            }
            
            if self.abuseipdb_key:
                try:
                    abuse_res = self._check_abuseipdb(ip)
                    if abuse_res:
                        ip_data["abuse_score"] = abuse_res.get("abuseConfidenceScore", 0)
                        ip_data["country"] = abuse_res.get("countryCode", "Unknown")
                        ip_data["isp"] = abuse_res.get("isp", "Unknown")
                        if ip_data["abuse_score"] > 20:
                            ip_data["status"] = "suspicious"
                        if ip_data["abuse_score"] > 60:
                            ip_data["status"] = "malicious"
                except Exception as e:
                    logger.warning(f"AbuseIPDB check failed for {ip}: {e}")
            else:
                # Mock result for demo mode
                if ip.startswith("10.") or ip.startswith("192."):
                    ip_data["status"] = "clean"
                else:
                    ip_data["abuse_score"] = 0
                    
            results.append(ip_data)
        return results

    def analyze_content(self, text, subject=""):
        """Analyze email body and subject for phishing indicators."""
        full_text = f"{subject} {text}".lower()
        
        found_keywords = [kw for kw in PHISHING_KEYWORDS if kw in full_text]
        
        return {
            "keywords_found": found_keywords,
            "keyword_count": len(found_keywords),
            "urgency_detected": any(kw in full_text for kw in ["urgent", "immediate", "act now", "24 hours"]),
            "financial_lure": any(kw in full_text for kw in ["wire", "transfer", "bank", "invoice", "payment"]),
            "credential_harvesting": any(kw in full_text for kw in ["verify", "login", "password", "account"])
        }

    def detect_spoofing(self, headers):
        """Check for domain spoofing in headers."""
        def get_header_str(key):
            val = headers.get(key, "")
            if isinstance(val, list): return " ".join(str(x) for x in val)
            return str(val) if val else ""

        from_header = get_header_str("From").lower()
        return_path = get_header_str("Return-Path").lower()
        reply_to = get_header_str("Reply-To").lower()
        
        results = {
            "is_spoofed": False,
            "mismatched_return_path": False,
            "mismatched_reply_to": False,
            "brand_impersonation": None
        }
        
        # Check return path mismatch
        if return_path and return_path != "<>" and from_header:
            from_domain = self._extract_domain(from_header)
            return_domain = self._extract_domain(return_path)
            if from_domain and return_domain and from_domain != return_domain:
                results["mismatched_return_path"] = True
                results["is_spoofed"] = True
                
        # Check reply-to mismatch
        if reply_to and from_header:
            from_domain = self._extract_domain(from_header)
            reply_domain = self._extract_domain(reply_to)
            if from_domain and reply_domain and from_domain != reply_domain:
                results["mismatched_reply_to"] = True
                results["is_spoofed"] = True
                
        # Check brand impersonation
        for brand in COMMONLY_SPOOFED_BRANDS:
            if brand in from_header and brand not in self._extract_domain(from_header):
                results["brand_impersonation"] = brand
                results["is_spoofed"] = True
                
        return results

    def _check_virustotal_url(self, url):
        """Query VirusTotal v3 API for URL analysis."""
        url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
        endpoint = f"https://www.virustotal.com/api/v3/urls/{url_id}"
        headers = {"x-apikey": self.vt_key}
        
        resp = requests.get(endpoint, headers=headers, timeout=5)
        if resp.status_code == 200:
            stats = resp.json().get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
            return stats
        elif resp.status_code == 404:
            return {"malicious": 0, "suspicious": 0, "harmless": 0, "undetected": 0, "note": "Unscanned"}
        else:
            resp.raise_for_status()

    def _check_abuseipdb(self, ip):
        """Query AbuseIPDB for IP reputation."""
        endpoint = "https://api.abuseipdb.com/api/v2/check"
        querystring = {"ipAddress": ip, "maxAgeInDays": "90"}
        headers = {"Key": self.abuseipdb_key, "Accept": "application/json"}
        
        resp = requests.get(endpoint, headers=headers, params=querystring, timeout=5)
        if resp.status_code == 200:
            return resp.json().get("data", {})
        return None

    def _extract_domain(self, email_str):
        """Extract domain from an email address string."""
        import re
        match = re.search(r'@([\w.-]+)', email_str)
        return match.group(1).lower() if match else ""

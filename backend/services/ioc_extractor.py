"""
PhishGuard - IOC Extractor Service
Extracts Indicators of Compromise from email and maps to MITRE ATT&CK.
"""

from utils.constants import MITRE_TECHNIQUES

class IOCExtractor:
    @staticmethod
    def extract_iocs(parsed_data, threat_data):
        """Extract all IOCs from parsed email and threat analysis data."""
        iocs = {
            "ips": parsed_data.get("ips", []),
            "urls": parsed_data.get("urls", []),
            "domains": [],
            "email_addresses": parsed_data.get("email_addresses", []),
            "hashes": []  # We'd calculate hashes of attachments here if doing full file analysis
        }
        
        # Extract domains from URLs and Emails
        domains = set()
        import re
        for url in iocs["urls"]:
            match = re.search(r'https?://([^/]+)', str(url))
            if match:
                domains.add(match.group(1))
                
        for email in iocs["email_addresses"]:
            match = re.search(r'@([\w.-]+)', str(email))
            if match:
                domains.add(match.group(1))
                
        iocs["domains"] = list(domains)
        
        # Map MITRE ATT&CK techniques based on findings
        mitre_mappings = IOCExtractor._map_to_mitre(parsed_data, threat_data)
        
        return iocs, mitre_mappings

    @staticmethod
    def _map_to_mitre(parsed_data, threat_data):
        """Map findings to MITRE ATT&CK techniques."""
        techniques = []
        
        # Check for spearphishing attachment
        if any(att.get("suspicious", False) for att in parsed_data.get("attachments", [])):
            techniques.append(MITRE_TECHNIQUES["T1566.001"])
            techniques.append(MITRE_TECHNIQUES["T1204.002"]) # User Execution
            
        # Check for malicious/phishing links
        url_analysis = threat_data.get("url_analysis", [])
        if any(u.get("status") in ["malicious", "suspicious"] for u in url_analysis):
            techniques.append(MITRE_TECHNIQUES["T1566.002"])
            techniques.append(MITRE_TECHNIQUES["T1204.001"]) # User Execution
            
        # Check for credential harvesting
        content = threat_data.get("content_analysis", {})
        if content.get("credential_harvesting"):
            techniques.append(MITRE_TECHNIQUES["T1598.003"]) # Phishing for Information
            techniques.append(MITRE_TECHNIQUES["T1589.001"]) # Gather Victim Identity
            
        return techniques

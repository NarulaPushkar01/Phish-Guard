"""
PhishGuard - Threat Scorer Service
Calculates overall threat score based on all analysis indicators.
"""

class ThreatScorer:
    @staticmethod
    def calculate_score(parsed_data, threat_data):
        """
        Calculate threat score (0-100) based on multiple factors.
        Returns score, severity, and score details.
        """
        score = 0
        details = {
            "authentication_penalty": 0,
            "url_penalty": 0,
            "ip_penalty": 0,
            "content_penalty": 0,
            "attachment_penalty": 0,
            "spoofing_penalty": 0
        }

        urls = parsed_data.get("urls", [])
        headers = parsed_data.get("headers", {})
        
        # Safely convert headers to strings (they might be lists if multiple headers exist)
        subject_raw = headers.get("Subject", "")
        if isinstance(subject_raw, list): subject_raw = " ".join(str(x) for x in subject_raw)
        subject = str(subject_raw).lower()
        
        sender_raw = headers.get("From", "")
        if isinstance(sender_raw, list): sender_raw = " ".join(str(x) for x in sender_raw)
        sender = str(sender_raw).lower()
        
        body_dict = parsed_data.get("body", {})
        body_text = str(body_dict.get("text", ""))
        body_html = str(body_dict.get("html", ""))
        body = (body_text + " " + body_html).lower()

        phishing_keywords = [
            "verify", "suspended", "urgent", "login", "bank", 
            "password", "click below", "confirm", "security alert"
        ]
        suspicious_brands = ["hdfc", "paypal", "google", "microsoft", "amazon", "bank"]
        fake_brands = ["hdfc-secure", "paypal-login", "amazon-verify", "microsoft-auth"]

        # Keyword detection
        for keyword in phishing_keywords:
            if keyword in body or keyword in subject:
                score += 8
                details["content_penalty"] += 8

        # URL checks
        for url in urls:
            url_lower = str(url).lower()
            
            # HTTP instead of HTTPS
            if url_lower.startswith("http://"):
                score += 20
                details["url_penalty"] += 20

            # Suspicious keywords in URL
            suspicious_words = ["login", "verify", "secure", "update", "account"]
            for word in suspicious_words:
                if word in url_lower:
                    score += 8
                    details["url_penalty"] += 8

            # Brand impersonation
            for brand in suspicious_brands:
                if brand in url_lower:
                    score += 10
                    details["url_penalty"] += 10

            # Fake brands
            for brand in fake_brands:
                if brand in url_lower:
                    score += 25
                    details["url_penalty"] += 25

            # Long suspicious domains
            if len(url) > 40:
                score += 10
                details["url_penalty"] += 10

            # Fake TLDs
            suspicious_tlds = [".xyz", ".top", ".ru", ".tk"]
            for tld in suspicious_tlds:
                if tld in url_lower:
                    score += 15
                    details["url_penalty"] += 15

            # URL Shortener Detection
            shorteners = ["bit.ly", "tinyurl", "goo.gl", "t.co"]
            for s in shorteners:
                if s in url_lower:
                    score += 15
                    details["url_penalty"] += 15

        # Gmail pretending to be company
        if "gmail.com" in sender:
            score += 20
            details["spoofing_penalty"] += 20

        # SPF/DKIM/DMARC Failure Detection
        auth = parsed_data.get("auth_results", {})
        if auth.get("spf") == "fail":
            score += 20
            details["authentication_penalty"] += 20
        if auth.get("dkim") == "fail":
            score += 20
            details["authentication_penalty"] += 20
        if auth.get("dmarc") == "fail":
            score += 20
            details["authentication_penalty"] += 20

        # Cap score at 100
        score = min(100, score)

        # Severity
        if score >= 80:
            severity = "Critical"
        elif score >= 60:
            severity = "High"
        elif score >= 40:
            severity = "Medium"
        else:
            severity = "Low"

        return {
            "score": score,
            "severity": severity,
            "details": details
        }

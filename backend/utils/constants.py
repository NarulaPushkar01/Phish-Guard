"""
PhishGuard - Constants
Application-wide constants for phishing detection and analysis.
"""

# ============================================================
# Phishing Keywords - Words commonly found in phishing emails
# ============================================================
PHISHING_KEYWORDS = [
    # Urgency keywords
    "urgent", "immediate action", "act now", "limited time",
    "expires today", "last chance", "don't delay", "time sensitive",
    "within 24 hours", "within 48 hours", "account suspended",
    "account locked", "unauthorized access", "suspicious activity",
    # Credential harvesting
    "verify your account", "confirm your identity", "update your information",
    "reset your password", "click here to login", "enter your credentials",
    "social security number", "credit card number", "bank account",
    "verify your email", "confirm your email", "update payment",
    # Financial lure
    "you have won", "lottery winner", "prize notification",
    "inheritance", "million dollars", "transfer funds",
    "wire transfer", "western union", "bitcoin payment",
    # Threat keywords
    "your account will be closed", "legal action", "police report",
    "failure to comply", "federal investigation", "irs notice",
    "tax refund", "overdue payment", "invoice attached",
    # Social engineering
    "dear customer", "dear user", "valued member",
    "dear account holder", "dear sir/madam",
]

# ============================================================
# Suspicious TLDs - Top-level domains commonly used in phishing
# ============================================================
SUSPICIOUS_TLDS = [
    ".tk", ".ml", ".ga", ".cf", ".gq",  # Free TLDs
    ".xyz", ".top", ".club", ".work", ".click",
    ".link", ".info", ".buzz", ".rest", ".cam",
    ".icu", ".monster", ".quest", ".sbs",
]

# ============================================================
# URL Shorteners - Services commonly abused in phishing
# ============================================================
URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly",
    "is.gd", "buff.ly", "adf.ly", "tiny.cc", "lnkd.in",
    "db.tt", "qr.ae", "cur.lv", "ity.im", "q.gs",
    "po.st", "bc.vc", "u.to", "j.mp", "rb.gy",
    "shorturl.at", "v.gd", "clck.ru",
]

# ============================================================
# Dangerous File Extensions - Risky attachment types
# ============================================================
DANGEROUS_EXTENSIONS = [
    ".exe", ".bat", ".cmd", ".com", ".cpl",
    ".dll", ".hta", ".inf", ".ins", ".isp",
    ".js", ".jse", ".lnk", ".msc", ".msi",
    ".msp", ".mst", ".pif", ".ps1", ".ps2",
    ".reg", ".rgs", ".scr", ".sct", ".shb",
    ".shs", ".vb", ".vbe", ".vbs", ".wsc",
    ".wsf", ".wsh", ".ws", ".docm", ".xlsm",
    ".pptm", ".jar", ".py", ".rb",
]

# ============================================================
# MITRE ATT&CK Techniques - Phishing-related techniques
# ============================================================
MITRE_TECHNIQUES = {
    "T1566.001": {
        "name": "Phishing: Spearphishing Attachment",
        "description": "Adversaries send spearphishing emails with a malicious attachment.",
        "tactic": "Initial Access",
    },
    "T1566.002": {
        "name": "Phishing: Spearphishing Link",
        "description": "Adversaries send spearphishing emails with a malicious link.",
        "tactic": "Initial Access",
    },
    "T1566.003": {
        "name": "Phishing: Spearphishing via Service",
        "description": "Adversaries send spearphishing messages via third-party services.",
        "tactic": "Initial Access",
    },
    "T1598.002": {
        "name": "Phishing for Information: Spearphishing Attachment",
        "description": "Adversaries send phishing messages with attachment to gather credentials.",
        "tactic": "Reconnaissance",
    },
    "T1598.003": {
        "name": "Phishing for Information: Spearphishing Link",
        "description": "Adversaries send phishing messages with a link to gather credentials.",
        "tactic": "Reconnaissance",
    },
    "T1204.001": {
        "name": "User Execution: Malicious Link",
        "description": "An adversary relies on user clicking a malicious link.",
        "tactic": "Execution",
    },
    "T1204.002": {
        "name": "User Execution: Malicious File",
        "description": "An adversary relies on a user opening a malicious file.",
        "tactic": "Execution",
    },
    "T1078": {
        "name": "Valid Accounts",
        "description": "Adversaries obtain and abuse credentials of existing accounts.",
        "tactic": "Defense Evasion",
    },
    "T1589.001": {
        "name": "Gather Victim Identity: Credentials",
        "description": "Adversaries gather credentials that can be used during targeting.",
        "tactic": "Reconnaissance",
    },
}

# ============================================================
# Severity Thresholds for threat scores
# ============================================================
SEVERITY_THRESHOLDS = {
    "Low": (0, 25),
    "Medium": (26, 50),
    "High": (51, 75),
    "Critical": (76, 100),
}

# ============================================================
# Spoofed Domain Patterns (common brand impersonation)
# ============================================================
COMMONLY_SPOOFED_BRANDS = [
    "paypal", "apple", "microsoft", "google", "amazon",
    "netflix", "facebook", "instagram", "twitter", "linkedin",
    "dropbox", "chase", "wellsfargo", "bankofamerica", "citibank",
    "usps", "fedex", "ups", "dhl", "irs",
    "walmart", "ebay", "adobe", "zoom", "slack",
]

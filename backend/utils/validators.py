"""
PhishGuard - Input Validators
Validation utilities for user input, files, and API data.
"""

import re
from config import Config


def validate_email(email):
    """Validate email address format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_username(username):
    """Validate username: 3-30 chars, alphanumeric and underscores."""
    pattern = r'^[a-zA-Z0-9_]{3,30}$'
    return bool(re.match(pattern, username))


def validate_password(password):
    """
    Validate password strength.
    Requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit.
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit"
    return True, "Password is valid"


def validate_file_extension(filename):
    """Check if uploaded file has an allowed extension."""
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in Config.ALLOWED_EXTENSIONS


def sanitize_filename(filename):
    """Sanitize filename to prevent directory traversal attacks."""
    # Remove directory separators and null bytes
    filename = filename.replace('/', '').replace('\\', '').replace('\x00', '')
    # Remove leading dots
    filename = filename.lstrip('.')
    # Only keep safe characters
    filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    return filename or 'unnamed_file'

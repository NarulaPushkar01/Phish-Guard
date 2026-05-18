"""
PhishGuard - Logger Module
Configures structured logging for the application.
"""

import logging
import sys
from datetime import datetime

# Create custom logger
logger = logging.getLogger("phishguard")
logger.setLevel(logging.DEBUG)

# Console handler with colored output
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.DEBUG)

# Log format
formatter = logging.Formatter(
    "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
console_handler.setFormatter(formatter)

# Add handler (avoid duplicates)
if not logger.handlers:
    logger.addHandler(console_handler)

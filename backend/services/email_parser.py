"""
PhishGuard - Email Parser Service
Parses .eml and .txt files to extract headers, body, URLs, and attachments.
"""

import email
from email import policy
from email.parser import BytesParser
import re
import base64
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from utils.logger import logger


class EmailParser:
    def __init__(self, file_path=None, content=None):
        """
        Initialize parser with either a file path or raw content bytes.
        """
        self.msg = None
        self.headers = {}
        self.body_text = ""
        self.body_html = ""
        self.urls = set()
        self.attachments = []
        self.ips = set()
        self.email_addresses = set()
        
        try:
            if file_path:
                with open(file_path, 'rb') as f:
                    self.msg = BytesParser(policy=policy.default).parse(f)
            elif content:
                self.msg = BytesParser(policy=policy.default).parsebytes(content)
            else:
                raise ValueError("Either file_path or content must be provided.")
        except Exception as e:
            logger.error(f"Failed to parse email: {e}")
            raise

    def parse(self):
        """Perform full parsing and return extracted data."""
        self._extract_headers()
        self._extract_body_and_attachments()
        self._extract_urls()
        self._extract_ips_from_headers()
        self._extract_email_addresses()
        
        return {
            "headers": self.headers,
            "body": {
                "text": self.body_text,
                "html": self.body_html
            },
            "urls": list(self.urls),
            "attachments": self.attachments,
            "ips": list(self.ips),
            "email_addresses": list(self.email_addresses),
            "auth_results": self._parse_auth_results()
        }

    def _extract_headers(self):
        """Extract all interesting headers."""
        important_headers = [
            'From', 'To', 'Subject', 'Date', 'Message-ID', 'Return-Path',
            'Reply-To', 'X-Originating-IP', 'Received', 'Authentication-Results',
            'Received-SPF', 'DKIM-Signature'
        ]
        
        for key, value in self.msg.items():
            key_lower = key.lower()
            if key in important_headers or key_lower in [h.lower() for h in important_headers]:
                if key not in self.headers:
                    self.headers[key] = []
                self.headers[key].append(str(value))
                
        # Simplify single-value headers
        for key in ['From', 'To', 'Subject', 'Date', 'Message-ID', 'Return-Path']:
            if key in self.headers and len(self.headers[key]) == 1:
                self.headers[key] = self.headers[key][0]

    def _extract_body_and_attachments(self):
        """Walk through email parts to extract body content and attachments."""
        for part in self.msg.walk():
            # Skip multipart container
            if part.is_multipart():
                continue

            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))

            # Handle attachments
            if "attachment" in content_disposition or "inline" in content_disposition and part.get_filename():
                filename = part.get_filename()
                if filename:
                    payload = part.get_payload(decode=True)
                    size = len(payload) if payload else 0
                    self.attachments.append({
                        "filename": filename,
                        "content_type": content_type,
                        "size": size,
                        "suspicious": self._is_suspicious_attachment(filename)
                    })
                continue

            # Handle body
            try:
                payload = part.get_payload(decode=True)
                if not payload:
                    continue
                    
                charset = part.get_content_charset() or 'utf-8'
                text = payload.decode(charset, errors='replace')
                
                if content_type == "text/plain":
                    self.body_text += text + "\n"
                elif content_type == "text/html":
                    self.body_html += text + "\n"
                    # Also extract text from HTML for better analysis
                    soup = BeautifulSoup(text, 'html.parser')
                    self.body_text += soup.get_text() + "\n"
            except Exception as e:
                logger.warning(f"Error extracting body part: {e}")

    def _extract_urls(self):
        """Extract URLs from body text and HTML."""
        # Regex for URLs
        url_pattern = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[/\w.-]*\??[\w=&.-]*'
        
        # From plain text
        self.urls.update(re.findall(url_pattern, self.body_text))
        
        # From HTML hrefs
        if self.body_html:
            try:
                soup = BeautifulSoup(self.body_html, 'html.parser')
                for a_tag in soup.find_all('a', href=True):
                    href = a_tag['href']
                    if href.startswith('http'):
                        self.urls.add(href)
            except Exception:
                pass

    def _extract_ips_from_headers(self):
        """Extract IPs from Received and X-Originating-IP headers."""
        ip_pattern = r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
        
        # From Received headers
        if 'Received' in self.headers:
            for received in self.headers['Received']:
                ips = re.findall(ip_pattern, received)
                # Filter out internal IPs (10.x.x.x, 192.168.x.x, 127.x.x.x)
                for ip in ips:
                    if not (ip.startswith('10.') or ip.startswith('192.168.') or ip.startswith('127.')):
                        self.ips.add(ip)
                        
        # From X-Originating-IP
        if 'X-Originating-IP' in self.headers:
            val = self.headers['X-Originating-IP']
            if isinstance(val, list):
                val = str(val[0])
            ips = re.findall(ip_pattern, val)
            self.ips.update(ips)

    def _extract_email_addresses(self):
        """Extract email addresses from headers and body."""
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        
        # From Headers
        for key in ['From', 'To', 'Reply-To', 'Return-Path']:
            if key in self.headers:
                val = self.headers[key]
                if isinstance(val, list):
                    val = " ".join(str(x) for x in val)
                elif val is None:
                    val = ""
                self.email_addresses.update(re.findall(email_pattern, str(val)))
                
        # From Body
        self.email_addresses.update(re.findall(email_pattern, self.body_text))

    def _parse_auth_results(self):
        """Extract SPF, DKIM, DMARC results if present."""
        auth_data = {
            "spf": "neutral",
            "dkim": "neutral",
            "dmarc": "neutral"
        }
        
        auth_headers = self.headers.get('Authentication-Results', [])
        if isinstance(auth_headers, str):
            auth_headers = [auth_headers]
            
        for header in auth_headers:
            header_lower = header.lower()
            if 'spf=pass' in header_lower: auth_data['spf'] = 'pass'
            elif 'spf=fail' in header_lower or 'spf=softfail' in header_lower: auth_data['spf'] = 'fail'
            
            if 'dkim=pass' in header_lower: auth_data['dkim'] = 'pass'
            elif 'dkim=fail' in header_lower: auth_data['dkim'] = 'fail'
            
            if 'dmarc=pass' in header_lower: auth_data['dmarc'] = 'pass'
            elif 'dmarc=fail' in header_lower: auth_data['dmarc'] = 'fail'
            
        return auth_data

    def _is_suspicious_attachment(self, filename):
        """Check if attachment extension is in the dangerous list."""
        from utils.constants import DANGEROUS_EXTENSIONS
        if '.' not in filename:
            return False
        ext = '.' + filename.rsplit('.', 1)[-1].lower()
        return ext in DANGEROUS_EXTENSIONS

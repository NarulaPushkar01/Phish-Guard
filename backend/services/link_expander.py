"""
PhishGuard - Link Expander Service
Follows shortened URLs to reveal their final destination.
"""

import requests
from utils.logger import logger


class LinkExpander:
    KNOWN_SHORTENERS = [
        "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly",
        "is.gd", "buff.ly", "rebrand.ly", "cutt.ly", "shorte.st",
        "tiny.cc", "shorturl.at", "rb.gy"
    ]

    @staticmethod
    def expand(url):
        """Expand a shortened URL and return the redirect chain."""
        url = url.strip()
        if not url.startswith("http"):
            url = "https://" + url

        result = {
            "original_url": url,
            "final_url": None,
            "redirect_chain": [],
            "is_shortened": False,
            "total_redirects": 0,
            "status_code": None,
            "error": None
        }

        # Check if it's a known shortener
        from urllib.parse import urlparse
        parsed = urlparse(url)
        hostname = parsed.hostname or ""
        result["is_shortened"] = any(s in hostname for s in LinkExpander.KNOWN_SHORTENERS)

        try:
            session = requests.Session()
            response = session.head(
                url,
                allow_redirects=True,
                timeout=10,
                headers={"User-Agent": "PhishGuard Security Scanner/1.0"}
            )

            # Collect redirect chain
            chain = []
            for resp in response.history:
                chain.append({
                    "url": resp.url,
                    "status_code": resp.status_code
                })
            chain.append({
                "url": response.url,
                "status_code": response.status_code
            })

            result["redirect_chain"] = chain
            result["final_url"] = response.url
            result["total_redirects"] = len(response.history)
            result["status_code"] = response.status_code

        except requests.exceptions.ConnectionError:
            result["error"] = "Could not connect to URL — may be offline or blocked"
        except requests.exceptions.Timeout:
            result["error"] = "Request timed out"
        except requests.exceptions.TooManyRedirects:
            result["error"] = "Too many redirects — possible redirect loop"
        except Exception as e:
            logger.error(f"Link expansion error for {url}: {e}")
            result["error"] = str(e)

        return result

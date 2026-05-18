"""
PhishGuard - DNS Lookup Service
Resolves DNS records (A, MX, NS, TXT, CNAME) for any domain.
"""

import socket
from utils.logger import logger


class DNSLookup:
    @staticmethod
    def lookup(domain):
        """Perform DNS lookup for a domain."""
        domain = domain.strip().lower()
        if domain.startswith("https://"):
            domain = domain[8:]
        if domain.startswith("http://"):
            domain = domain[7:]
        domain = domain.split("/")[0]
        domain = domain.split(":")[0]

        result = {
            "domain": domain,
            "records": {},
            "error": None
        }

        try:
            import dns.resolver
            resolver = dns.resolver.Resolver()
            resolver.timeout = 5
            resolver.lifetime = 5

            record_types = ["A", "MX", "NS", "TXT", "CNAME", "AAAA"]
            for rtype in record_types:
                try:
                    answers = resolver.resolve(domain, rtype)
                    records = []
                    for rdata in answers:
                        if rtype == "MX":
                            records.append({
                                "priority": rdata.preference,
                                "value": str(rdata.exchange)
                            })
                        else:
                            records.append(str(rdata))
                    if records:
                        result["records"][rtype] = records
                except dns.resolver.NoAnswer:
                    pass
                except dns.resolver.NXDOMAIN:
                    result["error"] = f"Domain '{domain}' does not exist"
                    return result
                except dns.resolver.NoNameservers:
                    pass
                except Exception:
                    pass

        except ImportError:
            # Fallback to basic socket lookup if dnspython not installed
            try:
                ips = socket.getaddrinfo(domain, None)
                a_records = list(set(ip[4][0] for ip in ips if ip[0] == socket.AF_INET))
                aaaa_records = list(set(ip[4][0] for ip in ips if ip[0] == socket.AF_INET6))
                if a_records:
                    result["records"]["A"] = a_records
                if aaaa_records:
                    result["records"]["AAAA"] = aaaa_records
                result["records"]["_note"] = ["Limited results — install dnspython for full DNS resolution"]
            except socket.gaierror:
                result["error"] = f"Domain '{domain}' could not be resolved"
        except Exception as e:
            logger.error(f"DNS lookup error for {domain}: {e}")
            result["error"] = str(e)

        return result

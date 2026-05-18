import sys
import os
import traceback

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.services.email_parser import EmailParser
from backend.services.threat_engine import ThreatEngine
from backend.services.ioc_extractor import IOCExtractor
from backend.services.threat_scorer import ThreatScorer

def test_parse():
    file_path = os.path.join('backend', 'sample_emails', 'Sample2.eml')
    with open(file_path, 'rb') as f:
        file_content = f.read()

    try:
        print("Parsing email...")
        parser = EmailParser(content=file_content)
        parsed_data = parser.parse()
        print("Parsed Data:", parsed_data.keys())

        print("Running threat engine...")
        engine = ThreatEngine()
        threat_data = {
            "url_analysis": engine.analyze_urls(parsed_data["urls"]),
            "ip_analysis": engine.analyze_ips(parsed_data["ips"]),
            "content_analysis": engine.analyze_content(
                parsed_data["body"]["text"], 
                parsed_data["headers"].get("Subject", "")
            ),
            "spoofing": engine.detect_spoofing(parsed_data["headers"])
        }
        print("Threat Data:", threat_data.keys())

        print("Extracting IOCs...")
        iocs, mitre = IOCExtractor.extract_iocs(parsed_data, threat_data)

        print("Calculating score...")
        scoring_results = ThreatScorer.calculate_score(parsed_data, threat_data)
        
        print("SUCCESS! Score:", scoring_results['score'])
    except Exception as e:
        print("FAILED!")
        traceback.print_exc()

if __name__ == "__main__":
    test_parse()

"""
PhishGuard - PDF Generator Service
Generates professional PDF security reports from analysis data.
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
import os
from config import Config
from datetime import datetime

class PDFGenerator:
    def __init__(self):
        self.output_dir = Config.REPORTS_FOLDER
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def generate_report(self, analysis_data):
        """Generate PDF report and return the file path."""
        # Setup file
        filename = f"phishguard_report_{analysis_data['_id']}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = SimpleDocTemplate(
            filepath,
            pagesize=letter,
            rightMargin=72, leftMargin=72,
            topMargin=72, bottomMargin=18
        )
        
        Story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.HexColor('#2c3e50')
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            spaceBefore=20,
            spaceAfter=10,
            textColor=colors.HexColor('#2980b9')
        )
        
        # 1. Header/Title
        Story.append(Paragraph("🛡️ PhishGuard Security Report", title_style))
        Story.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles["Normal"]))
        Story.append(Spacer(1, 0.2 * inch))
        
        # 2. Executive Summary
        Story.append(Paragraph("Executive Summary", heading_style))
        summary_text = (
            f"File Analyzed: {analysis_data.get('filename', 'Unknown')}<br/>"
            f"Threat Score: {analysis_data.get('threat_score', 0)}/100<br/>"
            f"Severity: <b>{analysis_data.get('severity', 'Unknown')}</b>"
        )
        Story.append(Paragraph(summary_text, styles["Normal"]))
        Story.append(Spacer(1, 0.2 * inch))
        
        # 3. Email Details
        Story.append(Paragraph("Email Details", heading_style))
        headers = analysis_data.get('headers', {})
        details = [
            ["Field", "Value"],
            ["From", str(headers.get('From', 'N/A'))[:60]],
            ["To", str(headers.get('To', 'N/A'))[:60]],
            ["Subject", str(headers.get('Subject', 'N/A'))[:60]],
            ["Date", str(headers.get('Date', 'N/A'))[:60]]
        ]
        t = Table(details, colWidths=[1.5*inch, 4.5*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (1,0), colors.HexColor('#ecf0f1')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.black),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.white),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#bdc3c7'))
        ]))
        Story.append(t)
        
        # 4. Indicators of Compromise (IOCs)
        Story.append(Paragraph("Indicators of Compromise (IOCs)", heading_style))
        iocs = analysis_data.get('iocs', {})
        
        # URLs
        if iocs.get('urls'):
            Story.append(Paragraph("Suspicious URLs Found:", styles["Normal"]))
            for url in iocs['urls'][:10]: # Limit to 10 for PDF
                Story.append(Paragraph(f"• {url[:80]}{'...' if len(url)>80 else ''}", styles["Normal"]))
                
        # IPs
        if iocs.get('ips'):
            Story.append(Spacer(1, 0.1 * inch))
            Story.append(Paragraph("IP Addresses Found:", styles["Normal"]))
            for ip in iocs['ips'][:10]:
                Story.append(Paragraph(f"• {ip}", styles["Normal"]))
                
        # 5. MITRE ATT&CK Mappings
        if analysis_data.get('mitre_techniques'):
            Story.append(Paragraph("MITRE ATT&CK Mappings", heading_style))
            for tech in analysis_data['mitre_techniques']:
                Story.append(Paragraph(f"• <b>{tech['name']}</b> ({tech['tactic']})", styles["Normal"]))

        # Build PDF
        try:
            doc.build(Story)
            return filepath, filename
        except Exception as e:
            from utils.logger import logger
            logger.error(f"Error building PDF: {e}")
            raise

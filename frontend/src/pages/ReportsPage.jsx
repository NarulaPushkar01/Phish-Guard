import React, { useState, useEffect } from 'react';
import { FileText, Download, Shield, AlertTriangle } from 'lucide-react';
import { reportService } from '../api/endpoints';
import GlassCard from '../components/common/GlassCard';
import ThreatBadge from '../components/common/ThreatBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getReports(1, 50); // Get up to 50 for now
      setReports(res.data.reports);
    } catch (err) {
      setError('Failed to fetch reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId, filename) => {
    setDownloadingId(reportId);
    try {
      const res = await reportService.downloadReport(reportId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to download report.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <FileText className="text-cyber-cyan" />
            Security Reports
          </h1>
          <p className="text-gray-400 text-sm mt-1">Generated PDF reports of email analyses.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3 text-red-400">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <GlassCard className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">No Reports Generated</h2>
          <p className="text-gray-400">Analyze an email and click "Generate Report" to create one.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <GlassCard key={report._id} className="flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded bg-cyber-900 border border-white/10">
                  <FileText className="text-cyber-neon w-6 h-6" />
                </div>
                <ThreatBadge severity={report.severity} score={report.threat_score} />
              </div>
              
              <h3 className="font-medium text-white mb-2 truncate" title={report.filename}>
                {report.filename}
              </h3>
              
              <p className="text-xs text-gray-500 font-mono mb-6">
                Generated: {new Date(report.created_at).toLocaleString()}
              </p>
              
              <div className="mt-auto pt-4 border-t border-white/5">
                <button
                  onClick={() => handleDownload(report._id, report.filename)}
                  disabled={downloadingId === report._id}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors disabled:opacity-50"
                >
                  {downloadingId === report._id ? (
                    <span className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Download size={16} />
                  )}
                  <span className="font-medium text-sm">Download PDF</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

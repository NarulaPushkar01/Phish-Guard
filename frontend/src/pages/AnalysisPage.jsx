import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, FileText, Download } from 'lucide-react';
import { analysisService, reportService } from '../api/endpoints';
import FileUpload from '../components/common/FileUpload';
import ThreatScore from '../components/analysis/ThreatScore';
import HeaderAnalysis from '../components/analysis/HeaderAnalysis';
import URLAnalysis from '../components/analysis/URLAnalysis';
import IOCPanel from '../components/analysis/IOCPanel';
import GlassCard from '../components/common/GlassCard';

const AnalysisPage = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState('');
  
  // Check if we navigated here with an ID to view an existing analysis
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idToLoad = queryParams.get('id');

  useEffect(() => {
    if (idToLoad) {
      loadAnalysis(idToLoad);
    }
  }, [idToLoad]);

  const loadAnalysis = async (id) => {
    setIsLoading(true);
    try {
      const res = await analysisService.getAnalysis(id);
      setAnalysisData(res.data.analysis);
    } catch (err) {
      setError('Failed to load analysis data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await analysisService.uploadEmail(formData);
      setAnalysisData(res.data.results);
      // Optional: Update URL without reloading to reflect the new ID
      window.history.replaceState(null, '', `/analysis?id=${res.data.analysis_id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!analysisData || !analysisData._id) return;
    
    setIsGeneratingReport(true);
    try {
      // First generate/get report metadata
      const res = await reportService.generateReport(analysisData._id);
      const reportId = res.data.report._id;
      
      // Then download the PDF
      const blobRes = await reportService.downloadReport(reportId);
      
      // Create a link to download the blob
      const url = window.URL.createObjectURL(new Blob([blobRes.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', res.data.report.filename || 'report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to generate report.');
      console.error(err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
    setError('');
    window.history.replaceState(null, '', '/analysis');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <Shield className="text-cyber-neon" />
            Email Analysis Engine
          </h1>
          <p className="text-gray-400 text-sm mt-1">Upload files for deep static analysis and threat scoring.</p>
        </div>
        
        {analysisData && (
          <div className="flex gap-3">
            <button 
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="btn-neon flex items-center gap-2"
            >
              {isGeneratingReport ? (
                <span className="w-4 h-4 border-2 border-cyber-neon border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Download size={16} />
              )}
              PDF Report
            </button>
            <button 
              onClick={resetAnalysis}
              className="bg-cyber-800 text-white border border-white/20 px-4 py-2 rounded hover:bg-cyber-700 transition-colors"
            >
              New Scan
            </button>
          </div>
        )}
      </div>

      {!analysisData ? (
        <div className="max-w-3xl mx-auto mt-12">
          <GlassCard animate={true}>
            <FileUpload onUpload={handleUpload} isLoading={isLoading} />
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </GlassCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Score & Details */}
          <div className="space-y-6">
            <GlassCard className="flex justify-center">
              <ThreatScore score={analysisData.threat_score} severity={analysisData.severity} />
            </GlassCard>
            
            <GlassCard>
              <h3 className="text-lg font-bold font-mono text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <FileText className="text-cyber-cyan" size={20} />
                File Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Filename</span>
                  <span className="text-white truncate max-w-[200px]" title={analysisData.filename}>{analysisData.filename}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Scan Date</span>
                  <span className="text-white">{new Date(analysisData.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Attachments</span>
                  <span className="text-white">{analysisData.attachments?.length || 0}</span>
                </div>
              </div>
            </GlassCard>

            <IOCPanel iocs={analysisData.iocs} mitre={analysisData.mitre_techniques} />
          </div>

          {/* Right Column: Deep Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <HeaderAnalysis headers={analysisData.headers} spoofing={analysisData.threat_details?.spoofing_penalty > 0 ? {is_spoofed: true} : null} />
            <URLAnalysis urls={analysisData.url_analysis} threatScore={analysisData.threat_score} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;

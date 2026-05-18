import React from 'react';
import { Link2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

const URLAnalysis = ({ urls, threatScore }) => {
  if (!urls || urls.length === 0) return null;

  return (
    <div className="bg-cyber-900/50 rounded-xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-cyber-800/30">
        <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
          <Link2 className="text-cyber-cyan" size={20} />
          URL Analysis ({urls.length})
        </h3>
      </div>
      
      <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
        {urls.map((urlData, idx) => {
          let derivedStatus = urlData.status;
          
          if (threatScore !== undefined) {
             if (threatScore >= 80) derivedStatus = "MALICIOUS";
             else if (threatScore >= 60) derivedStatus = "PHISHING DETECTED";
             else if (threatScore >= 40) derivedStatus = "SUSPICIOUS";
             else derivedStatus = "SAFE";
          }
          
          const isMalicious = derivedStatus === 'MALICIOUS' || derivedStatus === 'malicious';
          const isPhishing = derivedStatus === 'PHISHING DETECTED';
          const isSuspicious = derivedStatus === 'SUSPICIOUS' || derivedStatus === 'suspicious';
          const isSafe = derivedStatus === 'SAFE' || derivedStatus === 'clean';
          
          let StatusIcon = HelpCircle;
          let statusColor = 'text-gray-500';
          let statusBg = 'bg-gray-500/10 border-gray-500/30';
          
          if (isMalicious) {
            StatusIcon = AlertTriangle;
            statusColor = 'text-red-500';
            statusBg = 'bg-red-500/10 border-red-500/30';
          } else if (isPhishing) {
            StatusIcon = AlertTriangle;
            statusColor = 'text-orange-500';
            statusBg = 'bg-orange-500/10 border-orange-500/30';
          } else if (isSuspicious) {
            StatusIcon = AlertTriangle;
            statusColor = 'text-yellow-500';
            statusBg = 'bg-yellow-500/10 border-yellow-500/30';
          } else if (isSafe) {
            StatusIcon = ShieldCheck;
            statusColor = 'text-cyber-neon';
            statusBg = 'bg-cyber-neon/10 border-cyber-neon/30';
          }

          return (
            <div key={idx} className="p-4 hover:bg-cyber-800/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 font-mono text-sm break-all mb-2">{urlData.url}</p>
                  <div className="flex flex-wrap gap-2">
                    {urlData.is_shortened && (
                      <span className="text-[10px] px-2 py-0.5 rounded border border-yellow-500/30 text-yellow-500 bg-yellow-500/10">
                        SHORTENED URL
                      </span>
                    )}
                    {urlData.suspicious_tld && (
                      <span className="text-[10px] px-2 py-0.5 rounded border border-orange-500/30 text-orange-500 bg-orange-500/10">
                        SUSPICIOUS TLD
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase border ${statusBg} ${statusColor}`}>
                    <StatusIcon size={14} />
                    {derivedStatus.toUpperCase()}
                  </div>
                  
                  {urlData.vt_results && (
                    <div className="text-[10px] font-mono text-gray-500 flex gap-2">
                      <span className="text-red-400" title="Malicious">M:{urlData.vt_results.malicious || 0}</span>
                      <span className="text-yellow-400" title="Suspicious">S:{urlData.vt_results.suspicious || 0}</span>
                      <span className="text-cyber-neon" title="Harmless">C:{urlData.vt_results.harmless || 0}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default URLAnalysis;

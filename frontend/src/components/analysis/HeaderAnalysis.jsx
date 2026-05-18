import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderRow = ({ label, value, suspicious = false }) => (
  <div className={`grid grid-cols-1 md:grid-cols-4 gap-2 py-3 border-b border-white/5 ${suspicious ? 'bg-red-500/5' : ''}`}>
    <div className="text-gray-400 font-mono text-sm">{label}</div>
    <div className={`md:col-span-3 font-mono text-sm break-all ${suspicious ? 'text-red-400' : 'text-gray-200'}`}>
      {value || 'N/A'}
    </div>
  </div>
);

const HeaderAnalysis = ({ headers, spoofing }) => {
  const [expanded, setExpanded] = useState(false);

  if (!headers) return null;

  return (
    <div className="bg-cyber-900/50 rounded-xl border border-white/5 overflow-hidden">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-cyber-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
          Email Headers
          {spoofing?.is_spoofed && (
            <span className="flex items-center text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-500 border border-red-500/30">
              <AlertTriangle size={12} className="mr-1" />
              SPOOFING DETECTED
            </span>
          )}
        </h3>
        {expanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-white/5">
              
              {/* Security Warnings */}
              {spoofing?.is_spoofed && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-bold mb-2 flex items-center text-sm">
                    <AlertTriangle size={16} className="mr-2" />
                    Header Anomalies Detected
                  </h4>
                  <ul className="list-disc list-inside text-xs text-red-300 space-y-1 ml-6">
                    {spoofing.mismatched_return_path && <li>Return-Path domain does not match From domain</li>}
                    {spoofing.mismatched_reply_to && <li>Reply-To domain differs from sender domain</li>}
                    {spoofing.brand_impersonation && <li>Possible impersonation of: {spoofing.brand_impersonation}</li>}
                  </ul>
                </div>
              )}

              {/* Core Headers */}
              <div className="mb-4">
                <HeaderRow label="From" value={headers['From']} suspicious={spoofing?.is_spoofed} />
                <HeaderRow label="To" value={headers['To']} />
                <HeaderRow label="Subject" value={headers['Subject']} />
                <HeaderRow label="Date" value={headers['Date']} />
                <HeaderRow label="Message-ID" value={headers['Message-ID']} />
                <HeaderRow label="Return-Path" value={headers['Return-Path']} suspicious={spoofing?.mismatched_return_path} />
                <HeaderRow label="Reply-To" value={headers['Reply-To']} suspicious={spoofing?.mismatched_reply_to} />
              </div>

              {/* Advanced Headers (if any) */}
              {headers['Received'] && (
                <div className="mt-4">
                  <h4 className="text-gray-400 font-mono text-sm mb-2">Received Chain</h4>
                  <div className="bg-cyber-950 p-3 rounded border border-white/5 overflow-x-auto">
                    {Array.isArray(headers['Received']) 
                      ? headers['Received'].map((r, i) => (
                          <div key={i} className="text-xs font-mono text-gray-500 whitespace-pre-wrap mb-2 pb-2 border-b border-white/5 last:border-0">
                            {r}
                          </div>
                        ))
                      : <div className="text-xs font-mono text-gray-500 whitespace-pre-wrap">{headers['Received']}</div>
                    }
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderAnalysis;

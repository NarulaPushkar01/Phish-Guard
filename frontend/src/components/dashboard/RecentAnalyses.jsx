import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Clock } from 'lucide-react';
import ThreatBadge from '../common/ThreatBadge';

const RecentAnalyses = ({ analyses, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel p-6 animate-pulse">
        <div className="h-6 w-48 bg-cyber-700 rounded mb-6"></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-white/5">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-cyber-700 rounded"></div>
              <div>
                <div className="h-4 w-32 bg-cyber-700 rounded mb-2"></div>
                <div className="h-3 w-24 bg-cyber-700 rounded"></div>
              </div>
            </div>
            <div className="h-6 w-20 bg-cyber-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <div className="glass-panel p-6 text-center py-12">
        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Analysis History</h3>
        <p className="text-gray-400 mb-6 text-sm">You haven't analyzed any emails yet.</p>
        <Link to="/analysis" className="btn-neon">Start New Analysis</Link>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-cyber-900/50">
        <h3 className="text-lg font-bold font-mono text-white flex items-center">
          <Clock className="w-5 h-5 mr-2 text-cyber-cyan" />
          Recent Analyses
        </h3>
        <Link to="/reports" className="text-sm text-cyber-cyan hover:text-cyber-neon transition-colors flex items-center">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-cyber-800/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider">Subject / Filename</th>
              <th className="px-6 py-4 font-medium tracking-wider">Sender</th>
              <th className="px-6 py-4 font-medium tracking-wider text-center">Threat Score</th>
              <th className="px-6 py-4 font-medium tracking-wider">Severity</th>
              <th className="px-6 py-4 font-medium tracking-wider">Date</th>
              <th className="px-6 py-4 font-medium tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {analyses.map((analysis) => {
              const date = new Date(analysis.created_at);
              const subject = analysis.headers?.Subject || analysis.filename;
              const sender = analysis.headers?.From || 'Unknown Sender';
              
              return (
                <tr key={analysis._id} className="hover:bg-cyber-800/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white truncate max-w-xs" title={subject}>
                      {subject}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 truncate max-w-[200px]" title={sender}>
                    {sender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`font-mono font-bold ${
                      analysis.threat_score >= 75 ? 'text-red-500' :
                      analysis.threat_score >= 50 ? 'text-orange-500' :
                      analysis.threat_score >= 25 ? 'text-yellow-500' :
                      'text-cyber-neon'
                    }`}>
                      {analysis.threat_score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ThreatBadge severity={analysis.severity} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">
                    {date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link 
                      to={`/analysis?id=${analysis._id}`}
                      className="text-cyber-cyan hover:text-cyber-neon font-medium transition-colors opacity-0 group-hover:opacity-100"
                    >
                      View Report
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAnalyses;

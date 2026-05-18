import React, { useState } from 'react';
import { Search, Globe, Server, Shield, AlertTriangle, ShieldCheck } from 'lucide-react';
import { threatService } from '../api/endpoints';
import GlassCard from '../components/common/GlassCard';

const ThreatIntelPage = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('url'); // 'url' or 'ip'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError('');
    setResult(null);

    if (type === 'ip') {
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      if (!ipRegex.test(query.trim())) {
        setError('Invalid IP address format. Please enter a valid IPv4 address.');
        setLoading(false);
        return;
      }
    }

    try {
      let res;
      if (type === 'url') {
        res = await threatService.checkUrl(query);
      } else {
        res = await threatService.checkIp(query);
      }
      setResult(res.data.result);
    } catch (err) {
      setError('Failed to fetch intelligence data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ResultCard = () => {
    if (!result) return null;

    const isMalicious = result.status === 'malicious';
    const isSuspicious = result.status === 'suspicious';
    
    let StatusIcon = ShieldCheck;
    let statusColor = 'text-cyber-neon';
    let borderColor = 'border-cyber-neon/30';
    
    if (isMalicious) {
      StatusIcon = AlertTriangle;
      statusColor = 'text-red-500';
      borderColor = 'border-red-500/50';
    } else if (isSuspicious) {
      StatusIcon = AlertTriangle;
      statusColor = 'text-yellow-500';
      borderColor = 'border-yellow-500/50';
    }

    return (
      <GlassCard className={`mt-8 border-2 ${borderColor}`}>
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full bg-cyber-900 border ${borderColor}`}>
              <StatusIcon className={`w-8 h-8 ${statusColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">{query}</h2>
              <p className={`text-sm font-bold uppercase tracking-wider ${statusColor}`}>
                {result.status}
              </p>
            </div>
          </div>
        </div>

        {type === 'url' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-400 text-sm font-mono mb-2">VirusTotal Statistics</h3>
              {result.vt_results ? (
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-cyber-900 rounded">
                    <span className="text-red-400">Malicious</span>
                    <span className="font-mono text-white">{result.vt_results.malicious || 0}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-cyber-900 rounded">
                    <span className="text-yellow-400">Suspicious</span>
                    <span className="font-mono text-white">{result.vt_results.suspicious || 0}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-cyber-900 rounded">
                    <span className="text-cyber-neon">Harmless</span>
                    <span className="font-mono text-white">{result.vt_results.harmless || 0}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-cyber-900 rounded">
                    <span className="text-gray-400">Undetected</span>
                    <span className="font-mono text-white">{result.vt_results.undetected || 0}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No VirusTotal data available.</p>
              )}
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-mono mb-2">Heuristic Checks</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-cyber-900 rounded">
                  <span className="text-gray-300">URL Shortener Detected</span>
                  <span className={`font-mono ${result.is_shortened ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {result.is_shortened ? 'YES' : 'NO'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-cyber-900 rounded">
                  <span className="text-gray-300">Suspicious TLD</span>
                  <span className={`font-mono ${result.suspicious_tld ? 'text-orange-400' : 'text-gray-500'}`}>
                    {result.suspicious_tld ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-400 text-sm font-mono mb-2">AbuseIPDB Data</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-cyber-900 rounded">
                  <span className="text-gray-300">Confidence Score</span>
                  <span className={`font-mono font-bold ${result.abuse_score > 50 ? 'text-red-500' : 'text-cyber-neon'}`}>
                    {result.abuse_score}%
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-cyber-900 rounded">
                  <span className="text-gray-300">ISP</span>
                  <span className="font-mono text-white">{result.isp || 'Unknown'}</span>
                </div>
                <div className="flex justify-between p-2 bg-cyber-900 rounded">
                  <span className="text-gray-300">Country Code</span>
                  <span className="font-mono text-white">{result.country || 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
          <Globe className="text-cyber-cyan" />
          Threat Intelligence
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manual lookup for IP addresses and URLs against integrated intelligence sources.</p>
      </div>

      <GlassCard>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="input-field md:w-32 bg-cyber-900 font-mono text-sm"
          >
            <option value="url">URL</option>
            <option value="ip">IP Address</option>
          </select>
          
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {type === 'url' ? <Globe className="h-5 w-5 text-gray-500" /> : <Server className="h-5 w-5 text-gray-500" />}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={type === 'url' ? 'Enter suspicious URL (e.g., http://bit.ly/...)' : 'Enter IP address (e.g., 192.168.1.1)'}
              className="input-field pl-10"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !query}
            className="btn-primary flex items-center justify-center gap-2 md:w-48"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Search size={18} />
                Lookup Indicator
              </>
            )}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </GlassCard>

      <ResultCard />
    </div>
  );
};

export default ThreatIntelPage;

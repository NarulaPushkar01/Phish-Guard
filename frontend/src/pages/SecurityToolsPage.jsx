import React, { useState } from 'react';
import { Shield, Server, Link as LinkIcon, Globe, Key, Search, AlertTriangle, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { toolsService } from '../api/endpoints';
import GlassCard from '../components/common/GlassCard';

const SecurityToolsPage = () => {
  const [activeTab, setActiveTab] = useState('ssl');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const tools = [
    { id: 'ssl', icon: Lock, name: 'SSL Checker', placeholder: 'Enter domain (e.g., example.com)' },
    { id: 'dns', icon: Server, name: 'DNS Lookup', placeholder: 'Enter domain (e.g., example.com)' },
    { id: 'expand', icon: LinkIcon, name: 'Link Expander', placeholder: 'Enter short URL (e.g., bit.ly/...)' },
    { id: 'whois', icon: Globe, name: 'WHOIS / Age', placeholder: 'Enter domain (e.g., example.com)' },
    { id: 'password', icon: Key, name: 'Password Breach', placeholder: 'Enter password to check' }
  ];

  const handleTabChange = (id) => {
    setActiveTab(id);
    setQuery('');
    setResult(null);
    setError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let res;
      switch (activeTab) {
        case 'ssl':
          res = await toolsService.sslCheck(query);
          break;
        case 'dns':
          res = await toolsService.dnsLookup(query);
          break;
        case 'expand':
          res = await toolsService.expandLink(query);
          break;
        case 'whois':
          res = await toolsService.whoisLookup(query);
          break;
        case 'password':
          res = await toolsService.passwordCheck(query);
          break;
        default:
          throw new Error('Unknown tool');
      }
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.error) {
      return (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 flex items-start gap-3">
          <AlertTriangle className="flex-shrink-0 mt-0.5" />
          <p>{result.error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'ssl':
        return (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6">
              {result.valid && !result.is_expired ? (
                <ShieldCheck className="text-cyber-neon w-8 h-8" />
              ) : (
                <AlertTriangle className="text-red-500 w-8 h-8" />
              )}
              <h3 className="text-xl font-bold font-mono text-white">SSL Certificate Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyber-900 p-4 rounded border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Domain</p>
                <p className="text-white font-mono">{result.domain}</p>
              </div>
              <div className="bg-cyber-900 p-4 rounded border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Issuer</p>
                <p className="text-white font-mono">{result.issuer}</p>
              </div>
              <div className="bg-cyber-900 p-4 rounded border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className={`font-mono font-bold ${result.valid && !result.is_expired ? 'text-cyber-neon' : 'text-red-500'}`}>
                  {result.is_expired ? 'EXPIRED' : (result.valid ? 'VALID' : 'INVALID')}
                </p>
              </div>
              <div className="bg-cyber-900 p-4 rounded border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Days Remaining</p>
                <p className={`font-mono ${result.days_remaining < 30 ? 'text-yellow-500' : 'text-cyber-neon'}`}>
                  {result.days_remaining} days
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'dns':
        return (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold font-mono text-white mb-6">DNS Records for {result.domain}</h3>
            {Object.entries(result.records).map(([type, records]) => (
              <div key={type} className="bg-cyber-900 p-4 rounded border border-white/5">
                <h4 className="text-cyber-cyan font-bold mb-2">{type} Records</h4>
                <ul className="space-y-1">
                  {records.map((r, i) => (
                    <li key={i} className="text-gray-300 font-mono text-sm break-all">
                      {typeof r === 'object' ? `${r.priority} ${r.value}` : r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'expand':
        return (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold font-mono text-white mb-6">Link Analysis</h3>
            
            <div className="bg-cyber-900 p-4 rounded border border-white/5 mb-4">
              <p className="text-gray-400 text-sm mb-1">Final Destination</p>
              <p className="text-cyber-neon font-mono break-all">{result.final_url}</p>
            </div>

            <h4 className="text-gray-400 mb-2 mt-6">Redirect Chain ({result.total_redirects} hops)</h4>
            <div className="space-y-2">
              {result.redirect_chain.map((hop, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-cyber-800/50 rounded border border-white/5">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    hop.status_code >= 400 ? 'bg-red-500/20 text-red-400' :
                    hop.status_code >= 300 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-cyber-neon/20 text-cyber-neon'
                  }`}>
                    {hop.status_code}
                  </span>
                  <span className="text-gray-300 font-mono text-sm break-all">{hop.url}</span>
                  {i < result.redirect_chain.length - 1 && (
                    <ArrowRight className="text-gray-600 hidden sm:block ml-auto" size={16} />
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'whois':
        return (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6">
              {result.is_new_domain ? (
                <AlertTriangle className="text-red-500 w-8 h-8" />
              ) : (
                <ShieldCheck className="text-cyber-neon w-8 h-8" />
              )}
              <h3 className="text-xl font-bold font-mono text-white">WHOIS Intelligence</h3>
            </div>
            
            {result.is_new_domain && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle size={16} />
                <strong>Suspicious:</strong> This domain was registered very recently ({result.domain_age_days} days ago). Phishing sites are often newly created.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyber-900 p-4 rounded border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Registrar</p>
                <p className="text-white font-mono">{result.registrar}</p>
              </div>
              <div className="bg-cyber-900 p-4 rounded border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Age</p>
                <p className={`font-mono font-bold ${result.is_new_domain ? 'text-red-500' : 'text-cyber-neon'}`}>
                  {result.domain_age_days !== null ? `${result.domain_age_days} days` : 'Unknown'}
                </p>
              </div>
              <div className="bg-cyber-900 p-4 rounded border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Creation Date</p>
                <p className="text-gray-300 font-mono">{result.creation_date ? new Date(result.creation_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="bg-cyber-900 p-4 rounded border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Country</p>
                <p className="text-gray-300 font-mono">{result.country || 'N/A'}</p>
              </div>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6">
              {result.breached ? (
                <AlertTriangle className="text-red-500 w-8 h-8" />
              ) : (
                <ShieldCheck className="text-cyber-neon w-8 h-8" />
              )}
              <h3 className="text-xl font-bold font-mono text-white">Password Status</h3>
            </div>
            
            <div className={`p-6 rounded border ${result.breached ? 'bg-red-500/10 border-red-500/30' : 'bg-cyber-neon/10 border-cyber-neon/30'} text-center mb-6`}>
              <p className={`text-2xl font-bold mb-2 ${result.breached ? 'text-red-500' : 'text-cyber-neon'}`}>
                {result.breached ? 'COMPROMISED!' : 'CLEAN'}
              </p>
              <p className="text-gray-300">
                {result.breached 
                  ? `This password has appeared in ${result.breach_count.toLocaleString()} known data breaches. Do not use it!` 
                  : "Good news! We couldn't find this password in any known data breaches."}
              </p>
            </div>

            <div className="bg-cyber-900 p-4 rounded border border-white/5">
              <h4 className="text-white font-medium mb-3">Strength Analysis</h4>
              <div className="mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  result.strength === 'weak' ? 'bg-red-500/20 text-red-500' :
                  result.strength === 'moderate' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-cyber-neon/20 text-cyber-neon'
                }`}>
                  {result.strength.replace('_', ' ')}
                </span>
              </div>
              {result.suggestions.length > 0 && (
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                  {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const activeToolConfig = tools.find(t => t.id === activeTab);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
          <Shield className="text-cyber-cyan" />
          Security Tools
        </h1>
        <p className="text-gray-400 text-sm mt-1">Standalone utilities for investigating domains, links, and credentials.</p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => handleTabChange(tool.id)}
            className={`p-3 flex flex-col items-center justify-center gap-2 rounded-lg border transition-all duration-300 ${
              activeTab === tool.id 
                ? 'bg-cyber-900 border-cyber-neon shadow-[0_0_15px_rgba(0,255,136,0.15)] text-cyber-neon' 
                : 'bg-cyber-800/40 border-white/5 text-gray-400 hover:bg-cyber-800 hover:text-white hover:border-white/20'
            }`}
          >
            <tool.icon size={20} />
            <span className="text-xs font-mono font-medium text-center">{tool.name}</span>
          </button>
        ))}
      </div>

      <GlassCard className="border-t-2 border-t-cyber-cyan">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type={activeTab === 'password' ? 'password' : 'text'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={activeToolConfig.placeholder}
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
                <activeToolConfig.icon size={18} />
                Analyze
              </>
            )}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </GlassCard>

      {/* Results Container */}
      {renderResult()}
    </div>
  );
};

export default SecurityToolsPage;

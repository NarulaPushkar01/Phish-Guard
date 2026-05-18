import React, { useState } from 'react';
import { Target, Server, Link2, Globe, Mail, Copy, Check } from 'lucide-react';

const IOCCategory = ({ title, icon: Icon, items, color }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!items || items.length === 0) return null;

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mb-6 last:mb-0">
      <h4 className={`text-sm font-bold font-mono flex items-center gap-2 mb-3 ${color}`}>
        <Icon size={16} />
        {title} ({items.length})
      </h4>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="group flex items-center justify-between bg-cyber-950 p-2 rounded border border-white/5 hover:border-white/10 transition-colors">
            <span className="font-mono text-xs text-gray-300 truncate mr-4">{item}</span>
            <button 
              onClick={() => copyToClipboard(item, idx)}
              className="text-gray-500 hover:text-white transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Copy to clipboard"
            >
              {copiedIndex === idx ? <Check size={14} className="text-cyber-neon" /> : <Copy size={14} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const IOCPanel = ({ iocs, mitre }) => {
  if (!iocs) return null;

  return (
    <div className="bg-cyber-900/50 rounded-xl border border-white/5 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-white/5 bg-cyber-800/30">
        <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
          <Target className="text-cyber-purple" size={20} />
          Extracted IOCs
        </h3>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1">
        <IOCCategory title="IP Addresses" icon={Server} items={iocs.ips} color="text-yellow-400" />
        <IOCCategory title="Domains" icon={Globe} items={iocs.domains} color="text-cyber-cyan" />
        <IOCCategory title="URLs" icon={Link2} items={iocs.urls} color="text-orange-400" />
        <IOCCategory title="Email Addresses" icon={Mail} items={iocs.email_addresses} color="text-gray-300" />
        
        {/* MITRE ATT&CK Mapping */}
        {mitre && mitre.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-sm font-bold font-mono flex items-center gap-2 mb-4 text-cyber-neon">
              <ShieldAlert size={16} /> {/* Note: Assuming imported or available contextually, actually let's use Target since ShieldAlert isn't imported here, wait I'll import it */}
              MITRE ATT&CK Mappings
            </h4>
            <div className="space-y-3">
              {mitre.map((technique, idx) => (
                <div key={idx} className="bg-cyber-800/40 p-3 rounded border border-cyber-neon/20 border-l-2 border-l-cyber-neon">
                  <p className="text-sm font-bold text-white mb-1">{technique.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-cyber-cyan">{technique.tactic}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Ensure ShieldAlert is imported
import { ShieldAlert } from 'lucide-react';

export default IOCPanel;

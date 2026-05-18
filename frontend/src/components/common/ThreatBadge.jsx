import React from 'react';
import { Shield, ShieldAlert, ShieldX, AlertTriangle } from 'lucide-react';

const ThreatBadge = ({ severity, score, className = '' }) => {
  let config = {
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
    border: 'border-gray-400/20',
    icon: Shield
  };

  switch (severity?.toLowerCase()) {
    case 'critical':
      config = { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: ShieldAlert };
      break;
    case 'high':
      config = { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: ShieldX };
      break;
    case 'medium':
      config = { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: AlertTriangle };
      break;
    case 'low':
      config = { color: 'text-cyber-neon', bg: 'bg-cyber-neon/10', border: 'border-cyber-neon/30', icon: Shield };
      break;
    default:
      break;
  }

  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded border ${config.bg} ${config.border} ${className}`}>
      <Icon className={`w-3.5 h-3.5 mr-1.5 ${config.color}`} />
      <span className={`text-xs font-bold tracking-wider uppercase ${config.color}`}>
        {severity || 'UNKNOWN'} {score !== undefined && `(${score})`}
      </span>
    </div>
  );
};

export default ThreatBadge;

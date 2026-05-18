import React from 'react';
import { motion } from 'framer-motion';

const ThreatScore = ({ score, severity }) => {
  // Determine color based on score
  let color = '#00ff88'; // low
  let shadow = 'rgba(0, 255, 136, 0.5)';
  
  if (score >= 75) {
    color = '#ff003c'; // critical
    shadow = 'rgba(255, 0, 60, 0.5)';
  } else if (score >= 50) {
    color = '#f97316'; // high
    shadow = 'rgba(249, 115, 22, 0.5)';
  } else if (score >= 25) {
    color = '#eab308'; // medium
    shadow = 'rgba(234, 179, 8, 0.5)';
  }

  // Calculate SVG stroke dash array for the gauge
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-cyber-900/50 rounded-xl border border-white/5">
      <h3 className="text-gray-400 font-mono text-sm tracking-widest uppercase mb-6">Threat Score</h3>
      
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Background Circle */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-cyber-800"
          />
          {/* Progress Circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="80"
            cy="80"
            r="60"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${shadow})` }}
          />
        </svg>
        
        {/* Inner Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-bold font-mono"
            style={{ color }}
          >
            {score}
          </motion.span>
          <span className="text-gray-500 text-xs font-mono mt-1">/ 100</span>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400 mb-1">Severity Level</p>
        <div 
          className="px-4 py-1 rounded text-sm font-bold tracking-wider uppercase border inline-block"
          style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
        >
          {severity}
        </div>
      </div>
    </div>
  );
};

export default ThreatScore;

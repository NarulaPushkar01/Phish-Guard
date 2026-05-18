import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, colorClass, delay = 0, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`glass-panel p-5 relative overflow-hidden group`}
    >
      {/* Background glow based on color */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${
        colorClass === 'text-cyber-neon' ? 'bg-cyber-neon' : 
        colorClass === 'text-cyber-cyan' ? 'bg-cyber-cyan' : 
        colorClass === 'text-red-500' ? 'bg-red-500' : 'bg-cyber-purple'
      }`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-gray-400 font-mono text-xs tracking-wider uppercase mb-1">{title}</p>
          <h3 className={`text-3xl font-bold font-mono ${colorClass}`}>{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-cyber-900 border border-white/5 ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="relative z-10 mt-2 flex items-center text-xs">
          <span className={trend.isPositive ? 'text-green-400' : 'text-red-400'}>
            {trend.value}
          </span>
          <span className="text-gray-500 ml-2 font-mono">vs last week</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;

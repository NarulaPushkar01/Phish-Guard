import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', animate = true, delay = 0, ...props }) => {
  const baseClasses = 'glass-panel p-6 relative overflow-hidden';
  
  if (!animate) {
    return (
      <div className={`${baseClasses} ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {/* Subtle top highlight for glass effect */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      {children}
    </motion.div>
  );
};

export default GlassCard;

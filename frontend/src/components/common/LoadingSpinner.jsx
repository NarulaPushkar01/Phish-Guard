import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const dimensions = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        {/* Outer glowing ring */}
        <div className={`absolute inset-0 rounded-full border-t-2 border-cyber-neon animate-[spin_2s_linear_infinite] ${dimensions}`}></div>
        
        {/* Inner reverse spinning ring */}
        <div className={`absolute inset-1 rounded-full border-r-2 border-cyber-cyan animate-[spin_1.5s_linear_infinite_reverse] opacity-70`}></div>
        
        {/* Center icon */}
        <Loader2 className={`${dimensions} text-cyber-neon animate-pulse`} />
      </div>
      <p className="text-cyber-neon font-mono text-sm animate-pulse">PROCESSING...</p>
    </div>
  );
};

export default LoadingSpinner;

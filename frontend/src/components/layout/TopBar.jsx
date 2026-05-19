import React, { useState, useEffect } from 'react';
import { Search, Bell, Activity, Server, Shield, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const TopBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [sysStatus, setSysStatus] = useState('online');
  const { isLightMode, toggleTheme } = useTheme();

  // Simulate status checks
  useEffect(() => {
    const interval = setInterval(() => {
      setSysStatus(Math.random() > 0.9 ? 'syncing' : 'online');
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-20 bg-cyber-800/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-40 relative">
      
      {/* Global Search */}
      <div className="flex-1 max-w-xl ml-12 md:ml-0">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-cyber-cyan transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-cyber-900/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-cyber-900 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan sm:text-sm transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
            placeholder="Search IOCs, URLs, IPs, Hashes (Ctrl+K)..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-gray-500 border border-white/10 rounded px-1.5 py-0.5 bg-cyber-800">⌘K</span>
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-6">
        
        {/* System Status */}
        <div className="hidden md:flex items-center space-x-2 text-sm">
          <Server className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Engine:</span>
          {sysStatus === 'online' ? (
            <span className="flex items-center text-cyber-neon">
              <span className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse mr-2"></span>
              SECURE
            </span>
          ) : (
            <span className="flex items-center text-cyber-cyan">
              <Activity className="w-3 h-3 mr-1 animate-spin" />
              SYNCING
            </span>
          )}
        </div>

        <div className="h-6 w-px bg-white/10 hidden md:block"></div>

        {/* Threat Level */}
        <div className="flex items-center px-3 py-1 bg-cyber-900 border border-white/10 rounded text-sm">
          <Shield className="w-4 h-4 text-cyber-neon mr-2" />
          <span className="text-gray-400 mr-2">DEFCON:</span>
          <span className="text-cyber-neon font-bold">5</span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-400 hover:text-cyber-neon hover:bg-cyber-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
          title="Toggle Theme"
        >
          {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-cyber-700/50 transition-colors relative focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyber-red animate-pulse"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 rounded-md shadow-2xl bg-cyber-800 border border-white/10 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/10 bg-cyber-900/50 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-white">System Alerts</h3>
                  <span className="text-xs text-cyber-cyan cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-cyber-700/30 border-b border-white/5 cursor-pointer transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-cyber-red animate-pulse"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">Critical Threat Detected</p>
                        <p className="text-xs text-gray-400 mt-1">Analysis #8942 yielded a score of 95/100.</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">2 mins ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-cyber-700/30 cursor-pointer transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-cyber-neon"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">Database Sync Complete</p>
                        <p className="text-xs text-gray-400 mt-1">IOC database successfully updated.</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">1 hr ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-white/10 bg-cyber-900/50 text-center">
                  <a href="#" className="text-sm text-cyber-cyan hover:text-cyber-neon transition-colors font-medium">
                    View all alerts
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default TopBar;

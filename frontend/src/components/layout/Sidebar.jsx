import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FileSearch, 
  Globe, 
  FileText, 
  User, 
  LogOut,
  Menu,
  ChevronLeft,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const authNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analysis', icon: FileSearch, label: 'Email Analysis' },
    { path: '/threat-intel', icon: Globe, label: 'Threat Intel' },
    { path: '/tools', icon: FileText, label: 'Security Tools' },
    { path: '/learn', icon: BookOpen, label: 'Learn Hub' },
    { path: '/awareness', icon: ShieldAlert, label: 'Awareness Hub' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const publicNavItems = [
    { path: '/', icon: Globe, label: 'Home' },
    { path: '/learn', icon: BookOpen, label: 'Learn Hub' },
    { path: '/awareness', icon: ShieldAlert, label: 'Awareness Hub' },
  ];

  const navItems = user ? authNavItems : publicNavItems;

  return (
    <>
      <motion.div 
        initial={false}
        animate={{ width: isMobile ? (mobileOpen ? '260px' : '0px') : (collapsed ? '80px' : '260px') }}
        className={`bg-cyber-800 border-r border-white/10 h-full flex flex-col z-50 md:z-20 transition-all duration-300 shadow-[2px_0_15px_rgba(0,0,0,0.5)] ${
          isMobile ? 'fixed left-0 top-0 bottom-0' : 'relative'
        } ${isMobile && !mobileOpen ? 'overflow-hidden invisible pointer-events-none border-r-0' : ''}`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 relative">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center">
            <ShieldAlert className="w-8 h-8 text-cyber-neon flex-shrink-0" />
            {(!collapsed || (isMobile && mobileOpen)) && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-3 font-mono font-bold text-xl tracking-wider text-white hover:text-gray-300 transition-colors"
              >
                PHISH<span className="text-cyber-neon">GUARD</span>
              </motion.span>
            )}
          </Link>
          
          {/* Collapse Toggle */}
          <button 
            onClick={() => isMobile ? setMobileOpen(false) : setCollapsed(!collapsed)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-cyber-700 border border-white/20 rounded-full p-1 text-gray-400 hover:text-cyber-neon transition-colors"
          >
            {(isMobile ? false : collapsed) ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-cyber-900/50 text-cyber-neon shadow-[0_0_10px_rgba(0,255,136,0.1)_inset] border border-cyber-neon/30' 
                    : 'text-gray-400 hover:bg-cyber-700/50 hover:text-white border border-transparent'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-cyber-neon rounded-r"
                  />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyber-neon' : 'group-hover:text-cyber-cyan transition-colors'}`} />
                
                {(!collapsed || (isMobile && mobileOpen)) && (
                  <span className="ml-3 font-medium truncate">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && !isMobile && (
                  <div className="absolute left-14 bg-cyber-700 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Area & Logout / Login */}
        <div className="p-4 border-t border-white/10">
          {user ? (
            <>
              <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-4`}>
                {(!collapsed || (isMobile && mobileOpen)) && (
                  <div className="flex items-center overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-cyber-neon/20 border border-cyber-neon flex items-center justify-center text-cyber-neon font-bold flex-shrink-0">
                      {user.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="ml-3 truncate">
                      <p className="text-sm font-medium text-white truncate">{user.username || 'Analyst'}</p>
                      <p className="text-xs text-cyber-cyan truncate">{user.profile?.role || 'SOC L1'}</p>
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={logout}
                className={`w-full flex items-center px-3 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors ${collapsed ? 'justify-center' : ''}`}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {(!collapsed || (isMobile && mobileOpen)) && <span className="ml-3 font-medium">Disconnect</span>}
              </button>
            </>
          ) : (
            <Link 
              to="/login"
              className={`w-full flex items-center px-3 py-2 bg-cyber-neon/10 text-cyber-neon border border-cyber-neon/30 hover:bg-cyber-neon/20 rounded-lg transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <User className="w-5 h-5 flex-shrink-0" />
              {(!collapsed || (isMobile && mobileOpen)) && <span className="ml-3 font-medium">Sign In</span>}
            </Link>
          )}
        </div>
      </motion.div>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobile && mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
        />
      )}
    </>
  );
};

export default Sidebar;

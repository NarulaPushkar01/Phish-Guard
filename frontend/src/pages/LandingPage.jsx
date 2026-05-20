import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Search, FileText, ArrowRight, Activity, Terminal, Globe, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-cyber-800/40 backdrop-blur border border-white/10 p-6 rounded-xl hover:border-cyber-neon/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-neon/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-0"></div>
    <div className="w-12 h-12 bg-cyber-900 border border-white/10 rounded-lg flex items-center justify-center mb-4 group-hover:border-cyber-neon/50 transition-colors">
      <Icon className="text-cyber-cyan group-hover:text-cyber-neon transition-colors" size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2 font-mono">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const LandingPage = () => {
  const { isLightMode, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-900 text-white selection:bg-cyber-neon selection:text-black relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyber-neon/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyber-purple/10 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgbZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNjAgMEwwIDYwdjYwaDYwVjB6bS0zMCAwTDAgMzB2MzBoMzBWMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>

      {/* ── Sticky Navbar ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cyber-900/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-cyber-900/70 backdrop-blur-sm border-b border-transparent'
      }`}>
        <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <Shield className="text-cyber-neon w-7 h-7" />
            <span className="font-mono font-bold text-xl tracking-wider text-white">
              PHISH<span className="text-cyber-neon">GUARD</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/awareness" className="px-4 py-2 text-gray-400 hover:text-cyber-neon transition-colors text-sm font-medium rounded-lg hover:bg-white/5">
              Awareness Hub
            </Link>
            <Link to="/learn" className="px-4 py-2 text-gray-400 hover:text-cyber-neon transition-colors text-sm font-medium rounded-lg hover:bg-white/5">
              Learn Hub
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:text-cyber-neon hover:bg-white/5 transition-all"
              title={isLightMode ? 'Dark Mode' : 'Light Mode'}
            >
              {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-cyber-neon text-black text-sm font-bold rounded-lg hover:bg-[#00e077] transition-all hover:shadow-[0_0_15px_rgba(0,255,136,0.4)]">
              Get Started
            </Link>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:text-cyber-neon transition-all"
            >
              {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-cyber-neon transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-cyber-900/98 border-t border-white/10 overflow-hidden"
            >
              <div className="container mx-auto px-6 py-4 flex flex-col gap-2">
                <Link to="/awareness" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-300 hover:text-cyber-neon hover:bg-white/5 rounded-lg transition-all font-medium">
                  Awareness Hub
                </Link>
                <Link to="/learn" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-300 hover:text-cyber-neon hover:bg-white/5 rounded-lg transition-all font-medium">
                  Learn Hub
                </Link>
                <div className="border-t border-white/10 pt-2 mt-1 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all font-medium">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-cyber-neon text-black text-center font-bold rounded-lg hover:bg-[#00e077] transition-all">
                    Get Started →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-36 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan text-sm mb-8 font-mono"
        >
          <Activity size={16} className="animate-pulse" />
          <span>Advanced SOC Threat Intelligence Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight"
        >
          Deconstruct Threats. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-cyber-cyan">
            Secure Your Organization.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-400 mb-10 max-w-2xl"
        >
          Upload suspicious emails, automatically extract IOCs, analyze headers, and map to MITRE ATT&CK framework in seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link to="/register" className="bg-cyber-neon text-black px-8 py-4 rounded font-bold hover:bg-[#00e077] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] flex items-center justify-center gap-2 text-lg">
            Start Analysis <ArrowRight size={20} />
          </Link>
          <Link to="/awareness" className="border border-white/20 bg-cyber-800/50 text-white px-8 py-4 rounded font-medium hover:bg-cyber-800 transition-colors flex items-center justify-center gap-2 text-lg">
            <Terminal size={20} /> Learn to Spot Scams
          </Link>
        </motion.div>

        {/* Public URL Scanner Widget (Demo) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-3xl bg-cyber-800/50 backdrop-blur border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h3 className="text-xl font-bold font-mono text-white mb-4 flex items-center justify-center gap-2">
            <Search className="text-cyber-cyan" /> 
            Quick URL Scanner
          </h3>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = '/login?redirect=threat-intel';
            }} 
            className="flex flex-col sm:flex-row gap-3"
          >
            <input 
              type="text" 
              placeholder="Paste a suspicious URL here (e.g., http://bit.ly/1234)..." 
              className="flex-1 bg-cyber-900 border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-cyber-neon"
              required
            />
            <button type="submit" className="bg-cyber-900 text-white border border-cyber-cyan hover:border-cyber-neon hover:text-cyber-neon px-6 py-3 rounded font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap">
              <Shield size={18} /> Scan Link
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 font-mono">Sign up required to access the full threat intelligence engine and email analyzer.</p>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 w-full max-w-5xl rounded-xl border border-white/10 bg-cyber-800/50 backdrop-blur shadow-2xl overflow-hidden"
        >
          <div className="h-8 border-b border-white/10 flex items-center px-4 gap-2 bg-cyber-900/80">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-4 font-mono text-xs text-gray-500">phishguard-soc-dashboard</div>
          </div>
          <div className="p-1 sm:p-2 bg-gradient-to-br from-cyber-800 to-cyber-900 aspect-video relative flex items-center justify-center">
            {/* Mockup content */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-900 via-transparent to-transparent"></div>
            <div className="relative z-10 text-center">
               <Shield className="w-16 h-16 text-cyber-neon/50 mx-auto mb-4 animate-pulse" />
               <p className="font-mono text-cyber-cyan text-sm sm:text-base">SYSTEM READY FOR ANALYSIS</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-mono mb-4">Enterprise Grade Analysis</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Built for SOC analysts and security researchers to tear down phishing campaigns.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Search}
            title="Deep Header Inspection"
            desc="Automatically parse SPF, DKIM, DMARC records and detect return-path mismatches or domain spoofing."
            delay={0.1}
          />
          <FeatureCard 
            icon={Lock}
            title="Threat Intelligence"
            desc="Built-in integration with VirusTotal, AbuseIPDB, and URLScan to verify the reputation of extracted URLs and IPs."
            delay={0.2}
          />
          <FeatureCard 
            icon={FileText}
            title="IOC Extraction"
            desc="Instantly extract and defang URLs, IPs, domains, and email addresses. Map findings directly to MITRE ATT&CK."
            delay={0.3}
          />
          <FeatureCard 
            icon={Globe}
            title="Domain & WHOIS Intel"
            desc="Investigate suspicious domains. Detect newly registered domains and analyze historical WHOIS registration data."
            delay={0.4}
          />
          <FeatureCard 
            icon={Activity}
            title="SSL & DNS Diagnostics"
            desc="Inspect SSL certificates for validity and issuer mismatches. Perform deep DNS lookups for MX and TXT records."
            delay={0.5}
          />
          <FeatureCard 
            icon={Shield}
            title="India-Specific Scams"
            desc="Built specifically to address the unique threat landscape of India, including UPI fraud, fake KYC, and IRCTC scams."
            delay={0.6}
          />
        </div>
      </section>

      {/* Built for Bharat Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 border-t border-white/5 bg-cyber-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-mono mb-6 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-500">
              Built for Bharat
            </span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            Phishing campaigns in India are evolving rapidly. From fake electricity bill warnings to sophisticated OLX payment scams, the threat landscape is unique. PhishGuard is built to provide Indian users and organizations with the tools they need to stay safe online.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/awareness" className="btn-primary">Visit Awareness Hub</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-cyber-900 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-cyber-neon" />
          <span className="font-mono font-bold tracking-wider text-white">PHISH<span className="text-cyber-neon">GUARD</span></span>
        </div>
        <p>&copy; {new Date().getFullYear()} PhishGuard Security Platform. For educational and professional use.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

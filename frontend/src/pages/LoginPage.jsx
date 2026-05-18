import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials or server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-900 flex flex-col justify-center items-center p-4 relative z-10">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group">
        <Shield className="text-cyber-neon w-6 h-6 group-hover:animate-pulse" />
        <span className="font-mono font-bold text-lg text-white">PHISH<span className="text-cyber-neon">GUARD</span></span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard animate={false} className="border-cyber-cyan/30 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-mono text-white mb-2">SOC Authentication</h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access the platform</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: [0, -8, 8, -6, 6, -3, 3, 0] }}
              transition={{ duration: 0.5 }}
              className="mb-6 p-4 bg-red-500/15 border border-red-500/60 rounded-lg flex items-center gap-3 text-red-400 text-sm shadow-[0_0_15px_rgba(255,0,60,0.15)]"
            >
              <AlertTriangle size={18} className="flex-shrink-0 text-red-400" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">Operator Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="analyst@soc.local"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">Access Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex justify-center items-center gap-2 mt-4"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Lock size={18} />
                  Authorize Access
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have clearance?{' '}
            <Link to="/register" className="text-cyber-cyan hover:text-cyber-neon hover:underline transition-colors font-medium">
              Request Access
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default LoginPage;

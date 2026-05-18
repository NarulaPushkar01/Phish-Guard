import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password strength indicators
  const hasLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isPasswordValid = hasLength && hasUpper && hasLower && hasNumber;

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!isPasswordValid) {
      setError('Password does not meet security requirements');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const RequirementItem = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-xs font-mono ${met ? 'text-cyber-neon' : 'text-gray-500'}`}>
      {met ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-500"></div>}
      {text}
    </div>
  );

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
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-mono text-white mb-2">Request Clearance</h2>
            <p className="text-gray-400 text-sm">Create a new analyst profile</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded flex items-center gap-3 text-red-400 text-sm">
              <AlertTriangle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 font-mono">Codename (Username)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field pl-10 py-2.5"
                  placeholder="analyst_01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 font-mono">Operator Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10 py-2.5"
                  placeholder="analyst@soc.local"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 font-mono">Passphrase</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 py-2.5"
                  placeholder="••••••••"
                />
              </div>
              
              {/* Password Requirements */}
              <div className="mt-3 grid grid-cols-2 gap-2 bg-cyber-900/50 p-3 rounded border border-white/5">
                <RequirementItem met={hasLength} text="Min 8 chars" />
                <RequirementItem met={hasUpper} text="Uppercase (A-Z)" />
                <RequirementItem met={hasLower} text="Lowercase (a-z)" />
                <RequirementItem met={hasNumber} text="Number (0-9)" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || (formData.password && !isPasswordValid)}
              className="w-full btn-primary flex justify-center items-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Shield size={18} />
                  Provision Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have clearance?{' '}
            <Link to="/login" className="text-cyber-cyan hover:text-cyber-neon hover:underline transition-colors font-medium">
              Initialize Login
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

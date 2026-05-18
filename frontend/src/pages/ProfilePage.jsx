import React, { useState } from 'react';
import { User, Mail, Shield, Save, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/endpoints';
import GlassCard from '../components/common/GlassCard';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.profile?.full_name || '',
    organization: user?.profile?.organization || '',
    role: user?.profile?.role || ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await authService.updateProfile(formData);
      setUser(res.data.user);
      setStatus({ type: 'success', msg: 'Profile updated successfully.' });
      setIsEditing(false);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
          <User className="text-cyber-cyan" />
          Operator Profile
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage your SOC analyst identity and preferences.</p>
      </div>

      {status.msg && (
        <div className={`p-4 rounded border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {status.msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Identity Card */}
        <GlassCard className="md:col-span-1 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full border-2 border-cyber-neon bg-cyber-800 flex items-center justify-center mb-4 relative">
            <span className="text-4xl font-bold text-cyber-neon">
              {user.username.charAt(0).toUpperCase()}
            </span>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-cyber-neon rounded-full border-2 border-cyber-900"></div>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1">{user.username}</h2>
          <p className="text-cyber-cyan font-mono text-sm mb-4">{user.profile?.role || 'SOC L1 Analyst'}</p>
          
          <div className="w-full border-t border-white/10 pt-4 mt-2 space-y-3 text-sm text-left">
            <div className="flex items-center text-gray-400">
              <Mail className="w-4 h-4 mr-2" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Shield className="w-4 h-4 mr-2" />
              <span>Clearance: Standard</span>
            </div>
          </div>
        </GlassCard>

        {/* Right Column: Settings */}
        <GlassCard className="md:col-span-2">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <h3 className="text-lg font-bold text-white">Profile Details</h3>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-sm text-cyber-cyan hover:text-white transition-colors px-3 py-1 border border-cyber-cyan/30 rounded"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="text-sm bg-cyber-neon text-black font-medium hover:bg-[#00e077] transition-colors px-3 py-1 rounded flex items-center gap-2"
                >
                  <Save size={14} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              ) : (
                <p className="text-white bg-cyber-900/50 p-3 rounded border border-white/5">{user.profile?.full_name || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Organization</label>
              {isEditing ? (
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="ACME Corp"
                />
              ) : (
                <p className="text-white bg-cyber-900/50 p-3 rounded border border-white/5">{user.profile?.organization || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Role / Title</label>
              {isEditing ? (
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Security Analyst"
                />
              ) : (
                <p className="text-white bg-cyber-900/50 p-3 rounded border border-white/5">{user.profile?.role || 'SOC L1 Analyst'}</p>
              )}
            </div>
          </div>
          
          {/* API Keys placeholder info */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Key className="text-yellow-500 w-5 h-5" />
              API Integrations
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              API keys for external threat intelligence services (VirusTotal, AbuseIPDB, URLScan) are managed centrally by the system administrator via environment variables to ensure enterprise-wide rate limit compliance.
            </p>
            <div className="bg-cyber-900 border border-white/5 rounded p-4 text-sm font-mono text-gray-500">
              [SYSTEM.CONFIG.VT_KEY] = CONFIGURED<br/>
              [SYSTEM.CONFIG.ABUSEIPDB] = CONFIGURED
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfilePage;

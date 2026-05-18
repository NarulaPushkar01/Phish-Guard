import React, { useState, useEffect } from 'react';
import { Mail, Globe, ShieldAlert, Activity } from 'lucide-react';
import { threatService, analysisService } from '../api/endpoints';
import StatsCard from '../components/dashboard/StatsCard';
import RecentAnalyses from '../components/dashboard/RecentAnalyses';
import { ThreatDistributionChart, ThreatTrendChart } from '../components/dashboard/ThreatChart';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats and trend
        const statsRes = await threatService.getStats();
        setStats(statsRes.data.stats);
        setTrendData(statsRes.data.trend);

        // Fetch recent analyses
        const historyRes = await analysisService.getHistory(1, 5);
        setRecentAnalyses(historyRes.data.analyses);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">SOC Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.username}. Here is your threat overview.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-mono uppercase">System Time</p>
          <p className="text-cyber-cyan font-mono">{currentTime.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')} LOCAL</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Emails Analyzed" 
          value={loading ? '-' : stats?.total_analyzed || 0}
          icon={Mail}
          colorClass="text-cyber-cyan"
          delay={0.1}
          trend={{ value: '+12%', isPositive: true }}
        />
        <StatsCard 
          title="Malicious URLs" 
          value={loading ? '-' : stats?.malicious_urls || 0}
          icon={Globe}
          colorClass="text-orange-500"
          delay={0.2}
          trend={{ value: '-5%', isPositive: true }}
        />
        <StatsCard 
          title="Suspicious IPs" 
          value={loading ? '-' : stats?.suspicious_ips || 0}
          icon={Activity}
          colorClass="text-yellow-500"
          delay={0.3}
        />
        <StatsCard 
          title="Critical Threats" 
          value={loading ? '-' : stats?.critical_threats || 0}
          icon={ShieldAlert}
          colorClass="text-red-500"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GlassCard className="flex-1">
            <h3 className="text-lg font-bold font-mono text-white mb-4 border-b border-white/10 pb-2">Severity Distribution</h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <ThreatDistributionChart data={stats?.severity_distribution} />
            )}
          </GlassCard>

          <GlassCard className="flex-1">
            <h3 className="text-lg font-bold font-mono text-white mb-4 border-b border-white/10 pb-2">Threat Trend (7 Days)</h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <ThreatTrendChart data={trendData} />
            )}
          </GlassCard>
        </div>

        {/* Recent Analyses Column */}
        <div className="lg:col-span-2">
          <RecentAnalyses analyses={recentAnalyses} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

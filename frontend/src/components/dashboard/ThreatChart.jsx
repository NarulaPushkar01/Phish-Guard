import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const ThreatDistributionChart = ({ data }) => {
  const COLORS = {
    'Critical': '#ff003c', // cyber-red
    'High': '#f97316',     // orange-500
    'Medium': '#eab308',   // yellow-500
    'Low': '#00ff88'       // cyber-neon
  };

  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value
  })).filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-mono">No threat data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-cyber-900 border border-white/10 p-3 rounded shadow-xl">
          <p className="text-white font-medium">{`${payload[0].name} Threats`}</p>
          <p className="text-cyber-cyan font-mono">{`${payload[0].value} files`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#1f2937'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ThreatTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-mono">No trend data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-cyber-900 border border-white/10 p-3 rounded shadow-xl text-sm">
          <p className="text-gray-400 mb-1">{label}</p>
          <p className="text-white">Avg Score: <span className="text-cyber-neon font-mono font-bold">{payload[0].value.toFixed(1)}</span></p>
          <p className="text-white">Analyses: <span className="text-cyber-cyan font-mono">{payload[0].payload.count}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="_id" 
            stroke="#4b5563" 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            tickFormatter={(val) => val.substring(5)} // Show MM-DD
          />
          <YAxis 
            stroke="#4b5563" 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1f2937', opacity: 0.4 }} />
          <Bar 
            dataKey="avg_score" 
            fill="#00ff88" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={40}
          >
            {
              data.map((entry, index) => {
                let color = '#00ff88'; // Low
                if (entry.avg_score >= 75) color = '#ff003c'; // Critical
                else if (entry.avg_score >= 50) color = '#f97316'; // High
                else if (entry.avg_score >= 25) color = '#eab308'; // Medium
                
                return <Cell key={`cell-${index}`} fill={color} />;
              })
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

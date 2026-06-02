import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Clock, Users, Activity, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CallAnalytics = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;
        
        const response = await axios.get('/api/calls', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setCalls(response.data);
      } catch (err) {
        console.error('Failed to fetch calls for analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalls();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  // Calculate Call Metrics
  // Assume duration is in "MM:SS" format or seconds. 
  // Let's parse it safely.
  const parseDuration = (durStr) => {
    if (!durStr) return 0;
    const parts = String(durStr).split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return parseInt(durStr, 10) || 0;
  };

  let totalDurationSecs = 0;
  const employeeStats = {};

  calls.forEach(c => {
    const dur = parseDuration(c.duration);
    totalDurationSecs += dur;
    
    // Group by employee/user
    const userName = c.user?.name || 'Unknown Rep';
    if (!employeeStats[userName]) {
      employeeStats[userName] = { calls: 0, duration: 0 };
    }
    employeeStats[userName].calls += 1;
    employeeStats[userName].duration += dur;
  });

  const totalCalls = calls.length;
  const avgTalkTimeSecs = totalCalls > 0 ? Math.round(totalDurationSecs / totalCalls) : 0;
  
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const chartData = Object.keys(employeeStats).map(emp => ({
    name: emp,
    durationMins: Math.round(employeeStats[emp].duration / 60)
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Call Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Measure sales engagement effectiveness and call performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-blue-500 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl dark:bg-blue-900/30">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Calls Logged</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalCalls}</h3>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-500 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl dark:bg-emerald-900/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Talk Time</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{formatTime(totalDurationSecs)}</h3>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-purple-500 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-500 rounded-xl dark:bg-purple-900/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Talk Time</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{formatTime(avgTalkTimeSecs)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Employee Call Duration (Mins)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} 
                />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="durationMins" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Engagement Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl dark:bg-emerald-900/20 dark:border-emerald-800">
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">High Conversion Probability</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                Longer quality conversations (&gt; 10m) indicate strong engagement. Track these leads closely.
              </p>
            </div>
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm font-bold text-red-700 dark:text-red-400">Low Engagement Risk</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                Short calls (&lt; 2m) may signify poor lead quality or weak value proposition.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl dark:bg-slate-800/50 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Top Performing Rep</p>
              <p className="text-xs text-slate-500 mt-1">
                {chartData.length > 0 ? chartData.sort((a,b) => b.durationMins - a.durationMins)[0].name : 'N/A'} leads in total call duration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallAnalytics;

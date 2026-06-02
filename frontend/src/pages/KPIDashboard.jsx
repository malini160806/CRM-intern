import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Target, Clock, Activity, Loader2, Phone, Briefcase, Mail } from 'lucide-react';

const KPIDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState({
    sales: { totalLeads: 0, convertedCustomers: 0, conversionPercentage: 0, totalRevenue: 0 },
    activity: { tasksCompleted: 0, callsCompleted: 0, meetingsAttended: 0, emailsSent: 0 },
    productivity: { totalActiveHours: 0, activeSessions: 0 }
  });

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;
        
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const [salesRes, activityRes, prodRes] = await Promise.all([
          axios.get('/api/kpi/sales', config),
          axios.get('/api/kpi/activity', config),
          axios.get('/api/kpi/productivity', config)
        ]);

        setKpiData({
          sales: salesRes.data,
          activity: activityRes.data,
          productivity: prodRes.data
        });
      } catch (err) {
        console.error('Failed to fetch KPIs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const { sales, activity, productivity } = kpiData;

  const activityChartData = [
    { name: 'Calls', value: activity.callsCompleted },
    { name: 'Tasks', value: activity.tasksCompleted },
    { name: 'Meetings', value: activity.meetingsAttended },
    { name: 'Emails', value: activity.emailsSent }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Enterprise KPI Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time tracking of sales, productivity, and activity metrics.</p>
        </div>
      </div>

      {/* Sales KPIs */}
      <h3 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Sales Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Leads Assigned</p>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{sales.totalLeads}</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Converted Customers</p>
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{sales.convertedCustomers}</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Conversion Rate</p>
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{sales.conversionPercentage}%</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Revenue Contribution</p>
            <span className="text-xl font-bold text-primary-500">$</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">${sales.totalRevenue.toLocaleString()}</h3>
        </div>
      </div>

      {/* Productivity KPIs */}
      <h3 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Team Productivity</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-amber-500 flex items-center space-x-6">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center dark:bg-amber-900/30">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Active CRM Hours</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1">{productivity.totalActiveHours} <span className="text-lg text-slate-500">hrs</span></h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Across {productivity.activeSessions} tracked sessions</p>
          </div>
        </div>
      </div>

      {/* Activity KPIs */}
      <h3 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Activity Overview</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card p-6 bg-slate-50/50 dark:bg-slate-800/30">
            <Phone className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calls Completed</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activity.callsCompleted}</h3>
          </div>
          <div className="glass-card p-6 bg-slate-50/50 dark:bg-slate-800/30">
            <Briefcase className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meetings Attended</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activity.meetingsAttended}</h3>
          </div>
          <div className="glass-card p-6 bg-slate-50/50 dark:bg-slate-800/30">
            <Activity className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasks Completed</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activity.tasksCompleted}</h3>
          </div>
          <div className="glass-card p-6 bg-slate-50/50 dark:bg-slate-800/30">
            <Mail className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emails Sent</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activity.emailsSent}</h3>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Activity Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;

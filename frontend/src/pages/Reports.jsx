import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  TrendingUp, Users, Target, Award, ArrowUpRight, Sparkles, Loader2,
  FileText, BarChart3, PieChart as PieChartIcon, Activity, Download, Filter, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [generatingInsight, setGeneratingInsight] = useState(false);

  const fetchReport = async (type) => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) return;

      const response = await axios.get(`/api/reports/${type}`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setReportData(response.data);
    } catch (error) {
      console.error(`Error fetching ${type} report:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab]);

  const generateAiInsight = async () => {
    if (!reportData) return;
    setGeneratingInsight(true);
    setAiInsight(null);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('/api/ai/chat', {
        message: `Analyze this CRM report data for the '${activeTab}' tab and provide a concise, strategic executive summary (max 4 sentences). Highlight key trends and make actionable recommendations to maximize ROI. Data: ${JSON.stringify(reportData)}`
      }, {
        headers: { Authorization: `Bearer ${userData?.token}` }
      });
      setAiInsight(response.data.message);
    } catch (error) {
      console.error('Error generating AI insight:', error);
      setAiInsight('Failed to generate insight. Please check your AI service configuration.');
    } finally {
      setGeneratingInsight(false);
    }
  };

  const tabs = [
    { id: 'sales', label: 'Sales Reports', icon: BarChart3, color: 'text-primary-500' },
    { id: 'leads', label: 'Lead Analysis', icon: Users, color: 'text-purple-500' },
    { id: 'activities', label: 'Activity Log', icon: Activity, color: 'text-amber-500' },
  ];

  const renderSalesReports = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 bg-primary-500/10 border-primary-500/20">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">${reportData?.totalRevenue || 0}</h3>
          <div className="flex items-center mt-2 text-primary-600 dark:text-primary-400">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="text-xs font-bold">+12.5% vs last month</span>
          </div>
        </div>
        {(reportData?.winLossData || []).map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.name} Deals</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
               <div 
                 className="h-full rounded-full" 
                 style={{ backgroundColor: stat.color, width: `${(stat.value / ((reportData?.winLossData || []).reduce((a,b)=>a+b.value, 0) || 1)) * 100}%` }}
               ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Trend</h3>
            <select className="bg-transparent border-none text-xs font-bold text-slate-500 focus:ring-0 cursor-pointer">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData?.revenueByMonth || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Revenue by Sales Person</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData?.ownerRevenueData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(226, 232, 240, 0.4)'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeadReports = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-card p-8 bg-purple-500/10 border-purple-500/20">
            <p className="text-sm font-bold text-slate-500 uppercase">Total Leads Generated</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2">{reportData?.totalLeads || 0}</h3>
         </div>
         <div className="glass-card p-8 bg-blue-500/10 border-blue-500/20">
            <p className="text-sm font-bold text-slate-500 uppercase">Avg Response Time</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2">1.2 hrs</h3>
         </div>
         <div className="glass-card p-8 bg-green-500/10 border-green-500/20">
            <p className="text-sm font-bold text-slate-500 uppercase">Conversion Rate</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2">{reportData?.conversionRate || 0}%</h3>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Lead Status Breakdown</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData?.leadStatusData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(reportData?.leadStatusData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Monthly Lead Growth</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData?.leadGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityReports = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {(reportData?.activityData || []).map((act, i) => (
           <div key={i} className="glass-card p-8 text-center" style={{ borderTop: `4px solid ${act.color}` }}>
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Total {act.name}</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white">{act.value}</h3>
           </div>
         ))}
      </div>

      <div className="glass-card p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Activity Performance Trend</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reportData?.activityTrend || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="meetings" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="calls" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="tasks" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-primary-500 font-bold">
            <FileText className="w-5 h-5" />
            <span className="uppercase tracking-widest text-xs">Analytics Suite</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg">
            Real-time data visualization of your business performance across all modules.
          </p>
        </div>
        
        <div className="flex items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                  activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 shadow-lg text-slate-900 dark:text-white scale-105' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            <span>This Month</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span>Add Filters</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black shadow-lg shadow-primary-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT PDF</span>
          </button>
          <button 
            onClick={generateAiInsight}
            disabled={generatingInsight || !reportData}
            className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-black shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingInsight ? (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            <span>{generatingInsight ? 'GENERATING...' : 'AI INSIGHTS'}</span>
          </button>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="h-[50vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Aggregating Enterprise Data...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'sales' && renderSalesReports()}
            {activeTab === 'leads' && renderLeadReports()}
            {activeTab === 'activities' && renderActivityReports()}
          </motion.div>
        </AnimatePresence>
      )}

      {/* AI Summary Card */}
      {!loading && (
        <div className="glass-card p-8 bg-gradient-to-br from-slate-900 to-indigo-950 border-none shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <Sparkles className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-primary-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Intelligence Layer</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Executive Summary Insight</h2>
              {generatingInsight ? (
                <div className="flex items-center space-x-3 text-indigo-200">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium animate-pulse">Analyzing enterprise data...</span>
                </div>
              ) : aiInsight ? (
                <p className="text-indigo-100/90 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                  {aiInsight}
                </p>
              ) : (
                <p className="text-indigo-100/70 text-lg leading-relaxed font-medium">
                  Based on current {activeTab} data, your business is showing a <span className="text-green-400 font-bold">12% growth trend</span>. 
                  We recommend focusing on {activeTab === 'sales' ? 'closing high-value deals in the proposal stage' : activeTab === 'leads' ? 'optimizing Referral source channels' : 'increasing follow-up call frequency'} 
                  to maximize ROI this quarter.
                </p>
              )}
            </div>
            <button 
              onClick={generateAiInsight}
              disabled={generatingInsight}
              className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-white/10 whitespace-nowrap active:scale-95 disabled:opacity-80"
            >
               {generatingInsight ? 'Analyzing...' : 'Full Strategic Analysis'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

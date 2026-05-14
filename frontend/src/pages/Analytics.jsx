import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

const conversionData = [];

const sourceData = [];

const Analytics = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Performance Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400">Deep dive into your sales funnel and team performance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
            Export PDF
          </button>
          <button className="btn-primary py-2 px-6">
            Generate AI Report
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500 uppercase">Conversion Rate</p>
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">0%</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">No data available yet</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500 uppercase">Avg Deal Size</p>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">$0</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">No data available yet</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500 uppercase">Sales Velocity</p>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">0 Days</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">No data available yet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funnel Chart */}
        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Sales Funnel Efficiency</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} layout="vertical" margin={{ left: 40 }}>
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
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 8, 8, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Pie Chart */}
        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Lead Source Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {sourceData.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Performance Recommendation */}
      <div className="glass-card p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none">
        <div className="flex items-start justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center space-x-2 text-primary-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">AI Strategic Insight</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              "No strategic insights available yet. Add leads and track conversions to see AI-powered recommendations."
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <button className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-all text-sm">
                View Detailed Analysis
              </button>
              <button className="px-6 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all text-sm">
                Dismiss
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Efficiency Score</p>
                <p className="text-4xl font-black text-primary-400">0</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Pending first lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

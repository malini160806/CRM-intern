import React from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const data = [];

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="glass-card p-6 flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-primary-100 rounded-lg dark:bg-slate-800">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        {trendValue}%
      </div>
    </div>
    <div className="mt-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Sales Overview</h2>
        <p className="text-slate-500 dark:text-slate-400">Everything is set up and ready for your first lead.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value="0" icon={Users} trend="up" trendValue="0" />
        <StatCard title="Hot Leads" value="0" icon={TrendingUp} trend="up" trendValue="0" />
        <StatCard title="Revenue" value="$0" icon={DollarSign} trend="up" trendValue="0" />
        <StatCard title="Pending Follow-ups" value="0" icon={Clock} trend="up" trendValue="0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lead Conversion Analytics</h3>
            <select className="bg-slate-100 border-none rounded-lg px-3 py-1 text-sm outline-none dark:bg-slate-800 dark:text-slate-300">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Area type="monotone" dataKey="leads" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">AI Business Insights</h3>
            </div>
            <ul className="space-y-4 text-sm text-primary-50">
              <li className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                "Hot leads dropped by 15% this week. Consider re-engaging cold leads from last month."
              </li>
              <li className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                "Best time for follow-ups is Wednesday between 10 AM - 12 PM."
              </li>
              <li className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                "Lead score for Acme Corp increased to 92. High buying intent detected."
              </li>
            </ul>
            <button className="w-full mt-6 py-2 bg-white text-primary-600 font-bold rounded-lg hover:bg-primary-50 transition-colors">
              Generate New Insights
            </button>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {[].map((activity, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.color}`}></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.name}</p>
                    <p className="text-xs text-slate-500">{activity.action}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
              <div className="text-center py-4">
                <p className="text-sm text-slate-400">No recent activities found.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

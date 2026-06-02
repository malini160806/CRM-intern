import React, { useState, useEffect } from 'react';
import { 
  LineChart, TrendingUp, DollarSign, Target, 
  Calendar, ArrowUpRight, BarChart3, PieChart,
  ArrowDownRight, Zap, Trophy, Briefcase, Bot
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Forecasts = () => {
  const [stats, setStats] = useState({
    totalPipeline: 0,
    weightedForecast: 0,
    activeDeals: 0,
    avgDealValue: 0
  });
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForecastData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      
      const response = await axios.get('/api/deals', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const dealsData = response.data || [];
      setDeals(dealsData);
      const total = dealsData.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
      
      // Calculate weighted forecast based on probability
      const weights = {
        'New': 0.1,
        'Qualified': 0.3,
        'Proposal Sent': 0.6,
        'Negotiation': 0.8,
        'Won': 1.0,
        'Lost': 0
      };
      
      const weighted = dealsData.reduce((acc, d) => {
        const weight = weights[d.status] || 0.1;
        return acc + ((Number(d.value) || 0) * weight);
      }, 0);

      setStats({
        totalPipeline: total,
        weightedForecast: weighted,
        activeDeals: dealsData.length,
        avgDealValue: dealsData.length > 0 ? total / dealsData.length : 0
      });
    } catch (err) {
      console.error('Failed to fetch forecast data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData();
  }, []);

  const handleExport = () => {
    // Basic CSV Export logic
    const headers = ['Title', 'Value', 'Company', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...deals.map(d => [
        `"${d.title}"`,
        d.value,
        `"${d.company}"`,
        `"${d.status}"`,
        d.date
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_forecast_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const forecastCards = [
    { 
      title: 'Weighted Forecast', 
      value: `$${stats.weightedForecast.toLocaleString()}`, 
      change: '+12.5%', 
      isUp: true, 
      icon: Target, 
      color: 'bg-primary-600',
      desc: 'Based on deal probabilities'
    },
    { 
      title: 'Total Pipeline', 
      value: `$${stats.totalPipeline.toLocaleString()}`, 
      change: '+5.2%', 
      isUp: true, 
      icon: DollarSign, 
      color: 'bg-emerald-600',
      desc: 'Sum of all open opportunities'
    },
    { 
      title: 'Avg. Deal Value', 
      value: `$${Math.round(stats.avgDealValue).toLocaleString()}`, 
      change: '-2.1%', 
      isUp: false, 
      icon: Zap, 
      color: 'bg-amber-600',
      desc: 'Average across all stages'
    },
    { 
      title: 'Deal Velocity', 
      value: '24 Days', 
      change: '+4 Days', 
      isUp: true, 
      icon: Calendar, 
      color: 'bg-purple-600',
      desc: 'Avg. time to close'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-primary-600 mb-2">
            <LineChart className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-widest">Revenue Prediction</h3>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Sales Forecasting</h2>
          <p className="text-slate-500 font-medium mt-1">AI-driven insights for your quarterly revenue goals</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="bg-white border border-slate-200 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:bg-slate-800 dark:border-slate-700">
            <option>Current Quarter (Q2)</option>
            <option>Next Quarter (Q3)</option>
            <option>Full Year 2026</option>
          </select>
          <button 
            onClick={handleExport}
            className="btn-primary flex items-center space-x-2 px-8 py-3 shadow-xl shadow-primary-200 hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowUpRight className="w-5 h-5" />
            <span className="font-black uppercase tracking-widest text-xs">Export Data</span>
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {forecastCards.map((card, i) => (
          <motion.div 
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 group hover:scale-[1.02] transition-all relative overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${card.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-all`}></div>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-black ${
                card.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {card.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{card.change}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.title}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{card.value}</h3>
              <p className="text-xs text-slate-500 font-medium">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Forecast Chart Placeholder */}
        <div className="lg:col-span-8 glass-card p-8 min-h-[400px] relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Revenue Projection</h3>
              <p className="text-sm text-slate-500 font-medium">Monthly expected revenue vs previous period</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-[10px] font-black uppercase text-slate-400">Actual</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-200 rounded-full"></div>
                <span className="text-[10px] font-black uppercase text-slate-400">Forecast</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between px-4 mb-4">
            {[45, 62, 58, 75, 90, 82, 100].map((h, i) => (
              <div key={i} className="w-12 group relative">
                <div 
                  className="absolute bottom-0 w-full bg-primary-50 rounded-t-xl transition-all group-hover:bg-primary-100"
                  style={{ height: `${h + 15}%` }}
                ></div>
                <div 
                  className="absolute bottom-0 w-full bg-primary-600 rounded-t-xl transition-all shadow-lg group-hover:brightness-110"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${(h * 2.5).toFixed(1)}k
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(m => (
              <span key={m} className="text-[10px] font-black text-slate-400 uppercase">{m}</span>
            ))}
          </div>
        </div>

        {/* Pipeline Distribution */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Quota Progress</h3>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - 0.72)} className="text-primary-600 transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white">72%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Achieved</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500">Target</span>
                <span className="text-slate-900 dark:text-white">$250,000</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500">Remaining</span>
                <span className="text-primary-600">$68,500</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-lg font-black mb-2 flex items-center">
                <Zap className="w-5 h-5 text-amber-400 mr-2" />
                AI Strategy
              </h4>
              <p className="text-xs text-slate-300 font-medium mb-4 leading-relaxed">
                Based on your current pipeline, closing 3 high-value deals in the "Negotiation" stage will exceed your Q2 target by 15%.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
                Run Simulation
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform">
              <Bot className="w-32 h-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasts;

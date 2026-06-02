import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Sparkles,
  Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Analytics = () => {
  const [data, setData] = useState({
    metrics: {
      conversionRate: 0,
      avgDealSize: 0,
      salesVelocity: 0,
      pendingFollowups: 0,
      upcomingMeetings: 0,
      completedMeetings: 0,
    },
    funnelData: [],
    sourceData: []
  });
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) return;

        const response = await axios.get('/api/analytics', {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('analytics-dashboard');
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('performance-analytics.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) return;

      const prompt = `Analyze this CRM analytics data and provide a concise, strategic business insight (max 2 paragraphs): 
      Metrics: Conversion Rate: ${data.metrics.conversionRate}%, Avg Deal Size: $${data.metrics.avgDealSize}, Sales Velocity: ${data.metrics.salesVelocity} days. 
      Funnel Data: ${JSON.stringify(data.funnelData)}. 
      Source Data: ${JSON.stringify(data.sourceData)}.
      Focus on actionable recommendations to improve performance.`;

      const response = await axios.post('/api/ai/chat', { message: prompt }, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      
      setAiInsight(response.data.message);
    } catch (error) {
      console.error('Error generating AI insight:', error);
      setAiInsight("Failed to generate insights. Please try again later.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const { metrics, funnelData, sourceData } = data;
  return (
    <div id="analytics-dashboard" className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Performance Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400">Deep dive into your sales funnel and team performance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 disabled:opacity-50 flex items-center"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button 
            onClick={handleGenerateAI}
            disabled={isGeneratingAI}
            className="btn-primary py-2 px-6 disabled:opacity-50 flex items-center"
          >
            {isGeneratingAI ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
            {isGeneratingAI ? 'Generating...' : 'Generate AI Report'}
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
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{metrics.conversionRate}%</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            {metrics.conversionRate > 0 ? 'Lead to Deal conversion' : 'No data available yet'}
          </p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500 uppercase">Avg Deal Size</p>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">${metrics.avgDealSize}</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            {metrics.avgDealSize > 0 ? 'Average revenue per deal' : 'No data available yet'}
          </p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500 uppercase">Sales Velocity</p>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{metrics.salesVelocity} Days</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            {metrics.salesVelocity > 0 ? 'Avg time to close won deals' : 'No data available yet'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500 uppercase">Pending Follow-ups</p>
            <Users className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{metrics.pendingFollowups}</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Leads inactive for over 2 days
          </p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500 uppercase">Upcoming Meetings</p>
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{metrics.upcomingMeetings}</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Meetings scheduled for future
          </p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500 uppercase">Completed Meetings</p>
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{metrics.completedMeetings}</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Successful touchpoints logged
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funnel Chart */}
        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Sales Funnel Efficiency</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 40 }}>
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
            <div className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
              {isGeneratingAI ? (
                <div className="flex items-center space-x-2 text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing data...</span>
                </div>
              ) : aiInsight ? (
                <p>{aiInsight}</p>
              ) : (
                <p>"No strategic insights available yet. Click Generate AI Report to see AI-powered recommendations based on your current data."</p>
              )}
            </div>
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
                <p className="text-4xl font-black text-primary-400">
                  {funnelData.find(d => d.name === 'Won')?.value || 0}
                </p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Won Deals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

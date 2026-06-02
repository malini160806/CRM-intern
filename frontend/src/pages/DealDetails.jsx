import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  DollarSign, 
  Building2, 
  User, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  MoreHorizontal,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setBreadcrumbOverride } from '../store/slices/uiSlice';

const STAGES = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

const DealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`/api/deals/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setDeal(response.data);
        dispatch(setBreadcrumbOverride({ id, name: response.data.title }));
        window.dispatchEvent(new CustomEvent('breadcrumb_update', { detail: { id, name: response.data.title } }));
      } catch (err) {
        console.error('Failed to fetch deal');
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading enterprise deal data...</div>;
  if (!deal) return <div className="p-8 text-center text-red-500">Deal not found</div>;

  const currentStageIndex = STAGES.indexOf(deal.status);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-6 h-6 text-slate-500" />
          </button>
          <div>
            <div className="flex items-center space-x-2 text-primary-600 mb-1">
              <Trophy className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Deal Management</h3>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{deal.title}</h2>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-6 py-3 border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:border-slate-800">
            Edit Deal
          </button>
          <button className="btn-primary px-8 py-3 shadow-xl shadow-primary-100">
            Send Proposal
          </button>
        </div>
      </div>

      {/* Stage Progress Tracker */}
      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-8">
          <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Pipeline Stage</h4>
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter border ${
            deal.status === 'Won' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-primary-50 text-primary-600 border-primary-100'
          }`}>
            {deal.status}
          </span>
        </div>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 dark:bg-slate-800"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 transition-all duration-1000"
            style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
          ></div>
          <div className="relative flex justify-between">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500 ${
                  i <= currentStageIndex 
                    ? 'bg-primary-600 border-white text-white dark:border-slate-900' 
                    : 'bg-white border-slate-100 text-slate-300 dark:bg-slate-900 dark:border-slate-800'
                }`}>
                  {i < currentStageIndex ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-black">{i + 1}</span>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${
                  i <= currentStageIndex ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                }`}>
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 border-l-4 border-l-primary-600">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deal Value</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">${deal.value.toLocaleString()}</h3>
            </div>
            <div className="glass-card p-6 border-l-4 border-l-amber-500">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Probability</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{deal.probability}%</h3>
            </div>
            <div className="glass-card p-6 border-l-4 border-l-green-500">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected Close</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : 'TBD'}
              </h3>
            </div>
          </div>

          <div className="glass-card p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">Activity History</h4>
              <button className="text-primary-600 font-black text-xs uppercase tracking-widest">Add Log</button>
            </div>
            <div className="p-6 space-y-6">
              {[
                { type: 'call', date: '2 hours ago', text: 'Call with contact person regarding budget approval.', icon: Phone, color: 'text-blue-600 bg-blue-50' },
                { type: 'email', date: 'Yesterday', text: 'Sent initial enterprise proposal deck.', icon: Mail, color: 'text-purple-600 bg-purple-50' },
                { type: 'meeting', date: '2 days ago', text: 'Discovery session completed successfully.', icon: Video, color: 'text-amber-600 bg-amber-50' },
              ].map((log, i) => (
                <div key={i} className="flex space-x-4 relative">
                  {i !== 2 && <div className="absolute left-[19px] top-10 w-0.5 h-10 bg-slate-100"></div>}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${log.color}`}>
                    <log.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-slate-900 dark:text-white capitalize">{log.type} Log</h5>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{log.date}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{log.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stakeholders */}
        <div className="space-y-8">
          <div className="glass-card p-6">
            <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-6">Main Stakeholders</h4>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-100">
                  {deal.company?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{deal.company}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center">
                    <Building2 className="w-3 h-3 mr-1" /> Primary Account
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-black dark:bg-slate-800 dark:text-slate-400">
                  {deal.contactPerson?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{deal.contactPerson || 'Unknown Contact'}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center">
                    <User className="w-3 h-3 mr-1" /> Decision Maker
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-2">
              <button className="flex-1 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-primary-50 hover:text-primary-600 transition-all">
                Call
              </button>
              <button className="flex-1 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-primary-50 hover:text-primary-600 transition-all">
                Email
              </button>
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none shadow-2xl shadow-primary-200">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h4 className="font-black text-xs uppercase tracking-widest">AI Deal Score</h4>
            </div>
            <div className="text-4xl font-black mb-2">84%</div>
            <p className="text-sm text-primary-50 font-medium mb-6">High probability of winning based on recent engagement and stakeholder sentiment.</p>
            <ul className="space-y-3">
              <li className="flex items-center text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" /> Frequent engagement
              </li>
              <li className="flex items-center text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" /> Budget confirmed
              </li>
              <li className="flex items-center text-[10px] font-black uppercase tracking-widest text-primary-200">
                <AlertCircle className="w-3 h-3 mr-2 text-amber-400" /> Legal review pending
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Video = ({ className }) => <FileText className={className} />; // Placeholder icon

export default DealDetails;

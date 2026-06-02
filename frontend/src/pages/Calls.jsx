import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Clock, 
  Plus, 
  Search, 
  MoreHorizontal, 
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Calendar,
  Brain
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AddCallModal from '../components/AddCallModal';
import AnalyzeCallModal from '../components/AnalyzeCallModal';

const Calls = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Planned');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAnalysisCall, setActiveAnalysisCall] = useState(null);

  const fetchCalls = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const response = await axios.get('/api/calls', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCalls(response.data);
    } catch (err) {
      console.error('Failed to fetch calls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const handleCallAdded = (newCall) => {
    setCalls(prev => [newCall, ...prev]);
  };

  const deleteCall = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`/api/calls/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCalls(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('Failed to delete call');
    }
  };

  const filteredCalls = calls.filter(c => c.status === activeTab);
  const nextCall = calls.find(c => c.status === 'Planned' && new Date(c.startTime) > new Date());

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Planned': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Held': return 'bg-green-50 text-green-600 border-green-100';
      case 'Missed': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getCallTypeIcon = (type) => {
    return type === 'Outbound' ? (
      <ArrowUpRight className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
    ) : (
      <ArrowDownLeft className="w-3.5 h-3.5 text-green-500 mr-1.5" />
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary-600 mb-1">
            <Phone className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-widest">Call Center</h3>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Call Logs</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 shadow-xl shadow-primary-200 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold">Log New Call</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Activity Summary
              </h4>
              <Activity className="w-4 h-4 text-primary-500" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Calls</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{calls.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Held</span>
                <span className="text-lg font-black text-green-600">{calls.filter(c => c.status === 'Held').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Planned</span>
                <span className="text-lg font-black text-blue-600">{calls.filter(c => c.status === 'Planned').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Missed</span>
                <span className="text-lg font-black text-red-600">{calls.filter(c => c.status === 'Missed').length}</span>
              </div>
            </div>
          </div>

          {nextCall && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-6 bg-slate-900 text-white border-none shadow-xl shadow-slate-200 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary-600/20 rounded-full blur-2xl group-hover:bg-primary-600/30 transition-all"></div>
              <div className="flex items-center space-x-2 mb-4 relative z-10">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-300">Next Planned Call</h4>
              </div>
              <p className="text-xl font-black mb-1 relative z-10">{nextCall.subject}</p>
              <p className="text-sm text-slate-400 font-medium mb-4 relative z-10">
                {new Date(nextCall.startTime).toLocaleDateString()} at {new Date(nextCall.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <button className="w-full py-3 bg-primary-600 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-primary-500 transition-all flex items-center justify-center space-x-2 relative z-10">
                <Phone className="w-4 h-4" />
                <span>Start Call Now</span>
              </button>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
            <div className="flex space-x-8">
              {['Planned', 'Held', 'Missed'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="callTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode='popLayout'>
              {filteredCalls.length > 0 ? (
                filteredCalls.map((call) => (
                  <motion.div 
                    key={call._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all border-l-4 border-l-primary-600 group"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none">
                          {new Date(call.startTime).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                          {new Date(call.startTime).getDate()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                          {call.subject}
                        </h4>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-2">
                          <div className="flex items-center text-xs text-slate-500 font-bold">
                            {getCallTypeIcon(call.callType)}
                            {call.callType}
                          </div>
                          <div className="flex items-center text-xs text-slate-500 font-bold">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                            {new Date(call.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({call.duration})
                          </div>
                          <div className="flex items-center text-xs text-slate-500 font-bold">
                            <Filter className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                            {call.callPurpose}
                          </div>
                          <div className="flex items-center text-xs text-slate-500 font-bold">
                            <Activity className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                            {call.relatedTo}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4">
                      {call.status === 'Held' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveAnalysisCall(call); }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 transition-colors border border-indigo-100 dark:border-indigo-800"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          Analyze Call
                        </button>
                      )}
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(call.status)}`}>
                        {call.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => deleteCall(call._id)}
                          className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-24 text-center glass-card border-dashed border-2"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-slate-800">
                    <Phone className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">No {activeTab} Calls</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">Your call log is empty for this category.</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-8 btn-primary px-8 py-3 font-black uppercase tracking-widest text-xs"
                  >
                    Log Your First Call
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AddCallModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCallAdded={handleCallAdded} 
      />
      
      <AnalyzeCallModal
        isOpen={!!activeAnalysisCall}
        onClose={() => setActiveAnalysisCall(null)}
        call={activeAnalysisCall}
      />
    </div>
  );
};

export default Calls;

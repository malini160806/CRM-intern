import React, { useState, useEffect } from 'react';
import { 
  Headphones, Plus, Search, Filter, 
  MoreVertical, Clock, CheckCircle2, 
  AlertCircle, MessageSquare, User, 
  Building2, Trash2, Edit3, Loader2
} from 'lucide-react';
import axios from 'axios';
import AddCaseModal from '../components/AddCaseModal';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCases = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const response = await axios.get('/api/cases', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCases(response.data);
    } catch (err) {
      console.error('Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCaseAdded = (newCase) => {
    setCases(prev => [newCase, ...prev]);
  };

  const deleteCase = async (id) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`/api/cases/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCases(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('Failed to delete case');
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-50 text-red-600 border-red-100';
      case 'High': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Medium': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Closed': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const calculateMetrics = () => {
    const urgent = cases.filter(c => c.priority === 'Urgent' && c.status !== 'Closed').length;
    const inProgress = cases.filter(c => c.status === 'In Progress').length;
    const resolvedToday = cases.filter(c => c.status === 'Resolved').length; // Simplified for demo
    
    return { urgent, inProgress, resolvedToday };
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Support Cases</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Resolve customer issues and track satisfaction</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 shadow-xl shadow-primary-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-xs">Create Case</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-red-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Urgent Issues</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{metrics.urgent}</h3>
          <p className="text-xs text-slate-400 mt-1 font-bold">Require immediate attention</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-amber-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Tickets</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{metrics.inProgress}</h3>
          <p className="text-xs text-slate-400 mt-1 font-bold">Currently being handled</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Resolved Cases</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{metrics.resolvedToday}</h3>
          <p className="text-xs text-slate-400 mt-1 font-bold">Successfully completed</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="text" placeholder="Search cases..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
          </div>
          <div className="flex items-center space-x-3">
            <select className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500">
              <option>Priority: All</option>
              <option>Priority: Urgent</option>
              <option>Priority: High</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact / Account</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Opened</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((c) => (
                <tr key={c._id} className="hover:bg-primary-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 group-hover:text-primary-600 transition-colors">{c.subject}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{c.caseNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2 text-sm font-bold text-slate-600">
                        <User className="w-3 h-3 text-slate-300" />
                        <span>{c.contact?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] font-medium text-slate-400">
                        <Building2 className="w-3 h-3 text-slate-300" />
                        <span>{c.account?.name || 'No Account'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getPriorityStyle(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button 
                        onClick={() => deleteCase(c._id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cases.length === 0 && !loading && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No cases found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">All customers are currently satisfied. Good job!</p>
          </div>
        )}
      </div>

      <AddCaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCaseAdded={handleCaseAdded} 
      />
    </div>
  );
};

export default Cases;

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Search, Filter, 
  Tag, Clock, CheckCircle2, AlertCircle, 
  MoreVertical, Edit3, Trash2, Loader2,
  ExternalLink, ChevronRight
} from 'lucide-react';
import axios from 'axios';
import AddSolutionModal from '../components/AddSolutionModal';

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSolutions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const response = await axios.get('/api/solutions', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSolutions(response.data);
    } catch (err) {
      console.error('Failed to fetch solutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const handleSolutionAdded = (newSolution) => {
    setSolutions(prev => [newSolution, ...prev]);
  };

  const deleteSolution = async (id) => {
    if (!window.confirm('Delete this solution?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`/api/solutions/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSolutions(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Failed to delete solution');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Published': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Draft': return 'bg-slate-50 text-slate-500 border-slate-100';
      case 'Reviewed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Internal': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const filteredSolutions = solutions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Solutions Library</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Knowledge base for consistent customer support</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 shadow-xl shadow-primary-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-xs">New Solution</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 bg-primary-600 text-white border-none md:col-span-1 flex flex-col justify-between">
          <div>
            <BookOpen className="w-10 h-10 mb-4 opacity-80" />
            <h3 className="text-xl font-black uppercase tracking-tight">Total Articles</h3>
            <p className="text-4xl font-black mt-2">{solutions.length}</p>
          </div>
          <p className="text-xs font-bold opacity-70 mt-4 tracking-widest uppercase">Knowledge base size</p>
        </div>
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Published</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">
              {solutions.filter(s => s.status === 'Published').length}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-bold">Available to all users</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-blue-500">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">In Review</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">
              {solutions.filter(s => s.status === 'Reviewed').length}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-bold">Pending final approval</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-slate-400">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Drafts</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">
              {solutions.filter(s => s.status === 'Draft').length}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-bold">Work in progress</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none" 
            />
          </div>
          <div className="flex items-center space-x-3">
            <select className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500">
              <option>Category: All</option>
              <option>Category: Technical</option>
              <option>Category: Billing</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredSolutions.map((solution) => (
            <div key={solution._id} className="glass-card p-6 hover:shadow-xl transition-all group border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(solution.status)}`}>
                  {solution.status}
                </span>
                <div className="flex space-x-1">
                  <button className="p-2 text-slate-300 hover:text-primary-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button 
                    onClick={() => deleteSolution(solution._id)}
                    className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h4 className="text-lg font-black text-slate-900 group-hover:text-primary-600 transition-colors mb-2">
                {solution.title}
              </h4>
              
              <p className="text-sm text-slate-500 line-clamp-3 mb-4">
                {solution.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <Tag className="w-3 h-3 text-primary-500" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{solution.category}</span>
                </div>
                <div className="flex items-center space-x-1 text-primary-600 font-bold text-xs uppercase tracking-widest">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSolutions.length === 0 && !loading && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No solutions found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">Create knowledge base articles to help your support team respond faster.</p>
          </div>
        )}
      </div>

      <AddSolutionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSolutionAdded={handleSolutionAdded} 
      />
    </div>
  );
};

export default Solutions;

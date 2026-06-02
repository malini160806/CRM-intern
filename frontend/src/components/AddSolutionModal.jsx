import React, { useState } from 'react';
import { X, BookOpen, Tag, Info, Loader2, Save } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AddSolutionModal = ({ isOpen, onClose, onSolutionAdded }) => {
  const [formData, setFormData] = useState({
    solutionNumber: `SOL-${Math.floor(100000 + Math.random() * 900000)}`,
    title: '',
    category: 'General',
    status: 'Draft',
    content: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('/api/solutions', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (onSolutionAdded) onSolutionAdded(response.data);
      onClose();
      // Reset form
      setFormData({
        solutionNumber: `SOL-${Math.floor(100000 + Math.random() * 900000)}`,
        title: '',
        category: 'General',
        status: 'Draft',
        content: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create solution');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Create Solution</h3>
            <p className="text-sm text-slate-500 font-medium">Add a new Knowledge Base article</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Solution ID</label>
              <input 
                disabled
                value={formData.solutionNumber}
                className="input-field bg-slate-50 opacity-70 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="input-field pl-12"
                >
                  <option value="General">General</option>
                  <option value="Technical">Technical</option>
                  <option value="Billing">Billing</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Known Bug">Known Bug</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                required
                placeholder="e.g., How to reset password"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="input-field pl-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="input-field"
            >
              <option value="Draft">Draft</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Published">Published</option>
              <option value="Internal">Internal</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Content / Resolution</label>
            <textarea 
              required
              rows="6"
              placeholder="Provide detailed steps or explanation for this solution..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="input-field resize-none py-4"
            />
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-50 transition-all dark:border-slate-700 dark:text-slate-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary py-4 flex items-center justify-center space-x-2 shadow-xl shadow-primary-200"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <Save className="w-5 h-5" />
                  <span className="font-black uppercase tracking-widest">Save Solution</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddSolutionModal;

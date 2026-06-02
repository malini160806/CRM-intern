import React, { useState, useEffect } from 'react';
import { X, Headphones, User, Building2, AlertTriangle, CheckCircle2, Loader2, FileText } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AddCaseModal = ({ isOpen, onClose, onCaseAdded }) => {
  const [formData, setFormData] = useState({
    caseNumber: `CAS-${Math.floor(100000 + Math.random() * 900000)}`,
    subject: '',
    contact: '',
    account: '',
    priority: 'Medium',
    status: 'New',
    description: ''
  });

  const [contacts, setContacts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setFetchingData(true);
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const headers = { Authorization: `Bearer ${user.token}` };
          
          const [contactsRes, accountsRes] = await Promise.all([
            axios.get('/api/contacts', { headers }),
            axios.get('/api/accounts', { headers })
          ]);

          setContacts(contactsRes.data);
          setAccounts(accountsRes.data);
        } catch (err) {
          console.error('Failed to fetch modal data');
        } finally {
          setFetchingData(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('/api/cases', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (onCaseAdded) onCaseAdded(response.data);
      onClose();
      // Reset form
      setFormData({
        caseNumber: `CAS-${Math.floor(100000 + Math.random() * 900000)}`,
        subject: '',
        contact: '',
        account: '',
        priority: 'Medium',
        status: 'New',
        description: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create case');
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
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Open Support Case</h3>
            <p className="text-sm text-slate-500 font-medium">Log a new customer issue for resolution</p>
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Case ID</label>
              <div className="relative">
                <Headphones className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  disabled
                  value={formData.caseNumber}
                  className="input-field pl-12 bg-slate-50 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="input-field"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject / Issue Title</label>
            <input 
              required
              placeholder="e.g., Billing mismatch in Q3 invoice"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Related Contact</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <select 
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="input-field pl-12"
                >
                  <option value="">Select a contact</option>
                  {contacts.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <select 
                  value={formData.account}
                  onChange={(e) => setFormData({...formData, account: e.target.value})}
                  className="input-field pl-12"
                >
                  <option value="">Select an account (Optional)</option>
                  {accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              rows="4"
              placeholder="Detailed description of the customer issue..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              disabled={loading || fetchingData}
              className="flex-[2] btn-primary py-4 flex items-center justify-center space-x-2 shadow-xl shadow-primary-200"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="font-black uppercase tracking-widest">Create Case</span>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCaseModal;

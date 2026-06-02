import React, { useState, useEffect } from 'react';
import { X, User, Building2, Mail, Phone, TrendingUp, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AddLeadModal = ({ isOpen, onClose, onLeadAdded, onLeadUpdated, leadToEdit }) => {
  const defaultForm = {
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Warm',
    leadScore: 50,
    assignedTo: ''
  };
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [salesPersons, setSalesPersons] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userRole = user.role?.toLowerCase();
        if (!user || (userRole !== 'ceo' && userRole !== 'saleslead' && userRole !== 'admin')) return;
        
        const response = await axios.get('/api/users/company', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (userRole === 'saleslead') {
          setSalesPersons(response.data.filter(m => m.role?.toLowerCase() === 'salesperson' && m.assignedSalesLead === user._id));
        } else {
          setSalesPersons(response.data.filter(m => m.role?.toLowerCase() === 'salesperson'));
        }
      } catch (err) {
        console.error('Failed to fetch team members', err);
      }
    };
    if (isOpen) {
      fetchTeam();
    }
  }, [isOpen]);

  useEffect(() => {
    if (leadToEdit) {
      setFormData({
        name: leadToEdit.name || '',
        company: leadToEdit.company || '',
        email: leadToEdit.email || '',
        phone: leadToEdit.phone || '',
        status: leadToEdit.status || 'Warm',
        leadScore: leadToEdit.leadScore || 50,
        assignedTo: leadToEdit.assignedTo?._id || leadToEdit.assignedTo || ''
      });
    } else {
      setFormData(defaultForm);
    }
  }, [leadToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('Authentication expired. Please login again.');
      }
      
      const payload = { ...formData };
      if (!payload.assignedTo) {
        delete payload.assignedTo;
      }

      let response;
      if (leadToEdit) {
        response = await axios.put(`/api/leads/${leadToEdit._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (onLeadUpdated) onLeadUpdated(response.data);
      } else {
        response = await axios.post('/api/leads', payload, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (onLeadAdded) onLeadAdded(response.data);
      }
      onClose();
      setFormData(defaultForm);
    } catch (err) {
      console.error('Lead Creation Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add lead';
      setError(errorMessage);
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
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {leadToEdit ? 'Edit Lead' : 'Add New Lead'}
            </h3>
            <p className="text-sm text-slate-500 font-medium">Capture high-potential opportunities</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Lead Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Company</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                <option value="New Lead">✨ New Lead</option>
                <option value="Contacted">📞 Contacted</option>
                <option value="Warm">☀️ Warm</option>
                <option value="Cold">❄️ Cold</option>
                <option value="Hot / High Potential">🔥 Hot / High Potential</option>
                <option value="Meeting Scheduled">📅 Meeting Scheduled</option>
                <option value="Converted">✅ Converted</option>
                <option value="Lost">❌ Lost</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Initial Lead Score</label>
                <span className="text-xs font-bold text-primary-600">{formData.leadScore}%</span>
              </div>
              <input 
                type="range"
                name="leadScore"
                min="0"
                max="100"
                value={formData.leadScore}
                onChange={handleChange}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600 dark:bg-slate-800"
              />
            </div>
            
            {salesPersons.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Assign To</label>
                <select 
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                >
                  <option value="">Unassigned</option>
                  {salesPersons.map(person => (
                    <option key={person._id} value={person._id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary py-3 flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{leadToEdit ? 'Save Changes' : 'Create Lead'}</span>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddLeadModal;

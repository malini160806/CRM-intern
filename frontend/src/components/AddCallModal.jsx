import React, { useState, useEffect } from 'react';
import { X, Phone, Clock, Calendar, User, Loader2, AlignLeft, Target, Activity } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AddCallModal = ({ isOpen, onClose, onCallAdded }) => {
  const [formData, setFormData] = useState({
    subject: '',
    callType: 'Outbound',
    callPurpose: 'Prospecting',
    startTime: '',
    duration: '15:00',
    status: 'Planned',
    description: '',
    relatedTo: 'Lead',
    relatedId: ''
  });
  
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingItems, setFetchingItems] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchRelatedItems = async () => {
        setFetchingItems(true);
        try {
          const userStr = localStorage.getItem('user');
          if (!userStr) {
            setError('User session not found. Please login again.');
            setFetchingItems(false);
            return;
          }
          const user = JSON.parse(userStr);
          let endpoint = '/api/leads';
          if (formData.relatedTo === 'Contact') endpoint = '/api/contacts';
          if (formData.relatedTo === 'Account') endpoint = '/api/accounts';
          if (formData.relatedTo === 'Deal') endpoint = '/api/deals';

          const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setRelatedItems(response.data);
          if (response.data.length > 0) {
            setFormData(prev => ({ ...prev, relatedId: response.data[0]._id }));
          } else {
            setFormData(prev => ({ ...prev, relatedId: '' }));
          }
        } catch (err) {
          console.error(`Failed to fetch ${formData.relatedTo}s`);
        } finally {
          setFetchingItems(false);
        }
      };
      fetchRelatedItems();
    }
  }, [isOpen, formData.relatedTo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error('No user session found');

      const response = await axios.post('/api/calls', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      if (onCallAdded) onCallAdded(response.data);
      onClose();
      // Reset form
      setFormData({
        subject: '',
        callType: 'Outbound',
        callPurpose: 'Prospecting',
        startTime: '',
        duration: '15:00',
        status: 'Planned',
        description: '',
        relatedTo: 'Lead',
        relatedId: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log call. Please try again.');
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
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Log / Schedule Call</h3>
            <p className="text-sm text-slate-500 font-medium">Capture details of your interaction</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Related To</label>
              <select 
                name="relatedTo"
                value={formData.relatedTo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="Lead">Lead</option>
                <option value="Contact">Contact</option>
                <option value="Account">Account</option>
                <option value="Deal">Deal</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Select {formData.relatedTo}</label>
              <select 
                name="relatedId"
                required
                value={formData.relatedId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {fetchingItems ? (
                  <option>Loading...</option>
                ) : relatedItems.length > 0 ? (
                  relatedItems.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name || item.title || item.company || 'Unnamed'}
                    </option>
                  ))
                ) : (
                  <option disabled>No {formData.relatedTo}s found</option>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Subject</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                placeholder="e.g. Follow up on proposal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Call Type</label>
              <select 
                name="callType"
                value={formData.callType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="Outbound">Outbound</option>
                <option value="Inbound">Inbound</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Purpose</label>
              <select 
                name="callPurpose"
                value={formData.callPurpose}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="Prospecting">Prospecting</option>
                <option value="Administrative">Administrative</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Demo">Demo</option>
                <option value="Project Management">Project Management</option>
                <option value="Support">Support</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Start Time</label>
              <input 
                name="startTime"
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Duration (MM:SS)</label>
              <input 
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="15:00"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              <option value="Planned">Planned</option>
              <option value="Held">Held</option>
              <option value="Missed">Missed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Description / Notes</label>
            <textarea 
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
              placeholder="Summary of the call..."
            />
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
              disabled={loading || !formData.relatedId}
              className="flex-[2] btn-primary py-3 flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Save Call</span>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCallModal;

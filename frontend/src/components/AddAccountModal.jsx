import React, { useState } from 'react';
import { X, Building2, Globe, Phone, Users, DollarSign, Loader2, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AddAccountModal = ({ isOpen, onClose, onAccountAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    revenue: '',
    employees: '',
    website: '',
    phone: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      const response = await axios.post('/api/accounts', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (onAccountAdded) onAccountAdded(response.data);
      onClose();
      setFormData({
        name: '', industry: '', revenue: '', employees: '',
        website: '', phone: '',
        billingAddress: { street: '', city: '', state: '', zip: '', country: '' }
      });
    } catch (err) {
      console.error('Account Creation Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add account';
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
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">New Enterprise Account</h3>
            <p className="text-sm text-slate-500 font-medium">Onboard a new organization to your ecosystem</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  name="name" required value={formData.name} onChange={handleChange}
                  className="input-field pl-12" placeholder="e.g. Nexus Industries"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Industry</label>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  name="industry" value={formData.industry} onChange={handleChange}
                  className="input-field pl-12" placeholder="e.g. Technology"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Annual Revenue</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  name="revenue" type="number" value={formData.revenue} onChange={handleChange}
                  className="input-field pl-12" placeholder="e.g. 5000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Employees</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  name="employees" type="number" value={formData.employees} onChange={handleChange}
                  className="input-field pl-12" placeholder="e.g. 150"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  name="website" value={formData.website} onChange={handleChange}
                  className="input-field pl-12" placeholder="e.g. https://nexus.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  name="phone" value={formData.phone} onChange={handleChange}
                  className="input-field pl-12" placeholder="e.g. +1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Billing Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="billingAddress.street" value={formData.billingAddress.street} onChange={handleChange} className="input-field md:col-span-2" placeholder="Street Address" />
              <input name="billingAddress.city" value={formData.billingAddress.city} onChange={handleChange} className="input-field" placeholder="City" />
              <input name="billingAddress.state" value={formData.billingAddress.state} onChange={handleChange} className="input-field" placeholder="State/Province" />
              <input name="billingAddress.zip" value={formData.billingAddress.zip} onChange={handleChange} className="input-field" placeholder="Zip/Postal Code" />
              <input name="billingAddress.country" value={formData.billingAddress.country} onChange={handleChange} className="input-field" placeholder="Country" />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-4 border border-slate-200 text-slate-600 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all dark:border-slate-700 dark:text-slate-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary py-4 flex items-center justify-center space-x-2 shadow-xl shadow-primary-200"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="font-black uppercase tracking-widest">Create Account</span>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddAccountModal;

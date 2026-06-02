import React, { useState } from 'react';
import { X, Package, Tag, DollarSign, Layers, Info, Loader2, Box } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    unitPrice: '',
    quantityInStock: '',
    description: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (onProductAdded) onProductAdded(response.data);
      onClose();
      setFormData({
        name: '', code: '', category: '', unitPrice: '',
        quantityInStock: '', description: '', status: 'Active'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
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
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Add New Product</h3>
            <p className="text-sm text-slate-500 font-medium">Add a new item to your enterprise catalog</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                name="name" required value={formData.name} onChange={handleChange}
                className="input-field pl-12" placeholder="e.g. Enterprise Cloud License"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Code</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  name="code" required value={formData.code} onChange={handleChange}
                  className="input-field pl-12" placeholder="SKU-001"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  name="category" value={formData.category} onChange={handleChange}
                  className="input-field pl-12" placeholder="Software"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Unit Price</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  name="unitPrice" type="number" required value={formData.unitPrice} onChange={handleChange}
                  className="input-field pl-12" placeholder="99.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Stock Quantity</label>
              <div className="relative">
                <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  name="quantityInStock" type="number" value={formData.quantityInStock} onChange={handleChange}
                  className="input-field pl-12" placeholder="100"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <div className="relative">
              <Info className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
              <textarea 
                name="description" value={formData.description} onChange={handleChange}
                className="input-field pl-12 min-h-[100px] py-3" placeholder="Brief product description..."
              />
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all dark:border-slate-700 dark:text-slate-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary py-3 flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="font-black uppercase tracking-widest text-xs">Save Product</span>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProductModal;

import React, { useState, useEffect } from 'react';
import { X, FileText, Building2, Trophy, DollarSign, Calendar, Plus, Trash2, Loader2, Package } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AddQuoteModal = ({ isOpen, onClose, onQuoteAdded }) => {
  const [formData, setFormData] = useState({
    quoteNumber: `QT-${Math.floor(100000 + Math.random() * 900000)}`,
    deal: '',
    account: '',
    items: [{ product: '', quantity: 1, price: 0 }],
    status: 'Draft',
    validUntil: '',
    tax: 0
  });

  const [deals, setDeals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [products, setProducts] = useState([]);
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
          
          const [dealsRes, accountsRes, productsRes] = await Promise.all([
            axios.get('/api/deals', { headers }),
            axios.get('/api/accounts', { headers }),
            axios.get('/api/products', { headers })
          ]);

          setDeals(dealsRes.data);
          setAccounts(accountsRes.data);
          setProducts(productsRes.data);

          if (dealsRes.data.length > 0) setFormData(prev => ({ ...prev, deal: dealsRes.data[0]._id }));
          if (accountsRes.data.length > 0) setFormData(prev => ({ ...prev, account: accountsRes.data[0]._id }));
        } catch (err) {
          console.error('Failed to fetch modal data');
        } finally {
          setFetchingData(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === 'product') {
      const product = products.find(p => p._id === value);
      newItems[index] = { 
        ...newItems[index], 
        product: value, 
        price: product ? product.unitPrice : 0 
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { product: '', quantity: 1, price: 0 }] });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    return subTotal + (subTotal * (formData.tax / 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const subTotal = calculateSubTotal();
      const totalAmount = calculateTotal();

      const submissionData = {
        ...formData,
        subTotal,
        totalAmount
      };

      const response = await axios.post('/api/quotes', submissionData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (onQuoteAdded) onQuoteAdded(response.data);
      onClose();
      // Reset form
      setFormData({
        quoteNumber: `QT-${Math.floor(100000 + Math.random() * 900000)}`,
        deal: deals.length > 0 ? deals[0]._id : '',
        account: accounts.length > 0 ? accounts[0]._id : '',
        items: [{ product: '', quantity: 1, price: 0 }],
        status: 'Draft',
        validUntil: '',
        tax: 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quote');
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
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Create Quote</h3>
            <p className="text-sm text-slate-500 font-medium">Draft a formal proposal for your prospect</p>
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Quote #</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  disabled
                  value={formData.quoteNumber}
                  className="input-field pl-12 bg-slate-50 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Valid Until</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="date"
                  name="validUntil"
                  required
                  value={formData.validUntil}
                  onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                  className="input-field pl-12"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Related Deal</label>
              <div className="relative">
                <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <select 
                  required
                  value={formData.deal}
                  onChange={(e) => setFormData({...formData, deal: e.target.value})}
                  className="input-field pl-12"
                >
                  <option value="">Select a deal</option>
                  {deals.map(d => <option key={d._id} value={d._id}>{d.title}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account / Client</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <select 
                  required
                  value={formData.account}
                  onChange={(e) => setFormData({...formData, account: e.target.value})}
                  className="input-field pl-12"
                >
                  <option value="">Select an account</option>
                  {accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Quote Items</h4>
              <button 
                type="button"
                onClick={addItem}
                className="text-xs font-black text-primary-600 flex items-center space-x-1 hover:text-primary-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-6 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <select 
                        required
                        value={item.product}
                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                        className="input-field pl-9 text-sm py-2"
                      >
                        <option value="">Select product</option>
                        {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</label>
                    <input 
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      className="input-field text-sm py-2 px-3"
                    />
                  </div>
                  <div className="col-span-3 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                        className="input-field pl-8 text-sm py-2"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 pb-1">
                    <button 
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-end space-y-2">
            <div className="flex justify-between w-full max-w-[240px]">
              <span className="text-xs font-black text-slate-400 uppercase">Subtotal:</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">${calculateSubTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-full max-w-[240px] items-center">
              <span className="text-xs font-black text-slate-400 uppercase">Tax (%):</span>
              <input 
                type="number"
                value={formData.tax}
                onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value) || 0})}
                className="w-16 text-right text-sm font-black text-slate-900 dark:text-white bg-transparent outline-none border-b border-dashed border-slate-200 focus:border-primary-500"
              />
            </div>
            <div className="flex justify-between w-full max-w-[240px] pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase">Total Amount:</span>
              <span className="text-lg font-black text-primary-600">${calculateTotal().toLocaleString()}</span>
            </div>
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
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="font-black uppercase tracking-widest">Create Quote</span>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddQuoteModal;

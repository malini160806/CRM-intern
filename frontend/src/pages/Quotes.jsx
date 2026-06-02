import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Filter, 
  MoreVertical, DollarSign, Calendar, Clock,
  ArrowUpRight, Download, Send, CheckCircle2,
  FileCheck, XCircle, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import AddQuoteModal from '../components/AddQuoteModal';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuotes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const response = await axios.get('/api/quotes', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setQuotes(response.data);
    } catch (err) {
      console.error('Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleQuoteAdded = (newQuote) => {
    setQuotes(prev => [newQuote, ...prev]);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      case 'Negotiation': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Expired': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.put(`/api/quotes/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setQuotes(quotes.map(q => q._id === id ? response.data : q));
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const calculateMetrics = () => {
    const totalValue = quotes.reduce((sum, q) => sum + (q.totalAmount || 0), 0);
    const approved = quotes.filter(q => q.status === 'Approved').length;
    const pending = quotes.filter(q => q.status === 'Draft' || q.status === 'Negotiation').length;
    
    return { totalValue, approved, pending };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Proposals & Quotes</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage formal proposals, agreements, and pricing</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 shadow-xl shadow-primary-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-xs">Create Quote</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-primary-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Quote Value</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">${metrics.totalValue.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-1 font-bold">Pipeline across {quotes.length} quotes</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Approved Proposals</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{metrics.approved}</h3>
          <p className="text-xs text-slate-400 mt-1 font-bold">Ready for conversion to invoice</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-amber-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">In Negotiation</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{metrics.pending}</h3>
          <p className="text-xs text-slate-400 mt-1 font-bold">Active follow-ups required</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="text" placeholder="Search quotes..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
          </div>
          <div className="flex items-center space-x-3">
            <select className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500">
              <option>Status: All</option>
              <option>Status: Approved</option>
              <option>Status: Negotiation</option>
              <option>Status: Expired</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quote Number</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valid Until</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((quote) => (
                <tr key={quote._id} className="hover:bg-primary-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <FileCheck className="w-5 h-5 text-primary-500" />
                      <span className="text-sm font-black text-slate-900">{quote.quoteNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">
                    {quote.account?.name || 'Unknown Account'}
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">
                    ${quote.totalAmount?.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <select 
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Approved">Approve</option>
                        <option value="Rejected">Reject</option>
                        <option value="Expired">Expire</option>
                      </select>
                      <button className="p-2 text-slate-400 hover:text-primary-600"><Download className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-primary-600"><Send className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {quotes.length === 0 && !loading && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No quotes yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">Start creating formal quotes for your deals and accounts.</p>
          </div>
        )}
      </div>

      <AddQuoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onQuoteAdded={handleQuoteAdded} 
      />
    </div>
  );
};

export default Quotes;

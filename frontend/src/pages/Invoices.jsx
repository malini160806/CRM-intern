import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Filter, 
  MoreVertical, DollarSign, Calendar, Clock,
  ArrowUpRight, Download, Send, CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import AddInvoiceModal from '../components/AddInvoiceModal';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const response = await axios.get('/api/invoices', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setInvoices(response.data);
    } catch (err) {
      console.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const outstanding = invoices
      .filter(inv => inv.status !== 'Paid' && inv.status !== 'Cancelled')
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const received = invoices
      .filter(inv => inv.status === 'Paid')
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const overdue = invoices
      .filter(inv => inv.status === 'Overdue')
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    return { outstanding, received, overdue };
  };

  const metrics = calculateMetrics();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleInvoiceAdded = (newInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Overdue': return 'bg-red-50 text-red-600 border-red-100';
      case 'Sent': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Invoice Management</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Track billing, payments, and revenue collection</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 shadow-xl shadow-primary-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-xs">Create Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-primary-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Outstanding</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">${metrics.outstanding.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-1 font-bold">From {invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled').length} active invoices</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Received (Total)</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">${metrics.received.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-1 font-bold">From {invoices.filter(i => i.status === 'Paid').length} paid invoices</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-red-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Overdue Amount</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">${metrics.overdue.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-1 font-bold">{invoices.filter(i => i.status === 'Overdue').length} invoices late</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-500" />
            <input type="text" placeholder="Search invoices..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none dark:bg-[#1c1c1e] dark:border-[#38383a] dark:text-white dark:placeholder-slate-500" />
          </div>
          <div className="flex items-center space-x-3">
            <select className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:bg-[#1c1c1e] dark:border-[#38383a] dark:text-slate-300">
              <option>Status: All</option>
              <option>Status: Paid</option>
              <option>Status: Overdue</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Number</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-primary-50/30 dark:hover:bg-slate-800/50 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-primary-500" />
                      <span className="text-sm font-black text-slate-900 dark:text-white">{invoice.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">
                    {invoice.account?.name || 'Unknown Account'}
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900 dark:text-white">
                    ${invoice.totalAmount?.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-primary-600"><Download className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-primary-600"><Send className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoices.length === 0 && !loading && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-200 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">No invoices yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2">Start generating invoices for your closed deals and accounts.</p>
          </div>
        )}
      </div>
      
      <AddInvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onInvoiceAdded={handleInvoiceAdded} 
      />
    </div>
  );
};

export default Invoices;

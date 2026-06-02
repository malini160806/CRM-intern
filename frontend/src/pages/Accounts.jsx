import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Plus, Building2, 
  Globe, Phone, Users, DollarSign,
  MoreHorizontal, Mail, MapPin, ExternalLink
} from 'lucide-react';
import axios from 'axios';
import AddAccountModal from '../components/AddAccountModal';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchAccounts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const response = await axios.get('/api/accounts', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAccounts(response.data);
    } catch (err) {
      console.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAccountAdded = (newAccount) => {
    setAccounts([newAccount, ...accounts]);
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAccounts(accounts.filter(a => a._id !== id));
    } catch (err) {
      console.error('Failed to delete account');
      alert('Failed to delete account.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Enterprise Accounts</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and track your global business organizations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 shadow-xl shadow-primary-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-xs">Add Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account._id} className="glass-card p-6 hover:shadow-xl hover:shadow-slate-100 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <div className="relative">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setOpenDropdownId(openDropdownId === account._id ? null : account._id); 
                  }}
                  className={`p-2 rounded-lg transition-all ${openDropdownId === account._id ? 'bg-[#e5e5ea] text-[#1d1d1f]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {openDropdownId === account._id && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1c1c1e] border border-[#e5e5ea] dark:border-[#38383a] rounded-xl shadow-lg z-50 py-1 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      onClick={() => {
                        setOpenDropdownId(null);
                        alert('Edit functionality coming soon!');
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
                    >
                      Edit Account
                    </button>
                    <div className="h-px bg-[#e5e5ea] dark:bg-[#38383a] my-1"></div>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation();
                        setOpenDropdownId(null); 
                        handleDeleteAccount(account._id);
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-[#ff3b30] hover:bg-[#ffe6e6] dark:hover:bg-[#ff3b30]/20 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                {account.name}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {account.industry || 'Unknown Industry'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl dark:bg-slate-800/50">
                <p className="text-[10px] font-black text-slate-400 uppercase">Revenue</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  ${(account.revenue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl dark:bg-slate-800/50">
                <p className="text-[10px] font-black text-slate-400 uppercase">Size</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {account.employees || 0} Emp
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center text-sm text-slate-500 font-medium">
                <Globe className="w-4 h-4 mr-3 text-slate-300" />
                <span className="truncate">{account.website || 'No website'}</span>
              </div>
              <div className="flex items-center text-sm text-slate-500 font-medium">
                <MapPin className="w-4 h-4 mr-3 text-slate-300" />
                <span>{account.billingAddress?.city || 'No city'}, {account.billingAddress?.country || 'No country'}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/accounts/${account._id}`)}
              className="w-full mt-6 py-3 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all flex items-center justify-center group"
            >
              <span>View Organization</span>
              <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        ))}
      </div>

      {accounts.length === 0 && !loading && (
        <div className="glass-card p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-slate-800">
            <Building2 className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">No accounts found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">Start your enterprise management by adding your first client organization.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-8 text-primary-600 font-black hover:underline"
          >
            + Add Your First Account
          </button>
        </div>
      )}

      <AddAccountModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAccountAdded={handleAccountAdded} 
      />
    </div>
  );
};

export default Accounts;

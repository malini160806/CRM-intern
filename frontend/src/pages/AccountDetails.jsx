import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, ArrowLeft, Mail, Phone, Globe, MapPin, Users, DollarSign, FileCheck, Search } from 'lucide-react';

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;
        
        const response = await axios.get(`/api/accounts/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        setAccount(response.data.account);
        setLeads(response.data.leads || []);
      } catch (err) {
        console.error('Failed to fetch account details', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccountDetails();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Loading account data...</div>;
  }

  if (!account) {
    return <div className="p-8 text-center text-red-500 font-bold">Account not found.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => navigate('/accounts')}
          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary-600" />
            {account.name}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Enterprise Account Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Company Profile</h3>
            
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Globe className="w-4 h-4 mr-3 text-slate-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">{account.website || 'No website'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-3 text-slate-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">{account.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {account.billingAddress?.city || 'City'}, {account.billingAddress?.country || 'Country'}
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-6" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl dark:bg-slate-800/50">
                <p className="text-[10px] font-black text-slate-400 uppercase">Industry</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{account.industry || 'N/A'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl dark:bg-slate-800/50">
                <p className="text-[10px] font-black text-slate-400 uppercase">Employees</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{account.employees || 0}</p>
              </div>
              <div className="col-span-2 p-4 bg-primary-50 rounded-xl dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/30">
                <p className="text-[10px] font-black text-primary-600 uppercase">Annual Revenue</p>
                <p className="text-xl font-black text-primary-700 dark:text-primary-400">${(account.revenue || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Linked Leads & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Linked Leads & Contacts</h3>
              <button 
                onClick={() => navigate('/leads')}
                className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline"
              >
                + Link Lead
              </button>
            </div>
            
            {leads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leads.map(lead => (
                      <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => navigate(`/leads/${lead._id}`)}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">{lead.name}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">
                          {lead.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <p className="text-sm font-bold text-slate-500">No leads linked to this account yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;

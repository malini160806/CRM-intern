import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Mail,
  MoreHorizontal,
  Users
} from 'lucide-react';
import axios from 'axios';

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/leads', {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }
        });
        setLeads(response.data);
      } catch (err) {
        console.error('Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hot': return 'bg-red-100 text-red-600 border-red-200';
      case 'Warm': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Cold': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Leads Management</h2>
          <p className="text-slate-500 dark:text-slate-400">Total {leads.length} leads found</p>
        </div>
        <button className="btn-primary flex items-center space-x-2 w-fit">
          <Plus className="w-5 h-5" />
          <span>Add New Lead</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name, company or email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-600 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
              <option>Sort by: Lead Score</option>
              <option>Sort by: Newest</option>
              <option>Sort by: Last Activity</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold dark:bg-slate-800">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                        <div 
                          className={`h-full rounded-full ${lead.leadScore > 80 ? 'bg-red-500' : lead.leadScore > 50 ? 'bg-orange-500' : 'bg-blue-500'}`}
                          style={{ width: `${lead.leadScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{lead.leadScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex -space-x-2 overflow-hidden">
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 dark:ring-slate-900"></div>
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-300 dark:ring-slate-900"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(lead.lastActivity).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 border border-slate-100 rounded-lg transition-all dark:border-slate-800 dark:hover:bg-slate-800">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 border border-slate-100 rounded-lg transition-all dark:border-slate-800 dark:hover:bg-slate-800">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 border border-slate-100 rounded-lg transition-all dark:border-slate-800 dark:hover:bg-slate-800">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {leads.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between dark:border-slate-800">
            <span className="text-sm text-slate-500">
              Showing 1 to {leads.length} of {leads.length} leads
            </span>
            <div className="flex space-x-2">
              <button disabled className="p-2 border border-slate-200 rounded-lg text-slate-400 dark:border-slate-700">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">1</button>
              <button disabled className="p-2 border border-slate-200 rounded-lg text-slate-400 dark:border-slate-700">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        {leads.length === 0 && !loading && (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No leads yet</h3>
            <p className="text-slate-500">Add your first lead to start tracking your sales pipeline.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsList;

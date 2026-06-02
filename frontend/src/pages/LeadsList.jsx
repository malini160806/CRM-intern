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
  Users,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddLeadModal from '../components/AddLeadModal';
import CallModal from '../components/CallModal';
import UploadLeadsModal from '../components/UploadLeadsModal';

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [callingContact, setCallingContact] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [salesPersons, setSalesPersons] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Lead Score');
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchLeadsAndTeam = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      
      const response = await axios.get('/api/leads', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setLeads(response.data);

      const userRole = user.role?.toLowerCase();
      if (userRole === 'saleslead' || userRole === 'admin' || userRole === 'ceo') {
        const teamRes = await axios.get('/api/users/company', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (userRole === 'saleslead') {
          setSalesPersons(teamRes.data.filter(m => m.role?.toLowerCase() === 'salesperson' && m.assignedSalesLead === user._id));
        } else {
          setSalesPersons(teamRes.data.filter(m => m.role?.toLowerCase() === 'salesperson'));
        }
      }
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsAndTeam();
  }, []);

  const handleAssignLead = async (leadId, salesPersonId) => {
    try {
      setAssigningId(leadId);
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post('/api/assignments/lead', {
        salesPersonId,
        leadId
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Update the lead in the local state
      const leadRes = await axios.get(`/api/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setLeads(leads.map(l => l._id === leadId ? leadRes.data : l));
    } catch (err) {
      console.error('Failed to assign lead', err);
      alert('Failed to assign lead.');
    } finally {
      setAssigningId(null);
    }
  };

  const handleLeadAdded = (newLead) => {
    setLeads([newLead, ...leads]);
  };

  const handleLeadUpdated = (updatedLead) => {
    setLeads(leads.map(l => l._id === updatedLead._id ? updatedLead : l));
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setLeads(leads.filter(l => l._id !== id));
    } catch (err) {
      console.error('Failed to delete lead');
      alert('Failed to delete lead.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hot / High Potential': return 'bg-red-100 text-red-600 border-red-200';
      case 'Converted': return 'bg-green-100 text-green-600 border-green-200';
      case 'Meeting Scheduled': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Warm': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Contacted': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'New Lead': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Cold': return 'bg-slate-200 text-slate-600 border-slate-300';
      case 'Lost': return 'bg-gray-800 text-gray-300 border-gray-600';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const filteredAndSortedLeads = leads
    .filter(lead => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        (lead.name || '').toLowerCase().includes(term) ||
        (lead.company || '').toLowerCase().includes(term) ||
        (lead.email || '').toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'Lead Score') return (b.leadScore || 0) - (a.leadScore || 0);
      if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'Last Activity') return new Date(b.updatedAt) - new Date(a.updatedAt);
      return 0;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Leads Management</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Total {filteredAndSortedLeads.length} leads found in your pipeline</p>
        </div>
        {JSON.parse(localStorage.getItem('user'))?.role?.toLowerCase() !== 'salesperson' && (
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center space-x-2 w-fit px-4 py-3 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-bold rounded-xl transition-all shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <span className="font-bold">Upload CSV</span>
            </button>
            <button 
              onClick={() => { setLeadToEdit(null); setIsModalOpen(true); }}
              className="btn-primary flex items-center space-x-2 w-fit px-6 py-3 shadow-lg shadow-primary-200"
            >
              <Plus className="w-5 h-5" />
              <span className="font-bold">Add New Lead</span>
            </button>
          </div>
        )}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
              <Filter className="w-4 h-4" />
              <span className="font-bold">Filters</span>
            </button>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-600 font-bold outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
            >
              <option value="Lead Score">Sort by: Lead Score</option>
              <option value="Newest">Sort by: Newest</option>
              <option value="Last Activity">Sort by: Last Activity</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Lead Details</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Lead Score</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Assigned</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Created</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAndSortedLeads.map((lead) => (
                <tr 
                  key={lead._id} 
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-all group cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-100">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{lead.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{lead.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                        <div 
                          className={`h-full rounded-full ${lead.leadScore > 80 ? 'bg-red-500' : lead.leadScore > 50 ? 'bg-orange-500' : 'bg-blue-500'}`}
                          style={{ width: `${lead.leadScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">{lead.leadScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const user = JSON.parse(localStorage.getItem('user'));
                      const userRole = user?.role?.toLowerCase();
                      if ((userRole === 'saleslead' || userRole === 'admin' || userRole === 'ceo') && salesPersons.length > 0) {
                        return (
                          <div className="flex flex-col space-y-1">
                            <select 
                              className="bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold outline-none focus:ring-1 focus:ring-primary-500 max-w-[120px]"
                              value={lead.assignedTo?._id || lead.assignedTo || ''}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => { e.stopPropagation(); handleAssignLead(lead._id, e.target.value); }}
                              disabled={assigningId === lead._id}
                            >
                              <option value="">Unassigned</option>
                              {salesPersons.map(person => (
                                <option key={person._id} value={person._id}>
                                  {person.name}
                                </option>
                              ))}
                            </select>
                            {assigningId === lead._id && <span className="text-[9px] text-primary-500 font-bold">Assigning...</span>}
                          </div>
                        );
                      }
                      return (
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-[10px] font-black text-primary-600 dark:border-slate-900" title={lead.assignedTo?.name || 'Unassigned'}>
                            {lead.assignedTo?.name?.charAt(0) || 'U'}
                          </div>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-bold">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${lead.email}`; }}
                        className="p-2 text-[#515154] hover:text-[#0071e3] bg-white rounded-lg border border-[#e5e5ea] hover:border-[#0071e3] transition-all shadow-sm"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if(lead.phone) {
                            const cleanPhone = lead.phone.replace(/[^\d+]/g, '');
                            window.location.href = `tel:${cleanPhone}`;
                          } else {
                            alert('No phone number provided for this lead.');
                          }
                        }}
                        className="p-2 text-[#515154] hover:text-[#0071e3] bg-white rounded-lg border border-[#e5e5ea] hover:border-[#0071e3] transition-all shadow-sm"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if(lead.phone) {
                            const cleanPhone = lead.phone.replace(/\D/g, '');
                            window.open(`https://wa.me/${cleanPhone}`, '_blank');
                          } else {
                            alert('No phone number provided for this lead.');
                          }
                        }}
                        className="p-2 text-[#515154] hover:text-[#25D366] hover:border-[#25D366] bg-white rounded-lg border border-[#e5e5ea] transition-all shadow-sm"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setOpenDropdownId(openDropdownId === lead._id ? null : lead._id); 
                          }}
                          className={`p-2 rounded-lg transition-all ${openDropdownId === lead._id ? 'bg-[#e5e5ea] text-[#1d1d1f]' : 'text-[#515154] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'}`}
                          title="More Options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        {openDropdownId === lead._id && (
                          <div 
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1c1c1e] border border-[#e5e5ea] dark:border-[#38383a] rounded-xl shadow-lg z-50 py-1 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => navigate(`/leads/${lead._id}`)}
                              className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => { 
                                setOpenDropdownId(null); 
                                setLeadToEdit(lead); 
                                setIsModalOpen(true); 
                              }}
                              className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
                            >
                              Edit Lead
                            </button>
                            <div className="h-px bg-[#e5e5ea] dark:bg-[#38383a] my-1"></div>
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation();
                                setOpenDropdownId(null); 
                                handleDeleteLead(lead._id);
                              }}
                              className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-[#ff3b30] hover:bg-[#ffe6e6] dark:hover:bg-[#ff3b30]/20 transition-colors"
                            >
                              Delete Lead
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndSortedLeads.length === 0 && !loading && (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-slate-800">
              <Users className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {searchTerm ? 'No matching leads found' : 'No leads found'}
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              {searchTerm ? 'Try adjusting your search query or clear the search bar.' : 'Start your sales journey by adding your first enterprise lead to the pipeline.'}
            </p>
            {!searchTerm && JSON.parse(localStorage.getItem('user'))?.role?.toLowerCase() !== 'salesperson' && (
              <button 
                onClick={() => { setLeadToEdit(null); setIsModalOpen(true); }}
                className="mt-6 text-primary-600 font-black hover:underline"
              >
                + Add First Lead
              </button>
            )}
          </div>
        )}
      </div>

      <AddLeadModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setLeadToEdit(null); }} 
        onLeadAdded={handleLeadAdded} 
        onLeadUpdated={handleLeadUpdated}
        leadToEdit={leadToEdit}
      />

      <UploadLeadsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={fetchLeadsAndTeam}
      />

      <CallModal 
        isOpen={!!callingContact}
        onClose={() => setCallingContact(null)}
        contactInfo={callingContact}
      />
    </div>
  );
};

export default LeadsList;

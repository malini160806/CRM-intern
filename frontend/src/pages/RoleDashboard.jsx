import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Target, Briefcase, 
  BarChart3, Sparkles, Clock, ArrowUpRight,
  Shield, DollarSign, Activity, Calendar, User, Mail
} from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const RoleDashboard = ({ role }) => {
  const { user } = useSelector((state) => state.auth);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [salesLeads, setSalesLeads] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [assignmentLoading, setAssignmentLoading] = useState({});
  const [assignmentSuccess, setAssignmentSuccess] = useState('');
  const [allLeads, setAllLeads] = useState([]);
  const [pendingFollowups, setPendingFollowups] = useState([]);

  useEffect(() => {
    const normalizedRole = role?.toLowerCase();
    if (user?.token) {
      const fetchTeamAndLeads = async () => {
        try {
          setLoadingMembers(true);
          const config = {
            headers: { Authorization: `Bearer ${user.token}` },
          };
          
          const [teamRes, leadsRes, pendingRes] = await Promise.all([
            (normalizedRole === 'ceo' || normalizedRole === 'saleslead') 
              ? axios.get('/api/users/company', config) 
              : Promise.resolve({ data: [] }),
            axios.get('/api/leads', config).catch(() => ({ data: [] })),
            axios.get('/api/leads/pending-followups', config).catch(() => ({ data: [] }))
          ]);
          
          const data = teamRes ? teamRes.data : [];
          setAllLeads(leadsRes.data || []);
          setPendingFollowups(pendingRes.data || []);
          
          if (normalizedRole === 'saleslead') {
            const myTeam = data.filter(m => m.role?.toLowerCase() === 'salesperson' && m.assignedSalesLead === user._id);
            setTeamMembers(myTeam);
            setSalesPersons(myTeam);
          } else {
            // CEO / Admin
            const filtered = data.filter(member => 
              member.role?.toLowerCase() === 'saleslead' || member.role?.toLowerCase() === 'salesperson'
            );
            setTeamMembers(filtered);
            setSalesLeads(data.filter(m => m.role?.toLowerCase() === 'saleslead'));
            setSalesPersons(data.filter(m => m.role?.toLowerCase() === 'salesperson'));
          }
        } catch (error) {
          console.error("Failed to fetch team members or leads", error);
        } finally {
          setLoadingMembers(false);
        }
      };
      fetchTeamAndLeads();
    }
  }, [role, user]);

  const handleAssignSalesPerson = async (salesPersonId, salesLeadId) => {
    const normalizedRole = role?.toLowerCase();
    if (normalizedRole !== 'ceo' && normalizedRole !== 'admin') return; // only CEO can assign salespersons to leads
    
    try {
      setAssignmentLoading(prev => ({ ...prev, [salesPersonId]: true }));
      setAssignmentSuccess('');
      
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.post('/api/assignments/salesperson', {
        salesPersonId,
        salesLeadId: salesLeadId || null
      }, config);

      setAssignmentSuccess(`Successfully updated salesperson assignment!`);
      
      // Re-fetch team members
      const { data } = await axios.get('/api/users/company', config);
      const filtered = data.filter(member => 
        member.role?.toLowerCase() === 'saleslead' || member.role?.toLowerCase() === 'salesperson'
      );
      setTeamMembers(filtered);
      setSalesLeads(data.filter(m => m.role?.toLowerCase() === 'saleslead'));
      setSalesPersons(data.filter(m => m.role?.toLowerCase() === 'salesperson'));

      setTimeout(() => setAssignmentSuccess(''), 4000);
    } catch (error) {
      console.error("Assignment failed", error);
    } finally {
      setAssignmentLoading(prev => ({ ...prev, [salesPersonId]: false }));
    }
  };

  const handleAssignLeadToSalesPerson = async (salesPersonId, leadId) => {
    if (!leadId) return;
    try {
      setAssignmentLoading(prev => ({ ...prev, [salesPersonId]: true }));
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post('/api/assignments/lead', {
        salesPersonId,
        leadId
      }, config);
      
      // Re-fetch leads
      const leadsRes = await axios.get('/api/leads', config);
      setAllLeads(leadsRes.data || []);
      setAssignmentSuccess('Successfully assigned lead!');
      setTimeout(() => setAssignmentSuccess(''), 4000);
    } catch (error) {
      console.error("Lead assignment failed", error);
    } finally {
      setAssignmentLoading(prev => ({ ...prev, [salesPersonId]: false }));
    }
  };

  const getStats = () => {
    const normalizedRole = role?.toLowerCase();
    switch(normalizedRole) {
      case 'ceo':
        return [
          { label: 'Total Team Members', value: teamMembers.length, icon: Users, trend: 'Active', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Leads', value: allLeads.length, icon: Target, trend: 'Active', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Hot Leads', value: allLeads.filter(l => l.status === 'Hot / High Potential').length, icon: TrendingUp, trend: 'High Priority', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Unassigned Leads', value: allLeads.filter(l => !l.assignedTo).length, icon: Clock, trend: 'Needs Action', color: 'text-amber-600', bg: 'bg-amber-50' },
        ];
      case 'saleslead': {
        const myLeads = allLeads.filter(l => 
          l.assignedSalesLead === user._id || (l.assignedSalesLead && l.assignedSalesLead._id === user._id)
        );
        return [
          { label: 'Team Size', value: teamMembers.length, icon: Users, trend: 'Active', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Team Leads', value: myLeads.length, icon: Target, trend: 'Active', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Team Hot Leads', value: myLeads.filter(l => l.status === 'Hot / High Potential').length, icon: TrendingUp, trend: 'High Priority', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Unassigned in Team', value: myLeads.filter(l => !l.assignedTo).length, icon: Clock, trend: 'Needs Action', color: 'text-amber-600', bg: 'bg-amber-50' },
        ];
      }
      default: {
        const myOwnLeads = allLeads.filter(l => 
          l.assignedTo === user._id || (l.assignedTo && l.assignedTo._id === user._id)
        );
        return [
          { label: 'My Leads', value: myOwnLeads.length, icon: Users, trend: 'Active', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Hot Leads', value: myOwnLeads.filter(l => l.status === 'Hot / High Potential').length, icon: TrendingUp, trend: 'High Priority', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Meetings', value: '0', icon: Calendar, trend: 'No Meetings', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Performance', value: 'Good', icon: Target, trend: 'On Track', color: 'text-amber-600', bg: 'bg-amber-50' },
        ];
      }
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              {role?.toLowerCase() === 'ceo' ? 'Manager Dashboard' : `${role} Dashboard`}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            Welcome back, <span className="text-primary-600">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Here is what is happening with your business today.</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
          <Calendar className="w-5 h-5 text-slate-400" />
          <span>May 14, 2026</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center text-emerald-500 text-xs font-black bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Performance Analytics</h3>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">This Month</span>
            </div>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed border-slate-50 rounded-3xl">
            <BarChart3 className="w-12 h-12 text-slate-100" />
            <span className="ml-4 text-slate-300 font-bold uppercase tracking-widest">Interactive Chart Loading...</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl group-hover:bg-primary-500/30 transition-colors"></div>
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black leading-tight">AI Sales Insights</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Based on your current pipeline, we recommend focusing on "Enterprise" leads in the North Region to hit your Q2 target.
              </p>
            </div>
            <button className="w-full py-4 bg-primary-600 hover:bg-primary-700 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-primary-900/50">
              View Detailed Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Actionable Tasks Widget */}
      <div className="bg-white rounded-[2.5rem] border border-red-100 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">Urgent Pending Follow-ups</h3>
              <p className="text-sm text-slate-500 font-medium">Hot leads stagnant for over 24 hours.</p>
            </div>
          </div>
          <span className="px-4 py-1.5 bg-red-100 text-red-600 font-black rounded-full text-xs uppercase tracking-widest">
            {pendingFollowups.length} OVERDUE
          </span>
        </div>
        
        {pendingFollowups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingFollowups.map(lead => (
              <div key={lead._id} className="p-5 border border-slate-100 rounded-2xl hover:border-red-200 hover:shadow-md transition-all bg-slate-50 relative group">
                <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <h4 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">{lead.name}</h4>
                <p className="text-xs text-slate-500 mb-4">{lead.company || 'No Company specified'}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date(lead.updatedAt).toLocaleDateString()}</span>
                  <a href={`/leads/${lead._id}`} className="text-red-600 font-black uppercase hover:underline">Action Now &rarr;</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="py-8 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
             <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
             <h4 className="font-bold text-emerald-800">Inbox Zero!</h4>
             <p className="text-emerald-600 text-sm font-medium mt-1">No urgent hot leads are overdue for follow-up.</p>
           </div>
        )}
      </div>

      {/* Manager / SalesLead Team Directory Section */}
      {(role?.toLowerCase() === 'ceo' || role?.toLowerCase() === 'saleslead') && (
        <div className="mt-8 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">{role?.toLowerCase() === 'ceo' ? 'Your Sales Team' : 'My Assigned Sales Team'}</h3>
              <p className="text-slate-500 font-medium text-sm mt-1">
                {role?.toLowerCase() === 'ceo' ? `Showing all Sales Leads and Sales Persons at ${user?.companyName || 'your company'}` : 'Showing your directly assigned Sales Persons'}
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full text-primary-600 font-bold text-xs uppercase tracking-widest">
              <Users className="w-4 h-4 mr-1" />
              {teamMembers.length} Members
            </div>
          </div>

          {loadingMembers ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>No sales team members have signed up under your company name yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={member._id}
                  className="flex flex-col p-5 rounded-2xl border border-slate-100 hover:border-primary-100 hover:shadow-md transition-all group bg-white"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {member.profilePic ? (
                        <img src={member.profilePic} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="ml-4 flex-1 overflow-hidden">
                      <h4 className="text-slate-900 font-bold truncate group-hover:text-primary-600 transition-colors">
                        {member.name}
                      </h4>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${member.role?.toLowerCase() === 'saleslead' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {member.role?.toLowerCase() === 'saleslead' ? 'Lead' : 'Sales'}
                        </span>
                        <span className="text-xs text-slate-500 truncate flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {member.role?.toLowerCase() === 'salesperson' && (
                    <>
                      <div className="mt-2 pt-4 border-t border-slate-50 flex-1 flex flex-col">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          Assigned CRM Leads
                        </label>
                        <div className="flex-1 max-h-32 overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 p-2 space-y-1">
                          {allLeads.filter(lead => 
                            lead.assignedTo === member._id || 
                            (lead.assignedTo && lead.assignedTo._id === member._id)
                          ).length === 0 ? (
                            <p className="text-xs text-slate-400 p-2 text-center">No leads assigned.</p>
                          ) : (
                            allLeads
                              .filter(lead => 
                                lead.assignedTo === member._id || 
                                (lead.assignedTo && lead.assignedTo._id === member._id)
                              )
                              .map(lead => (
                                <div key={lead._id} className="flex flex-col p-2 bg-white rounded-lg transition-colors border border-slate-100 hover:border-slate-300 shadow-sm mb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="text-xs font-bold text-slate-700">{lead.name}</span>
                                      {lead.company && <span className="text-[10px] text-slate-500 block">{lead.company}</span>}
                                    </div>
                                    <span className="text-[9px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                                      {lead.status}
                                    </span>
                                  </div>
                                  
                                  {/* Activity section */}
                                  <div className="mt-2 pt-2 border-t border-slate-50">
                                    <div className="flex items-center text-[10px] text-slate-400 mb-1">
                                      <Clock className="w-3 h-3 mr-1" />
                                      <span>Last active: {new Date(lead.lastActivity || lead.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    {lead.notes && lead.notes.length > 0 ? (
                                      <div className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-md italic border-l-2 border-primary-300">
                                        "{lead.notes[lead.notes.length - 1].text}"
                                      </div>
                                    ) : (
                                      <div className="text-[10px] text-slate-400 italic">No notes added yet.</div>
                                    )}
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          Assign CRM Lead
                        </label>
                        <select
                          className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                          onChange={(e) => handleAssignLeadToSalesPerson(member._id, e.target.value)}
                          value=""
                          disabled={assignmentLoading[member._id]}
                        >
                          <option value="" disabled>Select a lead to assign...</option>
                          {allLeads
                            .filter(lead => lead.assignedTo !== member._id && (!lead.assignedTo || lead.assignedTo._id !== member._id))
                            .map(lead => (
                              <option key={lead._id} value={lead._id}>
                                {lead.name} {lead.company ? `(${lead.company})` : ''}
                              </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          Assigned Sales Lead
                        </label>
                        {(role?.toLowerCase() === 'ceo' || role?.toLowerCase() === 'admin') ? (
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                            value={member.assignedSalesLead || ''}
                            onChange={(e) => handleAssignSalesPerson(member._id, e.target.value)}
                            disabled={assignmentLoading[member._id]}
                          >
                            <option value="">Unassigned</option>
                            {salesLeads.map(lead => (
                              <option key={lead._id} value={lead._id}>
                                {lead.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm font-semibold">
                            {member.assignedSalesLead ? user.name : 'Unassigned'}
                          </div>
                        )}
                        {assignmentLoading[member._id] && <p className="text-xs text-primary-500 mt-1 font-medium">Assigning...</p>}
                      </div>
                    </>
                  )}

                  {member.role?.toLowerCase() === 'saleslead' && (
                    <div className="mt-2 pt-4 border-t border-slate-50 flex-1 flex flex-col">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Manage Team Members
                      </label>
                      <div className="flex-1 max-h-32 overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 p-2 space-y-1">
                        {salesPersons.length === 0 ? (
                          <p className="text-xs text-slate-400 p-2 text-center">No sales persons available.</p>
                        ) : (
                          salesPersons.map(person => {
                            const isAssigned = person.assignedSalesLead === member._id || 
                                               (person.assignedSalesLead && person.assignedSalesLead._id === member._id) || 
                                               person.assignedSalesLead?.toString() === member._id?.toString();
                            return (
                              <label key={person._id} className="flex items-center space-x-2 p-1.5 hover:bg-white rounded-lg cursor-pointer transition-colors">
                                <input 
                                  type="checkbox" 
                                  className="rounded text-primary-600 focus:ring-primary-500"
                                  checked={isAssigned}
                                  disabled={assignmentLoading[person._id]}
                                  onChange={(e) => {
                                    const newLeadId = e.target.checked ? member._id : null;
                                    handleAssignSalesPerson(person._id, newLeadId);
                                  }}
                                />
                                <span className="text-xs font-medium text-slate-700 flex-1 truncate">{person.name}</span>
                                {assignmentLoading[person._id] && <span className="text-[10px] text-primary-500">Updating...</span>}
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleDashboard;

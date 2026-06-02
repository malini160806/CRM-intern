import React from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Clock, 
  MessageSquare, 
  FileText,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Edit,
  Trash2,
  MessageCircle,
  Users,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import AddLeadModal from '../components/AddLeadModal';
import AddTaskModal from '../components/AddTaskModal';
import { setBreadcrumbOverride } from '../store/slices/uiSlice';

const LeadDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [lead, setLead] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [tasks, setTasks] = React.useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [salesPersons, setSalesPersons] = React.useState([]);
  const [assignmentLoading, setAssignmentLoading] = React.useState(false);
  const [assignmentMessage, setAssignmentMessage] = React.useState('');
  const [generatingInsight, setGeneratingInsight] = React.useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  React.useEffect(() => {
    const fetchLeadAndTeam = async () => {
      try {
        if (!user) return;
        const leadRes = await axios.get(`/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setLead(leadRes.data);
        
        const tasksRes = await axios.get(`/api/tasks?relatedId=${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setTasks(tasksRes.data);

        dispatch(setBreadcrumbOverride({ id, name: leadRes.data.name }));
        window.dispatchEvent(new CustomEvent('breadcrumb_update', { detail: { id, name: leadRes.data.name } }));

        if (user.role === 'SalesLead' || user.role === 'Admin' || user.role === 'CEO') {
          const teamRes = await axios.get('/api/users/company', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (user.role === 'SalesLead') {
            setSalesPersons(teamRes.data.filter(m => m.role === 'SalesPerson' && m.assignedSalesLead === user._id));
          } else {
            setSalesPersons(teamRes.data.filter(m => m.role === 'SalesPerson'));
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadAndTeam();
  }, [id]);

  const handleAssignLead = async (salesPersonId) => {
    try {
      setAssignmentLoading(true);
      setAssignmentMessage('');
      await axios.post('/api/assignments/lead', {
        salesPersonId,
        leadId: id
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAssignmentMessage('Lead assigned successfully!');
      
      const leadRes = await axios.get(`/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setLead(leadRes.data);
      
      setTimeout(() => setAssignmentMessage(''), 3000);
    } catch (err) {
      console.error('Failed to assign lead:', err);
      setAssignmentMessage(err.response?.data?.message || 'Failed to assign lead');
      setTimeout(() => setAssignmentMessage(''), 3000);
    } finally {
      setAssignmentLoading(false);
    }
  };

  const generateInsight = async () => {
    setGeneratingInsight(true);
    try {
      const response = await axios.post('/api/ai/chat', {
        message: `Act as an expert CRM AI. Analyze this lead data and provide a single, actionable 1-sentence recommended next step for the sales representative to close the deal. Make it specific to the lead's name, role, and current state. Lead data: ${JSON.stringify({name: lead.name, role: lead.role, company: lead.company, qualification: lead.qualificationData, score: lead.leadScore, status: lead.status})}`
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      const newRecommendation = response.data.message;
      
      const updatedLead = {
        ...lead,
        aiInsights: {
          ...lead.aiInsights,
          recommendedAction: newRecommendation
        }
      };
      setLead(updatedLead);
      
      await axios.put(`/api/leads/${id}`, updatedLead, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
    } catch (error) {
      console.error('Error generating AI insight:', error);
      alert('Failed to generate recommendation. Please ensure AI services are configured.');
    } finally {
      setGeneratingInsight(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      await axios.delete(`/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate('/leads');
    } catch (err) {
      console.error('Failed to delete lead:', err);
      alert('Failed to delete lead.');
    }
  };

  const handleLeadUpdated = (updatedLead) => {
    setLead(updatedLead);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
          <FileText className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Lead Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">
          We couldn't find the lead you're looking for. It may have been deleted or the link is incorrect.
        </p>
        <button 
          onClick={() => navigate('/leads')} 
          className="btn-primary px-8 py-3 flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Leads Pipeline</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/leads')}
          className="flex items-center space-x-2 text-slate-500 hover:text-primary-600 transition-all font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Leads</span>
        </button>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all dark:hover:bg-slate-800"
            title="Edit Lead"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-slate-800"
            title="Delete Lead"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="btn-primary py-2 px-6"
          >
            Schedule Follow-up
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Profile */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-3xl mx-auto flex items-center justify-center text-primary-600 text-3xl font-bold dark:bg-slate-800">
              {lead.name.charAt(0)}
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">{lead.name}</h2>
            <p className="text-slate-500 font-medium">{lead.role}</p>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800/50">
                <p className="text-xs font-bold text-slate-400 uppercase">Lead Score</p>
                <p className="text-2xl font-black text-primary-600 mt-1">{lead.leadScore || 0}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800/50">
                <p className="text-xs font-bold text-slate-400 uppercase">Intent</p>
                <p className="text-2xl font-black text-red-500 mt-1">{lead.aiInsights?.buyingIntent || 'Cold'}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-sm">{lead.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div 
                  className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => { 
                    if(lead.phone) {
                      const cleanPhone = lead.phone.replace(/[^\d+]/g, '');
                      window.location.href = `tel:${cleanPhone}`;
                    }
                  }}
                  title="Call"
                >
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-sm">{lead.phone || 'N/A'}</span>
                </div>
                {lead.phone && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const cleanPhone = lead.phone.replace(/\D/g, '');
                      window.open(`https://wa.me/${cleanPhone}`, '_blank');
                    }}
                    className="p-1.5 text-slate-400 hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-all"
                    title="Send WhatsApp Message"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Building2 className="w-5 h-5 text-slate-400" />
                <span className="text-sm">{lead.company || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-primary-100 bg-primary-50/20 dark:bg-primary-900/10 dark:border-primary-900/20">
            <div className="flex items-center space-x-2 text-primary-600 mb-4">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">AI Recommendation</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-300">
              {lead.aiInsights?.recommendedAction || "Start your sales journey by adding notes or activities to generate AI recommendations."}
            </p>
            {lead.aiInsights?.recommendedAction ? (
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="w-full mt-4 py-2 bg-[#0071e3] text-white font-bold rounded-lg hover:bg-[#0077ed] transition-all text-sm shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Execute Recommendation
              </button>
            ) : (
              <button 
                onClick={generateInsight}
                disabled={generatingInsight}
                className="w-full mt-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all text-sm shadow-md disabled:opacity-70 active:scale-95 flex items-center justify-center gap-2"
              >
                {generatingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generatingInsight ? 'Analyzing Lead...' : 'Generate AI Insight'}
              </button>
            )}
          </div>

          {(user?.role === 'SalesLead' || user?.role === 'Admin' || user?.role === 'CEO') && (
            <div className="glass-card p-6 border-blue-100 bg-blue-50/20 dark:bg-blue-900/10 dark:border-blue-900/20 mt-6">
              <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <Users className="w-5 h-5" />
                <h3 className="font-bold">Team Assignment</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">Assign this lead to a sales person on your team.</p>
              
              <select 
                className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-2"
                value={lead.assignedTo?._id || lead.assignedTo || ''}
                onChange={(e) => handleAssignLead(e.target.value)}
                disabled={assignmentLoading}
              >
                <option value="">Unassigned</option>
                {salesPersons.map(person => (
                  <option key={person._id} value={person._id}>
                    {person.name}
                  </option>
                ))}
              </select>
              {assignmentLoading && <p className="text-xs text-blue-500 font-medium">Assigning...</p>}
              {assignmentMessage && <p className={`text-xs font-medium ${assignmentMessage.includes('failed') || assignmentMessage.includes('Failed') ? 'text-red-500' : 'text-emerald-500'}`}>{assignmentMessage}</p>}
            </div>
          )}
        </div>

        {/* Right Column - Details & Timeline */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Qualification Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Estimated Budget</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">{lead.qualificationData?.budget || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Project Timeline</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">{lead.qualificationData?.timeline || 'Not specified'}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Requirements</p>
                <p className="font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                  {lead.qualificationData?.requirements || 'No specific requirements logged yet.'}
                </p>
              </div>
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scheduled Follow-ups</h3>
              </div>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task._id} className="flex items-start p-4 bg-slate-50 rounded-xl dark:bg-slate-800/50">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400 mr-4 mt-1">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{task.title}</h4>
                      {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
                      <div className="flex items-center space-x-4 mt-3 text-xs font-medium text-slate-400">
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span className="flex items-center text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full dark:bg-blue-900/30">{task.priority} Priority</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity Timeline</h3>
              <button className="text-sm font-bold text-primary-600 hover:text-primary-700">View All</button>
            </div>
            
            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
              {(lead.notes || []).length > 0 ? (
                lead.notes.map((note, i) => (
                  <div key={i} className="flex space-x-6 relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-blue-500 bg-blue-50">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{note.text}</p>
                        <span className="text-xs text-slate-400 font-medium">{new Date(note.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Note added by system</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-400">No activity timeline events found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-100 rounded-xl dark:bg-slate-800">
                <FileText className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Lead Summary Report.pdf</p>
                <p className="text-xs text-slate-400">Generated by AI on May 12, 2026 • 2.4 MB</p>
              </div>
            </div>
            <button 
              onClick={() => alert(`Downloading Lead Summary Report for ${lead.name}...`)}
              className="p-2 text-[#515154] hover:text-[#0071e3] transition-all hover:bg-[#f5f5f7] rounded-lg"
              title="Download PDF"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <AddLeadModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onLeadUpdated={handleLeadUpdated}
        leadToEdit={lead}
      />

      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        leadId={id}
        onTaskAdded={(newTask) => {
          setTasks(prev => [...prev, newTask]);
          alert('Follow-up task scheduled successfully!');
        }}
      />
    </div>
  );
};

export default LeadDetails;

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
  Trash2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const LeadDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data for a single lead
  const lead = {
    name: 'John Smith',
    company: 'Tesla Inc',
    email: 'john.smith@tesla.com',
    phone: '+1 (555) 012-3456',
    status: 'Hot',
    leadScore: 92,
    role: 'Procurement Manager',
    assignedTo: 'Alex Johnson',
    lastActivity: '2 hours ago',
    buyingIntent: 'High',
    budget: '$50,000 - $100,000',
    timeline: '3 months',
    requirements: 'Cloud migration, AI-driven analytics, real-time lead scoring.',
    timelineEvents: [
      { type: 'Email', text: 'Sent initial follow-up email', time: '2h ago', icon: Mail, color: 'text-blue-500 bg-blue-50' },
      { type: 'Meeting', text: 'Product demo with procurement team', time: 'Yesterday', icon: Calendar, color: 'text-purple-500 bg-purple-50' },
      { type: 'AI Analysis', text: 'Lead score increased from 75 to 92', time: '2 days ago', icon: Sparkles, color: 'text-orange-500 bg-orange-50' },
      { type: 'Chat', text: 'Qualified via AI Chatbot', time: '3 days ago', icon: MessageSquare, color: 'text-green-500 bg-green-50' },
    ]
  };

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
          <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all dark:hover:bg-slate-800">
            <Edit className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-slate-800">
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="btn-primary py-2 px-6">
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
                <p className="text-2xl font-black text-primary-600 mt-1">{lead.leadScore}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800/50">
                <p className="text-xs font-bold text-slate-400 uppercase">Intent</p>
                <p className="text-2xl font-black text-red-500 mt-1">{lead.buyingIntent}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-sm">{lead.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-sm">{lead.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Building2 className="w-5 h-5 text-slate-400" />
                <span className="text-sm">{lead.company}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-primary-100 bg-primary-50/20 dark:bg-primary-900/10 dark:border-primary-900/20">
            <div className="flex items-center space-x-2 text-primary-600 mb-4">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">AI Recommendation</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-300">
              "John is showing high buying intent after yesterday's demo. 
              <span className="font-bold text-primary-600"> Recommended action:</span> Schedule a technical deep-dive in the next 2 days to close the deal."
            </p>
            <button className="w-full mt-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-all text-sm">
              Execute Recommendation
            </button>
          </div>
        </div>

        {/* Right Column - Details & Timeline */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Qualification Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Estimated Budget</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">{lead.budget}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Project Timeline</p>
                <p className="font-medium text-slate-700 dark:text-slate-200">{lead.timeline}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Requirements</p>
                <p className="font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                  {lead.requirements}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity Timeline</h3>
              <button className="text-sm font-bold text-primary-600 hover:text-primary-700">View All</button>
            </div>
            
            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
              {lead.timelineEvents.map((event, i) => (
                <div key={i} className="flex space-x-6 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${event.color}`}>
                    <event.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{event.text}</p>
                      <span className="text-xs text-slate-400 font-medium">{event.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{event.type}</p>
                  </div>
                </div>
              ))}
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
            <button className="p-2 text-slate-400 hover:text-primary-600 transition-all">
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;

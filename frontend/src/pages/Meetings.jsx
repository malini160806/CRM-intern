import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Video, 
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Trash2,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AddMeetingModal from '../components/AddMeetingModal';
import MeetingNotesModal from '../components/MeetingNotesModal';
import { FileText } from 'lucide-react';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const fetchMeetings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const response = await axios.get('/api/meetings', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMeetings(response.data);
    } catch (err) {
      console.error('Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleMeetingAdded = (newMeeting) => {
    setMeetings(prev => [...prev, newMeeting].sort((a, b) => new Date(a.startTime) - new Date(b.startTime)));
  };

  const handleNotesUpdated = (updatedMeeting) => {
    setMeetings(prev => prev.map(m => m._id === updatedMeeting._id ? updatedMeeting : m));
  };

  const deleteMeeting = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`/api/meetings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMeetings(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error('Failed to delete meeting');
    }
  };

  const filteredMeetings = meetings.filter(m => m.status === activeTab);
  const nextMeeting = meetings.find(m => m.status === 'Upcoming' && new Date(m.startTime) > new Date());

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary-600 mb-1">
            <CalendarIcon className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-widest">Activity Scheduler</h3>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Meetings & Calls</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 shadow-xl shadow-primary-200 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold">Schedule Meeting</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h4>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-slate-100 rounded-md dark:hover:bg-slate-800"><ChevronLeft className="w-4 h-4 text-slate-400" /></button>
                <button className="p-1 hover:bg-slate-100 rounded-md dark:hover:bg-slate-800"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase mb-2">
              <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  i + 1 === new Date().getDate() ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'hover:bg-primary-50 text-slate-600 dark:text-slate-400'
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {nextMeeting && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-6 bg-slate-900 text-white border-none shadow-xl shadow-slate-200 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary-600/20 rounded-full blur-2xl group-hover:bg-primary-600/30 transition-all"></div>
              <div className="flex items-center space-x-2 mb-4 relative z-10">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-300">Next Meeting</h4>
              </div>
              <p className="text-xl font-black mb-1 relative z-10">{nextMeeting.title}</p>
              <p className="text-sm text-slate-400 font-medium mb-4 relative z-10">
                Starts at {new Date(nextMeeting.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {nextMeeting.meetingLink && (
                <a 
                  href={nextMeeting.meetingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-primary-600 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-primary-500 transition-all flex items-center justify-center space-x-2 relative z-10"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Meeting</span>
                </a>
              )}
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
            <div className="flex space-x-8">
              {['Upcoming', 'Completed', 'Cancelled'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="meetingTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode='popLayout'>
              {filteredMeetings.length > 0 ? (
                filteredMeetings.map((meeting) => (
                  <motion.div 
                    key={meeting._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all border-l-4 border-l-primary-600 group"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none">
                          {new Date(meeting.scheduledDate).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                          {new Date(meeting.scheduledDate).getDate()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                          {meeting.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-2">
                          <div className="flex items-center text-xs text-slate-500 font-bold">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                            {new Date(meeting.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center text-xs text-slate-500 font-bold">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                            {meeting.location}
                          </div>
                          <div className="flex flex-wrap items-center text-xs text-slate-500 font-bold">
                            <Users className="w-3.5 h-3.5 mr-1.5 text-primary-500 shrink-0" />
                            {meeting.participants?.length > 0 ? (
                              meeting.participants.map((p, idx) => (
                                <React.Fragment key={idx}>
                                  <a href={`mailto:${p}`} className="hover:text-primary-600 hover:underline break-all">{p}</a>
                                  {idx < meeting.participants.length - 1 && <span className="mx-1">,</span>}
                                </React.Fragment>
                              ))
                            ) : (
                              '0 Guests'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(meeting.status)}`}>
                        {meeting.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        {meeting.meetingLink && (
                          <a 
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all dark:bg-slate-800"
                            title="Join Meeting"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                        <button 
                          onClick={() => { setSelectedMeeting(meeting); setIsNotesModalOpen(true); }}
                          className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all dark:bg-slate-800"
                          title="View / Add Notes"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => deleteMeeting(meeting._id)}
                          className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-24 text-center glass-card border-dashed border-2"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-slate-800">
                    <CalendarIcon className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Empty Schedule</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">No {activeTab.toLowerCase()} meetings found in your calendar.</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-8 btn-primary px-8 py-3 font-black uppercase tracking-widest text-xs"
                  >
                    Schedule First Meeting
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AddMeetingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onMeetingAdded={handleMeetingAdded} 
      />

      <MeetingNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => { setIsNotesModalOpen(false); setSelectedMeeting(null); }}
        meeting={selectedMeeting}
        onNotesUpdated={handleNotesUpdated}
      />
    </div>
  );
};

export default Meetings;

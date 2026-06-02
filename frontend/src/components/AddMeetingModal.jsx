import React, { useState, useEffect } from 'react';
import { X, Video, Clock, Calendar, Users, Loader2, MapPin, AlignLeft, UserPlus } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AddMeetingModal = ({ isOpen, onClose, onMeetingAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: 'Online',
    scheduledDate: '',
    description: '',
    participants: '',
    meetingLink: '',
    lead: ''
  });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLeads, setFetchingLeads] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchLeads = async () => {
        setFetchingLeads(true);
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const response = await axios.get('/api/leads', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setLeads(response.data);
          if (response.data.length > 0 && !formData.lead) {
            setFormData(prev => ({ ...prev, lead: response.data[0]._id }));
          }
        } catch (err) {
          console.error('Failed to fetch leads');
        } finally {
          setFetchingLeads(false);
        }
      };
      fetchLeads();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error('No user session found');

      const submissionData = {
        ...formData,
        startTime: formData.scheduledDate,
        endTime: new Date(new Date(formData.scheduledDate).getTime() + 60 * 60 * 1000).toISOString(), // +1 hour
        participants: formData.participants.split(',').map(p => p.trim()).filter(Boolean)
      };

      const response = await axios.post('/api/meetings', submissionData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Generate ICS File
      const createICS = (meeting) => {
        const formatDate = (date) => new Date(date).toISOString().replace(/-|:|\.\d+/g, '');
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Nexus CRM//Meeting Scheduler//EN',
          'BEGIN:VEVENT',
          `UID:${meeting._id}@nexuscrm.com`,
          `DTSTAMP:${formatDate(new Date())}`,
          `DTSTART:${formatDate(meeting.startTime)}`,
          `DTEND:${formatDate(meeting.endTime)}`,
          `SUMMARY:${meeting.title}`,
          `DESCRIPTION:${meeting.description || 'Nexus CRM Scheduled Meeting'}\\n\\nMeeting Link: ${meeting.meetingLink || 'None provided'}`,
          `LOCATION:${meeting.location}`,
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\\r\\n');
        
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `meeting_${meeting._id}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      createICS(response.data);

      if (onMeetingAdded) onMeetingAdded(response.data);
      onClose();
      setFormData({
        title: '',
        location: 'Online',
        scheduledDate: '',
        description: '',
        participants: '',
        meetingLink: '',
        lead: leads.length > 0 ? leads[0]._id : ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Schedule Meeting</h3>
            <p className="text-sm text-slate-500 font-medium">Link a lead and set your agenda</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Related Lead</label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select 
                name="lead"
                required
                value={formData.lead}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white appearance-none"
              >
                {fetchingLeads ? (
                  <option>Loading leads...</option>
                ) : leads.length > 0 ? (
                  leads.map(l => <option key={l._id} value={l._id}>{l.name} - {l.company}</option>)
                ) : (
                  <option disabled>No leads found. Create a lead first.</option>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Meeting Title</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                placeholder="e.g. Q4 Strategy Review"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Schedule Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  name="scheduledDate"
                  type="datetime-local"
                  required
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                  placeholder="Zoom, Meet, Office"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Meeting Link (Optional)</label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                placeholder="https://zoom.us/..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Participants (Comma separated)</label>
            <textarea 
              name="participants"
              rows="2"
              value={formData.participants}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
              placeholder="email@example.com, user@demo.com"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading || leads.length === 0}
              className="flex-[2] btn-primary py-3 flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Confirm & Schedule</span>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddMeetingModal;

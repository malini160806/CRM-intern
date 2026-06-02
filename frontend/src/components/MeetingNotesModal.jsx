import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';

const MeetingNotesModal = ({ isOpen, onClose, meeting, onNotesUpdated }) => {
  const [notes, setNotes] = useState('');
  const [followUpActions, setFollowUpActions] = useState('');
  const [outcome, setOutcome] = useState('Pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (meeting) {
      setNotes(meeting.notes || '');
      setFollowUpActions(meeting.followUpActions || '');
      setOutcome(meeting.outcome || 'Pending');
    }
  }, [meeting]);

  if (!isOpen || !meeting) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.put(`/api/meetings/${meeting._id}`, {
        notes,
        followUpActions,
        outcome
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      onNotesUpdated(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to update meeting notes');
      alert('Failed to save notes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Meeting Notes</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Meeting: {meeting.title}</h3>
            <p className="text-xs text-slate-500">Scheduled: {new Date(meeting.scheduledDate).toLocaleString()}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Meeting Outcome</label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 appearance-none"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed / Successful</option>
              <option value="Rescheduled">Needs Rescheduling</option>
              <option value="No Show">Client No Show</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Meeting Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 min-h-[120px]"
              placeholder="What was discussed?"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Follow Up Actions</label>
            <textarea
              value={followUpActions}
              onChange={(e) => setFollowUpActions(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 min-h-[100px]"
              placeholder="E.g. Send proposal next week, schedule a follow-up call..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button onClick={onClose} className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 shadow-lg shadow-primary-200 dark:shadow-none disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Notes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingNotesModal;

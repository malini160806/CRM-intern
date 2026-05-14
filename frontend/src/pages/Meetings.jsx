import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  FileText, 
  Plus,
  ChevronRight,
  MoreVertical,
  PlayCircle
} from 'lucide-react';

const Meetings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const meetings = [];

  const filteredMeetings = meetings.filter(m => 
    activeTab === 'upcoming' ? m.status === 'Upcoming' : m.status === 'Completed'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Meetings & Schedule</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your sales appointments and review meeting summaries.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit dark:bg-slate-800">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'upcoming' 
              ? 'bg-white text-primary-600 shadow-sm dark:bg-slate-700 dark:text-primary-400' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'completed' 
              ? 'bg-white text-primary-600 shadow-sm dark:bg-slate-700 dark:text-primary-400' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Completed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Meetings List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredMeetings.map((meeting) => (
            <div key={meeting.id} className="glass-card p-6 flex items-center justify-between group hover:border-primary-200 transition-all cursor-pointer">
              <div className="flex items-center space-x-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  meeting.status === 'Upcoming' ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400'
                } dark:bg-slate-800`}>
                  <CalendarIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {meeting.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {meeting.date} at {meeting.time}
                    </span>
                    <span className="flex items-center">
                      <Video className="w-4 h-4 mr-1.5" />
                      {meeting.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {meeting.hasSummary && (
                  <button className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100 hover:bg-green-100 transition-all">
                    <FileText className="w-4 h-4" />
                    <span>View AI Summary</span>
                  </button>
                )}
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg dark:hover:bg-slate-800">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar / Quick Stats */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Today's Schedule</h3>
            <div className="space-y-6">
              {[].map((item, i) => (
                <div key={i} className="flex space-x-4 relative">
                  {/* ... item layout ... */}
                </div>
              ))}
              <div className="text-center py-4">
                <CalendarIcon className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No schedule assigned for today</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-slate-900 text-white border-none relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">New Feature: AI Meeting Summary</h3>
              <p className="text-slate-400 text-sm mb-4">Automatically generate action items from your recordings.</p>
              <button className="flex items-center space-x-2 text-primary-400 font-bold hover:text-primary-300 transition-all">
                <PlayCircle className="w-5 h-5" />
                <span>Watch Tutorial</span>
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-600/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meetings;

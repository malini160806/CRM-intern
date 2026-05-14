import React from 'react';
import { Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

const FollowUps = () => {
  const followUps = [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Follow-ups & Tasks</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your pending actions and sales reminders.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white">Pending Follow-ups</h3>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {followUps.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-slate-800">
                <Clock className="w-8 h-8 text-slate-300" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">All caught up!</h4>
              <p className="text-slate-500 max-w-xs mx-auto">You have no pending follow-ups. Great job keeping your leads engaged.</p>
            </div>
          ) : (
            followUps.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer dark:hover:bg-slate-800/50">
                {/* ... item layout ... */}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-xl text-green-600 dark:bg-slate-800">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Completed Today</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">0</h4>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-600 dark:bg-slate-800">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Overdue Tasks</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">0</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUps;

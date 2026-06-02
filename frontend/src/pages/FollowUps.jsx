import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, AlertCircle, ChevronRight, 
  Plus, Calendar, Tag, MoreVertical, 
  CheckCircle, Circle, Trash2, Loader2
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AddTaskModal from '../components/AddTaskModal';

const FollowUps = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.put(`/api/tasks/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error('Failed to update task status');
    }
  };

  const deleteTask = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-50 border-red-100';
      case 'Medium': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'Low': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const completedToday = tasks.filter(t => t.status === 'Completed' && new Date(t.updatedAt).toDateString() === new Date().toDateString()).length;
  const overdueCount = tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date()).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-primary-600 mb-2">
            <Clock className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-widest">Activity Manager</h3>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Follow-ups & Tasks</h2>
          <p className="text-slate-500 font-medium mt-1">Stay on top of your sales commitments and deadlines.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 px-8 py-3 shadow-xl shadow-primary-200 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-xs">New Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 flex items-center space-x-4 border-l-4 border-l-emerald-500"
        >
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 dark:bg-slate-800">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Today</p>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{completedToday}</h4>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 flex items-center space-x-4 border-l-4 border-l-red-500"
        >
          <div className="p-3 bg-red-50 rounded-2xl text-red-600 dark:bg-slate-800">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overdue Tasks</p>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{overdueCount}</h4>
          </div>
        </motion.div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 flex items-center justify-between">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Active Agenda</h3>
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-primary-100 text-primary-600 rounded text-[10px] font-black">{tasks.filter(t => t.status !== 'Completed').length} Pending</span>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="p-20 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-slate-800">
                <Clock className="w-10 h-10 text-slate-200" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">All caught up!</h4>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">You have no pending follow-ups. Great job keeping your leads engaged.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-8 text-primary-600 font-black hover:underline"
              >
                + Schedule Your First Task
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div 
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-6 hover:bg-slate-50 transition-all flex items-center space-x-6 group dark:hover:bg-slate-800/50 ${
                    task.status === 'Completed' ? 'opacity-60' : ''
                  }`}
                >
                  <button 
                    onClick={() => toggleTaskStatus(task._id, task.status)}
                    className={`transition-colors ${task.status === 'Completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-primary-500'}`}
                  >
                    {task.status === 'Completed' ? <CheckCircle className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className={`text-lg font-bold truncate ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {task.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Tag className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {task.relatedTo}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => deleteTask(task._id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskAdded={handleTaskAdded} 
      />
    </div>
  );
};

export default FollowUps;

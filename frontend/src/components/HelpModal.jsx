import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Book, MessageCircle, Mail, ExternalLink, PlayCircle, 
  ChevronLeft, ArrowRight, Star, Zap, Settings as SettingsIcon, Users as UsersIcon 
} from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { closeModal, setHelpView } from '../store/slices/uiSlice';

const HelpModal = () => {
  const dispatch = useDispatch();
  const { modals, helpView: view } = useSelector((state) => state.ui);
  const isOpen = modals.help;
  const [selectedArticle, setSelectedArticle] = useState(null);

  const setView = (v) => dispatch(setHelpView(v));

  if (!isOpen) return null;

  const docSections = [
    {
      title: 'Getting Started',
      icon: Star,
      color: 'text-amber-500',
      items: [
        { id: 'quick-start', title: 'Quick Start Guide', content: 'Welcome to AI CRM! To get started, first head over to your profile settings to complete your information. Once done, you can start adding leads from the Leads page.' },
        { id: 'profile-setup', title: 'Setting up your profile', content: 'You can update your name, email, and profile picture in the Settings -> Profile tab. Don\'t forget to save your changes!' },
        { id: 'first-lead', title: 'Adding your first lead', content: 'Click the "Quick Create" button in the top navigation or go to the Leads page and click "Add Lead". Enter the lead\'s details and they will appear in your pipeline.' }
      ]
    },
    {
      title: 'Sales Management',
      icon: Zap,
      color: 'text-blue-500',
      items: [
        { id: 'pipeline', title: 'Pipeline management', content: 'Track your deals through various stages from Discovery to Closed Won. Drag and drop deals to move them across the pipeline.' },
        { id: 'deals', title: 'Closing deals', content: 'When a deal is ready, move it to the final stage and mark it as Closed Won to record the revenue and update your analytics.' },
        { id: 'contacts', title: 'Managing contacts', content: 'Keep track of all your key stakeholders and decision-makers in the Contacts module.' }
      ]
    },
    {
      title: 'Account Settings',
      icon: SettingsIcon,
      color: 'text-slate-500',
      items: [
        { id: 'notifs', title: 'Notification preferences', content: 'Customize which events trigger email or in-app notifications in Settings -> Notifications.' },
        { id: 'security', title: 'Security settings', content: 'Enable Two-Factor Authentication and manage your password in the Security tab.' },
        { id: 'api', title: 'API integrations', content: 'Connect AI CRM to your favorite tools like Slack, Zoom, and Gmail via our developer API.' }
      ]
    }
  ];

  const handleClose = () => {
    setSelectedArticle(null);
    dispatch(closeModal('help'));
  };

  const handleBack = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
      setView('docs');
    } else {
      setView('menu');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center space-x-4">
              {view !== 'menu' && (
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-500" />
                </button>
              )}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedArticle ? selectedArticle.title : view === 'docs' ? 'Documentation' : view === 'forum' ? 'Community Forum' : 'Help Center'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {selectedArticle ? 'Article Guide' : view === 'docs' ? 'Learn how to master AI CRM' : view === 'forum' ? 'Connect with other users' : 'How can we help you today?'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors"
            >
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 min-h-[400px]">
            {view === 'menu' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Resources</h3>
                    <button 
                      onClick={() => setView('docs')}
                      className="flex items-center space-x-4 w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-700 group h-24"
                    >
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <Book className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white">Documentation</p>
                        <p className="text-xs text-slate-500">In-app guide to features</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => window.open('https://youtube.com', '_blank')}
                      className="flex items-center space-x-4 w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-700 group h-24"
                    >
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white">Video Tutorials</p>
                        <p className="text-xs text-slate-500">Watch and learn workflows</p>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Support</h3>
                    <button 
                      onClick={() => alert('Starting live chat session...')}
                      className="flex items-center space-x-4 w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-700 group h-24"
                    >
                      <div className="p-3 bg-green-100 text-green-600 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white">Live Chat</p>
                        <p className="text-xs text-slate-500">Average response: 5 mins</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => window.location.href = 'mailto:support@ai-crm.com'}
                      className="flex items-center space-x-4 w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-700 group h-24"
                    >
                      <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white">Email Support</p>
                        <p className="text-xs text-slate-500">support@ai-crm.com</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedArticle ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose dark:prose-invert max-w-none"
              >
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                    {selectedArticle.content}
                  </p>
                </div>
                <div className="mt-8 flex items-center space-x-4">
                  <p className="text-sm text-slate-500 italic">Was this article helpful?</p>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 hover:text-primary-600 transition-all text-xs font-bold">Yes</button>
                    <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 transition-all text-xs font-bold">No</button>
                  </div>
                </div>
              </motion.div>
            ) : view === 'docs' ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {docSections.map((section, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <section.icon className={`w-5 h-5 ${section.color}`} />
                        <h3 className="font-bold text-slate-900 dark:text-white">{section.title}</h3>
                      </div>
                      <div className="space-y-2">
                        {section.items.map((item, j) => (
                          <button 
                            key={j} 
                            onClick={() => setSelectedArticle(item)}
                            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 flex items-center justify-between group"
                          >
                            <span>{item.title}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {[
                  { user: 'Sarah M.', avatar: 'S', title: 'How to export deal reports?', replies: 12, likes: 24, time: '2h ago' },
                  { user: 'David K.', avatar: 'D', title: 'Setting up custom pipeline stages', replies: 8, likes: 15, time: '5h ago' },
                  { user: 'Alex J.', avatar: 'A', title: 'Best practices for lead nurturing', replies: 21, likes: 42, time: '1d ago' },
                ].map((post, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-900/30 transition-all cursor-pointer group">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                        {post.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{post.title}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>{post.user}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-slate-400">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span className="text-xs">{post.replies}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span className="text-xs">{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-4 rounded-2xl bg-primary-600 text-white font-black text-xs uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-[0.98]">
                  Create New Discussion
                </button>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500">Version 2.4.0 (Latest)</p>
            <button 
              onClick={() => setView('forum')}
              className="flex items-center space-x-2 text-primary-600 font-bold text-sm hover:underline"
            >
              <span>Visit Community Forum</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HelpModal;

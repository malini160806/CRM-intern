import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Send, 
  Sparkles, 
  Mail, 
  Trash2, 
  Copy, 
  Layout,
  ChevronDown,
  Wand2,
  Paperclip,
  Clock,
  Loader2
} from 'lucide-react';

const EmailAutomation = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [];
  const [scheduledEmails, setScheduledEmails] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const fetchScheduled = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get('/api/email/scheduled', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setScheduledEmails(response.data);
    } catch (err) {
      console.error('Failed to fetch scheduled emails', err);
    }
  };

  useEffect(() => {
    fetchScheduled();
  }, []);

  const [isSending, setIsSending] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('/api/ai/chat', {
        message: `Generate a professional, high-converting CRM email based on this prompt: "${prompt}". 
                 Start with "Subject: " and then the email body. Use placeholders like [Client Name] and [Your Name].`,
        history: []
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setGeneratedEmail(response.data.message);
    } catch (err) {
      console.error(err);
      alert('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!generatedEmail || !recipientEmail) return;
    setIsSending(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('/api/email/send', {
        content: generatedEmail,
        recipient: recipientEmail
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert(response.data.message);
      setShowSendModal(false);
      setRecipientEmail('');
    } catch (err) {
      console.error(err);
      alert('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  const handleSchedule = async () => {
    if (!generatedEmail || !recipientEmail || !scheduleTime) return;
    setIsSending(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('/api/email/schedule', {
        content: generatedEmail,
        recipient: recipientEmail,
        scheduleTime: scheduleTime
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert(response.data.message);
      setShowScheduleModal(false);
      setRecipientEmail('');
      setScheduleTime('');
      fetchScheduled(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert('Failed to schedule email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Email Automation</h2>
        <p className="text-slate-500 dark:text-slate-400">Generate high-converting emails using AI tailored to each lead.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Templates Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Scheduled Emails</h3>
            <div className="space-y-3">
              {scheduledEmails.length > 0 ? (
                scheduledEmails.map((email, i) => (
                  <div 
                    key={i} 
                    className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Scheduled</span>
                      <span className="text-[10px] text-slate-400">{new Date(email.scheduleTime).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{email.recipient}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{email.content.substring(0, 50)}...</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400">No emails scheduled.</p>
                </div>
              )}
            </div>
            <button className="w-full mt-4 flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-all dark:border-slate-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-bold">Manage Queue</span>
            </button>
          </div>

          <div className="glass-card p-4 bg-primary-600 text-white border-none">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-bold">AI Tip</h3>
            </div>
            <p className="text-xs text-primary-100 leading-relaxed">
              "Personalized subject lines increase open rates by 26%. Try including the lead's company name."
            </p>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-2 text-primary-600 mb-4">
              <Wand2 className="w-5 h-5" />
              <h3 className="font-bold">AI Email Generator</h3>
            </div>
            <div className="relative">
              <textarea
                placeholder="E.g., Write a follow-up email to a hot lead who missed our demo yesterday. Keep it professional but urgent."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="absolute bottom-4 right-4 btn-primary py-2 px-6 flex items-center space-x-2"
              >
                {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles className="w-4 h-4" />}
                <span>Generate</span>
              </button>
            </div>
          </div>

          <div className="glass-card flex flex-col min-h-[400px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between dark:border-slate-800">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Output</span>
                <div className="flex items-center text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Last updated: Just now
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-all dark:hover:bg-slate-800">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-slate-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col">
              {generatedEmail ? (
                <textarea
                  className="flex-1 w-full p-0 bg-transparent border-none outline-none resize-none text-slate-700 font-serif leading-relaxed dark:text-slate-300 custom-scrollbar"
                  value={generatedEmail}
                  onChange={(e) => setGeneratedEmail(e.target.value)}
                  placeholder="Edit your email here..."
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Mail className="w-12 h-12 mb-4 opacity-20" />
                  <p>Your generated email will appear here.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between dark:bg-slate-800/30 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                <button className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-all">
                  Save Draft
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  disabled={!generatedEmail || isSending}
                  className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-all dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                >
                  Schedule
                </button>
                <button 
                  onClick={() => setShowSendModal(true)}
                  disabled={!generatedEmail || isSending}
                  className="btn-primary py-2 px-8 flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{isSending ? 'Sending...' : 'Send Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Send Email Now</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipient Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  placeholder="customer@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowSendModal(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSend}
                disabled={!recipientEmail || isSending}
                className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-50"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Schedule Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipient Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  placeholder="customer@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Schedule Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSchedule}
                disabled={!recipientEmail || !scheduleTime || isSending}
                className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-50"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailAutomation;

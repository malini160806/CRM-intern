import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, Sparkles, Trash2, Paperclip, FileText, X, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI CRM Assistant. I can search through your CRM data and any documents you upload to provide accurate answers. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, DOCX, and TXT files are supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post('/api/rag/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}` 
        }
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've successfully processed "${selectedFile.name}". You can now ask me questions about it.` 
      }]);
      setSelectedFile(null);
    } catch (err) {
      console.error("Document Upload Error:", err);
      alert('Failed to upload document: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.post('/api/rag/sync', {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: res.data.message || 'CRM database has been successfully synced with the AI context.' 
      }]);
    } catch (err) {
      console.error("Sync Error:", err);
      alert('Failed to sync CRM database: ' + (err.response?.data?.message || err.message));
    } finally {
      setSyncing(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    // If there's a file selected but user hasn't typed anything, upload the file
    if (selectedFile && !input.trim()) {
      handleFileUpload();
      return;
    }

    if (!input.trim() || loading) return;

    // If there's both a file and text, upload file first then send message
    if (selectedFile) {
      await handleFileUpload();
    }

    const currentInput = input;
    const userMessage = { role: 'user', content: currentInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Use the new RAG endpoint
      const response = await axios.post('/api/rag/chat', {
        message: currentInput,
        history: messages
          .filter((_, index) => index !== 0)
          .map(m => ({
            role: m.role,
            content: m.content
          }))
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.message,
        citations: response.data.citations 
      }]);
    } catch (err) {
      console.error("AI Chatbot Send Error:", err);
      const errMsg = err.response?.data?.message || err.message || 'Sorry, I encountered an error. Ensure your API keys are configured correctly.';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary-600" />
            AI Nexus Assistant
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Powered by Groq Llama 3 & Local RAG</p>
        </div>
        <div className="flex items-center space-x-2">
          {JSON.parse(localStorage.getItem('user'))?.role === 'CEO' || JSON.parse(localStorage.getItem('user'))?.role === 'SalesLead' ? (
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`p-2 text-slate-400 hover:text-primary-600 transition-colors ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Sync CRM Database manually"
            >
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
            </button>
          ) : null}
          <button
            onClick={() => setMessages([{ role: 'assistant', content: 'Hello! I am your AI CRM Assistant. I can search through your CRM data and any documents you upload to provide accurate answers. How can I help you today?' }])}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 glass-card flex flex-col overflow-hidden bg-white/50 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((m, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-xl flex-shrink-0 mt-1 ${m.role === 'user' ? 'bg-primary-600' : 'bg-slate-800 dark:bg-slate-800 shadow-md'}`}>
                  {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-primary-400" />}
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed whitespace-pre-wrap ${m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-none shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md border border-slate-100 dark:border-slate-700 rounded-tl-none'
                    }`}>
                    {m.content}
                  </div>
                  
                  {/* Citations block */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {m.citations.map((cit, idx) => (
                        <div key={idx} className="flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-slate-800/50 rounded text-[10px] text-slate-500 font-bold border border-slate-200 dark:border-slate-700">
                          <FileText className="w-3 h-3" />
                          <span>{cit.source}: {cit.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {(loading || uploading) && (
            <div className="flex justify-start">
              <div className="max-w-[80%] flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-slate-800 mt-1 shadow-md">
                  <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 rounded-tl-none">
                  <div className="flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploading ? 'Processing Document...' : 'Searching Context...'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
          
          <AnimatePresence>
            {selectedFile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                className="mb-3 flex items-center space-x-3"
              >
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                  <FileText className="w-4 h-4 text-primary-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} className="ml-2 text-slate-400 hover:text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSend} className="relative flex items-center space-x-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept=".pdf,.docx,.txt"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-4 text-slate-400 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all"
              title="Upload Document"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder={selectedFile ? "Press Enter to upload, or type a message..." : "Ask anything about your CRM data or upload a document..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full pl-6 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium text-slate-900 dark:text-white shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={(!input.trim() && !selectedFile) || loading || uploading}
              className="p-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center min-w-[60px]"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex justify-between items-center mt-3 px-2">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
               Answers based strictly on indexed CRM data and uploaded files.
             </p>
             <p className="text-[10px] text-primary-500/70 font-black uppercase tracking-widest flex items-center">
               <Sparkles className="w-3 h-3 mr-1" /> RAG System Active
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;

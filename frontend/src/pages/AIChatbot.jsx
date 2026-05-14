import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your AI Sales Assistant. I can help you qualify new leads quickly. Shall we start with the lead's business type?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadScore, setLeadScore] = useState(0);
  const [qualifiersFound, setQualifiersFound] = useState({
    businessType: false,
    budgetRange: false,
    timeline: false,
    requirements: false
  });
  const [predictedStatus, setPredictedStatus] = useState('Pending');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI response flow
    setTimeout(() => {
      const botResponse = getMockBotResponse(input, messages.length);
      setMessages(prev => [...prev, { id: Date.now(), text: botResponse, sender: 'bot' }]);
      setIsTyping(false);
    }, 1500);
  };

  const getMockBotResponse = (userInput, msgCount) => {
    if (msgCount === 2) return "Got it. And what is the estimated budget for this project?";
    if (msgCount === 4) return "Great. What is the expected timeline for implementation?";
    if (msgCount === 6) return "One last thing: what are the core requirements or pain points they mentioned?";
    return "Thank you! I've analyzed the lead. Based on our conversation, I've scored this lead as 'Hot' (92/100) and added them to the CRM. Would you like me to schedule a follow-up?";
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AI Lead Qualification</h2>
          <p className="text-slate-500 dark:text-slate-400">Qualify leads automatically using our advanced AI engine.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-600 rounded-lg font-bold hover:bg-primary-200 transition-all dark:bg-slate-800 dark:text-primary-400">
          <RefreshCw className="w-4 h-4" />
          <span>Reset Session</span>
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 glass-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3 dark:bg-slate-800/50 dark:border-slate-800">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Sales Qualification Bot</p>
              <div className="flex items-center text-xs text-green-500 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Online | AI Powered
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
          >
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex max-w-[80%] ${msg.sender === 'bot' ? 'flex-row' : 'flex-row-reverse'} items-start gap-3`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'bot' ? 'bg-primary-100 text-primary-600 dark:bg-slate-800' : 'bg-slate-200 text-slate-600 dark:bg-slate-700'
                    }`}>
                      {msg.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      msg.sender === 'bot' 
                        ? 'bg-white border border-slate-100 shadow-sm rounded-tl-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200' 
                        : 'bg-primary-600 text-white rounded-tr-none shadow-md shadow-primary-100'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none dark:bg-slate-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-slate-50 border-t border-slate-100 dark:bg-slate-800/30 dark:border-slate-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Type your answer here..."
                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Real-time Analysis Sidebar */}
        <div className="w-80 space-y-6 hidden lg:block">
          <div className="glass-card p-6 border-primary-100 bg-primary-50/30 dark:bg-primary-900/10 dark:border-primary-900/20">
            <div className="flex items-center space-x-2 text-primary-600 mb-6">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">Live Analysis</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Lead Score</span>
                  <span className="text-2xl font-black text-primary-600">{leadScore}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden dark:bg-slate-800">
                  <div 
                    className="h-full bg-primary-600 rounded-full transition-all duration-1000"
                    style={{ width: `${leadScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase">Qualifiers Found</p>
                {[
                  { label: 'Business Type', key: 'businessType' },
                  { label: 'Budget Range', key: 'budgetRange' },
                  { label: 'Timeline', key: 'timeline' },
                  { label: 'Requirements', key: 'requirements' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    {qualifiersFound[item.key] ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Predicted Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  predictedStatus === 'Pending' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-red-100 text-red-600 border-red-200'
                }`}>
                  {predictedStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 text-sm font-bold rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-primary-900/20 dark:hover:text-primary-400">
                Transfer to Agent
              </button>
              <button className="w-full text-left p-3 text-sm font-bold rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-primary-900/20 dark:hover:text-primary-400">
                Schedule Demo
              </button>
              <button className="w-full text-left p-3 text-sm font-bold rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-primary-900/20 dark:hover:text-primary-400">
                Send Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;

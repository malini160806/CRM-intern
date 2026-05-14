import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';

const EmailAutomation = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Mock AI generation
    setTimeout(() => {
      setGeneratedEmail(`Subject: Enhancing Your Workflow with AI Business CRM

Dear [Client Name],

It was great connecting with you recently. Following up on our discussion about [Topic], I wanted to share how our AI-powered CRM can specifically address the pain points we discussed, particularly in automating your lead qualification process.

I've attached a brief overview of our platform's capabilities. Would you be open to a 15-minute demo next Wednesday to see it in action?

Looking forward to hearing from you.

Best regards,
[Your Name]`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Email Automation</h2>
        <p className="text-slate-500 dark:text-slate-400">Generate high-converting emails using AI tailored to each lead.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Templates Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Templates</h3>
            <div className="space-y-3">
              {templates.length > 0 ? (
                templates.map((t, i) => (
                  <button 
                    key={i} 
                    className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all group flex items-center justify-between dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
                  >
                    <span className="text-sm font-bold">{t.name}</span>
                    <span className="text-[10px] px-2 py-1 bg-white rounded-lg text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 dark:bg-slate-700 dark:text-slate-400">
                      {t.type}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400">No templates saved yet.</p>
                </div>
              )}
            </div>
            <button className="w-full mt-4 flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-all dark:border-slate-700">
              <Layout className="w-4 h-4" />
              <span className="text-sm font-bold">New Template</span>
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
            
            <div className="flex-1 p-6">
              {generatedEmail ? (
                <div className="whitespace-pre-wrap text-slate-700 font-serif leading-relaxed dark:text-slate-300">
                  {generatedEmail}
                </div>
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
                <button className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-all dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                  Schedule
                </button>
                <button className="btn-primary py-2 px-8 flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAutomation;

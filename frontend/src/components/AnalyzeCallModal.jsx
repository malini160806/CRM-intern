import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Brain, Heart, CheckSquare, MessageSquare, AudioLines, Download } from 'lucide-react';

const AnalyzeCallModal = ({ isOpen, onClose, call }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsAnalyzing(false);
            return 100;
          }
          return prev + 5;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [isOpen, call]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-[#1c1c1e] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-[#e5e5ea] dark:border-[#38383a] flex flex-col h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#e5e5ea] dark:border-[#38383a] flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1d1d1f] dark:text-white flex items-center gap-2">
                  AI Voice Analysis
                  {!isAnalyzing && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Complete</span>}
                </h3>
                <p className="text-sm text-[#86868b] font-medium">{call?.subject || 'Client Sync Call'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-[#86868b] hover:bg-[#e5e5ea] dark:hover:bg-[#2c2c2e] rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#1c1c1e] relative">
            {isAnalyzing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex items-end space-x-2 h-20 mb-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [10, Math.random() * 60 + 20, 10] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                      className="w-4 bg-indigo-500 rounded-t-sm"
                    />
                  ))}
                </div>
                <h4 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2">Processing Audio & Transcribing...</h4>
                <div className="w-64 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-sm text-[#86868b] mt-4 font-medium">{analysisProgress}% Complete</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full"
              >
                {/* Left Column: Summary & Insights */}
                <div className="space-y-6">
                  {/* Sentiment Score */}
                  <div className="bg-white dark:bg-[#2c2c2e] p-6 rounded-3xl border border-[#e5e5ea] dark:border-[#38383a]">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-500" />
                        Client Sentiment
                      </h4>
                      <span className="text-2xl font-black text-[#1d1d1f] dark:text-white">88%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-red-500" style={{ width: '5%' }}></div>
                      <div className="h-full bg-yellow-400" style={{ width: '7%' }}></div>
                      <div className="h-full bg-green-500" style={{ width: '88%' }}></div>
                    </div>
                    <p className="text-xs text-[#86868b] mt-3 font-medium">Overall positive tone. The client showed high enthusiasm when discussing the new analytics features.</p>
                  </div>

                  {/* Action Items */}
                  <div className="bg-white dark:bg-[#2c2c2e] p-6 rounded-3xl border border-[#e5e5ea] dark:border-[#38383a] flex-1">
                    <h4 className="font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2 mb-4">
                      <CheckSquare className="w-5 h-5 text-blue-500" />
                      Extracted Action Items
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-xl">
                        <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 shrink-0 mt-0.5"></div>
                        <p className="text-sm font-medium text-[#1d1d1f] dark:text-slate-300">Send updated pricing proposal including the enterprise tier.</p>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-xl">
                        <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 shrink-0 mt-0.5"></div>
                        <p className="text-sm font-medium text-[#1d1d1f] dark:text-slate-300">Schedule technical deep-dive with their engineering lead next week.</p>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-xl">
                        <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 shrink-0 mt-0.5"></div>
                        <p className="text-sm font-medium text-[#1d1d1f] dark:text-slate-300">Share case study PDF regarding implementation speed.</p>
                      </li>
                    </ul>
                    <button className="w-full mt-4 py-2 bg-slate-100 dark:bg-slate-800 text-[#1d1d1f] dark:text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      Sync to CRM Tasks
                    </button>
                  </div>
                </div>

                {/* Right Column: Transcript */}
                <div className="lg:col-span-2 bg-white dark:bg-[#2c2c2e] p-6 rounded-3xl border border-[#e5e5ea] dark:border-[#38383a] flex flex-col h-full max-h-[500px]">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-500" />
                      Smart Transcript
                    </h4>
                    <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg">
                      <Download className="w-3.5 h-3.5" />
                      Export
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
                    {/* Mock Transcript Messages */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0">Rep</div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-sm text-[#1d1d1f] dark:text-white">You</span>
                          <span className="text-[10px] text-[#86868b] font-bold">00:14</span>
                        </div>
                        <p className="text-sm text-[#515154] dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#1c1c1e] p-3 rounded-2xl rounded-tl-none">
                          Hi Sarah, thanks for jumping on. I wanted to check in on your thoughts regarding the new dashboard.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">Cli</div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-sm text-[#1d1d1f] dark:text-white">Sarah Jenkins</span>
                          <span className="text-[10px] text-[#86868b] font-bold">00:22</span>
                        </div>
                        <p className="text-sm text-[#515154] dark:text-slate-300 leading-relaxed bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-3 rounded-2xl rounded-tl-none">
                          It looks fantastic! The analytics reporting is exactly what we've been missing. <span className="bg-yellow-200/50 dark:bg-yellow-500/20 px-1 rounded">My only concern right now is the pricing for the enterprise tier.</span> Could you send over a detailed proposal?
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0">Rep</div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-sm text-[#1d1d1f] dark:text-white">You</span>
                          <span className="text-[10px] text-[#86868b] font-bold">00:45</span>
                        </div>
                        <p className="text-sm text-[#515154] dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#1c1c1e] p-3 rounded-2xl rounded-tl-none">
                          Absolutely. I'll get that proposal over to you right after this call. I also think it would be beneficial to schedule a quick sync with your engineering lead to answer any technical questions.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">Cli</div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-sm text-[#1d1d1f] dark:text-white">Sarah Jenkins</span>
                          <span className="text-[10px] text-[#86868b] font-bold">01:02</span>
                        </div>
                        <p className="text-sm text-[#515154] dark:text-slate-300 leading-relaxed bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-3 rounded-2xl rounded-tl-none">
                          That makes sense. Let's aim for next week. Also, if you have any case studies on implementation speed, please send those too.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Audio Player Mock */}
                  <div className="mt-4 pt-4 border-t border-[#e5e5ea] dark:border-[#38383a] flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 bg-white ml-1" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}></div>
                    </button>
                    <div className="flex-1 flex items-center gap-1">
                      {[...Array(40)].map((_, i) => (
                        <div key={i} className={`w-1.5 rounded-full ${i < 15 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} style={{ height: `${Math.random() * 20 + 4}px` }}></div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#86868b]">14:22</span>
                  </div>
                </div>

              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AnalyzeCallModal;

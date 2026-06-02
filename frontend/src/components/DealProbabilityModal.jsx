import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, Target } from 'lucide-react';

const DealProbabilityModal = ({ isOpen, onClose, deal }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 2000); // Simulate AI analysis time
      return () => clearTimeout(timer);
    }
  }, [isOpen, deal]);

  if (!isOpen) return null;

  // Mock Probability Calculation
  const probability = deal?.probability || Math.floor(Math.random() * 60) + 30; // Random 30-90 if not set
  let color = 'text-green-500';
  let bg = 'bg-green-500/10';
  let statusText = 'High Probability';
  
  if (probability < 40) {
    color = 'text-red-500';
    bg = 'bg-red-500/10';
    statusText = 'At Risk';
  } else if (probability < 70) {
    color = 'text-yellow-500';
    bg = 'bg-yellow-500/10';
    statusText = 'Needs Attention';
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-[#1c1c1e] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#e5e5ea] dark:border-[#38383a]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#e5e5ea] dark:border-[#38383a] flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
            <div className="relative z-10 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">AI Deal Analysis</h3>
                <p className="text-sm text-[#86868b] font-medium">{deal?.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="relative z-10 p-2 text-[#86868b] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 min-h-[400px] relative">
            {isAnalyzing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full mb-6"
                />
                <motion.p
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                  className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Analyzing historical data & engagement patterns...
                </motion.p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Score Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-[#f5f5f7] dark:bg-[#2c2c2e] p-8 rounded-3xl">
                  <div className={`relative w-40 h-40 flex items-center justify-center rounded-full ${bg}`}>
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-200 dark:text-slate-700" />
                      <motion.circle 
                        cx="80" cy="80" r="70" 
                        fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="439.8"
                        initial={{ strokeDashoffset: 439.8 }}
                        animate={{ strokeDashoffset: 439.8 - (439.8 * probability) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={color}
                      />
                    </svg>
                    <div className="text-center">
                      <span className="text-4xl font-black text-[#1d1d1f] dark:text-white">{probability}%</span>
                      <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${color}`}>{statusText}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <h4 className="font-bold text-lg text-[#1d1d1f] dark:text-white">AI Prediction Summary</h4>
                    <p className="text-[#86868b] leading-relaxed">
                      Based on our analysis of 1,240 similar deals, this opportunity has a {statusText.toLowerCase()} profile. 
                      The recent email engagement is strong, but the decision-maker has not been heavily involved in recent meetings.
                    </p>
                  </div>
                </div>

                {/* Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-[#e5e5ea] dark:border-[#38383a] rounded-2xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <h5 className="font-bold text-[#1d1d1f] dark:text-white">Positive Signals</h5>
                    </div>
                    <ul className="space-y-2 text-sm text-[#86868b]">
                      <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 text-green-500" /> High email open rate (85%)</li>
                      <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 text-green-500" /> Budget matches historical wins</li>
                      <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 text-green-500" /> Competitor mentioned: 'None'</li>
                    </ul>
                  </div>

                  <div className="p-4 border border-[#e5e5ea] dark:border-[#38383a] rounded-2xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <h5 className="font-bold text-[#1d1d1f] dark:text-white">Risk Factors</h5>
                    </div>
                    <ul className="space-y-2 text-sm text-[#86868b]">
                      <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 text-yellow-500" /> Executive sponsor inactive for 14 days</li>
                      <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 text-yellow-500" /> Security review not yet scheduled</li>
                    </ul>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-start gap-4">
                  <Target className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <h5 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Recommended Action</h5>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Schedule a quick 15-minute sync with the executive sponsor to confirm budget allocation and initiate the security review process this week to improve win probability.
                    </p>
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

export default DealProbabilityModal;

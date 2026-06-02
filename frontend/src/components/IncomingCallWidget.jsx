import React, { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const IncomingCallWidget = () => {
  const [isRinging, setIsRinging] = useState(false);
  const [callerName, setCallerName] = useState('John Doe (TechCorp)');
  const [leadId, setLeadId] = useState('');
  const navigate = useNavigate();

  // Expose a global function for demo purposes
  useEffect(() => {
    window.simulateIncomingCall = (name = 'Jane Smith (Acme Corp)', id = '6543210') => {
      setCallerName(name);
      setLeadId(id);
      setIsRinging(true);
    };

    return () => {
      delete window.simulateIncomingCall;
    };
  }, []);

  const handleAccept = () => {
    setIsRinging(false);
    // Navigate to dummy lead ID or leads list
    if (leadId) {
      navigate(`/leads/${leadId}`);
    } else {
      navigate('/leads');
    }
  };

  const handleDecline = () => {
    setIsRinging(false);
  };

  return (
    <>
      {/* Hidden button to trigger simulator in the UI if needed */}
      <button 
        onClick={() => setIsRinging(true)} 
        className="fixed bottom-4 left-4 p-2 bg-slate-800 text-slate-400 rounded-full text-xs shadow hover:bg-slate-700 z-50 opacity-50 hover:opacity-100"
        title="Simulate Incoming Call"
      >
        <PhoneIncoming className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isRinging && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 right-8 bg-white dark:bg-[#1c1c1e] shadow-2xl rounded-2xl p-4 border border-[#e5e5ea] dark:border-[#38383a] w-80 z-[100]"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Incoming Call</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{callerName}</p>
                <p className="text-sm text-slate-500">Matching Lead Found</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <button 
                onClick={handleDecline}
                className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-xl font-bold flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Decline
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg shadow-emerald-500/30"
              >
                <Phone className="w-4 h-4 mr-2" />
                Accept
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IncomingCallWidget;

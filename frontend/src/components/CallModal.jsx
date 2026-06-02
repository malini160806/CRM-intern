import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, User, Volume2, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CallModal = ({ isOpen, onClose, contactInfo }) => {
  const [callStatus, setCallStatus] = useState('calling'); // calling, connected, ended
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [dialedNumbers, setDialedNumbers] = useState('');

  useEffect(() => {
    let timer;
    if (isOpen) {
      setCallStatus('calling');
      setDuration(0);
      setIsMuted(false);
      setDialedNumbers('');

      // Simulate answering after 3 seconds
      timer = setTimeout(() => {
        setCallStatus('connected');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const handleHangUp = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDial = (num) => {
    if (callStatus === 'connected') {
      setDialedNumbers(prev => prev + num);
    }
  };

  if (!isOpen) return null;

  const dialpadButtons = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#202020] w-full max-w-4xl rounded-xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col font-sans"
        >
          {/* Top Window Bar matching Phone Link */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-slate-700/50">
            <div className="flex items-center space-x-3 text-white">
              <div className="bg-blue-500 p-1 rounded">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-wide">Phone Link</span>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Connection Banner */}
          <div className="bg-[#005fb8] px-6 py-2.5 flex items-center justify-between text-white">
            <p className="text-sm font-medium tracking-wide">Secure connection established with mobile device</p>
          </div>

          <div className="flex flex-col md:flex-row flex-1">
            {/* Left Section - Call Info */}
            <div className="flex-1 p-10 flex flex-col items-center justify-center md:border-r border-slate-700/50">
              <div className="w-full text-left mb-auto">
                <h2 className="text-3xl font-semibold text-white tracking-tight">Calls</h2>
              </div>
              
              <div className="w-28 h-28 bg-[#2d2d2d] rounded-full flex items-center justify-center mb-6 relative shadow-lg">
                {callStatus === 'calling' && (
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-30"></div>
                )}
                <User className="w-12 h-12 text-slate-400" />
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#107c10] rounded-full border-4 border-[#202020] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {contactInfo?.name || 'Unknown Caller'}
              </h3>
              <p className="text-slate-400 text-lg mb-8">
                {contactInfo?.phone || 'No Phone Number'}
              </p>

              <div className="h-10 mb-8 flex items-center justify-center">
                {callStatus === 'calling' && (
                  <p className="text-blue-400 font-semibold text-lg animate-pulse tracking-wide">Calling...</p>
                )}
                {callStatus === 'connected' && (
                  <p className="text-emerald-400 font-bold text-2xl tracking-widest">{formatDuration(duration)}</p>
                )}
                {callStatus === 'ended' && (
                  <p className="text-red-400 font-semibold text-lg tracking-wide">Call Ended</p>
                )}
              </div>

              <div className="flex items-center space-x-6 mb-auto">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={callStatus !== 'connected'}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isMuted
                      ? 'bg-slate-600 text-white'
                      : 'bg-[#2d2d2d] text-slate-400 hover:bg-slate-700 hover:text-white'
                  } ${callStatus !== 'connected' && 'opacity-50 cursor-not-allowed'}`}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <button
                  onClick={handleHangUp}
                  className="w-16 h-16 rounded-full bg-[#e81123] hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>

                <button
                  disabled={callStatus !== 'connected'}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all bg-[#2d2d2d] text-slate-400 hover:bg-slate-700 hover:text-white ${
                    callStatus !== 'connected' && 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Right Section - Dialpad */}
            <div className="w-full md:w-96 p-10 flex flex-col items-center justify-center bg-[#1a1a1a]">
              <div className="w-full h-16 mb-8 border-b border-slate-700/50 flex items-center justify-center overflow-hidden">
                <p className="text-3xl font-light text-white tracking-[0.2em]">{dialedNumbers}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full max-w-[260px]">
                {dialpadButtons.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDial(btn.num)}
                    disabled={callStatus !== 'connected'}
                    className="aspect-square rounded-lg bg-[#252525] hover:bg-[#333333] active:bg-[#404040] flex flex-col items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                  >
                    <span className="text-2xl font-normal mb-0.5">{btn.num}</span>
                    {btn.letters && <span className="text-[11px] font-semibold text-slate-500 tracking-widest">{btn.letters}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CallModal;

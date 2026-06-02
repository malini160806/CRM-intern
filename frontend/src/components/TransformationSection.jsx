import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

const TransformationSection = () => {
  const existingSystemFeatures = [
    "Manual Excel sheets for lead tracking",
    "No automated follow-up reminders",
    "Phone/email-based lead assignment",
    "No real-time pipeline visibility",
    "Separate tools for meetings & notes",
    "No analytics or reporting dashboard",
    "High risk of data loss & duplication"
  ];

  const nexusCrmFeatures = [
    "Centralized cloud-based lead management",
    "Smart auto-reminders (Warm/Cold/Hot)",
    "Role-based intelligent lead assignment",
    "Live dashboard with pipeline analytics",
    "Integrated meeting scheduler & notes",
    "Real-time reports & conversion metrics",
    "Secure MongoDB with JWT auth"
  ];

  return (
    <div className="w-full py-20 bg-[#050b14] relative flex justify-center items-center px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <div className="mb-16 text-left relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 bg-blue-900/40 border border-blue-500/30 rounded text-blue-400 font-semibold text-xs tracking-widest uppercase"
          >
            Transformation
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Before vs After Nexus CRM
          </motion.h2>
        </div>

        {/* Comparison Section */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0 relative z-10">
          
          {/* Left Column - Existing System */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col shadow-2xl"
          >
            <div className="bg-[#FF4A4A] py-4 flex justify-center items-center space-x-2 rounded-t-lg">
              <X className="text-white/80 w-6 h-6" />
              <h3 className="text-white font-bold text-lg tracking-wider uppercase">Existing System</h3>
            </div>
            <div className="bg-[#121E36] border-2 border-[#FF4A4A] p-8 flex-1 rounded-b-lg">
              <ul className="space-y-6">
                {existingSystemFeatures.map((feature, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <AlertTriangle className="text-[#FF4A4A] w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm md:text-base">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Middle Arrow for large screens */}
          <div className="hidden lg:flex items-center justify-center relative w-16 z-20">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute bg-[#00D4FF] w-16 h-16 flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.4)]"
            >
              <ArrowRight className="text-white w-8 h-8 font-bold" strokeWidth={3} />
            </motion.div>
          </div>

          {/* Middle Arrow for small screens */}
          <div className="flex lg:hidden items-center justify-center py-6">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#00D4FF] w-12 h-12 flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,212,255,0.4)]"
            >
              <ArrowRight className="text-white w-6 h-6 rotate-90" strokeWidth={3} />
            </motion.div>
          </div>

          {/* Right Column - Nexus CRM */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex flex-col shadow-2xl"
          >
            <div className="bg-[#00E676] py-4 flex justify-center items-center space-x-2 rounded-t-lg">
              <Check className="text-white/90 w-6 h-6" strokeWidth={3} />
              <img src="/nexus-logo.png" alt="Nexus CRM" className="h-12 object-contain" />
            </div>
            <div className="bg-[#121E36] border-2 border-[#00E676] p-8 flex-1 rounded-b-lg">
              <ul className="space-y-6">
                {nexusCrmFeatures.map((feature, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <CheckCircle2 className="text-[#00E676] w-5 h-5 flex-shrink-0 mt-0.5 fill-[#00E676]/20" />
                    <span className="text-slate-200 text-sm md:text-base font-medium">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TransformationSection;

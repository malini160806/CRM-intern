import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PublicPage = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050b14] selection:bg-blue-500/30">
      {/* Header */}
      <header className="w-full p-6 md:px-8 md:py-6 flex justify-between items-center border-b border-white/5 bg-[#050b14]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/welcome')}>
          <img src="/nexus-logo.png" alt="Nexus CRM Logo" className="h-8 w-auto" />
          <span className="text-xl font-black text-white tracking-tight hidden sm:block">Nexus CRM</span>
        </div>
        <button 
          onClick={() => navigate('/welcome')}
          className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{title}</h1>
          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              This is the official {title} page for Nexus CRM.
            </p>
            <div className="h-px w-full bg-white/10 my-8" />
            <div className="space-y-4 text-slate-300">
              <p>
                We are currently updating our public documentation and resources. The comprehensive {title.toLowerCase()} information will be published here shortly.
              </p>
              <p>
                For immediate inquiries, please reach out to our support team at <a href="mailto:support@nexus-crm.com" className="text-blue-400 hover:text-blue-300">support@nexus-crm.com</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-8 text-center border-t border-white/5 mt-auto">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Nexus CRM. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicPage;

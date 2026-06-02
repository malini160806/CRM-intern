import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LogIn, UserPlus, Sparkles, Zap, Shield, BarChart3, CheckCircle2, Star, Target, MessageSquare } from 'lucide-react';
const features = [
  { icon: Zap, text: "Lightning Fast" },
  { icon: Shield, text: "Enterprise Security" },
  { icon: BarChart3, text: "Advanced Analytics" }
];

const OpeningPage = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 400); // Wait for animation to finish before routing
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1, filter: isExiting ? 'blur(10px)' : 'blur(0px)' }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-[#050b14] selection:bg-blue-500/30 overflow-hidden min-h-screen flex flex-col"
    >
      {/* Top Header */}
      <header className="w-full p-6 md:px-8 md:py-6 flex justify-center z-50 shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <img src="/nexus-logo.png" alt="Nexus CRM Logo" className="h-10 w-auto" />
          <span className="text-2xl font-black text-white tracking-tight">Nexus CRM</span>
        </motion.div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative pb-20 w-full">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10" />
        
        {/* Dynamic Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[150px] rounded-full mix-blend-screen" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, -90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[150px] rounded-full mix-blend-screen" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1], y: [0, -50, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-cyan-500/20 blur-[120px] rounded-full mix-blend-screen" 
          />
        </div>

        <div className="z-10 text-center px-4 max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12 flex flex-col items-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">Welcome to the future of CRM</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-5 leading-tight">
              Elevate Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 drop-shadow-sm">
                Business Workflow
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
              The next generation platform to manage your leads, sales, and analytics with powerful AI automation.
            </p>

            {/* Feature Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-300">
                  <feature.icon className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!showOptions ? (
                <motion.button
                  key="get-started"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowOptions(true)}
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-[0_0_25px_rgba(79,70,229,0.3)] border border-white/10"
                >
                  <span className="mr-3 text-lg tracking-wide">Get Started Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </motion.button>
              ) : (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, staggerChildren: 0.15 }}
                  className="flex flex-col sm:flex-row gap-5"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, translateY: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigate('/login')}
                    className="group flex items-center justify-center gap-3 px-8 py-3.5 font-medium text-white bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 shadow-xl"
                  >
                    <LogIn className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <span className="text-lg">Log In</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, translateY: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigate('/signup')}
                    className="group flex items-center justify-center gap-3 px-8 py-3.5 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.3)] border border-white/10"
                  >
                    <UserPlus className="w-5 h-5 text-purple-200 group-hover:text-white transition-colors" />
                    <span className="text-lg">Sign Up</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Features Showcase Section */}
      <div id="features" className="py-24 bg-[#050b14] relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Scale</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Nexus CRM combines cutting-edge AI with enterprise-grade pipeline management to give your sales team the ultimate unfair advantage.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Smart Pipeline", desc: "Automate follow-ups and never let a hot lead slip through the cracks again." },
              { icon: MessageSquare, title: "AI Assistant", desc: "Instantly draft emails, summarize meetings, and get real-time sales coaching." },
              { icon: BarChart3, title: "Live Analytics", desc: "Beautiful, real-time dashboards that give you a bird's-eye view of your revenue." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-[#08101a] relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Industry Leaders</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "VP of Sales, TechFlow", quote: "Since switching to Nexus CRM, our lead conversion rate has jumped 40%. The AI follow-up reminders are a total game-changer." },
              { name: "Marcus Chen", role: "CEO, GrowthWave", quote: "The cleanest, fastest CRM we've ever used. We onboarded our entire 50-person sales team in less than two days." },
              { name: "Elena Rodriguez", role: "Director of RevOps", quote: "Finally, a CRM that doesn't feel like a spreadsheet from 1995. It's beautiful, powerful, and my team actually enjoys using it." }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10"
              >
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-300 italic mb-6 leading-relaxed">"{t.quote}"</p>
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-[#050b14] relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Pricing</span></h2>
            <p className="text-slate-400">Start for free, upgrade when you need to.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "Free", desc: "Perfect for individuals and small teams.", features: ["Up to 1,000 Leads", "Basic Analytics", "Email Integration", "Community Support"] },
              { name: "Professional", price: "$49", desc: "For growing teams that need more power.", featured: true, features: ["Unlimited Leads", "AI Assistant Access", "Advanced Pipelines", "Priority Support", "Custom Roles"] },
              { name: "Enterprise", price: "Custom", desc: "For large organizations with complex needs.", features: ["Dedicated Account Manager", "Custom Integrations", "On-premise Deployment", "SLA Guarantees"] }
            ].map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-8 rounded-[2rem] border ${p.featured ? 'bg-gradient-to-b from-indigo-900/40 to-transparent border-indigo-500/50 relative' : 'bg-white/5 border-white/10'}`}
              >
                {p.featured && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>}
                <h3 className="text-2xl font-bold text-white mb-2">{p.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-black text-white">{p.price}</span>
                  {p.price !== 'Free' && p.price !== 'Custom' && <span className="text-slate-500">/mo per user</span>}
                </div>
                <p className="text-sm text-slate-400 mb-8">{p.desc}</p>
                <ul className="space-y-4 mb-8">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className={`w-5 h-5 ${p.featured ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleNavigate('/signup')} className={`w-full py-3 rounded-xl font-bold transition-all ${p.featured ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#02050a] border-t border-white/10 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src="/nexus-logo.png" alt="Nexus CRM Logo" className="h-8 w-auto opacity-90" />
              <span className="text-xl font-black text-white tracking-tight">Nexus CRM</span>
            </div>
            <p className="text-slate-500 text-sm">The intelligent CRM platform that scales with your ambition.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><button onClick={() => handleNavigate('/integrations')} className="hover:text-blue-400 transition-colors">Integrations</button></li>
              <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><button onClick={() => handleNavigate('/changelog')} className="hover:text-blue-400 transition-colors">Changelog</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={() => handleNavigate('/about')} className="hover:text-blue-400 transition-colors">About Us</button></li>
              <li><button onClick={() => handleNavigate('/careers')} className="hover:text-blue-400 transition-colors">Careers</button></li>
              <li><button onClick={() => handleNavigate('/blog')} className="hover:text-blue-400 transition-colors">Blog</button></li>
              <li><button onClick={() => handleNavigate('/contact')} className="hover:text-blue-400 transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={() => handleNavigate('/privacy')} className="hover:text-blue-400 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => handleNavigate('/terms')} className="hover:text-blue-400 transition-colors">Terms of Service</button></li>
              <li><button onClick={() => handleNavigate('/cookies')} className="hover:text-blue-400 transition-colors">Cookie Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Nexus CRM Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default OpeningPage;

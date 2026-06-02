import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Building2, Crown,
  ShieldCheck, Briefcase, ChevronRight,
  Check, Globe, Users, Target, Shield,
  ArrowRight, Sparkles, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('SalesPerson');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // CEO specific
    companyName: '',
    companySize: '',
    industry: '',
    website: '',
    adminCode: '',
    // Sales Lead specific
    department: '',
    teamSize: '',
    managerId: '',
    // Sales Person specific
    employeeId: '',
    salesRegion: '',
    reportingManager: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const roles = [
    {
      id: 'CEO',
      label: 'Manager',
      icon: Crown,
      subtitle: 'Join AI CRM as Manager',
      caption: 'Enterprise-level access & business control',
      badge: 'Enterprise Admin',
      desc: 'Manage company operations, analytics, employees, revenue tracking, and AI insights.'
    },
    {
      id: 'SalesLead',
      label: 'Sales Lead',
      icon: ShieldCheck,
      subtitle: 'Join AI CRM as Sales Lead',
      caption: 'Manage sales teams & pipelines',
      badge: 'Team Manager',
      desc: 'Track team performance, assign leads, monitor conversions, and manage workflows.'
    },
    {
      id: 'SalesPerson',
      label: 'Sales Person',
      icon: Briefcase,
      subtitle: 'Join AI CRM as Sales Person',
      caption: 'Track leads and close deals',
      badge: 'Sales Executive',
      desc: 'Manage assigned leads, follow up with customers, and track your sales targets.'
    }
  ];

  const currentRoleInfo = roles.find(r => r.id === selectedRole);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/signup', {
        ...formData,
        role: selectedRole
      });

      dispatch(loginSuccess(response.data));

      // Dynamic Redirection
      const dashboardPath = {
        'CEO': '/dashboard/ceo',
        'SalesLead': '/dashboard/sales-lead',
        'SalesPerson': '/dashboard/sales-person'
      }[selectedRole];

      navigate(dashboardPath);
    } catch (err) {
      console.error('Signup Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/google', {
        idToken: credentialResponse.credential
      });
      dispatch(loginSuccess(response.data));

      const userRole = response.data.role;
      const dashboardPath = {
        'CEO': '/dashboard/ceo',
        'SalesLead': '/dashboard/sales-lead',
        'SalesPerson': '/dashboard/sales-person'
      }[userRole] || '/';

      navigate(dashboardPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google signup was unsuccessful.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-white to-white">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left Side: Role Info & Visuals */}
        <div className="lg:col-span-5 space-y-8 pt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={selectedRole}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-black uppercase tracking-widest mb-6">
              <Shield className="w-3 h-3" />
              <span>{currentRoleInfo.badge}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 leading-tight mb-4">
              {currentRoleInfo.subtitle}
            </h1>
            <p className="text-xl text-slate-500 font-medium">
              {currentRoleInfo.caption}
            </p>
            <p className="mt-6 text-slate-600 leading-relaxed max-w-md">
              {currentRoleInfo.desc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = selectedRole === r.id;
              return (
                <motion.button
                  key={r.id}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(r.id)}
                  className={`relative p-6 rounded-3xl border-2 transition-all duration-300 text-left group overflow-hidden ${isActive
                    ? 'bg-white border-primary-500 shadow-2xl shadow-primary-200 z-10'
                    : 'bg-white/50 border-transparent hover:border-slate-200 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${isActive ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`font-black uppercase tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                        {r.label}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium tracking-wide">Select this workspace</p>
                    </div>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-primary-600/5 pointer-events-none"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7">
          <motion.div
            layout
            className="glass-card p-10 rounded-[2.5rem] border-white shadow-2xl bg-white/80 backdrop-blur-xl relative"
          >
            <div className="absolute top-0 right-0 p-8">
              <Sparkles className="w-8 h-8 text-primary-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center space-x-2"
                >
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Fields */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      name="name" required value={formData.name} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all font-medium text-slate-900"
                      placeholder="John Carter"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      name="email" type="email" required value={formData.email} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all font-medium text-slate-900"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500" />
                    <input
                      name="companyName" required value={formData.companyName} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all font-medium text-slate-900"
                      placeholder="Nexus Corp"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Fields Section */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRole}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {selectedRole === 'CEO' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Size</label>
                        <div className="relative group">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500" />
                          <select
                            name="companySize" value={formData.companySize} onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all appearance-none"
                          >
                            <option value="">Select Size</option>
                            <option value="1-10">1-10 Employees</option>
                            <option value="11-50">11-50 Employees</option>
                            <option value="51-200">51-200 Employees</option>
                            <option value="201+">201+ Employees</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedRole === 'SalesLead' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                        <div className="relative group">
                          <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500" />
                          <input
                            name="department" required value={formData.department} onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all"
                            placeholder="Enterprise Sales"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Team Size</label>
                        <div className="relative group">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500" />
                          <input
                            name="teamSize" type="number" required value={formData.teamSize} onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all"
                            placeholder="12"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedRole === 'SalesPerson' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Employee ID</label>
                        <div className="relative group">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500" />
                          <input
                            name="employeeId" required value={formData.employeeId} onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all"
                            placeholder="EMP-4509"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sales Region</label>
                        <div className="relative group">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500" />
                          <input
                            name="salesRegion" required value={formData.salesRegion} onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all"
                            placeholder="North America"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      name="password" type="password" required value={formData.password} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative flex items-center justify-center py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span>Create {currentRoleInfo.label} Account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs font-black uppercase tracking-widest text-slate-400">
                  <span className="px-4 bg-white">Or join with</span>
                </div>
              </div>

              <div className="flex justify-center pb-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  shape="pill"
                  width="360"
                  text="signup_with"
                />
              </div>

              <p className="text-center text-slate-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-black hover:underline underline-offset-4 decoration-2">
                  Log in here
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

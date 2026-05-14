import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock OTP flow
    setTimeout(() => {
      setIsSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full glass-card p-8 space-y-8 animate-in fade-in duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-6 dark:bg-slate-800">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Forgot Password?</h2>
          <p className="mt-2 text-slate-600">No worries, we'll send you reset instructions.</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  className="input-field w-full pl-10"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Reset Password</span>}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6 animate-in zoom-in duration-300">
            <div className="flex items-center justify-center text-green-500">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">Check your email</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We've sent a password reset link to <span className="font-bold text-slate-900">{email}</span>.
              </p>
            </div>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-sm font-bold text-primary-600 hover:text-primary-700"
            >
              Didn't receive the email? Click to retry
            </button>
          </div>
        )}

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-primary-600 transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      dispatch(loginSuccess(response.data));

      const userRole = response.data.role;
      const dashboardPath = {
        'CEO': '/dashboard/ceo',
        'SalesLead': '/dashboard/sales-lead',
        'SalesPerson': '/dashboard/sales-person'
      }[userRole] || '/';

      navigate(dashboardPath);
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    dispatch(loginStart());
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
      dispatch(loginFailure(err.response?.data?.message || 'Google login failed'));
    }
  };

  const handleGoogleError = () => {
    dispatch(loginFailure('Google login was unsuccessful. Try again.'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full glass-card p-8 space-y-8 animate-in fade-in duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-slate-600">Login to your AI CRM account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

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

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="input-field w-full pl-10 pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-primary-500 border-slate-300 focus:ring-primary-500" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <Link to="/forgot-password" title="Forgot Password" className="text-primary-600 hover:text-primary-700 font-medium">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In</span>}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_blue"
            shape="pill"
            width="320"
          />
        </div>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-bold">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

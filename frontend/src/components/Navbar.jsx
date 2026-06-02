import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, User, Sun, Moon, Plus, ChevronRight, HelpCircle, Command, 
  Users, Trophy, Building2, Calendar, Phone, Mail, FileText, Headphones, BookOpen,
  Settings, LogOut, MessageSquare, Shield, ExternalLink, Menu, StickyNote
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { openModal } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';
import HelpModal from './HelpModal';
import axios from 'axios';

const Navbar = ({ toggleDarkMode, isDarkMode, toggleMobileMenu }) => {
  const { user } = useSelector((state) => state.auth);
  const { breadcrumbOverrides } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [eventOverrides, setEventOverrides] = useState({});
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const userRef = useRef(null);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 0) return 'UPCOMING'; // for future meetings
    if (diffInSeconds < 60) return 'JUST NOW';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} MINS AGO`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} HOURS AGO`;
    return `${Math.floor(diffInSeconds / 86400)} DAYS AGO`;
  };

  const fetchNotifications = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.token) return;
      const res = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      
      const mapped = res.data.map(n => {
        let icon = Bell;
        let color = 'bg-slate-100 text-slate-600';
        
        if (n.type === 'lead') { icon = Users; color = 'bg-blue-100 text-blue-600'; }
        if (n.type === 'meeting') { icon = Calendar; color = 'bg-green-100 text-green-600'; }
        if (n.type === 'deal') { icon = Trophy; color = 'bg-amber-100 text-amber-600'; }
        
        return { ...n, icon, color, timeStr: formatTimeAgo(n.time) };
      });
      
      setNotifications(mapped);
      setUnreadCount(mapped.length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    const handleBreadcrumbUpdate = (e) => {
      setEventOverrides(prev => ({ ...prev, [e.detail.id]: e.detail.name }));
    };
    window.addEventListener('breadcrumb_update', handleBreadcrumbUpdate);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsQuickCreateOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('breadcrumb_update', handleBreadcrumbUpdate);
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData?.token) {
        await axios.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
      }
    } catch (err) {
      console.error('Logout logging failed', err);
    }
    dispatch(logout());
    navigate('/login');
  };

  const quickActions = [
    { name: 'New Lead', icon: Users, color: 'text-blue-600', path: '/leads' },
    { name: 'New Deal', icon: Trophy, color: 'text-amber-600', path: '/deals' },
    { name: 'New Contact', icon: Building2, color: 'text-purple-600', path: '/contacts' },
    { name: 'New Meeting', icon: Calendar, color: 'text-green-600', path: '/meetings' },
    { name: 'New Case', icon: Headphones, color: 'text-rose-600', path: '/cases' },
    { name: 'New Solution', icon: BookOpen, color: 'text-indigo-600', path: '/solutions' },
  ];

  return (
    <>
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#e5e5ea] px-8 flex items-center justify-between z-[60] sticky top-0 dark:bg-dark-bg/80 dark:border-dark-border">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-3 overflow-hidden">
        <button 
          onClick={toggleMobileMenu} 
          className="md:hidden p-2 text-[#515154] hover:bg-[#ebebf0] rounded-lg transition-all dark:text-[#aeaeb2] dark:hover:bg-[#2c2c2e]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="hidden sm:block text-[#515154] hover:text-[#1d1d1f] dark:text-[#aeaeb2] dark:hover:text-white transition-colors">
          <Command className="w-4 h-4" />
        </Link>
        {pathnames.length > 0 && <ChevronRight className="w-4 h-4 text-slate-300" />}
        <nav className="flex items-center space-x-2 whitespace-nowrap">
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return (
              <React.Fragment key={name}>
                <Link
                  to={routeTo}
                  className={`text-sm font-semibold capitalize ${
                    isLast ? 'text-[#1d1d1f] dark:text-white' : 'text-[#515154] hover:text-[#1d1d1f] dark:text-[#aeaeb2] dark:hover:text-white'
                  }`}
                >
                  {eventOverrides[name] || (breadcrumbOverrides && breadcrumbOverrides[name]) ? (eventOverrides[name] || breadcrumbOverrides[name]) : name.replace('-', ' ')}
                </Link>
                {!isLast && <ChevronRight className="w-3 h-3 text-slate-300" />}
              </React.Fragment>
            );
          })}
          {pathnames.length === 0 && (
            <span className="text-sm font-bold text-slate-900 dark:text-white">Home</span>
          )}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        {/* Quick Create Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
            className={`hidden md:flex items-center space-x-2 px-4 py-1.5 rounded-full font-semibold text-xs transition-all active:scale-95 ${
              isQuickCreateOpen 
                ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-black' 
                : 'bg-[#0071e3] text-white hover:bg-[#0077ed]'
            }`}
          >
            <Plus className={`w-4 h-4 transition-transform duration-300 ${isQuickCreateOpen ? 'rotate-45' : ''}`} />
            <span>QUICK CREATE</span>
          </button>

          <AnimatePresence>
            {isQuickCreateOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-xl border border-[#e5e5ea] dark:border-[#38383a] p-2"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Quick Actions</p>
                <div className="space-y-1">
                  {quickActions
                    .filter(action => !(action.name === 'New Lead' && user?.role === 'SalesPerson'))
                    .map((action) => (
                    <button
                      key={action.name}
                      onClick={() => {
                        if (action.name === 'New Lead') {
                          dispatch(openModal('lead'));
                        } else if (action.name === 'New Deal') {
                          dispatch(openModal('deal'));
                        } else if (action.name === 'New Contact') {
                          dispatch(openModal('contact'));
                        } else if (action.name === 'New Meeting') {
                          dispatch(openModal('meeting'));
                        } else if (action.name === 'New Case') {
                          dispatch(openModal('case'));
                        } else if (action.name === 'New Solution') {
                          dispatch(openModal('solution'));
                        }
                        setIsQuickCreateOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center group-hover:scale-110 transition-transform ${action.color}`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-[#1d1d1f] dark:text-white">{action.name}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-[#e5e5ea] dark:border-[#38383a]">
                  <button className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-[#f5f5f7] text-[#0071e3] transition-colors group">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-black uppercase tracking-widest text-[10px]">Create Custom...</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-[#d2d2d7] dark:bg-[#38383a] mx-2 hidden sm:block"></div>

        <button 
          onClick={toggleDarkMode}
          className="p-2 text-[#515154] hover:bg-[#ebebf0] rounded-lg transition-all dark:text-[#aeaeb2] dark:hover:bg-[#2c2c2e]"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button 
            className="p-2 text-[#515154] hover:bg-[#ebebf0] rounded-lg transition-all dark:text-[#aeaeb2] dark:hover:bg-[#2c2c2e]" 
            title="Sticky Notes"
            onClick={() => dispatch(openModal('stickyNotes'))}
          >
            <StickyNote className="w-4 h-4 text-yellow-500" />
          </button>
        </div>

        <div className="relative">
          <button 
            className="p-2 text-[#515154] hover:bg-[#ebebf0] rounded-lg transition-all dark:text-[#aeaeb2] dark:hover:bg-[#2c2c2e]" 
            title="Help Center"
            onClick={() => dispatch(openModal('help'))}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              if (!isNotificationsOpen) setUnreadCount(0);
            }}
            className={`relative p-2 rounded-lg transition-all ${
              isNotificationsOpen 
                ? 'bg-[#e5e5ea] text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white' 
                : 'text-[#515154] hover:bg-[#ebebf0] dark:text-[#aeaeb2] dark:hover:bg-[#2c2c2e]'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-xl border border-[#e5e5ea] dark:border-[#38383a] overflow-hidden"
              >
                <div className="p-4 border-b border-[#e5e5ea] dark:border-[#38383a] flex items-center justify-between">
                  <h3 className="font-semibold text-[#1d1d1f] dark:text-white">Notifications</h3>
                  <button className="text-[10px] font-semibold text-[#0071e3] uppercase tracking-widest hover:underline">Mark all as read</button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors cursor-pointer border-b border-[#e5e5ea] last:border-0 dark:border-[#38383a]">
                      <div className="flex space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                          <notif.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{notif.description}</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{notif.timeStr}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No new notifications
                    </div>
                  )}
                </div>
                <button className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold hover:text-primary-600 transition-colors">
                  View all notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={userRef}>
          <div 
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="w-8 h-8 bg-[#0071e3] rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm cursor-pointer hover:scale-105 transition-transform overflow-hidden shrink-0"
          >
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'M'
            )}
          </div>

          <AnimatePresence>
            {isUserDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-xl border border-[#e5e5ea] dark:border-[#38383a] p-2 overflow-hidden"
              >
                <div className="p-3 border-b border-[#e5e5ea] dark:border-[#38383a] mb-1">
                  <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-[#515154] truncate">{user?.email}</p>
                  <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white text-[10px] font-semibold uppercase tracking-wider">
                    {user?.role === 'CEO' ? 'Manager' : user?.role}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Link 
                    to="/settings" 
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center space-x-3 w-full p-2.5 rounded-xl hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors group"
                  >
                    <User className="w-4 h-4 text-[#515154] group-hover:text-[#1d1d1f] dark:text-[#aeaeb2] dark:group-hover:text-white" />
                    <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">My Profile</span>
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center space-x-3 w-full p-2.5 rounded-xl hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors group"
                  >
                    <Settings className="w-4 h-4 text-[#515154] group-hover:text-[#1d1d1f] dark:text-[#aeaeb2] dark:group-hover:text-white" />
                    <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Settings</span>
                  </Link>
                  <div className="p-2.5 flex items-center justify-between text-[10px] font-semibold text-[#86868b] uppercase tracking-widest mt-2 border-t border-[#e5e5ea] dark:border-[#38383a] pt-3">
                    Resources
                  </div>
                  <button 
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      navigate('/settings'); // Add hash or state if you want to jump to security tab
                    }}
                    className="flex items-center space-x-3 w-full p-2.5 rounded-xl hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors group"
                  >
                    <Shield className="w-4 h-4 text-[#515154] group-hover:text-[#1d1d1f] dark:text-[#aeaeb2] dark:group-hover:text-white" />
                    <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Security</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      dispatch(openModal({ modal: 'help', view: 'docs' }));
                    }}
                    className="flex items-center space-x-3 w-full p-2.5 rounded-xl hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 text-[#515154] group-hover:text-[#1d1d1f] dark:text-[#aeaeb2] dark:group-hover:text-white" />
                    <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Docs</span>
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-[#e5e5ea] dark:border-[#38383a]">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-[#ffe6e6] dark:hover:bg-[#ff3b30]/20 text-[#ff3b30] transition-colors group"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-semibold uppercase tracking-widest text-[10px]">Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
    <HelpModal />
  </>
  );
};

export default Navbar;

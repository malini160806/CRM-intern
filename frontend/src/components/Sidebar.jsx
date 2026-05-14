import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Mail, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bot,
  Bell,
  Clock
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Leads', icon: Users, path: '/leads' },
    { name: 'AI Chatbot', icon: Bot, path: '/chatbot' },
    { name: 'Meetings', icon: Calendar, path: '/meetings' },
    { name: 'Email Automation', icon: Mail, path: '/email' },
    { name: 'Follow-ups', icon: Clock, path: '/follow-ups' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen glass-card rounded-none border-y-0 border-l-0 flex flex-col transition-all duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          AI CRM
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                  : 'hover:bg-primary-50 text-slate-600 hover:text-primary-600'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center space-x-3 p-3 w-full rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

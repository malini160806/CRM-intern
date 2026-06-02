import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Clock,
  ChevronDown,
  ChevronRight,
  Briefcase,
  FileText,
  Package,
  Headphones,
  LineChart,
  Search,
  Plus,
  Box,
  CreditCard,
  Building2,
  Trophy,
  History,
  Phone,
  ChevronLeft,
  Menu,
  Globe,
  Zap
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarGroup = ({ title, items, isOpen, onToggle, isCollapsed }) => {
  const location = useLocation();
  const hasActiveChild = items.some(item => location.pathname === item.path);

  return (
    <div className="mb-2">
      <button 
        onClick={isCollapsed ? undefined : onToggle}
        className={`w-full flex items-center justify-between rounded-xl transition-all duration-300 group overflow-hidden ${
          hasActiveChild ? 'text-[#1d1d1f] font-semibold dark:text-white' : 'text-[#515154] hover:bg-[#ebebf0] hover:text-[#1d1d1f] dark:text-[#aeaeb2] dark:hover:bg-[#2c2c2e] dark:hover:text-white'
        } ${isCollapsed ? 'max-h-0 opacity-0 p-0 m-0 border-0' : 'max-h-[50px] opacity-100 p-3'}`}
      >
        <span className="text-xs uppercase font-black tracking-widest whitespace-nowrap">{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
      </button>
      <AnimatePresence>
        {(isOpen || isCollapsed) && (
          <motion.div 
            initial={isCollapsed ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={isCollapsed ? false : { height: 0, opacity: 0 }}
            className={`overflow-hidden space-y-1 transition-all duration-300 ${isCollapsed ? 'mt-0 pl-0' : 'mt-1 pl-2'}`}
          >
            {items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center p-2.5 rounded-lg transition-all duration-200 group ${
                    isCollapsed ? 'justify-center' : 'space-x-3'
                  } ${
                    isActive 
                      ? 'bg-[#e5e5ea] text-[#1d1d1f] font-semibold dark:bg-[#2c2c2e] dark:text-white' 
                      : 'hover:bg-[#ebebf0] text-[#515154] hover:text-[#1d1d1f] dark:hover:bg-[#2c2c2e] dark:hover:text-white dark:text-[#aeaeb2]'
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
                  {item.name}
                </span>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    Sales: true,
    Activities: true,
    Inventory: false,
    Support: false,
    Tools: true
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const [searchTerm, setSearchTerm] = useState('');

  const menuGroups = {
    Home: [
      { name: 'Command Center', icon: Globe, path: '/command-center', roles: ['CEO', 'Sales Lead'] },
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { name: 'KPI Dashboard', icon: BarChart3, path: '/kpi-dashboard', roles: ['CEO', 'Sales Lead'] },
      { name: 'Analytics', icon: LineChart, path: '/analytics', roles: ['CEO', 'Sales Lead'] },
      { name: 'Reports', icon: FileText, path: '/reports', roles: ['CEO'] },
    ],
    Sales: [
      { name: 'Accounts', icon: Briefcase, path: '/accounts' },
      { name: 'Leads', icon: Users, path: '/leads' },
      { name: 'Contacts', icon: Building2, path: '/contacts' },
      { name: 'Deals', icon: Trophy, path: '/deals' },
      { name: 'Forecasts', icon: LineChart, path: '/forecasts', roles: ['CEO', 'Sales Lead'] },
    ],
    Activities: [
      { name: 'Tasks', icon: Clock, path: '/follow-ups' },
      { name: 'Meetings', icon: Calendar, path: '/meetings' },
      { name: 'Calls', icon: Phone, path: '/calls' },
      { name: 'Call Analytics', icon: Headphones, path: '/call-analytics', roles: ['CEO', 'Sales Lead'] },
    ],
    Inventory: [
      { name: 'Products', icon: Package, path: '/products', roles: ['CEO', 'Sales Lead'] },
      { name: 'Invoices', icon: CreditCard, path: '/invoices', roles: ['CEO', 'Sales Lead'] },
      { name: 'Quotes', icon: FileText, path: '/quotes', roles: ['CEO', 'Sales Lead'] },
    ],
    Support: [
      { name: 'Cases', icon: Headphones, path: '/cases', roles: ['CEO', 'Sales Lead'] },
      { name: 'Solutions', icon: Bot, path: '/solutions' },
    ],
    Tools: [
      { name: 'Automations', icon: Zap, path: '/automations' },
      { name: 'AI Chatbot', icon: Bot, path: '/ai-chatbot' },
      { name: 'Email Automation', icon: Mail, path: '/email' },
      { name: 'Settings', icon: Settings, path: '/settings' },
    ]
  };

  const filterItems = (items, groupName = '') => {
    let filtered = items.filter(item => !item.roles || item.roles.includes(user?.role));
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const groupMatch = groupName.toLowerCase().includes(term);
      filtered = filtered.filter(item => groupMatch || item.name.toLowerCase().includes(term));
    }
    return filtered;
  };

  const isGroupOpen = (groupName) => {
    if (searchTerm) {
      return filterItems(menuGroups[groupName], groupName).length > 0;
    }
    return openGroups[groupName];
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative h-screen bg-[#f5f5f7] border-r border-[#e5e5ea] flex flex-col transition-all duration-300 ease-in-out z-[70] overflow-hidden dark:bg-dark-card dark:border-dark-border shrink-0`}>
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'} mb-6 transition-all duration-300`}>
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'gap-0' : 'gap-3'}`}>
            <img src="/nexus-logo.png" alt="Nexus CRM Logo" className={`${isCollapsed ? 'h-8' : 'h-12'} object-contain drop-shadow-md transition-all duration-300 shrink-0`} />
            <h1 className={`text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-white uppercase whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
              Nexus CRM
            </h1>
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="p-2 bg-slate-100 rounded-lg dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            {isCollapsed ? <Menu className="w-5 h-5 text-slate-500" /> : <ChevronLeft className="w-5 h-5 text-slate-500" />}
          </button>
        </div>

        {/* Search Bar */}
        <div className={`relative group overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[60px] opacity-100'}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search modules..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#d2d2d7] rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all dark:bg-[#1c1c1e] dark:border-[#38383a] dark:text-white"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        {/* Flat Home Items */}
        {filterItems(menuGroups.Home, 'Home').length > 0 && (
          <div className="mb-6">
            {filterItems(menuGroups.Home, 'Home').map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-3 p-3'} rounded-xl transition-all duration-200 group mb-1 ${
                    isActive 
                      ? 'bg-[#e5e5ea] text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white' 
                      : 'hover:bg-[#ebebf0] text-[#515154] hover:text-[#1d1d1f] dark:text-[#aeaeb2] dark:hover:bg-[#2c2c2e] dark:hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className={`font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
                  {item.name}
                </span>
              </NavLink>
            ))}
          </div>
        )}

        {/* Grouped Items */}
        {filterItems(menuGroups.Sales, 'Sales').length > 0 && (
          <SidebarGroup 
            title="Sales" 
            items={filterItems(menuGroups.Sales, 'Sales')} 
            isOpen={isGroupOpen('Sales')} 
            onToggle={() => toggleGroup('Sales')} 
            isCollapsed={isCollapsed}
          />
        )}
        
        {filterItems(menuGroups.Activities, 'Activities').length > 0 && (
          <SidebarGroup 
            title="Activities" 
            items={filterItems(menuGroups.Activities, 'Activities')} 
            isOpen={isGroupOpen('Activities')} 
            onToggle={() => toggleGroup('Activities')} 
            isCollapsed={isCollapsed}
          />
        )}
        
        {(user?.role === 'CEO' || user?.role === 'Sales Lead') && (
          <>
            {filterItems(menuGroups.Inventory, 'Inventory').length > 0 && (
              <SidebarGroup 
                title="Inventory" 
                items={filterItems(menuGroups.Inventory, 'Inventory')} 
                isOpen={isGroupOpen('Inventory')} 
                onToggle={() => toggleGroup('Inventory')} 
                isCollapsed={isCollapsed}
              />
            )}
            
            {filterItems(menuGroups.Support, 'Support').length > 0 && (
              <SidebarGroup 
                title="Support" 
                items={filterItems(menuGroups.Support, 'Support')} 
                isOpen={isGroupOpen('Support')} 
                onToggle={() => toggleGroup('Support')} 
                isCollapsed={isCollapsed}
              />
            )}
          </>
        )}
        
        {filterItems(menuGroups.Tools, 'Tools').length > 0 && (
          <SidebarGroup 
            title="Tools" 
            items={filterItems(menuGroups.Tools, 'Tools')} 
            isOpen={isGroupOpen('Tools')} 
            onToggle={() => toggleGroup('Tools')} 
            isCollapsed={isCollapsed}
          />
        )}
      </nav>

      {/* User / Workspace Area */}
      <div className={`p-4 border-t border-[#e5e5ea] bg-transparent dark:border-[#38383a] transition-all duration-300 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        
        <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center p-0 mb-4 bg-transparent border-transparent shadow-none' : 'space-x-3 p-3 mb-4 bg-white rounded-xl shadow-sm border border-[#e5e5ea] dark:bg-[#1c1c1e] dark:border-[#38383a]'}`}>
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black overflow-hidden shrink-0">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'M'
            )}
          </div>
          <div className={`flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0 hidden' : 'max-w-[150px] opacity-100'}`}>
            <p className="text-sm font-bold text-slate-900 truncate dark:text-white">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{user?.role === 'CEO' ? 'Manager' : (user?.role || 'Sales Person')}</p>
          </div>
          <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0 hidden' : 'max-w-[20px] opacity-100'}`} />
        </div>

        <button
          onClick={() => dispatch(logout())}
          title={isCollapsed ? "Sign Out" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-3 p-3'} w-full rounded-xl text-[#515154] hover:bg-[#ebebf0] hover:text-[#1d1d1f] transition-all duration-200 font-semibold text-sm dark:text-[#aeaeb2] dark:hover:bg-[#2c2c2e] dark:hover:text-white`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'}`}>Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;

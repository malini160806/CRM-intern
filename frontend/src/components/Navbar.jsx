import React from 'react';
import { Search, Bell, User, Sun, Moon } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = ({ toggleDarkMode, isDarkMode }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-20 glass-card rounded-none border-t-0 border-x-0 px-8 flex items-center justify-between z-10">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search leads, meetings, tasks..."
          className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:bg-slate-800/50 dark:text-white"
        />
      </div>

      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all dark:text-slate-400 dark:hover:bg-slate-800">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500">{user?.role || 'Salesperson'}</p>
          </div>
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold border-2 border-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

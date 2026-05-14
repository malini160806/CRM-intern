import React from 'react';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Bot, 
  Mail,
  Save,
  Globe,
  Lock
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile, company settings, and AI preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          {[
            { name: 'Profile', icon: User, active: true },
            { name: 'Company', icon: Building2, active: false },
            { name: 'Notifications', icon: Bell, active: false },
            { name: 'AI Engine', icon: Bot, active: false },
            { name: 'Email Config', icon: Mail, active: false },
            { name: 'Security', icon: Shield, active: false },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h3>
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 text-2xl font-bold dark:bg-slate-800">
                A
              </div>
              <div className="space-y-2">
                <button className="btn-primary py-2 px-4 text-sm">Change Photo</button>
                <p className="text-xs text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input type="text" className="input-field w-full" defaultValue="Alex Johnson" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input type="email" className="input-field w-full" defaultValue="alex@acme.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                  <input type="text" className="input-field w-full bg-slate-50 dark:bg-slate-800/50" value="Admin" disabled />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                  <input type="text" className="input-field w-full" defaultValue="+1 (555) 000-0000" />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button type="submit" className="btn-primary py-2 px-8 flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Security Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl dark:bg-slate-800/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-xl dark:bg-slate-800">
                    <Lock className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500">Secure your account with an extra layer of security.</p>
                  </div>
                </div>
                <button className="text-primary-600 font-bold hover:text-primary-700">Enable</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl dark:bg-slate-800/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-xl dark:bg-slate-800">
                    <Globe className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Password Management</p>
                    <p className="text-sm text-slate-500">Last changed 3 months ago.</p>
                  </div>
                </div>
                <button className="text-primary-600 font-bold hover:text-primary-700">Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

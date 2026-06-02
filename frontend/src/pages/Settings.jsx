import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Bot, 
  Mail,
  Save,
  Globe,
  Lock,
  Clock
} from 'lucide-react';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    email: user?.email || '',
    image: user?.image || null
  });
  const [sysSettings, setSysSettings] = useState({
    reminderDaysHot: 1,
    reminderDaysWarm: 2,
    reminderDaysCold: 3
  });

  const fetchSettings = async () => {
    try {
      if (user?.role !== 'CEO' && user?.role !== 'Admin') return;
      const token = JSON.parse(localStorage.getItem('user')).token;
      const response = await axios.get('/api/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSysSettings(response.data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };
  const fetchTeam = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const response = await axios.get('/api/users/company', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeamMembers(response.data);
    } catch (err) {
      console.error('Failed to fetch team members', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'Company') {
      fetchTeam();
    }
    if (activeTab === 'Automation') {
      fetchSettings();
    }
  }, [activeTab]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.put('/api/settings', sysSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Automation settings updated!');
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const response = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(updateUser(response.data));
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
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
            { name: 'Automation', icon: Clock, active: false },
            { name: 'Notifications', icon: Bell, active: false },
            { name: 'AI Engine', icon: Bot, active: false },
            { name: 'Email Config', icon: Mail, active: false },
            { name: 'Security', icon: Shield, active: false },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                activeTab === item.name
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
          {activeTab === 'Profile' && (
            <>
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h3>
                
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 text-2xl font-bold dark:bg-slate-800 overflow-hidden">
                    {formData.image ? (
                      <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="btn-primary py-2 px-4 text-sm cursor-pointer inline-block">
                      Change Photo
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                    <p className="text-xs text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                      <input 
                        type="text" 
                        className="input-field w-full" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                      <input 
                        type="email" 
                        className="input-field w-full" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                      <input type="text" className="input-field w-full bg-slate-50 dark:bg-slate-800/50" value={user?.role} disabled />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company</label>
                      <input type="text" className="input-field w-full bg-slate-50 dark:bg-slate-800/50" value={user?.companyName} disabled />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary py-2 px-8 flex items-center space-x-2">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
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
                </div>
              </div>
            </>
          )}

          {activeTab === 'Company' && (
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Company Team</h3>
                  <p className="text-sm text-slate-500">{user?.companyName} Workspace</p>
                </div>
                <button className="btn-primary py-2 px-4 text-sm">+ Invite Member</button>
              </div>

              <div className="space-y-4">
                {teamMembers.length > 0 ? (
                  teamMembers.map((member, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold dark:bg-slate-800 overflow-hidden">
                          {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            member.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          member.role === 'CEO' || member.role === 'Admin' 
                            ? 'bg-primary-100 text-primary-600' 
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          {member.role || 'Member'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-400">Loading your team...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Email Config' && (
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 text-primary-600 mb-6">
                <Mail className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email Configuration</h3>
              </div>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Connect your SMTP or Gmail account to send real emails directly from the CRM. 
                For Gmail, you must use an <span className="font-bold text-primary-600">App Password</span>.
              </p>
              
              <div className="p-6 bg-slate-50 rounded-2xl dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <h4 className="font-bold mb-4">Manual Setup Guide:</h4>
                <ol className="text-sm space-y-4 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start space-x-3">
                    <span className="bg-primary-100 text-primary-600 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
                    <span>Open the <code className="bg-white px-1.5 py-0.5 rounded border dark:bg-slate-800">backend/.env</code> file in your project.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-primary-100 text-primary-600 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
                    <span>Add <code className="bg-white px-1.5 py-0.5 rounded border dark:bg-slate-800">EMAIL_USER=your-email@gmail.com</code></span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-primary-100 text-primary-600 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
                    <span>Add <code className="bg-white px-1.5 py-0.5 rounded border dark:bg-slate-800">EMAIL_PASS=your-app-password</code></span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-6">
              <div className="glass-card p-8">
                <div className="flex items-center space-x-3 text-primary-600 mb-6">
                  <Shield className="w-6 h-6" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security Settings</h3>
                </div>
                
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Change Password</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                        <input type="password" placeholder="••••••••" className="input-field w-full" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                          <input type="password" placeholder="••••••••" className="input-field w-full" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
                          <input type="password" placeholder="••••••••" className="input-field w-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" className="btn-primary py-2 px-8 font-bold">Update Password</button>
                  </div>
                </form>
              </div>

              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500">Protect your account with an additional security layer.</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Active Sessions</h4>
                  {[
                    { device: 'Chrome on Windows', location: 'New York, USA', status: 'Current Session', color: 'text-primary-600' },
                    { device: 'iPhone 13 App', location: 'London, UK', status: '2 days ago', color: 'text-slate-400' },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center space-x-4">
                        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl">
                          <Globe className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{session.device}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.location}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${session.color}`}>{session.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'AI Engine' && (
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 text-primary-600 mb-6">
                <Bot className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Engine & RAG Configuration</h3>
              </div>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Manage the data context available to your AI Assistant. Syncing CRM data will encode your latest Leads, Contacts, and Deals into the AI's memory.
              </p>
              
              <div className="p-6 bg-slate-50 rounded-2xl dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Sync CRM Data to Vector DB</h4>
                  <p className="text-sm text-slate-500">
                    This process might take a few minutes depending on the size of your database.
                  </p>
                </div>
                <button 
                  onClick={async () => {
                    const btn = document.getElementById('sync-btn');
                    btn.disabled = true;
                    btn.innerHTML = '<span class="flex items-center space-x-2"><svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>Syncing...</span></span>';
                    try {
                      const user = JSON.parse(localStorage.getItem('user'));
                      const response = await axios.post('/api/rag/sync', {}, {
                        headers: { Authorization: `Bearer ${user.token}` }
                      });
                      alert(response.data.message);
                    } catch (err) {
                      alert('Failed to sync CRM data: ' + (err.response?.data?.message || err.message));
                    } finally {
                      btn.disabled = false;
                      btn.innerHTML = 'Sync Now';
                    }
                  }}
                  id="sync-btn"
                  className="btn-primary py-3 px-6 whitespace-nowrap shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  Sync Now
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Automation' && (
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 text-primary-600 mb-6">
                <Clock className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart Auto Reminder Settings</h3>
              </div>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Configure the time delays (in days) before an automated reminder is sent to sales reps for stagnant leads.
              </p>
              
              {user?.role === 'CEO' || user?.role === 'Admin' ? (
                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Hot Leads</label>
                      <div className="flex items-center space-x-2">
                        <input type="number" min="1" max="30" value={sysSettings.reminderDaysHot || ''} onChange={e => setSysSettings({...sysSettings, reminderDaysHot: e.target.value})} className="input-field w-full text-lg font-bold" />
                        <span className="text-slate-500 font-medium">Days</span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Warm Leads</label>
                      <div className="flex items-center space-x-2">
                        <input type="number" min="1" max="30" value={sysSettings.reminderDaysWarm || ''} onChange={e => setSysSettings({...sysSettings, reminderDaysWarm: e.target.value})} className="input-field w-full text-lg font-bold" />
                        <span className="text-slate-500 font-medium">Days</span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Cold Leads</label>
                      <div className="flex items-center space-x-2">
                        <input type="number" min="1" max="30" value={sysSettings.reminderDaysCold || ''} onChange={e => setSysSettings({...sysSettings, reminderDaysCold: e.target.value})} className="input-field w-full text-lg font-bold" />
                        <span className="text-slate-500 font-medium">Days</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="btn-primary py-2 px-8">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Automation Rules'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                  Access Denied: Only Admin and CEO roles can configure global automation rules.
                </div>
              )}
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-slate-50 rounded-full dark:bg-slate-800">
                <Globe className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold">{activeTab} Settings</h3>
              <p className="text-slate-500 max-w-sm">This section is coming soon as part of the next CRM update.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

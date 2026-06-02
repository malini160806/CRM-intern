import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  User,
  Building2,
  Briefcase,
  Users,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../store/slices/uiSlice';
import AddContactModal from '../components/AddContactModal';
import CallModal from '../components/CallModal';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [callingContact, setCallingContact] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dispatch = useDispatch();
  const { modals } = useSelector((state) => state.ui);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchContacts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get('/api/contacts', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setContacts(response.data);
    } catch (err) {
      console.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleContactAdded = (newContact) => {
    setContacts([newContact, ...contacts]);
  };

  const handleContactUpdated = (updatedContact) => {
    setContacts(contacts.map(c => c._id === updatedContact._id ? updatedContact : c));
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setContacts(contacts.filter(c => c._id !== id));
    } catch (err) {
      console.error('Failed to delete contact');
      alert('Failed to delete contact.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Contacts Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Total {contacts.length} key decision makers found</p>
        </div>
        <button 
          onClick={() => { setContactToEdit(null); dispatch(openModal('contact')); }}
          className="btn-primary flex items-center space-x-2 w-fit px-6 py-3 shadow-lg shadow-primary-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold">New Contact</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name, email or title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
              <Filter className="w-4 h-4" />
              <span className="font-bold">Filters</span>
            </button>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-600 font-bold outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
              <option>View: All Contacts</option>
              <option>View: My Contacts</option>
              <option>View: Recent Added</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Contact Name</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Account</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Title</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {contacts.map((contact) => (
                <tr 
                  key={contact._id} 
                  className="hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-all group cursor-pointer"
                  onClick={() => alert(`Contact details for ${contact.name} coming soon!`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-black shadow-sm dark:bg-slate-800 dark:text-slate-400">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{contact.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{contact.department || 'General'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <Building2 className="w-3.5 h-3.5 mr-2 text-primary-500" />
                      {contact.account?.name || 'Individual'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <Briefcase className="w-3.5 h-3.5 mr-2 text-primary-500" />
                      {contact.title || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {contact.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {contact.phone || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${contact.email}`; }}
                        className="p-2 text-[#515154] hover:text-[#0071e3] bg-white rounded-lg border border-[#e5e5ea] hover:border-[#0071e3] transition-all shadow-sm"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if(contact.phone) {
                            const cleanPhone = contact.phone.replace(/[^\d+]/g, '');
                            window.location.href = `tel:${cleanPhone}`;
                          } else {
                            alert('No phone number provided for this contact.');
                          }
                        }}
                        className="p-2 text-[#515154] hover:text-[#0071e3] bg-white rounded-lg border border-[#e5e5ea] hover:border-[#0071e3] transition-all shadow-sm"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if(contact.phone) {
                            const cleanPhone = contact.phone.replace(/\D/g, '');
                            window.open(`https://wa.me/${cleanPhone}`, '_blank');
                          } else {
                            alert('No phone number provided for this contact.');
                          }
                        }}
                        className="p-2 text-[#515154] hover:text-[#25D366] hover:border-[#25D366] bg-white rounded-lg border border-[#e5e5ea] transition-all shadow-sm"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setOpenDropdownId(openDropdownId === contact._id ? null : contact._id); 
                          }}
                          className={`p-2 rounded-lg transition-all ${openDropdownId === contact._id ? 'bg-[#e5e5ea] text-[#1d1d1f]' : 'text-[#515154] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'}`}
                          title="More Options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        {openDropdownId === contact._id && (
                          <div 
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1c1c1e] border border-[#e5e5ea] dark:border-[#38383a] rounded-xl shadow-lg z-50 py-1 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => { setOpenDropdownId(null); alert(`Contact details for ${contact.name} coming soon!`); }}
                              className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => { 
                                setOpenDropdownId(null); 
                                setContactToEdit(contact); 
                                dispatch(openModal('contact')); 
                              }}
                              className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
                            >
                              Edit Contact
                            </button>
                            <div className="h-px bg-[#e5e5ea] dark:bg-[#38383a] my-1"></div>
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setOpenDropdownId(null); 
                                handleDeleteContact(contact._id); 
                              }}
                              className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-[#ff3b30] hover:bg-[#ffe6e6] dark:hover:bg-[#ff3b30]/20 transition-colors"
                            >
                              Delete Contact
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {contacts.length === 0 && !loading && (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-slate-800">
              <Users className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">No contacts yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">Start building your network by adding key decision makers from your lead accounts.</p>
            <button 
              onClick={() => { setContactToEdit(null); dispatch(openModal('contact')); }}
              className="mt-6 text-primary-600 font-black hover:underline"
            >
              + Create First Contact
            </button>
          </div>
        )}
      </div>

      <AddContactModal 
        isOpen={modals.contact} 
        onClose={() => { dispatch(closeModal('contact')); setContactToEdit(null); }} 
        onContactAdded={handleContactAdded} 
        onContactUpdated={handleContactUpdated}
        contactToEdit={contactToEdit}
      />

      <CallModal 
        isOpen={!!callingContact}
        onClose={() => setCallingContact(null)}
        contactInfo={callingContact}
      />
    </div>
  );
};

export default Contacts;

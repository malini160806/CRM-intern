import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../store/slices/uiSlice';
import AddLeadModal from './AddLeadModal';
import AddDealModal from './AddDealModal';
import AddContactModal from './AddContactModal';
import AddCaseModal from './AddCaseModal';
import AddMeetingModal from './AddMeetingModal';
import AddSolutionModal from './AddSolutionModal';
import IncomingCallWidget from './IncomingCallWidget';
import StickyNotesWidget from './StickyNotesWidget';

const MainLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const { modals } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  if (!user) {
    return <Navigate to="/welcome" />;
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex-1 flex flex-col overflow-hidden w-full min-w-0">
        <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-8 bg-transparent dark:bg-dark-bg scroll-smooth">
          <Outlet />
        </main>
      </div>

      <IncomingCallWidget />

      {/* Global Modals */}
      <AddLeadModal 
        isOpen={modals.lead} 
        onClose={() => dispatch(closeModal('lead'))} 
        onLeadAdded={() => {}} // Could refresh data here if needed
      />
      <AddDealModal 
        isOpen={modals.deal} 
        onClose={() => dispatch(closeModal('deal'))} 
      />
      <AddContactModal 
        isOpen={modals.contact} 
        onClose={() => dispatch(closeModal('contact'))} 
      />
      <AddCaseModal 
        isOpen={modals.case} 
        onClose={() => dispatch(closeModal('case'))} 
      />
      <AddMeetingModal 
        isOpen={modals.meeting} 
        onClose={() => dispatch(closeModal('meeting'))} 
      />
      <AddSolutionModal 
        isOpen={modals.solution} 
        onClose={() => dispatch(closeModal('solution'))} 
      />
      
      {/* Sticky Notes Widget */}
      <StickyNotesWidget />
    </div>
  );
};

export default MainLayout;

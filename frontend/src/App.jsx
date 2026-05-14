import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LeadsList from './pages/LeadsList';
import AIChatbot from './pages/AIChatbot';
import Meetings from './pages/Meetings';
import EmailAutomation from './pages/EmailAutomation';
import LeadDetails from './pages/LeadDetails';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import ForgotPassword from './pages/ForgotPassword';
import FollowUps from './pages/FollowUps';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<LeadsList />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="chatbot" element={<AIChatbot />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="email" element={<EmailAutomation />} />
          <Route path="follow-ups" element={<FollowUps />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          {/* Add more routes as we build pages */}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
};

export default App;

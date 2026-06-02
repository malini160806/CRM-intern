import React, { lazy, Suspense } from 'react';
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
import Deals from './pages/Deals';
import DealDetails from './pages/DealDetails';
import Contacts from './pages/Contacts';
import Accounts from './pages/Accounts';
import AccountDetails from './pages/AccountDetails';
import Products from './pages/Products';
import Invoices from './pages/Invoices';
import PlaceholderPage from './pages/PlaceholderPage';
import RoleDashboard from './pages/RoleDashboard';
import Forecasts from './pages/Forecasts';
import Calls from './pages/Calls';
import Quotes from './pages/Quotes';
import Cases from './pages/Cases';
import Solutions from './pages/Solutions';
import Reports from './pages/Reports';
import OpeningPage from './pages/OpeningPage';
import PublicPage from './pages/PublicPage';
import KPIDashboard from './pages/KPIDashboard';
import CallAnalytics from './pages/CallAnalytics';

const Automations = lazy(() => import('./pages/Automations'));
const CommandCenter = lazy(() => import('./pages/CommandCenter'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <Routes>
          {/* Opening Route */}
          <Route path="/welcome" element={<OpeningPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Public Marketing Pages */}
        <Route path="/integrations" element={<PublicPage title="Integrations" />} />
        <Route path="/changelog" element={<PublicPage title="Changelog" />} />
        <Route path="/about" element={<PublicPage title="About Us" />} />
        <Route path="/careers" element={<PublicPage title="Careers" />} />
        <Route path="/blog" element={<PublicPage title="Blog" />} />
        <Route path="/contact" element={<PublicPage title="Contact" />} />
        <Route path="/privacy" element={<PublicPage title="Privacy Policy" />} />
        <Route path="/terms" element={<PublicPage title="Terms of Service" />} />
        <Route path="/cookies" element={<PublicPage title="Cookie Policy" />} />

        {/* Protected Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/welcome" replace />} />
          <Route path="dashboard/ceo" element={<RoleDashboard role="CEO" />} />
          <Route path="dashboard/sales-lead" element={<RoleDashboard role="SalesLead" />} />
          <Route path="dashboard/sales-person" element={<RoleDashboard role="SalesPerson" />} />
          
          <Route path="leads" element={<LeadsList />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="ai-chatbot" element={<AIChatbot />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="email" element={<EmailAutomation />} />
          <Route path="follow-ups" element={<FollowUps />} />
          <Route path="deals" element={<Deals />} />
          <Route path="deals/:id" element={<DealDetails />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="kpi-dashboard" element={<KPIDashboard />} />
          <Route path="settings" element={<Settings />} />
          
          <Route path="reports" element={<Reports />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/:id" element={<AccountDetails />} />
          <Route path="forecasts" element={<Forecasts />} />
          <Route path="calls" element={<Calls />} />
          <Route path="call-analytics" element={<CallAnalytics />} />
          <Route path="products" element={<Products />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="cases" element={<Cases />} />
          <Route path="solutions" element={<Solutions />} />
          <Route path="automations" element={<Automations />} />
          <Route path="command-center" element={<CommandCenter />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/welcome" />} />
      </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

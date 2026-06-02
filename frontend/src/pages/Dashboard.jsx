import React from 'react';
import { useSelector } from 'react-redux';
import RoleDashboard from './RoleDashboard';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role) {
    return <RoleDashboard role={user.role} />;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-slate-500 font-medium">Loading your workspace...</p>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlaceholderPage = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center dark:bg-slate-800">
        <Construction className="w-12 h-12 text-primary-600" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{title} Module</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          We're currently building the {title} module to Nexus enterprise standards. 
          Check back soon for advanced CRM features!
        </p>
      </div>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-primary-600 font-bold hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Go Back</span>
      </button>
    </div>
  );
};

export default PlaceholderPage;

import React, { useState } from 'react';
import { X, UploadCloud, Loader2, FileText } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const UploadLeadsModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccessMsg(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('Authentication expired. Please login again.');
      }

      const response = await axios.post('/api/leads/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      });

      const { inserted, duplicatesSkipped, errors, totalRows } = response.data;
      setSuccessMsg(`Successfully imported ${inserted} leads. Skipped ${duplicatesSkipped} duplicates. Found ${errors} errors out of ${totalRows} rows.`);
      setFile(null);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Close modal after 3 seconds on success
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 3000);

    } catch (err) {
      console.error('Lead Upload Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload leads';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Bulk Upload Leads
            </h3>
            <p className="text-sm text-slate-500 font-medium">Import multiple leads via CSV</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm font-bold border border-green-100">
              {successMsg}
            </div>
          )}

          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50">
            {file ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Upload a CSV file</p>
                <p className="text-xs text-slate-500 mb-4">Required columns: name, email</p>
                
                <input
                  type="file"
                  accept=".csv, text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Browse Files
                </label>
              </>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading || !file}
              className="flex-[2] btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Upload Leads</span>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadLeadsModal;

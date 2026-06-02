import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, StickyNote, Save } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../store/slices/uiSlice';

const StickyNotesWidget = () => {
  const isOpen = useSelector((state) => state.ui.modals.stickyNotes);
  const dispatch = useDispatch();
  const [noteContent, setNoteContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const savedNote = localStorage.getItem('sticky_notes_data');
    if (savedNote) {
      setNoteContent(savedNote);
    }
  }, []);

  // Save to local storage whenever content changes, with a small debounce/status indicator
  useEffect(() => {
    if (noteContent !== localStorage.getItem('sticky_notes_data')) {
      setIsSaved(false);
      const timer = setTimeout(() => {
        localStorage.setItem('sticky_notes_data', noteContent);
        setIsSaved(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [noteContent]);

  const handleClose = () => {
    dispatch(closeModal('stickyNotes'));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          drag
          dragMomentum={false}
          className="fixed bottom-24 right-8 w-80 bg-yellow-200 dark:bg-yellow-800 rounded-lg shadow-2xl z-[100] border border-yellow-300 dark:border-yellow-700 overflow-hidden flex flex-col"
          style={{ height: '320px' }}
        >
          {/* Header */}
          <div className="bg-yellow-300 dark:bg-yellow-900 px-3 py-2 flex items-center justify-between cursor-move border-b border-yellow-400 dark:border-yellow-700/50">
            <div className="flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-yellow-800 dark:text-yellow-200" />
              <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Sticky Notes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                {isSaved ? <span className="italic">Saved</span> : <span className="italic">Saving...</span>}
              </span>
              <button 
                onClick={handleClose}
                className="p-1 hover:bg-yellow-400 dark:hover:bg-yellow-800 rounded-md transition-colors text-yellow-900 dark:text-yellow-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-0">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Jot down something to remember..."
              className="w-full h-full p-4 bg-transparent resize-none outline-none text-yellow-900 dark:text-yellow-100 placeholder-yellow-700/50 dark:placeholder-yellow-400/50 font-medium"
              spellCheck="false"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyNotesWidget;

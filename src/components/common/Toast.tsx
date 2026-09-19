import React from 'react';
import { useStore } from '../../store/useStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Toast: React.FC = () => {
  const { toastMessage, hideToast } = useStore();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-[9999] flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-xl shadow-2xl bg-ink text-white border border-gold-light/40 sm:max-w-md"
        >
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-gold-light" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {toastMessage.type === 'info' && <Info className="w-5 h-5 text-amber-300" />}

          <span
            className={`text-sm font-medium tracking-wide flex-1 ${
              toastMessage.type === 'error' ? 'text-rose-400' : 'text-gold-light'
            }`}
          >
            {toastMessage.text}
          </span>

          <button
            onClick={hideToast}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

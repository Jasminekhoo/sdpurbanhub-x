import React from 'react';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isUrgent = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full flex-shrink-0 ${
            isUrgent ? 'bg-rose-100 text-rose-600' :
            isDestructive ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-livin-navy'
          }`}>
            {isUrgent ? <AlertCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${
              isUrgent
                ? 'bg-rose-600 hover:bg-rose-700'
                : isDestructive
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-livin-navy hover:bg-livin-navy-dark'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

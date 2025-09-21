import React, { useEffect } from 'react';
import Icon from './Icon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4 transform transition-all duration-300 scale-100 animate-scale-up">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Icon name="alert-triangle" className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-500 mt-2">{message}</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-2xl grid grid-cols-2 gap-4">
          <button 
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
             onClick={onConfirm}
             className="bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
             Confirm
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out both;
        }
        @keyframes scale-up {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
            animation: scale-up 0.2s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
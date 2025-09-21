import React, { useEffect } from 'react';
import Icon from './Icon';

interface CategoryJumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onCategorySelect: (category: string) => void;
  language: 'en' | 'id';
}

const CategoryJumpModal: React.FC<CategoryJumpModalProps> = ({ isOpen, onClose, categories, onCategorySelect, language }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex flex-col z-50 animate-fade-in-sm" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-2xl mt-auto w-full max-h-[80vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900">
            {language === 'id' ? 'Pilih Kategori' : 'Select Category'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className="p-4 bg-gray-100 rounded-lg text-gray-800 font-semibold text-center hover:bg-orange-100 hover:text-orange-600 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
       <style>{`
        @keyframes slide-up {
            0% { transform: translateY(100%); }
            100% { transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slide-up 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default CategoryJumpModal;

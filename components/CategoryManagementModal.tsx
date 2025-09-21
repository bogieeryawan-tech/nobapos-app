import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface CategoryManagementModalProps {
  category: string | null;
  onClose: () => void;
  onSave: (oldName: string | null, newName: string) => void;
  existingCategories: string[];
}

const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({ category, onClose, onSave, existingCategories }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Category name cannot be empty.');
      return;
    }
    // Check for duplicates, ignoring the current category name if editing
    if (existingCategories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase() && cat.toLowerCase() !== category?.toLowerCase())) {
        setError('This category name already exists.');
        return;
    }

    onSave(category, trimmedName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {category ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Category Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                value={name} 
                onChange={(e) => { setName(e.target.value); setError(''); }}
                required 
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="p-6 bg-gray-50 rounded-b-2xl text-right">
            <button type="button" onClick={onClose} className="text-gray-700 font-semibold py-2 px-6 rounded-lg mr-2 hover:bg-gray-200">Cancel</button>
            <button type="submit" className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg transition-all hover:bg-orange-400">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryManagementModal;
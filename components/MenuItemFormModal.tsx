import React, { useState, useEffect } from 'react';
import type { MenuItem } from '../types';
import Icon from './Icon';

interface MenuItemFormModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  existingCategories: string[];
}

const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({ item, onClose, onSave, existingCategories }) => {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    prices: {
        dine_in: 0,
        gofood: 0,
        grabfood: 0,
        shopeefood: 0,
    },
    cost: 0,
    category: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      // Ensure all price channels exist, falling back to dine_in price if not present
      const prices = {
          dine_in: item.prices.dine_in || 0,
          gofood: item.prices.gofood || item.prices.dine_in || 0,
          grabfood: item.prices.grabfood || item.prices.dine_in || 0,
          shopeefood: item.prices.shopeefood || item.prices.dine_in || 0,
      };
      setFormData({...item, prices});
      if (item.imageUrl) {
        setImagePreview(item.imageUrl);
      }
    } else {
      setFormData({
        name: '',
        prices: { dine_in: 0, gofood: 0, grabfood: 0, shopeefood: 0 },
        cost: 0,
        category: '',
        imageUrl: '',
      });
      setImagePreview(null);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('price_')) {
        const channel = name.split('_')[1];
        setFormData(prev => ({
            ...prev,
            prices: {
                ...prev.prices,
                [channel]: parseFloat(value) || 0
            }
        }));
    } else {
        setFormData(prev => ({ 
          ...prev, 
          [name]: name === 'cost' ? parseFloat(value) || 0 : value 
        }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.prices.dine_in > 0 && formData.category) {
        const itemToSave = { ...formData, id: (item?.id) || Date.now() };
        onSave(itemToSave);
    } else {
        alert('Please fill in all required fields: Name, at least a Dine-In Price, and Category.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl m-4 transform transition-all duration-300 scale-100">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Item Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"/>
            </div>
            
             <div className="grid grid-cols-2 gap-6">
                <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-600 mb-1">HPP (Cost)</label>
                    <input type="number" name="cost" id="cost" value={formData.cost} onChange={handleChange} required min="0" step="1" placeholder='e.g. 15000' className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"/>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                    <input 
                        type="text" 
                        name="category" 
                        id="category" 
                        list="category-list"
                        value={formData.category} 
                        onChange={handleChange} 
                        required 
                        placeholder="e.g. Main Courses"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <datalist id="category-list">
                        {existingCategories.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
                 <h4 className="text-lg font-semibold text-gray-800 mb-4">Channel Pricing</h4>
                 <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label htmlFor="price_dine_in" className="block text-sm font-medium text-gray-600 mb-1">Price (Dine-In)</label>
                        <input type="number" name="price_dine_in" id="price_dine_in" value={formData.prices.dine_in} onChange={handleChange} required min="0" step="1" placeholder='e.g. 35000' className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"/>
                    </div>
                     <div>
                        <label htmlFor="price_gofood" className="block text-sm font-medium text-gray-600 mb-1">Price (GoFood)</label>
                        <input type="number" name="price_gofood" id="price_gofood" value={formData.prices.gofood} onChange={handleChange} min="0" step="1" placeholder='e.g. 42000' className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"/>
                    </div>
                     <div>
                        <label htmlFor="price_grabfood" className="block text-sm font-medium text-gray-600 mb-1">Price (GrabFood)</label>
                        <input type="number" name="price_grabfood" id="price_grabfood" value={formData.prices.grabfood} onChange={handleChange} min="0" step="1" placeholder='e.g. 42000' className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"/>
                    </div>
                     <div>
                        <label htmlFor="price_shopeefood" className="block text-sm font-medium text-gray-600 mb-1">Price (ShopeeFood)</label>
                        <input type="number" name="price_shopeefood" id="price_shopeefood" value={formData.prices.shopeefood} onChange={handleChange} min="0" step="1" placeholder='e.g. 42000' className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"/>
                    </div>
                 </div>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Item Image</label>
                <div className="mt-1 flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Icon name="image" className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    <span>Change Image</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                  </label>
                </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-b-2xl text-right">
            <button type="button" onClick={onClose} className="text-gray-700 font-semibold py-2 px-6 rounded-lg mr-2 hover:bg-gray-200">Cancel</button>
            <button type="submit" className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg transition-all hover:bg-orange-400">Save Item</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemFormModal;

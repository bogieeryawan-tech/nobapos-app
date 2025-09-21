import React, { useState, useMemo } from 'react';
import type { MenuItem } from '../types';
import MenuItemFormModal from './MenuItemFormModal';
import CategoryManagementModal from './CategoryManagementModal';
import Icon from './Icon';
import { formatRupiah } from '../utils';

interface MenuManagementProps {
  menuItems: MenuItem[];
  onUpdateMenu: (newMenuItems: MenuItem[]) => void;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ menuItems, onUpdateMenu }) => {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const categories = useMemo(() => [...new Set(menuItems.map(item => item.category))].sort(), [menuItems]);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onUpdateMenu(menuItems.filter(item => item.id !== itemId));
    }
  };

  const handleSaveItem = (itemToSave: MenuItem) => {
    const index = menuItems.findIndex(item => item.id === itemToSave.id);
    if (index > -1) {
      // Update existing item
      const updatedItems = [...menuItems];
      updatedItems[index] = itemToSave;
      onUpdateMenu(updatedItems);
    } else {
      // Add new item
      onUpdateMenu([...menuItems, itemToSave]);
    }
    setIsItemModalOpen(false);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (oldName: string | null, newName: string) => {
    if (oldName) {
        // This would be for renaming a category, which is more complex as it involves updating all items in that category.
        // For simplicity, let's assume this modal is only for adding new categories for now, but the logic should handle rename.
        const updatedItems = menuItems.map(item => 
            item.category === oldName ? { ...item, category: newName } : item
        );
        onUpdateMenu(updatedItems);
    } 
    // The modal itself prevents duplicates and empty names, so we don't need to re-validate here.
    // An add operation doesn't change items, just makes the category available for new items.
    setIsCategoryModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <div className="flex gap-4">
          <button onClick={handleAddCategory} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 whitespace-nowrap">Manage Categories</button>
          <button onClick={handleAddItem} className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-400 whitespace-nowrap">Add New Item</button>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">{category}</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">Name</th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">Dine-In Price</th>
                    <th scope="col" className="px-6 py-3 whitespace-nowrap">Cost</th>
                    <th scope="col" className="px-6 py-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.filter(item => item.category === category).map(item => (
                    <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatRupiah(item.prices.dine_in)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatRupiah(item.cost)}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button onClick={() => handleEditItem(item)} className="font-medium text-orange-600 hover:underline mr-4">Edit</button>
                        <button onClick={() => handleDeleteItem(item.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
            </div>
          </div>
        ))}
      </div>

      {isItemModalOpen && (
        <MenuItemFormModal 
          item={editingItem}
          onClose={() => setIsItemModalOpen(false)}
          onSave={handleSaveItem}
          existingCategories={categories}
        />
      )}
      {isCategoryModalOpen && (
          <CategoryManagementModal 
            category={editingCategory}
            onClose={() => setIsCategoryModalOpen(false)}
            onSave={handleSaveCategory}
            existingCategories={categories}
          />
      )}
    </div>
  );
};

export default MenuManagement;
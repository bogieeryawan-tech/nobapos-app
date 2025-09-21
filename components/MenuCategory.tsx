import React from 'react';
import type { MenuItem } from '../types';
import MenuItemCard from './MenuItemCard';

interface MenuCategoryProps {
  categoryName: string;
  items: MenuItem[];
  onAddToOrder: (item: MenuItem) => void;
  id: string;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ categoryName, items, onAddToOrder, id }) => {
  return (
    <div id={id} data-category-name={categoryName} className="pt-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize">{categoryName}</h2>
      {/* Use a fully responsive grid that adapts from mobile to ultrawide screens */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {items.map(item => (
          <MenuItemCard key={item.id} item={item} onAddToOrder={onAddToOrder} />
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;
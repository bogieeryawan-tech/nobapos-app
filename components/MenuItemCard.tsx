import React, { useState, useEffect } from 'react';
import type { MenuItem } from '../types';
import { formatRupiah } from '../utils';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToOrder: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToOrder }) => {
  const [imageError, setImageError] = useState(false);

  // Reset error state if the image URL changes, allowing a new image to be loaded.
  useEffect(() => {
    setImageError(false);
  }, [item.imageUrl]);

  return (
    <button
      onClick={() => onAddToOrder(item)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden text-left flex flex-col group"
    >
      {/* Image container: hidden on mobile (xs), visible from sm upwards */}
      <div className="relative aspect-video hidden sm:block bg-gray-200">
        {item.imageUrl && !imageError ? (
          <>
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover" 
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all"></div>
          </>
        ) : null}
      </div>
      
      {/* Info container: is a row on mobile, becomes a column on sm+ when image appears */}
      <div className="p-3 flex-grow flex sm:flex-col justify-between items-center sm:items-start">
        <p className="font-semibold text-gray-800 text-sm leading-tight flex-grow pr-2 sm:pr-0">{item.name}</p>
        <p className="text-orange-500 font-bold mt-0 sm:mt-1 text-sm flex-shrink-0">{formatRupiah(item.prices.dine_in)}</p>
      </div>
    </button>
  );
};

export default MenuItemCard;

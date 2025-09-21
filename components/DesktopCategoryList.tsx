import React from 'react';

interface DesktopCategoryListProps {
  categories: string[];
  activeCategory: string;
  onCategoryClick: (category: string) => void;
}

const DesktopCategoryList: React.FC<DesktopCategoryListProps> = ({ categories, activeCategory, onCategoryClick }) => {
  return (
    <nav className="hidden md:block w-48 bg-white border-r border-gray-200 p-4 overflow-y-auto hide-scrollbar flex-shrink-0">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Categories</h3>
      <ul className="space-y-1">
        {categories.map(category => (
          <li key={category}>
            <button
              onClick={() => onCategoryClick(category)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DesktopCategoryList;
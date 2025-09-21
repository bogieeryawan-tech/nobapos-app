import React, { useRef, useEffect } from 'react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryClick: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, onCategoryClick }) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // This effect automatically scrolls the active tab into the center of the view.
  useEffect(() => {
    const activeTab = tabRefs.current[activeCategory];
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        inline: 'center', // Horizontally center the tab
        block: 'nearest',  // Keep vertical position
      });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200 md:hidden">
      <div className="relative"> {/* Parent for gradient overlay */}
        {/* Scrollable container for tabs */}
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto whitespace-nowrap hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              // FIX: The ref callback function should not return a value. Changed from an implicit return `(el => ...)` to a block `(el => { ... })`.
              ref={el => { tabRefs.current[cat] = el; }} // Assign ref for each tab
              onClick={() => onCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-colors flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Fade-out effect on the right side to indicate scrollability */}
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default CategoryTabs;

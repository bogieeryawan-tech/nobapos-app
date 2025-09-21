import React, { useMemo, useState, useEffect, useRef } from 'react';
import type { MenuItem, OrderItem, OrderChannel } from '../types';
import OrderSummary from './OrderSummary';
import MenuCategory from './MenuCategory';
import Icon from './Icon';
import DesktopCategoryList from './DesktopCategoryList';
import CategoryJumpModal from './CategoryJumpModal';

interface StaffDashboardProps {
  menuItems: MenuItem[];
  orderItems: OrderItem[];
  onAddToOrder: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onClearOrder: () => void;
  onProcessPayment: () => void;
  language: 'en' | 'id';
  orderChannel: OrderChannel;
  onOrderChannelChange: (channel: OrderChannel) => void;
  discount: { type: 'percentage' | 'fixed'; value: number } | null;
  applyDiscount: (type: 'percentage' | 'fixed', value: number) => void;
  removeDiscount: () => void;
  discountAmount: number;
  subtotal: number;
  tax: number;
  total: number;
  onOpenExpenseModal: () => void;
  onOpenClosingModal: () => void;
  currentBranchName: string;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({
  menuItems,
  orderItems,
  onAddToOrder,
  onUpdateQuantity,
  onClearOrder,
  onProcessPayment,
  language,
  orderChannel,
  onOrderChannelChange,
  discount,
  applyDiscount,
  removeDiscount,
  discountAmount,
  subtotal,
  tax,
  total,
  onOpenExpenseModal,
  onOpenClosingModal,
  currentBranchName
}) => {
  const categories = useMemo(() => [...new Set(menuItems.map(item => item.category))], [menuItems]);
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeTab, setActiveTab] = useState<'menu' | 'order'>('menu');
  const totalOrderItems = useMemo(() => orderItems.reduce((sum, item) => sum + item.quantity, 0), [orderItems]);
  const menuScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);


  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
        setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight / 2) {
                const categoryName = entry.target.getAttribute('data-category-name');
                if (categoryName) {
                    setActiveCategory(categoryName);
                }
            }
        }
      },
      {
        root: menuScrollContainerRef.current, // Observe within the scrollable container
        rootMargin: '0px 0px -50% 0px',
        threshold: 0,
      }
    );

    const currentRefs = categoryRefs.current;
    Object.values(currentRefs).forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
        Object.values(currentRefs).forEach(el => {
            if (el) observer.unobserve(el);
        });
    };
  }, [menuItems]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategoryJump = (category: string) => {
    handleCategoryClick(category);
    setIsCategoryModalOpen(false); // Close modal after selection
  };

  return (
    <div className="h-[calc(100vh-68px)] flex flex-col md:flex-row">
      {/* Main Content (Menu) */}
      <main className={`flex-grow bg-gray-50 ${activeTab !== 'menu' ? 'hidden' : 'flex'} md:flex overflow-hidden`}>
        <DesktopCategoryList 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
        />
        <div ref={menuScrollContainerRef} className="flex-1 flex flex-col overflow-y-auto hide-scrollbar">
            <div className="p-4 md:p-6 space-y-8 pb-20 md:pb-6">
              <div className="text-center md:text-left">
                  <p className="text-sm text-gray-500">Operating at</p>
                  <h1 className="text-2xl font-bold text-gray-800 -mt-1">{currentBranchName}</h1>
              </div>
              {categories.map(category => {
                const items = menuItems.filter(item => item.category === category);
                return (
                    <div key={category} ref={el => { categoryRefs.current[category] = el; }} data-category-name={category}>
                        <MenuCategory
                            id={`category-section-${category.replace(/\s+/g, '-')}`}
                            categoryName={category}
                            items={items}
                            onAddToOrder={onAddToOrder}
                        />
                    </div>
                );
              })}
            </div>
        </div>
      </main>

      {/* Aside (Order Summary) */}
      <aside className={`w-full h-full ${activeTab !== 'order' ? 'hidden' : 'block'} md:block md:w-[280px] lg:w-[360px] flex-shrink-0 shadow-2xl z-10 border-l border-gray-200 bg-white`}>
        <OrderSummary
          orderItems={orderItems}
          onUpdateQuantity={onUpdateQuantity}
          onClearOrder={onClearOrder}
          onProcessPayment={onProcessPayment}
          language={language}
          orderChannel={orderChannel}
          onOrderChannelChange={onOrderChannelChange}
          discount={discount}
          applyDiscount={applyDiscount}
          removeDiscount={removeDiscount}
          discountAmount={discountAmount}
          subtotal={subtotal}
          tax={tax}
          total={total}
          onOpenExpenseModal={onOpenExpenseModal}
          onOpenClosingModal={onOpenClosingModal}
        />
      </aside>
      
      {/* Category Jump Modal */}
       <CategoryJumpModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onCategorySelect={handleCategoryJump}
        language={language}
      />


      {/* Mobile-Only Floating Action Button for Category Jump */}
      <div className={`fixed bottom-20 right-4 z-30 md:hidden transition-transform duration-300 ${activeTab === 'menu' ? 'scale-100' : 'scale-0'}`}>
         <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-orange-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            aria-label="Jump to category"
          >
            <Icon name="menu" className="w-6 h-6" />
          </button>
      </div>

      {/* Mobile Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-40">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors ${activeTab === 'menu' ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'}`}
        >
          <Icon name="menu" className="w-6 h-6 mb-0.5" />
          <span className="text-xs font-semibold">Menu</span>
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors relative ${activeTab === 'order' ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'}`}
        >
          <Icon name="shopping-cart" className="w-6 h-6 mb-0.5" />
          <span className="text-xs font-semibold">Current Order</span>
           {totalOrderItems > 0 && (
            <span className="absolute top-1 right-[20%] lg:right-[30%] bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalOrderItems}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default StaffDashboard;
import React, { useState } from 'react';
import type { OrderItem, OrderChannel } from '../types';
import Icon from './Icon';
import { formatRupiah } from '../utils';
import { TAX_RATE } from '../constants';


const ORDER_CHANNELS: { id: OrderChannel; name: string }[] = [
    { id: 'dine_in', name: 'Dine-In' },
    { id: 'gofood', name: 'GoFood' },
    { id: 'grabfood', name: 'GrabFood' },
    { id: 'shopeefood', name: 'ShopeeFood' },
];

interface OrderSummaryProps {
  orderItems: OrderItem[];
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
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
    orderItems, onUpdateQuantity, onClearOrder, onProcessPayment, language, orderChannel, onOrderChannelChange,
    discount, applyDiscount, removeDiscount, discountAmount, subtotal, tax, total,
    onOpenExpenseModal, onOpenClosingModal
}) => {
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');
  
  const handlePayment = () => {
    if (orderItems.length > 0) {
      onProcessPayment();
    }
  };

  const handleApplyDiscount = () => {
    const value = parseFloat(discountValue);
    if (!isNaN(value) && value >= 0) {
      applyDiscount(discountType, value);
      setIsDiscountVisible(false);
    }
  };

  const handleToggleDiscountForm = () => {
    const isOpening = !isDiscountVisible;
    if (isOpening) {
      // If we are opening the form, pre-fill it with existing discount data or reset it
      if (discount) {
        setDiscountType(discount.type);
        setDiscountValue(String(discount.value));
      } else {
        setDiscountType('percentage');
        setDiscountValue('');
      }
    }
    setIsDiscountVisible(isOpening);
  };


  return (
    <div className="bg-white h-full flex flex-col p-6 pb-20 md:p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-900">Current Order</h2>
        <button
          onClick={onClearOrder}
          disabled={orderItems.length === 0}
          className="text-gray-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Clear Order"
        >
          <Icon name="trash" className="w-5 h-5" />
        </button>
      </div>
      
      {/* Order Channel Selector */}
      <div className="pb-4 mb-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Order Channel</h3>
        <div className="flex items-center gap-2 flex-wrap">
            {ORDER_CHANNELS.map(channel => (
                 <button
                    key={channel.id}
                    onClick={() => onOrderChannelChange(channel.id)}
                    className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors ${
                        orderChannel === channel.id
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                    >
                    {channel.name}
                </button>
            ))}
        </div>
      </div>

      {/* SCROLLABLE ITEM LIST */}
      <div className="flex-grow overflow-y-auto -mr-3 pr-3 space-y-2">
        {orderItems.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p>Your order is empty.</p>
            <p className="text-sm">Click on a menu item to add it.</p>
          </div>
        ) : (
          orderItems.map(item => (
            <div key={item.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <div className="flex-grow">
                <p className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</p>
                <p className="text-gray-500 text-xs">{formatRupiah(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="bg-gray-200 p-1 rounded-full text-gray-700 hover:bg-gray-300">
                  <Icon name="minus" className="w-4 h-4" />
                </button>
                <span className="font-bold text-gray-900 w-5 text-center text-sm">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="bg-gray-200 p-1 rounded-full text-gray-700 hover:bg-gray-300">
                  <Icon name="plus" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FIXED FOOTER SECTION */}
      <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
        {/* Totals */}
        <div className="flex items-end justify-between gap-4">
          {/* Left side: Sub-details */}
          <div className="space-y-1 flex-grow">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatRupiah(subtotal)}</span>
            </div>
            {discountAmount > 0 && discount && (
              <div className="flex justify-between text-green-600 text-sm">
                <div className="flex items-center gap-2">
                    <span>Discount ({discount.type === 'percentage' ? `${discount.value}%` : 'Fixed'})</span>
                    <button onClick={removeDiscount} className="text-red-500 hover:text-red-700" title="Remove discount">
                        <Icon name="close" className="w-3.5 h-3.5" />
                    </button>
                </div>
                <span className="font-medium">-{formatRupiah(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Tax ({TAX_RATE * 100}%)</span>
              <span className="font-medium">{formatRupiah(tax)}</span>
            </div>
          </div>
          
          {/* Right side: Grand Total */}
          <div className="text-right flex-shrink-0 border-l border-gray-200 pl-4 ml-4">
            <span className="block text-sm font-medium text-gray-600">Total</span>
            <span className="block text-2xl font-bold text-gray-900 -mt-1">{formatRupiah(total)}</span>
          </div>
        </div>
        
        {/* Discount Section */}
        <div className="mt-4">
          {orderItems.length > 0 && !isDiscountVisible && (
            <button onClick={handleToggleDiscountForm} className="w-full flex items-center justify-center gap-1.5 text-sm text-orange-600 font-semibold hover:underline">
              <Icon name={discount ? 'edit' : 'plus'} className="w-4 h-4" />
              <span>{discount ? 'Edit Discount' : 'Add Discount'}</span>
            </button>
          )}
          
          {isDiscountVisible && (
            <div className="p-3 mt-2 bg-gray-100 rounded-lg space-y-2 border border-gray-200 animate-fade-in-sm">
              <div className="flex gap-2">
                <button onClick={() => setDiscountType('percentage')} className={`flex-1 text-xs font-semibold py-1 rounded transition-colors ${discountType === 'percentage' ? 'bg-orange-500 text-white' : 'bg-white hover:bg-gray-200 border border-gray-300'}`}>Percentage (%)</button>
                <button onClick={() => setDiscountType('fixed')} className={`flex-1 text-xs font-semibold py-1 rounded transition-colors ${discountType === 'fixed' ? 'bg-orange-500 text-white' : 'bg-white hover:bg-gray-200 border border-gray-300'}`}>Fixed (Rp)</button>
              </div>
              <div className="flex gap-2">
                <input 
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'percentage' ? 'e.g. 10' : 'e.g. 5000'}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-orange-500 focus:border-orange-500"
                  autoFocus
                />
                <button onClick={handleApplyDiscount} className="bg-orange-500 text-white font-bold px-4 rounded-md text-sm hover:bg-orange-400">Apply</button>
                <button type="button" onClick={handleToggleDiscountForm} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold p-2 rounded-md text-sm">
                  <Icon name="close" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Spacer to keep layout consistent */}
        <div className="mt-4 min-h-[4.5rem]"></div>
          
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {orderItems.length > 0 ? (
            <button
              onClick={handlePayment}
              className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg text-base hover:bg-orange-400 transition-colors"
            >
              Process Payment
            </button>
          ) : (
            <>
              <button
                onClick={onOpenExpenseModal}
                className="flex flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg text-base items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <Icon name="file-minus" className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
              <button
                onClick={onOpenClosingModal}
                className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg text-base hover:bg-orange-400 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="clipboard-check" className="w-5 h-5" />
                <span>Close Shift</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

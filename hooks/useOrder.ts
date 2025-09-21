import { useState, useMemo } from 'react';
import type { OrderItem, MenuItem, OrderChannel } from '../types';
import { TAX_RATE } from '../constants';

export const useOrder = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [discount, setDiscount] = useState<{ type: 'percentage' | 'fixed'; value: number } | null>(null);

  const addToOrder = (item: MenuItem, channel: OrderChannel) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(orderItem => orderItem.id === item.id);
      
      // Get the correct price for the current channel
      const price = item.prices[channel] || item.prices.dine_in;

      if (existingItem) {
        return prevItems.map(orderItem =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      }
      
      // Create a new OrderItem with the correct price and channel
      const { prices, ...itemWithoutPrices } = item;
      const newOrderItem: OrderItem = {
          ...itemWithoutPrices,
          price,
          orderChannel: channel,
          quantity: 1,
      };

      return [...prevItems, newOrderItem];
    });
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromOrder(itemId);
    } else {
      setOrderItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  
  const updatePricesForChannel = (newChannel: OrderChannel, allMenuItems: MenuItem[]) => {
      setOrderItems(currentItems => 
        currentItems.map(orderItem => {
            const originalMenuItem = allMenuItems.find(menuItem => menuItem.id === orderItem.id);
            if (!originalMenuItem) return orderItem; // Fallback, should not happen

            const newPrice = originalMenuItem.prices[newChannel] || originalMenuItem.prices.dine_in;
            return {
                ...orderItem,
                price: newPrice,
                orderChannel: newChannel,
            };
        })
      );
  };

  const removeFromOrder = (itemId: number) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  const applyDiscount = (type: 'percentage' | 'fixed', value: number) => {
    if (value >= 0) {
      setDiscount({ type, value });
    }
  };

  const removeDiscount = () => {
    setDiscount(null);
  };

  const clearOrder = () => {
    setOrderItems([]);
    setDiscount(null);
  };

  const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [orderItems]);

  const discountAmount = useMemo(() => {
    if (!discount || subtotal === 0) return 0;
    if (discount.type === 'percentage') {
      return subtotal * (discount.value / 100);
    }
    return Math.min(discount.value, subtotal);
  }, [subtotal, discount]);

  const subtotalAfterDiscount = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);
  const tax = useMemo(() => subtotalAfterDiscount * TAX_RATE, [subtotalAfterDiscount]);
  const total = useMemo(() => subtotalAfterDiscount + tax, [subtotalAfterDiscount, tax]);

  return {
    orderItems,
    addToOrder,
    updateQuantity,
    removeFromOrder,
    clearOrder,
    subtotal,
    updatePricesForChannel,
    discount,
    applyDiscount,
    removeDiscount,
    discountAmount,
    tax,
    total,
  };
};
import React from 'react';
import type { CompletedOrder } from '../types';
import { formatRupiah } from '../utils';

interface OrderListProps {
  orders: CompletedOrder[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-3">Time</th>
              <th scope="col" className="px-4 py-3">Items</th>
              <th scope="col" className="px-4 py-3">Cashier</th>
              <th scope="col" className="px-4 py-3">Channel</th>
              <th scope="col" className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">No completed orders yet.</td>
                </tr>
            )}
            {orders.slice().reverse().map(order => ( // Show newest first
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">{new Date(order.timestamp).toLocaleTimeString()}</td>
                <td className="px-4 py-3">
                    {order.items.map(i => i.name).join(', ')}
                </td>
                <td className="px-4 py-3">{order.cashier}</td>
                <td className="px-4 py-3 capitalize">{order.orderChannel.replace('_', '-')}</td>
                <td className="px-4 py-3 font-semibold text-gray-900 text-right">{formatRupiah(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;

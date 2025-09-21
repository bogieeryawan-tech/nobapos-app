import React, { useState, useMemo } from 'react';
import type { User, CompletedOrder, Expense, OrderChannel, Branch } from '../types';
import Icon from './Icon';
import { formatRupiah } from '../utils';
import ClosingReportPreview from './ClosingReportPreview';

interface CashierClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  orders: CompletedOrder[];
  shiftStartTime: string;
  initialCash: number;
  expenses: Expense[];
  onConfirmAndClose: () => void;
}

// These are now only used for mapping sales sources, which is stable.
const SALES_SOURCES: OrderChannel[] = ["dine_in", "gofood", "grabfood", "shopeefood"]; 
const DISCOUNT_CATEGORIES = ["GrabFood", "GoFood", "Management", "Karyawan", "Marketing"];

export interface ReportDataRow {
    label: string;
    todayCount?: number;
    todayAmount: number;
    allTimeCount?: number;
    allTimeAmount: number;
}

export interface ReportData {
  salesReport: ReportDataRow[];
  paymentReport: ReportDataRow[];
  salesSourceReport: ReportDataRow[];
  totalOrdersToday: number;
  totalRevenueToday: number;
  paymentMethodsToday: { method: string; amount: number }[];
  initialCash: number;
  totalCashSales: number;
  expenses: Expense[];
  totalExpenses: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
}

const CashierClosingModal: React.FC<CashierClosingModalProps> = ({
  isOpen,
  onClose,
  user,
  orders, // Note: these are pre-filtered by branchId from App.tsx
  shiftStartTime,
  initialCash,
  expenses,
  onConfirmAndClose,
}) => {
  const [view, setView] = useState<'form' | 'preview'>('form');
  const [actualCash, setActualCash] = useState('');
  const [weather, setWeather] = useState('');
  const [unpaidTransactions, setUnpaidTransactions] = useState([{ name: '', amount: '', note: '' }]);
  const [manualDiscounts, setManualDiscounts] = useState<Record<string, string>>(
    DISCOUNT_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: '' }), {})
  );

  const reportData: ReportData = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const shiftOrders = orders.filter(o => new Date(o.timestamp) >= todayStart);
    const monthOrders = orders; // For simplicity, "month" here means all orders passed for this branch
    
    // Dynamically get all categories and payment methods that have occurred this month.
    const allCategoriesInMonth = [...new Set(monthOrders.flatMap(o => o.items.map(i => i.category)))].sort();
    const allPaymentMethodsInMonth = [...new Set(monthOrders.map(o => o.paymentMethod))].sort();


    const calculateMetrics = (orderList: CompletedOrder[]) => {
        const salesByCategory: Record<string, { count: number, amount: number }> = {};
        const payments: Record<string, number> = {};
        const salesBySource: Record<string, { count: number }> = {};

        for (const order of orderList) {
            payments[order.paymentMethod] = (payments[order.paymentMethod] || 0) + order.total;
            
            const sourceKey = order.orderChannel;
            if (!salesBySource[sourceKey]) salesBySource[sourceKey] = { count: 0 };
            salesBySource[sourceKey].count++;

            for (const item of order.items) {
                 const categoryKey = item.category; // FIX: Use the item's actual category
                 if (!salesByCategory[categoryKey]) salesByCategory[categoryKey] = { count: 0, amount: 0 };
                 salesByCategory[categoryKey].amount += item.price * item.quantity;
            }
             const categoriesInOrder = [...new Set(order.items.map(i => i.category))];
             categoriesInOrder.forEach(cat => {
                 const categoryKey = cat; // FIX: Use the item's actual category
                 if (salesByCategory[categoryKey]) salesByCategory[categoryKey].count += 1;
             });
        }
        return { salesByCategory, payments, salesBySource };
    };

    const todayMetrics = calculateMetrics(shiftOrders);
    const monthMetrics = calculateMetrics(monthOrders);
    
    // Detailed data for exports
    const salesReport: ReportDataRow[] = allCategoriesInMonth.map(label => ({
        label,
        todayCount: todayMetrics.salesByCategory[label]?.count || 0,
        todayAmount: todayMetrics.salesByCategory[label]?.amount || 0,
        allTimeCount: monthMetrics.salesByCategory[label]?.count || 0,
        allTimeAmount: monthMetrics.salesByCategory[label]?.amount || 0,
    }));
    
    const paymentReport: ReportDataRow[] = allPaymentMethodsInMonth.map(label => ({
        label,
        todayAmount: todayMetrics.payments[label] || 0,
        allTimeAmount: monthMetrics.payments[label] || 0,
    }));
    
    const salesSourceReport: ReportDataRow[] = SALES_SOURCES.map(source => ({
        label: source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        todayCount: todayMetrics.salesBySource[source]?.count || 0,
        todayAmount: 0,
        allTimeCount: monthMetrics.salesBySource[source]?.count || 0,
        allTimeAmount: 0,
    }));

    // Summary data for UI
    const totalRevenueToday = shiftOrders.reduce((sum, order) => sum + order.total, 0);
    const paymentMethodsToday = Object.entries(todayMetrics.payments)
        .filter(([, amount]) => amount > 0)
        .map(([method, amount]) => ({ method, amount }));

    // Reconciliation data
    const totalCashSales = todayMetrics.payments['Cash'] || 0;
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expectedCash = initialCash + totalCashSales - totalExpenses;
    const actualCashAmount = parseFloat(actualCash) || 0;
    const difference = actualCashAmount - expectedCash;

    return {
      // Detailed for export
      salesReport,
      paymentReport,
      salesSourceReport,
      // Summary for UI
      totalOrdersToday: shiftOrders.length,
      totalRevenueToday,
      paymentMethodsToday,
      // Reconciliation for UI & Export
      initialCash,
      totalCashSales,
      expenses,
      totalExpenses,
      expectedCash,
      actualCash: actualCashAmount,
      difference,
    };
  }, [orders, initialCash, expenses, actualCash, user]);

  if (!isOpen) return null;

  const isFormComplete = weather !== '' && actualCash !== '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in-sm">
      <div className="bg-gray-100 rounded-lg shadow-xl w-full h-full max-w-5xl max-h-[95vh] m-4 flex flex-col">
        {view === 'form' ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg flex justify-between items-center flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-900">Close Shift Report</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-900"><Icon name="close" className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-grow flex overflow-hidden">
              {/* Main Content (Scrollable) */}
              <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 text-base flex items-center gap-2"><Icon name="chart-pie" className="w-5 h-5 text-orange-500" />Sales Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="font-medium text-gray-500">Total Orders:</div>
                        <div className="font-semibold text-gray-800 text-right">{reportData.totalOrdersToday}</div>
                        <div className="font-medium text-gray-500">Total Revenue:</div>
                        <div className="font-semibold text-gray-800 text-right">{formatRupiah(reportData.totalRevenueToday)}</div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 text-base">Payment Methods</h4>
                    <div className="space-y-2 text-sm">
                        {reportData.paymentMethodsToday.length > 0 ? reportData.paymentMethodsToday.map(p => (
                            <div key={p.method} className="flex justify-between items-center">
                                <span className="font-medium text-gray-500">{p.method}</span>
                                <span className="font-semibold text-gray-800">{formatRupiah(p.amount)}</span>
                            </div>
                        )) : <p className="text-gray-500 text-center py-4">No electronic payments recorded.</p>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 text-base">Expenses</h4>
                     <div className="space-y-2 text-sm">
                        {expenses.length > 0 ? expenses.map(e => (
                            <div key={e.id} className="flex justify-between items-center">
                                <span className="font-medium text-gray-500">{e.description}</span>
                                <span className="font-semibold text-red-600">- {formatRupiah(e.amount)}</span>
                            </div>
                        )) : <p className="text-gray-500 text-center py-4">No expenses logged.</p>}
                        <hr className="my-2"/>
                         <div className="flex justify-between items-center font-bold">
                            <span className="text-gray-600">Total Expenses</span>
                            <span className="text-red-600">- {formatRupiah(reportData.totalExpenses)}</span>
                        </div>
                    </div>
                </div>
              </main>
              
              {/* Sidebar (Sticky) */}
              <aside className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                      <h4 className="font-bold text-gray-800 text-base">Cash Reconciliation</h4>
                      <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center"><span className="text-gray-500">Initial Cash</span> <span className="font-semibold">{formatRupiah(reportData.initialCash)}</span></div>
                          <div className="flex justify-between items-center"><span className="text-gray-500">Cash Sales (+)</span> <span className="font-semibold">{formatRupiah(reportData.totalCashSales)}</span></div>
                          <div className="flex justify-between items-center"><span className="text-gray-500">Expenses (-)</span> <span className="font-semibold">{formatRupiah(reportData.totalExpenses)}</span></div>
                      </div>
                      <hr />
                      <div className="space-y-2">
                          <div className="flex justify-between items-baseline"><span className="text-gray-500 font-semibold text-sm">EXPECTED CASH</span> <span className="font-bold text-lg text-orange-500">{formatRupiah(reportData.expectedCash)}</span></div>
                      </div>
                       <div>
                          <label htmlFor="weather" className="block text-sm font-medium text-gray-700 mb-1">Cuaca</label>
                          <select
                              id="weather"
                              value={weather}
                              onChange={(e) => setWeather(e.target.value)}
                              className={`w-full border rounded-md shadow-sm p-2 text-sm focus:ring-orange-500 focus:border-orange-500 transition-colors ${!weather ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-300'}`}
                          >
                              <option value="" disabled>Pilih cuaca...</option>
                              <option value="Cerah">Cerah</option>
                              <option value="Berawan">Berawan</option>
                              <option value="Hujan">Hujan</option>
                              <option value="Gerimis">Gerimis</option>
                          </select>
                      </div>
                      <div>
                          <label htmlFor="actualCash" className="block text-sm font-medium text-gray-700 mb-1">ACTUAL CASH IN DRAWER</label>
                           <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              id="actualCash" 
                              value={actualCash} 
                              onChange={(e) => setActualCash(e.target.value)} 
                              className={`flex-grow w-full text-gray-900 border rounded-md shadow-sm text-lg p-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${!actualCash ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-300'}`} 
                              placeholder="0" 
                            />
                            <button
                                type="button"
                                onClick={() => setActualCash(String(reportData.expectedCash))}
                                className="flex-shrink-0 bg-gray-200 text-gray-700 font-semibold px-3 py-2.5 rounded-md hover:bg-gray-300 transition-colors text-sm"
                                title="Set to expected amount"
                            >
                                Pas
                            </button>
                          </div>
                      </div>
                       <div className={`p-4 rounded-lg text-center mt-4 ${reportData.difference === 0 ? 'bg-green-100 text-green-800' : reportData.difference > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          <p className="font-semibold text-sm">Difference</p>
                          <p className="font-bold text-2xl">{formatRupiah(reportData.difference)}</p>
                      </div>
                  </div>
                   <div className="space-y-3">
                        <button 
                          onClick={() => setView('preview')} 
                          disabled={!isFormComplete}
                          className="w-full bg-orange-500 text-white font-bold py-3 px-5 rounded-lg hover:bg-orange-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          Preview Report
                        </button>
                   </div>
              </aside>
            </div>
          </>
        ) : (
          <ClosingReportPreview
            reportData={reportData}
            user={user}
            shiftStartTime={shiftStartTime}
            weather={weather}
            onBack={() => setView('form')}
            onConfirm={onConfirmAndClose}
          />
        )}
      </div>
    </div>
  );
};

export default CashierClosingModal;
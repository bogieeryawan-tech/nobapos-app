import React, { useMemo, useState, useCallback } from 'react';
import type { CompletedOrder, MenuItem, ReportType, Branch } from '../types';
import { formatRupiah } from '../utils';
import PieChart from './PieChart';
import OrderList from './OrderList';
import Icon from './Icon';


interface ManagerDashboardProps {
  orders: CompletedOrder[];
  menuItems: MenuItem[];
  branches: Branch[];
}

const COLORS = ['#F9A602', '#DD2E44', '#212121', '#4A90E2', '#7ED321', '#F5A623', '#BD10E0', '#9013FE'];


// --- Helper functions for date manipulation ---
const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const formatDateForInput = (date: Date) => {
    // FIX: Use local date parts to avoid timezone conversion issues with toISOString().
    // This ensures that the date string (e.g., "2023-10-27") matches the user's local day.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Helper functions for report generation ---
const escapeCsvCell = (cellData: any) => {
    const stringData = String(cellData ?? '');
    // FIX: Check for semicolons in addition to commas and quotes to ensure proper escaping
    // when using semicolons as delimiters for better Excel compatibility.
    if (/[";\n]/.test(stringData)) {
        return `"${stringData.replace(/"/g, '""')}"`;
    }
    return stringData;
};

const downloadFile = (content: string, fileName: string, mimeType: string) => {
    // FIX: Added a UTF-8 Byte Order Mark (BOM) at the start of the content.
    // This is crucial for ensuring Microsoft Excel correctly interprets the file's
    // character encoding, preventing garbled text and formatting issues.
    const blob = new Blob([`\uFEFF${content}`], { type: mimeType }); // Added BOM for Excel
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// --- Export Modal Component ---
interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    orders: CompletedOrder[];
    menuItems: MenuItem[];
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, orders }) => {
    const [reportType, setReportType] = useState<ReportType>('detailed');
    const [datePreset, setDatePreset] = useState<'today' | '7days' | '30days' | 'all' | 'custom'>('7days');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const filteredOrders = useMemo(() => {
        if (datePreset === 'all') return orders;
        // FIX: Removed redundant condition `datePreset !== 'all'`. The type of `datePreset` is already narrowed by the preceding `if` statement, causing a TypeScript error. The simplified condition correctly handles cases where a date range is not yet selected.
        if (!startDate && !endDate) return [];

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        return orders.filter(order => {
            const orderTime = new Date(order.timestamp).getTime();
            return orderTime >= start.getTime() && orderTime <= end.getTime();
        });
    }, [orders, datePreset, startDate, endDate]);

    const handleDatePresetChange = useCallback((preset: 'today' | '7days' | '30days' | 'all' | 'custom') => {
        setDatePreset(preset);
        const today = getToday();
        const todayStr = formatDateForInput(today);
        
        if (preset === 'today') {
            setStartDate(todayStr);
            setEndDate(todayStr);
        } else if (preset === '7days') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 6);
            setStartDate(formatDateForInput(sevenDaysAgo));
            setEndDate(todayStr);
        } else if (preset === '30days') {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 29);
            setStartDate(formatDateForInput(thirtyDaysAgo));
            setEndDate(todayStr);
        } else if (preset === 'all') {
            setStartDate('');
            setEndDate('');
        } else { // custom
            // keep existing values
        }
    }, []);

    // Set initial date range on mount
    useState(() => {
        handleDatePresetChange('7days');
    });

    const generateDetailedCSV = () => {
        const headers = ["Order ID", "Date", "Time", "Cashier", "Channel", "Payment Method", "Order Subtotal", "Order Discount", "Order Tax", "Order Total", "Item Name", "Item Category", "Item Quantity", "Item Price", "Item Cost", "Item Total Price", "Item Total Cost", "Item Profit"];
        const rows = filteredOrders.flatMap(order => order.items.map(item => {
            const itemTotalPrice = item.price * item.quantity;
            const itemTotalCost = item.cost * item.quantity;
            const itemProfit = itemTotalPrice - itemTotalCost;
            const orderDate = new Date(order.timestamp);
            // FIX: Changed delimiter from comma to semicolon for better Excel compatibility in various regions.
            return [order.id, orderDate.toLocaleDateString('id-ID'), orderDate.toLocaleTimeString('id-ID'), order.cashier, order.orderChannel, order.paymentMethod, order.subtotal, order.discountAmount || 0, order.tax, order.total, item.name, item.category, item.quantity, item.price, item.cost, itemTotalPrice, itemTotalCost, itemProfit].map(escapeCsvCell).join(';');
        }));
        // FIX: Changed delimiter from comma to semicolon.
        return [headers.join(';'), ...rows].join('\n');
    };
    
    const generateSummaryCSV = () => {
        const headers = ["Date", "Total Revenue", "Total Profit", "Total Orders"];
        const dailyData = filteredOrders.reduce((acc, order) => {
            const date = new Date(order.timestamp).toLocaleDateString('id-ID');
            if (!acc[date]) {
                acc[date] = { revenue: 0, profit: 0, orders: 0 };
            }
            const orderCost = order.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
            acc[date].revenue += order.total;
            // FIX: The 'cost' property does not exist on the 'CompletedOrder' type.
            // Profit is calculated as net revenue (Total - Tax) minus the cost of all items.
            acc[date].profit += (order.total - order.tax) - orderCost;
            acc[date].orders += 1;
            return acc;
        }, {} as Record<string, { revenue: number, profit: number, orders: number }>);

        const rows = Object.entries(dailyData).map(([date, data]) => 
            // FIX: Changed delimiter from comma to semicolon.
            [date, data.revenue, data.profit, data.orders].map(escapeCsvCell).join(';')
        );
        // FIX: Changed delimiter from comma to semicolon.
        return [headers.join(';'), ...rows].join('\n');
    };

    const handleGenerate = async () => {
        if (filteredOrders.length === 0 && datePreset !== 'all') {
            setError("No data available for the selected period.");
            return;
        }
        setError('');
        setIsGenerating(true);
        try {
            const dateString = datePreset === 'all' ? 'all-time' : `${startDate}_to_${endDate}`;
            if (reportType === 'detailed') {
                const csv = generateDetailedCSV();
                downloadFile(csv, `nobapos_detailed_${dateString}.csv`, 'text/csv;charset=utf-8;');
            } else if (reportType === 'summary') {
                const csv = generateSummaryCSV();
                downloadFile(csv, `nobapos_summary_${dateString}.csv`, 'text/csv;charset=utf-8;');
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    if (!isOpen) return null;
    
    const PresetButton: React.FC<{
        preset: 'today' | '7days' | '30days' | 'all' | 'custom',
        children: React.ReactNode
    }> = ({ preset, children }) => (
        <button
            onClick={() => handleDatePresetChange(preset)}
            className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors ${datePreset === preset ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl m-4">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Icon name="file-text" className="w-6 h-6 text-orange-500"/>
                        Report Center
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900"><Icon name="close" className="w-6 h-6" /></button>
                </div>

                <div className="p-8 space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">1. Select Report Type</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           <ReportTypeCard type="summary" title="Sales Summary" description="High-level daily sales data. Best for quick overviews." activeType={reportType} setType={setReportType} />
                           <ReportTypeCard type="detailed" title="Detailed Log" description="All transaction line items. Best for accounting." activeType={reportType} setType={setReportType} />
                        </div>
                    </div>

                    <div>
                         <h4 className="font-semibold text-gray-700 mb-3">2. Select Date Range</h4>
                         <div className="flex items-center gap-2 flex-wrap mb-4">
                            <PresetButton preset="today">Today</PresetButton>
                            <PresetButton preset="7days">Last 7 Days</PresetButton>
                            <PresetButton preset="30days">Last 30 Days</PresetButton>
                            <PresetButton preset="all">All Time</PresetButton>
                            <PresetButton preset="custom">Custom</PresetButton>
                         </div>
                         {datePreset === 'custom' && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in-sm">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm bg-white" />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm bg-white" />
                                </div>
                            </div>
                         )}
                    </div>
                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                </div>

                <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end items-center gap-4">
                    <button type="button" onClick={onClose} className="text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200">Cancel</button>
                    <button onClick={handleGenerate} disabled={isGenerating} className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-400 disabled:bg-gray-300 flex items-center justify-center gap-2 w-52">
                        {isGenerating ? <><Icon name="loader" className="w-5 h-5 animate-spin" /> Generating...</> : <><Icon name="download" className="w-5 h-5" /> Download Report</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReportTypeCard = ({ type, title, description, activeType, setType }: { type: ReportType, title: string, description: string, activeType: ReportType, setType: (type: ReportType) => void}) => (
    <button onClick={() => setType(type)} className={`p-4 rounded-lg border-2 text-left transition-all ${activeType === type ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
        <p className={`font-bold ${activeType === type ? 'text-orange-600' : 'text-gray-800'}`}>{title}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
    </button>
);


// --- Main Dashboard Component ---
const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ orders, menuItems, branches }) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [datePreset, setDatePreset] = useState<'today' | '7days' | '30days' | 'all'>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<number | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDatePresetChange = useCallback((preset: 'today' | '7days' | '30days' | 'all') => {
      setDatePreset(preset);
      const today = getToday();
      const todayStr = formatDateForInput(today);

      if (preset === 'today') {
          setStartDate(todayStr);
          setEndDate(todayStr);
      } else if (preset === '7days') {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 6);
          setStartDate(formatDateForInput(sevenDaysAgo));
          setEndDate(todayStr);
      } else if (preset === '30days') {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 29);
          setStartDate(formatDateForInput(thirtyDaysAgo));
          setEndDate(todayStr);
      } else if (preset === 'all') {
          setStartDate('');
          setEndDate('');
      }
  }, []);
  
  // Set initial date range on mount
  useState(() => {
    handleDatePresetChange('all');
  });

  const filteredOrders = useMemo(() => {
    // 1. Filter by branch first
    const branchFiltered = selectedBranchId === 'all'
      ? orders
      : orders.filter(order => order.branchId === selectedBranchId);

    // 2. Then filter by date
    if (datePreset === 'all') return branchFiltered;
    if (!startDate || !endDate) return [];

    // FIX: Correctly set start and end of day in the user's local timezone.
    // The previous implementation could misinterpret dates as UTC, excluding some orders.
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    return branchFiltered.filter(order => {
      const orderTime = new Date(order.timestamp).getTime();
      return orderTime >= start.getTime() && orderTime <= end.getTime();
    });
  }, [orders, datePreset, startDate, endDate, selectedBranchId]);

  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const allItems = filteredOrders.flatMap(o => o.items);
    
    // FIX: Profit calculation was incorrect. It should be based on revenue minus the cost
    // of goods sold, which is derived from each item's cost property.
    const totalCost = allItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
    const totalProfit = totalRevenue - totalCost;


    const salesByCategory = allItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + (item.price * item.quantity);
        return acc;
    }, {} as Record<string, number>);

    const salesByChannel = filteredOrders.reduce((acc, order) => {
        acc[order.orderChannel] = (acc[order.orderChannel] || 0) + order.total;
        return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalProfit,
      totalOrders: filteredOrders.length,
      averageOrderValue: filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0,
      salesByCategory: Object.entries(salesByCategory).map(([label, value], i) => ({ label, value, color: COLORS[i % COLORS.length] })).sort((a,b) => b.value - a.value),
      salesByChannel: Object.entries(salesByChannel).map(([label, value], i) => ({ label, value, color: COLORS[i % COLORS.length] })).sort((a,b) => b.value - a.value),
    };
  }, [filteredOrders, menuItems]);
  
  const StatCard = ({ title, value, iconName }: { title: string, value: string, iconName: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
      <div className="bg-orange-100 p-3 rounded-full">
        <Icon name={iconName} className="w-6 h-6 text-orange-500" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
  
   const PresetButton: React.FC<{
        preset: 'today' | '7days' | '30days' | 'all',
        children: React.ReactNode
    }> = ({ preset, children }) => (
        <button
            onClick={() => handleDatePresetChange(preset)}
            className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors ${datePreset === preset ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-300'}`}
        >
            {children}
        </button>
    );

  if (orders.length === 0) {
    return (
      <div className="p-8 bg-gray-50 h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Manager Dashboard</h1>
          <button
            disabled
            className="w-full md:w-auto bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Icon name="file-text" className="w-5 h-5" />
            Export Reports
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Icon name="chart-pie" className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Welcome to Your Dashboard!</h2>
            <p className="mt-2 max-w-md mx-auto">
              This is where your sales analytics, charts, and recent orders will appear.
              Once your cashier completes the first transaction, this dashboard will come to life with data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Manager Dashboard</h1>
         <button
            onClick={() => setIsExportModalOpen(true)}
            className="w-full md:w-auto bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Icon name="file-text" className="w-5 h-5" />
            Export Reports
          </button>
      </div>
      
      {/* Filter Controls */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-8 flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="branch-filter" className="text-sm font-semibold text-gray-600 mr-2">Branch:</label>
            <select
                id="branch-filter"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm font-semibold"
            >
                <option value="all">All Branches</option>
                {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
            </select>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-600 mr-2">Date Range:</span>
              <PresetButton preset="today">Today</PresetButton>
              <PresetButton preset="7days">Last 7 Days</PresetButton>
              <PresetButton preset="30days">Last 30 Days</PresetButton>
              <PresetButton preset="all">All Time</PresetButton>
          </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={formatRupiah(stats.totalRevenue)} iconName="cash" />
        <StatCard title="Total Profit" value={formatRupiah(stats.totalProfit)} iconName="logo" />
        <StatCard title="Total Orders" value={stats.totalOrders.toString()} iconName="shopping-cart" />
        <StatCard title="Average Order" value={formatRupiah(stats.averageOrderValue)} iconName="credit_card" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PieChart title="Revenue by Category" data={stats.salesByCategory} />
        <PieChart title="Revenue by Channel" data={stats.salesByChannel} />
      </div>

      {/* Recent Orders List - showing filtered orders */}
      <OrderList orders={filteredOrders} />
      
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        orders={filteredOrders} // Pass filtered orders to the export modal
        menuItems={menuItems}
      />
    </div>
  );
};

export default ManagerDashboard;
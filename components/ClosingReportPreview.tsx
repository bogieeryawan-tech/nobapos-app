import React from 'react';
import type { User, Expense } from '../types';
import Icon from './Icon';
import { formatRupiah, formatRupiahParts } from '../utils';
import type { ReportData } from './CashierClosingModal';

interface ClosingReportPreviewProps {
  reportData: ReportData;
  user: User;
  shiftStartTime: string;
  weather: string;
  onBack: () => void;
  onConfirm: () => void;
}


const ReportSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-800 uppercase tracking-wider">{title}</h3>
        <div className="space-y-2 text-sm">
            {children}
        </div>
    </div>
);

const RupiahCell: React.FC<{ amount: number; className?: string }> = ({ amount, className = '' }) => {
    const { symbol, value } = formatRupiahParts(amount);
    return (
        <div className={`flex justify-between items-center ${className}`}>
            <span>{symbol}</span>
            <span>{value}</span>
        </div>
    );
};

const ReportRow: React.FC<{ label: React.ReactNode; value?: React.ReactNode; className?: string }> = ({ label, value, className = '' }) => (
    <div className={`flex justify-between items-center py-1 ${className}`}>
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
    </div>
);


const ClosingReportPreview: React.FC<ClosingReportPreviewProps> = ({ reportData, user, shiftStartTime, weather, onBack, onConfirm }) => {
    const now = new Date();
    
    // Calculate totals for today and this month
    const totalSalesTransactionsToday = reportData.salesReport.reduce((sum, row) => sum + (row.todayCount ?? 0), 0);
    const totalSalesAmountToday = reportData.salesReport.reduce((sum, row) => sum + row.todayAmount, 0);
    const totalSalesTransactionsMonth = reportData.salesReport.reduce((sum, row) => sum + (row.allTimeCount ?? 0), 0);
    const totalSalesAmountMonth = reportData.salesReport.reduce((sum, row) => sum + row.allTimeAmount, 0);

    const totalPaymentAmountToday = reportData.paymentReport.reduce((sum, row) => sum + row.todayAmount, 0);
    const totalPaymentAmountMonth = reportData.paymentReport.reduce((sum, row) => sum + row.allTimeAmount, 0);

    const totalSalesSourceTransactionsToday = reportData.salesSourceReport.reduce((sum, row) => sum + (row.todayCount ?? 0), 0);
    const totalSalesSourceTransactionsMonth = reportData.salesSourceReport.reduce((sum, row) => sum + (row.allTimeCount ?? 0), 0);


    return (
    <>
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg flex justify-between items-center flex-shrink-0">
        <h3 className="text-xl font-bold text-gray-900">Report Preview</h3>
      </div>
      <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg border border-gray-200">
            {/* Header */}
            <header className="text-center pb-4 border-b-2 border-black">
                <h1 className="text-2xl font-bold text-black">BUKU CATATAN</h1>
                <h2 className="text-lg font-semibold text-gray-700">LAPORAN PENUTUPAN KASIR</h2>
            </header>
            <div className="grid grid-cols-3 gap-4 text-sm py-3 mb-4 border-b border-gray-300">
                <p><span className="font-semibold">Tanggal:</span> {now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p><span className="font-semibold">Cuaca:</span> {weather}</p>
                <p><span className="font-semibold">PIC:</span> {user.name}</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-6">
                    <ReportSection title="Laporan Penjualan">
                       <table className="w-full text-xs">
                            <thead className="border-b-2 border-gray-300">
                                <tr>
                                    <th rowSpan={2} className="text-left font-bold text-gray-500 pb-1 align-bottom pr-2">Kategori</th>
                                    <th colSpan={2} className="text-center font-bold text-gray-500 pb-1">Hari Ini</th>
                                    <th colSpan={2} className="text-center font-bold text-gray-500 pb-1 border-l border-gray-200">Bulan Ini</th>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <th className="text-center font-medium text-gray-500 py-1">Jml</th>
                                    <th className="text-right font-medium text-gray-500 py-1 pr-1">Nilai</th>
                                    <th className="text-center font-medium text-gray-500 py-1 border-l border-gray-200">Jml</th>
                                    <th className="text-right font-medium text-gray-500 py-1 pr-1">Nilai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.salesReport.filter(r => r.allTimeAmount > 0).map(row => (
                                    <tr key={row.label} className="border-b border-gray-100">
                                        <td className="py-1.5 text-gray-700 pr-2">{row.label}</td>
                                        <td className="py-1.5 text-center font-semibold">{row.todayCount ?? 0}</td>
                                        <td className="py-1.5 font-semibold"><RupiahCell amount={row.todayAmount} /></td>
                                        <td className="py-1.5 text-center font-semibold border-l border-gray-200">{row.allTimeCount ?? 0}</td>
                                        <td className="py-1.5 font-semibold"><RupiahCell amount={row.allTimeAmount} /></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="font-bold">
                                <tr className="border-t-2 border-gray-300">
                                    <td className="pt-2">Grand Total</td>
                                    <td className="pt-2 text-center">{totalSalesTransactionsToday}</td>
                                    <td className="pt-2"><RupiahCell amount={totalSalesAmountToday} /></td>
                                    <td className="pt-2 text-center border-l border-gray-200">{totalSalesTransactionsMonth}</td>
                                    <td className="pt-2"><RupiahCell amount={totalSalesAmountMonth} /></td>
                                </tr>
                            </tfoot>
                        </table>
                    </ReportSection>
                    
                    <ReportSection title="Laporan Pembayaran">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left font-bold text-gray-500 pb-1">Metode</th>
                                    <th className="text-right font-bold text-gray-500 pb-1 pr-1">Hari Ini</th>
                                    <th className="text-right font-bold text-gray-500 pb-1 pr-1">Bulan Ini</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.paymentReport.filter(r => r.allTimeAmount > 0).map(row => (
                                    <tr key={row.label}>
                                        <td className="py-1 text-gray-700">{row.label}</td>
                                        <td className="py-1 font-semibold"><RupiahCell amount={row.todayAmount} /></td>
                                        <td className="py-1 font-semibold"><RupiahCell amount={row.allTimeAmount} /></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="font-bold border-t-2 border-gray-300">
                                <tr>
                                    <td className="pt-2">Grand Total</td>
                                    <td className="pt-2"><RupiahCell amount={totalPaymentAmountToday} /></td>
                                    <td className="pt-2"><RupiahCell amount={totalPaymentAmountMonth} /></td>
                                </tr>
                            </tfoot>
                        </table>
                    </ReportSection>

                    <ReportSection title="Laporan Sumber Penjualan">
                         <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left font-bold text-gray-500 pb-1">Sumber</th>
                                    <th className="text-center font-bold text-gray-500 pb-1">Hari Ini (trx)</th>
                                    <th className="text-center font-bold text-gray-500 pb-1">Bulan Ini (trx)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.salesSourceReport.filter(r => (r.allTimeCount ?? 0) > 0).map(row => (
                                    <tr key={row.label}>
                                        <td className="py-1 text-gray-700">{row.label}</td>
                                        <td className="py-1 text-center font-semibold">{row.todayCount ?? 0}</td>
                                        <td className="py-1 text-center font-semibold">{row.allTimeCount ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="font-bold border-t-2 border-gray-300">
                                <tr>
                                    <td className="pt-2">Grand Total</td>
                                    <td className="pt-2 text-center">{totalSalesSourceTransactionsToday}</td>
                                    <td className="pt-2 text-center">{totalSalesSourceTransactionsMonth}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </ReportSection>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                     <ReportSection title="Laporan Pengeluaran Harian">
                        {reportData.expenses.length > 0 ? (
                            <>
                                {reportData.expenses.map((exp: Expense) => (
                                    <ReportRow key={exp.id} label={exp.description} value={<RupiahCell amount={-exp.amount} />} />
                                ))}
                                <ReportRow label="Jumlah Pengeluaran" value={<RupiahCell amount={-reportData.totalExpenses} />} className="font-bold border-t pt-2 mt-2" />
                            </>
                        ) : (
                            <p className="text-center text-gray-500 py-4">Tidak ada pengeluaran.</p>
                        )}
                    </ReportSection>

                    <ReportSection title="Catatan Lainnya (Rekonsiliasi Kas)">
                        <ReportRow label="Cash Awal" value={<RupiahCell amount={reportData.initialCash} />} />
                        <ReportRow label="Cash Masuk (Penjualan)" value={<RupiahCell amount={reportData.totalCashSales} />} />
                        <div className="border-b my-2"></div>
                        <ReportRow label="Saldo Cash Akhir (Sistem)" value={<RupiahCell amount={reportData.expectedCash} />} className="font-bold text-base" />
                        <div className="border-b my-2"></div>
                        <ReportRow label="Kas Aktual (Di Laci)" value={<RupiahCell amount={reportData.actualCash} />} />
                         <ReportRow 
                            label="Selisih" 
                            value={<RupiahCell amount={reportData.difference} />}
                            className={`font-bold text-base ${reportData.difference === 0 ? 'text-green-600' : reportData.difference > 0 ? 'text-blue-600' : 'text-red-600'}`}
                         />
                    </ReportSection>
                </div>

            </div>
        </div>

      </div>
      <div className="p-4 bg-white rounded-b-lg border-t border-gray-200 flex-shrink-0 flex justify-end items-center gap-4">
          <button onClick={onBack} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
              Back
          </button>
          <button onClick={onConfirm} className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-400 transition-colors flex items-center gap-2">
              <Icon name="clipboard-check" className="w-5 h-5"/>
              Confirm & Close Shift
          </button>
      </div>
    </>
    );
};

export default ClosingReportPreview;
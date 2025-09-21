import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { formatRupiah } from '../utils';
import { CompletedOrder } from '../types';

interface PaymentModalProps {
  totalAmount: number;
  onClose: () => void; // This is now for "New Order"
  onPaymentSuccess: (paymentMethod: string) => void;
  lastCompletedOrder: CompletedOrder | null;
  qrisImageUrl: string | null;
}

type ModalView = 'payment' | 'qris' | 'success';

const CASH_SUGGESTIONS = [50000, 100000, 200000, 500000];
const PLACEHOLDER_QRIS_IMAGE_URL = 'https://storage.googleapis.com/aistudio-marketplace-data/11721e5c-06a9-4475-b0b2-3253b7596a24/qris-placeholder.png'; // Placeholder QRIS image

const PaymentModal: React.FC<PaymentModalProps> = ({ totalAmount, onClose, onPaymentSuccess, lastCompletedOrder, qrisImageUrl }) => {
  const [cashReceived, setCashReceived] = useState<number | null>(null);
  const [view, setView] = useState<ModalView>('payment');
  
  const change = cashReceived !== null ? cashReceived - totalAmount : null;

  useEffect(() => {
    // If a lastCompletedOrder is passed, it means payment was successful.
    if (lastCompletedOrder) {
      setView('success');
      // If payment was cash, set cashReceived to calculate change.
      if (lastCompletedOrder.paymentMethod === 'Cash' && cashReceived === null) {
          // This path is tricky, as we don't know the exact cash given.
          // For simplicity, we assume exact change if we land here without prior cashReceived.
          // A better implementation might pass cashReceived through the success handler.
          // For now, let's just make sure change calculation doesn't break.
      }
    } else {
      // If modal is opened or order is cleared, reset to payment view.
      setView('payment');
      setCashReceived(null);
    }
  }, [lastCompletedOrder]);


  const handleCashPayment = () => {
      if (cashReceived !== null && cashReceived >= totalAmount) {
          onPaymentSuccess('Cash');
      }
  };
  
  const handleEwalletPayment = (method: string) => {
      onPaymentSuccess(method);
  }
  
  const handleQrisPayment = () => {
      setView('qris');
  }

  const renderPaymentView = () => (
    <>
      <div className="p-8 space-y-6">
        <div className="text-center">
          <p className="text-gray-500">Total Due</p>
          <p className="text-5xl font-bold text-orange-500">{formatRupiah(totalAmount)}</p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Electronic Payment</h4>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={handleQrisPayment} className="bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">QRIS</button>
            <button onClick={() => handleEwalletPayment('Card')} className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors col-span-2">Credit/Debit Card</button>
            <button onClick={() => handleEwalletPayment('GoPay')} className="bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition-colors">GoPay</button>
            <button onClick={() => handleEwalletPayment('OVO')} className="bg-purple-700 text-white font-bold py-3 rounded-lg hover:bg-purple-800 transition-colors">OVO</button>
            <button onClick={() => handleEwalletPayment('Dana')} className="bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors">Dana</button>
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800">Cash Payment</h4>
          <div className="flex gap-2">
              {CASH_SUGGESTIONS.filter(amount => amount >= totalAmount).map(amount => (
                  <button key={amount} onClick={() => setCashReceived(amount)} className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-orange-500 hover:text-white">
                      {formatRupiah(amount)}
                  </button>
              ))}
          </div>
          <div>
            <label htmlFor="cash" className="text-sm text-gray-600">Or enter amount:</label>
            <input 
              type="number"
              id="cash"
              placeholder="Enter cash amount"
              className="mt-1 w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
              onChange={e => setCashReceived(parseFloat(e.target.value) || null)}
              value={cashReceived || ''}
            />
          </div>
        </div>

        {change !== null && (
          <div className={`p-4 rounded-lg text-center ${change >= 0 ? 'bg-orange-100' : 'bg-red-100'}`}>
            <p className="text-gray-700">Change</p>
            <p className={`text-3xl font-bold ${change >= 0 ? 'text-orange-700' : 'text-red-500'}`}>
              {formatRupiah(change)}
            </p>
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-50 rounded-b-2xl">
        <button 
          onClick={handleCashPayment}
          disabled={!cashReceived || cashReceived < totalAmount}
          className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Icon name="cash" className="w-5 h-5" /> Confirm Cash Payment
        </button>
      </div>
    </>
  );

  const renderQrisView = () => (
    <>
        <div className="p-8 text-center">
            <h4 className="text-2xl font-bold text-gray-800 mb-2">Scan QR Code</h4>
            <p className="text-gray-500">Please scan with your payment app</p>
            <img src={qrisImageUrl || PLACEHOLDER_QRIS_IMAGE_URL} alt="QRIS Code" className="w-64 h-64 mx-auto my-4 rounded-lg object-contain bg-white" />
            <p className="text-3xl font-bold text-orange-500">{formatRupiah(totalAmount)}</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl grid grid-cols-2 gap-4">
            <button onClick={() => setView('payment')} className="bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300">Back</button>
            <button onClick={() => handleEwalletPayment('QRIS')} className="bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-400">Confirm Payment</button>
        </div>
    </>
  );
  
  const renderSuccessView = () => (
    <>
        <div className="p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
            <p className="text-gray-500 mt-2">Paid with {lastCompletedOrder?.paymentMethod}</p>
            {lastCompletedOrder?.paymentMethod === 'Cash' && change !== null && change >= 0 && (
                 <div className="mt-4">
                    <p className="text-gray-600">Change:</p>
                    <p className="text-4xl font-bold text-orange-500">{formatRupiah(change)}</p>
                 </div>
            )}
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl">
            <button onClick={onClose} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600">
                New Order
            </button>
        </div>
    </>
  );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg m-4">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {view === 'payment' && 'Payment'}
            {view === 'qris' && 'QRIS Payment'}
            {view === 'success' && 'Success'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        
        {view === 'payment' && renderPaymentView()}
        {view === 'qris' && renderQrisView()}
        {view === 'success' && renderSuccessView()}
      </div>
    </div>
  );
};

export default PaymentModal;
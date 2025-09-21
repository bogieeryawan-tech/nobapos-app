import React, { useState } from 'react';
import type { User } from '../types';

interface CashierOpeningModalProps {
  isOpen: boolean;
  user: User;
  onConfirm: (initialCash: number) => void;
}

const CashierOpeningModal: React.FC<CashierOpeningModalProps> = ({ isOpen, user, onConfirm }) => {
  const [initialCash, setInitialCash] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const numericAmount = parseFloat(initialCash);
    if (isNaN(numericAmount) || numericAmount < 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    setError('');
    onConfirm(numericAmount);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4 transition-all duration-300">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Buka Sesi Kasir</h3>
        </div>
        <div className="p-8 space-y-4">
          <p className="text-gray-600">Masukkan jumlah uang modal awal di laci untuk memulai sesi Anda.</p>
          <div>
            <label htmlFor="initialCash" className="block text-sm font-medium text-gray-600 mb-1">Uang Modal Awal (Rp)</label>
            <input 
              type="number" 
              name="initialCash" 
              id="initialCash" 
              value={initialCash} 
              onChange={(e) => { setInitialCash(e.target.value); setError(''); }}
              required 
              autoFocus
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500 text-lg"
              placeholder="e.g. 500000"
              onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
              }}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl text-right">
          <button onClick={handleSubmit} className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-400">Mulai Sesi</button>
        </div>
      </div>
    </div>
  );
};

export default CashierOpeningModal;

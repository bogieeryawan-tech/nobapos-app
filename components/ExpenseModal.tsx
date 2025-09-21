import React, { useState } from 'react';
import Icon from './Icon';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (description: string, amount: number) => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description.trim()) {
      setError('Please enter a description for the expense.');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid, positive amount.');
      return;
    }
    onSave(description.trim(), numericAmount);
    // Reset form for next time
    setDescription('');
    setAmount('');
  };
  
  const handleClose = () => {
    // Reset form state on close
    setDescription('');
    setAmount('');
    setError('');
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg m-4">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Add Cash Expense</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-900">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <input 
                type="text" 
                name="description" 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                required 
                autoFocus
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g. Beli es batu"
              />
            </div>
             <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-600 mb-1">Amount (Rp)</label>
              <input 
                type="number" 
                name="amount" 
                id="amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                required 
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g. 25000"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
             <button type="button" onClick={handleClose} className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-400">Save Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
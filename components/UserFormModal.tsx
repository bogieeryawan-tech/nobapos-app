import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import Icon from './Icon';

interface UserFormModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
  existingUsers: User[];
  currentUserRole: 'owner' | 'supervisor';
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onClose, onSave, existingUsers, currentUserRole }) => {
  const [formData, setFormData] = useState({
    name: '',
    pin: '',
    role: 'cashier' as 'cashier' | 'supervisor' | 'owner',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, pin: user.pin, role: user.role });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError('');
    const { name, value } = e.target;
    if (name === 'pin') {
      // Allow only 4 digits
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 4) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    if (formData.pin.length !== 4) {
      setError('PIN must be exactly 4 digits.');
      return;
    }
    // Check if PIN is already in use by another user
    const isPinTaken = existingUsers.some(
      existingUser => existingUser.pin === formData.pin && existingUser.id !== user?.id
    );
    if (isPinTaken) {
      setError('This PIN is already in use. Please choose another one.');
      return;
    }
    
    const userToSave: User = {
      id: user?.id || Date.now(),
      name: formData.name.trim(),
      pin: formData.pin,
      role: formData.role,
    };
    onSave(userToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg m-4">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {user ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Employee Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"/>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                <select name="role" id="role" value={formData.role} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500">
                  <option value="cashier">Cashier</option>
                  <option value="supervisor">Supervisor</option>
                  {currentUserRole === 'owner' && (
                     <option value="owner">Owner</option>
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-600 mb-1">PIN (4 digits)</label>
                <input type="text" name="pin" id="pin" value={formData.pin} onChange={handleChange} required maxLength={4} pattern="\d{4}" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. 1234"/>
              </div>
            </div>
            {error && <p className="text-sm text-red-500 text-center -mb-2">{error}</p>}
          </div>

          <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-400">Save Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

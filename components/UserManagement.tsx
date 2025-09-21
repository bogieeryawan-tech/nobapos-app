import React, { useState } from 'react';
import type { User } from '../types';
import UserFormModal from './UserFormModal';
import Icon from './Icon';

interface UserManagementProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  canSupervisorManage: boolean;
  onSetCanSupervisorManage: (value: boolean) => void;
  currentUserRole: 'owner' | 'supervisor';
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateUsers, canSupervisorManage, onSetCanSupervisorManage, currentUserRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    // Owner can edit anyone. Supervisor can edit cashiers only.
    if (currentUserRole === 'owner' || (currentUserRole === 'supervisor' && user.role === 'cashier')) {
        setEditingUser(user);
        setIsModalOpen(true);
    }
  };

  const handleDeleteUser = (userId: number) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;
    
    // Protect owner from being deleted
    if (userToDelete.role === 'owner' && currentUserRole === 'owner') {
        const ownerCount = users.filter(u => u.role === 'owner').length;
        if (ownerCount <= 1) {
            alert("Cannot delete the last owner account.");
            return;
        }
    } else if (userToDelete.role === 'owner') {
        // This case handles supervisors trying to delete owners, which should be blocked anyway.
        alert("You do not have permission to delete an owner account.");
        return;
    }
    
    // Supervisor can only delete cashiers
    if (currentUserRole === 'supervisor' && userToDelete.role !== 'cashier') {
        alert("Supervisors can only delete cashier accounts.");
        return;
    }

    if (window.confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
      onUpdateUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleSaveUser = (userToSave: User) => {
    const index = users.findIndex(user => user.id === userToSave.id);
    if (index > -1) {
      const updatedUsers = [...users];
      updatedUsers[index] = userToSave;
      onUpdateUsers(updatedUsers);
    } else {
      onUpdateUsers([...users, userToSave]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          {currentUserRole === 'owner' && (
             <div className="flex items-center mt-4">
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" className="sr-only" checked={canSupervisorManage} onChange={e => onSetCanSupervisorManage(e.target.checked)} />
                        <div className={`block w-14 h-8 rounded-full ${canSupervisorManage ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${canSupervisorManage ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-gray-700">
                        Allow supervisors to manage employees
                    </div>
                </label>
            </div>
          )}
        </div>
        <button onClick={handleAddUser} className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-400">Add Employee</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">PIN</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
               const canEdit = currentUserRole === 'owner' || (currentUserRole === 'supervisor' && user.role === 'cashier');
               const canDelete = currentUserRole === 'owner' ? user.role !== 'owner' : (currentUserRole === 'supervisor' && user.role === 'cashier');

               return (
                <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4 font-mono">{user.pin}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEditUser(user)} className={`font-medium ${canEdit ? 'text-orange-600 hover:underline' : 'text-gray-400 cursor-not-allowed'} mr-4`}>Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)} className={`font-medium ${canDelete ? 'text-red-600 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}>Delete</button>
                  </td>
                </tr>
               )
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          existingUsers={users}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  );
};

export default UserManagement;

import React, { useState } from 'react';
import type { Branch } from '../types';
import Icon from './Icon';

interface BranchFormModalProps {
  branch: Branch | null;
  onClose: () => void;
  onSave: (branch: Branch) => void;
  existingBranches: Branch[];
}

const BranchFormModal: React.FC<BranchFormModalProps> = ({ branch, onClose, onSave, existingBranches }) => {
  const [name, setName] = useState(branch ? branch.name : '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Branch name cannot be empty.');
      return;
    }
    const isNameTaken = existingBranches.some(
      b => b.name.toLowerCase() === trimmedName.toLowerCase() && b.id !== branch?.id
    );
    if (isNameTaken) {
      setError('A branch with this name already exists.');
      return;
    }

    onSave({
      id: branch?.id || Date.now(),
      name: trimmedName,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg m-4">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">{branch ? 'Edit Branch' : 'Add New Branch'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900"><Icon name="close" className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Branch Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                required
                autoFocus
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Kemang Outlet"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-400">Save Branch</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface BranchManagementProps {
  branches: Branch[];
  onUpdateBranches: (branches: Branch[]) => void;
}

const BranchManagement: React.FC<BranchManagementProps> = ({ branches, onUpdateBranches }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const handleAddBranch = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleDeleteBranch = (branchId: number) => {
    if (branches.length <= 1) {
        alert("You cannot delete the last branch.");
        return;
    }
    if (window.confirm('Are you sure you want to delete this branch? This cannot be undone.')) {
      onUpdateBranches(branches.filter(branch => branch.id !== branchId));
    }
  };

  const handleSaveBranch = (branchToSave: Branch) => {
    const index = branches.findIndex(b => b.id === branchToSave.id);
    if (index > -1) {
      const updatedBranches = [...branches];
      updatedBranches[index] = branchToSave;
      onUpdateBranches(updatedBranches);
    } else {
      onUpdateBranches([...branches, branchToSave]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Branch Management</h1>
        <button onClick={handleAddBranch} className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-400">
          Add Branch
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3">Branch Name</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => (
              <tr key={branch.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{branch.name}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEditBranch(branch)} className="font-medium text-orange-600 hover:underline mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteBranch(branch.id)} className="font-medium text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <BranchFormModal
          branch={editingBranch}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBranch}
          existingBranches={branches}
        />
      )}
    </div>
  );
};

export default BranchManagement;

import React from 'react';
import type { Branch } from '../types';
import Icon from './Icon';

interface BranchSetupModalProps {
  isOpen: boolean;
  branches: Branch[];
  onSelectBranch: (branchId: number) => void;
  userRole: 'cashier' | 'supervisor' | 'owner';
}

const BranchSetupModal: React.FC<BranchSetupModalProps> = ({ isOpen, branches, onSelectBranch, userRole }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg m-4">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Select Branch for this Device</h3>
        </div>
        <div className="p-8">
          {branches.length > 0 ? (
            <>
              <p className="text-gray-600 mb-6">Please select which branch this device will be used for. This setting will be saved for future logins.</p>
              <div className="space-y-3">
                {branches.map(branch => (
                  <button
                    key={branch.id}
                    onClick={() => onSelectBranch(branch.id)}
                    className="w-full text-left p-4 bg-gray-100 rounded-lg hover:bg-orange-100 hover:text-orange-600 font-semibold transition-colors"
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600">
              <Icon name="alert-triangle" className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h4 className="font-bold text-lg">No Branches Found</h4>
              <p className="mt-2">The business owner must first set up branches in the Manager View under 'Branches' before this device can be used.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchSetupModal;

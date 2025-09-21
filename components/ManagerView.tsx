import React, { useState } from 'react';
import type { CompletedOrder, MenuItem, User, Branch } from '../types';
import MenuManagement from './MenuManagement';
import ManagerDashboard from './ManagerDashboard';
import UserManagement from './UserManagement';
import StoreSettings from './StoreSettings';
import BranchManagement from './BranchManagement';

interface ManagerViewProps {
  menuItems: MenuItem[];
  onUpdateMenu: (newMenuItems: MenuItem[]) => void;
  completedOrders: CompletedOrder[];
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  canSupervisorManage: boolean;
  onSetCanSupervisorManage: (value: boolean) => void;
  currentUser: User;
  language: 'en' | 'id';
  logoUrl: string | null;
  onLogoChange: (newLogoUrl: string) => void;
  qrisImageUrl: string | null;
  onQrisImageChange: (newQrisUrl: string) => void;
  branches: Branch[];
  onUpdateBranches: (branches: Branch[]) => void;
}

const ManagerView: React.FC<ManagerViewProps> = ({ 
  menuItems,
  onUpdateMenu,
  completedOrders,
  users,
  onUpdateUsers,
  canSupervisorManage,
  onSetCanSupervisorManage,
  currentUser,
  language,
  logoUrl,
  onLogoChange,
  qrisImageUrl,
  onQrisImageChange,
  branches,
  onUpdateBranches
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const showEmployeesTab = currentUser.role === 'owner' || (currentUser.role === 'supervisor' && canSupervisorManage);

  // FIX: Add a guard to narrow the `currentUser.role` type.
  // This component should only be rendered for 'owner' or 'supervisor' roles.
  // This check satisfies TypeScript for the `UserManagement` component's `currentUserRole` prop.
  if (currentUser.role !== 'owner' && currentUser.role !== 'supervisor') {
    return null; // Should not be reached based on logic in App.tsx
  }

  return (
    <div className="flex flex-col h-[calc(100vh-68px)]">
      <nav className="bg-white px-8">
        <div className="flex flex-wrap border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-4 font-medium ${activeTab === 'dashboard' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`py-3 px-4 font-medium ${activeTab === 'menu' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Menu Management
          </button>
          {showEmployeesTab && (
            <button 
              onClick={() => setActiveTab('employees')}
              className={`py-3 px-4 font-medium ${activeTab === 'employees' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Employees
            </button>
          )}
           {currentUser.role === 'owner' && (
             <button 
                onClick={() => setActiveTab('branches')}
                className={`py-3 px-4 font-medium ${activeTab === 'branches' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Branches
              </button>
           )}
           <button 
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 font-medium ${activeTab === 'settings' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Settings
          </button>
        </div>
      </nav>
      <div className="flex-grow overflow-y-auto hide-scrollbar">
        {activeTab === 'dashboard' && <ManagerDashboard orders={completedOrders} menuItems={menuItems} branches={branches} />}
        {activeTab === 'menu' && <MenuManagement menuItems={menuItems} onUpdateMenu={onUpdateMenu} />}
        {activeTab === 'employees' && showEmployeesTab && (
          <UserManagement 
            users={users}
            onUpdateUsers={onUpdateUsers}
            canSupervisorManage={canSupervisorManage}
            onSetCanSupervisorManage={onSetCanSupervisorManage}
            currentUserRole={currentUser.role}
          />
        )}
        {activeTab === 'branches' && currentUser.role === 'owner' && (
            <BranchManagement branches={branches} onUpdateBranches={onUpdateBranches} />
        )}
        {activeTab === 'settings' && <StoreSettings logoUrl={logoUrl} onLogoChange={onLogoChange} qrisImageUrl={qrisImageUrl} onQrisImageChange={onQrisImageChange} />}
      </div>
    </div>
  );
};

export default ManagerView;
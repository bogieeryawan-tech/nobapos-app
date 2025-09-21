import React from 'react';
import Icon from './Icon';

interface LoginSelectionScreenProps {
  onSelectStaff: () => void;
  onSelectOwner: () => void;
  logoUrl: string | null;
}

const LoginSelectionScreen: React.FC<LoginSelectionScreenProps> = ({ onSelectStaff, onSelectOwner, logoUrl }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="mb-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Store Logo" className="w-16 h-16 object-contain inline-block" />
          ) : (
            <Icon name="logo" className="w-16 h-16 inline-block" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to nobapos</h1>
        <p className="text-gray-500 mb-12">Please select your role to continue</p>
        
        <div className="space-y-4">
          <button
            onClick={onSelectOwner}
            className="w-full bg-gray-800 text-white font-bold py-4 rounded-lg text-lg transition-all hover:bg-gray-700 flex items-center justify-center gap-3"
          >
            <Icon name="user" className="w-6 h-6" />
            <span>Business Owner</span>
          </button>
          <button
            onClick={onSelectStaff}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-lg text-lg transition-all hover:bg-orange-400"
          >
            Staff Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSelectionScreen;

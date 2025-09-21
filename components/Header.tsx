import React from 'react';
import type { User } from '../types';
import Icon from './Icon';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'id';
  onLanguageChange: (lang: 'en' | 'id') => void;
  logoUrl: string | null;
  branchName?: string;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, language, onLanguageChange, logoUrl, branchName }) => {
  return (
    <header className="bg-white p-4 flex justify-between items-center shadow-md border-b border-gray-200">
      <div className="flex items-center gap-3">
        {logoUrl ? (
            <img src={logoUrl} alt="Store Logo" className="w-8 h-8 object-contain" />
        ) : (
            <Icon name="logo" className="w-8 h-8" />
        )}
        <h1 className="text-xl font-bold text-gray-900">nobapos</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <button onClick={() => onLanguageChange('id')} className={`px-3 py-1 text-sm rounded-md transition-colors ${language === 'id' ? 'bg-orange-500 text-white font-bold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>ID</button>
            <button onClick={() => onLanguageChange('en')} className={`px-3 py-1 text-sm rounded-md transition-colors ${language === 'en' ? 'bg-orange-500 text-white font-bold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>EN</button>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div className="text-right">
          <p className="font-semibold text-gray-800">{user.name}</p>
          <div className="flex items-center justify-end gap-1.5">
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            {branchName && <p className="text-sm text-gray-400">({branchName})</p>}
          </div>
        </div>
        <button
          onClick={onLogout}
          className="bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white p-2 rounded-full transition-colors"
          title="Logout"
        >
          <Icon name="logout" className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
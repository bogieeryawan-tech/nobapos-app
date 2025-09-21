import React, { useState } from 'react';
import Icon from './Icon';

interface LoginScreenProps {
  title: string;
  onLogin: (pin: string) => { success: boolean; message?: string };
  logoUrl: string | null;
  onBack: () => void;
}

const NumpadButton: React.FC<{ value: string; onClick: (val: string) => void; children?: React.ReactNode }> = ({ value, onClick, children }) => (
  <button
    onClick={() => onClick(value)}
    className="bg-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-semibold text-gray-800 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 shadow"
  >
    {children || value}
  </button>
);

const LoginScreen: React.FC<LoginScreenProps> = ({ title, onLogin, logoUrl, onBack }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleNumpadClick = (value: string) => {
    if (error) setError('');
    if (value === 'del') {
      setPin(p => p.slice(0, -1));
    } else if (pin.length < 4) {
      setPin(p => p + value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    const result = onLogin(pin);
    if (!result.success) {
      setError(result.message || 'An unknown login error occurred.');
      setPin('');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="mb-4">
            {logoUrl ? (
                <img src={logoUrl} alt="Store Logo" className="w-16 h-16 object-contain inline-block" />
            ) : (
                <Icon name="logo" className="w-16 h-16 inline-block"/>
            )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 mb-8">Please enter your PIN to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-4 mb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-14 rounded-lg flex items-center justify-center text-3xl font-bold ${pin.length > i ? 'bg-gray-200 text-gray-800' : 'bg-white border border-gray-300'}`}
              >
                {pin.length > i ? '•' : ''}
              </div>
            ))}
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4 h-5 animate-pulse">{error}</p>}
          {!error && <div className="h-5 mb-4" />}


          <div className="inline-grid grid-cols-3 gap-4 mb-6">
            <NumpadButton value="1" onClick={handleNumpadClick} />
            <NumpadButton value="2" onClick={handleNumpadClick} />
            <NumpadButton value="3" onClick={handleNumpadClick} />
            <NumpadButton value="4" onClick={handleNumpadClick} />
            <NumpadButton value="5" onClick={handleNumpadClick} />
            <NumpadButton value="6" onClick={handleNumpadClick} />
            <NumpadButton value="7" onClick={handleNumpadClick} />
            <NumpadButton value="8" onClick={handleNumpadClick} />
            <NumpadButton value="9" onClick={handleNumpadClick} />
            <div/>
            <NumpadButton value="0" onClick={handleNumpadClick} />
            <NumpadButton value="del" onClick={handleNumpadClick}>
                <Icon name="backspace" className="w-7 h-7" />
            </NumpadButton>
          </div>
          
          <button
            type="submit"
            disabled={pin.length !== 4}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-lg text-lg transition-all hover:bg-orange-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Login
          </button>
        </form>
        <button
          onClick={onBack}
          className="mt-6 text-gray-500 hover:text-gray-800 font-semibold text-sm"
        >
          Back to role selection
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
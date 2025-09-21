import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface StoreSettingsProps {
  logoUrl: string | null;
  onLogoChange: (newLogoUrl: string) => void;
  qrisImageUrl: string | null;
  onQrisImageChange: (newQrisUrl: string) => void;
}

const StoreSettings: React.FC<StoreSettingsProps> = ({ logoUrl, onLogoChange, qrisImageUrl, onQrisImageChange }) => {
  const [confirmation, setConfirmation] = useState<'logo' | 'qris' | null>(null);

  useEffect(() => {
    if (confirmation) {
      const timer = setTimeout(() => {
        setConfirmation(null);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [confirmation]);


  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    handler: (dataUrl: string) => void,
    type: 'logo' | 'qris'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB size limit
        alert("File is too large. Please select an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handler(base64String);
        setConfirmation(type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Store Settings</h1>
      <div className="space-y-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">Store Logo</h2>
            <p className="text-sm text-gray-500 mt-1">Upload a logo to personalize your POS and receipts.</p>
            <div className="mt-4 flex items-center gap-6">
              <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <Icon name="image" className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div>
                  <div className="flex items-center gap-4">
                    <label htmlFor="logo-upload" className="cursor-pointer bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-400 transition-colors text-sm">
                        <span>Upload New Logo</span>
                        <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileChange(e, onLogoChange, 'logo')} />
                    </label>
                    {confirmation === 'logo' && (
                        <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm transition-opacity duration-300 opacity-100">
                           <Icon name="checkmark" className="w-5 h-5"/>
                           <span>Updated!</span>
                        </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Recommended: PNG with transparent background, &lt; 2MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">QRIS Payment Code</h2>
            <p className="text-sm text-gray-500 mt-1">Upload your static QRIS code image to be displayed during payment.</p>
            <div className="mt-4 flex items-center gap-6">
              <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center">
                {qrisImageUrl ? (
                  <img src={qrisImageUrl} alt="QRIS Preview" className="w-full h-full object-cover" />
                ) : (
                   <Icon name="qris" className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div>
                  <div className="flex items-center gap-4">
                    <label htmlFor="qris-upload" className="cursor-pointer bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-400 transition-colors text-sm">
                        <span>Upload QRIS Image</span>
                        <input id="qris-upload" name="qris-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileChange(e, onQrisImageChange, 'qris')} />
                    </label>
                     {confirmation === 'qris' && (
                        <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm transition-opacity duration-300 opacity-100">
                           <Icon name="checkmark" className="w-5 h-5"/>
                           <span>Updated!</span>
                        </div>
                    )}
                  </div>
                   <p className="text-xs text-gray-400 mt-2">Recommended: Square image, clear and scannable, &lt; 2MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;
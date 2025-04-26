import React, { useState } from 'react';
import { useCurrency, Currency } from '../../context/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-2 py-1 px-3 rounded-lg bg-[#2a2a2a] hover:bg-[#333333] text-white text-sm transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium">
          {currency === 'USD' ? (
            <span className="flex items-center gap-1">
              <span className="text-[#0bff7e]">$</span> USD
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="text-[#0bff7e]">£</span> EGP
            </span>
          )}
        </span>
        <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg py-1 bg-[#232323] border border-[#333333] z-50 animate-fadeIn">
          <button
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${currency === 'USD' ? 'bg-[#2a2a2a] text-[#0bff7e]' : 'text-white hover:bg-[#2a2a2a]'}`}
            onClick={() => handleCurrencyChange('USD')}
          >
            <span className="text-[#0bff7e]">$</span>
            <span>US Dollar</span>
          </button>
          <button
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${currency === 'EGP' ? 'bg-[#2a2a2a] text-[#0bff7e]' : 'text-white hover:bg-[#2a2a2a]'}`}
            onClick={() => handleCurrencyChange('EGP')}
          >
            <span className="text-[#0bff7e]">£</span>
            <span>Egyptian Pound</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector; 
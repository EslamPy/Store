import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the currencies we support
export type Currency = 'USD' | 'EGP';

// Current EGP to USD exchange rate (1 USD = ~31 EGP as of 2023)
const EGP_RATE = 31;

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');

  // Convert price from USD to selected currency
  const convertPrice = (priceInUSD: number): number => {
    if (currency === 'USD') return priceInUSD;
    return priceInUSD * EGP_RATE;
  };

  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    if (currency === 'USD') {
      return `$${price.toFixed(2)}`;
    } else {
      return `${price.toFixed(2)} EGP`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}; 
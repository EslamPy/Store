import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ThemeType = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const defaultValue: ThemeContextType = {
  theme: 'dark',
  setTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultValue);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [storedTheme, setStoredTheme] = useLocalStorage<ThemeType>('theme', 'dark');
  const [theme, setTheme] = useState<ThemeType>(storedTheme);
  
  const handleSetTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };
  
  useEffect(() => {
    // Update localStorage when theme changes
    setStoredTheme(theme);
    
    // Apply theme to the body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#f0f0f0';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#212529';
    }
  }, [theme, setStoredTheme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

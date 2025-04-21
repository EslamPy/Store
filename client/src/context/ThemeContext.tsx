
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
    setStoredTheme(newTheme);
  };
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--background-color', '#121212');
      document.documentElement.style.setProperty('--text-color', '#f0f0f0');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--background-color', '#ffffff');
      document.documentElement.style.setProperty('--text-color', '#000000');
    }
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

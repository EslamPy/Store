
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button 
      className="text-white hover:text-[#0bff7e] transition-colors" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} text-xl`}></i>
    </button>
  );
};

export default ThemeToggle;

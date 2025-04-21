
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="text-gray-600 dark:text-gray-300 hover:text-[#0bff7e] transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <i className="fas fa-sun text-xl"></i>
      ) : (
        <i className="fas fa-moon text-xl"></i>
      )}
    </button>
  );
};

export default ThemeToggle;

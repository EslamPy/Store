import React, { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface CustomToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export const CustomToast: React.FC<CustomToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete before removal
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'bg-[#0bff7e]',
          icon: 'fas fa-check-circle',
          text: 'text-black'
        };
      case 'error':
        return {
          background: 'bg-[#ff3b5f]',
          icon: 'fas fa-exclamation-circle',
          text: 'text-white'
        };
      case 'warning':
        return {
          background: 'bg-[#ffb340]',
          icon: 'fas fa-exclamation-triangle',
          text: 'text-black'
        };
      case 'info':
      default:
        return {
          background: 'bg-[#00b3ff]',
          icon: 'fas fa-info-circle',
          text: 'text-white'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className={`fixed top-6 right-6 z-50 flex items-center px-4 py-3 rounded-md shadow-lg transition-all duration-300 ${styles.background} ${styles.text} ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-x-full'}`}
      role="alert"
    >
      <div className="flex items-center">
        <i className={`${styles.icon} text-xl mr-3`}></i>
        <p className="font-medium">{message}</p>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-6 text-lg focus:outline-none hover:opacity-80"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}; 
import { useEffect, useRef } from 'react';
import { useCart } from '../hooks/useCart';
import { gsap } from 'gsap';

const CartNotification: React.FC = () => {
  const { cartNotification } = useCart();
  const notificationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (notificationRef.current) {
      if (cartNotification.show) {
        // Animate notification in
        gsap.fromTo(
          notificationRef.current,
          { y: -20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.3, 
            ease: 'power2.out',
            clearProps: 'transform'
          }
        );
      } else {
        // Animate notification out
        gsap.to(notificationRef.current, { 
          y: -20, 
          opacity: 0, 
          duration: 0.3, 
          ease: 'power2.in'
        });
      }
    }
  }, [cartNotification.show]);
  
  if (!cartNotification.show) {
    return null;
  }
  
  // Define background and icon based on type
  const getTypeStyles = () => {
    switch (cartNotification.type) {
      case 'success':
        return {
          bg: 'bg-[#0bff7e]',
          icon: 'fa-check-circle',
          textColor: 'text-black'
        };
      case 'error':
        return {
          bg: 'bg-[#ff3c4e]',
          icon: 'fa-times-circle',
          textColor: 'text-white'
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#00b3ff]',
          icon: 'fa-info-circle',
          textColor: 'text-white'
        };
    }
  };
  
  const { bg, icon, textColor } = getTypeStyles();
  
  return (
    <div 
      ref={notificationRef}
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 ${bg} rounded-lg shadow-lg px-4 py-3 flex items-center space-x-3 max-w-md transition-all`}
      style={{
        boxShadow: cartNotification.type === 'success' 
          ? '0 0 20px rgba(11, 255, 126, 0.5)' 
          : cartNotification.type === 'error'
            ? '0 0 20px rgba(255, 60, 78, 0.5)'
            : '0 0 20px rgba(0, 179, 255, 0.5)'
      }}
    >
      <i className={`fas ${icon} text-xl ${textColor}`}></i>
      <span className={`font-medium ${textColor}`}>{cartNotification.message}</span>
    </div>
  );
};

export default CartNotification;
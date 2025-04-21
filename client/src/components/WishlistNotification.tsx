import { useEffect, useRef } from 'react';
import { useWishlist } from '../hooks/useWishlist';
import { gsap } from 'gsap';

const WishlistNotification: React.FC = () => {
  const { wishlistNotification } = useWishlist();
  const notificationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (notificationRef.current) {
      if (wishlistNotification.show) {
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
  }, [wishlistNotification.show]);
  
  if (!wishlistNotification.show) {
    return null;
  }
  
  // Define background and icon based on type
  const getTypeStyles = () => {
    switch (wishlistNotification.type) {
      case 'success':
        return {
          bg: 'bg-[#ff6b9d]', // Pink for wishlist success
          icon: 'fa-heart',
          textColor: 'text-white'
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
          bg: 'bg-[#936fff]', // Purple for wishlist info
          icon: 'fa-info-circle',
          textColor: 'text-white'
        };
    }
  };
  
  const { bg, icon, textColor } = getTypeStyles();
  
  return (
    <div 
      ref={notificationRef}
      className={`fixed top-20 right-4 z-50 ${bg} rounded-lg shadow-lg px-4 py-3 flex items-center space-x-3 max-w-md transition-all`}
      style={{
        boxShadow: wishlistNotification.type === 'success' 
          ? '0 0 20px rgba(255, 107, 157, 0.5)' 
          : wishlistNotification.type === 'error'
            ? '0 0 20px rgba(255, 60, 78, 0.5)'
            : '0 0 20px rgba(147, 111, 255, 0.5)'
      }}
    >
      <i className={`fas ${icon} text-xl ${textColor}`}></i>
      <span className={`font-medium ${textColor}`}>{wishlistNotification.message}</span>
    </div>
  );
};

export default WishlistNotification;
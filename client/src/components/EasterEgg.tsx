import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const EasterEgg: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const easterEggRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Setup the secret condition to show easter egg
    // In this case, we'll attach it to clicking the Memory category
    const memoryCategory = document.querySelector('.category-card:nth-child(3)');
    
    if (memoryCategory) {
      let clickCount = 0;
      
      const handleClick = () => {
        clickCount++;
        
        if (clickCount === 3) {
          setIsVisible(true);
          
          // Animate the easter egg appearance
          if (easterEggRef.current) {
            gsap.fromTo(
              easterEggRef.current,
              { scale: 0.5, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
          }
        }
      };
      
      memoryCategory.addEventListener('click', handleClick);
      
      return () => {
        memoryCategory.removeEventListener('click', handleClick);
      };
    }
  }, []);
  
  const handleClose = () => {
    if (easterEggRef.current) {
      gsap.to(easterEggRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        onComplete: () => setIsVisible(false)
      });
    } else {
      setIsVisible(false);
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={easterEggRef}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] p-6 rounded-lg z-50 cyberpunk-border glow-accent"
      style={{ maxWidth: '320px' }}
    >
      <h3 className="text-xl font-orbitron font-bold text-white mb-4">Secret Discount Found! 🎉</h3>
      <p className="text-gray-300 mb-4">
        You've discovered a hidden easter egg! Use this code at checkout:
      </p>
      <div className="bg-[#121212] p-3 rounded font-mono text-[#9d00ff] text-center text-xl mb-4">
        MEDTECH25
      </div>
      <p className="text-gray-400 text-sm mb-4">
        This code gives you 25% off your next purchase!
      </p>
      <button 
        className="w-full py-2 bg-[#9d00ff] text-white font-bold rounded-md"
        onClick={handleClose}
      >
        Awesome, thanks!
      </button>
    </div>
  );
};

export default EasterEgg;

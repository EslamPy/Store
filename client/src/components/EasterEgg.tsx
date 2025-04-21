import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const EasterEgg: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const easterEggRef = useRef<HTMLDivElement>(null);
  const [konami, setKonami] = useState<string[]>([]);
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    // Setup the secret condition to show easter egg (click method)
    const memoryCategory = document.querySelector('.category-card:nth-child(3)');
    if (memoryCategory) {
      let clickCount = 0;
      const handleClick = () => {
        clickCount++;
        if (clickCount === 3) {
          setIsVisible(true);
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

    // Konami Code Easter Egg
    const handleKeyDown = (event: KeyboardEvent) => {
      const newKonami = [...konami, event.key];
      if (newKonami.length > konamiCode.length) {
        newKonami.shift();
      }
      setKonami(newKonami);

      if (newKonami.join(',') === konamiCode.join(',')) {
        triggerEasterEgg();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konami]);

  const triggerEasterEgg = () => {
    // Create floating tech parts
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // Create 20 floating elements
    for (let i = 0; i < 20; i++) {
      const element = document.createElement('div');
      element.textContent = '🖥️';
      element.style.position = 'absolute';
      element.style.fontSize = '2rem';
      element.style.left = `${Math.random() * 100}vw`;
      element.style.top = '100vh';
      container.appendChild(element);

      // Animate each element
      gsap.to(element, {
        y: -window.innerHeight - 100,
        x: `random(-100, 100)`,
        rotation: `random(-180, 180)`,
        duration: `random(3, 6)`,
        ease: 'power1.out',
        onComplete: () => {
          container.removeChild(element);
          if (container.children.length === 0) {
            document.body.removeChild(container);
          }
        }
      });
    }
    setIsVisible(true); // Show the original Easter egg after Konami code
    if (easterEggRef.current) {
      gsap.fromTo(
        easterEggRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  };


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
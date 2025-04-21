import { gsap } from 'gsap';

// Product card hover animation
export const animateProductCardHover = (card: HTMLElement, entering: boolean) => {
  if (entering) {
    gsap.to(card, {
      y: -10,
      boxShadow: '0 10px 25px -5px rgba(11, 255, 126, 0.2)',
      duration: 0.3
    });
  } else {
    gsap.to(card, {
      y: 0,
      boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
      duration: 0.3
    });
  }
};

// Add to cart animation
export const animateAddToCart = (
  imageElement: HTMLImageElement, 
  cartElement: HTMLElement, 
  onComplete: () => void
) => {
  const imageRect = imageElement.getBoundingClientRect();
  const cartRect = cartElement.getBoundingClientRect();
  
  // Create a clone of the image
  const clone = imageElement.cloneNode(true) as HTMLImageElement;
  
  // Style the clone
  clone.style.position = 'fixed';
  clone.style.top = `${imageRect.top}px`;
  clone.style.left = `${imageRect.left}px`;
  clone.style.width = `${imageRect.width}px`;
  clone.style.height = `${imageRect.height}px`;
  clone.style.objectFit = 'cover';
  clone.style.zIndex = '1000';
  clone.style.transition = 'all 0.7s ease-in-out';
  clone.style.borderRadius = '8px';
  
  // Add the clone to the body
  document.body.appendChild(clone);
  
  // Animate the clone to the cart
  setTimeout(() => {
    clone.style.top = `${cartRect.top}px`;
    clone.style.left = `${cartRect.left}px`;
    clone.style.width = '20px';
    clone.style.height = '20px';
    clone.style.opacity = '0.5';
    
    // Remove the clone after animation completes
    setTimeout(() => {
      document.body.removeChild(clone);
      onComplete();
    }, 700);
  }, 10);
};

// Badge bounce animation
export const animateBadgeBounce = (badge: HTMLElement) => {
  gsap.fromTo(
    badge, 
    { scale: 1 },
    { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1 }
  );
};

// Modal animation (for opening)
export const animateModalOpen = (overlay: HTMLElement, content: HTMLElement) => {
  gsap.fromTo(
    overlay,
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
  
  gsap.fromTo(
    content,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
  );
};

// Modal animation (for closing)
export const animateModalClose = (overlay: HTMLElement, content: HTMLElement, onComplete: () => void) => {
  gsap.to(overlay, {
    opacity: 0,
    duration: 0.3
  });
  
  gsap.to(content, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    onComplete
  });
};

// Limited badge pulse animation
export const animateLimitedBadge = (badge: HTMLElement) => {
  gsap.to(badge, {
    opacity: 0.6,
    duration: 0.8,
    yoyo: true,
    repeat: -1
  });
};

// Countdown timer animation
export const animateCountdownChange = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { scale: 1.1, color: '#0bff7e' },
    { scale: 1, color: 'white', duration: 0.5 }
  );
};

// Category card hover animation
export const animateCategoryCardHover = (image: HTMLImageElement, entering: boolean) => {
  if (entering) {
    gsap.to(image, {
      scale: 1.1,
      duration: 0.7,
      ease: 'power1.out'
    });
  } else {
    gsap.to(image, {
      scale: 1,
      duration: 0.7,
      ease: 'power1.out'
    });
  }
};

// Button hover effect animation
export const animateButtonHover = (button: HTMLElement, entering: boolean) => {
  if (entering) {
    gsap.to(button, {
      y: -3,
      duration: 0.3,
      ease: 'power2.out'
    });
  } else {
    gsap.to(button, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
};

// Easter egg animation
export const animateEasterEggReveal = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
  );
};

// Easter egg hide animation
export const animateEasterEggHide = (element: HTMLElement, onComplete: () => void) => {
  gsap.to(element, {
    scale: 0.5,
    opacity: 0,
    duration: 0.3,
    onComplete
  });
};

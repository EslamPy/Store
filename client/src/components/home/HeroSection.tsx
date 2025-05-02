import { Link } from 'wouter';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface SlideContent {
  id: number;
  title: string;
  highlight: string;
  description: string;
  image: string;
  color: string;
  productImage: string;
}

const HeroSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const slides: SlideContent[] = [
    {
      id: 1,
      title: "Elevate Your",
      highlight: "Computing Experience",
      description: "Premium PC components with cutting-edge technology for gamers, creators, and professionals.",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1920&q=80",
      color: "#0bff7e",
      productImage: "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "Unleash Your",
      highlight: "Gaming Potential",
      description: "High-performance GPUs and CPUs designed for extreme gaming and rendering speeds.",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1920&q=80",
      color: "#00b3ff",
      productImage: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "Build The",
      highlight: "Perfect Workstation",
      description: "Professional-grade components for content creators and developers who demand reliability.",
      image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1920&q=80",
      color: "#9d00ff",
      productImage: "https://images.unsplash.com/photo-1637360472987-676f4f184085?auto=format&fit=crop&w=500&q=80"
    }
  ];
  
  // Auto-advance the slider
  useEffect(() => {
    const startTimeout = () => {
      timeoutRef.current = setTimeout(() => {
        if (!isAnimating) {
          goToSlide((activeSlide + 1) % slides.length);
        }
      }, 6000);
    };
    
    startTimeout();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeSlide, isAnimating, slides.length]);
  
  // Animation setup for initial slide
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    // Set initial states for all slides
    slides.forEach((_, index) => {
      const slideEl = slider.querySelector(`.slide-${index}`);
      if (!slideEl) return;
      
      if (index === activeSlide) {
        gsap.set(slideEl, { opacity: 1, zIndex: 10 });
      } else {
        gsap.set(slideEl, { opacity: 0, zIndex: 0 });
      }
    });
    
    // Animate active slide content on mount
    const animateInitialSlide = () => {
      const activeSlideEl = slider.querySelector(`.slide-${activeSlide}`);
      if (!activeSlideEl) return;
      
      // Animate the content elements
      gsap.fromTo(
        activeSlideEl.querySelectorAll('.slide-content > *'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }
      );
      
      // Animate the product image
      gsap.fromTo(
        activeSlideEl.querySelector('.product-image'),
        { x: 100, opacity: 0, rotate: 5 },
        { x: 0, opacity: 1, rotate: 0, duration: 1, ease: "power2.out" }
      );
      
      // Update progress bar
      gsap.to(slider.querySelector('.progress-bar'), {
        scaleX: (activeSlide + 1) / slides.length,
        duration: 0.5,
        ease: "power1.inOut"
      });
    };
    
    // Slight delay to ensure DOM is ready
    setTimeout(animateInitialSlide, 100);
  }, []); // Only run on mount
  
  // Update progress bar when active slide changes
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    // Update progress bar
    gsap.to(slider.querySelector('.progress-bar'), {
      scaleX: (activeSlide + 1) / slides.length,
      duration: 0.5,
      ease: "power1.inOut"
    });
  }, [activeSlide, slides.length]);
  
  const goToSlide = (index: number) => {
    if (isAnimating || index === activeSlide) return;
    
    setIsAnimating(true);
    
    const slider = sliderRef.current;
    if (!slider) return;
    
    const currentSlideEl = slider.querySelector(`.slide-${activeSlide}`);
    const nextSlideEl = slider.querySelector(`.slide-${index}`);
    
    if (currentSlideEl && nextSlideEl) {
      // Make next slide visible but behind current
      gsap.set(nextSlideEl, { opacity: 1, zIndex: 5 });
      gsap.set(currentSlideEl, { zIndex: 10 });
      
      // Fade out current slide content
      gsap.to(currentSlideEl.querySelectorAll('.slide-content > *'), {
        y: -30,
        opacity: 0,
        stagger: 0.05,
        duration: 0.4
      });
      
      // Fade out current product image
      gsap.to(currentSlideEl.querySelector('.product-image'), {
        x: -50,
        opacity: 0,
        duration: 0.5
      });
      
      // Animate the overlay for current slide
      gsap.to(currentSlideEl.querySelector('.slide-overlay'), {
        opacity: 0,
        duration: 0.5
      });
      
      // Crossfade to next slide
      gsap.to(currentSlideEl, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          // Set z-index after animation
          gsap.set(currentSlideEl, { zIndex: 0 });
          gsap.set(nextSlideEl, { zIndex: 10 });
        }
      });
      
      // Animate the next slide's overlay
      gsap.fromTo(
        nextSlideEl.querySelector('.slide-overlay'),
        { opacity: 0.3 },
        { opacity: 1, duration: 0.8, ease: "power2.inOut" }
      );
      
      // Animate the next slide's content
      gsap.fromTo(
        nextSlideEl.querySelectorAll('.slide-content > *'),
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3
        }
      );
      
      // Animate the next slide's product image
      gsap.fromTo(
        nextSlideEl.querySelector('.product-image'),
        { x: 100, opacity: 0, rotate: 5 },
        { 
          x: 0, 
          opacity: 1, 
          rotate: 0,
          duration: 1,
          ease: "power2.out",
          delay: 0.4
        }
      );
      
      // After animation completes
      setTimeout(() => {
        setActiveSlide(index);
        setIsAnimating(false);
      }, 800);
    }
  };

  return (
    <section ref={sliderRef} className="relative h-[90vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`slide-${index} absolute inset-0 z-0`}
          style={{ opacity: index === activeSlide ? 1 : 0 }}
        >
          {/* Slide Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[#121212] bg-opacity-70 slide-overlay"></div>
            <img 
              src={slide.image}
              alt={slide.title} 
              className="w-full h-full object-cover"
            />
            
            {/* Floating geometric shapes */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full border border-[#333] opacity-20"></div>
              <div className="absolute bottom-20 left-40 w-32 h-32 rounded-full border border-[#333] opacity-20"></div>
              <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full border border-[#333] opacity-20"></div>
              
              {/* Animated grid lines */}
              <div className="absolute inset-0 grid-background opacity-5"></div>
            </div>
          </div>
          
          {/* Slide Content */}
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl slide-content">
              <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 text-white">
                {slide.title} <br />
                <span style={{ color: slide.color }}>{slide.highlight}</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200 font-space opacity-90">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/products">
                  <div 
                    className="btn-hover-effect px-8 py-3 text-black font-bold rounded-md font-poppins text-center cursor-pointer shadow-lg"
                    style={{ backgroundColor: slide.color, boxShadow: `0 0 20px ${slide.color}40` }}
                  >
                    Shop Now
                  </div>
                </Link>
                <Link href="/products?filter=custom">
                  <div 
                    className="btn-hover-effect px-8 py-3 border text-white font-bold rounded-md hover:text-black transition-colors font-poppins text-center cursor-pointer"
                    style={{ borderColor: slide.color }}
                  >
                    Build Your PC
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Floating Product */}
          <div className="absolute bottom-10 lg:bottom-20 right-0 lg:right-20 w-48 lg:w-64 h-48 lg:h-64 product-image hidden md:block">
            {/* Enhanced product glow effect with multiple layers */}
            <div className="absolute inset-0 rounded-full opacity-60" 
                 style={{ 
                   background: `radial-gradient(circle at center, ${slide.color}50 0%, transparent 70%)`,
                   boxShadow: `0 0 30px ${slide.color}40, inset 0 0 20px ${slide.color}30`
                 }}>
            </div>
            <div className="absolute -inset-3 rounded-full opacity-30" 
                 style={{ 
                   border: `1px solid ${slide.color}`,
                   boxShadow: `0 0 15px ${slide.color}30, inset 0 0 10px ${slide.color}20`
                 }}>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={slide.productImage}
                alt="Featured Product" 
                className="w-full h-full object-contain p-3"
                onError={(e) => {
                  // Fallback image if the main one fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80";
                }}
              />
            </div>
          </div>
        </div>
      ))}
      
      {/* Slider Controls */}
      <div className="absolute bottom-10 left-0 right-0 z-20 container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-3 rounded-full transition-all duration-300 overflow-hidden ${
                  index === activeSlide 
                    ? 'w-8 shadow-md' 
                    : 'w-3 bg-white bg-opacity-30 hover:bg-opacity-50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <span 
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    background: index === activeSlide 
                      ? `linear-gradient(to right, white, ${slide.color})` 
                      : ''
                  }}
                ></span>
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => goToSlide(activeSlide === 0 ? slides.length - 1 : activeSlide - 1)}
              className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all border border-white border-opacity-20"
              aria-label="Previous slide"
            >
              <i className="fas fa-chevron-left text-white"></i>
            </button>
            <button 
              onClick={() => goToSlide((activeSlide + 1) % slides.length)}
              className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all border border-white border-opacity-20"
              aria-label="Next slide"
            >
              <i className="fas fa-chevron-right text-white"></i>
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 h-0.5 bg-white bg-opacity-10 relative overflow-hidden rounded-full">
          <div 
            className="progress-bar h-full origin-left scale-x-0 rounded-full"
            style={{ 
              background: `linear-gradient(to right, ${slides[activeSlide].color}, white)` 
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { useEffect } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found | MedTech';
    
    // Animation for the 404 text
    gsap.fromTo(
      ".error-404",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" }
    );
    
    // Animation for the glitch effect
    const glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    glitchTimeline.to(".error-404", {
      skewX: 20,
      duration: 0.1,
      ease: "power1.inOut"
    });
    glitchTimeline.to(".error-404", {
      skewX: 0,
      duration: 0.1,
      ease: "power1.inOut"
    });
    glitchTimeline.to(".error-404", {
      opacity: 0.8,
      duration: 0.1
    });
    glitchTimeline.to(".error-404", {
      opacity: 1,
      duration: 0.1
    });
    
    // Animation for the text
    gsap.fromTo(
      ".not-found-text",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.5 }
    );
    
    // Animation for the button
    gsap.fromTo(
      ".home-button",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, delay: 1, ease: "back.out(1.7)" }
    );
    
    // Animation for the grid lines
    gsap.fromTo(
      ".grid-line",
      { width: 0 },
      { width: "100%", duration: 1.5, stagger: 0.1, ease: "power1.inOut" }
    );
    
    return () => {
      glitchTimeline.kill();
    };
  }, []);
  
  return (
    <div className="min-h-screen grid-background bg-[#121212] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Grid effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, index) => (
          <div 
            key={`h-${index}`}
            className="grid-line absolute h-px bg-[#0bff7e] opacity-20 left-0 right-0"
            style={{ top: `${(index + 1) * 10}%` }}
          ></div>
        ))}
        {[...Array(10)].map((_, index) => (
          <div 
            key={`v-${index}`}
            className="grid-line absolute w-px bg-[#0bff7e] opacity-20 top-0 bottom-0"
            style={{ left: `${(index + 1) * 10}%` }}
          ></div>
        ))}
      </div>
      
      {/* Glowing orbs for decoration */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#0bff7e] bg-opacity-10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#00b3ff] bg-opacity-10 blur-3xl"></div>
      
      <div className="error-404 text-[15rem] md:text-[20rem] font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#0bff7e] to-[#00b3ff] leading-none select-none cyberpunk-border relative z-10">
        404
      </div>
      
      <div className="not-found-text text-center mb-12 relative z-10">
        <h1 className="text-4xl font-orbitron font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          The circuit is broken. The page you are looking for might have been removed or is temporarily unavailable.
        </p>
      </div>
      
      <Link href="/">
        <a className="home-button px-8 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary font-poppins inline-block transition-all duration-300 hover:scale-105 relative z-10">
          Return to Homepage
        </a>
      </Link>
      
      {/* Futuristic CPU-like pattern */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-[800px] h-[800px] border-2 border-[#00b3ff] rounded-full"></div>
        <div className="absolute w-[600px] h-[600px] border-2 border-[#0bff7e] rounded-full"></div>
        <div className="absolute w-[400px] h-[400px] border-2 border-[#9d00ff] rounded-full"></div>
        <div className="absolute w-[200px] h-[200px] border-2 border-white rounded-full"></div>
        
        {/* Circuit lines */}
        {[...Array(8)].map((_, index) => (
          <div 
            key={index}
            className="absolute bg-[#0bff7e] h-0.5"
            style={{ 
              width: '400px', 
              transform: `rotate(${index * 45}deg)`, 
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default NotFoundPage;


import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Partners: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sliderRef.current) {
      gsap.to('.partner-logo', {
        xPercent: -100,
        ease: 'none',
        duration: 20,
        repeat: -1,
      });
    }
  }, []);

  const partners = [
    { name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/1200px-Nvidia_logo.svg.png' },
    { name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Intel_logo_%282006%29.svg/1200px-Intel_logo_%282006%29.svg.png' },
    { name: 'AMD', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/1200px-AMD_Logo.svg.png' },
    { name: 'ASUS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/1200px-ASUS_Logo.svg.png' },
    { name: 'MSI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/MSI_logo.svg/1200px-MSI_logo.svg.png' },
  ];

  return (
    <section className="partners-section py-16 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-12 text-center">
          Our Trusted <span className="text-[#0bff7e]">Partners</span>
        </h2>
        
        <div 
          ref={sliderRef}
          className="overflow-hidden whitespace-nowrap"
        >
          <div className="inline-flex">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="partner-logo mx-12 inline-block opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-16 w-auto filter invert"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;

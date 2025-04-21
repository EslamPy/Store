
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const partners = [
  { id: 1, name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Intel_logo_%282006%29.svg/200px-Intel_logo_%282006%29.svg.png' },
  { id: 2, name: 'AMD', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_logo.svg/200px-AMD_logo.svg.png' },
  { id: 3, name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/200px-Nvidia_logo.svg.png' }
];

const Partners: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current.children, {
        xPercent: -100 * (partners.length - 1),
        ease: "none",
        duration: 10,
        repeat: -1,
        yoyo: true
      });
    }
  }, []);

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-orbitron font-bold mb-12 text-center">
          Our Partners
        </h2>
        <div className="relative w-full">
          <div ref={sliderRef} className="flex items-center justify-center space-x-12">
            {partners.map((partner) => (
              <div key={partner.id} className="flex-shrink-0">
                <img src={partner.logo} alt={partner.name} className="h-16 w-auto filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;

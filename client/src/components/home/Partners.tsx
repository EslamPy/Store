import { useState, useEffect, useRef } from 'react';

// Mock partners data
const partners = [
  {
    id: 1,
    name: "NVIDIA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/1280px-Nvidia_logo.svg.png",
    website: "https://www.nvidia.com"
  },
  {
    id: 2,
    name: "AMD",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/1280px-AMD_Logo.svg.png",
    website: "https://www.amd.com"
  },
  {
    id: 3,
    name: "Intel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/1005px-Intel_logo_%282006-2020%29.svg.png",
    website: "https://www.intel.com"
  },
  {
    id: 4,
    name: "Corsair",
    logo: "https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_K.png",
    website: "https://www.corsair.com"
  },
  {
    id: 5,
    name: "ASUS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/2560px-ASUS_Logo.svg.png",
    website: "https://www.asus.com"
  },
  {
    id: 6,
    name: "MSI",
    logo: "https://1000logos.net/wp-content/uploads/2018/10/MSI-Logo.png",
    website: "https://www.msi.com"
  },
  {
    id: 7,
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png",
    website: "https://www.samsung.com"
  },
  {
    id: 8,
    name: "Western Digital",
    logo: "https://logos-world.net/wp-content/uploads/2023/01/Western-Digital-Logo.png",
    website: "https://www.westerndigital.com"
  }
];

const Partners: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;
    
    let scrollAmount = 0;
    const speed = isHovered ? 0 : 0.5; // Stop scrolling when hovered
    
    const scroll = () => {
      if (!scrollContainer) return;
      
      scrollAmount += speed;
      scrollContainer.scrollLeft = scrollAmount;
      
      // Reset scroll position when we reach the end
      if (scrollContainer.scrollLeft >= 
          (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2) {
        scrollAmount = 0;
        scrollContainer.scrollLeft = 0;
      }
      
      requestAnimationFrame(scroll);
    };
    
    const animation = requestAnimationFrame(scroll);
    
    return () => {
      cancelAnimationFrame(animation);
    };
  }, [isHovered]);

  return (
    <section className="py-16 bg-[#121212]" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-12 text-center">
          Our <span className="text-[#0bff7e]">Partners</span>
        </h2>
        
        <div 
          className="relative overflow-hidden py-8 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-[#121212] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-[#121212] after:to-transparent"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            ref={containerRef}
            className="flex gap-12 py-4 items-center overflow-x-hidden"
          >
            {/* Double the partners to create seamless loop */}
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={`${partner.id}-${index}`} 
                className="flex-shrink-0 bg-[#1e1e1e] rounded-lg p-6 min-w-[200px] h-24 flex items-center justify-center mx-4 hover:bg-[#2d2d2d] transition-colors duration-300 border border-[#2d2d2d]"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-12 max-w-full filter invert grayscale-[60%] hover:grayscale-0 transition-all duration-300"
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

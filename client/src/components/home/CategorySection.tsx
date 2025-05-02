import { Link } from 'wouter';
import { categories } from '../../data/categories';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface CategoryCardProps {
  category: typeof categories[0];
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element
      
      // Update CSS variables for the gradient position
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    };
    
    const timeline = gsap.timeline({ paused: true });
    
    timeline
      .to(card.querySelector('.card-bg'), {
        scale: 1.1,
        duration: 0.8,
        ease: 'power2.out'
      }, 0)
      .to(card.querySelector('.category-icon'), {
        y: -15,
        scale: 1.2,
        duration: 0.6,
        ease: 'back.out(1.5)'
      }, 0)
      .to(card.querySelector('.category-details'), {
        y: -10,
        duration: 0.5,
        ease: 'power1.out'
      }, 0)
      .to(card.querySelector('.view-products'), {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power1.out'
      }, 0.2)
      .to(card.querySelector('.pattern-overlay'), {
        opacity: 0.9,
        duration: 0.6,
      }, 0);
    
    if (isHovered) {
      timeline.play();
    } else {
      timeline.reverse();
    }
    
    card.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      timeline.kill();
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);
  
  return (
    <div 
      ref={cardRef}
      className="category-card relative rounded-xl overflow-hidden cursor-pointer group shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-aos="fade-up" 
      data-aos-delay={index * 100}
    >
      <Link href={`/products?category=${category.slug}`}>
        <div className="absolute inset-0 cyberpunk-border opacity-70 z-10"></div>
        <div className="card-bg absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#19191980] via-[#12121280] to-[#0b0b0b80] z-10 transition-opacity duration-500"></div>
          <img 
            src={category.image}
            alt={category.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="pattern-overlay absolute inset-0 bg-[url('/src/assets/grid-pattern.svg')] bg-opacity-30 mix-blend-overlay z-20 opacity-50 transition-opacity duration-500"></div>
        
        <div className="relative h-64 z-20 p-6 flex flex-col justify-between">
          <div className="category-icon transform transition-all duration-700 w-14 h-14 rounded-full bg-[#2a2a2a90] backdrop-blur-sm flex items-center justify-center">
            <i className={`fas fa-${category.icon} text-[#0bff7e] text-xl`}></i>
          </div>
          
          <div className="category-details transform transition-all duration-500">
            <div className="mb-1">
              <h3 className="text-xl font-orbitron font-bold text-white inline-block relative">
                {category.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] group-hover:w-full transition-all duration-500"></span>
              </h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">{category.description}</p>
            <span className="view-products opacity-0 transform translate-y-4 transition-all inline-block px-3 py-1.5 bg-[#0bff7e15] text-[#0bff7e] text-xs font-bold rounded-full">
              View Products <i className="fas fa-arrow-right ml-1"></i>
            </span>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1 z-30">
          <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-[#0bff7e] via-[#00b3ff] to-[#9d00ff] transition-all duration-700 ease-out"></div>
        </div>
      </Link>
    </div>
  );
};

const CategorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    
    if (section && title) {
      gsap.fromTo(title.querySelectorAll('span'), 
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%"
          }
        }
      );
    }
  }, []);
  
  // Staggered appearance animation for categories
  useEffect(() => {
    const categoryCards = document.querySelectorAll('.category-card');
    
    gsap.fromTo(categoryCards, 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.3
      }
    );
  }, []);
  
  return (
    <section ref={sectionRef} className="py-20 bg-[#111111] relative" data-aos="fade-up">
      <div className="absolute inset-0 bg-[url('/src/assets/grid-pattern.svg')] opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <div className="inline-block">
            <h2 ref={titleRef} className="text-4xl font-orbitron font-bold mb-4 overflow-hidden">
              <span className="inline-block">Shop </span>
              <span className="inline-block">By </span>
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0bff7e] to-[#00b3ff]">Category</span>
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-[#0bff7e] via-[#00b3ff] to-[#9d00ff] mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">Explore our high-quality tech products by category. Each carefully curated for the ultimate performance.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
        
        <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="300">
          <Link href="/products" className="inline-block px-8 py-3 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold rounded-full transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#0bff7e]/20">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

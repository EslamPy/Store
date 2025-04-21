import { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import LimitedOfferSection from '../components/home/LimitedOfferSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import TechSpecs from '../components/home/TechSpecs';
import Newsletter from '../components/home/Newsletter';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'MedTech - Futuristic PC Parts Store';
    
    // Reinitialize AOS on page load
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, []);
  
  return (
    <>
      <HeroSection />
      <CategorySection />
      <LimitedOfferSection />
      <FeaturedProducts />
      <TechSpecs />
      <Newsletter />
    </>
  );
};

export default HomePage;

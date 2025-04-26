import { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import LimitedOfferSection from '../components/home/LimitedOfferSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import TechUpdates from '../components/home/TechUpdates';
import Reviews from '../components/home/Reviews';
import Partners from '../components/home/Partners';
import TechSpecs from '../components/home/TechSpecs';
import Newsletter from '../components/home/Newsletter';
import ContactForm from '../components/home/ContactForm';

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
      <TechUpdates />
      <Reviews />
      <Partners />
      <TechSpecs />
      <Newsletter />
      <ContactForm />
    </>
  );
};

export default HomePage;

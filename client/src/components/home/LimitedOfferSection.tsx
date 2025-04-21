import { useState, useEffect, useRef } from 'react';
import { getDiscountedProducts } from '../../data/products';
import { useCart } from '../../hooks/useCart';

const LimitedOfferSection: React.FC = () => {
  const [limitedOffers, setLimitedOffers] = useState<any[]>([]);
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const { addToCart } = useCart();
  const swiperRef = useRef<any>(null);
  
  useEffect(() => {
    setLimitedOffers(getDiscountedProducts());
    
    // Swiper initialization has been temporarily disabled
    // until the Swiper library is properly imported
    
    return () => {
      // Cleanup
    };
  }, []);
  
  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset countdown when it reaches 0
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatTime = (time: number) => time.toString().padStart(2, '0');
  
  return (
    <section className="py-16 bg-[#1e1e1e] relative overflow-hidden" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-orbitron font-bold text-white">Limited <span className="text-[#9d00ff]">Offers</span></h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-poppins text-gray-300">Ends in:</span>
            <div className="bg-[#121212] rounded-md px-3 py-1 font-orbitron text-white">
              {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}
            </div>
          </div>
        </div>
        
        {/* Limited Offers Grid (Swiper is temporarily disabled) */}
        <div className="grid grid-cols-1 gap-6">
          {limitedOffers.slice(0, 3).map(product => (
            <div key={product.id}>
              <div className="relative bg-[#2d2d2d] rounded-lg overflow-hidden cyberpunk-border group" data-aos="fade-up">
                <div className="absolute top-3 right-3 z-10">
                  <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase animate-pulse limited-badge">
                    Limited
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-2/5 relative group aspect-square">
                      <img 
                        src={product.image}
                        alt={product.name} 
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="w-full md:w-3/5">
                      <h3 className="text-2xl font-orbitron font-bold text-white mb-2">{product.name}</h3>
                      <div className="flex items-center mb-3">
                        <div className="text-yellow-400 flex">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`fas ${i < Math.floor(product.rating) ? 'fa-star' : i < product.rating ? 'fa-star-half-alt' : 'far fa-star'}`}
                            ></i>
                          ))}
                        </div>
                        <span className="text-sm text-gray-400 ml-2">({product.reviews} reviews)</span>
                      </div>
                      
                      <p className="text-gray-300 mb-6">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center space-x-3 mb-6">
                        <span className="text-3xl font-bold text-white">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <>
                            <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                            <span className="text-green-500 text-sm font-bold">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button 
                          className="btn-hover-effect px-6 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary font-poppins flex items-center space-x-2"
                          onClick={() => addToCart(product)}
                        >
                          <i className="fas fa-shopping-cart"></i>
                          <span>Add to Cart</span>
                        </button>
                        <button className="btn-hover-effect p-3 border border-[#00b3ff] text-white rounded-md hover:bg-[#00b3ff] hover:text-black transition-colors">
                          <i className="fas fa-heart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#9d00ff] bg-opacity-10 blur-3xl"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#0bff7e] bg-opacity-10 blur-3xl"></div>
    </section>
  );
};

export default LimitedOfferSection;

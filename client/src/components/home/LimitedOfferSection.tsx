import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { getDiscountedProducts } from '../../data/products';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const LimitedOfferSection: React.FC = () => {
  const [limitedOffers, setLimitedOffers] = useState<any[]>([]);
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [activeTab, setActiveTab] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const timerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setLimitedOffers(getDiscountedProducts());
    
    // Add glow animation to timer
    if (timerRef.current) {
      timerRef.current.classList.add('pulse-glow');
    }
    
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

  const handleAddToWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const formatTime = (time: number) => time.toString().padStart(2, '0');
  
  return (
    <section className="py-20 bg-[#1a1a1a] relative overflow-hidden" data-aos="fade-up">
      {/* Futuristic technology-inspired background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-circuit-pattern"></div>
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-[#9d00ff] to-[#ff00c8] opacity-20 blur-3xl"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-[#0bff7e] to-[#00b3ff] opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center" data-aos="fade-right">
            <div className="h-12 w-2 bg-gradient-to-b from-[#9d00ff] to-[#ff00c8] mr-4 rounded-full"></div>
            <h2 className="text-4xl font-orbitron font-bold text-white">Limited <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d00ff] to-[#ff00c8]">Offers</span></h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6" data-aos="fade-left">
            <span className="text-base font-poppins text-gray-300 uppercase tracking-wider">Flash Sale Ends In:</span>
            <div 
              ref={timerRef}
              className="flex space-x-2 countdown-timer"
            >
              <div className="flex flex-col items-center">
                <div className="bg-[#121212] border border-[#333] rounded-lg px-4 py-2 font-orbitron text-2xl text-white">
                  {formatTime(countdown.hours)}
                </div>
                <span className="text-xs text-gray-400 mt-1">HOURS</span>
              </div>
              <div className="text-2xl text-[#9d00ff] font-bold">:</div>
              <div className="flex flex-col items-center">
                <div className="bg-[#121212] border border-[#333] rounded-lg px-4 py-2 font-orbitron text-2xl text-white">
                  {formatTime(countdown.minutes)}
                </div>
                <span className="text-xs text-gray-400 mt-1">MINUTES</span>
              </div>
              <div className="text-2xl text-[#9d00ff] font-bold">:</div>
              <div className="flex flex-col items-center">
                <div className="bg-[#121212] border border-[#333] rounded-lg px-4 py-2 font-orbitron text-2xl text-white">
                  {formatTime(countdown.seconds)}
                </div>
                <span className="text-xs text-gray-400 mt-1">SECONDS</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto hide-scrollbar" data-aos="fade-up">
          <div className="inline-flex bg-[#252525] rounded-xl p-1">
            {limitedOffers.slice(0, 3).map((product, index) => (
              <button
                key={product.id}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === index 
                    ? 'bg-gradient-to-r from-[#9d00ff] to-[#ff00c8] text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {product.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Cards */}
        <div className="relative">
          {limitedOffers.slice(0, 3).map((product, index) => (
            <div 
              key={product.id} 
              className={`transition-all duration-500 ${
                activeTab === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute top-0 left-0 pointer-events-none'
              }`}
            >
              <div className="relative bg-gradient-to-br from-[#252525] to-[#1a1a1a] rounded-2xl overflow-hidden border border-[#333] cyberpunk-card group" data-aos="zoom-in">
                {/* Limited Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="px-4 py-2 bg-gradient-to-r from-[#9d00ff] to-[#ff00c8] text-white text-xs font-bold rounded-full uppercase animate-pulse shadow-glow-purple">
                    Limited Offer
                  </div>
                </div>
                
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="px-4 py-2 bg-[#0bff7e] text-black text-xs font-bold rounded-full uppercase shadow-glow-green">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-2/5 relative overflow-hidden rounded-xl bg-gradient-to-br from-[#202020] to-[#101010] p-6 border border-[#333]">
                      <div className="group-hover:animate-pulse-slow absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#9d00ff] to-[#0bff7e] opacity-20 blur transition duration-1000 group-hover:opacity-60"></div>
                      <Link href={`/product/${product.id}`}>
                        <div className="h-60 flex items-center justify-center relative">
                          <img 
                            src={product.image}
                            alt={product.name} 
                            className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                          />
                          
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity delay-150 duration-300 transform -translate-y-4 group-hover:translate-y-0">
                              <span className="font-medium text-sm">View Details</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    
                    <div className="w-full md:w-3/5 flex flex-col justify-between">
                      <div>
                        <Link href={`/product/${product.id}`}>
                          <h3 className="text-2xl font-orbitron font-bold text-white mb-2 cursor-pointer hover:text-[#0bff7e] transition-colors">{product.name}</h3>
                        </Link>
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
                        
                        <p className="text-gray-300 mb-6 line-clamp-3">
                          {product.description}
                        </p>
                        
                        <div className="flex items-baseline space-x-3 mb-6">
                          <div className="relative">
                            <span className="text-3xl font-bold text-white">${product.price.toFixed(2)}</span>
                            <div className="absolute h-0.5 w-full bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] bottom-0 left-0"></div>
                          </div>
                          {product.originalPrice && (
                            <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        
                        {/* Features List */}
                        <div className="mb-6 grid grid-cols-2 gap-2">
                          {(product.features || ['High Precision', 'Advanced Tech', 'Premium Quality', 'Medical Grade']).map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <i className="fas fa-check-circle text-[#0bff7e] mr-2"></i>
                              <span className="text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button 
                          className="btn-hover-effect px-6 py-3 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold rounded-lg shadow-glow-green font-poppins flex-1 flex items-center justify-center space-x-2 group"
                          onClick={() => addToCart(product)}
                        >
                          <i className="fas fa-shopping-cart group-hover:animate-bounce"></i>
                          <span>Add to Cart</span>
                        </button>
                        <button 
                          className={`btn-hover-effect p-3 border-2 rounded-lg transition-all duration-300 ${
                            isInWishlist(product.id) 
                              ? 'border-[#ff6b9d] bg-[#ff6b9d] text-black shadow-glow-pink' 
                              : 'border-[#424242] text-white hover:border-[#ff6b9d] hover:bg-[#ff6b9d] hover:text-black hover:shadow-glow-pink'
                          }`}
                          onClick={() => handleAddToWishlist(product)}
                        >
                          <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart ${isInWishlist(product.id) ? 'animate-heartbeat' : ''}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {limitedOffers.slice(0, 3).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeTab === index 
                  ? 'bg-gradient-to-r from-[#9d00ff] to-[#ff00c8] w-8' 
                  : 'bg-[#424242]'
              }`}
              onClick={() => setActiveTab(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Add the CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .cyberpunk-card {
            box-shadow: 0 0 20px rgba(155, 0, 255, 0.2);
            transition: all 0.3s ease;
          }
          
          .cyberpunk-card:hover {
            box-shadow: 0 0 30px rgba(11, 255, 126, 0.3);
            transform: translateY(-5px);
          }
          
          .shadow-glow-green {
            box-shadow: 0 0 15px rgba(11, 255, 126, 0.5);
          }
          
          .shadow-glow-purple {
            box-shadow: 0 0 15px rgba(155, 0, 255, 0.5);
          }
          
          .shadow-glow-pink {
            box-shadow: 0 0 15px rgba(255, 107, 157, 0.5);
          }
          
          .pulse-glow {
            animation: pulse-glow 2s infinite;
          }
          
          @keyframes pulse-glow {
            0% { box-shadow: 0 0 5px rgba(155, 0, 255, 0.2); }
            50% { box-shadow: 0 0 20px rgba(155, 0, 255, 0.6); }
            100% { box-shadow: 0 0 5px rgba(155, 0, 255, 0.2); }
          }
          
          .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          .animate-heartbeat {
            animation: heartbeat 1.5s ease-in-out;
          }
          
          @keyframes heartbeat {
            0% { transform: scale(1); }
            15% { transform: scale(1.4); }
            30% { transform: scale(1); }
            45% { transform: scale(1.2); }
            60% { transform: scale(1); }
          }
          
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .countdown-timer {
            position: relative;
          }
          
          .bg-circuit-pattern {
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%235d00ff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
          }
        `
      }} />
    </section>
  );
};

export default LimitedOfferSection;

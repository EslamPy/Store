import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useCart } from '../hooks/useCart';
import { gsap } from 'gsap';

const QuickViewModal: React.FC = () => {
  const { selectedProduct, isQuickViewOpen, closeQuickView, addToCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    if (isQuickViewOpen && modalRef.current && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isQuickViewOpen]);
  
  const handleClose = () => {
    if (modalRef.current && overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3
      });
      
      gsap.to(modalRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          closeQuickView();
          setQuantity(1);
        }
      });
    } else {
      closeQuickView();
      setQuantity(1);
    }
  };
  
  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity);
      handleClose();
    }
  };
  
  if (!isQuickViewOpen || !selectedProduct) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-[#121212] bg-opacity-80 backdrop-blur-sm" 
        onClick={handleClose}
      ></div>
      
      <div 
        ref={modalRef}
        className="relative bg-[#1e1e1e] rounded-lg max-w-4xl w-full mx-4 cyberpunk-border z-10"
      >
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={handleClose}
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <img 
                src={selectedProduct.image}
                alt={selectedProduct.name} 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            
            <div className="w-full md:w-1/2">
              <span className="text-sm text-[#0bff7e] mb-2 block">{selectedProduct.category}</span>
              <h2 className="text-2xl font-orbitron font-bold text-white mb-3">{selectedProduct.name}</h2>
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas ${i < Math.floor(selectedProduct.rating) ? 'fa-star' : i < selectedProduct.rating ? 'fa-star-half-alt' : 'far fa-star'}`}
                    ></i>
                  ))}
                </div>
                <span className="text-sm text-gray-400 ml-2">({selectedProduct.reviews} reviews)</span>
              </div>
              
              <p className="text-gray-300 mb-6">
                {selectedProduct.description}
              </p>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Availability</span>
                  <span className="text-green-500">In Stock</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">SKU</span>
                  <span className="text-white">{selectedProduct.sku}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-white">${selectedProduct.price.toFixed(2)}</span>
                {selectedProduct.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">${selectedProduct.originalPrice.toFixed(2)}</span>
                    <span className="text-green-500 text-sm font-bold">
                      {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-[#2d2d2d] rounded-md">
                  <button 
                    className="px-3 py-2 text-gray-400 hover:text-white"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="w-10 text-center text-white">{quantity}</span>
                  <button 
                    className="px-3 py-2 text-gray-400 hover:text-white"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                
                <button 
                  className="flex-1 btn-hover-effect px-6 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary font-poppins"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
              
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-[#0bff7e] transition-colors">
                  <i className="fas fa-heart mr-2"></i> Add to Wishlist
                </button>
                <button className="text-gray-400 hover:text-[#0bff7e] transition-colors">
                  <i className="fas fa-share-alt mr-2"></i> Share
                </button>
              </div>
              
              <div className="mt-4">
                <Link href={`/product/${selectedProduct.id}`}>
                  <a className="text-[#00b3ff] hover:underline">
                    View full details <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

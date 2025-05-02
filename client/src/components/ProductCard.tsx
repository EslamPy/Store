import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useCurrency } from '../context/CurrencyContext';
import { Product } from '../data/products';
import { gsap } from 'gsap';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge = false }) => {
  const { addToCart, openQuickView } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { convertPrice, formatPrice } = useCurrency();
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    
    if (card) {
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -15,
          boxShadow: '0 15px 35px -10px rgba(11, 255, 126, 0.3), 0 5px 15px rgba(0, 179, 255, 0.2)',
          duration: 0.4,
          ease: "power2.out"
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
          duration: 0.4,
          ease: "power2.out"
        });
      };
      
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create a clone of the product image for the animation
    if (cardRef.current) {
      const image = cardRef.current.querySelector('img');
      const cartIcon = document.querySelector('.cart-icon-wrapper');
      
      if (image && cartIcon) {
        const clone = image.cloneNode(true) as HTMLImageElement;
        const imageRect = image.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        
        // Style the clone
        clone.style.position = 'fixed';
        clone.style.top = `${imageRect.top}px`;
        clone.style.left = `${imageRect.left}px`;
        clone.style.width = `${imageRect.width}px`;
        clone.style.height = `${imageRect.height}px`;
        clone.style.objectFit = 'cover';
        clone.style.zIndex = '1000';
        clone.style.transition = 'all 0.7s ease-in-out';
        clone.style.borderRadius = '8px';
        
        // Add the clone to the body
        document.body.appendChild(clone);
        
        // Animate the clone to the cart
        setTimeout(() => {
          clone.style.top = `${cartRect.top}px`;
          clone.style.left = `${cartRect.left}px`;
          clone.style.width = '20px';
          clone.style.height = '20px';
          clone.style.opacity = '0.5';
          
          // Remove the clone after animation completes
          setTimeout(() => {
            document.body.removeChild(clone);
            
            // Add the product to cart
            addToCart(product);
            
            // Add a little bounce animation to the cart badge
            const cartBadge = cartIcon.querySelector('.cart-badge');
            if (cartBadge) {
              gsap.fromTo(
                cartBadge, 
                { scale: 1 },
                { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1 }
              );
            }
          }, 700);
        }, 10);
      } else {
        // Fallback if animation can't work
        addToCart(product);
      }
    }
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <div 
      ref={cardRef}
      className="product-card bg-gradient-to-b from-[#202020] to-[#151515] rounded-xl overflow-hidden shadow-lg relative"
      data-aos="fade-up"
    >
      <div className="absolute inset-0 cyberpunk-border opacity-80"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0bff7e] via-[#00b3ff] to-[#9d00ff] opacity-20 blur-sm rounded-xl"></div>
      
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 group overflow-hidden">
          <div className="absolute -inset-1 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60"></div>
          <div className="absolute inset-0 bg-[url('/src/assets/grid-pattern.svg')] bg-opacity-5 mix-blend-overlay"></div>
          
          <img 
            src={product.image}
            alt={product.name} 
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
          
          {showBadge && product.badge && (
            <div className="absolute top-3 right-3 z-20">
              <div className="px-3 py-1.5 bg-gradient-to-r from-[#ff3636] to-[#ff6b9d] text-white text-xs font-bold rounded-full uppercase shadow-lg backdrop-blur-sm">
                {product.badge}
              </div>
            </div>
          )}
          
          <div className="product-overlay absolute inset-0 z-10 backdrop-blur-sm bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent flex flex-col items-center justify-center space-y-4 px-4">
            <button 
              className="btn-hover-effect w-full px-5 py-2.5 bg-gradient-to-r from-[#0bff7e] to-[#0bdf7e] text-black font-bold rounded-md text-sm transform transition-all shadow-lg shadow-[#0bff7e]/20"
              onClick={handleQuickView}
            >
              <i className="fas fa-eye mr-2"></i>Quick View
            </button>
            <button 
              className="btn-hover-effect w-full px-5 py-2.5 bg-gradient-to-r from-[#00b3ff] to-[#0090ff] text-black font-bold rounded-md text-sm transform transition-all shadow-lg shadow-[#00b3ff]/20"
              onClick={handleAddToCart}
            >
              <i className="fas fa-shopping-cart mr-2"></i>Add to Cart
            </button>
          </div>
        </div>
        
        <div className="relative p-5 z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium px-2 py-1 bg-[#252525] rounded-md text-[#0bff7e]">{product.category}</span>
            <div className="text-yellow-400 text-xs flex bg-[#252525] px-2 py-1 rounded-md">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i} 
                  className={`fas ${i < Math.floor(product.rating) ? 'fa-star' : i < product.rating ? 'fa-star-half-alt' : 'far fa-star'}`}
                ></i>
              ))}
            </div>
          </div>
          <h3 className="text-lg font-orbitron font-bold text-white mb-3 line-clamp-2">{product.name}</h3>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(convertPrice(product.price * 1.2))}
              </span>
              <span className="text-xl font-bold text-white bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] bg-clip-text text-transparent">
                {formatPrice(convertPrice(product.price))}
              </span>
            </div>
            <button 
              className={`transition-all duration-300 h-10 w-10 rounded-full flex items-center justify-center ${
                isInWishlist(product.id) 
                ? 'bg-[#ff6b9d]/20 text-[#ff6b9d]' 
                : 'bg-[#252525] text-gray-400 hover:bg-[#ff6b9d]/20 hover:text-[#ff6b9d]'}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isInWishlist(product.id)) {
                  removeFromWishlist(product.id);
                } else {
                  addToWishlist(product);
                  
                  // Create heart animation effect
                  const heartIcon = e.currentTarget.querySelector('i');
                  if (heartIcon) {
                    gsap.fromTo(
                      heartIcon, 
                      { scale: 1 },
                      { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1, ease: "elastic.out(1, 0.3)" }
                    );
                  }
                }
              }}
            >
              <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

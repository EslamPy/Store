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
          y: -10,
          boxShadow: '0 10px 25px -5px rgba(11, 255, 126, 0.2)',
          duration: 0.3
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
          duration: 0.3
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
      className="product-card bg-[#1e1e1e] rounded-lg overflow-hidden cyberpunk-border"
      data-aos="fade-up"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative h-60 group">
          <img 
            src={product.image}
            alt={product.name} 
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          {showBadge && product.badge && (
            <div className="absolute top-2 right-2">
              <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase">
                {product.badge}
              </div>
            </div>
          )}
          <div className="product-overlay absolute inset-0 bg-[#121212] bg-opacity-70 flex flex-col items-center justify-center space-y-3">
            <button 
              className="btn-hover-effect px-4 py-2 bg-[#0bff7e] text-black font-bold rounded-md text-sm"
              onClick={handleQuickView}
            >
              Quick View
            </button>
            <button 
              className="btn-hover-effect px-4 py-2 bg-[#00b3ff] text-black font-bold rounded-md text-sm"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-400">{product.category}</span>
            <div className="text-yellow-400 text-xs flex">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i} 
                  className={`fas ${i < Math.floor(product.rating) ? 'fa-star' : i < product.rating ? 'fa-star-half-alt' : 'far fa-star'}`}
                ></i>
              ))}
            </div>
          </div>
          <h3 className="text-lg font-orbitron font-bold text-white mb-2">{product.name}</h3>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-white">{formatPrice(convertPrice(product.price))}</span>
            <button 
              className={`transition-colors ${isInWishlist(product.id) 
                ? 'text-[#ff6b9d] hover:text-white' 
                : 'text-gray-400 hover:text-[#ff6b9d]'}`}
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

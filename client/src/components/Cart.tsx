import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '../hooks/useCart';
import { gsap } from 'gsap';

const Cart: React.FC = () => {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [_, setLocation] = useLocation();
  const cartRef = useRef<HTMLDivElement>(null);
  const [overlayElement, setOverlayElement] = useState<HTMLDivElement | null>(null);
  
  // Create overlay when component mounts
  useEffect(() => {
    // Create overlay element
    const div = document.createElement('div');
    div.className = 'fixed inset-0 bg-black z-40 transition-opacity duration-300';
    div.style.opacity = '0';
    div.style.pointerEvents = 'none';
    document.body.appendChild(div);
    
    // Add click event listener
    const handleClick = () => closeCart();
    div.addEventListener('click', handleClick);
    
    // Store the element in state
    setOverlayElement(div);
    
    // Cleanup function
    return () => {
      div.removeEventListener('click', handleClick);
      if (div.parentNode) {
        document.body.removeChild(div);
      }
    };
  }, [closeCart]);
  
  // Handle cart open/close animations
  useEffect(() => {
    // Skip if elements aren't available yet
    if (!cartRef.current || !overlayElement) return;
    
    if (isCartOpen) {
      // Animate overlay to visible
      gsap.to(overlayElement, {
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          overlayElement.style.pointerEvents = 'auto';
        }
      });
      
      // Animate cart to visible
      gsap.to(cartRef.current, {
        x: 0,
        duration: 0.3,
        ease: 'power2.out',
        delay: 0.1,
      });
    } else {
      // Animate overlay to hidden
      gsap.to(overlayElement, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (overlayElement) {
            overlayElement.style.pointerEvents = 'none';
          }
        }
      });
      
      // Animate cart to hidden
      gsap.to(cartRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  }, [isCartOpen, overlayElement]);
  
  const handleIncreaseQuantity = (id: number) => {
    const item = cartItems.find(item => item.product.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = (id: number) => {
    const item = cartItems.find(item => item.product.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    } else if (item) {
      removeFromCart(id);
    }
  };
  
  return (
    <div 
      ref={cartRef}
      className="fixed top-0 right-0 w-full sm:w-96 h-full bg-[#1e1e1e] z-50 shadow-2xl transform translate-x-full transition-transform duration-300 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-orbitron font-bold text-white">Your Cart</h2>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={closeCart}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#1a1a1a]">
              <i className="fas fa-shopping-cart text-4xl text-gray-500"></i>
            </div>
            <h3 className="text-white text-xl mb-2 font-bold">Your cart is empty</h3>
            <p className="text-gray-400 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <button 
              className="px-6 py-3 bg-[#0bff7e] text-black font-bold rounded-md transition-all hover:shadow-[0_0_15px_rgba(11,255,126,0.5)]"
              onClick={() => {
                setLocation('/products');
                closeCart();
              }}
            >
              <i className="fas fa-shopping-bag mr-2"></i>
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-6">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex gap-4 bg-[#1a1a1a] p-3 rounded-lg border border-[#2d2d2d] hover:border-[#3d3d3d] transition-colors">
                  <Link 
                    href={`/product/${item.product.id}`}
                    onClick={closeCart}
                    className="flex-shrink-0"
                  >
                    <img 
                      src={item.product.image}
                      alt={item.product.name} 
                      className="w-20 h-20 object-cover rounded-lg border border-[#2d2d2d]"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link 
                      href={`/product/${item.product.id}`}
                      onClick={closeCart}
                    >
                      <h3 className="text-white font-bold hover:text-[#0bff7e] transition-colors">{item.product.name}</h3>
                    </Link>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-400 text-sm">{item.quantity} × ${item.product.price.toFixed(2)}</span>
                      <span className="text-[#0bff7e] font-bold">${(item.quantity * item.product.price).toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex space-x-1 items-center bg-[#232323] rounded-md p-1">
                        <button 
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded"
                          onClick={() => handleDecreaseQuantity(item.product.id)}
                          aria-label="Decrease quantity"
                        >
                          <i className="fas fa-minus text-xs"></i>
                        </button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <button 
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded"
                          onClick={() => handleIncreaseQuantity(item.product.id)}
                          aria-label="Increase quantity"
                        >
                          <i className="fas fa-plus text-xs"></i>
                        </button>
                      </div>
                      <button 
                        className="text-red-500 hover:text-red-400 w-8 h-8 flex items-center justify-center hover:bg-[#2d2d2d] rounded"
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label="Remove from cart"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[#2d2d2d] pt-6">
              <div className="bg-[#1a1a1a] p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Estimated shipping</span>
                  <span className="text-white font-bold">$0.00</span>
                </div>
                <div className="border-t border-[#2d2d2d] my-3 pt-3"></div>
                <div className="flex justify-between text-lg">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#0bff7e] font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <Link href="/checkout">
                <button 
                  className="w-full btn-hover-effect px-6 py-3 bg-[#0bff7e] text-black font-bold rounded-md transition-all hover:shadow-[0_0_15px_rgba(11,255,126,0.5)] mb-3"
                  onClick={closeCart}
                >
                  <i className="fas fa-credit-card mr-2"></i>
                  Checkout
                </button>
              </Link>
              
              <button 
                className="w-full btn-hover-effect px-6 py-3 border border-[#00b3ff] text-white font-bold rounded-md hover:bg-[#00b3ff] hover:text-black transition-colors"
                onClick={() => {
                  setLocation('/products');
                  closeCart();
                }}
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;

import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useCart } from '../hooks/useCart';
import { gsap } from 'gsap';

const Cart: React.FC = () => {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cartRef.current) {
      if (isCartOpen) {
        gsap.to(cartRef.current, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(cartRef.current, {
          x: '100%',
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    }
  }, [isCartOpen]);
  
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
          <div className="text-center py-8">
            <i className="fas fa-shopping-cart text-4xl text-gray-500 mb-4"></i>
            <p className="text-gray-400">Your cart is empty</p>
            <button 
              className="mt-4 px-6 py-2 bg-[#0bff7e] text-black font-bold rounded-md"
              onClick={closeCart}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-6">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <img 
                    src={item.product.image}
                    alt={item.product.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{item.product.name}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{item.quantity} × ${item.product.price.toFixed(2)}</span>
                      <span className="text-white font-bold">${(item.quantity * item.product.price).toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex space-x-2 items-center">
                      <button 
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleDecreaseQuantity(item.product.id)}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="text-white">{item.quantity}</span>
                      <button 
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleIncreaseQuantity(item.product.id)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-400 ml-4"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[#2d2d2d] pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-bold">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-gray-400">Estimated shipping</span>
                <span className="text-white font-bold">$0.00</span>
              </div>
              <div className="flex justify-between mb-6 text-lg">
                <span className="text-white font-bold">Total</span>
                <span className="text-[#0bff7e] font-bold">${getCartTotal().toFixed(2)}</span>
              </div>
              
              <Link href="/checkout">
                <button 
                  className="w-full btn-hover-effect px-6 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary font-poppins mb-3"
                  onClick={closeCart}
                >
                  Checkout
                </button>
              </Link>
              
              <button 
                className="w-full btn-hover-effect px-6 py-3 border border-[#00b3ff] text-white font-bold rounded-md hover:bg-[#00b3ff] hover:text-black transition-colors font-poppins"
                onClick={closeCart}
              >
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

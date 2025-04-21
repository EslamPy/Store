import { useEffect } from 'react';
import { Link } from 'wouter';
import { useCart } from '../hooks/useCart';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  useEffect(() => {
    document.title = 'Your Cart - MedTech';
  }, []);
  
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
    }
  };
  
  return (
    <div className="py-16 bg-[#121212]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-orbitron font-bold text-white mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-[#1e1e1e] rounded-lg p-8 text-center">
            <i className="fas fa-shopping-cart text-5xl text-gray-500 mb-4"></i>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/products">
              <a className="px-8 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary inline-block">
                Start Shopping
              </a>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#1e1e1e] rounded-lg p-6">
                <div className="hidden md:grid grid-cols-12 text-sm text-gray-400 mb-4 pb-2 border-b border-[#2d2d2d]">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                
                {cartItems.map(item => (
                  <div key={item.product.id} className="border-b border-[#2d2d2d] py-4 last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 flex items-center gap-4">
                        <Link href={`/product/${item.product.id}`}>
                          <img 
                            src={item.product.image}
                            alt={item.product.name} 
                            className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                          />
                        </Link>
                        <div>
                          <Link href={`/product/${item.product.id}`}>
                            <a className="text-white font-bold hover:text-[#0bff7e]">{item.product.name}</a>
                          </Link>
                          <p className="text-sm text-gray-400">{item.product.category}</p>
                          <button 
                            className="text-red-500 hover:text-red-400 text-sm mt-2 md:hidden"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <i className="fas fa-trash mr-1"></i> Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-center">
                        <div className="text-white">${item.product.price.toFixed(2)}</div>
                      </div>
                      
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-[#2d2d2d] rounded-md">
                          <button 
                            className="px-2 py-1 text-gray-400 hover:text-white"
                            onClick={() => handleDecreaseQuantity(item.product.id)}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="w-8 text-center text-white">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 text-gray-400 hover:text-white"
                            onClick={() => handleIncreaseQuantity(item.product.id)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-2 flex items-center justify-between md:justify-end">
                        <span className="text-white font-bold">${(item.quantity * item.product.price).toFixed(2)}</span>
                        <button 
                          className="text-red-500 hover:text-red-400 ml-4 hidden md:block"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <Link href="/products">
                  <a className="text-[#00b3ff] hover:underline flex items-center">
                    <i className="fas fa-arrow-left mr-2"></i> Continue Shopping
                  </a>
                </Link>
                
                <button 
                  className="text-white hover:text-[#0bff7e] flex items-center"
                  onClick={() => cartItems.forEach(item => removeFromCart(item.product.id))}
                >
                  <i className="fas fa-trash mr-2"></i> Clear Cart
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#1e1e1e] rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-orbitron font-bold text-white mb-6 pb-2 border-b border-[#2d2d2d]">Order Summary</h2>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-white">${(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between py-3 border-t border-b border-[#2d2d2d] mb-6">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#0bff7e] font-bold text-xl">${(getCartTotal() * 1.1).toFixed(2)}</span>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Promo Code</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Enter code"
                      className="flex-1 bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-l-lg px-4 py-2 outline-none"
                    />
                    <button className="bg-[#0bff7e] text-black font-bold px-4 rounded-r-lg">
                      Apply
                    </button>
                  </div>
                </div>
                
                <Link href="/checkout">
                  <a className="w-full btn-hover-effect px-6 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary font-poppins flex items-center justify-center">
                    Proceed to Checkout
                  </a>
                </Link>
                
                <div className="flex justify-center space-x-4 mt-6">
                  <i className="fab fa-cc-visa text-3xl text-gray-400"></i>
                  <i className="fab fa-cc-mastercard text-3xl text-gray-400"></i>
                  <i className="fab fa-cc-amex text-3xl text-gray-400"></i>
                  <i className="fab fa-cc-paypal text-3xl text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

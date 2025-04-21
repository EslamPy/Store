import { useEffect } from 'react';
import { Link } from 'wouter';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { motion } from 'framer-motion';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Set page title
  useEffect(() => {
    document.title = 'My Wishlist | MedTech';
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const handleMoveToCart = (productId: number) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      removeFromWishlist(productId);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-orbitron font-bold text-white">My Wishlist</h1>
        <div className="flex space-x-4">
          <Link href="/products">
            <button className="px-4 py-2 border border-[#00b3ff] text-white rounded-md hover:bg-[#00b3ff] hover:text-black transition-colors font-medium">
              <i className="fas fa-shopping-basket mr-2"></i>
              Continue Shopping
            </button>
          </Link>
          {wishlist.length > 0 && (
            <button 
              className="px-4 py-2 border border-gray-600 text-gray-400 rounded-md hover:text-white hover:border-white transition-colors font-medium"
              onClick={clearWishlist}
            >
              <i className="fas fa-trash-alt mr-2"></i>
              Clear Wishlist
            </button>
          )}
        </div>
      </div>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-[#1e1e1e] rounded-lg">
          <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-[#1a1a1a] mb-6">
            <i className="fas fa-heart text-4xl text-gray-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Browse our products and add items to your wishlist. Your favorites will be saved here.
          </p>
          <Link href="/products">
            <button className="px-6 py-3 bg-[#ff6b9d] text-white font-bold rounded-md transition-all hover:shadow-[0_0_15px_rgba(255,107,157,0.5)]">
              <i className="fas fa-shopping-bag mr-2"></i>
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {wishlist.map(product => (
            <motion.div 
              key={product.id} 
              className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#2d2d2d] hover:border-[#3d3d3d] transition-colors"
              variants={itemVariants}
              layout
            >
              <div className="flex">
                <Link href={`/product/${product.id}`} className="flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-32 h-32 object-cover"
                  />
                </Link>
                <div className="p-4 flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-400">{product.category}</span>
                    <div className="text-xs text-yellow-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas ${i < Math.floor(product.rating) ? 'fa-star' : i < product.rating ? 'fa-star-half-alt' : 'far fa-star'}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-white font-bold hover:text-[#0bff7e] transition-colors">{product.name}</h3>
                  </Link>
                  <div className="mt-2 text-xl font-bold text-[#0bff7e]">${product.price.toFixed(2)}</div>
                  <div className="mt-3 flex space-x-2">
                    <button 
                      className="flex-1 px-3 py-2 bg-[#0bff7e] text-black text-sm font-bold rounded-md hover:shadow-[0_0_10px_rgba(11,255,126,0.5)] transition-all"
                      onClick={() => handleMoveToCart(product.id)}
                    >
                      <i className="fas fa-cart-plus mr-1"></i> Add to Cart
                    </button>
                    <button 
                      className="px-3 py-2 bg-[#1a1a1a] text-red-500 text-sm rounded-md border border-[#2d2d2d] hover:border-red-500 transition-all"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default WishlistPage;
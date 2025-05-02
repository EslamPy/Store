import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import SearchResults from './SearchResults';
import { searchProducts } from '../data/products';
import CurrencySelector from './ui/CurrencySelector';

const Navbar: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { openCart, cartItems } = useCart();
  const { wishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 1) {
      const results = searchProducts(query);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 1) {
      const results = searchProducts(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delayed to allow clicking on results
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };
  
  const handleSelectProduct = () => {
    setShowResults(false);
  };

  const navigateToLogin = () => {
    setLocation('/login');
  };

  const navigateToCart = () => {
    setLocation('/cart');
  };
  
  const navigateToWishlist = () => {
    setLocation('/wishlist');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-opacity-95 shadow-md' : 'bg-opacity-80'
      } bg-[#1e1e1e] backdrop-blur-md border-b border-[#2d2d2d]`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <img src="../src/assets/logo.png" alt="MedTech Logo" className="h-10" />
                <span className="text-white text-xl font-orbitron font-bold">MedTech</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/" className={`text-white font-orbitron hover:text-[#0bff7e] transition-colors ${location === '/' ? 'text-[#0bff7e]' : ''}`}>Home</Link>
              <Link href="/products" className={`text-white font-orbitron hover:text-[#0bff7e] transition-colors ${location === '/products' ? 'text-[#0bff7e]' : ''}`}>Products</Link>
              <Link href="/products?filter=deals" className={`text-white font-orbitron hover:text-[#0bff7e] transition-colors ${location.includes('deals') ? 'text-[#0bff7e]' : ''}`}>Deals</Link>
              <Link href="#support" className="text-white font-orbitron hover:text-[#0bff7e] transition-colors">Support</Link>
            </div>
            
            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg pl-10 pr-4 py-2 outline-none"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onKeyDown={handleSearchKeyDown}
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
              {showResults && (
                <SearchResults 
                  results={searchResults} 
                  searchQuery={searchQuery} 
                  onSelectProduct={handleSelectProduct} 
                />
              )}
            </div>
            
            {/* Right Navigation Items */}
            <div className="flex items-center space-x-6">
              {/* Account */}
              <button onClick={navigateToLogin} className="text-white hover:text-[#0bff7e] transition-colors">
                <i className="fas fa-user text-xl"></i>
              </button>
              
              {/* Wishlist */}
              <div className="wishlist-icon-wrapper">
                <button 
                  className="text-white hover:text-[#0bff7e] transition-colors" 
                  onClick={navigateToWishlist}
                >
                  <i className="fas fa-heart text-xl"></i>
                </button>
                {wishlistCount > 0 && (
                  <div className="wishlist-badge bg-[#ff6b9d] text-xs text-black font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </div>
                )}
              </div>
              
              {/* Cart */}
              <div className="cart-icon-wrapper">
                <button 
                  className="text-white hover:text-[#0bff7e] transition-colors" 
                  onClick={navigateToCart}
                >
                  <i className="fas fa-shopping-cart text-xl"></i>
                </button>
                {cartItemCount > 0 && (
                  <div className="cart-badge bg-[#0bff7e] text-xs text-black font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </div>
                )}
              </div>
              
              {/* Currency Selector */}
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-white hover:text-[#0bff7e] transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="container mx-auto px-4 py-3 bg-[#1e1e1e] flex flex-col space-y-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg pl-10 pr-4 py-2 outline-none"
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyDown={handleSearchKeyDown}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <Link href="/" className={`text-white font-orbitron hover:text-[#0bff7e] transition-colors py-2 ${location === '/' ? 'text-[#0bff7e]' : ''}`}>Home</Link>
            <Link href="/products" className={`text-white font-orbitron hover:text-[#0bff7e] transition-colors py-2 ${location === '/products' ? 'text-[#0bff7e]' : ''}`}>Products</Link>
            <Link href="/products?filter=deals" className={`text-white font-orbitron hover:text-[#0bff7e] transition-colors py-2 ${location.includes('deals') ? 'text-[#0bff7e]' : ''}`}>Deals</Link>
            <Link href="#support" className="text-white font-orbitron hover:text-[#0bff7e] transition-colors py-2">Support</Link>
            <Link href="/wishlist" className="text-white font-orbitron hover:text-[#0bff7e] transition-colors py-2">Wishlist</Link>
            
            {/* Mobile Currency Selector */}
            <div className="py-2">
              <CurrencySelector />
            </div>
          </div>
          {showResults && (
            <SearchResults 
              results={searchResults} 
              searchQuery={searchQuery} 
              onSelectProduct={handleSelectProduct} 
            />
          )}
        </div>
      </nav>
      
      {/* Add CSS for the wishlist badge */}
      <style>{`
        .wishlist-icon-wrapper,
        .cart-icon-wrapper {
          position: relative;
        }
        
        .wishlist-badge,
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -10px;
        }
      `}</style>
    </>
  );
};

export default Navbar;

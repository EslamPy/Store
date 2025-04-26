import { useLocation } from 'wouter';
import { useEffect, useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { filterProducts, FilterOptions } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { getAllProducts } from '../data/products';
import { categories } from '../data/categories';
import { Link } from 'wouter';

const ProductListingPage: React.FC = () => {
  const [location] = useLocation();
  const { products, resetProducts } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [displayCount, setDisplayCount] = useState<number>(12);
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [gridView, setGridView] = useState(true);
  
  // Get all available brands from products
  const availableBrands = useMemo(() => {
    console.log('Products in availableBrands:', products.length, products);
    const brandsSet = new Set<string>();
    products.forEach(product => {
      if (product.brand) {
        brandsSet.add(product.brand);
      }
    });
    
    let sortedBrands = Array.from(brandsSet).sort();
    console.log('Available brands:', sortedBrands);
    
    // If no brands were found, use default brands
    if (sortedBrands.length === 0) {
      sortedBrands = [
        'NVIDIA', 
        'AMD', 
        'Intel', 
        'Samsung', 
        'ASUS', 
        'Corsair', 
        'EVGA', 
        'Cooler Master', 
        'Logitech', 
        'Dell', 
        'HP', 
        'Lenovo', 
        'Techno Zone', 
        'Acer',
        'WD'
      ].sort();
      console.log('Using default brands instead:', sortedBrands);
    }
    
    return sortedBrands;
  }, [products]);
  
  // Extract search param from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
    
    const filterParam = searchParams.get('filter');
    if (filterParam === 'deals') {
      // Special case for "Deals" filter
      setFilteredProducts(products.filter(p => p.discount && p.discount > 0));
    } else {
      applyFilters();
    }
  }, [location, products]);
  
  const applyFilters = () => {
    const options: FilterOptions = {
      category: selectedCategory || undefined,
      brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      priceRange: [minPrice, maxPrice],
      sortBy: sortOption,
      searchTerm: searchTerm
    };
    
    const filtered = filterProducts(products, options);
    setFilteredProducts(filtered);
  };
  
  // Effect to reapply filters when any filter option changes
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedBrands, minPrice, maxPrice, sortOption, searchTerm, products]);
  
  useEffect(() => {
    document.title = 'Products - MedTech';
    setLoading(true);
    
    // Get URL params
    const params = new URLSearchParams(location.split('?')[1]);
    const categoryParam = params.get('category');
    const filterParam = params.get('filter');
    const searchParam = params.get('search');
    const brandParam = params.get('brand');
    
    // Set initial filters based on URL params
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    if (brandParam) {
      setSelectedBrands([brandParam]);
    }
    
    // Special filter (deals, new, etc.)
    if (filterParam) {
      setSortOption(filterParam);
    }
    
    // Get all products and apply filters
    const allProducts = getAllProducts();
    setFilteredProducts(allProducts);
    
    setLoading(false);
  }, [location]);
  
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(5000);
    setSortOption('featured');
    setSearchTerm('');
  };
  
  // Toggle brand selection for multi-select functionality
  const toggleBrandSelection = (brand: string) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };
  
  // Reset product data with enhanced functionality
  const resetProductData = () => {
    resetProducts();
    setSelectedBrands([]);
    setSelectedCategory(null);
    setMinPrice(0);
    setMaxPrice(5000);
    setSortOption('featured');
    setSearchTerm('');
  };
  
  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  const toggleGridView = () => {
    setGridView(!gridView);
  };
  
  return (
    <div className="py-16 bg-gradient-to-br from-[#0e0e0e] to-[#1a1a1a] min-h-screen" data-aos="fade">
      <div className="container mx-auto px-4">
        {/* Header Section with animations */}
        <div className="mb-8 bg-gradient-to-r from-[#1e1e1e] to-[#252525] rounded-xl p-6 shadow-lg transition-all duration-300 border border-[#333]" data-aos="fade-down">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] mb-2">
                {selectedCategory ? 
                  `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` : 
                  'All Products'
                }
                {selectedBrands.length > 0 && ` (${selectedBrands.length} brands selected)`}
              </h1>
              <p className="text-gray-400">
                {filteredProducts.length} products found
                {(selectedCategory || selectedBrands.length > 0 || searchTerm || sortOption !== 'featured' || (minPrice > 0 || maxPrice < 5000)) && 
                  <button 
                    className="ml-2 text-[#00b3ff] hover:underline"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="bg-[#2a2a2a] rounded-lg p-1 flex">
                <button
                  className={`p-2 rounded-md transition-colors ${gridView ? 'bg-[#0bff7e] text-black' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setGridView(true)}
                  title="Grid View"
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  className={`p-2 rounded-md transition-colors ${!gridView ? 'bg-[#0bff7e] text-black' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setGridView(false)}
                  title="List View"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
              
              {/* Mobile Filter Toggle */}
              <button
                className="lg:hidden p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 hover:text-white rounded-md transition-colors"
                onClick={toggleFiltersVisibility}
              >
                <i className={`fas ${filtersVisible ? 'fa-times' : 'fa-filter'}`}></i>
                <span className="ml-2">{filtersVisible ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
              
              {/* Reset Brands button */}
              <button 
                className="px-3 py-2 text-sm bg-gradient-to-r from-[#2a2a2a] to-[#333] hover:from-[#333] hover:to-[#444] text-gray-300 hover:text-white rounded-md transition-all transform hover:scale-105"
                onClick={resetProductData}
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh Brands
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 relative group">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border-2 border-[#333] focus:border-[#0bff7e] rounded-lg px-4 py-3 pl-10 outline-none text-white transition-all duration-300 focus:shadow-[0_0_15px_rgba(11,255,126,0.3)]"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0bff7e] transition-colors"></i>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar with slide animation */}
          <div 
            className={`w-full lg:w-1/4 space-y-6 transform transition-all duration-300 ${
              filtersVisible 
                ? 'translate-x-0 opacity-100' 
                : 'lg:translate-x-0 -translate-x-full opacity-0 lg:opacity-100 h-0 lg:h-auto overflow-hidden lg:overflow-visible'
            }`}
          >
            {/* Categories */}
            <div className="bg-gradient-to-br from-[#1e1e1e] to-[#252525] rounded-xl p-6 shadow-lg border border-[#333] transform transition-transform hover:translate-y-[-5px]" data-aos="fade-right">
              <h2 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
                <i className="fas fa-tags mr-2 text-[#0bff7e]"></i>
                Categories
              </h2>
              <div className="space-y-2">
                <div 
                  className={`cursor-pointer ${selectedCategory === null 
                    ? 'text-[#0bff7e] font-medium pl-2 border-l-2 border-[#0bff7e]' 
                    : 'text-white hover:text-[#0bff7e] hover:pl-2 transition-all'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </div>
                {categories.map(category => (
                  <div 
                    key={category.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedCategory === category.slug 
                        ? 'text-[#0bff7e] font-medium pl-2 border-l-2 border-[#0bff7e]' 
                        : 'text-white hover:text-[#0bff7e] hover:pl-2'}`}
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="bg-gradient-to-br from-[#1e1e1e] to-[#252525] rounded-xl p-6 shadow-lg border border-[#333] transform transition-transform hover:translate-y-[-5px]" data-aos="fade-right" data-aos-delay="100">
              <h2 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
                <i className="fas fa-dollar-sign mr-2 text-[#0bff7e]"></i>
                Price Range
              </h2>
              <div className="mb-4">
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>${minPrice}</span>
                    <span>${maxPrice}</span>
                  </div>
                  <div className="relative h-2 bg-[#333] rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] rounded-full" 
                      style={{ width: `${(maxPrice / 5000) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute top-[-4px] right-0 w-4 h-4 bg-white rounded-full border-2 border-[#0bff7e] shadow-[0_0_5px_rgba(11,255,126,0.5)]" 
                      style={{ right: `${100 - (maxPrice / 5000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-[#0bff7e] mt-4"
                />
              </div>
            </div>
            
            {/* Sort By */}
            <div className="bg-gradient-to-br from-[#1e1e1e] to-[#252525] rounded-xl p-6 shadow-lg border border-[#333] transform transition-transform hover:translate-y-[-5px]" data-aos="fade-right" data-aos-delay="200">
              <h2 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
                <i className="fas fa-sort mr-2 text-[#0bff7e]"></i>
                Sort By
              </h2>
              <div className="space-y-2">
                {[
                  { id: 'featured', label: 'Featured', icon: 'fa-star' },
                  { id: 'price-low', label: 'Price: Low to High', icon: 'fa-sort-amount-down-alt' },
                  { id: 'price-high', label: 'Price: High to Low', icon: 'fa-sort-amount-up' },
                  { id: 'rating', label: 'Highest Rated', icon: 'fa-thumbs-up' },
                  { id: 'deals', label: 'Deals & Offers', icon: 'fa-tags' }
                ].map(option => (
                  <div 
                    key={option.id}
                    className={`cursor-pointer transition-all duration-300 flex items-center ${
                      sortOption === option.id 
                        ? 'text-[#0bff7e] bg-[#1a1a1a] rounded-lg p-2 font-medium' 
                        : 'text-white hover:text-[#0bff7e] p-2 hover:bg-[#1a1a1a] hover:rounded-lg'
                    }`}
                    onClick={() => setSortOption(option.id)}
                  >
                    <i className={`fas ${option.icon} mr-2 w-5 text-center`}></i>
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Brand Filter with multi-select */}
            <div className="bg-gradient-to-br from-[#1e1e1e] to-[#252525] rounded-xl p-6 shadow-lg border border-[#333] transform transition-transform hover:translate-y-[-5px]" data-aos="fade-right" data-aos-delay="300">
              <h2 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-building mr-2 text-[#0bff7e]"></i>
                  Brands
                </div>
                {selectedBrands.length > 0 && (
                  <span className="text-sm bg-[#0bff7e] text-black px-2 py-1 rounded-full">
                    {selectedBrands.length}
                  </span>
                )}
              </h2>
              
              <div className="mb-4 relative">
                <input 
                  type="text" 
                  placeholder="Search brands..." 
                  className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#0bff7e] rounded-lg px-3 py-2 pl-8 outline-none text-white text-sm"
                  onChange={(e) => {
                    // Brand search functionality could be implemented here
                  }}
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <div 
                  className={`cursor-pointer flex items-center p-2 rounded-lg transition-all duration-300 ${
                    selectedBrands.length === 0 
                      ? 'bg-[#0bff7e] bg-opacity-20 text-[#0bff7e]' 
                      : 'text-white hover:bg-[#1a1a1a]'
                  }`}
                  onClick={() => setSelectedBrands([])}
                >
                  <span className={`w-5 h-5 inline-flex justify-center items-center mr-2 border rounded-md ${
                    selectedBrands.length === 0 
                      ? 'bg-[#0bff7e] border-[#0bff7e]' 
                      : 'border-gray-500'
                  }`}>
                    {selectedBrands.length === 0 && <i className="fas fa-check text-xs text-black"></i>}
                  </span>
                  All Brands
                </div>
                
                {availableBrands.map(brand => (
                  <div 
                    key={brand}
                    className={`cursor-pointer flex items-center p-2 rounded-lg transition-all duration-300 ${
                      selectedBrands.includes(brand) 
                        ? 'bg-[#0bff7e] bg-opacity-20 text-[#0bff7e]' 
                        : 'text-white hover:bg-[#1a1a1a]'
                    }`}
                    onClick={() => toggleBrandSelection(brand)}
                  >
                    <span className={`w-5 h-5 inline-flex justify-center items-center mr-2 border rounded-md ${
                      selectedBrands.includes(brand) 
                        ? 'bg-[#0bff7e] border-[#0bff7e]' 
                        : 'border-gray-500'
                    }`}>
                      {selectedBrands.includes(brand) && <i className="fas fa-check text-xs text-black"></i>}
                    </span>
                    {brand}
                  </div>
                ))}
              </div>
              
              {selectedBrands.length > 0 && (
                <button 
                  className="w-full mt-4 py-2 bg-[#1a1a1a] text-sm text-[#0bff7e] rounded-lg hover:bg-[#222] transition-colors"
                  onClick={() => setSelectedBrands([])}
                >
                  Clear Selection ({selectedBrands.length})
                </button>
              )}
            </div>
          </div>
          
          {/* Product Grid/List with animations */}
          <div className="w-full lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64" data-aos="fade">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#0bff7e]"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-r-2 border-l-2 border-[#00b3ff] absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-gradient-to-br from-[#1e1e1e] to-[#252525] rounded-xl p-8 text-center shadow-lg border border-[#333]" data-aos="fade-up">
                <div className="w-16 h-16 mx-auto bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-search text-4xl text-gray-500"></i>
                </div>
                <h3 className="text-2xl font-orbitron font-bold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search term</p>
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold rounded-lg transform transition-transform hover:scale-105"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            ) : gridView ? (
              // Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    data-aos="fade-up" 
                    data-aos-delay={index % 3 * 100} 
                    className="transform transition-transform hover:translate-y-[-8px] hover:shadow-xl"
                  >
                    <ProductCard product={product} showBadge={true} />
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-6">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="bg-gradient-to-br from-[#1e1e1e] to-[#252525] rounded-xl overflow-hidden shadow-lg hover:shadow-xl border border-[#333] transform transition-all hover:translate-y-[-5px]" 
                    data-aos="fade-up" 
                    data-aos-delay={index % 5 * 50}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/4 bg-[#1a1a1a] p-6 flex items-center justify-center">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="max-w-full max-h-40 object-contain"
                        />
                      </div>
                      <div className="w-full md:w-3/4 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-orbitron font-bold text-white hover:text-[#0bff7e] transition-colors">
                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                          </h3>
                          <div className="flex items-center">
                            {product.discount && product.discount > 0 && (
                              <span className="bg-[#0bff7e] text-black text-xs font-bold px-2 py-1 rounded-full mr-2">
                                {product.discount}% OFF
                              </span>
                            )}
                            <div className="flex items-center space-x-1 text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas ${i < Math.floor(product.rating) ? 'fa-star' : i < product.rating ? 'fa-star-half-alt' : 'far fa-star'}`}></i>
                              ))}
                              <span className="text-gray-400 text-sm ml-1">({product.reviews})</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-[#2a2a2a] text-gray-300 text-xs px-2 py-1 rounded">
                            {product.category}
                          </span>
                          <span className="bg-[#2a2a2a] text-gray-300 text-xs px-2 py-1 rounded">
                            {product.brand}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                              <span className="text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold rounded-lg transform transition-transform hover:scale-105">
                              Add to Cart
                            </button>
                            <button className="p-2 border border-[#424242] text-white hover:border-[#ff6b9d] hover:bg-[#ff6b9d] hover:text-black rounded-lg transition-colors">
                              <i className="far fa-heart"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add custom scrollbar styling and animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #2d2d2d;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4d4d4d;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #5d5d5d;
          }
          
          /* Animations */
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 5px rgba(11, 255, 126, 0.2); }
            50% { box-shadow: 0 0 20px rgba(11, 255, 126, 0.6); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `
      }} />
    </div>
  );
};

export default ProductListingPage;

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import ProductCard from '../components/ProductCard';
import { getAllProducts, filterProducts } from '../data/products';
import { categories } from '../data/categories';

const ProductListingPage: React.FC = () => {
  const [location] = useLocation();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter values
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  useEffect(() => {
    document.title = 'Products - MedTech';
    setLoading(true);
    
    // Get URL params
    const params = new URLSearchParams(location.split('?')[1]);
    const categoryParam = params.get('category');
    const filterParam = params.get('filter');
    const searchParam = params.get('search');
    
    // Set initial filters based on URL params
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    // Special filter (deals, new, etc.)
    if (filterParam) {
      setSortBy(filterParam);
    }
    
    // Get all products and apply filters
    const allProducts = getAllProducts();
    setProducts(allProducts);
    
    setLoading(false);
  }, [location]);
  
  // Apply filters when filters change
  useEffect(() => {
    if (products.length > 0) {
      const filtered = filterProducts(products, {
        category: selectedCategory,
        priceRange,
        sortBy,
        searchTerm
      });
      setFilteredProducts(filtered);
    }
  }, [products, selectedCategory, priceRange, sortBy, searchTerm]);
  
  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 2000]);
    setSortBy('featured');
    setSearchTerm('');
  };
  
  return (
    <div className="py-16 bg-[#121212]">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-orbitron font-bold text-white mb-2">
            {selectedCategory ? 
              `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` : 
              'All Products'
            }
          </h1>
          <p className="text-gray-400">
            {filteredProducts.length} products found
            {(selectedCategory || searchTerm || sortBy !== 'featured' || (priceRange[0] > 0 || priceRange[1] < 2000)) && 
              <button 
                className="ml-2 text-[#00b3ff] hover:underline"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            }
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-[#1e1e1e] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-orbitron font-bold text-white mb-4">Categories</h2>
              <div className="space-y-2">
                <div 
                  className={`cursor-pointer ${selectedCategory === '' ? 'text-[#0bff7e]' : 'text-white'} hover:text-[#0bff7e]`}
                  onClick={() => setSelectedCategory('')}
                >
                  All Categories
                </div>
                {categories.map(category => (
                  <div 
                    key={category.id}
                    className={`cursor-pointer ${selectedCategory === category.slug ? 'text-[#0bff7e]' : 'text-white'} hover:text-[#0bff7e]`}
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-orbitron font-bold text-white mb-4">Price Range</h2>
              <div className="mb-4">
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-lg p-6">
              <h2 className="text-xl font-orbitron font-bold text-white mb-4">Sort By</h2>
              <div className="space-y-2">
                <div 
                  className={`cursor-pointer ${sortBy === 'featured' ? 'text-[#0bff7e]' : 'text-white'} hover:text-[#0bff7e]`}
                  onClick={() => setSortBy('featured')}
                >
                  Featured
                </div>
                <div 
                  className={`cursor-pointer ${sortBy === 'price-low' ? 'text-[#0bff7e]' : 'text-white'} hover:text-[#0bff7e]`}
                  onClick={() => setSortBy('price-low')}
                >
                  Price: Low to High
                </div>
                <div 
                  className={`cursor-pointer ${sortBy === 'price-high' ? 'text-[#0bff7e]' : 'text-white'} hover:text-[#0bff7e]`}
                  onClick={() => setSortBy('price-high')}
                >
                  Price: High to Low
                </div>
                <div 
                  className={`cursor-pointer ${sortBy === 'rating' ? 'text-[#0bff7e]' : 'text-white'} hover:text-[#0bff7e]`}
                  onClick={() => setSortBy('rating')}
                >
                  Highest Rated
                </div>
                <div 
                  className={`cursor-pointer ${sortBy === 'deals' ? 'text-[#0bff7e]' : 'text-white'} hover:text-[#0bff7e]`}
                  onClick={() => setSortBy('deals')}
                >
                  Deals & Offers
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0bff7e]"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-[#1e1e1e] rounded-lg p-8 text-center">
                <i className="fas fa-search text-4xl text-gray-500 mb-4"></i>
                <h3 className="text-xl font-orbitron font-bold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search term</p>
                <button 
                  className="px-6 py-2 bg-[#0bff7e] text-black font-bold rounded-md"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} showBadge={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;

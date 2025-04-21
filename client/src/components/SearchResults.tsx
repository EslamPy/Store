import { Link, useLocation } from 'wouter';
import { Product } from '../data/products';
import { useEffect, useRef } from 'react';

interface SearchResultsProps {
  results: Product[];
  searchQuery: string;
  onSelectProduct: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, searchQuery, onSelectProduct }) => {
  const [_, setLocation] = useLocation();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Apply fade-in animation
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.style.opacity = '0';
      resultsRef.current.style.transform = 'translateY(-10px)';
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.style.opacity = '1';
          resultsRef.current.style.transform = 'translateY(0)';
        }
      }, 10);
    }
  }, [searchQuery]);
  
  const handleProductClick = () => {
    onSelectProduct();
  };
  
  const handleViewAllResults = () => {
    setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    onSelectProduct();
  };
  
  const handleCategoryClick = (category: string) => {
    setLocation(`/products?category=${encodeURIComponent(category.toLowerCase())}`);
    onSelectProduct();
  };
  
  return (
    <div 
      ref={resultsRef}
      className="absolute left-0 right-0 top-full mt-2 bg-[#1e1e1e] rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto transition-all duration-300"
      style={{ boxShadow: '0 4px 25px rgba(0, 176, 255, 0.2)' }}
    >
      <div className="p-4">
        {results.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 mb-3">SUGGESTED PRODUCTS</h3>
            <div className="space-y-3">
              {results.slice(0, 5).map(product => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div 
                    className="flex gap-3 items-center hover:bg-[#2d2d2d] p-3 rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={handleProductClick}
                  >
                    <img 
                      src={product.image}
                      alt={product.name} 
                      className="w-14 h-14 object-cover rounded-md border border-[#3d3d3d]"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium truncate">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[#0bff7e] font-bold">${product.price.toFixed(2)}</span>
                        <span className="text-xs text-gray-400">{product.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <i className="fas fa-search-minus text-2xl text-gray-500 mb-2"></i>
            <p className="text-gray-400">No products found for "{searchQuery}"</p>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-bold text-gray-400 mb-3">CATEGORIES</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleCategoryClick('CPUs')}
              className="text-left text-white hover:text-[#0bff7e] transition-colors py-1.5"
            >
              <i className="fas fa-microchip mr-2 text-gray-500"></i>CPUs
            </button>
            <button 
              onClick={() => handleCategoryClick('GPUs')}
              className="text-left text-white hover:text-[#0bff7e] transition-colors py-1.5"
            >
              <i className="fas fa-tv mr-2 text-gray-500"></i>GPUs
            </button>
            <button 
              onClick={() => handleCategoryClick('Memory')}
              className="text-left text-white hover:text-[#0bff7e] transition-colors py-1.5"
            >
              <i className="fas fa-memory mr-2 text-gray-500"></i>Memory
            </button>
            <button 
              onClick={() => handleCategoryClick('Storage')}
              className="text-left text-white hover:text-[#0bff7e] transition-colors py-1.5"
            >
              <i className="fas fa-hdd mr-2 text-gray-500"></i>Storage
            </button>
            <button 
              onClick={() => handleCategoryClick('Motherboards')}
              className="text-left text-white hover:text-[#0bff7e] transition-colors py-1.5"
            >
              <i className="fas fa-server mr-2 text-gray-500"></i>Motherboards
            </button>
            <button 
              onClick={() => handleCategoryClick('Cases')}
              className="text-left text-white hover:text-[#0bff7e] transition-colors py-1.5"
            >
              <i className="fas fa-box mr-2 text-gray-500"></i>Cases
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-[#2d2d2d] p-4 bg-[#1a1a1a]">
        <button 
          onClick={handleViewAllResults}
          className="text-[#0bff7e] hover:underline flex items-center"
        >
          <span>View all results</span>
          <i className="fas fa-arrow-right ml-2 text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default SearchResults;

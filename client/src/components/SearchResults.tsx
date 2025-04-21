import { Link } from 'wouter';
import { Product } from '../data/products';

interface SearchResultsProps {
  results: Product[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-[#1e1e1e] rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
      <div className="p-4">
        {results.length > 0 ? (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-400 mb-2">SUGGESTED PRODUCTS</h3>
            <div className="space-y-4">
              {results.slice(0, 5).map(product => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="flex gap-3 items-center hover:bg-[#2d2d2d] p-2 rounded-lg cursor-pointer">
                    <img 
                      src={product.image}
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="text-white font-medium">{product.name}</h4>
                      <span className="text-[#0bff7e] font-bold">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-gray-400">No products found</p>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-bold text-gray-400 mb-2">CATEGORIES</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/products?category=cpus" className="text-white hover:text-[#0bff7e] transition-colors">CPUs</Link>
            <Link href="/products?category=gpus" className="text-white hover:text-[#0bff7e] transition-colors">GPUs</Link>
            <Link href="/products?category=memory" className="text-white hover:text-[#0bff7e] transition-colors">Memory</Link>
            <Link href="/products?category=storage" className="text-white hover:text-[#0bff7e] transition-colors">Storage</Link>
          </div>
        </div>
      </div>
      
      <div className="border-t border-[#2d2d2d] p-4">
        <Link href="/products" className="text-[#0bff7e] hover:underline">View all results</Link>
      </div>
    </div>
  );
};

export default SearchResults;

import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import ProductCard from '../ProductCard';
import { getFeaturedProducts } from '../../data/products';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    setProducts(getFeaturedProducts());
  }, []);
  
  return (
    <section className="py-16 bg-[#121212]" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-orbitron font-bold text-white">Featured <span className="text-[#00b3ff]">Products</span></h2>
          <Link href="/products">
            <div className="text-[#00b3ff] font-poppins hover:underline cursor-pointer">View All</div>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              showBadge={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

import { Link } from 'wouter';
import { categories } from '../../data/categories';

const CategorySection: React.FC = () => {
  return (
    <section className="py-16 bg-[#121212]" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold mb-12 text-center">Shop By <span className="text-[#0bff7e]">Category</span></h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <div 
                className="category-card relative h-60 rounded-lg overflow-hidden cyberpunk-border cursor-pointer" 
                data-aos="fade-up" 
                data-aos-delay={100 * (index + 1)}
              >
                <img 
                  src={category.image}
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="text-xl font-orbitron font-bold text-white">{category.name}</h3>
                  <p className="text-sm text-gray-300">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

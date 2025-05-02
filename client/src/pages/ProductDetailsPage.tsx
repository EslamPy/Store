import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useCurrency } from '../context/CurrencyContext';
import { getProductById, getSimilarProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductImageViewer from '../components/ProductImageViewer';

const ProductDetailsPage: React.FC = () => {
  const [match, params] = useRoute<{ id: string }>('/product/:id');
  const [product, setProduct] = useState<any | null>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { convertPrice, formatPrice } = useCurrency();
  
  useEffect(() => {
    const fetchProductData = () => {
      if (params && params.id) {
        setLoading(true);
        const productId = parseInt(params.id);
        const fetchedProduct = getProductById(productId);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          document.title = `${fetchedProduct.name} - MedTech`;
          
          // Get similar products
          setSimilarProducts(getSimilarProducts(productId, fetchedProduct.category));
        }
        
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [params?.id]); // Only depend on the ID parameter
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="py-16 bg-[#121212] min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0bff7e]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="py-16 bg-[#121212] min-h-screen">
        <div className="container mx-auto px-4">
          <div className="bg-[#1e1e1e] rounded-lg p-8 text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Product Not Found</h2>
            <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/products">
              <div className="px-6 py-3 bg-[#0bff7e] text-black font-bold rounded-md cursor-pointer text-center">
                Browse All Products
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Generate additional images for carousel
  const productImages = [
    product.image,
    ...(product.additionalImages || [])
  ];
  
  const inWishlist = isInWishlist(product.id);
  
  return (
    <div className="py-16 bg-[#121212]">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm">
          <Link href="/">
            <div className="text-gray-400 hover:text-white cursor-pointer">Home</div>
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href="/products">
            <div className="text-gray-400 hover:text-white cursor-pointer">Products</div>
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/products?category=${product.category.toLowerCase()}`}>
            <div className="text-gray-400 hover:text-white cursor-pointer">{product.category}</div>
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-white">{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images - Now using the new interactive component */}
          <ProductImageViewer images={productImages} productName={product.name} />
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas ${i < Math.floor(product.rating) ? 'fa-star' : i < product.rating ? 'fa-star-half-alt' : 'far fa-star'}`}
                    ></i>
                  ))}
                </div>
                <span className="text-sm text-gray-400 ml-2">({product.reviews} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-white">{formatPrice(convertPrice(product.price))}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(convertPrice(product.originalPrice))}</span>
                  <span className="text-green-500 text-sm font-bold">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            
            <p className="text-gray-300">
              {product.description}
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Availability</span>
                <span className="text-green-500">In Stock</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">SKU</span>
                <span className="text-white">{product.sku}</span>
              </div>
              {product.warranty && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Warranty</span>
                  <span className="text-white">{product.warranty}</span>
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-[#2d2d2d] space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-[#2d2d2d] rounded-md">
                  <button 
                    className="px-3 py-2 text-gray-400 hover:text-white"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="w-10 text-center text-white">{quantity}</span>
                  <button 
                    className="px-3 py-2 text-gray-400 hover:text-white"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                
                <button 
                  className="flex-1 btn-hover-effect px-6 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary font-poppins"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                
                <button 
                  className={`btn-hover-effect p-3 border rounded-md transition-colors ${
                    inWishlist 
                      ? 'bg-[#ff6b9d] border-[#ff6b9d] text-white' 
                      : 'border-[#00b3ff] text-white hover:bg-[#00b3ff] hover:text-black'
                  }`}
                  onClick={handleWishlist}
                >
                  <i className={`${inWishlist ? 'fas' : 'far'} fa-heart`}></i>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="text-gray-400 hover:text-[#0bff7e] transition-colors text-sm">
                  <i className="fas fa-share-alt mr-2"></i> Share
                </button>
                <button 
                  className={`transition-colors text-sm ${
                    inWishlist ? 'text-[#ff6b9d]' : 'text-gray-400 hover:text-[#ff6b9d]'
                  }`}
                  onClick={handleWishlist}
                >
                  <i className={`${inWishlist ? 'fas' : 'far'} fa-heart mr-2`}></i> 
                  {inWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
                </button>
                <button className="text-gray-400 hover:text-[#0bff7e] transition-colors text-sm">
                  <i className="fas fa-chart-bar mr-2"></i> Compare
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mb-16">
          <div className="border-b border-[#2d2d2d] mb-6">
            <div className="flex overflow-x-auto">
              <button 
                className={`px-6 py-3 font-orbitron font-bold text-sm transition-colors ${
                  activeTab === 'description' ? 'text-[#0bff7e] border-b-2 border-[#0bff7e]' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`px-6 py-3 font-orbitron font-bold text-sm transition-colors ${
                  activeTab === 'specifications' ? 'text-[#0bff7e] border-b-2 border-[#0bff7e]' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={`px-6 py-3 font-orbitron font-bold text-sm transition-colors ${
                  activeTab === 'reviews' ? 'text-[#0bff7e] border-b-2 border-[#0bff7e]' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.reviews})
              </button>
            </div>
          </div>
          
          <div className="bg-[#1e1e1e] rounded-lg p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-300 mb-4">
                  {product.fullDescription || product.description}
                </p>
                <p className="text-gray-300">
                  Experience next-generation performance with the {product.name}. 
                  Designed for enthusiasts and professionals who demand the best, 
                  this component delivers exceptional speed, efficiency, and reliability.
                </p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="space-y-4">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b border-[#2d2d2d] pb-2">
                    <div className="w-1/3 text-gray-400">{key}</div>
                    <div className="w-2/3 text-white">{value as React.ReactNode}</div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="space-y-6 mb-8">
                  {/* Sample reviews - in a real app these would come from the product data */}
                  <div className="pb-4 border-b border-[#2d2d2d]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-bold">John D.</h4>
                      <div className="text-yellow-400 flex text-sm">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">Verified Purchase - 2 months ago</p>
                    <p className="text-gray-300">
                      Amazing performance! This component exceeded my expectations. 
                      Highly recommended for any serious PC build.
                    </p>
                  </div>
                  
                  <div className="pb-4 border-b border-[#2d2d2d]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-bold">Sarah L.</h4>
                      <div className="text-yellow-400 flex text-sm">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">Verified Purchase - 1 month ago</p>
                    <p className="text-gray-300">
                      Great value for the price. Installation was straightforward and it works perfectly with my setup.
                    </p>
                  </div>
                </div>
                
                <button className="px-6 py-3 border border-[#0bff7e] text-[#0bff7e] hover:bg-[#0bff7e] hover:text-black transition-colors font-bold rounded-md">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
        
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {similarProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;

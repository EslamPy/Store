import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Product } from '../data/products';
import ProductForm from '../components/admin/ProductForm';
import { useProducts } from '../context/ProductContext';
import { useNotification } from '../components/ui/NotificationManager';
import { useCurrency } from '../context/CurrencyContext';
import { ToastType } from '../components/ui/CustomToast';

const AdminPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showNotification } = useNotification();
  const { convertPrice, formatPrice } = useCurrency();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Admin Dashboard - MedTech';
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (newProduct: Product) => {
    addProduct(newProduct);
    setIsAddingProduct(false);
    showNotification('Product added successfully!', 'success');
  };

  const handleEditProduct = (updatedProduct: Product) => {
    updateProduct(updatedProduct);
    setIsEditingProduct(false);
    setSelectedProduct(null);
    showNotification('Product updated successfully!', 'success');
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct(id);
      showNotification('Product deleted successfully!', 'success');
    }
  };

  const startAddingProduct = () => {
    setIsAddingProduct(true);
    setIsEditingProduct(false);
    setSelectedProduct(null);
  };

  const startEditingProduct = (product: Product) => {
    setIsEditingProduct(true);
    setIsAddingProduct(false);
    setSelectedProduct(product);
  };

  const cancelForm = () => {
    setIsAddingProduct(false);
    setIsEditingProduct(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#121212] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-orbitron font-bold text-white mb-4 md:mb-0">Product Management</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setLocation('/dashboard')}
              className="px-4 py-2 bg-[#2d2d2d] text-white rounded hover:bg-[#3d3d3d] transition-colors"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={startAddingProduct}
              className="px-4 py-2 bg-[#0bff7e] text-black font-bold rounded hover:bg-[#00d966] transition-colors"
            >
              Add New Product
            </button>
          </div>
        </div>

        {(isAddingProduct || isEditingProduct) ? (
          <div className="bg-[#1e1e1e] rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
              {isAddingProduct ? 'Add New Product' : 'Edit Product'}
            </h2>
            <ProductForm 
              product={selectedProduct} 
              onSubmit={isAddingProduct ? handleAddProduct : handleEditProduct}
              onCancel={cancelForm}
            />
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full md:w-1/3 bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Product List */}
            <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2d2d2d]">
                  <thead className="bg-[#2d2d2d]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2d2d2d]">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-[#252525]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-12 w-12 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-white">{product.name}</div>
                          <div className="text-gray-400 text-sm">SKU: {product.sku}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-white">{formatPrice(convertPrice(product.price))}</div>
                          {product.originalPrice && (
                            <div className="text-gray-400 text-sm line-through">{formatPrice(convertPrice(product.originalPrice))}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${product.inStock ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-3">
                            <button 
                              onClick={() => window.open(`/product/${product.id}`, '_blank')}
                              className="p-2 rounded-md flex items-center justify-center bg-purple-900 bg-opacity-30 text-purple-400 hover:bg-opacity-50 transition-all duration-200"
                              title="View Product"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              onClick={() => startEditingProduct(product)}
                              className="p-2 rounded-md flex items-center justify-center bg-blue-900 bg-opacity-30 text-blue-400 hover:bg-opacity-50 transition-all duration-200"
                              title="Edit Product"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 rounded-md flex items-center justify-center bg-red-900 bg-opacity-30 text-red-400 hover:bg-opacity-50 transition-all duration-200"
                              title="Delete Product"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No products found matching your search.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 
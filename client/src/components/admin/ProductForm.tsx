import React, { useState, useEffect } from 'react';
import { Product } from '../../data/products';

interface ProductFormProps {
  product: Product | null;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

// Default empty product template
const emptyProduct: Product = {
  id: 0,
  name: '',
  description: '',
  fullDescription: '',
  category: '',
  brand: '',
  price: 0,
  originalPrice: undefined,
  rating: 0,
  reviews: 0,
  image: '',
  additionalImages: [],
  specifications: {},
  badge: '',
  sku: '',
  warranty: '',
  inStock: true,
  featured: false,
  new: false,
  discount: 0
};

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Product>(emptyProduct);
  const [additionalImageUrl, setAdditionalImageUrl] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        // Ensure specifications is an object
        specifications: product.specifications || {}
      });
    } else {
      setFormData(emptyProduct);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addAdditionalImage = () => {
    if (additionalImageUrl && additionalImageUrl.trim() !== '') {
      const updatedImages = [...(formData.additionalImages || []), additionalImageUrl];
      setFormData({ ...formData, additionalImages: updatedImages });
      setAdditionalImageUrl('');
    }
  };

  const removeAdditionalImage = (index: number) => {
    const updatedImages = [...(formData.additionalImages || [])];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, additionalImages: updatedImages });
  };

  const addSpecification = () => {
    if (specKey && specKey.trim() !== '' && specValue && specValue.trim() !== '') {
      const updatedSpecs = {
        ...(formData.specifications || {}),
        [specKey]: specValue
      };
      setFormData({ ...formData, specifications: updatedSpecs });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const updatedSpecs = { ...(formData.specifications || {}) };
    delete updatedSpecs[key];
    setFormData({ ...formData, specifications: updatedSpecs });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.image) newErrors.image = 'Image URL is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Available categories for the dropdown
  const categories = [
    'CPUs',
    'GPUs',
    'Memory',
    'Storage',
    'Motherboards',
    'Cooling',
    'Power Supplies',
    'Cases',
    'Accessories',
    'Monitors',
    'Peripherals'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h3 className="text-xl text-white font-bold">Basic Information</h3>
          
          {/* Name */}
          <div>
            <label className="block text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full bg-[#2d2d2d] text-white border rounded-lg px-4 py-2 outline-none ${errors.name ? 'border-red-500' : 'border-[#3d3d3d] focus:border-[#0bff7e]'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          {/* SKU */}
          <div>
            <label className="block text-gray-300 mb-1">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className={`w-full bg-[#2d2d2d] text-white border rounded-lg px-4 py-2 outline-none ${errors.sku ? 'border-red-500' : 'border-[#3d3d3d] focus:border-[#0bff7e]'}`}
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-gray-300 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full bg-[#2d2d2d] text-white border rounded-lg px-4 py-2 outline-none appearance-none ${errors.category ? 'border-red-500' : 'border-[#3d3d3d] focus:border-[#0bff7e]'}`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          
          {/* Brand */}
          <div>
            <label className="block text-gray-300 mb-1">Brand *</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className={`w-full bg-[#2d2d2d] text-white border rounded-lg px-4 py-2 outline-none ${errors.brand ? 'border-red-500' : 'border-[#3d3d3d] focus:border-[#0bff7e]'}`}
            />
            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              className={`w-full bg-[#2d2d2d] text-white border rounded-lg px-4 py-2 outline-none ${errors.description ? 'border-red-500' : 'border-[#3d3d3d] focus:border-[#0bff7e]'}`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          {/* Full Description */}
          <div>
            <label className="block text-gray-300 mb-1">Full Description</label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription || ''}
              onChange={handleInputChange}
              rows={5}
              className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
            ></textarea>
          </div>
          
          {/* Badge */}
          <div>
            <label className="block text-gray-300 mb-1">Badge</label>
            <input
              type="text"
              name="badge"
              value={formData.badge || ''}
              onChange={handleInputChange}
              placeholder="e.g., New, Hot, Limited"
              className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
            />
          </div>
          
          {/* Warranty */}
          <div>
            <label className="block text-gray-300 mb-1">Warranty</label>
            <input
              type="text"
              name="warranty"
              value={formData.warranty || ''}
              onChange={handleInputChange}
              placeholder="e.g., 3 Years"
              className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
            />
          </div>
        </div>
        
        {/* Pricing and Images Section */}
        <div className="space-y-4">
          <h3 className="text-xl text-white font-bold">Pricing & Images</h3>
          
          {/* Price */}
          <div>
            <label className="block text-gray-300 mb-1">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full bg-[#2d2d2d] text-white border rounded-lg px-4 py-2 outline-none ${errors.price ? 'border-red-500' : 'border-[#3d3d3d] focus:border-[#0bff7e]'}`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          
          {/* Original Price */}
          <div>
            <label className="block text-gray-300 mb-1">Original Price</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice || ''}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
            />
          </div>
          
          {/* Discount */}
          <div>
            <label className="block text-gray-300 mb-1">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount || ''}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
            />
          </div>
          
          {/* Main Image */}
          <div>
            <label className="block text-gray-300 mb-1">Main Image URL *</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className={`w-full bg-[#2d2d2d] text-white border rounded-lg px-4 py-2 outline-none ${errors.image ? 'border-red-500' : 'border-[#3d3d3d] focus:border-[#0bff7e]'}`}
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            {formData.image && (
              <div className="mt-2">
                <img src={formData.image} alt="Preview" className="h-24 w-auto object-cover rounded" />
              </div>
            )}
          </div>
          
          {/* Additional Images */}
          <div>
            <label className="block text-gray-300 mb-1">Additional Images</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={additionalImageUrl}
                onChange={(e) => setAdditionalImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
              />
              <button
                type="button"
                onClick={addAdditionalImage}
                className="px-4 py-2 bg-[#3d3d3d] text-white rounded hover:bg-[#4d4d4d] transition-colors"
              >
                Add
              </button>
            </div>
            
            {formData.additionalImages && formData.additionalImages.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {formData.additionalImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Additional ${index + 1}`} className="h-20 w-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Specifications Section */}
      <div className="pt-4">
        <h3 className="text-xl text-white font-bold mb-4">Specifications</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            placeholder="Key (e.g., Memory)"
            className="flex-1 bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
          />
          <input
            type="text"
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            placeholder="Value (e.g., 16GB DDR4)"
            className="flex-1 bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
          />
          <button
            type="button"
            onClick={addSpecification}
            className="px-4 py-2 bg-[#3d3d3d] text-white rounded hover:bg-[#4d4d4d] transition-colors"
          >
            Add
          </button>
        </div>
        
        {formData.specifications && Object.keys(formData.specifications).length > 0 && (
          <div className="bg-[#2d2d2d] rounded-lg p-4 mb-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#4d4d4d]">
                  <th className="pb-2 text-gray-300">Key</th>
                  <th className="pb-2 text-gray-300">Value</th>
                  <th className="pb-2 text-gray-300 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <tr key={key} className="border-b border-[#4d4d4d]">
                    <td className="py-2 text-white">{key}</td>
                    <td className="py-2 text-white">{value}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Flags and Status Section */}
      <div className="pt-4">
        <h3 className="text-xl text-white font-bold mb-4">Status & Flags</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
              className="h-5 w-5 bg-[#2d2d2d] border border-[#3d3d3d] rounded text-[#0bff7e] focus:ring-[#0bff7e]"
            />
            <label htmlFor="inStock" className="ml-2 text-gray-300">In Stock</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="h-5 w-5 bg-[#2d2d2d] border border-[#3d3d3d] rounded text-[#0bff7e] focus:ring-[#0bff7e]"
            />
            <label htmlFor="featured" className="ml-2 text-gray-300">Featured</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="new"
              name="new"
              checked={formData.new}
              onChange={handleInputChange}
              className="h-5 w-5 bg-[#2d2d2d] border border-[#3d3d3d] rounded text-[#0bff7e] focus:ring-[#0bff7e]"
            />
            <label htmlFor="new" className="ml-2 text-gray-300">New</label>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="pt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#3d3d3d] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#0bff7e] text-black font-bold rounded-lg hover:bg-[#00d966] transition-colors"
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 
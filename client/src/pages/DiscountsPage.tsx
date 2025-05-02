import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useProducts } from '../context/ProductContext';
import { motion } from 'framer-motion';

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  validUntil: Date;
  usageLimit: number;
  usageCount: number;
  status: 'active' | 'expired' | 'used';
  createdAt: Date;
  products: string[];
}

const DiscountsPage: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { products } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('10');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [newPromoCode, setNewPromoCode] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<string>('100');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Get stored promo codes from localStorage on mount
  useEffect(() => {
    const storedCodes = localStorage.getItem('promoCodes');
    if (storedCodes) {
      try {
        const parsedCodes = JSON.parse(storedCodes);
        // Convert date strings back to Date objects
        const formattedCodes = parsedCodes.map((code: any) => ({
          ...code,
          validUntil: new Date(code.validUntil),
          createdAt: new Date(code.createdAt)
        }));
        setPromoCodes(formattedCodes);
      } catch (error) {
        console.error('Error parsing stored promo codes:', error);
      }
    }

    // Set default expiry date to one month from now
    const defaultExpiry = new Date();
    defaultExpiry.setMonth(defaultExpiry.getMonth() + 1);
    setExpiryDate(defaultExpiry.toISOString().split('T')[0]);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 30 }
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }
  };

  // Generate random promo code
  const generatePromoCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'MEDTECH';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Filter products based on search term and filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'discounted' && product.discount && product.discount > 0) ||
                         (filterBy === 'not-discounted' && (!product.discount || product.discount === 0));
    return matchesSearch && matchesFilter;
  });

  // Handle selection of all products
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  // Toggle selection of a product
  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Apply discount to selected products
  const applyDiscount = () => {
    if (selectedProducts.length === 0) {
      setIsError(true);
      setErrorMessage('Please select at least one product');
      setTimeout(() => setIsError(false), 3000);
      return;
    }

    // In a real app, this would be an API call
    // For now, we'll just show a success message
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  // Generate and save a new promo code
  const handleGeneratePromoCode = () => {
    if (selectedProducts.length === 0) {
      setIsError(true);
      setErrorMessage('Please select at least one product for the promo code');
      setTimeout(() => setIsError(false), 3000);
      return;
    }

    setIsGenerating(true);
    
    // Generate a new code if none is provided, otherwise use the input
    const code = newPromoCode.trim() === '' ? generatePromoCode() : newPromoCode;
    
    // Create new promo code object
    const newCode: PromoCode = {
      id: `promo-${Date.now()}`,
      code,
      discount: parseFloat(discountValue),
      type: discountType,
      validUntil: new Date(expiryDate),
      usageLimit: parseInt(usageLimit),
      usageCount: 0,
      status: 'active',
      createdAt: new Date(),
      products: [...selectedProducts]
    };

    // Add to state
    const updatedCodes = [newCode, ...promoCodes];
    setPromoCodes(updatedCodes);
    
    // Save to localStorage
    localStorage.setItem('promoCodes', JSON.stringify(updatedCodes));
    
    // Reset form and show success
    setNewPromoCode('');
    setSelectedProducts([]);
    setIsGenerating(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  // Copy promo code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopySuccess(code);
      setTimeout(() => setCopySuccess(null), 2000);
    });
  };

  // Delete a promo code
  const deletePromoCode = (id: string) => {
    const updatedCodes = promoCodes.filter(code => code.id !== id);
    setPromoCodes(updatedCodes);
    localStorage.setItem('promoCodes', JSON.stringify(updatedCodes));
  };

  // Toggle promo code status
  const togglePromoCodeStatus = (id: string) => {
    const updatedCodes = promoCodes.map(code => {
      if (code.id === id) {
        return {
          ...code,
          status: code.status === 'active' ? 'expired' : 'active'
        };
      }
      return code;
    });
    
    setPromoCodes(updatedCodes);
    localStorage.setItem('promoCodes', JSON.stringify(updatedCodes));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1c1c1c]">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => setLocation('/dashboard')}
                className="p-2 mr-3 text-gray-400 hover:text-white rounded-md hover:bg-[#2a2a2a] transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div className="flex items-center">
                <h1 className="text-xl font-orbitron font-bold text-white mr-2">
                  Discount Management
                </h1>
                <span className="text-xs px-2 py-1 bg-[#00b3ff] text-black font-bold rounded-md uppercase">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Success and Error Messages */}
          {isSuccess && (
            <motion.div 
              className="bg-green-900 bg-opacity-20 border border-green-800 text-green-500 px-4 py-3 rounded-xl flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <i className="fas fa-check-circle mr-2"></i>
              <span>Operation completed successfully!</span>
            </motion.div>
          )}
          
          {isError && (
            <motion.div 
              className="bg-red-900 bg-opacity-20 border border-red-800 text-red-500 px-4 py-3 rounded-xl flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <i className="fas fa-exclamation-circle mr-2"></i>
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Main grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Product selection */}
            <motion.div 
              variants={cardVariants}
              className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
            >
              <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
                <h2 className="text-xl font-orbitron font-bold text-white">Select Products</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..." 
                      className="bg-[#2a2a2a] text-white text-sm rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#00b3ff] focus:ring-opacity-50"
                    />
                  </div>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="bg-[#2a2a2a] text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b3ff] focus:ring-opacity-50"
                  >
                    <option value="all">All Products</option>
                    <option value="discounted">Discounted</option>
                    <option value="not-discounted">Not Discounted</option>
                  </select>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-4 px-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded bg-[#2a2a2a] border-[#3a3a3a] text-[#00b3ff] focus:ring-[#00b3ff] focus:ring-opacity-25"
                    />
                    <label htmlFor="select-all" className="ml-2 text-white">
                      {selectedProducts.length === 0 ? 'Select All' : `Selected ${selectedProducts.length} of ${filteredProducts.length}`}
                    </label>
                  </div>
                  
                  {selectedProducts.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedProducts([])}
                      className="text-gray-400 text-sm hover:text-white"
                    >
                      Clear Selection
                    </motion.button>
                  )}
                </div>

                <div className="overflow-y-auto max-h-96">
                  <div className="space-y-2">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <motion.div 
                          key={product.id}
                          variants={itemVariants}
                          whileHover={{ backgroundColor: 'rgba(42, 42, 42, 0.5)' }}
                          className={`p-4 rounded-xl flex items-center ${
                            selectedProducts.includes(product.id) ? 'bg-[#00b3ff] bg-opacity-10 border border-[#00b3ff] border-opacity-20' : 'bg-[#1e1e1e]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={`product-${product.id}`}
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="w-4 h-4 rounded bg-[#2a2a2a] border-[#3a3a3a] text-[#00b3ff] focus:ring-[#00b3ff] focus:ring-opacity-25"
                          />
                          <div className="w-12 h-12 rounded-lg overflow-hidden ml-4">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-grow">
                            <div className="text-white font-medium">{product.name}</div>
                            <div className="text-gray-400 text-sm">{product.category}</div>
                          </div>
                          <div>
                            <div className="text-white font-bold">${product.price.toFixed(2)}</div>
                            {product.discount && product.discount > 0 && (
                              <div className="text-[#0bff7e] text-xs text-right">
                                {product.discount}% off
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        No products found matching your criteria
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column - Discount settings */}
            <motion.div 
              variants={cardVariants}
              className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
            >
              <div className="p-6 border-b border-[#2a2a2a]">
                <h2 className="text-xl font-orbitron font-bold text-white">Discount Settings</h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">Discount Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDiscountType('percentage')}
                        className={`p-3 rounded-xl flex items-center justify-center transition-colors ${
                          discountType === 'percentage' 
                            ? 'bg-[#00b3ff] bg-opacity-10 border border-[#00b3ff] text-[#00b3ff]' 
                            : 'bg-[#2a2a2a] text-gray-400 border border-transparent'
                        }`}
                      >
                        <i className="fas fa-percent mr-2"></i>
                        <span>Percentage</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDiscountType('fixed')}
                        className={`p-3 rounded-xl flex items-center justify-center transition-colors ${
                          discountType === 'fixed' 
                            ? 'bg-[#00b3ff] bg-opacity-10 border border-[#00b3ff] text-[#00b3ff]' 
                            : 'bg-[#2a2a2a] text-gray-400 border border-transparent'
                        }`}
                      >
                        <i className="fas fa-dollar-sign mr-2"></i>
                        <span>Fixed Amount</span>
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="discount-value" className="block text-gray-400 mb-2 text-sm">Discount Value</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className={`fas ${discountType === 'percentage' ? 'fa-percent' : 'fa-dollar-sign'} text-gray-500`}></i>
                      </div>
                      <input
                        type="number"
                        id="discount-value"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        min="0"
                        max={discountType === 'percentage' ? "100" : "1000"}
                        className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#00b3ff] focus:ring-2 focus:ring-[#00b3ff] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                        placeholder={discountType === 'percentage' ? "10" : "10.00"}
                      />
                    </div>
                    <p className="mt-1 text-gray-400 text-xs">
                      {discountType === 'percentage' 
                        ? 'Enter a percentage between 1-100%' 
                        : 'Enter a fixed amount in dollars'}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={applyDiscount}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#00b3ff] to-[#0bff7e] hover:from-[#00c3ff] hover:to-[#00ffbb] text-black font-bold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 flex justify-center items-center"
                  >
                    <i className="fas fa-tag mr-2"></i>
                    Apply Discount to Selected
                  </motion.button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#2a2a2a]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-[#1a1a1a] text-gray-400 text-sm">OR</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Generate Promo Code</h3>
                  
                  <div>
                    <label htmlFor="promo-code" className="block text-gray-400 mb-2 text-sm">Promo Code (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-ticket-alt text-gray-500"></i>
                      </div>
                      <input
                        type="text"
                        id="promo-code"
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value)}
                        className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#00b3ff] focus:ring-2 focus:ring-[#00b3ff] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                        placeholder="Leave empty to generate automatically"
                      />
                    </div>
                    <p className="mt-1 text-gray-400 text-xs">Custom code or leave empty for auto-generate</p>
                  </div>

                  <div>
                    <label htmlFor="expiry-date" className="block text-gray-400 mb-2 text-sm">Valid Until</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-calendar-alt text-gray-500"></i>
                      </div>
                      <input
                        type="date"
                        id="expiry-date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#00b3ff] focus:ring-2 focus:ring-[#00b3ff] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="usage-limit" className="block text-gray-400 mb-2 text-sm">Usage Limit</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-users text-gray-500"></i>
                      </div>
                      <input
                        type="number"
                        id="usage-limit"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        min="1"
                        className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#00b3ff] focus:ring-2 focus:ring-[#00b3ff] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                        placeholder="100"
                      />
                    </div>
                    <p className="mt-1 text-gray-400 text-xs">Maximum number of times the code can be used</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGeneratePromoCode}
                    disabled={isGenerating}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#9d00ff] to-[#00b3ff] hover:from-[#bd00ff] hover:to-[#00c3ff] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 flex justify-center items-center"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>
                        Generate Promo Code
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Promo Codes List */}
          <motion.div 
            variants={cardVariants}
            className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
          >
            <div className="p-6 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-orbitron font-bold text-white">Active Promo Codes</h2>
            </div>

            {promoCodes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="border-b border-[#2a2a2a] bg-[#202020]">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valid Until</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usage</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoCodes.map((promoCode, index) => (
                      <motion.tr 
                        key={promoCode.id}
                        variants={itemVariants}
                        className="border-b border-[#2a2a2a] hover:bg-[#202020]"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-white font-mono font-bold">{promoCode.code}</span>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(promoCode.code)}
                              className="ml-2 text-gray-400 hover:text-[#00b3ff]"
                            >
                              {copySuccess === promoCode.code ? (
                                <i className="fas fa-check text-green-500"></i>
                              ) : (
                                <i className="far fa-copy"></i>
                              )}
                            </motion.button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white">
                            {promoCode.type === 'percentage' ? `${promoCode.discount}%` : `$${promoCode.discount.toFixed(2)}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-400 text-sm">
                            {promoCode.products.length} {promoCode.products.length === 1 ? 'product' : 'products'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-300 text-sm">
                            {promoCode.validUntil.toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-300 text-sm">
                            {promoCode.usageCount}/{promoCode.usageLimit}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            promoCode.status === 'active' 
                              ? 'bg-green-900 bg-opacity-20 text-green-500' 
                              : promoCode.status === 'expired'
                                ? 'bg-red-900 bg-opacity-20 text-red-500'
                                : 'bg-yellow-900 bg-opacity-20 text-yellow-500'
                          }`}>
                            {promoCode.status.charAt(0).toUpperCase() + promoCode.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => togglePromoCodeStatus(promoCode.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                promoCode.status === 'active'
                                  ? 'text-red-500 hover:bg-red-500 hover:bg-opacity-10'
                                  : 'text-green-500 hover:bg-green-500 hover:bg-opacity-10'
                              }`}
                            >
                              <i className={`fas ${promoCode.status === 'active' ? 'fa-ban' : 'fa-check'}`}></i>
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deletePromoCode(promoCode.id)}
                              className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-colors"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-ticket-alt text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Promo Codes Yet</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Generate your first promo code by selecting products and using the form above.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DiscountsPage; 
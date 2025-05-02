import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getDiscountedProducts } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';

// Owner email constant
const OWNER_EMAIL = 'eslamdev@outlook.de';

// User interface
interface User {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor';
  authorized: boolean;
}

// Set Discounts Modal Component
const SetDiscountsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  updateProductDiscount: (productId: string, discount: number) => void;
}> = ({ isOpen, onClose, products, updateProductDiscount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bulkDiscount, setBulkDiscount] = useState(0);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [discountValues, setDiscountValues] = useState<{[key: string | number]: number}>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Initialize discount values from products
  useEffect(() => {
    const initialValues: {[key: string]: number} = {};
    products.forEach(product => {
      initialValues[product.id] = product.discount || 0;
    });
    setDiscountValues(initialValues);
  }, [products]);
  
  // Handle individual discount change
  const handleDiscountChange = (productId: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    setDiscountValues({
      ...discountValues,
      [productId]: Math.min(Math.max(numValue, 0), 99)
    });
  };
  
  // Apply bulk discount to filtered products
  const applyBulkDiscount = () => {
    const newDiscountValues = { ...discountValues };
    filteredProducts.forEach(product => {
      newDiscountValues[product.id] = bulkDiscount;
    });
    setDiscountValues(newDiscountValues);
  };
  
  // Save all discount changes
  const saveDiscounts = () => {
    Object.entries(discountValues).forEach(([productId, discount]) => {
      updateProductDiscount(productId, discount);
    });
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  // Get top 3 discounted products for featured section
  const topDiscountedProducts = [...products]
    .sort((a, b) => ((discountValues[String(b.id)] || 0) - (discountValues[String(a.id)] || 0)))
    .slice(0, 3);
  
  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const successVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
          />
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div 
              className="bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#2a2a2a] w-full max-w-5xl max-h-[90vh] overflow-hidden z-10"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
                <h3 className="text-2xl font-orbitron font-bold text-white">Set Product Discounts</h3>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a] transition-colors"
                >
                  <i className="fas fa-times"></i>
                </motion.button>
              </div>
              
              <div className="p-6 border-b border-[#2a2a2a] bg-[#202020]">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-grow">
                    <label className="block text-gray-400 mb-2 text-sm">Search Products</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-500"></i>
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                        placeholder="Search by product name..."
                      />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-48">
                    <label className="block text-gray-400 mb-2 text-sm">Filter by Category</label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl px-4 py-3 outline-none appearance-none"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i className="fas fa-chevron-down text-gray-500"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto flex space-x-2 items-center">
                    <div className="flex-grow md:w-32">
                      <label className="block text-gray-400 mb-2 text-sm">Bulk Discount %</label>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={bulkDiscount}
                        onChange={(e) => setBulkDiscount(Number(e.target.value))}
                        className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl px-4 py-3 outline-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={applyBulkDiscount}
                      className="px-4 py-3 rounded-xl bg-[#00b3ff] text-black font-bold shadow-lg flex items-center justify-center mt-8"
                    >
                      <i className="fas fa-tags mr-2"></i>
                      Apply Bulk
                    </motion.button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 240px)' }}>
                <table className="w-full min-w-full">
                  <thead className="sticky top-0 bg-[#1a1a1a] z-10">
                    <tr className="border-b border-[#2a2a2a]">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Final Price</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const currentDiscount = discountValues[product.id] || 0;
                      const finalPrice = product.price * (1 - currentDiscount / 100);
                      
                      return (
                        <motion.tr 
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-[#2a2a2a] hover:bg-[#202020]"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-lg bg-[#2a2a2a] mr-3">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white font-medium">{product.name}</span>
                                <span className="text-gray-400 text-xs">ID: {product.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">${product.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                value={currentDiscount}
                                onChange={(e) => handleDiscountChange(product.id, e.target.value)}
                                className="w-16 bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-1 focus:ring-[#0bff7e] rounded-lg px-2 py-1 outline-none"
                              />
                              <span className="text-gray-400">%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-medium ${currentDiscount > 0 ? 'text-[#0bff7e]' : 'text-white'}`}>
                              ${finalPrice.toFixed(2)}
                            </span>
                            {currentDiscount > 0 && (
                              <span className="ml-2 text-xs line-through text-gray-500">${product.price.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center space-x-2">
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDiscountChange(product.id, '0')}
                                className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-colors"
                                title="Clear Discount"
                              >
                                <i className="fas fa-times-circle"></i>
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                    
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                          No products found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 border-t border-[#2a2a2a] flex justify-between items-center bg-[#202020]">
                <div className="text-gray-400 text-sm">
                  Showing <span className="text-white">{filteredProducts.length}</span> of <span className="text-white">{products.length}</span> products
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveDiscounts}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold shadow-lg flex items-center"
                >
                  <i className="fas fa-save mr-2"></i>
                  Save All Discounts
                </motion.button>
              </div>
              
              {/* Featured discount spotlight section */}
              {topDiscountedProducts.length > 0 && topDiscountedProducts.some(p => (discountValues[String(p.id)] || 0) > 0) && (
                <div className="p-6 border-t border-[#2a2a2a]">
                  <h4 className="text-lg font-orbitron font-bold text-white mb-4">Featured Discount Spotlight</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topDiscountedProducts.map((product, index) => {
                      const currentDiscount = discountValues[String(product.id)] || 0;
                      if (currentDiscount <= 0) return null;
                      
                      const finalPrice = product.price * (1 - currentDiscount / 100);
                      
                      return (
                        <motion.div
                          key={String(product.id)}
                          whileHover={{ scale: 1.03 }}
                          className="bg-[#202020] rounded-xl overflow-hidden border border-[#2a2a2a]"
                        >
                          <div className="relative h-32">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 bg-[#0bff7e] text-black font-bold px-2 py-1 rounded-lg text-sm">
                              -{currentDiscount}%
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h5 className="text-white font-medium truncate">{product.name}</h5>
                            <div className="flex justify-between items-end mt-2">
                              <div className="text-gray-400 text-sm">{product.category}</div>
                              <div>
                                <span className="text-[#0bff7e] font-bold">${finalPrice.toFixed(2)}</span>
                                <span className="ml-2 text-xs line-through text-gray-500">${product.price.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={successVariants}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-900 bg-opacity-90 text-green-300 px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm border border-green-700 flex items-center z-50"
              >
                <i className="fas fa-check-circle text-xl mr-2"></i>
                <span>Discounts have been saved successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState<any>(null);
  const { products, updateProduct } = useProducts();
  const [authorizedUsers, setAuthorizedUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({ name: '', email: '', role: 'editor', authorized: true });
  const [_, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chartHovered, setChartHovered] = useState(false);
  const [showDiscountsModal, setShowDiscountsModal] = useState(false);

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
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    document.title = 'Admin Dashboard - MedTech';
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      setLocation('/login');
      return;
    }
    
    // Get user info
    const user = localStorage.getItem('user');
    if (user) {
      setUserInfo(JSON.parse(user));
    }
    
    // Load authorized users
    const storedUsers = localStorage.getItem('authorizedUsers');
    if (storedUsers) {
      setAuthorizedUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with owner
      const initialUsers: User[] = [
        {
          name: 'Admin',
          email: OWNER_EMAIL,
          role: 'admin',
          authorized: true
        }
      ];
      setAuthorizedUsers(initialUsers);
      localStorage.setItem('authorizedUsers', JSON.stringify(initialUsers));
    }
  }, [setLocation]);
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setLocation('/login');
  };
  
  // Check if current user is the owner
  const isOwner = userInfo?.email === OWNER_EMAIL;
  
  // Add a new authorized user
  const addAuthorizedUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const updatedUsers = [...authorizedUsers, {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as 'admin' | 'manager' | 'editor',
      authorized: true
    }];
    
    setAuthorizedUsers(updatedUsers);
    localStorage.setItem('authorizedUsers', JSON.stringify(updatedUsers));
    
    // Reset form
    setNewUser({ name: '', email: '', role: 'editor', authorized: true });
  };
  
  // Remove an authorized user
  const removeAuthorizedUser = (email: string) => {
    // Prevent removing the owner
    if (email === OWNER_EMAIL) return;
    
    const updatedUsers = authorizedUsers.filter(user => user.email !== email);
    setAuthorizedUsers(updatedUsers);
    localStorage.setItem('authorizedUsers', JSON.stringify(updatedUsers));
  };
  
  // Toggle user authorization
  const toggleUserAuthorization = (email: string) => {
    // Prevent changing owner status
    if (email === OWNER_EMAIL) return;
    
    const updatedUsers = authorizedUsers.map(user => {
      if (user.email === email) {
        return { ...user, authorized: !user.authorized };
      }
      return user;
    });
    
    setAuthorizedUsers(updatedUsers);
    localStorage.setItem('authorizedUsers', JSON.stringify(updatedUsers));
  };
  
  // Mocked statistics for demo
  const stats = {
    totalProducts: products.length,
    totalOrders: 157,
    revenue: 45892.74,
    pendingOrders: 23,
    outOfStock: products.filter(p => !p.inStock).length,
    discountedItems: products.filter(p => p.discount && p.discount > 0).length
  };

  // Mock data for the revenue chart
  const revenueData = [
    { month: 'Jan', amount: 10500 },
    { month: 'Feb', amount: 12800 },
    { month: 'Mar', amount: 9800 },
    { month: 'Apr', amount: 15300 },
    { month: 'May', amount: 18200 },
    { month: 'Jun', amount: 14700 },
    { month: 'Jul', amount: 17400 },
    { month: 'Aug', amount: 21500 },
    { month: 'Sep', amount: 19800 },
    { month: 'Oct', amount: 23500 },
    { month: 'Nov', amount: 27900 },
    { month: 'Dec', amount: 32500 },
  ];

  // Get the max revenue for chart scaling
  const maxRevenue = Math.max(...revenueData.map(d => d.amount));

  // Function to update product discount
  const updateProductDiscount = (productId: string, discount: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateProduct({
        ...product,
        discount: discount
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1c1c1c]">
      {/* Top Navigation */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2 mr-3 text-gray-400 hover:text-white rounded-md hover:bg-[#2a2a2a] transition-colors"
              >
                <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
              <div className="flex items-center">
                <h1 className="text-xl font-orbitron font-bold text-white mr-2">
                  MED<span className="text-[#0bff7e]">TECH</span>
                </h1>
                <span className="text-xs px-2 py-1 bg-[#0bff7e] text-black font-bold rounded-md uppercase">
                  Admin
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-[#2a2a2a] transition-colors relative"
              >
                <i className="fas fa-bell"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#0bff7e] rounded-full"></span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-[#2a2a2a] transition-colors"
              >
                <i className="fas fa-cog"></i>
              </motion.button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0bff7e] to-[#00b3ff] flex items-center justify-center text-black font-bold">
                  {userInfo?.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-white">{userInfo?.name}</div>
                  <div className="text-xs text-gray-400">{userInfo?.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0, transition: { duration: 0.2 } }}
                className="w-full md:w-64 flex-shrink-0 overflow-hidden"
              >
                <div className="bg-[#1a1a1a] rounded-2xl shadow-xl overflow-hidden border border-[#2a2a2a]">
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-6 space-y-6"
                  >
                    <motion.div variants={itemVariants} className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0bff7e] to-[#00b3ff] flex items-center justify-center text-black text-xl font-bold">
                        {userInfo?.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{userInfo?.name}</h3>
                        <div className="flex items-center">
                          <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                            userInfo?.role === 'admin' ? 'bg-[#0bff7e]' : 
                            userInfo?.role === 'manager' ? 'bg-[#00b3ff]' : 'bg-[#9d00ff]'
                          }`}></span>
                          <span className="text-sm text-gray-400">{userInfo?.role}</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <div className="pt-4 border-t border-[#2a2a2a] space-y-1">
                      <motion.button 
                        variants={itemVariants}
                        whileHover={{ 
                          x: 5, 
                          transition: { type: "spring", stiffness: 400, damping: 10 } 
                        }}
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                          activeTab === 'overview' 
                            ? 'bg-[#0bff7e] bg-opacity-10 text-[#0bff7e]' 
                            : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                        }`}
                      >
                        <i className="fas fa-th-large w-6"></i>
                        <span>Overview</span>
                      </motion.button>
                      
                      <motion.button 
                        variants={itemVariants}
                        whileHover={{ 
                          x: 5, 
                          transition: { type: "spring", stiffness: 400, damping: 10 } 
                        }}
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                          activeTab === 'products' 
                            ? 'bg-[#0bff7e] bg-opacity-10 text-[#0bff7e]' 
                            : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                        }`}
                      >
                        <i className="fas fa-box w-6"></i>
                        <span>Products</span>
                      </motion.button>
                      
                      <motion.button 
                        variants={itemVariants}
                        whileHover={{ 
                          x: 5, 
                          transition: { type: "spring", stiffness: 400, damping: 10 } 
                        }}
                        onClick={() => setLocation('/admin')}
                        className="w-full flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                      >
                        <i className="fas fa-edit w-6"></i>
                        <span>Product Management</span>
                      </motion.button>
                      
                      <motion.button 
                        variants={itemVariants}
                        whileHover={{ 
                          x: 5, 
                          transition: { type: "spring", stiffness: 400, damping: 10 } 
                        }}
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                          activeTab === 'orders' 
                            ? 'bg-[#0bff7e] bg-opacity-10 text-[#0bff7e]' 
                            : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                        }`}
                      >
                        <i className="fas fa-shopping-cart w-6"></i>
                        <span>Orders</span>
                        <span className="ml-auto bg-[#0bff7e] text-black text-xs font-bold px-2 py-1 rounded-full">
                          {stats.pendingOrders}
                        </span>
                      </motion.button>
                      
                      <motion.button 
                        variants={itemVariants}
                        whileHover={{ 
                          x: 5, 
                          transition: { type: "spring", stiffness: 400, damping: 10 } 
                        }}
                        onClick={() => setActiveTab('customers')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                          activeTab === 'customers' 
                            ? 'bg-[#0bff7e] bg-opacity-10 text-[#0bff7e]' 
                            : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                        }`}
                      >
                        <i className="fas fa-users w-6"></i>
                        <span>Customers</span>
                      </motion.button>
                      
                      <motion.button 
                        variants={itemVariants}
                        whileHover={{ 
                          x: 5, 
                          transition: { type: "spring", stiffness: 400, damping: 10 } 
                        }}
                        onClick={() => setActiveTab('analytics')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                          activeTab === 'analytics' 
                            ? 'bg-[#0bff7e] bg-opacity-10 text-[#0bff7e]' 
                            : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                        }`}
                      >
                        <i className="fas fa-chart-line w-6"></i>
                        <span>Analytics</span>
                      </motion.button>
                      
                      {/* Only show Users tab for the owner */}
                      {isOwner && (
                        <motion.button 
                          variants={itemVariants}
                          whileHover={{ 
                            x: 5, 
                            transition: { type: "spring", stiffness: 400, damping: 10 } 
                          }}
                          onClick={() => setActiveTab('users')}
                          className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                            activeTab === 'users' 
                              ? 'bg-[#0bff7e] bg-opacity-10 text-[#0bff7e]' 
                              : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                          }`}
                        >
                          <i className="fas fa-user-shield w-6"></i>
                          <span>Users</span>
                        </motion.button>
                      )}
                      
                      <motion.button 
                        variants={itemVariants}
                        whileHover={{ 
                          x: 5, 
                          transition: { type: "spring", stiffness: 400, damping: 10 } 
                        }}
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                          activeTab === 'settings' 
                            ? 'bg-[#0bff7e] bg-opacity-10 text-[#0bff7e]' 
                            : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                        }`}
                      >
                        <i className="fas fa-cog w-6"></i>
                        <span>Settings</span>
                      </motion.button>
                    </div>
                    
                    <div className="pt-4 border-t border-[#2a2a2a]">
                      <motion.button 
                        variants={itemVariants}
                        whileHover={{ 
                          x: 5, 
                          scale: 1.02,
                          transition: { type: "spring", stiffness: 400, damping: 10 } 
                        }}
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 rounded-xl text-red-500 hover:bg-red-900 hover:bg-opacity-10 transition-colors"
                      >
                        <i className="fas fa-sign-out-alt w-6"></i>
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-grow"
            >
              {activeTab === 'overview' && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-orbitron font-bold text-white">Dashboard Overview</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">Last Updated:</span>
                      <span className="text-white text-sm font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#0bff7e] opacity-10 rounded-full transform translate-x-8 -translate-y-8 blur-2xl"></div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                          <h3 className="text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</h3>
                          <div className="flex items-center text-[#0bff7e] text-sm font-medium mt-1">
                            <i className="fas fa-arrow-up mr-1"></i>
                            <span>12.5% from last month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#0bff7e] bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-dollar-sign text-[#0bff7e]"></i>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00b3ff] opacity-10 rounded-full transform translate-x-8 -translate-y-8 blur-2xl"></div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                          <h3 className="text-2xl font-bold text-white">{stats.totalOrders}</h3>
                          <div className="flex items-center text-[#00b3ff] text-sm font-medium mt-1">
                            <i className="fas fa-arrow-up mr-1"></i>
                            <span>8.2% from last month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#00b3ff] bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-shopping-bag text-[#00b3ff]"></i>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#9d00ff] opacity-10 rounded-full transform translate-x-8 -translate-y-8 blur-2xl"></div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Total Products</p>
                          <h3 className="text-2xl font-bold text-white">{stats.totalProducts}</h3>
                          <div className="flex items-center text-[#9d00ff] text-sm font-medium mt-1">
                            <i className="fas fa-arrow-up mr-1"></i>
                            <span>5.3% from last month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#9d00ff] bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-box text-[#9d00ff]"></i>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6b9d] opacity-10 rounded-full transform translate-x-8 -translate-y-8 blur-2xl"></div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Pending Orders</p>
                          <h3 className="text-2xl font-bold text-white">{stats.pendingOrders}</h3>
                          <div className="flex items-center text-red-500 text-sm font-medium mt-1">
                            <i className="fas fa-arrow-down mr-1"></i>
                            <span>3.1% from last month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#ff6b9d] bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-clock text-[#ff6b9d]"></i>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Revenue Chart & Recent Orders */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
                        <h3 className="text-xl font-orbitron font-bold text-white">Revenue Overview</h3>
                        <div className="flex space-x-1">
                          <button className="px-3 py-1.5 bg-[#2a2a2a] text-gray-400 rounded-lg text-sm hover:bg-[#3a3a3a] transition-colors">Day</button>
                          <button className="px-3 py-1.5 bg-[#2a2a2a] text-gray-400 rounded-lg text-sm hover:bg-[#3a3a3a] transition-colors">Week</button>
                          <button className="px-3 py-1.5 bg-[#0bff7e] bg-opacity-20 text-[#0bff7e] rounded-lg text-sm font-medium">Month</button>
                          <button className="px-3 py-1.5 bg-[#2a2a2a] text-gray-400 rounded-lg text-sm hover:bg-[#3a3a3a] transition-colors">Year</button>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="h-[250px] flex items-end space-x-2">
                          {revenueData.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.amount / maxRevenue) * 180}px` }}
                                transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                                onMouseEnter={() => setChartHovered(true)}
                                onMouseLeave={() => setChartHovered(false)}
                                className="w-full bg-gradient-to-t from-[#0bff7e] to-[#00b3ff] rounded-t-lg relative group"
                              >
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ 
                                    opacity: chartHovered ? 1 : 0, 
                                    y: chartHovered ? -30 : -10 
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-black px-2 py-1 rounded text-white text-xs whitespace-nowrap"
                                >
                                  ${item.amount.toLocaleString()}
                                </motion.div>
                              </motion.div>
                              <div className="text-xs text-gray-400 mt-2">{item.month}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a]">
                        <h3 className="text-xl font-orbitron font-bold text-white">Recent Orders</h3>
                      </div>
                      
                      <div className="divide-y divide-[#2a2a2a]">
                        {[
                          { id: 'ORD-8423', customer: 'John Smith', total: 459.99, status: 'Delivered' },
                          { id: 'ORD-8422', customer: 'Emma Johnson', total: 899.99, status: 'Processing' },
                          { id: 'ORD-8421', customer: 'Michael Brown', total: 329.97, status: 'Shipped' },
                          { id: 'ORD-8420', customer: 'Sarah Garcia', total: 1239.95, status: 'Pending' },
                        ].map((order, index) => (
                          <motion.div 
                            key={index}
                            variants={itemVariants}
                            whileHover={{ backgroundColor: 'rgba(42, 42, 42, 0.3)' }}
                            className="p-4 flex items-center"
                          >
                            <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-[#2a2a2a] mr-3">
                              <i className={`fas ${
                                order.status === 'Delivered' ? 'fa-check text-green-500' :
                                order.status === 'Shipped' ? 'fa-truck text-blue-500' :
                                order.status === 'Processing' ? 'fa-cog text-yellow-500' :
                                'fa-clock text-red-500'
                              }`}></i>
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-white">{order.id}</span>
                                <span className="text-sm font-bold text-white">${order.total.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-400">{order.customer}</span>
                                <span className={`text-xs ${
                                  order.status === 'Delivered' ? 'text-green-500' :
                                  order.status === 'Shipped' ? 'text-blue-500' :
                                  order.status === 'Processing' ? 'text-yellow-500' :
                                  'text-red-500'
                                }`}>{order.status}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="p-4 flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab('orders')}
                          className="text-[#0bff7e] text-sm font-medium hover:underline"
                        >
                          View All Orders
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Bottom Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a]">
                        <h3 className="text-xl font-orbitron font-bold text-white">Inventory Status</h3>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Out of Stock</span>
                            <span className="text-white">{stats.outOfStock} products</span>
                          </div>
                          <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(stats.outOfStock / stats.totalProducts) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="bg-red-500 h-2.5 rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Discounted Items</span>
                            <span className="text-white">{stats.discountedItems} products</span>
                          </div>
                          <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(stats.discountedItems / stats.totalProducts) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="bg-[#0bff7e] h-2.5 rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Pending Orders</span>
                            <span className="text-white">{stats.pendingOrders} orders</span>
                          </div>
                          <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="bg-yellow-500 h-2.5 rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a]">
                        <h3 className="text-xl font-orbitron font-bold text-white">Quick Actions</h3>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(58, 58, 58, 0.8)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('products')}
                            className="bg-[#2a2a2a] p-4 rounded-xl text-white flex flex-col items-center justify-center h-24"
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#0bff7e] bg-opacity-20 flex items-center justify-center mb-2">
                              <i className="fas fa-plus-circle text-[#0bff7e]"></i>
                            </div>
                            <span className="text-sm font-medium">Add Product</span>
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(58, 58, 58, 0.8)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowDiscountsModal(true)}
                            className="bg-[#2a2a2a] p-4 rounded-xl text-white flex flex-col items-center justify-center h-24"
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#00b3ff] bg-opacity-20 flex items-center justify-center mb-2">
                              <i className="fas fa-tags text-[#00b3ff]"></i>
                            </div>
                            <span className="text-sm font-medium">Set Discounts</span>
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(58, 58, 58, 0.8)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('orders')}
                            className="bg-[#2a2a2a] p-4 rounded-xl text-white flex flex-col items-center justify-center h-24"
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#9d00ff] bg-opacity-20 flex items-center justify-center mb-2">
                              <i className="fas fa-truck text-[#9d00ff]"></i>
                            </div>
                            <span className="text-sm font-medium">Update Orders</span>
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(58, 58, 58, 0.8)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('analytics')}
                            className="bg-[#2a2a2a] p-4 rounded-xl text-white flex flex-col items-center justify-center h-24"
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#ff6b9d] bg-opacity-20 flex items-center justify-center mb-2">
                              <i className="fas fa-chart-bar text-[#ff6b9d]"></i>
                            </div>
                            <span className="text-sm font-medium">View Reports</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {/* Products Tab */}
              {activeTab === 'products' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-orbitron font-bold text-white">Products Management</h2>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLocation('/admin')}
                      className="px-4 py-2 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold rounded-xl flex items-center shadow-lg"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Add New Product
                    </motion.button>
                  </div>
                  
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ scale: 1.01 }}
                    className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden mb-8"
                  >
                    <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
                      <h3 className="text-xl font-orbitron font-bold text-white">Product Inventory</h3>
                      <div className="relative">
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input 
                          type="text" 
                          placeholder="Search products..." 
                          className="bg-[#2a2a2a] text-white text-sm rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full">
                        <thead>
                          <tr className="border-b border-[#2a2a2a] bg-[#202020]">
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.slice(0, 5).map((product, index) => (
                            <motion.tr 
                              key={index} 
                              variants={itemVariants}
                              className="border-b border-[#2a2a2a] hover:bg-[#202020]"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-lg bg-[#2a2a2a] mr-3">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-white font-medium">{product.name}</span>
                                    <span className="text-gray-400 text-xs">ID: PRD-{index + 1000}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="text-white font-medium">${product.price.toFixed(2)}</span>
                                  {product.discount && product.discount > 0 && (
                                    <span className="text-[#0bff7e] text-xs">
                                      {product.discount}% off
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-white">
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  product.inStock 
                                    ? 'bg-green-900 bg-opacity-20 text-green-500' 
                                    : 'bg-red-900 bg-opacity-20 text-red-500'
                                }`}>
                                  {product.inStock ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 text-[#00b3ff] hover:bg-[#00b3ff] hover:bg-opacity-10 rounded-lg transition-colors"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </motion.button>
                                  <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 text-[#0bff7e] hover:bg-[#0bff7e] hover:bg-opacity-10 rounded-lg transition-colors"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </motion.button>
                                  <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
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
                    
                    <div className="p-6 flex justify-between items-center border-t border-[#2a2a2a]">
                      <div className="text-gray-400 text-sm">
                        Showing <span className="text-white">5</span> of <span className="text-white">{products.length}</span> products
                      </div>
                      <div className="flex space-x-1">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2a2a2a] text-gray-400"
                        >
                          <i className="fas fa-chevron-left"></i>
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0bff7e] text-black"
                        >
                          1
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2a2a2a] text-gray-400"
                        >
                          2
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2a2a2a] text-gray-400"
                        >
                          3
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2a2a2a] text-gray-400"
                        >
                          <i className="fas fa-chevron-right"></i>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a]">
                        <h3 className="text-xl font-orbitron font-bold text-white">Top Selling Products</h3>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        {products.slice(0, 4).map((product, index) => (
                          <motion.div 
                            key={index}
                            variants={itemVariants}
                            className="flex items-center p-3 rounded-xl hover:bg-[#2a2a2a] transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden mr-4">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <div className="text-white font-medium">{product.name}</div>
                              <div className="text-gray-400 text-xs">{product.category}</div>
                            </div>
                            <div className="text-white font-bold">${product.price.toFixed(2)}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a]">
                        <h3 className="text-xl font-orbitron font-bold text-white">Low Stock Alert</h3>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        {products.filter(p => !p.inStock).slice(0, 4).map((product, index) => (
                          <motion.div 
                            key={index}
                            variants={itemVariants}
                            className="flex items-center p-3 rounded-xl hover:bg-[#2a2a2a] transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden mr-4">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <div className="text-white font-medium">{product.name}</div>
                              <div className="text-gray-400 text-xs">{product.category}</div>
                            </div>
                            <div className="text-red-500 font-medium">Out of Stock</div>
                          </motion.div>
                        ))}
                        
                        {products.filter(p => !p.inStock).length === 0 && (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto bg-green-900 bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                              <i className="fas fa-check text-green-500 text-2xl"></i>
                            </div>
                            <p className="text-gray-400">All products are in stock!</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {/* User Management Tab */}
              {activeTab === 'users' && isOwner && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-orbitron font-bold text-white">User Management</h2>
                    <div className="text-gray-400 text-sm">
                      Total Users: <span className="text-white font-medium">{authorizedUsers.length}</span>
                    </div>
                  </div>
                  
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ scale: 1.01 }}
                    className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden mb-8"
                  >
                    <div className="p-6 border-b border-[#2a2a2a]">
                      <h3 className="text-xl font-orbitron font-bold text-white">Authorized Users</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full">
                        <thead>
                          <tr className="border-b border-[#2a2a2a] bg-[#202020]">
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {authorizedUsers.map((user, index) => (
                            <motion.tr 
                              key={index} 
                              variants={itemVariants}
                              className="border-b border-[#2a2a2a] hover:bg-[#202020]"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0bff7e] to-[#00b3ff] flex items-center justify-center text-black font-bold mr-3">
                                    {user.name.charAt(0)}
                                  </div>
                                  <div className="text-white">{user.name}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  user.role === 'admin' 
                                    ? 'bg-[#0bff7e] bg-opacity-20 text-[#0bff7e]' 
                                    : user.role === 'manager'
                                      ? 'bg-[#00b3ff] bg-opacity-20 text-[#00b3ff]'
                                      : 'bg-[#9d00ff] bg-opacity-20 text-[#9d00ff]'
                                }`}>
                                  {user.role.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  user.authorized 
                                    ? 'bg-green-900 bg-opacity-20 text-green-500' 
                                    : 'bg-red-900 bg-opacity-20 text-red-500'
                                }`}>
                                  {user.authorized ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => toggleUserAuthorization(user.email)}
                                    disabled={user.email === OWNER_EMAIL}
                                    className={`p-2 rounded-lg transition-colors ${
                                      user.email === OWNER_EMAIL 
                                        ? 'text-gray-600 cursor-not-allowed' 
                                        : user.authorized 
                                          ? 'text-red-500 hover:bg-red-500 hover:bg-opacity-10' 
                                          : 'text-green-500 hover:bg-green-500 hover:bg-opacity-10'
                                    }`}
                                  >
                                    <i className={`fas ${user.authorized ? 'fa-user-lock' : 'fa-user-check'}`}></i>
                                  </motion.button>
                                  <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeAuthorizedUser(user.email)}
                                    disabled={user.email === OWNER_EMAIL}
                                    className={`p-2 rounded-lg transition-colors ${
                                      user.email === OWNER_EMAIL 
                                        ? 'text-gray-600 cursor-not-allowed' 
                                        : 'text-red-500 hover:bg-red-500 hover:bg-opacity-10'
                                    }`}
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
                  </motion.div>
                  
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ scale: 1.01 }}
                    className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                  >
                    <div className="p-6 border-b border-[#2a2a2a]">
                      <h3 className="text-xl font-orbitron font-bold text-white">Add New User</h3>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <label className="block text-gray-400 mb-2 text-sm">Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-user text-gray-500"></i>
                            </div>
                            <input
                              type="text"
                              value={newUser.name}
                              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                              className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                              placeholder="User Name"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 mb-2 text-sm">Email</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-envelope text-gray-500"></i>
                            </div>
                            <input
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                              className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                              placeholder="user@example.com"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 mb-2 text-sm">Role</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-user-tag text-gray-500"></i>
                            </div>
                            <select
                              value={newUser.role}
                              onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'manager' | 'editor'})}
                              className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none appearance-none"
                            >
                              <option value="admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="editor">Editor</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <i className="fas fa-chevron-down text-gray-500"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addAuthorizedUser}
                          disabled={!newUser.name || !newUser.email}
                          className={`px-6 py-3 rounded-xl font-bold shadow flex items-center ${
                            !newUser.name || !newUser.email
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black'
                          }`}
                        >
                          <i className="fas fa-user-plus mr-2"></i>
                          Add User
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              {/* Empty State for other tabs */}
              {(activeTab === 'orders' || activeTab === 'customers' || activeTab === 'analytics' || activeTab === 'settings') && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] p-12 text-center"
                >
                  <motion.div 
                    variants={itemVariants}
                    className="w-24 h-24 mx-auto flex items-center justify-center bg-[#2a2a2a] rounded-full text-gray-400 mb-6"
                  >
                    <i className={`fas ${
                      activeTab === 'orders' ? 'fa-shopping-cart' :
                      activeTab === 'customers' ? 'fa-users' :
                      activeTab === 'analytics' ? 'fa-chart-line' :
                      'fa-cogs'
                    } text-4xl`}></i>
                  </motion.div>
                  
                  <motion.h3 
                    variants={itemVariants}
                    className="text-2xl font-orbitron font-bold text-white mb-4"
                  >
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                  </motion.h3>
                  
                  <motion.p 
                    variants={itemVariants}
                    className="text-gray-400 mb-8 max-w-lg mx-auto"
                  >
                    This section is currently under development. Our team is working hard to bring you amazing new features soon. Check back later for updates!
                  </motion.p>
                  
                  <motion.button 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('overview')}
                    className="px-6 py-3 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold rounded-xl shadow-lg"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Overview
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Add the Set Discounts modal here */}
          <SetDiscountsModal 
            isOpen={showDiscountsModal}
            onClose={() => setShowDiscountsModal(false)}
            products={products}
            updateProductDiscount={updateProductDiscount}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
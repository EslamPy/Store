import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getDiscountedProducts } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProductForm from '../components/admin/ProductForm';
import { useNotification } from '../components/ui/NotificationManager';
import { Product } from '../data/products';

// Owner email constant
const OWNER_EMAIL = 'eslamdev@outlook.de';

// User interface
interface User {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor';
  authorized: boolean;
}

const DashboardPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState<any>(null);
  const { products } = useProducts();
  const [authorizedUsers, setAuthorizedUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({ name: '', email: '', role: 'editor', authorized: true });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chartHovered, setChartHovered] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Add new state for settings form
  const [profileSettings, setProfileSettings] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    bio: ''
  });
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Add state for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    inventoryAlerts: true,
    customerMessages: true,
    marketingPromotions: false,
    emailNotifications: true,
    pushNotifications: true,
    browserNotifications: false,
    smsNotifications: false,
    twoFactorEnabled: true
  });

  // Check for URL query parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
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
      const parsedUser = JSON.parse(user);
      setUserInfo(parsedUser);
      
      // Initialize profile settings with user data
      setProfileSettings({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        jobTitle: parsedUser.jobTitle || '',
        bio: parsedUser.bio || ''
      });
      
      // Initialize notification settings if they exist
      if (parsedUser.notificationSettings) {
        setNotificationSettings(parsedUser.notificationSettings);
      }
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

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const startAddingProduct = () => {
    setIsAddingProduct(true);
    setIsEditingProduct(false);
    setSelectedProduct(null);
  };

  const cancelForm = () => {
    setIsAddingProduct(false);
    setIsEditingProduct(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = (product: any) => {
    // Add product logic
    console.log('Add product:', product);
    setIsAddingProduct(false);
  };

  const handleEditProduct = (product: any) => {
    // Edit product logic
    console.log('Edit product:', product);
    setIsEditingProduct(false);
  };

  const startEditingProduct = (product: Product) => {
    setIsAddingProduct(false);
    setIsEditingProduct(true);
    setSelectedProduct(product);
  };

  const handleDeleteProduct = (id: number) => {
    // Delete product logic
    console.log('Delete product:', id);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle profile settings change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileSettings({
      ...profileSettings,
      [name]: value
    });
  };

  // Handle password settings change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordSettings({
      ...passwordSettings,
      [name]: value
    });
  };

  // Handle notification toggle
  const handleNotificationToggle = (settingName: string) => {
    setNotificationSettings(prevSettings => ({
      ...prevSettings,
      [settingName]: !prevSettings[settingName as keyof typeof prevSettings]
    }));
  };

  // Handle settings save
  const handleSaveSettings = () => {
    // Validate form
    const errors: {[key: string]: string} = {};
    
    if (passwordSettings.newPassword && passwordSettings.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordSettings.newPassword && passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Clear any previous errors
    setFormErrors({});
    
    // Update user info in localStorage
    if (userInfo) {
      const updatedUser = {
        ...userInfo,
        name: profileSettings.name,
        email: profileSettings.email,
        phone: profileSettings.phone,
        jobTitle: profileSettings.jobTitle,
        bio: profileSettings.bio,
        notificationSettings
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
    }
    
    // Show success message
    setShowSuccessMessage(true);
    setSettingsSaved(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
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
                      
                      {/* Products Tab Button */}
                      <motion.button
                        onClick={() => handleTabClick('products')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center justify-start space-x-3 px-4 py-3 rounded-xl w-full mb-2 ${
                          activeTab === 'products' 
                            ? 'bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold' 
                            : 'text-gray-300 hover:bg-[#1a1a1a]'
                        }`}
                      >
                        <i className="fas fa-box-open text-xl"></i>
                        <span className="font-medium">Products</span>
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
                      className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg relative overflow-hidden"
                    >
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
                            onClick={() => {
                              window.location.href = '/admin';
                            }}
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
                            onClick={() => {
                              window.location.href = '/discounts';
                            }}
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
                            onClick={() => {
                              setActiveTab('orders');
                            }}
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
                            onClick={() => {
                              setActiveTab('analytics');
                            }}
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
                    {isAddingProduct || isEditingProduct ? (
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={cancelForm}
                          className="px-4 py-2 bg-[#2d2d2d] text-white font-bold rounded-xl flex items-center shadow-lg"
                        >
                          <i className="fas fa-times mr-2"></i>
                          Cancel
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startAddingProduct}
                        className="px-4 py-2 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold rounded-xl flex items-center shadow-lg"
                      >
                        <i className="fas fa-plus mr-2"></i>
                        Add New Product
                      </motion.button>
                    )}
                  </div>
                  
                  {(isAddingProduct || isEditingProduct) ? (
                    <motion.div
                      variants={cardVariants}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden mb-8 p-6"
                    >
                      <h3 className="text-xl font-orbitron font-bold text-white mb-6">
                        {isAddingProduct ? 'Add New Product' : 'Edit Product'}
                      </h3>
                      <ProductForm 
                        product={selectedProduct} 
                        onSubmit={isAddingProduct ? handleAddProduct : handleEditProduct}
                        onCancel={cancelForm}
                      />
                    </motion.div>
                  ) : (
                    <>
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
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
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
                              {filteredProducts.slice(0, 5).map((product, index) => (
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
                                        <span className="text-gray-400 text-xs">SKU: {product.sku}</span>
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
                                        onClick={() => window.open(`/product/${product.id}`, '_blank')}
                                        className="p-2 text-[#00b3ff] hover:bg-[#00b3ff] hover:bg-opacity-10 rounded-lg transition-colors"
                                      >
                                        <i className="fas fa-eye"></i>
                                      </motion.button>
                                      <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => startEditingProduct(product)}
                                        className="p-2 text-[#0bff7e] hover:bg-[#0bff7e] hover:bg-opacity-10 rounded-lg transition-colors"
                                      >
                                        <i className="fas fa-edit"></i>
                                      </motion.button>
                                      <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteProduct(product.id)}
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
                            Showing <span className="text-white">5</span> of <span className="text-white">{filteredProducts.length}</span> products
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
                    </>
                  )}
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
              
              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-orbitron font-bold text-white">Analytics Dashboard</h2>
                    <div className="flex space-x-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 bg-[#0bff7e] bg-opacity-20 text-[#0bff7e] rounded-lg text-sm font-medium"
                      >
                        Last 30 Days
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 bg-[#2a2a2a] text-gray-400 rounded-lg text-sm hover:bg-[#3a3a3a] transition-colors"
                      >
                        This Month
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 bg-[#2a2a2a] text-gray-400 rounded-lg text-sm hover:bg-[#3a3a3a] transition-colors"
                      >
                        This Year
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 bg-[#2a2a2a] text-gray-400 rounded-lg text-sm hover:bg-[#3a3a3a] transition-colors"
                      >
                        Custom
                      </motion.button>
                </div>
              </div>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg relative overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#0bff7e] opacity-10 rounded-full transform translate-x-8 -translate-y-8 blur-2xl"></div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Total Sales</p>
                          <motion.h3 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-2xl font-bold text-white"
                          >
                            $86,954
                          </motion.h3>
                          <div className="flex items-center text-[#0bff7e] text-sm font-medium mt-1">
                            <i className="fas fa-arrow-up mr-1"></i>
                            <span>18.2% from last month</span>
                </div>
                            </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#0bff7e] bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-chart-line text-[#0bff7e]"></i>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg relative overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00b3ff] opacity-10 rounded-full transform translate-x-8 -translate-y-8 blur-2xl"></div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Visitors</p>
                          <motion.h3 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-2xl font-bold text-white"
                          >
                            12,821
                          </motion.h3>
                          <div className="flex items-center text-[#00b3ff] text-sm font-medium mt-1">
                            <i className="fas fa-arrow-up mr-1"></i>
                            <span>9.1% from last month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#00b3ff] bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-users text-[#00b3ff]"></i>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg relative overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#9d00ff] opacity-10 rounded-full transform translate-x-8 -translate-y-8 blur-2xl"></div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Conversion Rate</p>
                          <motion.h3 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-2xl font-bold text-white"
                          >
                            3.42%
                          </motion.h3>
                          <div className="flex items-center text-[#9d00ff] text-sm font-medium mt-1">
                            <i className="fas fa-arrow-up mr-1"></i>
                            <span>1.2% from last month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#9d00ff] bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-percentage text-[#9d00ff]"></i>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg relative overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6b9d] opacity-10 rounded-full transform translate-x-8 -translate-y-8 blur-2xl"></div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Avg. Order Value</p>
                          <motion.h3 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="text-2xl font-bold text-white"
                          >
                            $328.14
                          </motion.h3>
                          <div className="flex items-center text-[#ff6b9d] text-sm font-medium mt-1">
                            <i className="fas fa-arrow-up mr-1"></i>
                            <span>4.7% from last month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#ff6b9d] bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-shopping-cart text-[#ff6b9d]"></i>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Sales & Traffic Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <motion.div
                      variants={cardVariants}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
                        <h3 className="text-xl font-orbitron font-bold text-white">Sales & Traffic</h3>
                            <div className="flex space-x-2">
                          <button className="flex items-center px-3 py-1 bg-[#0bff7e] bg-opacity-20 text-[#0bff7e] rounded-lg text-sm">
                            <span className="w-2 h-2 rounded-full bg-[#0bff7e] mr-2"></span>
                            Sales
                              </button>
                          <button className="flex items-center px-3 py-1 bg-[#00b3ff] bg-opacity-20 text-[#00b3ff] rounded-lg text-sm">
                            <span className="w-2 h-2 rounded-full bg-[#00b3ff] mr-2"></span>
                            Traffic
                              </button>
                            </div>
                      </div>
                      
                      <div className="p-6 h-[350px]">
                        <div className="relative h-full">
                          {/* Chart Background Grid */}
                          <div className="absolute inset-0 grid grid-cols-7 gap-0">
                            {[...Array(7)].map((_, i) => (
                              <div key={i} className="border-r border-[#2a2a2a] h-full"></div>
                            ))}
                </div>
                          <div className="absolute inset-0 grid grid-rows-5 gap-0">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="border-t border-[#2a2a2a] w-full"></div>
                            ))}
              </div>

                          {/* X-axis Labels */}
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                          </div>
                          
                          {/* Y-axis Labels */}
                          <div className="absolute top-0 left-0 bottom-6 flex flex-col justify-between text-xs text-gray-400">
                            <span>10k</span>
                            <span>8k</span>
                            <span>6k</span>
                            <span>4k</span>
                            <span>2k</span>
                            <span>0</span>
                          </div>

                          {/* Sales Line */}
                          <motion.svg 
                            className="absolute inset-0 mt-4 ml-8 mr-4 mb-6" 
                            viewBox="0 0 100 100" 
                            preserveAspectRatio="none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          >
                            <motion.path 
                              d="M0,70 L14.3,55 L28.6,60 L42.9,40 L57.1,45 L71.4,20 L85.7,30 L100,15" 
                              fill="none" 
                              stroke="#0bff7e" 
                              strokeWidth="2"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            {/* Gradient under the line */}
                            <defs>
                              <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#0bff7e" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#0bff7e" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <motion.path 
                              d="M0,70 L14.3,55 L28.6,60 L42.9,40 L57.1,45 L71.4,20 L85.7,30 L100,15 V100 H0 Z" 
                              fill="url(#salesGradient)"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 1, delay: 1 }}
                            />
                          </motion.svg>

                          {/* Traffic Line */}
                          <motion.svg 
                            className="absolute inset-0 mt-4 ml-8 mr-4 mb-6" 
                            viewBox="0 0 100 100" 
                            preserveAspectRatio="none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          >
                            <motion.path 
                              d="M0,50 L14.3,60 L28.6,40 L42.9,45 L57.1,30 L71.4,40 L85.7,25 L100,35" 
                              fill="none" 
                              stroke="#00b3ff" 
                              strokeWidth="2"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, ease: "easeInOut" }}
                            />
                          </motion.svg>

                          {/* Data Points - Sales */}
                          {[70, 55, 60, 40, 45, 20, 30, 15].map((point, i) => (
                            <motion.div 
                              key={`sales-${i}`}
                              className="absolute w-3 h-3 bg-[#0bff7e] rounded-full shadow-lg shadow-[#0bff7e]/20"
                              style={{ 
                                left: `${i * 14.3 + 2}%`, 
                                top: `${point}%`,
                                marginLeft: '8px',
                                marginTop: '4px'
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                            />
                          ))}

                          {/* Data Points - Traffic */}
                          {[50, 60, 40, 45, 30, 40, 25, 35].map((point, i) => (
                            <motion.div 
                              key={`traffic-${i}`}
                              className="absolute w-3 h-3 bg-[#00b3ff] rounded-full shadow-lg shadow-[#00b3ff]/20"
                              style={{ 
                                left: `${i * 14.3 + 2}%`, 
                                top: `${point}%`,
                                marginLeft: '8px',
                                marginTop: '4px'
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a]">
                        <h3 className="text-xl font-orbitron font-bold text-white">Sales by Category</h3>
                      </div>
                      
                      <div className="p-6">
                        <div className="relative w-48 h-48 mx-auto mb-8">
                          {/* Donut Chart */}
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#0bff7e"
                              strokeWidth="12"
                              strokeDasharray="251.2"
                              strokeDashoffset="0"
                              transform="rotate(-90 50 50)"
                              initial={{ strokeDashoffset: 251.2 }}
                              animate={{ strokeDashoffset: 251.2 * 0.65 }}
                              transition={{ duration: 1, delay: 0.7 }}
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#00b3ff"
                              strokeWidth="12"
                              strokeDasharray="251.2"
                              strokeDashoffset={251.2 * 0.65}
                              transform="rotate(-90 50 50)"
                              initial={{ strokeDashoffset: 251.2 }}
                              animate={{ strokeDashoffset: 251.2 * 0.45 }}
                              transition={{ duration: 1, delay: 0.9 }}
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#9d00ff"
                              strokeWidth="12"
                              strokeDasharray="251.2"
                              strokeDashoffset={251.2 * 0.45}
                              transform="rotate(-90 50 50)"
                              initial={{ strokeDashoffset: 251.2 }}
                              animate={{ strokeDashoffset: 251.2 * 0.1 }}
                              transition={{ duration: 1, delay: 1.1 }}
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#ff6b9d"
                              strokeWidth="12"
                              strokeDasharray="251.2"
                              strokeDashoffset={251.2 * 0.1}
                              transform="rotate(-90 50 50)"
                              initial={{ strokeDashoffset: 251.2 }}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{ duration: 1, delay: 1.3 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.5 }}
                              className="text-2xl font-bold text-white"
                            >
                              $86,954
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.6 }}
                              className="text-xs text-gray-400"
                            >
                              Total Sales
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <motion.div 
                            className="flex items-center justify-between" 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 }}
                          >
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-[#0bff7e] rounded-full mr-2"></span>
                              <span className="text-gray-300">Electronics</span>
                            </div>
                            <span className="text-white font-medium">35%</span>
                          </motion.div>
                          
                          <motion.div 
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 }}
                          >
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-[#00b3ff] rounded-full mr-2"></span>
                              <span className="text-gray-300">Accessories</span>
                            </div>
                            <span className="text-white font-medium">20%</span>
                          </motion.div>
                          
                          <motion.div 
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.3 }}
                          >
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-[#9d00ff] rounded-full mr-2"></span>
                              <span className="text-gray-300">Components</span>
                            </div>
                            <span className="text-white font-medium">35%</span>
                          </motion.div>
                          
                          <motion.div 
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.4 }}
                          >
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-[#ff6b9d] rounded-full mr-2"></span>
                              <span className="text-gray-300">Other</span>
                            </div>
                            <span className="text-white font-medium">10%</span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Bottom Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      variants={cardVariants}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
                        <h3 className="text-xl font-orbitron font-bold text-white">Top Products</h3>
                        <button className="text-[#0bff7e] text-sm font-medium hover:underline">
                          View All
                        </button>
                      </div>
                      
                      <div className="p-4">
                        {products.slice(0, 5).map((product, index) => (
                          <motion.div 
                            key={index}
                            className="flex items-center p-3 rounded-xl border-b border-[#2a2a2a] last:border-0"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            whileHover={{ backgroundColor: 'rgba(42, 42, 42, 0.5)' }}
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden mr-4 bg-[#2a2a2a]">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <div className="text-white font-medium">{product.name}</div>
                              <div className="text-gray-400 text-xs">{product.category}</div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-white font-bold">${product.price.toFixed(2)}</div>
                              <div className="text-green-500 text-xs">+{(index + 1) * 12}% sales</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div
                      variants={cardVariants}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a]">
                        <h3 className="text-xl font-orbitron font-bold text-white">Traffic Sources</h3>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Organic Search</span>
                            <span className="text-white">42%</span>
                          </div>
                          <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              className="bg-[#0bff7e] h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "42%" }}
                              transition={{ duration: 1, delay: 0.9 }}
                            ></motion.div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Direct</span>
                            <span className="text-white">28%</span>
                          </div>
                          <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              className="bg-[#00b3ff] h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "28%" }}
                              transition={{ duration: 1, delay: 1 }}
                            ></motion.div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Social Media</span>
                            <span className="text-white">16%</span>
                          </div>
                          <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              className="bg-[#9d00ff] h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "16%" }}
                              transition={{ duration: 1, delay: 1.1 }}
                            ></motion.div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Referrals</span>
                            <span className="text-white">14%</span>
                          </div>
                          <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              className="bg-[#ff6b9d] h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "14%" }}
                              transition={{ duration: 1, delay: 1.2 }}
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-6 pb-6">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold rounded-xl shadow-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.3 }}
                        >
                          <i className="fas fa-chart-bar mr-2"></i>
                          Generate Full Report
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {/* Empty State for other tabs */}
            {(activeTab === 'orders' || activeTab === 'customers') && (
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

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-orbitron font-bold text-white">Settings Dashboard</h2>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] text-black font-bold rounded-xl flex items-center shadow-lg"
                  >
                    <i className="fas fa-save mr-2"></i>
                    Save Changes
                  </motion.button>
          </div>
                
                {/* Show success message if settings were saved */}
                {showSuccessMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-900 bg-opacity-20 border border-green-500 text-green-500 px-4 py-3 rounded-xl mb-6 flex items-center"
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    Settings have been saved successfully!
                  </motion.div>
                )}
                
                {/* Settings Navigation */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden sticky top-6"
                    >
                      <div className="p-6 border-b border-[#2a2a2a]">
                        <h3 className="text-xl font-orbitron font-bold text-white">Settings Menu</h3>
        </div>
                      
                      <div className="p-3 space-y-1">
                        <motion.button 
                          variants={itemVariants}
                          whileHover={{ 
                            x: 5, 
                            backgroundColor: 'rgba(42, 42, 42, 0.8)',
                            transition: { type: "spring", stiffness: 400, damping: 10 } 
                          }}
                          className="w-full flex items-center px-4 py-3 rounded-xl bg-[#0bff7e] bg-opacity-10 text-[#0bff7e]"
                        >
                          <i className="fas fa-user-circle w-6"></i>
                          <span>Profile Settings</span>
                        </motion.button>
                        
                        <motion.button 
                          variants={itemVariants}
                          whileHover={{ 
                            x: 5, 
                            backgroundColor: 'rgba(42, 42, 42, 0.8)',
                            transition: { type: "spring", stiffness: 400, damping: 10 } 
                          }}
                          className="w-full flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                        >
                          <i className="fas fa-shopping-bag w-6"></i>
                          <span>Store Settings</span>
                        </motion.button>
                        
                        <motion.button 
                          variants={itemVariants}
                          whileHover={{ 
                            x: 5, 
                            backgroundColor: 'rgba(42, 42, 42, 0.8)',
                            transition: { type: "spring", stiffness: 400, damping: 10 } 
                          }}
                          className="w-full flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                        >
                          <i className="fas fa-bell w-6"></i>
                          <span>Notifications</span>
                        </motion.button>
                        
                        <motion.button 
                          variants={itemVariants}
                          whileHover={{ 
                            x: 5, 
                            backgroundColor: 'rgba(42, 42, 42, 0.8)',
                            transition: { type: "spring", stiffness: 400, damping: 10 } 
                          }}
                          className="w-full flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                        >
                          <i className="fas fa-palette w-6"></i>
                          <span>Appearance</span>
                        </motion.button>
                        
                        <motion.button 
                          variants={itemVariants}
                          whileHover={{ 
                            x: 5, 
                            backgroundColor: 'rgba(42, 42, 42, 0.8)',
                            transition: { type: "spring", stiffness: 400, damping: 10 } 
                          }}
                          className="w-full flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                        >
                          <i className="fas fa-lock w-6"></i>
                          <span>Security</span>
                        </motion.button>
                        
                        <motion.button 
                          variants={itemVariants}
                          whileHover={{ 
                            x: 5, 
                            backgroundColor: 'rgba(42, 42, 42, 0.8)',
                            transition: { type: "spring", stiffness: 400, damping: 10 } 
                          }}
                          className="w-full flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                        >
                          <i className="fas fa-plug w-6"></i>
                          <span>Integrations</span>
                        </motion.button>
                        
                        <motion.button 
                          variants={itemVariants}
                          whileHover={{ 
                            x: 5, 
                            backgroundColor: 'rgba(42, 42, 42, 0.8)',
                            transition: { type: "spring", stiffness: 400, damping: 10 } 
                          }}
                          className="w-full flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                        >
                          <i className="fas fa-credit-card w-6"></i>
                          <span>Billing</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Main Settings Content */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Profile Settings Section */}
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center">
                        <h3 className="text-xl font-orbitron font-bold text-white">Profile Settings</h3>
                        <span className="text-xs px-2 py-1 bg-[#0bff7e] bg-opacity-20 text-[#0bff7e] rounded-md">
                          Active
                        </span>
                      </div>
                      
                      <div className="p-6">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row md:items-center mb-8 pb-8 border-b border-[#2a2a2a]">
                          <motion.div 
                            className="relative w-24 h-24 mb-4 md:mb-0 md:mr-6"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0bff7e] to-[#00b3ff] flex items-center justify-center text-black text-3xl font-bold">
                              {profileSettings.name.charAt(0)}
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#1a1a1a] flex items-center justify-center cursor-pointer">
                              <i className="fas fa-camera text-white text-sm"></i>
                            </div>
                          </motion.div>
                          
                          <div className="flex-grow">
                            <h4 className="text-white text-xl font-bold">{profileSettings.name}</h4>
                            <p className="text-gray-400">{profileSettings.email}</p>
                            <div className="flex mt-2">
                              <span className="text-xs px-2 py-1 bg-[#0bff7e] bg-opacity-20 text-[#0bff7e] rounded-md mr-2">
                                {userInfo?.role}
                              </span>
                              <span className="text-xs px-2 py-1 bg-[#00b3ff] bg-opacity-20 text-[#00b3ff] rounded-md">
                                Verified
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-400 mb-2 text-sm">Full Name</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-user text-gray-500"></i>
                              </div>
                              <input 
                                type="text" 
                                name="name"
                                value={profileSettings.name}
                                onChange={handleProfileChange}
                                className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-gray-400 mb-2 text-sm">Email Address</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-envelope text-gray-500"></i>
                              </div>
                              <input 
                                type="email" 
                                name="email"
                                value={profileSettings.email}
                                onChange={handleProfileChange}
                                className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-gray-400 mb-2 text-sm">Phone Number</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-phone text-gray-500"></i>
                              </div>
                              <input 
                                type="tel" 
                                name="phone"
                                value={profileSettings.phone}
                                onChange={handleProfileChange}
                                placeholder="+1 (123) 456-7890"
                                className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-gray-400 mb-2 text-sm">Job Title</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-briefcase text-gray-500"></i>
                              </div>
                              <input 
                                type="text" 
                                name="jobTitle"
                                value={profileSettings.jobTitle}
                                onChange={handleProfileChange}
                                placeholder="Store Manager"
                                className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                              />
                            </div>
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-gray-400 mb-2 text-sm">Bio</label>
                            <div className="relative">
                              <textarea 
                                rows={4}
                                name="bio"
                                value={profileSettings.bio}
                                onChange={handleProfileChange}
                                placeholder="Tell us something about yourself..."
                                className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl p-4 outline-none"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Security & Login Section */}
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a]">
                        <h3 className="text-xl font-orbitron font-bold text-white">Security & Login</h3>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div>
                          <h4 className="text-white font-bold mb-4">Change Password</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-gray-400 mb-2 text-sm">Current Password</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <i className="fas fa-lock text-gray-500"></i>
                                </div>
                                <input 
                                  type="password" 
                                  name="currentPassword"
                                  value={passwordSettings.currentPassword}
                                  onChange={handlePasswordChange}
                                  placeholder="••••••••"
                                  className="w-full bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-gray-400 mb-2 text-sm">New Password</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <i className="fas fa-key text-gray-500"></i>
                                </div>
                                <input 
                                  type="password"
                                  name="newPassword"
                                  value={passwordSettings.newPassword}
                                  onChange={handlePasswordChange}
                                  placeholder="••••••••"
                                  className={`w-full bg-[#2a2a2a] text-white border ${formErrors.newPassword ? 'border-red-500' : 'border-[#3a3a3a]'} focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none`}
                                />
                                {formErrors.newPassword && (
                                  <p className="text-red-500 text-xs mt-1">{formErrors.newPassword}</p>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-gray-400 mb-2 text-sm">Confirm Password</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <i className="fas fa-check-circle text-gray-500"></i>
                                </div>
                                <input 
                                  type="password"
                                  name="confirmPassword"
                                  value={passwordSettings.confirmPassword}
                                  onChange={handlePasswordChange}
                                  placeholder="••••••••"
                                  className={`w-full bg-[#2a2a2a] text-white border ${formErrors.confirmPassword ? 'border-red-500' : 'border-[#3a3a3a]'} focus:border-[#0bff7e] focus:ring-2 focus:ring-[#0bff7e] focus:ring-opacity-20 rounded-xl pl-10 pr-4 py-3 outline-none`}
                                />
                                {formErrors.confirmPassword && (
                                  <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleSaveSettings}
                              className="px-4 py-2 bg-[#0bff7e] bg-opacity-20 text-[#0bff7e] rounded-xl text-sm font-medium"
                            >
                              Update Password
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t border-[#2a2a2a]">
                          <h4 className="text-white font-bold mb-4">Two-Factor Authentication</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Protect your account with 2FA security. When enabled, you'll be required to provide a verification code each time you sign in.</p>
                              <div className="mt-2 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-[#0bff7e] mr-2"></span>
                                <span className="text-[#0bff7e] text-sm">Currently enabled</span>
                              </div>
                            </div>
                            
                            <motion.div
                              className="relative w-14 h-7 flex-shrink-0"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleNotificationToggle('twoFactorEnabled')}
                            >
                              <input type="checkbox" className="opacity-0 w-0 h-0" checked={notificationSettings.twoFactorEnabled} readOnly />
                              <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${notificationSettings.twoFactorEnabled ? 'bg-[#0bff7e]' : 'bg-[#2a2a2a]'} rounded-full transition-colors`}>
                                <span className={`absolute w-5 h-5 left-1 bottom-1 bg-white rounded-full transition-transform ${notificationSettings.twoFactorEnabled ? 'translate-x-7' : 'translate-x-0'}`}></span>
                              </span>
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t border-[#2a2a2a]">
                          <h4 className="text-white font-bold mb-4">Login Sessions</h4>
                          <div className="space-y-4">
                            <div className="bg-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#0bff7e] bg-opacity-20 flex items-center justify-center mr-3">
                                  <i className="fas fa-laptop text-[#0bff7e]"></i>
                                </div>
                                <div>
                                  <div className="text-white">Windows - Chrome</div>
                                  <div className="text-gray-400 text-xs">Current session</div>
                                </div>
                              </div>
                              <div className="text-[#0bff7e] text-sm font-medium">Active Now</div>
                            </div>
                            
                            <div className="bg-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#00b3ff] bg-opacity-20 flex items-center justify-center mr-3">
                                  <i className="fas fa-mobile-alt text-[#00b3ff]"></i>
                                </div>
                                <div>
                                  <div className="text-white">iPhone - Safari</div>
                                  <div className="text-gray-400 text-xs">Berlin, Germany</div>
                                </div>
                              </div>
                              <div className="text-gray-400 text-sm">2 days ago</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-red-500 bg-opacity-20 text-red-500 rounded-xl text-sm font-medium"
                            >
                              <i className="fas fa-sign-out-alt mr-2"></i>
                              Sign out all devices
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Notification Preferences */}
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#2a2a2a] overflow-hidden"
                    >
                      <div className="p-6 border-b border-[#2a2a2a]">
                        <h3 className="text-xl font-orbitron font-bold text-white">Notification Preferences</h3>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-bold">Order Updates</h4>
                              <p className="text-gray-400 text-sm">Receive notifications about order status changes</p>
                            </div>
                            
                            <motion.div
                              className="relative w-14 h-7 flex-shrink-0"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleNotificationToggle('orderUpdates')}
                            >
                              <input type="checkbox" className="opacity-0 w-0 h-0" checked={notificationSettings.orderUpdates} readOnly />
                              <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${notificationSettings.orderUpdates ? 'bg-[#0bff7e]' : 'bg-[#2a2a2a]'} rounded-full transition-colors`}>
                                <span className={`absolute w-5 h-5 left-1 bottom-1 bg-white rounded-full transition-transform ${notificationSettings.orderUpdates ? 'translate-x-7' : 'translate-x-0'}`}></span>
                              </span>
                            </motion.div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-bold">Inventory Alerts</h4>
                              <p className="text-gray-400 text-sm">Get notified when products are low in stock</p>
                            </div>
                            
                            <motion.div
                              className="relative w-14 h-7 flex-shrink-0"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleNotificationToggle('inventoryAlerts')}
                            >
                              <input type="checkbox" className="opacity-0 w-0 h-0" checked={notificationSettings.inventoryAlerts} readOnly />
                              <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${notificationSettings.inventoryAlerts ? 'bg-[#0bff7e]' : 'bg-[#2a2a2a]'} rounded-full transition-colors`}>
                                <span className={`absolute w-5 h-5 left-1 bottom-1 bg-white rounded-full transition-transform ${notificationSettings.inventoryAlerts ? 'translate-x-7' : 'translate-x-0'}`}></span>
                              </span>
                            </motion.div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-bold">Customer Messages</h4>
                              <p className="text-gray-400 text-sm">Notifications for new customer inquiries</p>
                            </div>
                            
                            <motion.div
                              className="relative w-14 h-7 flex-shrink-0"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleNotificationToggle('customerMessages')}
                            >
                              <input type="checkbox" className="opacity-0 w-0 h-0" checked={notificationSettings.customerMessages} readOnly />
                              <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${notificationSettings.customerMessages ? 'bg-[#0bff7e]' : 'bg-[#2a2a2a]'} rounded-full transition-colors`}>
                                <span className={`absolute w-5 h-5 left-1 bottom-1 bg-white rounded-full transition-transform ${notificationSettings.customerMessages ? 'translate-x-7' : 'translate-x-0'}`}></span>
                              </span>
                            </motion.div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-bold">Marketing & Promotions</h4>
                              <p className="text-gray-400 text-sm">Receive updates about marketing campaigns</p>
                            </div>
                            
                            <motion.div
                              className="relative w-14 h-7 flex-shrink-0"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleNotificationToggle('marketingPromotions')}
                            >
                              <input type="checkbox" className="opacity-0 w-0 h-0" checked={notificationSettings.marketingPromotions} readOnly />
                              <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${notificationSettings.marketingPromotions ? 'bg-[#0bff7e]' : 'bg-[#2a2a2a]'} rounded-full transition-colors`}>
                                <span className={`absolute w-5 h-5 left-1 bottom-1 bg-white rounded-full transition-transform ${notificationSettings.marketingPromotions ? 'translate-x-7' : 'translate-x-0'}`}></span>
                              </span>
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t border-[#2a2a2a]">
                          <h4 className="text-white font-bold mb-4">Notification Channels</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#0bff7e] bg-opacity-20 flex items-center justify-center mr-3">
                                  <i className="fas fa-envelope text-[#0bff7e]"></i>
                                </div>
                                <div>
                                  <div className="text-white">Email Notifications</div>
                                </div>
                              </div>
                              <motion.div
                                className="relative w-10 h-6 flex-shrink-0"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleNotificationToggle('emailNotifications')}
                              >
                                <input type="checkbox" className="opacity-0 w-0 h-0" checked={notificationSettings.emailNotifications} readOnly />
                                <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${notificationSettings.emailNotifications ? 'bg-[#0bff7e]' : 'bg-[#2a2a2a]'} rounded-full transition-colors`}>
                                  <span className={`absolute w-4 h-4 left-1 bottom-1 bg-white rounded-full transition-transform ${notificationSettings.emailNotifications ? 'translate-x-4' : 'translate-x-0'}`}></span>
                                </span>
                              </motion.div>
                            </div>
                            
                            <div className="bg-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#00b3ff] bg-opacity-20 flex items-center justify-center mr-3">
                                  <i className="fas fa-mobile-alt text-[#00b3ff]"></i>
                                </div>
                                <div>
                                  <div className="text-white">Push Notifications</div>
                                </div>
                              </div>
                              <motion.div
                                className="relative w-10 h-6 flex-shrink-0"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleNotificationToggle('pushNotifications')}
                              >
                                <input type="checkbox" className="opacity-0 w-0 h-0" checked={notificationSettings.pushNotifications} readOnly />
                                <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${notificationSettings.pushNotifications ? 'bg-[#00b3ff]' : 'bg-[#2a2a2a]'} rounded-full transition-colors`}>
                                  <span className={`absolute w-4 h-4 left-1 bottom-1 bg-white rounded-full transition-transform ${notificationSettings.pushNotifications ? 'translate-x-4' : 'translate-x-0'}`}></span>
                                </span>
                              </motion.div>
                            </div>
                            
                            <div className="bg-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#9d00ff] bg-opacity-20 flex items-center justify-center mr-3">
                                  <i className="fas fa-bell text-[#9d00ff]"></i>
                                </div>
                                <div>
                                  <div className="text-white">Browser Notifications</div>
                                </div>
                              </div>
                              <motion.div
                                className="relative w-10 h-6 flex-shrink-0"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleNotificationToggle('browserNotifications')}
                              >
                                <input type="checkbox" className="opacity-0 w-0 h-0" checked={notificationSettings.browserNotifications} readOnly />
                                <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${notificationSettings.browserNotifications ? 'bg-[#9d00ff]' : 'bg-[#2a2a2a]'} rounded-full transition-colors`}>
                                  <span className={`absolute w-4 h-4 left-1 bottom-1 bg-white rounded-full transition-transform ${notificationSettings.browserNotifications ? 'translate-x-4' : 'translate-x-0'}`}></span>
                                </span>
                              </motion.div>
                            </div>
                            
                            <div className="bg-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#ff6b9d] bg-opacity-20 flex items-center justify-center mr-3">
                                  <i className="fas fa-sms text-[#ff6b9d]"></i>
                                </div>
                                <div>
                                  <div className="text-white">SMS Notifications</div>
                                </div>
                              </div>
                              <motion.div
                                className="relative w-10 h-6 flex-shrink-0"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleNotificationToggle('smsNotifications')}
                              >
                                <input type="checkbox" className="opacity-0 w-0 h-0" checked={notificationSettings.smsNotifications} readOnly />
                                <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 ${notificationSettings.smsNotifications ? 'bg-[#ff6b9d]' : 'bg-[#2a2a2a]'} rounded-full transition-colors`}>
                                  <span className={`absolute w-4 h-4 left-1 bottom-1 bg-white rounded-full transition-transform ${notificationSettings.smsNotifications ? 'translate-x-4' : 'translate-x-0'}`}></span>
                                </span>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Danger Zone */}
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-red-900 border-opacity-50 overflow-hidden"
                    >
                      <div className="p-6 border-b border-red-900 border-opacity-50 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-red-900 bg-opacity-20 flex items-center justify-center mr-3">
                          <i className="fas fa-exclamation-triangle text-red-500"></i>
                        </div>
                        <h3 className="text-xl font-orbitron font-bold text-white">Danger Zone</h3>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-red-900 bg-opacity-10 p-4 rounded-xl">
                          <div className="mb-4 md:mb-0">
                            <h4 className="text-white font-bold">Delete Account</h4>
                            <p className="text-gray-400 text-sm">This action cannot be undone. All your data will be permanently deleted.</p>
                          </div>
                          
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-500 bg-opacity-20 text-red-500 rounded-xl text-sm font-medium"
                          >
                            Delete Account
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
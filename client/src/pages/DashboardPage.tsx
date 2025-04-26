import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getDiscountedProducts } from '../data/products';
import { useProducts } from '../context/ProductContext';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState<any>(null);
  const { products } = useProducts();
  const [authorizedUsers, setAuthorizedUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({ name: '', email: '', role: 'editor', authorized: true });
  const [_, setLocation] = useLocation();

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

  return (
    <div className="bg-[#121212] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-[#1e1e1e] rounded-lg shadow-lg p-6 cyberpunk-border mb-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[#0bff7e] mx-auto flex items-center justify-center text-black text-2xl font-bold">
                  {userInfo?.name.charAt(0)}
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mt-4">{userInfo?.name}</h3>
                <p className="text-gray-400 text-sm">{userInfo?.email}</p>
                <span className="inline-block bg-[#0bff7e] text-black text-xs px-2 py-1 rounded-full mt-2 font-bold uppercase">
                  {userInfo?.role}
                </span>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-[#2d2d2d] text-white' 
                      : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-white'
                  }`}
                >
                  <i className="fas fa-th-large mr-3"></i> Overview
                </button>
                <button 
                  onClick={() => setLocation('/admin')}
                  className="w-full text-left px-4 py-3 rounded-md transition-colors text-gray-400 hover:bg-[#2d2d2d] hover:text-white"
                >
                  <i className="fas fa-edit mr-3"></i> Product Management
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-[#2d2d2d] text-white' 
                      : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-white'
                  }`}
                >
                  <i className="fas fa-shopping-cart mr-3"></i> Orders
                </button>
                <button 
                  onClick={() => setActiveTab('customers')}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'customers' 
                      ? 'bg-[#2d2d2d] text-white' 
                      : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-white'
                  }`}
                >
                  <i className="fas fa-users mr-3"></i> Customers
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'analytics' 
                      ? 'bg-[#2d2d2d] text-white' 
                      : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-white'
                  }`}
                >
                  <i className="fas fa-chart-line mr-3"></i> Analytics
                </button>
                
                {/* Only show Users tab for the owner */}
                {isOwner && (
                  <button 
                    onClick={() => setActiveTab('users')}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'users' 
                        ? 'bg-[#2d2d2d] text-white' 
                        : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-white'
                    }`}
                  >
                    <i className="fas fa-user-shield mr-3"></i> Users
                  </button>
                )}
                
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-[#2d2d2d] text-white' 
                      : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-white'
                  }`}
                >
                  <i className="fas fa-cog mr-3"></i> Settings
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#2d2d2d]">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-md text-red-500 hover:bg-red-900 hover:bg-opacity-20 transition-colors"
                >
                  <i className="fas fa-sign-out-alt mr-3"></i> Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-8">Dashboard Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-t-4 border-[#0bff7e]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#0bff7e] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-dollar-sign text-[#0bff7e]"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-t-4 border-[#00b3ff]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">Total Orders</p>
                        <h3 className="text-2xl font-bold text-white">{stats.totalOrders}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#00b3ff] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-shopping-bag text-[#00b3ff]"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-t-4 border-[#9d00ff]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">Total Products</p>
                        <h3 className="text-2xl font-bold text-white">{stats.totalProducts}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#9d00ff] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-box text-[#9d00ff]"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#1e1e1e] rounded-lg shadow-lg mb-8 overflow-hidden">
                  <div className="p-6 border-b border-[#2d2d2d]">
                    <h3 className="text-xl font-orbitron font-bold text-white">Recent Orders</h3>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full">
                        <thead>
                          <tr className="border-b border-[#2d2d2d]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Products</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { id: 'ORD-8423', customer: 'John Smith', products: 3, total: 459.99, status: 'Delivered' },
                            { id: 'ORD-8422', customer: 'Emma Johnson', products: 1, total: 899.99, status: 'Processing' },
                            { id: 'ORD-8421', customer: 'Michael Brown', products: 2, total: 329.97, status: 'Shipped' },
                            { id: 'ORD-8420', customer: 'Sarah Garcia', products: 5, total: 1239.95, status: 'Pending' },
                            { id: 'ORD-8419', customer: 'David Miller', products: 2, total: 549.98, status: 'Delivered' },
                          ].map((order, index) => (
                            <tr key={index} className="border-b border-[#2d2d2d] hover:bg-[#232323]">
                              <td className="px-4 py-4 whitespace-nowrap text-white">{order.id}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-white">{order.customer}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-white">{order.products}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-white">${order.total.toFixed(2)}</td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  order.status === 'Delivered' ? 'bg-green-900 bg-opacity-20 text-green-500' :
                                  order.status === 'Shipped' ? 'bg-blue-900 bg-opacity-20 text-blue-500' :
                                  order.status === 'Processing' ? 'bg-yellow-900 bg-opacity-20 text-yellow-500' :
                                  'bg-red-900 bg-opacity-20 text-red-500'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[#2d2d2d]">
                      <h3 className="text-xl font-orbitron font-bold text-white">Inventory Status</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Out of Stock</span>
                            <span className="text-white">{stats.outOfStock} products</span>
                          </div>
                          <div className="w-full bg-[#2d2d2d] rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(stats.outOfStock / stats.totalProducts) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Discounted Items</span>
                            <span className="text-white">{stats.discountedItems} products</span>
                          </div>
                          <div className="w-full bg-[#2d2d2d] rounded-full h-2">
                            <div
                              className="bg-[#0bff7e] h-2 rounded-full"
                              style={{ width: `${(stats.discountedItems / stats.totalProducts) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Pending Orders</span>
                            <span className="text-white">{stats.pendingOrders} orders</span>
                          </div>
                          <div className="w-full bg-[#2d2d2d] rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[#2d2d2d]">
                      <h3 className="text-xl font-orbitron font-bold text-white">Quick Actions</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setActiveTab('orders')}
                          className="bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors p-4 rounded-lg text-white flex flex-col items-center"
                        >
                          <i className="fas fa-truck text-[#9d00ff] text-2xl mb-2"></i>
                          <span className="text-sm">Update Orders</span>
                        </button>
                        
                        <button 
                          onClick={() => setActiveTab('analytics')}
                          className="bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors p-4 rounded-lg text-white flex flex-col items-center"
                        >
                          <i className="fas fa-chart-bar text-[#ff6b9d] text-2xl mb-2"></i>
                          <span className="text-sm">View Reports</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'users' && isOwner && (
              <div>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-8">User Management</h2>
                
                <div className="bg-[#1e1e1e] rounded-lg shadow-lg mb-8 overflow-hidden">
                  <div className="p-6 border-b border-[#2d2d2d]">
                    <h3 className="text-xl font-orbitron font-bold text-white">Authorized Users</h3>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full">
                        <thead>
                          <tr className="border-b border-[#2d2d2d]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {authorizedUsers.map((user, index) => (
                            <tr key={index} className="border-b border-[#2d2d2d] hover:bg-[#232323]">
                              <td className="px-4 py-4 whitespace-nowrap text-white">{user.name}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-white">{user.email}</td>
                              <td className="px-4 py-4 whitespace-nowrap">
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
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  user.authorized 
                                    ? 'bg-green-900 bg-opacity-20 text-green-500' 
                                    : 'bg-red-900 bg-opacity-20 text-red-500'
                                }`}>
                                  {user.authorized ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => toggleUserAuthorization(user.email)}
                                    className={`p-2 rounded-md ${
                                      user.email === OWNER_EMAIL 
                                        ? 'text-gray-600 cursor-not-allowed' 
                                        : user.authorized 
                                          ? 'text-red-500 hover:bg-red-900 hover:bg-opacity-20' 
                                          : 'text-green-500 hover:bg-green-900 hover:bg-opacity-20'
                                    }`}
                                    disabled={user.email === OWNER_EMAIL}
                                  >
                                    <i className={`fas ${user.authorized ? 'fa-user-lock' : 'fa-user-check'}`}></i>
                                  </button>
                                  <button 
                                    onClick={() => removeAuthorizedUser(user.email)}
                                    className={`p-2 text-red-500 hover:bg-red-900 hover:bg-opacity-20 rounded-md ${
                                      user.email === OWNER_EMAIL ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={user.email === OWNER_EMAIL}
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
                  </div>
                </div>
                
                <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-[#2d2d2d]">
                    <h3 className="text-xl font-orbitron font-bold text-white">Add New User</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Name</label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
                          placeholder="User Name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Email</label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
                          placeholder="user@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'manager' | 'editor'})}
                          className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none"
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="editor">Editor</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={addAuthorizedUser}
                        className="bg-[#0bff7e] text-black px-4 py-2 rounded-lg font-bold"
                        disabled={!newUser.name || !newUser.email}
                      >
                        Add User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-8">Analytics Dashboard</h2>
                
                {/* Stats Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-lg p-6 border-l-4 border-[#0bff7e] shadow-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-white mt-1">${stats.revenue.toLocaleString()}</h3>
                        <span className="inline-block text-[#0bff7e] text-sm mt-2">
                          <i className="fas fa-arrow-up mr-1"></i> 12.5%
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#0bff7e] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-dollar-sign text-[#0bff7e] text-xl"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-lg p-6 border-l-4 border-[#00b3ff] shadow-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Total Orders</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stats.totalOrders}</h3>
                        <span className="inline-block text-[#00b3ff] text-sm mt-2">
                          <i className="fas fa-arrow-up mr-1"></i> 8.3%
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#00b3ff] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-shopping-bag text-[#00b3ff] text-xl"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-lg p-6 border-l-4 border-[#ff6b9d] shadow-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Conversion Rate</p>
                        <h3 className="text-3xl font-bold text-white mt-1">3.6%</h3>
                        <span className="inline-block text-[#ff6b9d] text-sm mt-2">
                          <i className="fas fa-arrow-up mr-1"></i> 2.1%
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#ff6b9d] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-exchange-alt text-[#ff6b9d] text-xl"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-lg p-6 border-l-4 border-[#9d00ff] shadow-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm">Avg. Order Value</p>
                        <h3 className="text-3xl font-bold text-white mt-1">$320</h3>
                        <span className="inline-block text-red-400 text-sm mt-2">
                          <i className="fas fa-arrow-down mr-1"></i> 0.8%
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#9d00ff] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-tag text-[#9d00ff] text-xl"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sales Trend Chart */}
                <div className="bg-[#1e1e1e] rounded-lg shadow-lg mb-8 overflow-hidden">
                  <div className="p-6 border-b border-[#2d2d2d] flex flex-wrap justify-between items-center">
                    <h3 className="text-xl font-orbitron font-bold text-white">Sales Trend</h3>
                    <div className="flex space-x-4 mt-2 md:mt-0">
                      <select className="bg-[#2d2d2d] text-white border border-[#3d3d3d] rounded px-3 py-1 text-sm">
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                      <button className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white rounded px-3 py-1 text-sm">
                        <i className="fas fa-download mr-1"></i> Export
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Sales Chart Visualization */}
                    <div className="h-80 w-full relative">
                      {/* Fake Chart Background */}
                      <div className="absolute inset-0 grid grid-cols-7 gap-0.5">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className="flex flex-col justify-end h-full">
                            <div 
                              className={`bg-gradient-to-t from-[#0bff7e] to-[#0bff7e50] rounded-t-sm opacity-80 w-full`} 
                              style={{ 
                                height: `${Math.floor(30 + Math.random() * 70)}%`,
                              }}
                            ></div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Chart Overlay Grid */}
                      <div className="absolute inset-0 grid grid-rows-4 border-b border-t border-[#2d2d2d]">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="border-b border-[#2d2d2d] border-dashed flex items-center">
                            <span className="text-xs text-gray-500 w-10">
                              ${(10000 - i * 2500).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* X Axis Labels */}
                      <div className="absolute bottom-0 left-10 right-0 flex justify-between">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                          <span key={i} className="text-xs text-gray-500">{day}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Analytics Sections (Top Row) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Top Products */}
                  <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[#2d2d2d]">
                      <h3 className="text-xl font-orbitron font-bold text-white">Top Products</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        {products.slice(0, 4).map((product, index) => (
                          <div key={index} className="flex items-center">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-10 h-10 rounded-md object-cover mr-3" 
                            />
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-white text-sm font-semibold">{product.name}</span>
                                <span className="text-white text-sm font-bold">${(product.price * (5 - index)).toFixed(2)}</span>
                              </div>
                              <div className="w-full bg-[#2d2d2d] rounded-full h-1.5">
                                <div 
                                  className="bg-[#0bff7e] h-1.5 rounded-full" 
                                  style={{ width: `${85 - (index * 12)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Traffic Sources */}
                  <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[#2d2d2d]">
                      <h3 className="text-xl font-orbitron font-bold text-white">Traffic Sources</h3>
                    </div>
                    <div className="p-6 flex justify-between">
                      {/* Pie Chart Visualization */}
                      <div className="w-32 h-32 rounded-full border-8 border-[#2d2d2d] relative mx-auto md:mx-0">
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 bg-[#0bff7e] w-1/2 h-full"></div>
                          <div className="absolute top-0 right-0 bg-[#00b3ff] w-1/2 h-1/2"></div>
                          <div className="absolute bottom-0 right-0 bg-[#9d00ff] w-1/2 h-1/2"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 flex-1 ml-6 justify-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-[#0bff7e] rounded-full mr-2"></div>
                          <span className="text-gray-300 text-sm">Organic Search (50%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-[#00b3ff] rounded-full mr-2"></div>
                          <span className="text-gray-300 text-sm">Direct (25%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-[#9d00ff] rounded-full mr-2"></div>
                          <span className="text-gray-300 text-sm">Social Media (25%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Analytics Sections (Bottom Row) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Conversion Rate */}
                  <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[#2d2d2d]">
                      <h3 className="text-xl font-orbitron font-bold text-white">Conversion Funnel</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="relative pt-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-sm">Sessions</span>
                            <span className="text-white text-sm font-bold">8,249</span>
                          </div>
                          <div className="w-full bg-[#2d2d2d] rounded-full h-3">
                            <div className="bg-[#0bff7e] h-3 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-sm">Product Views</span>
                            <span className="text-white text-sm font-bold">4,872</span>
                          </div>
                          <div className="w-full bg-[#2d2d2d] rounded-full h-3">
                            <div className="bg-[#00b3ff] h-3 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-sm">Add to Cart</span>
                            <span className="text-white text-sm font-bold">952</span>
                          </div>
                          <div className="w-full bg-[#2d2d2d] rounded-full h-3">
                            <div className="bg-[#9d00ff] h-3 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300 text-sm">Purchases</span>
                            <span className="text-white text-sm font-bold">157</span>
                          </div>
                          <div className="w-full bg-[#2d2d2d] rounded-full h-3">
                            <div className="bg-[#ff6b9d] h-3 rounded-full" style={{ width: '12%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden lg:col-span-2">
                    <div className="p-6 border-b border-[#2d2d2d]">
                      <h3 className="text-xl font-orbitron font-bold text-white">Recent Activity</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="flex">
                          <div className="min-w-[48px] flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#0bff7e] bg-opacity-20 flex items-center justify-center text-[#0bff7e]">
                              <i className="fas fa-shopping-cart"></i>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-white mb-1">New order placed <span className="text-[#0bff7e] font-bold">#ORD-8423</span></p>
                            <p className="text-gray-400 text-sm">John Smith purchased RTX 4090 GPU for $1,599.99</p>
                            <p className="text-gray-500 text-xs mt-1">5 minutes ago</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="min-w-[48px] flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#00b3ff] bg-opacity-20 flex items-center justify-center text-[#00b3ff]">
                              <i className="fas fa-user-plus"></i>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-white mb-1">New customer registered</p>
                            <p className="text-gray-400 text-sm">Emma Johnson created a new account</p>
                            <p className="text-gray-500 text-xs mt-1">28 minutes ago</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="min-w-[48px] flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#9d00ff] bg-opacity-20 flex items-center justify-center text-[#9d00ff]">
                              <i className="fas fa-star"></i>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-white mb-1">New review received</p>
                            <p className="text-gray-400 text-sm">Sarah Garcia gave AMD Ryzen 9 CPU a 5-star rating</p>
                            <p className="text-gray-500 text-xs mt-1">1 hour ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-8">Orders Management</h2>
                
                {/* Order Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-l-4 border-[#0bff7e] shadow-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Orders</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{stats.totalOrders}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#0bff7e] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-shopping-cart text-[#0bff7e]"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-l-4 border-[#00b3ff] shadow-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Pending</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{stats.pendingOrders}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#00b3ff] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-clock text-[#00b3ff]"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-l-4 border-[#9d00ff] shadow-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Processing</p>
                        <h3 className="text-2xl font-bold text-white mt-1">38</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#9d00ff] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-spinner text-[#9d00ff]"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-l-4 border-green-500 shadow-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Completed</p>
                        <h3 className="text-2xl font-bold text-white mt-1">96</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-green-500 bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-check text-green-500"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Filters and Actions */}
                <div className="bg-[#1e1e1e] rounded-lg shadow-lg p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">Order Status</label>
                      <select className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none">
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">Date Range</label>
                      <select className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none">
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">Search</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Order ID or customer..."
                          className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg pl-10 pr-4 py-2 outline-none"
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <button className="w-full bg-[#0bff7e] hover:bg-[#00d966] text-black font-bold rounded-lg px-4 py-2 transition-colors">
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Orders Table */}
                <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-[#2d2d2d] flex justify-between items-center">
                    <h3 className="text-xl font-orbitron font-bold text-white">Recent Orders</h3>
                    <div className="flex space-x-2">
                      <button className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white text-sm rounded-lg px-3 py-1 flex items-center space-x-1">
                        <i className="fas fa-download text-xs"></i>
                        <span>Export</span>
                      </button>
                      <button className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white text-sm rounded-lg px-3 py-1 flex items-center space-x-1">
                        <i className="fas fa-print text-xs"></i>
                        <span>Print</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead className="bg-[#2d2d2d]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2d2d2d]">
                        {[
                          { 
                            id: 'ORD-8423', 
                            customer: 'John Smith', 
                            email: 'john.smith@example.com',
                            date: '2023-07-15',
                            total: 1599.99, 
                            status: 'Delivered',
                            products: 1
                          },
                          { 
                            id: 'ORD-8422', 
                            customer: 'Emma Johnson', 
                            email: 'emma.j@example.com',
                            date: '2023-07-14',
                            total: 899.99, 
                            status: 'Processing',
                            products: 3
                          },
                          { 
                            id: 'ORD-8421', 
                            customer: 'Michael Brown', 
                            email: 'michael.b@example.com',
                            date: '2023-07-14',
                            total: 329.97, 
                            status: 'Shipped',
                            products: 2
                          },
                          { 
                            id: 'ORD-8420', 
                            customer: 'Sarah Garcia', 
                            email: 'sarah.g@example.com',
                            date: '2023-07-13',
                            total: 1239.95, 
                            status: 'Pending',
                            products: 5
                          },
                          { 
                            id: 'ORD-8419', 
                            customer: 'David Miller', 
                            email: 'david.m@example.com',
                            date: '2023-07-12',
                            total: 549.98, 
                            status: 'Delivered',
                            products: 2
                          },
                        ].map((order, index) => (
                          <tr key={index} className="hover:bg-[#252525]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-[#0bff7e] font-medium">{order.id}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-white">{order.customer}</div>
                              <div className="text-gray-400 text-sm">{order.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              {order.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-white font-medium">${order.total.toFixed(2)}</div>
                              <div className="text-gray-400 text-sm">{order.products} {order.products === 1 ? 'item' : 'items'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                order.status === 'Delivered' ? 'bg-green-900 bg-opacity-20 text-green-500' :
                                order.status === 'Shipped' ? 'bg-blue-900 bg-opacity-20 text-blue-500' :
                                order.status === 'Processing' ? 'bg-yellow-900 bg-opacity-20 text-yellow-500' :
                                'bg-red-900 bg-opacity-20 text-red-500'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button className="p-2 rounded-md bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white transition-colors" title="View Details">
                                  <i className="fas fa-eye text-xs"></i>
                                </button>
                                <button className="p-2 rounded-md bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white transition-colors" title="Edit Order">
                                  <i className="fas fa-edit text-xs"></i>
                                </button>
                                <button className="p-2 rounded-md bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white transition-colors" title="Print Invoice">
                                  <i className="fas fa-file-invoice text-xs"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <div className="px-6 py-4 bg-[#1e1e1e] border-t border-[#2d2d2d] flex justify-between items-center">
                    <div className="text-gray-400 text-sm">
                      Showing <span className="text-white">1</span> to <span className="text-white">5</span> of <span className="text-white">42</span> entries
                    </div>
                    <div className="flex space-x-1">
                      <button className="px-3 py-1 bg-[#2d2d2d] text-gray-400 rounded disabled:opacity-50" disabled>
                        <i className="fas fa-chevron-left text-xs"></i>
                      </button>
                      <button className="px-3 py-1 bg-[#0bff7e] text-black font-bold rounded">
                        1
                      </button>
                      <button className="px-3 py-1 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white rounded">
                        2
                      </button>
                      <button className="px-3 py-1 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white rounded">
                        3
                      </button>
                      <button className="px-3 py-1 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white rounded">
                        <i className="fas fa-chevron-right text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'customers' && (
              <div>
                <h2 className="text-3xl font-orbitron font-bold text-white mb-8">Customer Management</h2>
                
                {/* Customer Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-l-4 border-[#0bff7e] shadow-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Customers</p>
                        <h3 className="text-2xl font-bold text-white mt-1">1,842</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#0bff7e] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-users text-[#0bff7e]"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-l-4 border-[#00b3ff] shadow-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">New This Month</p>
                        <h3 className="text-2xl font-bold text-white mt-1">156</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#00b3ff] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-user-plus text-[#00b3ff]"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-l-4 border-[#9d00ff] shadow-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Active Users</p>
                        <h3 className="text-2xl font-bold text-white mt-1">896</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#9d00ff] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-user-check text-[#9d00ff]"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e1e1e] rounded-lg p-6 border-l-4 border-[#ff6b9d] shadow-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Avg. Spend</p>
                        <h3 className="text-2xl font-bold text-white mt-1">$354</h3>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#ff6b9d] bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-dollar-sign text-[#ff6b9d]"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Customer Search and Tools */}
                <div className="bg-[#1e1e1e] rounded-lg shadow-lg p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search customers..."
                          className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg pl-10 pr-4 py-2 outline-none"
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                      </div>
                    </div>
                    
                    <div>
                      <select className="w-full bg-[#2d2d2d] text-white border border-[#3d3d3d] focus:border-[#0bff7e] rounded-lg px-4 py-2 outline-none">
                        <option value="all">All Customers</option>
                        <option value="new">New Customers</option>
                        <option value="returning">Returning</option>
                        <option value="vip">VIP</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    
                    <div>
                      <button className="w-full bg-[#0bff7e] hover:bg-[#00d966] text-black font-bold rounded-lg px-4 py-2 transition-colors flex items-center justify-center">
                        <i className="fas fa-plus mr-2"></i>
                        Add Customer
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Customer List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {/* Customer Cards */}
                  {[
                    {
                      name: "John Smith",
                      email: "john.smith@example.com",
                      location: "New York, USA",
                      joined: "May 12, 2023",
                      orders: 5,
                      spent: 1834.98,
                      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                      status: "active"
                    },
                    {
                      name: "Emma Johnson",
                      email: "emma.j@example.com",
                      location: "London, UK",
                      joined: "Jan 7, 2023",
                      orders: 3,
                      spent: 899.99,
                      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                      status: "active"
                    },
                    {
                      name: "Michael Brown",
                      email: "michael.b@example.com",
                      location: "Sydney, Australia",
                      joined: "Mar 18, 2023",
                      orders: 7,
                      spent: 2129.45,
                      avatar: "https://randomuser.me/api/portraits/men/21.jpg",
                      status: "vip"
                    },
                    {
                      name: "Sarah Garcia",
                      email: "sarah.g@example.com",
                      location: "Toronto, Canada",
                      joined: "Jun 2, 2023",
                      orders: 2,
                      spent: 599.99,
                      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
                      status: "new"
                    },
                    {
                      name: "David Wilson",
                      email: "david.w@example.com",
                      location: "Berlin, Germany",
                      joined: "Apr 23, 2023",
                      orders: 4,
                      spent: 1459.96,
                      avatar: "https://randomuser.me/api/portraits/men/78.jpg",
                      status: "active"
                    },
                    {
                      name: "Lisa Chen",
                      email: "lisa.c@example.com",
                      location: "Singapore",
                      joined: "Feb 14, 2023",
                      orders: 6,
                      spent: 2678.50,
                      avatar: "https://randomuser.me/api/portraits/women/79.jpg",
                      status: "vip"
                    }
                  ].map((customer, index) => (
                    <div key={index} className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg">
                      <div className="p-6 border-b border-[#2d2d2d]">
                        <div className="flex items-center">
                          <img 
                            src={customer.avatar} 
                            alt={customer.name} 
                            className="w-12 h-12 rounded-full object-cover mr-4" 
                          />
                          <div>
                            <h4 className="text-lg font-bold text-white">{customer.name}</h4>
                            <p className="text-gray-400 text-sm">{customer.email}</p>
                          </div>
                          <div className="ml-auto">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              customer.status === 'vip' ? 'bg-[#9d00ff] bg-opacity-20 text-[#9d00ff]' :
                              customer.status === 'new' ? 'bg-[#00b3ff] bg-opacity-20 text-[#00b3ff]' :
                              'bg-green-900 bg-opacity-20 text-green-500'
                            }`}>
                              {customer.status === 'vip' ? 'VIP' : 
                               customer.status === 'new' ? 'New' : 'Active'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Location</p>
                            <p className="text-white text-sm">{customer.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Joined</p>
                            <p className="text-white text-sm">{customer.joined}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Orders</p>
                            <p className="text-white text-sm">{customer.orders}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Total Spent</p>
                            <p className="text-white text-sm">${customer.spent.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between space-x-2">
                          <button className="flex-1 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white text-sm rounded-lg py-2 transition-colors">
                            <i className="fas fa-eye mr-1"></i> Profile
                          </button>
                          <button className="flex-1 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white text-sm rounded-lg py-2 transition-colors">
                            <i className="fas fa-envelope mr-1"></i> Message
                          </button>
                          <button className="w-10 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white text-sm rounded-lg py-2 transition-colors">
                            <i className="fas fa-ellipsis-h"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Customer Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customer Activity */}
                  <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[#2d2d2d]">
                      <h3 className="text-xl font-orbitron font-bold text-white">Customer Activity</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-start">
                          <div className="min-w-[40px] h-10 flex justify-center">
                            <div className="w-2 h-full bg-[#0bff7e] rounded-full"></div>
                          </div>
                          <div className="ml-4">
                            <p className="text-white mb-1">John Smith placed an order</p>
                            <p className="text-gray-400 text-sm">Order #ORD-8423 - $1,599.99</p>
                            <p className="text-gray-500 text-xs mt-1">2 hours ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="min-w-[40px] h-10 flex justify-center">
                            <div className="w-2 h-full bg-[#00b3ff] rounded-full"></div>
                          </div>
                          <div className="ml-4">
                            <p className="text-white mb-1">Sarah Garcia created an account</p>
                            <p className="text-gray-400 text-sm">New customer registration</p>
                            <p className="text-gray-500 text-xs mt-1">5 hours ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="min-w-[40px] h-10 flex justify-center">
                            <div className="w-2 h-full bg-[#9d00ff] rounded-full"></div>
                          </div>
                          <div className="ml-4">
                            <p className="text-white mb-1">Michael Brown left a review</p>
                            <p className="text-gray-400 text-sm">5-star rating for RTX 4080 GPU</p>
                            <p className="text-gray-500 text-xs mt-1">Yesterday</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="min-w-[40px] h-10 flex justify-center">
                            <div className="w-2 h-full bg-[#ff6b9d] rounded-full"></div>
                          </div>
                          <div className="ml-4">
                            <p className="text-white mb-1">Lisa Chen added items to wishlist</p>
                            <p className="text-gray-400 text-sm">3 products added to wishlist</p>
                            <p className="text-gray-500 text-xs mt-1">Yesterday</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer Demographics */}
                  <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[#2d2d2d]">
                      <h3 className="text-xl font-orbitron font-bold text-white">Customer Demographics</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Gender Distribution */}
                        <div>
                          <h4 className="text-white text-sm font-bold mb-4">Gender Distribution</h4>
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs text-gray-400 inline-block py-1">
                                  Male
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-400 inline-block py-1">
                                  58%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-[#2d2d2d]">
                              <div style={{ width: "58%" }} className="bg-[#00b3ff] rounded"></div>
                            </div>
                          </div>
                          <div className="relative pt-1 mt-3">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs text-gray-400 inline-block py-1">
                                  Female
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-400 inline-block py-1">
                                  42%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-[#2d2d2d]">
                              <div style={{ width: "42%" }} className="bg-[#ff6b9d] rounded"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Age Distribution */}
                        <div>
                          <h4 className="text-white text-sm font-bold mb-4">Age Distribution</h4>
                          <div className="space-y-3">
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs text-gray-400 inline-block py-1">
                                    18-24
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400 inline-block py-1">
                                    15%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 text-xs flex rounded bg-[#2d2d2d]">
                                <div style={{ width: "15%" }} className="bg-[#0bff7e] rounded"></div>
                              </div>
                            </div>
                            
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs text-gray-400 inline-block py-1">
                                    25-34
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400 inline-block py-1">
                                    38%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 text-xs flex rounded bg-[#2d2d2d]">
                                <div style={{ width: "38%" }} className="bg-[#00b3ff] rounded"></div>
                              </div>
                            </div>
                            
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs text-gray-400 inline-block py-1">
                                    35-44
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400 inline-block py-1">
                                    25%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 text-xs flex rounded bg-[#2d2d2d]">
                                <div style={{ width: "25%" }} className="bg-[#9d00ff] rounded"></div>
                              </div>
                            </div>
                            
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs text-gray-400 inline-block py-1">
                                    45+
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400 inline-block py-1">
                                    22%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 text-xs flex rounded bg-[#2d2d2d]">
                                <div style={{ width: "22%" }} className="bg-[#ff6b9d] rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Location Map Placeholder */}
                        <div className="col-span-2 mt-4">
                          <h4 className="text-white text-sm font-bold mb-4">Geographic Distribution</h4>
                          <div className="h-40 bg-[#2d2d2d] rounded-lg flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <i className="fas fa-map-marked-alt text-2xl mb-2"></i>
                              <p>Interactive map would be displayed here</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {(activeTab === 'customers' || activeTab === 'settings') && (
              <div className="bg-[#1e1e1e] rounded-lg shadow-lg p-8 text-center">
                <div className="w-24 h-24 mx-auto flex items-center justify-center bg-[#2d2d2d] rounded-full text-gray-400 mb-6">
                  <i className={`fas ${
                    activeTab === 'customers' ? 'fa-users' :
                    'fa-cogs'
                  } text-4xl`}></i>
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-4">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                </h3>
                <p className="text-gray-400 mb-6">
                  This section is under development. More features coming soon!
                </p>
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="px-6 py-3 bg-[#0bff7e] text-black font-bold rounded-md"
                >
                  Back to Overview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
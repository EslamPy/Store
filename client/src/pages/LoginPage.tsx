import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Owner and authorized users
const OWNER_EMAIL = 'eslamdev@outlook.de';

interface User {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor';
  authorized: boolean;
}

// Access control for dashboard
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [_, setLocation] = useLocation();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [newAccountPassword, setNewAccountPassword] = useState('');
  const [newAccountName, setNewAccountName] = useState('');

  useEffect(() => {
    document.title = 'Login - MedTech';
  }, []);

  // Get authorized users from localStorage or initialize with owner
  const getAuthorizedUsers = (): User[] => {
    const storedUsers = localStorage.getItem('authorizedUsers');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    
    // Initialize with owner
    const initialUsers: User[] = [
      {
        name: 'Admin',
        email: OWNER_EMAIL,
        role: 'admin',
        authorized: true
      }
    ];
    
    localStorage.setItem('authorizedUsers', JSON.stringify(initialUsers));
    return initialUsers;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Get authorized users
    const authorizedUsers = getAuthorizedUsers();
    
    // Check if user is authorized
    const user = authorizedUsers.find(user => user.email === email && user.authorized);
    
    setTimeout(() => {
      if (user) {
        // Set login status and user info
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        setLoading(false);
        setLocation('/dashboard');
      } else if (email === OWNER_EMAIL) {
        // Owner always has access, even if not in authorized list
        const ownerUser: User = {
          name: 'Admin',
          email: OWNER_EMAIL,
          role: 'admin',
          authorized: true
        };
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(ownerUser));
        
        // Make sure owner is in authorized users list
        if (!authorizedUsers.some(u => u.email === OWNER_EMAIL)) {
          authorizedUsers.push(ownerUser);
          localStorage.setItem('authorizedUsers', JSON.stringify(authorizedUsers));
        }
        
        setLoading(false);
        setLocation('/dashboard');
      } else {
        // Not authorized
        setError('Access denied. You are not authorized to access the dashboard.');
        setLoading(false);
      }
    }, 1500);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // For demo purposes, create a new user and add to authorized users
    const authorizedUsers = getAuthorizedUsers();
    
    // Check if email already exists
    if (authorizedUsers.some(user => user.email === newAccountEmail)) {
      setError('An account with this email already exists.');
      setLoading(false);
      return;
    }
    
    // Create new user - in a real app, this would involve proper backend validation
    const newUser: User = {
      name: newAccountName,
      email: newAccountEmail,
      role: 'editor', // Default role for new users
      authorized: true
    };
    
    authorizedUsers.push(newUser);
    localStorage.setItem('authorizedUsers', JSON.stringify(authorizedUsers));
    
    // Auto login the new user
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
    
    setTimeout(() => {
      setLoading(false);
      setLocation('/dashboard');
    }, 1500);
  };
  
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would trigger a password reset email
    alert(`Password reset link has been sent to ${email}`);
    setShowForgotPassword(false);
  };

  // Check for remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Decorative Elements */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#0bff7e] opacity-10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#00b3ff] opacity-10 rounded-full blur-xl"></div>
        
        <div className="text-center relative">
          <h1 className="text-4xl font-orbitron font-bold text-white mb-1 tracking-wider">
            MED<span className="text-[#0bff7e]">TECH</span>
          </h1>
          <div className="h-0.5 w-20 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] mx-auto mb-4"></div>
          <h2 className="text-2xl font-orbitron font-bold text-white mb-2">
            {showCreateAccount ? 'Create Account' : (showForgotPassword ? 'Reset Password' : 'Welcome Back')}
          </h2>
          <p className="text-gray-400 font-poppins">
            {showCreateAccount ? 'Join our community today' : (showForgotPassword ? 'Enter your email to receive a reset link' : 'Sign in to access your account')}
          </p>
        </div>
        
        <div className="bg-[#1e1e1e] rounded-2xl shadow-2xl p-8 border border-[#272727] backdrop-blur-sm relative z-10 transform transition-all duration-300">
          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          {!showCreateAccount && !showForgotPassword ? (
            // Login Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2 text-sm font-medium">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-500"></i>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] focus:ring-1 focus:ring-[#0bff7e] rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="text-gray-300 text-sm font-medium">Password</label>
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[#0bff7e] text-sm hover:text-[#00ffbb] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-500"></i>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] focus:ring-1 focus:ring-[#0bff7e] rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 bg-[#121212] rounded-full shadow-inner ${rememberMe ? 'bg-[#0bff7e] bg-opacity-50' : 'bg-gray-800'} transition-colors duration-200`}></div>
                    <div className={`absolute w-4 h-4 ${rememberMe ? 'bg-[#0bff7e] transform translate-x-5' : 'bg-gray-400 transform translate-x-1'} rounded-full shadow inset-y-0.5 left-0 transition-transform duration-200`}></div>
                  </div>
                  <div className="ml-3 text-gray-300 text-sm">Remember me</div>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] hover:from-[#00ffbb] hover:to-[#00c3ff] text-black font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex justify-center items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Sign In
                  </>
                )}
              </button>
              
              <div className="flex items-center py-3">
                <div className="flex-grow h-0.5 bg-[#2d2d2d]"></div>
                <span className="px-4 text-sm text-gray-400">or continue with</span>
                <div className="flex-grow h-0.5 bg-[#2d2d2d]"></div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  type="button"
                  className="p-3 bg-[#1877F2] text-white rounded-xl hover:bg-opacity-90 transition-all duration-200 w-12 h-12 flex items-center justify-center"
                >
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button 
                  type="button"
                  className="p-3 bg-black text-white rounded-xl hover:bg-opacity-80 transition-all duration-200 w-12 h-12 flex items-center justify-center"
                >
                  <i className="fab fa-apple"></i>
                </button>
                <button 
                  type="button"
                  className="p-3 bg-[#DB4437] text-white rounded-xl hover:bg-opacity-90 transition-all duration-200 w-12 h-12 flex items-center justify-center"
                >
                  <i className="fab fa-google"></i>
                </button>
              </div>
            </form>
          ) : showForgotPassword ? (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label htmlFor="reset-email" className="block text-gray-300 mb-2 text-sm font-medium">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-500"></i>
                  </div>
                  <input
                    type="email"
                    id="reset-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] focus:ring-1 focus:ring-[#0bff7e] rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] hover:from-[#00ffbb] hover:to-[#00c3ff] text-black font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Send Reset Link
              </button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-[#0bff7e] hover:text-[#00ffbb] transition-colors text-sm"
                >
                  <i className="fas fa-arrow-left mr-1"></i> Back to Login
                </button>
              </div>
            </form>
          ) : (
            // Create Account Form
            <form onSubmit={handleCreateAccount} className="space-y-6">
              <div>
                <label htmlFor="new-name" className="block text-gray-300 mb-2 text-sm font-medium">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-500"></i>
                  </div>
                  <input
                    type="text"
                    id="new-name"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] focus:ring-1 focus:ring-[#0bff7e] rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="new-email" className="block text-gray-300 mb-2 text-sm font-medium">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-500"></i>
                  </div>
                  <input
                    type="email"
                    id="new-email"
                    value={newAccountEmail}
                    onChange={(e) => setNewAccountEmail(e.target.value)}
                    className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] focus:ring-1 focus:ring-[#0bff7e] rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-500"></i>
                  </div>
                  <input
                    type="password"
                    id="new-password"
                    value={newAccountPassword}
                    onChange={(e) => setNewAccountPassword(e.target.value)}
                    className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] focus:ring-1 focus:ring-[#0bff7e] rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0bff7e] to-[#00b3ff] hover:from-[#00ffbb] hover:to-[#00c3ff] text-black font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex justify-center items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <i className="fas fa-user-plus mr-2"></i>
                    Create Account
                  </>
                )}
              </button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAccount(false)}
                  className="text-[#0bff7e] hover:text-[#00ffbb] transition-colors text-sm"
                >
                  <i className="fas fa-arrow-left mr-1"></i> Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
        
        {!showCreateAccount && !showForgotPassword && (
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <button 
                onClick={() => setShowCreateAccount(true)}
                className="text-[#0bff7e] hover:text-[#00ffbb] transition-colors font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} MedTech. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 
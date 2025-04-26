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

  return (
    <div className="py-16 bg-[#121212] min-h-screen">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-orbitron font-bold text-white mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to access your account</p>
        </div>
        
        <div className="bg-[#1e1e1e] rounded-lg shadow-xl p-8 cyberpunk-border">
          {error && (
            <div className="bg-red-900 bg-opacity-20 text-red-500 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-400 mb-2 text-sm">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-gray-400 text-sm">Password</label>
                <a href="#" className="text-[#0bff7e] text-sm hover:underline">Forgot Password?</a>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#0bff7e]"
              />
              <label htmlFor="remember" className="text-gray-400 ml-2 text-sm">Remember me</label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-hover-effect py-3 px-4 bg-[#0bff7e] text-black font-bold rounded-md glow-primary font-poppins disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <a href="#" className="text-[#0bff7e] hover:underline">Create Account</a>
            </p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#2d2d2d]">
            <div className="flex justify-center space-x-4">
              <button className="p-3 bg-[#1877F2] text-white rounded-md">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="p-3 bg-[#1DA1F2] text-white rounded-md">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="p-3 bg-[#DB4437] text-white rounded-md">
                <i className="fab fa-google"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Note: Dashboard access is restricted to authorized users only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 
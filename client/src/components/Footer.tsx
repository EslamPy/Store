import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e1e1e] pt-16 pb-8 border-t border-[#2d2d2d]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <img src="/attached_assets/logo.png" alt="MedTech Logo" className="h-10 mb-6" />
            <p className="text-gray-400 mb-6">
              Premium PC components for gamers, creators, and tech enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#0bff7e] transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0bff7e] transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0bff7e] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0bff7e] transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-orbitron font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-[#0bff7e] transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-[#0bff7e] transition-colors">Shop</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0bff7e] transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0bff7e] transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0bff7e] transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-orbitron font-bold text-white mb-6">Categories</h3>
            <ul className="space-y-4">
              <li><Link href="/products?category=cpus" className="text-gray-400 hover:text-[#0bff7e] transition-colors">CPUs</Link></li>
              <li><Link href="/products?category=gpus" className="text-gray-400 hover:text-[#0bff7e] transition-colors">GPUs</Link></li>
              <li><Link href="/products?category=motherboards" className="text-gray-400 hover:text-[#0bff7e] transition-colors">Motherboards</Link></li>
              <li><Link href="/products?category=memory" className="text-gray-400 hover:text-[#0bff7e] transition-colors">Memory</Link></li>
              <li><Link href="/products?category=storage" className="text-gray-400 hover:text-[#0bff7e] transition-colors">Storage</Link></li>
            </ul>
          </div>
          
          <div id="support">
            <h3 className="text-lg font-orbitron font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-[#0bff7e] mt-1 mr-3"></i>
                <span className="text-gray-400">1234 Tech Avenue, Silicon Valley, CA 94043</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt text-[#0bff7e] mr-3"></i>
                <span className="text-gray-400">+1 (888) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-[#0bff7e] mr-3"></i>
                <span className="text-gray-400">support@medtech.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#2d2d2d] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MedTech. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-[#0bff7e] transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-[#0bff7e] transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-[#0bff7e] transition-colors text-sm">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

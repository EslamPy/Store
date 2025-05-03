import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Extended mock data for the articles page
const allTechNews = [
  {
    id: 1,
    title: "NVIDIA Announces Next-Gen RTX 5000 Series GPUs",
    summary: "NVIDIA has unveiled its next generation of graphics cards with major performance improvements and new AI features.",
    date: "June 10, 2023",
    category: "Hardware",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    title: "AMD Ryzen 9000 Series Processors Break Performance Records",
    summary: "AMD's new Zen 5 architecture brings unprecedented single-core and multi-core performance to desktop computing.",
    date: "May 25, 2023",
    category: "CPUs",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    title: "New PCIe 6.0 Standard Doubles Data Transfer Rates",
    summary: "The PCI-SIG has finalized the PCIe 6.0 specification, promising 64 GT/s data rates for next-gen hardware.",
    date: "April 18, 2023",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    title: "DDR6 Memory Standard in Development for 2024 Release",
    summary: "Memory manufacturers are working on the next-generation DDR6 standard with twice the bandwidth of DDR5.",
    date: "March 30, 2023",
    category: "Memory",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    title: "Next-Generation Cooling Solutions for High-Performance PCs",
    summary: "New liquid cooling technologies promise to keep temperatures low even in the most demanding computing scenarios.",
    date: "March 15, 2023",
    category: "Cooling",
    image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    title: "Intel's New Processor Architecture Promises 40% IPC Gain",
    summary: "Intel has revealed details about their upcoming CPU architecture that will compete directly with AMD's latest offerings.",
    date: "February 28, 2023",
    category: "CPUs",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 7,
    title: "SSD Manufacturers Pushing Beyond 10GB/s Read Speeds",
    summary: "New PCIe 5.0 SSDs are breaking speed barriers with unprecedented data transfer rates for consumer hardware.",
    date: "February 14, 2023",
    category: "Storage",
    image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 8,
    title: "Quantum Computing Hardware Now Available for Enterprise Customers",
    summary: "The first commercial quantum computers are now available for businesses looking to explore quantum algorithms.",
    date: "January 30, 2023",
    category: "Quantum",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=500&q=80"
  }
];

// Array of all available categories for filtering - convert Set to Array directly
const categories = Array.from(new Set(allTechNews.map(article => article.category)));

const ArticlesPage: React.FC = () => {
  const [news, setNews] = useState(allTechNews);
  const [filteredNews, setFilteredNews] = useState(allTechNews);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  useEffect(() => {
    document.title = 'MedTech - Tech Updates & News';
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Initialize AOS animations if available
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, []);
  
  useEffect(() => {
    let result = news;
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(article => article.category === selectedCategory);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(article => 
        article.title.toLowerCase().includes(term) || 
        article.summary.toLowerCase().includes(term)
      );
    }
    
    setFilteredNews(result);
  }, [selectedCategory, searchTerm, news]);
  
  const handleReadMore = (articleId: number) => {
    setLocation(`/article/${articleId}`);
  };
  
  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1a1a1a] py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="800">
          <h1 className="text-5xl font-orbitron font-bold text-white mb-4">
            Tech <span className="text-[#00e5ff]">Updates</span>
          </h1>
          <div className="h-1 w-24 bg-[#00e5ff] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Stay informed with the latest hardware innovations, technology breakthroughs, and industry trends in the PC parts market.
          </p>
        </div>
        
        {/* Search and filter section */}
        <div 
          className="bg-[#1e1e1e] rounded-xl p-6 mb-12 shadow-lg"
          data-aos="fade-up" 
          data-aos-duration="800" 
          data-aos-delay="200"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-3 bg-[#252525] border border-[#333] rounded-lg text-white focus:ring-[#00e5ff] focus:border-[#00e5ff] transition-all duration-300"
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 flex-nowrap">
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === null 
                    ? 'bg-[#00e5ff] text-black' 
                    : 'bg-[#252525] text-white hover:bg-[#333]'
                }`}
                onClick={() => handleCategoryFilter(null)}
              >
                All Categories
              </button>
              
              {categories.map(category => (
                <button 
                  key={category}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category 
                      ? 'bg-[#00e5ff] text-black' 
                      : 'bg-[#252525] text-white hover:bg-[#333]'
                  }`}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Articles grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article, index) => (
              <div 
                key={article.id} 
                className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] transform hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={index % 3 * 100}
                data-aos-duration="800"
                onMouseEnter={() => setHoveredCard(article.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="h-60 overflow-hidden relative">
                  <img 
                    src={article.image}
                    alt={article.title} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === article.id ? 'scale-110' : 'scale-100'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent opacity-70"></div>
                  <span className="absolute top-4 left-4 text-xs px-3 py-1.5 bg-[#00e5ff] text-black font-bold rounded-full">
                    {article.category}
                  </span>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-end mb-3">
                    <span className="text-xs text-gray-400 font-medium">{article.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-orbitron font-bold text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-5 line-clamp-3 min-h-[4.5rem]">
                    {article.summary}
                  </p>
                  
                  <button 
                    onClick={() => handleReadMore(article.id)}
                    className="w-full py-3 px-4 bg-[#232323] rounded-lg text-[#00e5ff] font-medium flex items-center justify-center group hover:bg-[#00e5ff] hover:text-black transition-all duration-300"
                  >
                    <span>Read Article</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="text-center py-20 bg-[#1e1e1e] rounded-xl"
            data-aos="fade-up" 
            data-aos-duration="800"
          >
            <svg className="w-16 h-16 text-[#00e5ff] mx-auto mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
            </svg>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-2">No Articles Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
              }}
              className="mt-6 px-6 py-3 bg-[#00e5ff] text-black font-medium rounded-lg hover:bg-[#33eaff] transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage; 
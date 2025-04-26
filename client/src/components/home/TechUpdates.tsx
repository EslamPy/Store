import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Mocked tech news data
const techNews = [
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
  }
];

const TechUpdates: React.FC = () => {
  const [news, setNews] = useState(techNews);
  const [, setLocation] = useLocation();
  
  const handleReadMore = (articleId: number) => {
    setLocation(`/article/${articleId}`);
  };

  return (
    <section id="tech-updates" className="py-16 bg-[#121212]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-12 text-center">
          Tech <span className="text-[#ff6b9d]">Updates</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((article, index) => (
            <div 
              key={article.id} 
              className="bg-[#1e1e1e] rounded-lg overflow-hidden cyberpunk-border transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={article.image}
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs px-2 py-1 bg-[#ff6b9d] text-black font-bold rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">{article.date}</span>
                </div>
                
                <h3 className="text-xl font-orbitron font-bold text-white mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>
                
                <button 
                  onClick={() => handleReadMore(article.id)}
                  className="text-[#ff6b9d] text-sm font-medium flex items-center hover:underline cursor-pointer"
                >
                  Read More <i className="fas fa-arrow-right ml-2 text-xs"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechUpdates;

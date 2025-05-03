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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const handleReadMore = (articleId: number) => {
    setLocation(`/article/${articleId}`);
  };

  const handleViewAll = () => {
    setLocation('/articles');
  };

  return (
    <section id="tech-updates" className="py-20 bg-gradient-to-b from-[#121212] to-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 
            className="text-4xl font-orbitron font-bold text-white relative"
            data-aos="fade-right"
            data-aos-duration="800"
          >
            Tech <span className="text-[#00e5ff]">Updates</span>
            <div className="h-1 w-20 bg-[#00e5ff] mt-2 rounded-full"></div>
          </h2>
          
          <button 
            onClick={handleViewAll}
            className="px-6 py-3 bg-transparent border border-[#00e5ff] text-[#00e5ff] font-medium rounded-lg hover:bg-[#00e5ff] hover:text-black transition-all duration-300 flex items-center group relative overflow-hidden"
            data-aos="fade-left"
            data-aos-duration="800"
          >
            <span className="relative z-10">View All Updates</span>
            <div className="absolute inset-0 bg-[#00e5ff] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {news.map((article, index) => (
            <div 
              key={article.id} 
              className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="800"
              onMouseEnter={() => setHoveredCard(article.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="h-52 overflow-hidden relative">
                <img 
                  src={article.image}
                  alt={article.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === article.id ? 'scale-110' : 'scale-100'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent opacity-60"></div>
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
      </div>
    </section>
  );
};

export default TechUpdates;

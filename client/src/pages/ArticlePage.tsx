import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import Footer from '../components/Footer';

// Use the same tech news data from TechUpdates component
const techNews = [
  {
    id: 1,
    title: "NVIDIA Announces Next-Gen RTX 5000 Series GPUs",
    summary: "NVIDIA has unveiled its next generation of graphics cards with major performance improvements and new AI features.",
    content: `
      <p>NVIDIA has officially announced its highly anticipated RTX 5000 series GPUs, setting new standards for gaming and AI performance. Based on the next-generation architecture, these cards deliver up to 70% faster performance than the previous generation.</p>
      
      <p>The flagship RTX 5090 features 24GB of GDDR7 memory with a memory bandwidth of 1.2TB/s, enabling unprecedented gaming experiences at 4K and 8K resolutions. The new GPUs also introduce advanced ray tracing cores that deliver twice the ray tracing performance compared to the RTX 4000 series.</p>
      
      <p>One of the most significant upgrades comes in the form of enhanced AI capabilities. The new Tensor cores offer 3x the AI performance, enabling more efficient DLSS implementations and new AI-driven features. NVIDIA is calling this "AI-Enhanced Gaming 2.0," which promises to revolutionize how games are rendered and experienced.</p>
      
      <p>The RTX 5000 series also introduces a new power management system that offers better efficiency while delivering higher performance. Despite the performance gains, the power consumption has only increased marginally compared to the previous generation.</p>
      
      <p>Pricing for the RTX 5090 starts at $1,599, with the RTX 5080 and RTX 5070 priced at $999 and $699 respectively. The cards are expected to hit shelves next month, with partner cards following shortly after.</p>
    `,
    date: "June 10, 2023",
    category: "Hardware",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    title: "AMD Ryzen 9000 Series Processors Break Performance Records",
    summary: "AMD's new Zen 5 architecture brings unprecedented single-core and multi-core performance to desktop computing.",
    content: `
      <p>AMD has officially unveiled its Ryzen 9000 series processors based on the new Zen 5 architecture, and the benchmarks are nothing short of groundbreaking. Early tests show that the flagship Ryzen 9 9950X outperforms its predecessor by up to 40% in single-threaded workloads and 35% in multi-threaded applications.</p>
      
      <p>The Zen 5 architecture represents a complete redesign of the execution pipeline, featuring wider execution units, improved branch prediction, and larger caches. The top-end Ryzen 9 9950X comes with 16 cores and 32 threads, with base and boost clocks of 4.2GHz and 5.8GHz respectively.</p>
      
      <p>One of the most significant improvements is in power efficiency. Despite the substantial performance uplift, the TDP remains at 170W for the flagship model, with AMD claiming up to 25% better performance-per-watt compared to Zen 4.</p>
      
      <p>The new processors also feature enhanced I/O capabilities, including support for PCIe 5.0 and DDR5-6400 memory. AMD has also integrated its latest AMD AI Engine, which accelerates AI workloads directly on the CPU.</p>
      
      <p>The Ryzen 9000 series will be available starting next month, with the Ryzen 9 9950X priced at $799, the Ryzen 9 9900X at $599, and the Ryzen 7 9800X at $449.</p>
    `,
    date: "May 25, 2023",
    category: "CPUs",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    title: "New PCIe 6.0 Standard Doubles Data Transfer Rates",
    summary: "The PCI-SIG has finalized the PCIe 6.0 specification, promising 64 GT/s data rates for next-gen hardware.",
    content: `
      <p>The PCI Special Interest Group (PCI-SIG) has finalized the PCIe 6.0 specification, which doubles the data transfer rate compared to PCIe 5.0. The new standard delivers 64 GT/s per lane, enabling 256 GB/s of bandwidth in a x16 configuration.</p>
      
      <p>PCIe 6.0 introduces several key improvements beyond just raw bandwidth. It employs PAM4 (Pulse Amplitude Modulation with 4 levels) signaling, which allows for more data to be transmitted within the same time period. The standard also includes new features like Forward Error Correction (FEC) to ensure data integrity at these higher speeds.</p>
      
      <p>Backward compatibility with previous PCIe generations is maintained, ensuring that existing devices will work with new PCIe 6.0 hosts, albeit at their native lower speeds.</p>
      
      <p>The increased bandwidth will be particularly beneficial for data-intensive applications such as AI training, high-performance computing, and next-generation storage systems. Graphics cards, which are already pushing the limits of PCIe 5.0, will also see significant improvements in performance with PCIe 6.0.</p>
      
      <p>Hardware supporting PCIe 6.0 is expected to begin appearing in enterprise environments in late 2024, with consumer products following in 2025.</p>
    `,
    date: "April 18, 2023",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    title: "DDR6 Memory Standard in Development for 2024 Release",
    summary: "Memory manufacturers are working on the next-generation DDR6 standard with twice the bandwidth of DDR5.",
    content: `
      <p>The Joint Electron Device Engineering Council (JEDEC) has announced that development of the DDR6 memory standard is well underway, with specifications expected to be finalized by early 2024. DDR6 promises to double the bandwidth of DDR5 while improving power efficiency.</p>
      
      <p>The new standard is expected to deliver data rates of up to 12,800 MT/s initially, with a roadmap to reach 17,600 MT/s in future iterations. This represents a significant leap from DDR5, which currently tops out at 6,400 MT/s in consumer applications.</p>
      
      <p>DDR6 will introduce architectural changes to achieve these speeds, including a new channel architecture that uses four 16-bit channels instead of two 32-bit channels. This allows for more efficient data access patterns and better utilization of bandwidth.</p>
      
      <p>Power efficiency is another key focus area for DDR6. Despite the increased speeds, DDR6 aims to maintain or even reduce voltage requirements compared to DDR5, with new power management features to optimize energy usage during different workloads.</p>
      
      <p>Memory manufacturers including Samsung, SK Hynix, and Micron have all confirmed that they are actively working on DDR6 development. The first DDR6 modules are expected to appear in high-performance computing and data center applications by late 2024, with consumer products following in 2025.</p>
    `,
    date: "March 30, 2023",
    category: "Memory",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80"
  }
];

const ArticlePage = () => {
  const [, params] = useRoute('/article/:id');
  const [article, setArticle] = useState<typeof techNews[0] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params && params.id) {
      const articleId = parseInt(params.id);
      const foundArticle = techNews.find(item => item.id === articleId);
      
      if (foundArticle) {
        setArticle(foundArticle);
      }
      
      setLoading(false);
    }
  }, [params]);

  // For SEO purposes
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | MedTech`;
    }
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] pt-24 pb-16">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="animate-pulse text-[#0bff7e] text-xl">Loading article...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#121212] pt-24 pb-16">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-3xl font-orbitron font-bold text-white mb-6">Article Not Found</h1>
          <p className="text-gray-400 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="btn-hover-effect px-8 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#121212] pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-400 mb-8">
              <Link href="/" className="hover:text-[#0bff7e]">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/#tech-updates" className="hover:text-[#0bff7e]">Tech Updates</Link>
              <span className="mx-2">/</span>
              <span className="text-[#0bff7e]">{article.title}</span>
            </div>
            
            {/* Article Header */}
            <div className="mb-10">
              <div className="flex gap-4 items-center mb-4">
                <span className="text-sm px-3 py-1 bg-[#ff6b9d] text-black font-bold rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-gray-400">{article.date}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6 leading-tight">
                {article.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 font-light">
                {article.summary}
              </p>
            </div>
            
            {/* Article Image */}
            <div className="mb-10 overflow-hidden rounded-lg">
              <img 
                src={article.image}
                alt={article.title} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Article Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            ></div>
            
            {/* Article Navigation */}
            <div className="mt-12 pt-8 border-t border-[#2d2d2d] flex justify-between">
              <Link href="/#tech-updates" className="flex items-center text-[#0bff7e] hover:underline">
                <i className="fas fa-arrow-left mr-2"></i> Back to Tech Updates
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ArticlePage; 
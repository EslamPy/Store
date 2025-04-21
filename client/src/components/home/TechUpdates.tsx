
import { useEffect } from 'react';
import { gsap } from 'gsap';

const TechUpdates: React.FC = () => {
  useEffect(() => {
    gsap.from('.tech-update-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.tech-updates-section',
        start: 'top center+=100',
      },
    });
  }, []);

  const updates = [
    {
      title: 'NVIDIA Announces Next-Gen GPUs',
      date: 'June 15, 2024',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
      category: 'Hardware',
    },
    {
      title: 'Intel's New CPU Architecture',
      date: 'June 12, 2024',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80',
      category: 'Processors',
    },
    {
      title: 'Future of Quantum Computing',
      date: 'June 10, 2024',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=500&q=80',
      category: 'Innovation',
    },
  ];

  return (
    <section className="tech-updates-section py-16 bg-[#121212]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-8">
          Latest Tech <span className="text-[#0bff7e]">Updates</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates.map((update, index) => (
            <div
              key={index}
              className="tech-update-card bg-[#1e1e1e] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={update.image}
                alt={update.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#0bff7e] text-sm">{update.category}</span>
                  <span className="text-gray-400 text-sm">{update.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{update.title}</h3>
                <button className="text-[#00b3ff] hover:text-[#0bff7e] transition-colors">
                  Read More <i className="fas fa-arrow-right ml-2"></i>
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

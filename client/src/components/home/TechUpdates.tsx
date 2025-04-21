
import { useEffect } from 'react';
import AOS from 'aos';

const TechUpdates = () => {
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <section className="py-16 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-12 text-center">
          Tech Updates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techNews.map((news, index) => (
            <article
              key={index}
              className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{news.title}</h3>
                <p className="text-gray-400 mb-4">{news.excerpt}</p>
                <a
                  href={news.link}
                  className="text-[#0bff7e] hover:underline inline-flex items-center"
                >
                  Read More <i className="fas fa-arrow-right ml-2"></i>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const techNews = [
  {
    title: "Next Generation GPUs Announced",
    excerpt: "Leading manufacturers reveal their latest graphics cards with breakthrough performance.",
    image: "https://placehold.co/600x400",
    link: "#"
  },
  {
    title: "AI Revolution in Computing",
    excerpt: "How artificial intelligence is transforming the tech industry.",
    image: "https://placehold.co/600x400",
    link: "#"
  },
  {
    title: "Future of Quantum Computing",
    excerpt: "Latest developments in quantum computing technology.",
    image: "https://placehold.co/600x400",
    link: "#"
  }
];

export default TechUpdates;

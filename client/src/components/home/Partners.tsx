
import { useEffect } from 'react';
import AOS from 'aos';

const Partners = () => {
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <section className="py-16 bg-[#121212]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-12 text-center">
          Our Partners
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="w-32 h-32 bg-[#1e1e1e] rounded-lg p-4 flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const partners = [
  { name: "NVIDIA", logo: "https://placehold.co/200" },
  { name: "AMD", logo: "https://placehold.co/200" },
  { name: "Intel", logo: "https://placehold.co/200" },
  { name: "ASUS", logo: "https://placehold.co/200" },
  { name: "MSI", logo: "https://placehold.co/200" },
  { name: "Corsair", logo: "https://placehold.co/200" }
];

export default Partners;

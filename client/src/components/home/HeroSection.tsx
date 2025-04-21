import { Link } from 'wouter';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#121212] bg-opacity-70"></div>
        <img 
          src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1920&q=80" 
          alt="Gaming PC Setup" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl" data-aos="fade-right" data-aos-duration="1000">
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 text-white">
            <span className="text-[#0bff7e]">Elevate</span> Your <br />
            Computing Experience
          </h1>
          <p className="text-xl mb-8 text-gray-200 font-space">
            Premium PC components with cutting-edge technology for gamers, creators, and professionals.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/products">
              <div className="btn-hover-effect px-8 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary font-poppins text-center cursor-pointer">
                Shop Now
              </div>
            </Link>
            <Link href="/products?filter=custom">
              <div className="btn-hover-effect px-8 py-3 border border-[#00b3ff] text-white font-bold rounded-md glow-secondary hover:bg-[#00b3ff] hover:text-black transition-colors font-poppins text-center cursor-pointer">
                Build Your PC
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute bottom-20 right-20 w-64 h-64 animate-float hidden lg:block" data-aos="fade-left">
        <img 
          src="https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=500&q=80" 
          alt="CPU" 
          className="w-full h-full object-contain"
        />
      </div>
    </section>
  );
};

export default HeroSection;

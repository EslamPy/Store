const TechSpecs: React.FC = () => {
  return (
    <section className="py-16 bg-[#1e1e1e] relative overflow-hidden" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-white text-center mb-12">Why Choose <span className="text-[#00b3ff]">MedTech</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#2d2d2d] p-6 rounded-lg cyberpunk-border relative" data-aos="fade-up" data-aos-delay="100">
            <div className="w-16 h-16 bg-[#0bff7e] bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-microchip text-[#0bff7e] text-2xl"></i>
            </div>
            <h3 className="text-xl font-orbitron font-bold text-white mb-3">Premium Components</h3>
            <p className="text-gray-300">
              Carefully selected high-performance parts that meet our rigorous quality standards.
            </p>
          </div>
          
          <div className="bg-[#2d2d2d] p-6 rounded-lg cyberpunk-border relative" data-aos="fade-up" data-aos-delay="200">
            <div className="w-16 h-16 bg-[#00b3ff] bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-shield-alt text-[#00b3ff] text-2xl"></i>
            </div>
            <h3 className="text-xl font-orbitron font-bold text-white mb-3">3-Year Warranty</h3>
            <p className="text-gray-300">
              Peace of mind with extended coverage and premium support for all our products.
            </p>
          </div>
          
          <div className="bg-[#2d2d2d] p-6 rounded-lg cyberpunk-border relative" data-aos="fade-up" data-aos-delay="300">
            <div className="w-16 h-16 bg-[#9d00ff] bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <i className="fas fa-headset text-[#9d00ff] text-2xl"></i>
            </div>
            <h3 className="text-xl font-orbitron font-bold text-white mb-3">Expert Support</h3>
            <p className="text-gray-300">
              Get help from our team of PC enthusiasts and tech specialists 24/7.
            </p>
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#00b3ff] bg-opacity-10 blur-3xl"></div>
    </section>
  );
};

export default TechSpecs;

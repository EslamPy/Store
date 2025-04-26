import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Newsletter: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name) {
      toast({
        title: 'Please enter your name',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.email) {
      toast({
        title: 'Please enter your email',
        variant: 'destructive'
      });
      return;
    }
    
    if (!formData.phone) {
      toast({
        title: 'Please enter your phone number',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Form submitted successfully!',
        description: 'Thank you for contacting us. We will get back to you soon.',
      });
      setFormData({
        name: '',
        email: '',
        phone: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <section className="py-16 bg-[#121212]" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <div className="bg-[#2d2d2d] rounded-lg p-8 md:p-12 relative overflow-hidden cyberpunk-border">
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-orbitron font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8">
              Contact us for any questions or subscribe to our newsletter for exclusive deals, new arrivals, and tech tips.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="text" 
                name="name"
                placeholder="Your Name"
                className="flex-1 bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              
              <input 
                type="email"
                name="email" 
                placeholder="Your Email"
                className="flex-1 bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              
              <input 
                type="tel"
                name="phone" 
                placeholder="Your Phone Number"
                className="flex-1 bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              
              <button 
                type="submit"
                className="btn-hover-effect px-8 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary font-poppins disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Contact Us'}
              </button>
            </form>
          </div>
          
          {/* Background Elements */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#0bff7e] bg-opacity-10 blur-3xl"></div>
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#9d00ff] bg-opacity-10 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

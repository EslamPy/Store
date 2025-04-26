import { useState } from 'react';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would send data to your server endpoint
      // For now, we'll simulate a successful submission
      
      console.log('Contact form submission:', {
        name,
        email,
        subject,
        message,
        recipientEmail: 'eslamdev@outlook.de' // The owner's email
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#1e1e1e]" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-6 text-center">
            Get in <span className="text-[#ff6b9d]">Touch</span>
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Have questions or suggestions to improve our website? We'd love to hear from you!
          </p>
          
          {/* Contact Form */}
          <div className="bg-[#121212] rounded-lg shadow-xl p-8 cyberpunk-border">
            {success && (
              <div className="bg-[#0bff7e] bg-opacity-20 text-[#0bff7e] px-4 py-3 rounded-md mb-6 flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                <span>Your message has been sent successfully! We'll get back to you soon.</span>
              </div>
            )}
            
            {error && (
              <div className="bg-red-900 bg-opacity-20 text-red-500 px-4 py-3 rounded-md mb-6 flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-400 mb-2 text-sm">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-400 mb-2 text-sm">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1e1e1e] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-400 mb-2 text-sm">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#1e1e1e] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                  placeholder="Question about products"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-400 mb-2 text-sm">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#1e1e1e] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none resize-none"
                  placeholder="Your message here..."
                  rows={6}
                  required
                ></textarea>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  <span className="text-red-500">*</span> Required fields
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-hover-effect py-3 px-8 bg-[#ff6b9d] text-black font-bold rounded-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-[#121212] rounded-lg">
              <div className="w-12 h-12 bg-[#ff6b9d] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-envelope text-[#ff6b9d]"></i>
              </div>
              <h3 className="text-white font-orbitron font-bold mb-2">Email Us</h3>
              <a href="mailto:eslamdev@outlook.de" className="text-gray-400 hover:text-[#ff6b9d] transition-colors">
                eslamdev@outlook.de
              </a>
            </div>
            
            <div className="text-center p-6 bg-[#121212] rounded-lg">
              <div className="w-12 h-12 bg-[#0bff7e] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-phone-alt text-[#0bff7e]"></i>
              </div>
              <h3 className="text-white font-orbitron font-bold mb-2">Call Us</h3>
              <a href="tel:+123456789" className="text-gray-400 hover:text-[#0bff7e] transition-colors">
                +1 (234) 567-890
              </a>
            </div>
            
            <div className="text-center p-6 bg-[#121212] rounded-lg">
              <div className="w-12 h-12 bg-[#00b3ff] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-map-marker-alt text-[#00b3ff]"></i>
              </div>
              <h3 className="text-white font-orbitron font-bold mb-2">Visit Us</h3>
              <p className="text-gray-400">
                1234 Tech Avenue<br />
                Silicon Valley, CA 94043
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm; 
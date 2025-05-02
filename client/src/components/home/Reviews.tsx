import { useState, useEffect, useRef } from 'react';

// Mock reviews data
const reviews = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Gaming Enthusiast",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "MedTech has been my go-to store for all PC components. Their RTX 4080 was delivered fast and performance is outstanding. Highly recommend their service!",
    productPurchased: "NVIDIA GeForce RTX 4080 Super"
  },
  {
    id: 2,
    name: "Samantha Williams",
    role: "Content Creator",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "As a video editor, I needed a powerful CPU that could handle my workload. The Ryzen 9 7950X I bought from MedTech exceeded my expectations. Excellent customer service too!",
    productPurchased: "AMD Ryzen 9 7950X"
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "IT Professional",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 4,
    text: "The Samsung 990 PRO SSD transformed my system's performance. Boot times are now lightning fast and file transfers are seamless. Great product at a competitive price.",
    productPurchased: "Samsung 990 PRO SSD 2TB"
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Streaming Professional",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    rating: 5,
    text: "MedTech's customer service is unmatched. They helped me put together the perfect streaming setup, and the performance has been flawless for my daily broadcasts.",
    productPurchased: "Corsair Vengeance RGB 32GB"
  }
];

const Reviews: React.FC = () => {
  const [activeReview, setActiveReview] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate reviews
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveReview(prev => (prev + 1) % reviews.length);
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleReviewClick = (index: number) => {
    setActiveReview(index);
    
    // Reset the interval when manually changing
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setActiveReview(prev => (prev + 1) % reviews.length);
    }, 5000);
  };

  return (
    <section className="py-16 bg-[#1e1e1e]" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-12 text-center">
          Our <span className="text-[#00b3ff]">Reviews</span>
        </h2>
        
        <div className="max-w-4xl mx-auto">
          {/* Main Review Display */}
          <div 
            className="bg-[#2d2d2d] rounded-lg p-8 mb-8 relative overflow-hidden cyberpunk-border"
            data-aos="fade-up"
          >
            {/* Quote Icons */}
            <div className="absolute top-6 left-6 text-[#00b3ff] opacity-20">
              <i className="fas fa-quote-left text-6xl"></i>
            </div>
            <div className="absolute bottom-6 right-6 text-[#00b3ff] opacity-20">
              <i className="fas fa-quote-right text-6xl"></i>
            </div>
            
            {/* Review Content */}
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <img 
                  src={reviews[activeReview].avatar} 
                  alt={reviews[activeReview].name} 
                  className="w-16 h-16 rounded-full border-2 border-[#00b3ff] mr-4"
                />
                <div>
                  <h3 className="text-xl font-orbitron font-bold text-white">{reviews[activeReview].name}</h3>
                  <p className="text-gray-400 text-sm">{reviews[activeReview].role}</p>
                </div>
                <div className="ml-auto">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas ${i < reviews[activeReview].rating ? 'fa-star' : 'far fa-star'} ml-1`}
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg mb-6 italic">
                "{reviews[activeReview].text}"
              </p>
              
              <div className="text-[#00b3ff] text-sm">
                Product purchased: <span className="font-bold">{reviews[activeReview].productPurchased}</span>
              </div>
            </div>
          </div>
          
          {/* Review Navigation */}
          <div className="flex justify-center space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => handleReviewClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeReview 
                    ? 'bg-[#00b3ff] w-6' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`View review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
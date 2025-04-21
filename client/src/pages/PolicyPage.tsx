
import { useEffect } from 'react';
import { useRoute } from 'wouter';

const PolicyPage: React.FC = () => {
  const [match, params] = useRoute('/policy/:type');
  const type = params?.type;

  useEffect(() => {
    document.title = `${type?.replace('-', ' ')} - MedTech`;
  }, [type]);

  const policies = {
    'privacy-policy': {
      title: 'Privacy Policy',
      content: [
        'At MedTech, we take your privacy seriously...',
        'We collect information to improve your shopping experience...',
        'Your data is encrypted and stored securely...'
      ]
    },
    'terms-of-service': {
      title: 'Terms of Service',
      content: [
        'By using MedTech, you agree to these terms...',
        'Our services are provided "as is"...',
        'We reserve the right to modify these terms...'
      ]
    },
    'shipping-policy': {
      title: 'Shipping Policy',
      content: [
        'We offer free shipping on orders over $100...',
        'Standard shipping takes 3-5 business days...',
        'Express shipping is available for an additional fee...'
      ]
    }
  };

  const policy = type ? policies[type as keyof typeof policies] : null;

  if (!policy) return <div>Policy not found</div>;

  return (
    <div className="py-16 bg-[#121212] min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-orbitron font-bold text-white mb-12">
          {policy.title}
        </h1>
        
        <div className="bg-[#1e1e1e] rounded-lg p-8 shadow-lg">
          {policy.content.map((paragraph, index) => (
            <p 
              key={index} 
              className="text-gray-300 mb-6 leading-relaxed last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;

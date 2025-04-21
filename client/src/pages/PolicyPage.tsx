
import { useEffect } from 'react';
import { useLocation } from 'wouter';

const PolicyPage = () => {
  const [location] = useLocation();
  const policy = policies[location.split('/')[1]];

  useEffect(() => {
    document.title = `${policy.title} - MedTech`;
  }, [policy.title]);

  return (
    <div className="py-16 bg-[#121212] min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-orbitron font-bold text-white mb-8">{policy.title}</h1>
        <div className="bg-[#1e1e1e] rounded-lg p-8">
          <div className="prose prose-invert max-w-none">
            {policy.content}
          </div>
        </div>
      </div>
    </div>
  );
};

const policies = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `Your privacy content here...`
  },
  'terms-of-service': {
    title: 'Terms of Service',
    content: `Your terms content here...`
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    content: `Your shipping content here...`
  }
};

export default PolicyPage;

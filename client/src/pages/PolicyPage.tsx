import { useEffect } from 'react';
import { useRoute } from 'wouter';

const PolicyPage: React.FC = () => {
  const [match, params] = useRoute('/policy/:type');
  const type = params?.type;

  useEffect(() => {
    document.title = `${type?.replace('-', ' ')} - MedTech`;
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [type]);

  const policies = {
    'privacy-policy': {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: June 15, 2023',
      sections: [
        {
          title: 'Information We Collect',
          content: [
            'At MedTech, we take your privacy seriously. This policy describes the types of information we collect and how we use it to provide you with a seamless shopping experience.',
            'We collect personal information such as your name, email address, shipping address, and payment information when you create an account or make a purchase.',
            'We also collect non-personal information such as browser type, IP address, device information, and pages visited to improve our website and services.'
          ]
        },
        {
          title: 'How We Use Your Information',
          content: [
            'We use your information to process orders, deliver products, and provide customer support.',
            'We may use your email address to send you order confirmations, shipping updates, and promotional offers (which you can opt out of at any time).',
            'We analyze browsing and purchasing patterns to improve our website, product offerings, and marketing strategies.'
          ]
        },
        {
          title: 'Data Security',
          content: [
            'Your data is encrypted and stored securely using industry-standard encryption technologies.',
            'We implement a variety of security measures to maintain the safety of your personal information.',
            'We do not sell or rent your personal information to third parties.'
          ]
        },
        {
          title: 'Cookies and Tracking',
          content: [
            'We use cookies to enhance your browsing experience, analyze traffic patterns, and personalize content.',
            'You can control cookies through your browser settings, but doing so may limit certain features of our website.'
          ]
        }
      ]
    },
    'terms-of-service': {
      title: 'Terms of Service',
      lastUpdated: 'Last Updated: May 20, 2023',
      sections: [
        {
          title: 'Acceptance of Terms',
          content: [
            'By accessing or using the MedTech website, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
            'If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
          ]
        },
        {
          title: 'Product Information and Pricing',
          content: [
            'We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, or error-free.',
            'Prices are subject to change without notice. We reserve the right to modify or discontinue any product without notice.'
          ]
        },
        {
          title: 'User Accounts',
          content: [
            'You are responsible for maintaining the confidentiality of your account information and password.',
            'You agree to accept responsibility for all activities that occur under your account.',
            'You must be at least 18 years old to create an account and make purchases.'
          ]
        },
        {
          title: 'Limitation of Liability',
          content: [
            'MedTech shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services.',
            'Our liability is limited to the amount paid for the specific product or service that gives rise to the claim.'
          ]
        }
      ]
    },
    'shipping-policy': {
      title: 'Shipping Policy',
      lastUpdated: 'Last Updated: April 10, 2023',
      sections: [
        {
          title: 'Shipping Options',
          content: [
            'We offer several shipping options to meet your needs:',
            '- Standard Shipping (3-5 business days)',
            '- Express Shipping (2 business days)',
            '- Next Day Delivery (order by 2 PM for next business day delivery)',
            'We offer free standard shipping on all orders over $100.'
          ]
        },
        {
          title: 'Processing Time',
          content: [
            'Orders are typically processed within 1-2 business days after payment confirmation.',
            'During peak seasons or promotional periods, processing time may be slightly longer.',
            'You will receive a shipping confirmation email with tracking information once your order ships.'
          ]
        },
        {
          title: 'International Shipping',
          content: [
            'We ship to select countries worldwide. International shipping rates are calculated at checkout based on location and package weight.',
            'International customers may be subject to import duties and taxes, which are the responsibility of the recipient.',
            'International shipping typically takes 7-14 business days, depending on the destination.'
          ]
        },
        {
          title: 'Shipping Issues',
          content: [
            'If your package is damaged during transit, please contact customer service within 48 hours of delivery.',
            'For lost packages, please allow 15 business days from the shipping date before reporting it as lost.',
            'We are not responsible for shipping delays caused by customs, weather conditions, or carrier issues outside our control.'
          ]
        }
      ]
    }
  };

  const policy = type ? policies[type as keyof typeof policies] : null;

  if (!policy) return <div>Policy not found</div>;

  return (
    <div className="py-16 bg-[#121212] min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-orbitron font-bold text-white mb-3">
            {policy.title}
          </h1>
          <p className="text-gray-400 text-sm">{policy.lastUpdated}</p>
        </div>
        
        <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
          {policy.sections.map((section, sectionIndex) => (
            <div 
              key={sectionIndex} 
              className={`p-8 ${sectionIndex % 2 === 1 ? 'bg-[#232323]' : ''}`}
            >
              <h2 className="text-2xl font-orbitron font-bold text-[#0bff7e] mb-6">
                {section.title}
              </h2>
              {section.content.map((paragraph, paraIndex) => (
                <p 
                  key={paraIndex} 
                  className="text-gray-300 mb-4 leading-relaxed last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            If you have any questions about our {policy.title.toLowerCase()}, please contact us at{' '}
            <a href="mailto:eslamdev@outlook.de" className="text-[#0bff7e] hover:underline">
            eslamdev@outlook.de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;

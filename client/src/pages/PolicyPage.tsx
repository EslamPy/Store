
import { useEffect } from 'react';
import { useLocation } from 'wouter';

const policies = {
  privacy: {
    title: 'Privacy Policy',
    content: `
      <h1>Privacy Policy</h1>
      <p>Last updated: March 15, 2024</p>
      <h2>1. Information We Collect</h2>
      <p>We collect information that you provide directly to us...</p>
    `
  },
  terms: {
    title: 'Terms of Service',
    content: `
      <h1>Terms of Service</h1>
      <p>Last updated: March 15, 2024</p>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using this website, you accept and agree to be bound by the terms...</p>
    `
  },
  shipping: {
    title: 'Shipping Policy',
    content: `
      <h1>Shipping Policy</h1>
      <p>Last updated: March 15, 2024</p>
      <h2>1. Processing Time</h2>
      <p>Orders are typically processed within 1-2 business days...</p>
    `
  }
};

const PolicyPage = () => {
  const [location] = useLocation();
  const policyType = location.split('/')[2];
  const policy = policies[policyType as keyof typeof policies];

  useEffect(() => {
    document.title = `${policy.title} - MedTech`;
  }, [policy]);

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div dangerouslySetInnerHTML={{ __html: policy.content }} className="prose prose-invert max-w-none" />
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;

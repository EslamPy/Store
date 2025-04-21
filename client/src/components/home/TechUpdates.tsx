import { useEffect, useState } from 'react';

interface TechUpdate {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
}

const TechUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<TechUpdate[]>([
    {
      id: 1,
      title: "Next-Gen Processors Announced",
      summary: "Leading chip manufacturers unveil groundbreaking processor architecture",
      date: "2024-03-15",
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "Revolutionary Gaming Laptops",
      summary: "New gaming laptops featuring next-gen cooling technology",
      date: "2024-03-14",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80"
    }
  ]);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-orbitron font-bold mb-12 text-center">
          Tech Updates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates.map((update) => (
            <div key={update.id} className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img src={update.image} alt={update.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{update.title}</h3>
                <p className="text-gray-600 mb-4">{update.summary}</p>
                <span className="text-sm text-gray-500">{update.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechUpdates;
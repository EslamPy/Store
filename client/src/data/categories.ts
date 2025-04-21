export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: 'CPUs',
    description: 'High-performance processors',
    slug: 'cpus',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    name: 'GPUs',
    description: 'Powerful graphics cards',
    slug: 'gpus',
    image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    name: 'Memory',
    description: 'High-speed RAM modules',
    slug: 'memory',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    name: 'Storage',
    description: 'SSDs & high-capacity drives',
    slug: 'storage',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 5,
    name: 'Motherboards',
    description: 'Feature-rich foundations',
    slug: 'motherboards',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 6,
    name: 'Power Supplies',
    description: 'Reliable power delivery',
    slug: 'power-supplies',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 7,
    name: 'Cases',
    description: 'Stylish PC enclosures',
    slug: 'cases',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 8,
    name: 'Cooling',
    description: 'Advanced thermal solutions',
    slug: 'cooling',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 9,
    name: 'Peripherals',
    description: 'Keyboards, mice, and more',
    slug: 'peripherals',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 10,
    name: 'Monitors',
    description: 'High-refresh displays',
    slug: 'monitors',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80'
  }
];

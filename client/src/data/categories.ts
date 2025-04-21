export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export const categories = [
  {
    id: 'processors',
    name: 'Processors',
    icon: 'microchip',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'headphones',
    name: 'Headphones',
    icon: 'headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'graphics-cards',
    name: 'Graphics Cards',
    icon: 'desktop',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
  }
];
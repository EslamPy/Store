import { users, type User, type InsertUser } from "@shared/schema";

// Define Product interface directly in server to avoid import issues
interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription?: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  additionalImages?: string[];
  specifications?: Record<string, string | number>;
  badge?: string;
  sku: string;
  warranty?: string;
  inStock: boolean;
  featured?: boolean;
  new?: boolean;
  discount?: number;
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getAllCategories(): Promise<string[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getDiscountedProducts(): Promise<Product[]>;
  getSimilarProducts(id: number, limit?: number): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Product[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Initialize with sample product data for server
    this.products = [
      {
        id: 1,
        name: 'NVIDIA GeForce RTX 4080 Super',
        description: 'Unleash gaming potential with DLSS 3.0, RT cores, and overclocked performance.',
        fullDescription: 'The RTX 4080 Super takes gaming to another level with its cutting-edge performance capabilities.',
        category: 'GPUs',
        brand: 'NVIDIA',
        price: 899.99,
        originalPrice: 1199.99,
        rating: 4.8,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=600&q=80',
        additionalImages: [],
        specifications: {},
        badge: 'Limited',
        sku: 'RTX4080S-16G',
        warranty: '3 Years',
        inStock: true,
        featured: true,
        discount: 25
      },
      {
        id: 2,
        name: 'AMD Ryzen 9 7950X',
        description: '16-core powerhouse for extreme multitasking and content creation.',
        category: 'CPUs',
        brand: 'AMD',
        price: 549.99,
        originalPrice: 699.99,
        rating: 5.0,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
        additionalImages: [],
        specifications: {},
        sku: 'R9-7950X',
        warranty: '3 Years',
        inStock: true,
        featured: true,
        discount: 21
      },
      {
        id: 3,
        name: 'Samsung 990 PRO SSD 2TB',
        description: 'Lightning-fast NVMe SSD with up to 7,450 MB/s read speeds for instant loading.',
        category: 'Storage',
        brand: 'Samsung',
        price: 219.99,
        originalPrice: 279.99,
        rating: 5.0,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
        specifications: {},
        sku: 'MZ-V9P2T0BW',
        warranty: '5 Years',
        inStock: true,
        featured: true
      }
    ];
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return this.products;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.find(product => product.id === id);
  }
  
  async getAllCategories(): Promise<string[]> {
    const categories = new Set(this.products.map(product => product.category));
    return Array.from(categories);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowerCaseQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return this.products.filter(product => product.featured);
  }
  
  async getDiscountedProducts(): Promise<Product[]> {
    return this.products
      .filter(product => product.discount && product.discount > 0)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }
  
  async getSimilarProducts(id: number, limit = 4): Promise<Product[]> {
    const product = await this.getProductById(id);
    if (!product) return [];
    
    return this.products
      .filter(p => p.id !== id && p.category === product.category)
      .slice(0, limit);
  }
}

export const storage = new MemStorage();

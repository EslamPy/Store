export interface Product {
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

// Sample product data
const products: Product[] = [
  {
    id: 1,
    name: 'NVIDIA GeForce RTX 4080 Super',
    description: 'Unleash gaming potential with DLSS 3.0, RT cores, and overclocked performance.',
    fullDescription: 'The RTX 4080 Super takes gaming to another level with its cutting-edge performance capabilities. Featuring advanced ray tracing cores, DLSS 3.0 AI upscaling, and 16GB of ultra-fast GDDR6X memory, this GPU delivers breathtaking visuals and frame rates in even the most demanding games. The redesigned cooling system ensures optimal performance under load while maintaining whisper-quiet operation.',
    category: 'GPUs',
    brand: 'NVIDIA',
    price: 899.99,
    originalPrice: 1199.99,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&w=600&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80'
    ],
    specifications: {
      'GPU Architecture': 'Ada Lovelace',
      'CUDA Cores': 9728,
      'Memory': '16GB GDDR6X',
      'Memory Interface': '256-bit',
      'Boost Clock': '2.5 GHz',
      'Power Consumption': '320W',
      'Recommended PSU': '750W',
      'Interface': 'PCIe 4.0',
      'Outputs': '3x DisplayPort 1.4a, 1x HDMI 2.1'
    },
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
    fullDescription: 'The AMD Ryzen 9 7950X is the flagship processor in the Ryzen 7000 series, built on the advanced 5nm Zen 4 architecture. With 16 cores and 32 threads, this CPU delivers unmatched performance for content creators, gamers, and professional workloads. Featuring a base clock of 4.5 GHz and boost up to 5.7 GHz, along with 80MB of combined cache, the 7950X offers exceptional single and multi-threaded performance while maintaining impressive power efficiency.',
    category: 'CPUs',
    brand: 'AMD',
    price: 549.99,
    originalPrice: 699.99,
    rating: 5.0,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80'
    ],
    specifications: {
      'Architecture': 'Zen 4',
      'Cores/Threads': '16/32',
      'Base Clock': '4.5 GHz',
      'Boost Clock': '5.7 GHz',
      'Total Cache': '80MB',
      'TDP': '170W',
      'Socket': 'AM5',
      'Process': '5nm',
      'Memory Support': 'DDR5-5200'
    },
    badge: 'Hot 🔥',
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
    fullDescription: 'The Samsung 990 PRO is a high-performance PCIe 4.0 NVMe SSD designed for gamers, content creators, and professionals who demand the fastest storage. With sequential read speeds up to 7,450 MB/s and write speeds up to 6,900 MB/s, this drive dramatically reduces loading times and file transfer waits. The drive features Samsung\'s proprietary controller and V-NAND technology, along with a nickel-coated controller to manage heat and maintain optimal performance during intense workloads.',
    category: 'Storage',
    brand: 'Samsung',
    price: 219.99,
    originalPrice: 279.99,
    rating: 5.0,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    specifications: {
      'Capacity': '2TB',
      'Interface': 'PCIe 4.0 x4, NVMe 2.0',
      'Sequential Read': '7,450 MB/s',
      'Sequential Write': '6,900 MB/s',
      'Random Read (4KB)': '1,400K IOPS',
      'Random Write (4KB)': '1,550K IOPS',
      'NAND Type': 'Samsung V-NAND',
      'Controller': 'Samsung Pascal Controller',
      'DRAM': '2GB LPDDR4'
    },
    sku: 'MZ-V9P2T0BW',
    warranty: '5 Years or 1200 TBW',
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: 'Corsair Vengeance RGB 32GB',
    description: 'High-performance DDR5 memory with dynamic RGB lighting and overclocking support.',
    fullDescription: 'Corsair Vengeance RGB DDR5 memory delivers the next generation of memory performance with faster speeds, greater capacities, and lower latencies than previous generations. Each module features a custom performance PCB for superior signal quality and ten-zone RGB lighting that can be synchronized with other Corsair RGB products through iCUE software. With tight timings and XMP 3.0 support, this kit is optimized for Intel and AMD platforms, ensuring compatibility and reliable performance.',
    category: 'Memory',
    brand: 'Corsair',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.7,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
    specifications: {
      'Capacity': '32GB (2x16GB)',
      'Memory Type': 'DDR5',
      'Speed': '6000MHz',
      'CAS Latency': 'CL36',
      'Voltage': '1.35V',
      'RGB Lighting': 'Yes, 10-zone',
      'XMP Support': 'XMP 3.0',
      'Compatibility': 'Intel 600/700 Series, AMD 600 Series',
      'Heatspreader': 'Aluminum'
    },
    sku: 'CMH32GX5M2D6000C36',
    warranty: 'Lifetime',
    inStock: true,
    featured: true,
    discount: 19
  },
  {
    id: 5,
    name: 'ASUS ROG Strix Z790-E Gaming',
    description: 'Premium ATX motherboard with robust power delivery and extensive connectivity.',
    fullDescription: 'The ASUS ROG Strix Z790-E Gaming motherboard combines cutting-edge performance with sleek aesthetics for a premium building experience. Featuring a robust 18+1 power stage design, PCIe 5.0, DDR5 support, and advanced cooling solutions, this motherboard is designed for enthusiasts and overclockers. The extensive connectivity includes WiFi 6E, 10Gb Ethernet, multiple USB ports including front USB 3.2 Gen 2x2 Type-C, and onboard RGB that can be synchronized through ASUS Aura Sync.',
    category: 'Motherboards',
    brand: 'ASUS',
    price: 399.99,
    rating: 4.8,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80',
    specifications: {
      'Chipset': 'Intel Z790',
      'Form Factor': 'ATX',
      'CPU Socket': 'LGA 1700',
      'Memory Support': 'DDR5-7800+ (OC)',
      'Memory Slots': '4 (up to 128GB)',
      'PCIe Slots': '1x PCIe 5.0 x16, 1x PCIe 4.0 x16, 1x PCIe 3.0 x4',
      'Storage': '4x M.2 (PCIe 4.0), 6x SATA 6Gb/s',
      'Networking': '10Gb Ethernet, WiFi 6E',
      'Audio': 'ROG SupremeFX 7.1 (ALC4080)'
    },
    sku: 'ROG-STRIX-Z790-E-GAMING',
    warranty: '3 Years',
    inStock: true,
    featured: false,
    new: true
  },
  {
    id: 6,
    name: 'Cooler Master MasterLiquid ML360',
    description: 'RGB all-in-one liquid CPU cooler for maximum thermal performance.',
    fullDescription: 'The Cooler Master MasterLiquid ML360 RGB is a high-performance all-in-one liquid CPU cooler featuring a 360mm radiator and three RGB fans for maximum cooling capacity. Its dual chamber pump design separates hot and cold coolant to improve performance, while the low-profile CPU block ensures compatibility with most cases. The included RGB controller allows for customization even without RGB motherboard headers, making this cooler both powerful and visually stunning.',
    category: 'Cooling',
    brand: 'Cooler Master',
    price: 149.99,
    rating: 4.6,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    specifications: {
      'Radiator Size': '360mm',
      'Fans': '3x 120mm RGB Fans',
      'Fan Speed': '650-1800 RPM ± 10%',
      'Air Flow': '62 CFM',
      'Noise Level': '8-27 dBA',
      'Pump': 'Dual Chamber',
      'CPU Socket Support': 'Intel LGA 1700/1200/115x, AMD AM5/AM4',
      'RGB': 'Addressable RGB',
      'Tube Length': '400mm'
    },
    sku: 'MLX-D36M-A20PC-R1',
    warranty: '5 Years',
    inStock: true,
    new: true
  },
  {
    id: 7,
    name: 'EVGA SuperNOVA 1000 G6',
    description: 'Fully modular 80+ Gold power supply with silent operation.',
    fullDescription: 'The EVGA SuperNOVA 1000 G6 delivers clean, stable power with 80 PLUS Gold efficiency, reducing heat generation and saving on energy costs. Its fully modular design allows for connecting only the cables you need, improving airflow and reducing clutter inside your case. The 135mm fluid dynamic bearing fan operates in a silent mode at low to medium loads, spinning up only when needed. With Japanese capacitors rated at 105°C and comprehensive protection features, this PSU is designed for reliable operation even in demanding systems.',
    category: 'Power Supplies',
    brand: 'EVGA',
    price: 189.99,
    originalPrice: 219.99,
    rating: 4.9,
    reviews: 73,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
    specifications: {
      'Wattage': '1000W',
      'Efficiency': '80+ Gold',
      'Modularity': 'Fully Modular',
      'Fan Size': '135mm Fluid Dynamic Bearing',
      'Noise Level': '0dBA (Fanless below 40% load)',
      'Protection': 'OVP, UVP, OCP, OPP, SCP, OTP',
      'Connectors': '1x 24-pin, 2x 8-pin EPS, 6x 8-pin PCIe, 12x SATA, 4x Molex',
      'Dimensions': '150mm x 85mm x 150mm',
      'ATX Version': 'ATX12V v2.52'
    },
    sku: '220-G6-1000-X1',
    warranty: '10 Years',
    inStock: true,
    discount: 14
  },
  {
    id: 8,
    name: 'Lian Li O11 Dynamic EVO',
    description: 'Premium dual-chamber case with stunning glass panels and versatile cooling options.',
    fullDescription: 'The Lian Li O11 Dynamic EVO builds upon the acclaimed O11 Dynamic with even more flexibility and innovative features. This case features a dual-chamber design that separates the power supply and drives from the main components, improving airflow and aesthetics. With support for multiple radiator configurations, vertical GPU mounting, and a modular front panel that can be inverted, the O11 Dynamic EVO adapts to your build requirements. The tempered glass panels on the front and side showcase your components while the solid rear chamber keeps cables neatly hidden.',
    category: 'Cases',
    brand: 'Lian Li',
    price: 169.99,
    rating: 4.8,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80',
    specifications: {
      'Form Factor': 'Mid Tower',
      'Motherboard Support': 'E-ATX, ATX, Micro-ATX, Mini-ITX',
      'Dimensions': '445mm x 285mm x 459mm',
      'GPU Clearance': 'Up to 423mm',
      'CPU Cooler Height': 'Up to 167mm',
      'Radiator Support': 'Top: 360mm, Side: 360mm, Bottom: 360mm',
      'Drive Bays': '4x 2.5" SSD, 2x 3.5" HDD',
      'Front I/O': '1x USB 3.2 Gen 2 Type-C, 2x USB 3.0, Audio',
      'Included Fans': 'None (Supports up to 10x 120mm)'
    },
    sku: 'O11DEW-X',
    warranty: '2 Years',
    inStock: true,
    new: true
  },
  {
    id: 9,
    name: 'Samsung Odyssey G9 49"',
    description: 'Massive curved gaming monitor with 240Hz refresh rate and 1ms response time.',
    fullDescription: 'The Samsung Odyssey G9 delivers an immersive gaming experience with its massive 49-inch 1000R curved display, equivalent to two 27-inch 16:9 monitors side by side. Featuring a QLED panel with HDR1000 certification, 240Hz refresh rate, and 1ms response time, this monitor is built for competitive gaming without compromising on image quality. G-Sync and FreeSync Premium Pro support ensure tear-free gameplay, while the dramatic 1000R curvature matches the human eye\'s field of view for reduced eye strain and increased immersion.',
    category: 'Monitors',
    brand: 'Samsung',
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.7,
    reviews: 54,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80',
    specifications: {
      'Screen Size': '49 inches',
      'Resolution': '5120 x 1440 (DQHD)',
      'Aspect Ratio': '32:9',
      'Refresh Rate': '240Hz',
      'Response Time': '1ms (GtG)',
      'Panel Type': 'QLED VA',
      'Curvature': '1000R',
      'HDR': 'HDR1000',
      'Color Support': '1.07 Billion Colors, 125% sRGB, 95% DCI-P3',
      'Connectivity': '2x DisplayPort 1.4, 1x HDMI 2.0, 3x USB 3.0'
    },
    sku: 'LC49G95TSSNXZA',
    warranty: '3 Years',
    inStock: true,
    featured: false,
    discount: 13
  },
  {
    id: 10,
    name: 'Intel Core i9-14900K',
    description: 'Flagship Intel processor with 24 cores and 32 threads for ultimate performance.',
    fullDescription: 'The Intel Core i9-14900K represents the pinnacle of Intel\'s 14th generation desktop processors. Featuring a hybrid architecture with 8 Performance cores and 16 Efficient cores for a total of 24 cores and 32 threads, this CPU excels in both gaming and productivity workloads. With boost clocks up to 6.0 GHz, support for DDR5-5600 memory, and PCIe 5.0, the i9-14900K delivers exceptional performance for demanding users. The unlocked multiplier allows for overclocking, while the integrated Intel UHD Graphics 770 provides basic display capabilities without a discrete GPU.',
    category: 'CPUs',
    brand: 'Intel',
    price: 569.99,
    rating: 4.9,
    reviews: 36,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
    specifications: {
      'Cores/Threads': '24 (8P+16E) / 32',
      'Base Clock': '3.2 GHz (P-Cores), 2.4 GHz (E-Cores)',
      'Boost Clock': 'Up to 6.0 GHz',
      'Cache': '36MB L3 + 32MB L2',
      'TDP': '125W (PL1), 253W (PL2)',
      'Socket': 'LGA 1700',
      'Memory Support': 'DDR5-5600, DDR4-3200',
      'PCIe': 'PCIe 5.0 x16',
      'Integrated Graphics': 'Intel UHD Graphics 770'
    },
    sku: 'BX8071514900K',
    warranty: '3 Years',
    inStock: true,
    featured: true,
    badge: 'Hot 🔥'
  },
  {
    id: 11,
    name: 'Logitech G Pro X Superlight',
    description: 'Ultra-lightweight wireless gaming mouse with pro-grade precision and 70-hour battery life.',
    fullDescription: 'The Logitech G Pro X Superlight is designed for esports professionals, weighing less than 63 grams without compromising on performance or durability. Featuring Logitech\'s HERO 25K sensor for pixel-perfect accuracy up to 25,600 DPI, and LIGHTSPEED wireless technology for a 1ms response rate, this mouse delivers competitive-grade performance without the cable drag. The refined, minimalist design removes unnecessary components while maintaining the award-winning PRO shape that\'s trusted by pro gamers worldwide. With up to 70 hours of battery life, zero-additive PTFE feet for smooth gliding, and five programmable buttons, this is the ultimate competitive gaming mouse.',
    category: 'Peripherals',
    brand: 'Logitech',
    price: 149.99,
    rating: 4.8,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    specifications: {
      'Sensor': 'HERO 25K',
      'Resolution': '100-25,600 DPI',
      'Max Acceleration': '>40G',
      'Max Speed': '>400 IPS',
      'Wireless Technology': 'LIGHTSPEED (1ms)',
      'Battery Life': 'Up to 70 hours',
      'Weight': '<63g',
      'Buttons': '5 Programmable',
      'Connection': 'USB-A receiver, USB-C charging'
    },
    sku: '910-005940',
    warranty: '2 Years',
    inStock: true,
    new: true
  },
  {
    id: 12,
    name: 'WD Black SN850X 1TB',
    description: 'High-performance PCIe 4.0 NVMe SSD optimized for gaming with up to 7,300 MB/s speeds.',
    fullDescription: 'The WD Black SN850X is designed specifically for gamers and creative professionals who demand the fastest storage solutions. With sequential read speeds up to 7,300 MB/s and write speeds up to 6,600 MB/s, this drive dramatically reduces load times and file transfers. The SN850X features a proprietary WD_BLACK G2 controller and nCache 4.0 technology that optimizes random read performance for gaming scenarios. Game Mode 2.0 predictively loads game assets, further reducing stutter and lag. With a compact M.2 2280 form factor and PCIe Gen4 interface, this SSD delivers next-gen performance for your gaming rig or workstation.',
    category: 'Storage',
    brand: 'WD',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.9,
    reviews: 83,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    specifications: {
      'Capacity': '1TB',
      'Interface': 'PCIe Gen4 x4',
      'Form Factor': 'M.2 2280',
      'Sequential Read': 'Up to 7,300 MB/s',
      'Sequential Write': 'Up to 6,600 MB/s',
      'Random Read': 'Up to 1,200K IOPS',
      'Random Write': 'Up to 1,100K IOPS',
      'Endurance': '600 TBW',
      'Controller': 'WD_BLACK G2',
      'Encryption': 'AES 256-bit'
    },
    sku: 'WDS100T2X0E',
    warranty: '5 Years',
    inStock: true,
    discount: 19
  }
];

// Export functions to get products from localStorage or fallback to initial data
export const getProductsFromStorage = (): Product[] => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    return JSON.parse(storedProducts);
  } else {
    // Initial load - no need to set localStorage here as that's handled by ProductContext
    return products;
  }
};

export const getAllProducts = () => {
  // When called from ProductContext initial load, return the hardcoded data
  // When called elsewhere, use the localStorage data
  if (typeof window !== 'undefined') {
    return getProductsFromStorage();
  }
  return products;
};

export const getProductById = (id: number) => {
  const allProducts = getProductsFromStorage();
  return allProducts.find(product => product.id === id);
};

export const getFeaturedProducts = () => {
  const allProducts = getProductsFromStorage();
  return allProducts.filter(product => product.featured);
};

export const getDiscountedProducts = () => {
  const allProducts = getProductsFromStorage();
  return allProducts
    .filter(product => product.discount && product.discount > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0));
};

export const getNewProducts = () => {
  const allProducts = getProductsFromStorage();
  return allProducts.filter(product => product.new);
};

export const getProductsByCategory = (category: string) => {
  const allProducts = getProductsFromStorage();
  return allProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

export const getSimilarProducts = (id: number, category: string, limit = 4) => {
  const allProducts = getProductsFromStorage();
  return allProducts
    .filter(product => product.id !== id && product.category === category)
    .slice(0, limit);
};

export const searchProducts = (query: string) => {
  const allProducts = getProductsFromStorage();
  const lowerCaseQuery = query.toLowerCase();
  return allProducts.filter(product =>
    product.name.toLowerCase().includes(lowerCaseQuery) ||
    product.description.toLowerCase().includes(lowerCaseQuery) ||
    product.category.toLowerCase().includes(lowerCaseQuery)
  );
};

interface FilterOptions {
  category?: string;
  brand?: string;
  brands?: string[];
  priceRange?: [number, number];
  sortBy?: string;
  searchTerm?: string;
}

export const filterProducts = (productsToFilter: Product[], options: FilterOptions) => {
  let filtered = [...productsToFilter];
  
  // Filter by category
  if (options.category) {
    filtered = filtered.filter(product => 
      product.category.toLowerCase() === options.category?.toLowerCase()
    );
  }
  
  // Filter by brands (multiple)
  if (options.brands && options.brands.length > 0) {
    filtered = filtered.filter(product => 
      options.brands?.includes(product.brand)
    );
  }
  // For backward compatibility
  else if (options.brand) {
    filtered = filtered.filter(product => 
      product.brand.toLowerCase() === options.brand?.toLowerCase()
    );
  }
  
  // Filter by price range
  if (options.priceRange) {
    const [min, max] = options.priceRange;
    filtered = filtered.filter(product => 
      product.price >= min && product.price <= max
    );
  }
  
  // Filter by search term
  if (options.searchTerm) {
    const searchTerm = options.searchTerm.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort products
  if (options.sortBy) {
    switch (options.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'deals':
        filtered = filtered.filter(product => product.discount && product.discount > 0)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default: // 'featured'
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
  }
  
  return filtered;
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllProducts, Product } from '../data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  resetProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Default brand mapping based on common manufacturers for categories
const getDefaultBrandForCategory = (category: string): string => {
  const brandMap: Record<string, string[]> = {
    'GPUs': ['NVIDIA', 'AMD', 'ASUS', 'MSI', 'Gigabyte', 'EVGA'],
    'CPUs': ['Intel', 'AMD'],
    'Storage': ['Samsung', 'WD', 'Seagate', 'Crucial', 'Kingston'],
    'Memory': ['Corsair', 'G.Skill', 'Kingston', 'Crucial'],
    'Motherboards': ['ASUS', 'MSI', 'Gigabyte', 'ASRock'],
    'Cooling': ['Cooler Master', 'NZXT', 'Corsair', 'be quiet!'],
    'Power Supplies': ['EVGA', 'Corsair', 'Seasonic', 'be quiet!'],
    'Cases': ['Lian Li', 'Corsair', 'NZXT', 'Fractal Design'],
    'Monitors': ['Samsung', 'LG', 'ASUS', 'Dell', 'Acer'],
    'Peripherals': ['Logitech', 'Razer', 'SteelSeries', 'Corsair']
  };
  
  if (category in brandMap) {
    const brands = brandMap[category];
    // Pick a random brand from the array for this category
    return brands[Math.floor(Math.random() * brands.length)];
  }
  
  // Default brands if category not found
  const defaultBrands = ['HP', 'Dell', 'Lenovo', 'ASUS', 'Techno Zone', 'Acer'];
  return defaultBrands[Math.floor(Math.random() * defaultBrands.length)];
};

// Add brands to products that don't have them
const ensureProductsHaveBrands = (products: Product[]): Product[] => {
  return products.map(product => {
    if (!product.brand) {
      return {
        ...product,
        brand: getDefaultBrandForCategory(product.category)
      };
    }
    return product;
  });
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadInitialProducts = () => {
    const initialProducts = getAllProducts();
    const productsWithBrands = ensureProductsHaveBrands(initialProducts);
    setProducts(productsWithBrands);
    localStorage.setItem('products', JSON.stringify(productsWithBrands));
  };

  useEffect(() => {
    // Load products from localStorage or fallback to initial data
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        
        // Check if products have the brand property
        const productsWithoutBrands = parsedProducts.filter((product: any) => !('brand' in product));
        
        if (productsWithoutBrands.length === 0) {
          setProducts(parsedProducts);
        } else {
          console.warn(`${productsWithoutBrands.length} products in localStorage missing brand property. Adding brands.`);
          const updatedProducts = ensureProductsHaveBrands(parsedProducts);
          setProducts(updatedProducts);
          localStorage.setItem('products', JSON.stringify(updatedProducts));
        }
      } catch (error) {
        console.error('Error parsing products from localStorage:', error);
        loadInitialProducts();
      }
    } else {
      loadInitialProducts();
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const addProduct = (product: Product) => {
    // Generate a new ID (max ID + 1)
    product.id = Math.max(...products.map(p => p.id), 0) + 1;
    // Ensure brand exists
    if (!product.brand) {
      product.brand = getDefaultBrandForCategory(product.category);
    }
    const updatedProducts = [...products, product];
    saveProducts(updatedProducts);
  };

  const updateProduct = (product: Product) => {
    // Ensure brand exists
    if (!product.brand) {
      product.brand = getDefaultBrandForCategory(product.category);
    }
    const updatedProducts = products.map(p => 
      p.id === product.id ? product : p
    );
    saveProducts(updatedProducts);
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(p => p.id !== id);
    saveProducts(updatedProducts);
  };
  
  const resetProducts = () => {
    loadInitialProducts();
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, resetProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 
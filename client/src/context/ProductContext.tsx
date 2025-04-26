import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllProducts, Product } from '../data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load products from localStorage or fallback to initial data
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      const initialProducts = getAllProducts();
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const addProduct = (product: Product) => {
    // Generate a new ID (max ID + 1)
    product.id = Math.max(...products.map(p => p.id), 0) + 1;
    const updatedProducts = [...products, product];
    saveProducts(updatedProducts);
  };

  const updateProduct = (product: Product) => {
    const updatedProducts = products.map(p => 
      p.id === product.id ? product : p
    );
    saveProducts(updatedProducts);
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(p => p.id !== id);
    saveProducts(updatedProducts);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
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
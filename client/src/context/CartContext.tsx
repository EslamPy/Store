import { createContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/products';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  selectedProduct: Product | null;
  isQuickViewOpen: boolean;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  cartNotification: { show: boolean; message: string; type: 'success' | 'error' | 'info' };
  setCartNotification: (notification: { show: boolean; message: string; type: 'success' | 'error' | 'info' }) => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  selectedProduct: null,
  isQuickViewOpen: false,
  openQuickView: () => {},
  closeQuickView: () => {},
  cartNotification: { show: false, message: '', type: 'info' },
  setCartNotification: () => {},
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [storedCartItems, setStoredCartItems] = useLocalStorage<CartItem[]>('cart-items', []);
  const [cartItems, setCartItems] = useState<CartItem[]>(storedCartItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [cartNotification, setCartNotification] = useState<{ 
    show: boolean; 
    message: string; 
    type: 'success' | 'error' | 'info' 
  }>({ 
    show: false, 
    message: '', 
    type: 'info' 
  });
  
  // Update localStorage when cartItems change
  useEffect(() => {
    setStoredCartItems(cartItems);
  }, [cartItems, setStoredCartItems]);
  
  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if product already exists in cart
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if product exists
        setCartNotification({
          show: true,
          message: `Updated ${product.name} quantity in your cart`,
          type: 'success'
        });
        
        // Auto-hide notification after 3 seconds
        setTimeout(() => {
          setCartNotification(prev => ({ ...prev, show: false }));
        }, 3000);
        
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item if product doesn't exist
        setCartNotification({
          show: true,
          message: `Added ${product.name} to your cart`,
          type: 'success'
        });
        
        // Auto-hide notification after 3 seconds
        setTimeout(() => {
          setCartNotification(prev => ({ ...prev, show: false }));
        }, 3000);
        
        return [...prevItems, { product, quantity }];
      }
    });
  };
  
  const removeFromCart = (productId: number) => {
    // Find the product name before removing it
    const productToRemove = cartItems.find(item => item.product.id === productId);
    
    if (productToRemove) {
      setCartNotification({
        show: true,
        message: `Removed ${productToRemove.product.name} from your cart`,
        type: 'info'
      });
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setCartNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
    
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };
  
  const updateQuantity = (productId: number, quantity: number) => {
    // Find the product before updating
    const productToUpdate = cartItems.find(item => item.product.id === productId);
    
    if (productToUpdate) {
      if (quantity > productToUpdate.quantity) {
        setCartNotification({
          show: true,
          message: `Increased ${productToUpdate.product.name} quantity to ${quantity}`,
          type: 'success'
        });
      } else if (quantity < productToUpdate.quantity) {
        setCartNotification({
          show: true,
          message: `Decreased ${productToUpdate.product.name} quantity to ${quantity}`,
          type: 'info'
        });
      }
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setCartNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const clearCart = () => {
    if (cartItems.length > 0) {
      setCartNotification({
        show: true,
        message: 'Your cart has been cleared',
        type: 'info'
      });
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setCartNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      
      setCartItems([]);
    }
  };
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };
  
  const openCart = () => {
    setIsCartOpen(true);
  };
  
  const closeCart = () => {
    setIsCartOpen(false);
  };
  
  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };
  
  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300); // Wait for animation to complete
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      isCartOpen,
      openCart,
      closeCart,
      selectedProduct,
      isQuickViewOpen,
      openQuickView,
      closeQuickView,
      cartNotification,
      setCartNotification,
    }}>
      {children}
    </CartContext.Provider>
  );
};

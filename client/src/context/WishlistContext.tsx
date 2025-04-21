import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product } from '../data/products';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  wishlistNotification: { show: boolean; message: string; type: 'success' | 'error' | 'info' };
  setWishlistNotification: (notification: { show: boolean; message: string; type: 'success' | 'error' | 'info' }) => void;
}

const defaultValue: WishlistContextType = {
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
  wishlistNotification: { show: false, message: '', type: 'info' },
  setWishlistNotification: () => {}
};

export const WishlistContext = createContext<WishlistContextType>(defaultValue);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [storedWishlist, setStoredWishlist] = useLocalStorage<Product[]>('wishlist-items', []);
  const [wishlist, setWishlist] = useState<Product[]>(storedWishlist);
  const [wishlistNotification, setWishlistNotification] = useState<{ 
    show: boolean; 
    message: string; 
    type: 'success' | 'error' | 'info' 
  }>({ 
    show: false, 
    message: '', 
    type: 'info' 
  });
  
  // Update localStorage when wishlist changes
  useEffect(() => {
    setStoredWishlist(wishlist);
  }, [wishlist, setStoredWishlist]);
  
  const addToWishlist = (product: Product) => {
    // Check if product already exists in wishlist
    if (!isInWishlist(product.id)) {
      setWishlist(prevItems => [...prevItems, product]);
      
      // Show notification
      setWishlistNotification({
        show: true,
        message: `Added ${product.name} to your wishlist`,
        type: 'success'
      });
    } else {
      // Product already in wishlist - show notification
      setWishlistNotification({
        show: true,
        message: `${product.name} is already in your wishlist`,
        type: 'info'
      });
    }
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setWishlistNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };
  
  const removeFromWishlist = (productId: number) => {
    // Find the product name before removing it
    const productToRemove = wishlist.find(item => item.id === productId);
    
    if (productToRemove) {
      setWishlist(prevItems => prevItems.filter(item => item.id !== productId));
      
      // Show notification
      setWishlistNotification({
        show: true,
        message: `Removed ${productToRemove.name} from your wishlist`,
        type: 'info'
      });
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setWishlistNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };
  
  const isInWishlist = (productId: number): boolean => {
    return wishlist.some(item => item.id === productId);
  };
  
  const clearWishlist = () => {
    if (wishlist.length > 0) {
      setWishlist([]);
      
      // Show notification
      setWishlistNotification({
        show: true,
        message: 'Your wishlist has been cleared',
        type: 'info'
      });
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setWishlistNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };
  
  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      wishlistNotification,
      setWishlistNotification
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Note: The useWishlist hook is implemented in hooks/useWishlist.ts
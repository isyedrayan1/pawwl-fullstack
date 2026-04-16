import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cart: string[];
  favorites: string[];
  isCartOpen: boolean;
  isFavoritesOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setFavoritesOpen: (open: boolean) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isInCart: (productId: string) => boolean;
  isFavorite: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isFavoritesOpen, setFavoritesOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pawwl_cart');
    const savedFavs = localStorage.getItem('pawwl_favorites');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('pawwl_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pawwl_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (productId: string) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(id => id !== productId));
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const isInCart = (productId: string) => cart.includes(productId);
  const isFavorite = (productId: string) => favorites.includes(productId);

  return (
    <CartContext.Provider value={{ 
      cart, favorites, isCartOpen, isFavoritesOpen, 
      setCartOpen, setFavoritesOpen, addToCart, removeFromCart, 
      toggleFavorite, isInCart, isFavorite 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

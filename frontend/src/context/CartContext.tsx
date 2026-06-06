import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  favorites: string[];
  isCartOpen: boolean;
  isFavoritesOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setFavoritesOpen: (open: boolean) => void;
  addToCart: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  toggleFavorite: (productId: string) => void;
  clearCart: () => void;
  clearFavorites: () => void;
  isInCart: (productId: string) => boolean;
  isFavorite: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isFavoritesOpen, setFavoritesOpen] = useState(false);

  // 1. Check logged-in status
  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiRequest<{ user: any }>('/api/auth/me').catch(() => ({ user: null })),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isLoggedIn = Boolean(meData?.user);

  // 2. Fetch server cart if logged in
  const { data: dbCartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => apiRequest<{ items: any[] }>('/api/cart'),
    enabled: isLoggedIn,
    retry: false,
  });

  // Load guest cart & favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('pawwl_cart');
      const savedFavs = localStorage.getItem('pawwl_favorites');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setLocalCart(parsed);
        }
      }
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
          setFavorites(parsed.filter((id: any) => typeof id === 'string'));
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Could not parse cart/favorites from localStorage', err);
    }
  }, []);

  // Save guest cart and favorites to localStorage when state changes
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('pawwl_cart', JSON.stringify(localCart));
    }
  }, [localCart, isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('pawwl_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 3. Guest Cart Merger Mutation
  const mergeCartMutation = useMutation({
    mutationFn: (items: { variantId: string; quantity: number }[]) =>
      apiRequest<{ items: any[] }>('/api/cart/merge', {
        method: 'POST',
        body: JSON.stringify({ items }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      localStorage.removeItem('pawwl_cart');
      setLocalCart([]);
    },
  });

  // Trigger merge when logging in
  useEffect(() => {
    if (isLoggedIn && localCart.length > 0) {
      const payload = localCart.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));
      mergeCartMutation.mutate(payload);
    }
  }, [isLoggedIn, localCart]);

  // Computed cart list returned to components
  const cart: CartItem[] = isLoggedIn
    ? (dbCartData?.items ?? []).map((item) => ({
        productId: item.product.id,
        variantId: item.variant.id,
        quantity: item.quantity,
      }))
    : localCart;

  const addToCart = async (productId: string, variantId: string, quantity = 1) => {
    if (isLoggedIn) {
      await apiRequest('/api/cart/items', {
        method: 'POST',
        body: JSON.stringify({ variantId, quantity }),
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } else {
      setLocalCart((prev) => {
        const idx = prev.findIndex((item) => item.variantId === variantId);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx].quantity += quantity;
          return updated;
        }
        return [...prev, { productId, variantId, quantity }];
      });
    }
  };

  const removeFromCart = async (variantId: string) => {
    if (isLoggedIn) {
      const dbItem = (dbCartData?.items ?? []).find((item) => item.variant.id === variantId);
      if (dbItem) {
        await apiRequest(`/api/cart/items/${dbItem.id}`, { method: 'DELETE' });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    } else {
      setLocalCart((prev) => prev.filter((item) => item.variantId !== variantId));
    }
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    if (quantity < 1) return;
    if (isLoggedIn) {
      const dbItem = (dbCartData?.items ?? []).find((item) => item.variant.id === variantId);
      if (dbItem) {
        await apiRequest(`/api/cart/items/${dbItem.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ quantity }),
        });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    } else {
      setLocalCart((prev) =>
        prev.map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
      );
    }
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const isInCart = (productId: string) => cart.some((item) => item.productId === productId);
  const isFavorite = (productId: string) => favorites.includes(productId);

  const clearCart = () => {
    if (!isLoggedIn) {
      setLocalCart([]);
    }
  };
  const clearFavorites = () => setFavorites([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        favorites,
        isCartOpen,
        isFavoritesOpen,
        setCartOpen,
        setFavoritesOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleFavorite,
        isInCart,
        isFavorite,
        clearCart,
        clearFavorites,
      }}
    >
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

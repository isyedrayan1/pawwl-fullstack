import React from 'react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest, ApiProduct, formatPrice } from '@/lib/api';

interface SideDrawerProps {
  type: 'cart' | 'favorites';
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ type, isOpen, onClose }) => {
  const { cart, favorites, removeFromCart, toggleFavorite, updateQuantity } = useCart();

  const { data: apiProducts } = useQuery({
    queryKey: ['drawer-products'],
    queryFn: () => apiRequest<{ products: ApiProduct[] }>('/api/products'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const catalog = apiProducts?.products ?? [];

  const catalogById = new Map(catalog.map((product) => [product.id, product]));

  // Resolve Cart Items with variant and quantity details
  const cartItems = type === 'cart'
    ? cart.map((item) => {
        const product = catalogById.get(item.productId);
        if (!product) return null;
        const variant = product.variants.find((v) => v.id === item.variantId) || product.variants[0];
        const price = Number(variant?.salePrice ?? product.price ?? variant?.price ?? 0);
        return {
          id: item.variantId,
          productId: item.productId,
          slug: product.slug,
          title: product.name,
          category: [product.animalType, product.category].filter(Boolean).join(' · ') || product.category,
          variantName: variant?.name === 'Default' ? '' : variant?.name ?? '',
          image: product.images?.[0] ?? '/pawwl-logo-main-croped.webp',
          quantity: item.quantity,
          price,
          totalPrice: price * item.quantity,
        };
      }).filter(Boolean) as Array<{
        id: string;
        productId: string;
        slug: string;
        title: string;
        category: string;
        variantName: string;
        image: string;
        quantity: number;
        price: number;
        totalPrice: number;
      }>
    : [];

  // Resolve Favorite Items
  const favoriteItems = type === 'favorites'
    ? favorites.map((id) => {
        const product = catalogById.get(id);
        if (!product) return null;
        const defaultVariant = product.variants?.[0];
        const price = Number(defaultVariant?.salePrice ?? product.price ?? defaultVariant?.price ?? 0);
        return {
          id: product.id,
          productId: product.id,
          slug: product.slug,
          title: product.name,
          category: [product.animalType, product.category].filter(Boolean).join(' · ') || product.category,
          variantName: '',
          image: product.images?.[0] ?? '/pawwl-logo-main-croped.webp',
          quantity: 1,
          price,
          totalPrice: price,
        };
      }).filter(Boolean) as Array<{
        id: string;
        productId: string;
        slug: string;
        title: string;
        category: string;
        variantName: string;
        image: string;
        quantity: number;
        price: number;
        totalPrice: number;
      }>
    : [];

  const items = type === 'cart' ? cartItems : favoriteItems;
  const totalItems = type === 'cart' 
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : favorites.length;

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className={`absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right`}>
        {/* Header */}
        <div className="p-6 border-b border-[#f0f0f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {type === 'cart' ? <ShoppingBag size={20} className="text-[#134e86]" /> : <Heart size={20} className="text-[#ff4d4d]" />}
            <h2 className="text-xl font-bold text-[#191919] capitalize">
              Your {type}
            </h2>
            <span className="bg-[#f0f0f0] text-[#555555] text-xs font-bold px-2 py-1 rounded-full">
              {totalItems}
            </span>
          </div>
          <button onClick={onClose} title="Close drawer" aria-label="Close drawer" className="p-2 hover:bg-[#f8f8f8] rounded-full transition-colors">
            <X size={20} className="text-[#191919]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
              <div className="w-16 h-16 bg-[#f8fbff] rounded-full flex items-center justify-center opacity-50">
                {type === 'cart' ? <ShoppingBag size={32} /> : <Heart size={32} />}
              </div>
              <div>
                <p className="text-[#191919] font-bold">Your {type} is empty</p>
                <p className="text-[#b1b1b1] text-sm mt-1">Start browsing our collection to add items.</p>
              </div>
              <Link 
                to="/products" 
                onClick={onClose}
                className="mt-2 text-[#134e86] font-bold text-sm hover:underline"
              >
                Go to Shop
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 bg-[#f8fbff] rounded-xl overflow-hidden border border-[#f0f0f0] shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-[#191919] text-sm leading-tight group-hover:text-[#134e86] transition-colors line-clamp-2">
                       {item.title}
                    </h3>
                    <p className="text-[#b1b1b1] text-[10px] font-bold uppercase tracking-wider mt-1">
                      {item.category} {item.variantName && `| ${item.variantName}`}
                    </p>
                  </div>
                  
                  {type === 'cart' && (
                    <div className="flex items-center border border-[#f0f0f0] rounded-lg bg-white mt-2 w-fit">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2.5 py-1 text-xs hover:bg-[#f8f8f8] disabled:opacity-50 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-[#191919]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs hover:bg-[#f8f8f8] font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="text-sm font-bold text-[#134e86]">
                      {formatPrice(item.totalPrice)}
                    </span>
                    <div className="flex gap-2">
                      <Link 
                        to={`/products/${item.slug || item.productId}`} 
                        onClick={onClose}
                        className="text-xs font-bold text-[#134e86] hover:underline flex items-center"
                      >
                        View
                      </Link>
                      <button 
                        onClick={() => type === 'cart' ? removeFromCart(item.id) : toggleFavorite(item.id)}
                        className="p-1.5 text-[#ff4d4d] hover:bg-[#fff5f5] rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && type === 'cart' && (
          <div className="p-6 border-t border-[#f0f0f0] bg-[#fcfcfc]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-[#555] uppercase tracking-wider">Sub Total</span>
              <span className="text-xl font-bold text-[#134e86]">{formatPrice(cartSubtotal)}</span>
            </div>
            <Link 
              to="/checkout"
              onClick={onClose}
              className="w-full h-14 bg-[#134e86] hover:bg-[#0d365d] text-white rounded-xl flex items-center justify-center gap-3 font-bold uppercase tracking-wider shadow-lg shadow-[#134e86]/20 transition-all active:scale-[0.98]"
            >
              <ShoppingBag size={20} />
              <span>Checkout Now</span>
            </Link>
            <p className="text-center text-[#b1b1b1] text-[10px] mt-4 uppercase tracking-[0.1em] font-bold">
              Secure Checkout & Free Shipping
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideDrawer;

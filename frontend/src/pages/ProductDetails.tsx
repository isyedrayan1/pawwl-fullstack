import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { ChevronRight, Star, Plus, Minus, ShieldCheck, HeartPulse, Truck, CheckCircle2, ChevronDown, ShoppingBag, Heart } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { products as fallbackProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, ApiProduct } from "@/lib/api";

const parseStringArray = (value: string[] | string | null | undefined) => {
  if (Array.isArray(value)) return value;
  if (!value) return [] as string[];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [] as string[];
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fallbackProduct = fallbackProducts.find(p => p.id === id || p.slug === id);
  const { data: apiProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const data = await apiRequest<{ product: ApiProduct }>(`/api/products/${id}`);
      return data.product;
    },
    enabled: !!id,
    retry: false,
  });
  const product = apiProduct
    ? {
        id: apiProduct.id,
        slug: apiProduct.slug,
        title: apiProduct.name,
        subtitle: apiProduct.brand ?? apiProduct.category,
        category: apiProduct.category,
        description: apiProduct.description ?? "",
        benefits: parseStringArray(apiProduct.benefits),
        ingredients: apiProduct.ingredients ?? undefined,
        usage: apiProduct.usage ?? "",
        rating: apiProduct.rating ?? "0.0",
        reviewCount: apiProduct.reviewCount ?? 0,
        images: parseStringArray(apiProduct.images).length ? parseStringArray(apiProduct.images) : ["/pawwl-logo-main-croped.webp"],
        sizes: Array.isArray(apiProduct.variants) ? apiProduct.variants.map((variant) => variant.name) : [],
        tag: apiProduct.status === "published" ? "Available" : undefined,
      }
    : fallbackProduct;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  
  const { addToCart, toggleFavorite, isInCart, isFavorite } = useCart();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <h2 className="text-3xl font-bold text-[#1b4965] mb-4">Product Not Found</h2>
        <Link to="/products" className="text-brand-blue font-bold hover:underline">Return to Shop</Link>
      </div>
    );
  }

  // Filter out current product for "Related" section
  const relatedProducts = fallbackProducts.filter(p => p.id !== id).slice(0, 4);

  const whatsappLink = `https://wa.me/917208813649?text=${encodeURIComponent(`Hello! I would like to order ${quantity}x ${product.title} (Size: ${selectedSize}).`)}`;
  const selectedApiVariant = Array.isArray(apiProduct?.variants)
    ? apiProduct.variants.find((variant) => variant.name === selectedSize) ?? apiProduct.variants[0]
    : undefined;
  const buyNow = () => {
    if (!apiProduct || !selectedApiVariant) {
      toast.error("Online checkout is unavailable for this item right now");
      return;
    }

    navigate(`/checkout?product=${apiProduct.id}&variant=${selectedApiVariant.id}&qty=${quantity}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${product.title} | Shop Pet Supplies`}
        description={product.subtitle}
        image={product.images[0]}
        url={`https://pawwl.com/products/${product.id}`}
        type="product"
      />
      <Navbar />



      {/* 1. Breadcrumbs */}
      <div className="w-full flex justify-center pt-4 md:pt-8 pb-4 bg-white">
        <div className="w-full max-w-[1114px] px-6 lg:px-0 flex items-center gap-3">
          <Link to="/" className="font-medium text-xs text-[#b1b1b1] cursor-pointer hover:underline uppercase tracking-wider">Home</Link>
          <ChevronRight size={12} className="text-[#b1b1b1]" />
          <Link to="/products" className="font-medium text-xs text-[#b1b1b1] cursor-pointer hover:underline uppercase tracking-wider">Supplies</Link>
          <ChevronRight size={12} className="text-[#b1b1b1]" />
          <span className="font-medium text-xs text-[#b1b1b1] uppercase tracking-wider">{product.category}</span>
          <ChevronRight size={12} className="text-[#b1b1b1]" />
          <span className="font-medium text-xs text-[#191919] uppercase tracking-wider line-clamp-1">{product.title}</span>
        </div>
      </div>

      {/* 2. Main Product Info */}
      <div className="w-full flex justify-center bg-white pb-20">
        <div className="w-full max-w-[1114px] px-6 lg:px-0 flex flex-col lg:flex-row gap-12 lg:gap-14">
          
          {/* Left: Product Images */}
          <div className="w-full lg:w-[500px] flex flex-col gap-4">
            <div className="w-full aspect-square rounded-2xl border border-[#f0f0f0] bg-white relative overflow-hidden flex items-center justify-center p-1 group">
              <img src={product.images[0]} className="w-full h-full object-cover rounded-xl" alt={product.title} />
              
              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-20">
                <button 
                  onClick={() => {
                    toggleFavorite(product.id);
                    toast(isFavorite(product.id) ? "Removed from Favorites" : "Added to Favorites", {
                      description: product.title,
                      icon: <Heart size={14} fill={!isFavorite(product.id) ? "currentColor" : "none"} />
                    });
                  }}
                  aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                  title={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-md transition-all hover:scale-110 active:scale-95 ${
                    isFavorite(product.id) ? "bg-[#ff4d4d] text-white" : "bg-white/90 backdrop-blur-sm text-[#191919] border border-[#f0f0f0]"
                  }`}
                >
                  <Heart size={20} fill={isFavorite(product.id) ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={async () => {
                    if (isInCart(product.id)) {
                      toast.info("Already in Cart", { description: product.title });
                      return;
                    }

                    if (!apiProduct || !selectedApiVariant) {
                      // Fallback to local cart if variant info missing
                      addToCart(product.id);
                      toast.success("Added to Cart", { description: product.title });
                      return;
                    }

                    try {
                      await apiRequest(`/api/cart/items`, {
                        method: "POST",
                        body: JSON.stringify({ variantId: selectedApiVariant.id, quantity }),
                      });
                      // keep local context in sync for immediate UI feedback
                      addToCart(product.id);
                      // refresh server-synced cart queries
                      queryClient.invalidateQueries({ queryKey: ["cart"] });
                      queryClient.invalidateQueries({ queryKey: ["drawer-products"] });
                      toast.success("Added to Cart", { description: product.title });
                    } catch (err) {
                      // If API fails (likely unauthenticated), fall back to local cart
                      addToCart(product.id);
                      toast.success("Added to Cart (local)", { description: product.title });
                    }
                  }}
                  aria-label={isInCart(product.id) ? "Already in cart" : "Add to cart"}
                  title={isInCart(product.id) ? "Already in cart" : "Add to cart"}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-md transition-all hover:scale-110 active:scale-95 ${
                    isInCart(product.id) ? "bg-[#134e86] text-white" : "bg-white/90 backdrop-blur-sm text-[#191919] border border-[#f0f0f0]"
                  }`}
                >
                  <ShoppingBag size={20} />
                </button>
              </div>

              {product.tag && (
                <div className="absolute top-4 left-4 bg-[#134e86] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-sm">
                  {product.tag}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex-1 flex flex-col pt-2">
            <span className="text-[#134e86] font-bold text-[11px] tracking-widest uppercase underline mb-3">{product.category}</span>
            <h1 className="text-[38px] md:text-[44px] font-extrabold leading-tight text-[#191919] mb-4">
              {product.title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={15} fill="#fff200" className="text-[#fff200]" />
                ))}
              </div>
              <span className="font-bold text-[13px] text-[#191919]">{product.rating}</span>
              <span className="text-[#555555] text-[13px]">({product.reviewCount} reviews)</span>
            </div>

            <p className="text-[#555555] text-lg leading-relaxed mb-8 max-w-[550px]">
              {product.subtitle}
            </p>

            {/* Status */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#17b170]" />
              <span className="font-bold text-[#17b170] text-xs uppercase tracking-wide">Available</span>
              <span className="text-[#555555] text-xs">— Ships within 1-2 business days</span>
            </div>

            {/* Size Selector */}
            <div className="flex flex-col gap-3 mb-10">
              <span className="font-bold text-[#191919] text-sm">Select Variation</span>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[80px] px-4 h-11 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === size 
                        ? 'border-[#134e86] bg-[#134e86] text-white shadow-sm' 
                        : 'border-[#f0f0f0] text-[#555555] hover:border-[#b1b1b1] bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 h-auto sm:h-[56px]">
              <div className="flex items-center justify-between border border-[#f0f0f0] rounded-xl h-14 sm:h-full w-full sm:w-[140px] bg-white shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity" title="Decrease quantity" className="w-12 h-full flex items-center justify-center text-[#191919] hover:bg-[#f8f8f8] rounded-l-xl transition-colors">
                  <Minus size={18} />
                </button>
                <div className="flex-1 h-full border-x border-[#f0f0f0] flex items-center justify-center">
                  <span className="font-bold text-base text-[#191919] select-none">{quantity}</span>
                </div>
                <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity" title="Increase quantity" className="w-12 h-full flex items-center justify-center text-[#191919] hover:bg-[#f8f8f8] rounded-r-xl transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              
              <button
                onClick={buyNow}
                className="flex-1 h-14 sm:h-full bg-[#134e86] hover:bg-[#0d365d] transition-colors rounded-xl flex justify-center items-center gap-3 shadow-lg shadow-[#134e86]/20 group"
              >
                 <ShoppingBag size={20} className="text-white group-hover:scale-110 transition-transform" />
                 <span className="font-bold text-[15px] text-white uppercase tracking-wider">Buy Now</span>
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="h-14 sm:h-full px-5 border border-[#134e86] text-[#134e86] hover:bg-[#f8fbff] transition-colors rounded-xl flex justify-center items-center"
              >
                 <span className="font-bold text-[13px] uppercase tracking-wider">WhatsApp</span>
              </a>
            </div>

            {/* Feature Points */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-[#f0f0f0]">
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-[#555555]" />
                <span className="font-semibold text-xs text-[#555555] uppercase tracking-wide">Secure Shipping</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#555555]" />
                <span className="font-semibold text-xs text-[#555555] uppercase tracking-wide">Quality Assured</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#555555]" />
                <span className="font-semibold text-xs text-[#555555] uppercase tracking-wide">Sustainably Sourced</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Product Description Block */}
      <div className="w-full flex justify-center bg-[#f8fbff] py-20 border-y border-[#dce6ee] relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#134e86" strokeWidth="2" strokeDasharray="10 10"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="#134e86" strokeWidth="2" strokeDasharray="10 10"/>
          </svg>
        </div>

        <div className="w-full max-w-[1114px] px-6 lg:px-0 relative z-10 flex">
          <div className="flex flex-col w-full lg:w-[700px] gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-extrabold text-[24px] text-[#191919]">Product Specifications</span>
            </div>
            
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <span className="font-bold text-[16px] text-[#191919]">Detailed Description</span>
                <p className="font-normal text-[15px] leading-relaxed text-[#555555]">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <span className="font-bold text-[16px] text-[#191919]">Key Technical Benefits</span>
                  <ul className="flex flex-col gap-2">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] text-[#555555]">
                        <CheckCircle2 size={14} className="text-[#134e86] mt-1 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {product.ingredients && (
                  <div className="flex flex-col gap-3">
                    <span className="font-bold text-[16px] text-[#191919]">Components & Materials</span>
                    <p className="font-normal text-[14px] leading-relaxed text-[#555555]">
                      {product.ingredients}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-[#dce6ee]">
                <span className="font-bold text-[16px] text-[#191919]">Professional Usage Instructions</span>
                <p className="font-normal text-[14px] leading-relaxed text-[#555555]">
                  {product.usage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Why Pet Parents Love It */}
      <div className="w-full flex justify-center bg-white py-24">
        <div className="w-full max-w-[1114px] px-6 lg:px-0 flex flex-col items-center gap-14">
          <div className="flex flex-col items-center gap-4 text-center max-w-[800px]">
            <h2 className="font-black text-[42px] tracking-tight text-[#012169]">Why Professionals Choose This</h2>
            <p className="font-medium text-[18px] text-[#134e86] leading-relaxed max-w-[600px]">
              Every product in our collection is strictly vetted for quality, durability, and practical ergonomic design for your pet.
            </p>
          </div>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { icon: <CheckCircle2 size={24} className="text-[#134e86]"/>, title: "Quality Tested", desc: "Meets international standards for pet safety" },
               { icon: <HeartPulse size={24} className="text-[#134e86]"/>, title: "Ergonomic Design", desc: "Tailored to your pet's natural movements" },
               { icon: <ShieldCheck size={24} className="text-[#134e86]"/>, title: "Durable Materials", desc: "Long-lasting performance in any environment" },
               { icon: <Truck size={24} className="text-[#134e86]"/>, title: "Reliable Support", desc: "Direct access to our specialized support teams" }
             ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center bg-white p-8 rounded-2xl border border-[#f0f0f0] gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-[60px] h-[60px] flex justify-center items-center bg-[#f8fbff] rounded-full mb-2">
                    {feature.icon}
                  </div>
                  <span className="font-extrabold text-[16px] text-center text-[#191919]">{feature.title}</span>
                  <span className="font-medium text-[13px] text-center text-[#555555] leading-relaxed px-2">{feature.desc}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* 5. Related Products */}
      <div className="w-full flex justify-center bg-white py-24 pb-32 border-t border-[#f0f0f0]">
        <div className="w-full max-w-[1114px] px-6 lg:px-0 flex flex-col gap-10">
          <span className="font-extrabold text-[24px] text-[#191919]">More from our Collection</span>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item, i) => (
               <Link to={`/products/${item.id}`} key={i} className="flex flex-col bg-white rounded-3xl border border-[#f0f0f0] overflow-hidden hover:shadow-xl transition-all group">
                 <div className="w-full aspect-[4/3] bg-[#f4f7f9] relative overflow-hidden p-2">
                   <img src={item.images[0]} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700" alt={item.title}/>
                 </div>
                 <div className="flex flex-col p-6 gap-3">
                   <span className="font-bold text-[11px] text-[#134e86] uppercase tracking-wider">{item.category}</span>
                   <span className="font-extrabold text-[16px] text-[#191919] line-clamp-1">{item.title}</span>
                   <div className="flex items-center gap-2">
                     <div className="flex gap-0.5">
                       {[1, 2, 3, 4, 5].map(j => <Star key={j} size={11} fill="#fff200" className="text-[#fff200]" />)}
                     </div>
                     <span className="font-bold text-[11px] text-[#a0a0a0]">{item.rating}</span>
                   </div>
                   <div className="flex justify-end items-end mt-2">
                     <div className="w-10 h-10 flex justify-center items-center bg-[#134e86] rounded-xl group-hover:bg-[#0d365d] transition-colors shadow-lg shadow-[#134e86]/20">
                       <ShoppingBag size={18} strokeWidth={2.5} className="text-white"/>
                     </div>
                   </div>
                 </div>
               </Link>
            ))}
          </div>
        </div>
      </div>

      <CTASection />
      <Footer />
    </div>
  );
};

export default ProductDetails;

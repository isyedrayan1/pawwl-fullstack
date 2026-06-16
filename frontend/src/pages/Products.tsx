import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import DoctorsSection from "@/components/DoctorsSection";
import PetGallery from "@/components/PetGallery";
import Testimonials from "@/components/Testimonials";
import SEO from "@/components/SEO";

import { useApiProducts } from "@/hooks/useApiProducts";
import { formatPrice, getImageUrl } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

import prd13 from "@/assets/gallery/13.webp";
import prd17 from "@/assets/gallery/17.webp";

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

const Products = () => {
  const { data: apiProducts, isLoading, error } = useApiProducts();
  const { addToCart } = useCart();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [animalFilter, setAnimalFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const products = (apiProducts ?? []).map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.name,
    subtitle: [product.brand, product.animalType, product.category].filter(Boolean).join(" · ") || product.category,
    category: product.category,
    animalType: product.animalType ?? "All Pets",
    price: Number(product.price ?? product.variants?.[0]?.salePrice ?? product.variants?.[0]?.price ?? 0),
    stock: product.stock ?? product.variants?.[0]?.stock ?? 0,
    description: product.description ?? "",
    benefits: parseStringArray(product.benefits),
    ingredients: product.ingredients ?? undefined,
    usage: product.usage ?? "",
    rating: product.rating ?? "0.0",
    reviewCount: product.reviewCount ?? 0,
    images: parseStringArray(product.images).length
      ? parseStringArray(product.images).map((p) => getImageUrl(p))
      : [getImageUrl("/pawwl-logo-main-croped.webp")],
    sizes: Array.isArray(product.variants) ? product.variants.map((variant) => variant.name) : [],
    tag: product.status === "published" ? "Available" : undefined,
  }));
  const hasCatalogError = Boolean(error);
  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), [products]);
  const animalTypes = useMemo(() => Array.from(new Set(products.map((product) => product.animalType).filter(Boolean))).sort(), [products]);
  const visibleProducts = products.filter((product) => {
    const categoryMatch = categoryFilter === "all" || product.category === categoryFilter;
    const animalMatch = animalFilter === "all" || product.animalType === animalFilter;
    const searchMatch = !searchFilter || product.title.toLowerCase().includes(searchFilter.toLowerCase()) || product.description.toLowerCase().includes(searchFilter.toLowerCase());
    return categoryMatch && animalMatch && searchMatch;
  });
  const hasProducts = visibleProducts.length > 0;




  return (
    <div className="min-h-screen bg-white text-brand-dark selection:bg-brand-blue selection:text-white overflow-hidden">
      <SEO 
        title="Shop Premium Pet Products & Accessories | Pawwl Mumbai"
        description="Browse our curated collection of high-quality pet food, grooming kits, comfort leashes, and health supplements. Best pet shop in Bhandup West, Mumbai."
        url="https://pawwl.com/products"
      />
      <Navbar />

      {/* 1. Hero Section */}
      <section className="bg-white pt-4 md:pt-8 pb-12 overflow-hidden">
        <div className="section-container">
          <div className="w-full flex flex-col gap-9">
            
            {/* Top Wide Banner */}
            <div 
              className="w-full max-w-[1114px] h-[320px] sm:h-[420px] md:h-[496px] bg-[#4a72ae] rounded-[28px] relative overflow-hidden flex items-center justify-center mx-auto group shadow-2xl"
            >
               <img src="/assets/images/productsheroimg.webp" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover z-20" alt="Products Banner" />
               <PawwlWatermark 
                 className="relative z-10 w-[90%] md:w-[1000px] h-auto text-white drop-shadow-2xl" 
                 opacity={1}
               />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Premium Products Section */}
      <section className="w-full flex justify-center bg-white px-6 md:px-12 lg:px-40 py-16 lg:py-24 border-t border-[#dce6ee] overflow-hidden">
        <div className="w-full max-w-[1440px] flex flex-col items-center gap-12">
          
          <div 
            className="flex flex-col items-center gap-4 text-center max-w-3xl"
          >
            <h2 className="font-extrabold text-[36px] md:text-[51.4px] leading-tight text-[#134e86]">
              Pamper Your Pet with Our Premium Selection
            </h2>
            <p className="font-normal text-[18px] md:text-[20px] leading-relaxed text-[#134e86]/80">
              Discover a curated collection of essential pet supplies designed for those who value quality, durability, and the exceptional well-being of their companions.
            </p>
          </div>

          <div className="w-full max-w-[1144px] flex flex-col gap-8">
            {!isLoading && !hasCatalogError && products.length > 0 && (
              <div className="flex flex-col items-center gap-4 w-full">
                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#134e86] focus:border-transparent"
                    id="product-search-input"
                  />
                </div>
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button onClick={() => setAnimalFilter("all")} className={`rounded-full border px-4 py-2 text-sm font-bold ${animalFilter === "all" ? "bg-[#134e86] text-white border-[#134e86]" : "bg-white text-[#134e86] border-[#dce6ee]"}`}>All Pets</button>
                  {animalTypes.map((animalType) => (
                    <button key={animalType} onClick={() => setAnimalFilter(animalType)} className={`rounded-full border px-4 py-2 text-sm font-bold ${animalFilter === animalType ? "bg-[#134e86] text-white border-[#134e86]" : "bg-white text-[#134e86] border-[#dce6ee]"}`}>{animalType}</button>
                  ))}
                  <span className="hidden h-8 w-px bg-[#dce6ee] md:block" />
                  <button onClick={() => setCategoryFilter("all")} className={`rounded-full border px-4 py-2 text-sm font-bold ${categoryFilter === "all" ? "bg-[#191919] text-white border-[#191919]" : "bg-white text-[#191919] border-[#dce6ee]"}`}>All Categories</button>
                  {categories.map((category) => (
                    <button key={category} onClick={() => setCategoryFilter(category)} className={`rounded-full border px-4 py-2 text-sm font-bold ${categoryFilter === category ? "bg-[#191919] text-white border-[#191919]" : "bg-white text-[#191919] border-[#dce6ee]"}`}>{category}</button>
                  ))}
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="w-full min-h-[480px] rounded-[28px] border border-dashed border-[#dce6ee] bg-[#f8fbff] flex flex-col items-center justify-center text-center px-6">
                <p className="text-[#134e86] font-bold text-lg">Loading products...</p>
                <p className="text-[#788796] text-sm mt-2">Fetching the latest catalog from the database.</p>
              </div>
            ) : hasCatalogError ? (
              <div className="w-full min-h-[480px] rounded-[28px] border border-dashed border-[#dce6ee] bg-[#fffaf8] flex flex-col items-center justify-center text-center px-6">
                <p className="text-[#b42318] font-bold text-lg">Unable to load products</p>
                <p className="text-[#7a7a7a] text-sm mt-2">The product API could not be reached right now. Please try again later.</p>
              </div>
            ) : !hasProducts ? (
              <div className="w-full min-h-[480px] rounded-[28px] border border-dashed border-[#dce6ee] bg-[#f8fbff] flex flex-col items-center justify-center text-center px-6">
                <p className="text-[#134e86] font-bold text-lg">No products available yet</p>
                <p className="text-[#788796] text-sm mt-2">Products will appear here once they are created in the admin panel and published.</p>
              </div>
            ) : (
              <>
                {/* Product Grid — Shopify-style: image first, full card border, full-width CTA */}
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {visibleProducts.map((item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden hover:border-[#134e86]/30 hover:shadow-[0_4px_24px_rgba(19,78,134,0.10)] transition-all duration-200"
                    >
                      {/* ── Image zone ── */}
                      <Link
                        to={`/products/${item.slug}`}
                        className="relative block w-full bg-[#f4f7fa]"
                        style={{ aspectRatio: "1 / 1" }}
                      >
                        <img
                          src={item.images[0]}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-contain p-5 group-hover:scale-[1.04] transition-transform duration-300"
                          alt={item.title}
                        />
                        {/* Animal / category badge */}
                        {item.animalType && item.animalType !== "All Pets" && (
                          <span className="absolute top-2.5 left-2.5 bg-white text-[#134e86] font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#dce6ee] shadow-sm">
                            {item.animalType}
                          </span>
                        )}
                      </Link>

                      {/* ── Info zone ── */}
                      <div className="flex flex-col gap-2.5 p-4 pt-3.5 flex-1">
                      {/* Product name */}
                        <Link to={`/products/${item.slug}`}>
                          <h3 className="font-bold text-[13px] sm:text-[14px] text-[#0f172a] leading-snug line-clamp-2 hover:text-[#134e86] transition-colors">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Subtitle — brand · category */}
                        <p className="text-[11px] text-[#94a3b8] leading-snug line-clamp-1">
                          {item.subtitle}
                        </p>

                        {/* Price */}
                        <p className="font-extrabold text-[15px] text-[#134e86] mt-0.5">
                          {formatPrice(item.price)}
                        </p>

                        <div className="mt-auto pt-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              const originalProduct = apiProducts?.find((p) => p.id === item.id);
                              const variantId = originalProduct?.variants?.[0]?.id ?? "";
                              addToCart(item.id, variantId, 1);
                              toast.success("Added to Cart", { description: item.title });
                            }}
                            className="flex w-full items-center justify-center gap-2 h-10 rounded-full bg-[#134e86] hover:bg-[#0d365d] text-white font-bold text-[12px] uppercase tracking-wider transition-colors shadow-sm"
                          >
                            <ShoppingBag size={13} strokeWidth={2.5} />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. Partner Sellers Section */}
      <section className="flex flex-col justify-center items-center gap-[15px] self-stretch bg-white py-12 md:py-3 overflow-hidden">
        {/* Header container */}
        <div className="w-full max-w-[1140px] px-6 md:px-0 flex justify-between items-center">
          <div className="flex items-end gap-2">
            <span className="font-medium text-[16px] leading-[31px] text-black italic md:not-italic">Proud to be part of</span>
            <span className="font-bold text-[24px] leading-[36px] capitalize text-[#003459]">Pet Sellers</span>
          </div>
          <Button className="flex justify-center items-center gap-2 px-7 py-3 rounded-[57px] border-[1.5px] border-solid border-[#003459] bg-transparent hover:bg-[#003459] text-[#003459] hover:text-white transition-all h-auto text-sm font-medium">
            View all our sellers
            <ArrowRight size={16} />
          </Button>
        </div>

        {/* Logos Container */}
        <div className="w-full max-w-[1140px] h-auto md:h-28 flex overflow-hidden">
          {/* Static Desktop Row / Marquee Mobile Row */}
          <div className="flex shrink-0 items-center justify-between gap-5 w-full min-w-full md:min-w-0 animate-marquee-mobile md:animate-none px-6 md:px-0">
             {[
               { src: "/assets/sellersimg/sellr1.webp", className: "w-[88px] h-[64px]" },
               { src: "/assets/sellersimg/slr2.webp", className: "w-[114px] h-[114px]" },
               { src: "/assets/sellersimg/slr3.webp", className: "w-[104px] h-[46px]" },
               { src: "/assets/sellersimg/slr4.webp", className: "w-[92px] h-[64px]" },
               { src: "/assets/sellersimg/slr5.webp", className: "w-[92px] h-[92px]" },
               { src: "/assets/sellersimg/slr6.webp", className: "w-[130px] h-[56px]" },
               { src: "/assets/sellersimg/slr7.webp", className: "w-[116px] h-[72px]" }
             ].map((logo, i) => (
               <div key={i} className="flex flex-col justify-center items-center gap-2.5 self-stretch grow px-4">
                 <img 
                   src={logo.src} 
                   className={`object-contain ${logo.className}`} 
                   alt={`Seller Logo ${i+1}`} 
                 />
               </div>
             ))}
             
             {/* Mobile Duplication for Smooth Loop */}
             {[
               { src: "/assets/sellersimg/sellr1.webp", className: "w-[88px] h-[64px]" },
               { src: "/assets/sellersimg/slr2.webp", className: "w-[114px] h-[114px]" },
               { src: "/assets/sellersimg/slr3.webp", className: "w-[104px] h-[46px]" },
               { src: "/assets/sellersimg/slr4.webp", className: "w-[92px] h-[64px]" },
               { src: "/assets/sellersimg/slr5.webp", className: "w-[92px] h-[92px]" },
               { src: "/assets/sellersimg/slr6.webp", className: "w-[130px] h-[56px]" },
               { src: "/assets/sellersimg/slr7.webp", className: "w-[116px] h-[72px]" }
             ].map((logo, i) => (
               <div key={i+"dup"} className="md:hidden flex flex-col justify-center items-center gap-2.5 self-stretch grow px-4">
                 <img 
                   src={logo.src} 
                   className={`object-contain ${logo.className}`} 
                   alt={`Seller Logo ${i+1} dup`} 
                 />
               </div>
             ))}
          </div>
        </div>
      </section>
      
      {/* 5. Doctors Section */}
      <DoctorsSection />

      {/* 6. Gallery Section */}
      <PetGallery img1={prd13} img2={prd17} />

      {/* 7. Testimonials Section */}
      <Testimonials />

      <Footer />
    </div>
  );
};

export default Products;

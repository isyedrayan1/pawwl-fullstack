import { useIsMobile } from "@/hooks/useMediaQuery";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { ArrowUpRight, ArrowRight, Star, Quote, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DoctorsSection from "@/components/DoctorsSection";
import PetGallery from "@/components/PetGallery";
import Testimonials from "@/components/Testimonials";
import SEO from "@/components/SEO";

import { useApiProducts } from "@/hooks/useApiProducts";

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
  const products = (apiProducts ?? []).map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.name,
    subtitle: product.brand ?? product.category,
    category: product.category,
    description: product.description ?? "",
    benefits: parseStringArray(product.benefits),
    ingredients: product.ingredients ?? undefined,
    usage: product.usage ?? "",
    rating: product.rating ?? "0.0",
    reviewCount: product.reviewCount ?? 0,
    images: parseStringArray(product.images).length ? parseStringArray(product.images) : ["/pawwl-logo-main-croped.webp"],
    sizes: Array.isArray(product.variants) ? product.variants.map((variant) => variant.name) : [],
    tag: product.status === "published" ? "Available" : undefined,
  }));
  const isMobile = useIsMobile();

  const hasCatalogError = Boolean(error);
  const hasProducts = products.length > 0;




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
                <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch overflow-hidden">
                  {/* Main Product Card */}
                  <div 
                    className="w-full lg:w-[606px] flex flex-col bg-white rounded-[28px] border border-[#dce6ee] overflow-hidden group shadow-md relative"
                  >
                    <div className="w-full h-[500px] lg:h-full relative overflow-hidden bg-[#e8f0f6]">
                      <img src={products[0].images[0]} loading="lazy" decoding="async" className="w-full h-full object-cover" alt={products[0].title} />
                      <div className="absolute top-8 left-8 flex gap-2">
                        <span className="font-bold text-[11px] text-white bg-[#1b4965] px-4 py-2 rounded-full uppercase tracking-wider border border-white/20 shadow-sm">{products[0].tag || "Premium"}</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/80 to-transparent p-8 md:p-10">
                        <span className="font-bold text-[13px] text-[#5fa8d3] uppercase tracking-widest block mb-1">{products[0].category}</span>
                        <h3 className="font-extrabold text-[32px] md:text-[40px] text-white leading-tight mb-4">{products[0].title}</h3>
                        <div className="flex items-center gap-2 mb-4 text-white/90">
                          <div className="flex items-center gap-1 text-[#fff200]">
                            <Star size={14} fill="currentColor" />
                            <span className="font-bold text-sm text-white">{products[0].rating}</span>
                          </div>
                          <span className="text-xs text-white/70">{products[0].reviewCount} reviews</span>
                        </div>
                        <Link to={`/products/${products[0].id}`} className="inline-flex items-center gap-2 bg-white text-[#134e86] px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform w-fit">
                            View Details
                        </Link>
                      </div>

                      {/* WhatsApp Corner Button */}
                      <a 
                        href={`https://wa.me/917208813649?text=${encodeURIComponent(`Hello! I am interested in ${products[0].title}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-6 right-6 z-30 w-12 h-12 bg-[#134e86] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
                        title="Order on WhatsApp"
                      >
                        <ShoppingBag size={20} />
                      </a>
                    </div>
                  </div>

                  {/* Side Column items */}
                  <div 
                    className="w-full lg:w-[502px] flex flex-col gap-8"
                  >
                    {products.slice(1, 3).map((item, i) => (
                      <div key={i} className="flex-1 bg-white rounded-3xl border-2 border-border-accent overflow-hidden group flex flex-col h-full relative">
                        <div className="p-6 md:p-8 pb-5 flex flex-col gap-1 z-10 bg-white">
                          <span className="font-bold text-[10px] md:text-[11px] leading-none text-[#788796] uppercase tracking-widest">{item.category}</span>
                          <h4 className="font-bold text-[20px] md:text-[22px] text-[#212529] capitalize">{item.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-[#788796] mt-1">
                            <div className="flex items-center gap-1 text-[#fff200]">
                              <Star size={12} fill="currentColor" />
                              <span className="font-bold text-[#212529]">{item.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{item.reviewCount} reviews</span>
                          </div>
                          <Link to={`/products/${item.id}`} className="mt-2 inline-flex items-center gap-1 text-[#1b4965] font-bold text-xs hover:underline">
                            View Details <ArrowUpRight size={12} />
                          </Link>
                        </div>
                        {/* WhatsApp Corner Button */}
                        <a 
                          href={`https://wa.me/917208813649?text=${encodeURIComponent(`Hello! I am interested in ${item.title}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 z-20 w-10 h-10 bg-[#134e86] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                          title={`Order ${item.title} on WhatsApp`}
                        >
                          <ShoppingBag size={18} />
                        </a>
                        <div className="w-full flex-1 min-h-[160px] md:min-h-[180px] bg-[#e8f0f6] relative overflow-hidden">
                          <img src={item.images[0]} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" alt={item.title} />
                          {item.tag && (
                            <span className="absolute top-4 left-6 bg-[#5fa8d3] text-white font-bold text-[11px] px-4 py-1.5 rounded-full z-10 shadow-sm">{item.tag}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row Grids */}
                <div 
                  className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                >
                  {products.slice(3).map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col bg-white rounded-3xl border-2 border-border-accent group overflow-hidden h-auto relative gs-reveal"
                    >
                      <div className="w-full flex flex-col p-6 gap-1 bg-white z-10">
                        <span className="font-bold text-[10px] text-[#788796] uppercase tracking-widest">{item.category}</span>
                        <div className="flex flex-col gap-1">
                          <h4 className="font-bold text-[18px] text-[#212529] line-clamp-1">{item.title}</h4>
                          <div className="flex items-center gap-2 text-[11px] text-[#788796]">
                            <div className="flex items-center gap-1 text-[#fff200]">
                              <Star size={11} fill="currentColor" />
                              <span className="font-bold text-[#212529]">{item.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{item.reviewCount} reviews</span>
                          </div>
                          <Link to={`/products/${item.id}`} className="inline-flex items-center gap-1 text-[#1b4965] font-bold text-xs hover:underline">
                            View Details <ArrowUpRight size={12} />
                          </Link>
                        </div>
                      </div>
                      {/* WhatsApp Corner Button */}
                      <a 
                        href={`https://wa.me/917208813649?text=${encodeURIComponent(`Hello! I am interested in ${item.title}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-4 right-4 z-20 w-9 h-9 bg-[#134e86] text-white rounded-full flex items-center justify-center shadow-md cursor-pointer"
                          title={`Order ${item.title} on WhatsApp`}
                      >
                        <ShoppingBag size={16} />
                      </a>
                      <div className="flex-1 w-full bg-[#f4f7f9] relative overflow-hidden min-h-[200px]">
                        <img src={item.images[0]} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" alt={item.title} />
                        {item.tag && (
                          <div className="absolute top-4 left-4 bg-[#1b4965] px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                            <span className="font-bold text-[10px] text-white uppercase tracking-wider">{item.tag}</span>
                          </div>
                        )}
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

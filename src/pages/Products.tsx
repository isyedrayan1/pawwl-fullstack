import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { ArrowUpRight, ArrowRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DoctorsSection from "@/components/DoctorsSection";
import Testimonials from "@/components/Testimonials";

const Products = () => {
  return (
    <div className="min-h-screen bg-[#fffaef]">
      <Navbar />

      {/* 1. Hero Bento Section */}
      <section className="bg-white pt-4 md:pt-8 pb-12">
        <div className="section-container">
          <div className="w-full flex flex-col gap-9">
            
            {/* Top Wide Banner */}
            <div className="w-full max-w-[1114px] h-[320px] sm:h-[420px] md:h-[496px] bg-[#4a72ae] rounded-[28px] relative overflow-hidden flex items-center justify-center mx-auto group shadow-2xl">
               <img src="/assets/images/productsheroimg.webp" className="absolute inset-0 w-full h-full object-cover z-20" alt="Products Banner" />
               <PawwlWatermark 
                 className="relative z-10 w-[90%] md:w-[1000px] h-auto text-white drop-shadow-2xl" 
                 opacity={1}
               />
            </div>

            {/* Bottom Split Row (Bento Grid) */}
            <div className="w-full max-w-[1114px] mx-auto flex flex-col lg:flex-row gap-9">
               {/* Left Large Card */}
               <div className="w-full lg:w-[604px] h-[300px] sm:h-[400px] md:h-[900px] bg-[#bbedf4] rounded-3xl relative overflow-hidden group shadow-lg">
                  <img src="/assets/productspage/prdheroimg1.webp" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Pet Model" />
               </div>

               {/* Right Stacked Cards */}
               <div className="w-full lg:w-[474px] flex flex-col gap-[34px]">
                  {/* Top: 20% Off */}
                  <div className="w-full h-[300px] md:h-[433px] bg-[#c8e9fa] rounded-3xl relative overflow-hidden group shadow-md flex items-center justify-center p-8">
                     <img src="/assets/productspage/prdhrimg2.webp" className="absolute inset-0 w-full h-full object-cover transition-all duration-700" alt="Discount" />
                  </div>

                  {/* Bottom: Shop Quality Supplies */}
                  <div className="w-full h-[300px] md:h-[433px] bg-[#1e4b66] rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group shadow-md">
                     <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#00b1e0_1px,_transparent_1px)]" style={{backgroundSize: '24px 24px'}}></div>
                     <span className="relative z-10 font-heading font-black text-[50px] md:text-[80px] lg:text-[100px] leading-tight md:leading-[122.85px] text-[#00b1e0] tracking-tighter transform group-hover:scale-[1.02] transition-transform duration-500">
                       Shop<br/>Quality<br/>Supplies
                     </span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Row */}
      <section className="w-full flex justify-center bg-white py-[40px] border-t border-[#dce6ee]">
        <div className="w-full max-w-[1440px] px-6 md:px-12 lg:px-40 flex justify-center">
          <div className="w-full max-w-[1140px] flex gap-4 md:gap-6 justify-between overflow-x-auto pb-4 no-scrollbar items-center">
            {[
              { title: "Food bowls", count: "12 Products", img: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=150&h=150&fit=crop" },
              { title: "Pet Toys", count: "34 Products", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=150&fit=crop" },
              { title: "Pet supplies", count: "28 Products", img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=150&h=150&fit=crop" },
              { title: "Clothing", count: "16 Products", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=150&h=150&fit=crop" },
              { title: "Foods", count: "43 Products", img: "https://images.unsplash.com/photo-1583336663277-620dc1996580?w=150&h=150&fit=crop" },
              { title: "Pet Beds", count: "22 Products", img: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=150&h=150&fit=crop" }
            ].map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-4 min-w-[120px] md:min-w-[140px] group cursor-pointer">
                <div className="w-[100px] md:w-[140px] h-[100px] md:h-[140px] rounded-full overflow-hidden bg-[#e8f0f6] border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:border-[#5fa8d3] transition-all duration-300 transform group-hover:-translate-y-1">
                  <img src={cat.img} className="w-full h-full object-cover" alt={cat.title} />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="font-bold text-[14px] md:text-[16px] leading-tight text-[#242424] group-hover:text-[#1b4965] decoration-2 underline-offset-4 group-hover:underline capitalize transition-colors">
                    {cat.title}
                  </span>
                  <span className="font-medium text-[12px] md:text-[13px] text-[#788796]">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Premium Products Section */}
      <section className="w-full flex justify-center bg-[#fdfbf6] px-6 md:px-12 lg:px-40 py-16 lg:py-24 border-t border-[#dce6ee]">
        <div className="w-full max-w-[1440px] flex flex-col items-center gap-12">
          
          <div className="flex flex-col items-center gap-4 text-center max-w-3xl">
            <h2 className="font-extrabold text-[36px] md:text-[51.4px] leading-tight text-[#134e86]">
              Pamper Your Pet with Our Premium Products
            </h2>
            <p className="font-normal text-[18px] md:text-[20px] leading-relaxed text-[#134e86]/80">
              Pamper your pet with our premium products designed for comfort and style. From cozy bedding to durable toys, we offer everything your furry friend needs to feel loved and cared for.
            </p>
          </div>

          <div className="w-full max-w-[1144px] flex flex-col gap-8">
            <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Main Product Card */}
              <div className="w-full lg:w-[606px] flex flex-col bg-white rounded-[28px] border border-[#dce6ee] overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500 relative">
                <div className="w-full h-[500px] lg:h-full relative overflow-hidden bg-[#e8f0f6]">
                  <img src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Premium Kibble" />
                  <div className="absolute top-8 left-8 flex gap-2">
                    <span className="font-bold text-[11px] text-white bg-[#1b4965] px-4 py-2 rounded-full uppercase tracking-wider border border-white/20 shadow-sm">Best Seller</span>
                    <span className="font-bold text-[11px] text-white bg-[#5fa8d3] px-4 py-2 rounded-full uppercase tracking-wider border border-white/20 shadow-sm">Editor's Pick</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/80 to-transparent p-8 md:p-10">
                    <span className="font-bold text-[13px] text-[#5fa8d3] uppercase tracking-widest block mb-2">In-house Nutrition</span>
                    <h3 className="font-extrabold text-[32px] md:text-[40px] text-white leading-tight mb-3">Pawwl Premium Kibble</h3>
                    <div className="flex items-end gap-3 text-white">
                      <span className="font-black text-[32px] md:text-[40px] leading-none">$34.99</span>
                      <span className="font-medium text-lg opacity-50 line-through mb-1">$42.99</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Column items */}
              <div className="w-full lg:w-[502px] flex flex-col gap-8">
                {[
                  { category: "Accessories", title: "Comfort Collar Set", price: "$19.99", tag: "New", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&fit=crop" },
                  { category: "Pawwl Select Product", title: "Pawwl Food Bowl for pets", price: "$22.99", img: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&fit=crop" }
                ].map((item, i) => (
                  <div key={i} className="flex-1 bg-white rounded-3xl border-2 border-border-accent overflow-hidden group hover:border-brand-blue/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div className="p-6 md:p-8 pb-5 flex flex-col gap-1 z-10 bg-white">
                      <span className="font-bold text-[10px] md:text-[11px] leading-none text-[#788796] uppercase tracking-widest">{item.category}</span>
                      <h4 className="font-bold text-[20px] md:text-[22px] text-[#212529] capitalize">{item.title}</h4>
                      <span className="font-black text-[22px] md:text-[24px] text-[#1b4965] mt-1">{item.price}</span>
                    </div>
                    <div className="w-full flex-1 min-h-[160px] md:min-h-[180px] bg-[#e8f0f6] relative overflow-hidden">
                      <img src={item.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.title} />
                      {item.tag && (
                        <span className="absolute top-4 left-6 bg-[#5fa8d3] text-white font-bold text-[11px] px-4 py-1.5 rounded-full z-10 shadow-sm">{item.tag}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row Grids */}
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { category: "In-house Food", title: "Pawwl Premium Kibble", price: "$34.99", old: "$42.99", img: "https://images.unsplash.com/photo-1583336663277-620dc1996580?w=400&fit=crop" },
                { category: "Accessories", title: "Comfort Leather Collar", price: "$19.99", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&fit=crop" },
                { category: "Grooming", title: "Pro Grooming Kit", price: "$49.99", old: "$59.99", tag: "Featured", img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&fit=crop" },
                { category: "Health & Supplements", title: "Vitality Supplement Pack", price: "$29.99", tag: "Popular", img: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=400&fit=crop" }
              ].map((item, i) => (
                <Link to="/products/1" key={i} className="flex flex-col bg-white rounded-3xl border-2 border-border-accent group hover:border-brand-blue/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden h-[400px]">
                  <div className="w-full flex flex-col p-6 gap-1 bg-white z-10">
                    <span className="font-bold text-[10px] text-[#788796] uppercase tracking-widest">{item.category}</span>
                    <h4 className="font-bold text-[18px] text-[#212529] line-clamp-1">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-black text-[22px] text-[#1b4965]">{item.price}</span>
                      {item.old && <span className="font-medium text-sm line-through text-[#788796]">{item.old}</span>}
                    </div>
                  </div>
                  <div className="flex-1 w-full bg-[#f4f7f9] relative overflow-hidden">
                    <img src={item.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply" alt={item.title} />
                    {item.tag && (
                      <div className="absolute top-4 left-4 bg-[#1b4965] px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                        <span className="font-bold text-[10px] text-white uppercase tracking-wider">{item.tag}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Partner Sellers Section */}
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
               { src: "/assets/sellersimg/sellr1.webp", w: "88px", h: "64px" },
               { src: "/assets/sellersimg/slr2.webp", w: "114px", h: "114px" },
               { src: "/assets/sellersimg/slr3.webp", w: "104px", h: "46px" },
               { src: "/assets/sellersimg/slr4.webp", w: "92px", h: "64px" },
               { src: "/assets/sellersimg/slr5.webp", w: "92px", h: "92px" },
               { src: "/assets/sellersimg/slr6.webp", w: "130px", h: "56px" },
               { src: "/assets/sellersimg/slr7.webp", w: "116px", h: "72px" }
             ].map((logo, i) => (
               <div key={i} className="flex flex-col justify-center items-center gap-2.5 self-stretch grow px-4">
                 <img 
                   src={logo.src} 
                   className="object-contain" 
                   style={{ width: logo.w, height: logo.h }}
                   alt={`Seller Logo ${i+1}`} 
                 />
               </div>
             ))}
             
             {/* Mobile Duplication for Smooth Loop */}
             {[
               { src: "/assets/sellersimg/sellr1.webp", w: "88px", h: "64px" },
               { src: "/assets/sellersimg/slr2.webp", w: "114px", h: "114px" },
               { src: "/assets/sellersimg/slr3.webp", w: "104px", h: "46px" },
               { src: "/assets/sellersimg/slr4.webp", w: "92px", h: "64px" },
               { src: "/assets/sellersimg/slr5.webp", w: "92px", h: "92px" },
               { src: "/assets/sellersimg/slr6.webp", w: "130px", h: "56px" },
               { src: "/assets/sellersimg/slr7.webp", w: "116px", h: "72px" }
             ].map((logo, i) => (
               <div key={i+"dup"} className="md:hidden flex flex-col justify-center items-center gap-2.5 self-stretch grow px-4">
                 <img 
                   src={logo.src} 
                   className="object-contain" 
                   style={{ width: logo.w, height: logo.h }}
                   alt={`Seller Logo ${i+1} dup`} 
                 />
               </div>
             ))}
          </div>
        </div>
      </section>
      
      {/* 5. Doctors Section */}
      <DoctorsSection />

      {/* 6. Testimonials Section */}
      <Testimonials />

      <Footer />
    </div>
  );
};

export default Products;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { ChevronRight, Star, Plus, Minus, ShieldCheck, HeartPulse, Truck, CheckCircle2, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("15 lb");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 1. Breadcrumbs */}
      <div className="w-full flex justify-center pt-4 md:pt-8 pb-4 bg-white">
        <div className="w-full max-w-[1114px] px-6 lg:px-0 flex items-center gap-3">
          <span className="font-medium text-xs text-[#b1b1b1] cursor-pointer hover:underline uppercase tracking-wider">Home</span>
          <ChevronRight size={12} className="text-[#b1b1b1]" />
          <span className="font-medium text-xs text-[#b1b1b1] cursor-pointer hover:underline uppercase tracking-wider">Dry Food</span>
          <ChevronRight size={12} className="text-[#b1b1b1]" />
          <span className="font-medium text-xs text-[#191919] uppercase tracking-wider">Premium Dog Kibble</span>
        </div>
      </div>

      {/* 2. Main Product Info */}
      <div className="w-full flex justify-center bg-white pb-20">
        <div className="w-full max-w-[1114px] px-6 lg:px-0 flex flex-col lg:flex-row gap-12 lg:gap-14">
          
          {/* Left: Product Images */}
          <div className="w-full lg:w-[500px] flex flex-col gap-4">
            <div className="w-full aspect-square rounded-2xl border border-[#f0f0f0] bg-white relative overflow-hidden flex items-center justify-center p-1">
              <img src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&fit=crop" className="w-full h-full object-cover rounded-xl" alt="Premium Nutrition" />
              <div className="absolute top-4 left-4 bg-[#0071f3] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-sm">
                Best Seller
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 h-[100px]">
              <div className="w-full h-full rounded-xl border-[1.5px] border-[#0071f3] p-1 cursor-pointer bg-white">
                <img src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&fit=crop" className="w-full h-full object-cover rounded-lg" alt="Thumb" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-full rounded-xl border border-[#f0f0f0] p-1 cursor-pointer hover:border-[#b1b1b1] transition-colors bg-white">
                  <img src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&fit=crop" className="w-full h-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity" alt="Thumb" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex-1 flex flex-col pt-2">
            <span className="text-[#0071f3] font-bold text-[11px] tracking-widest uppercase underline mb-3">Pawwl In-house Nutrition</span>
            <h1 className="text-[38px] md:text-[44px] font-extrabold leading-tight text-[#191919] mb-4">
              Premium Dog Kibble
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={15} fill="#fff200" className="text-[#fff200]" />
                ))}
              </div>
              <span className="font-bold text-[13px] text-[#191919]">4.8</span>
              <span className="text-[#555555] text-[13px]">(260 reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-4 mb-5">
              <span className="font-extrabold text-[32px] text-[#191919] tracking-tight">$49.99</span>
              <span className="text-lg font-medium text-[#b1b1b1] line-through">$59.99</span>
              <span className="bg-[#17b170] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">Save 17%</span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#17b170]" />
              <span className="font-bold text-[#17b170] text-xs uppercase tracking-wide">In Stock</span>
              <span className="text-[#555555] text-xs">— Ships within 1-2 business days</span>
            </div>

            {/* Size Selector */}
            <div className="flex flex-col gap-3 mb-10">
              <span className="font-bold text-[#191919] text-sm">Size</span>
              <div className="flex gap-3">
                {["5 lb", "15 lb", "30 lb"].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[70px] h-10 rounded-lg border text-sm font-semibold transition-all ${
                      selectedSize === size 
                        ? 'border-[#0071f3] bg-[#0071f3] text-white shadow-sm' 
                        : 'border-[#f0f0f0] text-[#555555] hover:border-[#b1b1b1] bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 h-[52px]">
              <div className="flex items-center justify-between border border-[#f0f0f0] rounded-xl h-full w-full sm:w-[130px] bg-white shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center text-[#191919] hover:bg-[#f8f8f8] rounded-l-xl transition-colors">
                  <Minus size={18} />
                </button>
                <div className="flex-1 h-full border-x border-[#f0f0f0] flex items-center justify-center">
                  <span className="font-bold text-base text-[#191919] select-none">{quantity}</span>
                </div>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center text-[#191919] hover:bg-[#f8f8f8] rounded-r-xl transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              
              <button className="flex-1 h-full bg-[#0071f3] hover:bg-[#005bb5] transition-colors rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-[#0071f3]/20">
                 <span className="font-bold text-sm text-white uppercase tracking-wider">Add to Cart</span>
              </button>
              
              <button className="w-[52px] h-full flex justify-center items-center rounded-xl border border-[#f0f0f0] hover:bg-[#f8f8f8] text-[#191919] bg-white shadow-sm transition-colors">
                 <HeartPulse size={22} />
              </button>
            </div>

            {/* Feature Points */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-[#f0f0f0]">
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-[#555555]" />
                <span className="font-semibold text-xs text-[#555555] uppercase tracking-wide">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#555555]" />
                <span className="font-semibold text-xs text-[#555555] uppercase tracking-wide">30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#555555]" />
                <span className="font-semibold text-xs text-[#555555] uppercase tracking-wide">Vet Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Product Description Block */}
      {/* Background is an extremely faint blue to match Figma 4% opacity over white */}
      <div className="w-full flex justify-center bg-[#f4f8fe] py-20 border-y border-[#dce6ee] relative overflow-hidden">
        {/* Subtle decorative circles as seen in original image right side */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-[0.03]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#0071f3" strokeWidth="2" strokeDasharray="10 10"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="#0071f3" strokeWidth="2" strokeDasharray="10 10"/>
          </svg>
        </div>

        <div className="w-full max-w-[1114px] px-6 lg:px-0 relative z-10 flex">
          <div className="flex flex-col w-full lg:w-[650px] gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-extrabold text-[22px] text-[#191919]">Product Description</span>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-bold text-[15px] text-[#191919]">Key Benefits</span>
                <p className="font-normal text-[14px] leading-relaxed text-[#555555]">
                  Pawwl Premium Dog Kibble is made with real chicken as the first ingredient, blended with wholesome grains, vegetables and essential vitamins. Designed to support healthy digestion, strong joints and a shiny coat — complete and balanced nutrition for adult dogs of all breeds.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-bold text-[15px] text-[#191919]">Ingredients</span>
                <p className="font-normal text-[14px] leading-relaxed text-[#555555]">
                  Real deboned chicken, brown rice, sweet potato, chicken meal, peas, flaxseed, blueberries, spinach, pumpkin, salmon oil, coconut oil, turmeric, probiotics (Lactobacillus acidophilus), vitamins A, D3, E, B12, zinc, iron, calcium.
                </p>
              </div>
              <div className="flex flex-col gap-2 relative pb-8">
                <span className="font-bold text-[15px] text-[#191919]">Usage Instructions</span>
                <p className="font-normal text-[14px] leading-relaxed text-[#555555]">
                  Feed according to your dog's weight and activity level. For puppies, feed 3-4 times daily. For adult dogs, feed twice daily. When transitioning from another food, gradually mix over 7-10 days. Always provide fresh, clean water. Store in a cool, dry place.
                </p>
                <div className="absolute bottom-0 left-0">
                   <button className="font-bold text-[13px] text-[#0071f3] hover:underline flex items-center gap-1">Read More <ChevronDown size={14}/></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Why Pet Parents Love It */}
      <div className="w-full flex justify-center bg-white py-24">
        <div className="w-full max-w-[1114px] px-6 lg:px-0 flex flex-col items-center gap-14">
          <div className="flex flex-col items-center gap-4 text-center max-w-[800px]">
            <h2 className="font-black text-[42px] tracking-tight text-[#012169]">Why Pet Parents Love It?</h2>
            <p className="font-medium text-[18px] text-[#134e86] leading-relaxed max-w-[600px]">
              Jump straight to the support you need. Our Specialised teams are ready to assist.
            </p>
          </div>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { icon: <CheckCircle2 size={24} className="text-[#0071f3]"/>, title: "Vet Approved", desc: "Recommended by veterinary professionals" },
               { icon: <HeartPulse size={24} className="text-[#0071f3]"/>, title: "Natural Ingredients", desc: "100% natural, no artificial additives" },
               { icon: <ShieldCheck size={24} className="text-[#0071f3]"/>, title: "All Breeds & Ages", desc: "Suitable for puppies to senior dogs" },
               { icon: <Truck size={24} className="text-[#0071f3]"/>, title: "Free Shipping", desc: "Free delivery on orders over $35" }
             ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center bg-white p-8 rounded-2xl border border-[#f0f0f0] gap-4 shadow-sm hover:shadow-md transition-all hover:border-[#0071f3]/30">
                  <div className="w-[60px] h-[60px] flex justify-center items-center bg-[#f4f8fe] rounded-full mb-2">
                    {feature.icon}
                  </div>
                  <span className="font-extrabold text-[16px] text-center text-[#191919]">{feature.title}</span>
                  <span className="font-medium text-[13px] text-center text-[#555555] leading-relaxed px-2">{feature.desc}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* 5. Customer Reviews (Extremely faint blue bg mapping to opacity 0.04 over white) */}
      <div className="w-full flex justify-center bg-[#f8fbff] py-24 border-y border-[#f0f0f0]">
        <div className="w-full max-w-[1114px] px-6 lg:px-0 flex flex-col lg:flex-row gap-16 justify-between items-start">
          
          <div className="flex flex-col gap-6 w-full lg:w-[350px]">
            <span className="font-extrabold text-[24px] text-[#191919]">Customer Reviews</span>
            <div className="flex flex-col bg-white p-8 rounded-3xl border border-[#f0f0f0] gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                 <span className="font-black text-[56px] leading-none text-[#191919]">4.8</span>
                 <div className="flex flex-col gap-1.5">
                   <div className="flex gap-1">
                     {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#fff200" className="text-[#fff200]" />)}
                   </div>
                   <span className="font-medium text-[12px] text-[#b1b1b1]">Based on 260 reviews</span>
                 </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-2">
                {[
                  { stars: "5★", percent: "72%", w: "w-[72%]" },
                  { stars: "4★", percent: "18%", w: "w-[18%]" },
                  { stars: "3★", percent: "6%", w: "w-[6%]" },
                  { stars: "2★", percent: "2%", w: "w-[2%]" },
                  { stars: "1★", percent: "1%", w: "w-[1%]" }
                ].map((bar, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-bold text-[12px] text-right text-[#191919] w-6">{bar.stars}</span>
                    <span className="font-medium text-[12px] text-[#b1b1b1] w-8">{bar.percent}</span>
                    <div className="flex-1 h-[6px] bg-[#f0f0f0] rounded-full overflow-hidden">
                      <div className={`h-full bg-[#0071f3] ${bar.w} rounded-full`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full lg:flex-1">
            <div className="flex justify-between items-center h-[28px]">
              <span className="font-bold text-[13px] text-[#555555]">Showing 4 reviews</span>
              <div className="flex items-center bg-white px-4 py-2 rounded-xl border border-[#f0f0f0] gap-3 cursor-pointer shadow-sm">
                <span className="font-bold text-[13px] text-[#191919]">Most Helpful</span>
                <ChevronDown size={14} className="text-[#191919] opacity-60"/>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {[
                { initial: "D", name: "David L.", date: "Dec 20, 2025", text: "Switched from a supermarket brand and the difference is night and day. My corgi's energy levels have improved and the vet said his bloodwork looks much better.", helpful: 31 },
                { initial: "S", name: "Sarah M.", date: "Feb 15, 2026", text: "My golden retriever absolutely loves this food! His coat has never looked shinier and he has so much more energy. Switching to Pawwl was the best decision I made for Max.", helpful: 24, hasImg: true },
                { initial: "E", name: "Emily R.", date: "Jan 10, 2026", text: "We've tried so many brands and this is the only one our picky eater actually finishes! The ingredient quality is outstanding and I love that it's vet-approved.", helpful: 18, hasImg: true },
                { initial: "J", name: "James K.", date: "Jan 28, 2026", text: "Great quality food with visible improvements in my dog's digestion. The only reason I'm not giving 5 stars is the packaging could be more eco-friendly. But the food itself is excellent.", helpful: 12 }
              ].map((review, i) => (
                 <div key={i} className="flex flex-col bg-white p-7 rounded-3xl border border-[#f0f0f0] gap-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 flex justify-center items-center bg-[#f4f8fe] rounded-full">
                           <span className="font-black text-[18px] text-[#0071f3]">{review.initial}</span>
                         </div>
                         <div className="flex flex-col gap-0.5">
                           <span className="font-extrabold text-[15px] text-[#191919]">{review.name}</span>
                           <span className="font-medium text-[12px] text-[#b1b1b1]">{review.date}</span>
                         </div>
                      </div>
                      <div className="flex gap-1 pt-2">
                        {[1, 2, 3, 4, 5].map(j => <Star key={j} size={14} fill="#fff200" className="text-[#fff200]" />)}
                      </div>
                    </div>
                    
                    <p className="font-medium text-[14px] leading-[1.8] text-[#555555] pt-2">
                      {review.text}
                    </p>
                    
                    {review.hasImg && (
                      <div className="flex gap-3 pt-2">
                         <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#f0f0f0]">
                           <img src="https://images.unsplash.com/photo-1583336663277-620dc1996580?w=200&fit=crop" className="w-full h-full object-cover mix-blend-multiply" alt="Review Image" />
                         </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                       <button className="font-bold text-[12px] text-[#0071f3] border-b border-[#0071f3] pb-0.5 hover:opacity-70 transition-opacity flex items-center gap-2">
                         Helpful ({review.helpful})
                       </button>
                    </div>
                 </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. You Might Also Like */}
      <div className="w-full flex justify-center bg-white py-24 pb-32">
        <div className="w-full max-w-[1114px] px-6 lg:px-0 flex flex-col gap-10">
          <span className="font-extrabold text-[24px] text-[#191919]">You Might Also Like</span>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Chicken Jerky Sticks", img: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=400&fit=crop", price: "$18.99", rating: "4.7" },
              { title: "Cozy Pet Bed", img: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&fit=crop", price: "$64.99", rating: "4.9" },
              { title: "Comfort Collar & Leash", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&fit=crop", price: "$34.99", rating: "4.6" },
              { title: "Dental Chew Sticks", img: "https://images.unsplash.com/photo-1626391911357-19aa48d68994?w=400&fit=crop", price: "$22.99", rating: "4.8" }
            ].map((item, i) => (
               <Link to="/products/1" key={i} className="flex flex-col bg-white rounded-3xl border border-[#f0f0f0] overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] group">
                 <div className="w-full aspect-[4/3] bg-[#f4f7f9] relative overflow-hidden p-2">
                   <img src={item.img} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700" alt={item.title}/>
                 </div>
                 <div className="flex flex-col p-6 gap-3">
                   <span className="font-extrabold text-[15px] text-[#191919]">{item.title}</span>
                   <div className="flex items-center gap-2">
                     <div className="flex gap-0.5">
                       {[1, 2, 3, 4, 5].map(j => <Star key={j} size={12} fill="#fff200" className="text-[#fff200]" />)}
                     </div>
                     <span className="font-bold text-[12px] text-[#a0a0a0]">{item.rating}</span>
                   </div>
                   <div className="flex justify-between items-end mt-4">
                     <span className="font-black text-[20px] text-[#191919]">{item.price}</span>
                     <div className="w-10 h-10 flex justify-center items-center bg-[#0071f3] rounded-xl group-hover:bg-[#005bb5] transition-colors shadow-lg shadow-[#0071f3]/20">
                       <Plus size={20} strokeWidth={3} className="text-white"/>
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

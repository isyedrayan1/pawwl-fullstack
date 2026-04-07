import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { ArrowUpRight, Star, Quote, Mail, GraduationCap, Heart, Scissors, Bath, Ruler, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorsSection from "@/components/DoctorsSection";

const Services = () => {
  return (
    <div className="min-h-screen bg-[#fffaef]">
      <Navbar />

      {/* 1. Precise Hero Section from Figma */}
      <section className="bg-white pt-4 md:pt-8 pb-12">
        <div className="section-container">
          <div className="w-full flex flex-wrap gap-x-6 gap-y-9">
            
            {/* Banner Container */}
            <div className="w-full h-[320px] sm:h-[420px] md:h-[496px] rounded-2xl relative overflow-hidden flex items-center justify-center group shadow-2xl">
              {/* Background Image */}
              <img 
                src="/assets/images/serviceheroimg.webp" 
                alt="Services Banner" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay Content (Black box from snippet) */}
              <div className="absolute inset-0 flex justify-between items-center bg-black/10 px-[100px] py-[19px] rounded-2xl group-hover:bg-black/20 transition-colors">
                {/* This mimics the black div in snippet, but made it transparent for better look */}
              </div>

              {/* Massive Pawwl Text */}
              <PawwlWatermark 
                className="absolute w-[90%] sm:w-[95%] md:w-[1000px] h-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 text-white" 
                opacity={1.0}
              />
            </div>

            {/* Service Grid - Precise Alignment from Figma */}
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-9">
              {[
                { 
                  icon: <Bath className="w-8 h-8" />, 
                  title: "Bath & Wash", 
                  desc: "Gentle shampoo and conditioning to keep coats clean, soft, and fresh." 
                },
                { 
                  icon: <Scissors className="w-8 h-8" />, 
                  title: "Haircut & Styling", 
                  desc: "Breed-specific or custom grooming styles tailored to your pet’s needs." 
                },
                { 
                  icon: <Heart className="w-8 h-8" />, 
                  title: "Nail Trimming", 
                  desc: "Safe nail care to protect paws and ensure comfortable movement." 
                },
                { 
                  icon: <PlusIcon className="w-8 h-8" />, 
                  title: "Ear Cleaning", 
                  desc: "Careful ear cleaning to reduce buildup and help prevent infections." 
                },
                { 
                  icon: <GraduationCap className="w-8 h-8" />, 
                  title: "Teeth Cleaning", 
                  desc: "Basic dental care for fresher breath and better oral hygiene." 
                },
                { 
                  icon: <Stethoscope className="w-8 h-8" />, 
                  title: "Treatment", 
                  desc: "Reduce shedding and maintain a smooth, healthy coat." 
                }
              ].map((service, i) => (
                <div key={i} className="flex gap-2 bg-[#D8FAFF] p-2 rounded-2xl sm:rounded-3xl w-full min-h-[120px] sm:min-h-[160px] transition-all hover:-translate-y-1 hover:shadow-xl group">
                  <div className="w-full flex flex-col gap-2 p-3">
                    <div className="text-brand-accent">
                      {service.icon}
                    </div>
                    <span className="font-bold text-[20px] leading-[24px] text-[#241f1b]">
                      {service.title}
                    </span>
                    <span className="font-normal text-[16px] leading-[24px] text-[#534d49]">
                      {service.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Premium Products Showcase - High Fidelity Layout */}
      <div className="w-full bg-white flex flex-col items-center gap-8 px-4 md:px-12 lg:px-40 py-12">
        <div className="flex flex-col items-center gap-3 self-stretch">
          <h2 className="font-heading font-black text-[32px] md:text-[51.4px] leading-tight md:leading-[58.8px] text-center text-brand-dark">
            Pamper Your Pet with Our Premium Products
          </h2>
          <p className="font-normal text-[18px] md:text-[20px] leading-[24px] text-center text-brand-dark/80 max-w-4xl mx-auto">
            Pamper your pet with our premium products designed for comfort and style. From cozy bedding to durable toys, we offer your furry friend needs to feel loved and cared for.
          </p>
        </div>

        <div className="w-full max-w-[1144px] flex flex-col items-center gap-6">
          {/* Main Bento Grid */}
          <div className="flex flex-col lg:flex-row justify-center items-start gap-8 self-stretch">
            
            {/* Featured Product Card */}
            <div className="w-full lg:w-[606px] h-[728px] bg-white p-px rounded-[28px] border border-solid border-[#dce6ee] overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 relative">
              <div className="absolute inset-0 bg-black/10 opacity-10 group-hover:opacity-20 transition-opacity z-10" />
              <img 
                src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=1200&fit=crop" 
                className="w-full h-[726px] object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt="Premium Kibble" 
              />
              
              {/* Badges */}
              <div className="absolute top-8 left-8 flex gap-2 z-20">
                <div className="flex justify-center items-center gap-1 bg-[#1b4965] px-4 py-1.5 rounded-full border border-solid border-black shadow-lg">
                  <span className="font-semibold text-xs text-white">Best Seller</span>
                </div>
                <div className="flex justify-center items-center gap-1 bg-[#5fa8d3] px-4 py-1.5 rounded-full border border-solid border-black shadow-lg">
                  <span className="font-semibold text-xs text-white">Editor's Pick</span>
                </div>
              </div>

              {/* Info Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-[222px] bg-gradient-to-t from-black via-black/80 to-transparent p-12 flex flex-col justify-end text-white z-20">
                <span className="font-medium text-[12px] leading-[18px] mb-1 opacity-80 uppercase tracking-widest">In-house Nutrition</span>
                <h3 className="font-black text-[28px] md:text-[36px] leading-tight mb-4">Pawwl Premium Kibble</h3>
                <div className="flex items-center gap-3">
                  <span className="font-black text-[32px] md:text-[36px]">$34.99</span>
                  <span className="font-normal text-base line-through opacity-50">$42.99</span>
                </div>
              </div>
            </div>

            {/* Side Column */}
            <div className="w-full lg:w-[502px] flex flex-col gap-5">
              {[
                { 
                  category: "Accessories", 
                  title: "Comfort Collar Set", 
                  price: "$19.99", 
                  tag: "New",
                  img: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=400&fit=crop"
                },
                { 
                  category: "Health", 
                  title: "Joint Care Chews", 
                  price: "$22.99",
                  tag: "Featured",
                  img: "https://images.unsplash.com/photo-1626391911357-19aa48d68994?w=600&h=400&fit=crop"
                }
              ].map((item, i) => (
                <div key={i} className="self-stretch h-[354px] bg-white p-px rounded-3xl border border-solid border-[#dce6ee] overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="h-[124px] w-full flex flex-col gap-1 px-5 pt-5 pb-4">
                    <span className="font-medium text-[12px] leading-[18px] text-[#788796] uppercase tracking-widest">{item.category}</span>
                    <span className="font-semibold text-base text-[#212529]">{item.title}</span>
                    <span className="font-black text-[20px] leading-[30px] text-brand-blue">{item.price}</span>
                  </div>
                  <div className="w-full h-[230px] bg-[#e8f0f6] relative overflow-hidden">
                    <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                    {item.tag && (
                      <div className="absolute top-4 left-4 flex justify-center items-center gap-1 bg-[#5fa8d3] px-3 py-1 rounded-full border border-solid border-black">
                        <span className="font-medium text-xs text-white uppercase">{item.tag}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid Row (8 Columns) */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { category: "In-house Food", title: "Pawwl Premium Kibble", price: "$34.99", old: "$42.99", tag: "Featured", img: "https://images.unsplash.com/photo-1583336663277-620dc1996580?w=300&h=300&fit=crop" },
              { category: "Accessories", title: "Comfort Leather Collar", price: "$19.99", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop" },
              { category: "Grooming", title: "Pro Grooming Kit", price: "$49.99", old: "$59.99", tag: "Featured", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop" },
              { category: "Health & Supplements", title: "Vitality Supplement Pack", price: "$29.99", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop" },
              { category: "In-house Food", title: "Organic Wet Food Mix", price: "$24.99", old: "$29.99", tag: "Featured", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop" },
              { category: "Accessories", title: "Adventure Harness Set", price: "$27.99", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop" },
              { category: "Grooming", title: "Gentle Shampoo 500ml", price: "$14.99", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop" },
              { category: "Health & Supplements", title: "Joint Care Chews", price: "$22.99", old: "$27.99", tag: "Featured", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=300&fit=crop" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-px rounded-3xl border border-solid border-[#dce6ee] group hover:shadow-xl transition-all duration-300">
                <div className="w-full p-6 flex flex-col gap-1">
                  <span className="font-medium text-[12px] text-[#788796] uppercase tracking-widest">{item.category}</span>
                  <h4 className="font-semibold text-base text-[#212529] line-clamp-1">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[20px] text-brand-blue">{item.price}</span>
                    {item.old && <span className="font-normal text-[14px] line-through text-[#788796]">{item.old}</span>}
                  </div>
                </div>
                <div className="w-full aspect-square bg-[#e8f0f6] relative overflow-hidden">
                  <img src={item.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.title} />
                  {item.tag && (
                    <div className="absolute top-2 left-2 bg-[#1b4965] px-2 py-0.5 rounded-full border border-solid border-black">
                      <span className="font-medium text-[10px] text-white uppercase">{item.tag}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Doctors Section */}
      <DoctorsSection />

      <section className="bg-white px-4 md:px-12 lg:px-40 py-12 flex flex-col items-center">
        <div className="w-full max-w-[1144px] flex flex-col items-center gap-8">
          <div className="w-full max-w-[900px] flex flex-col items-center gap-3">
            <h2 className="font-heading font-black text-[48px] text-center text-[#012169] leading-tight">
              Whiskers, Tails, and Joyful Eyes<br />A Gallery Full of Love
            </h2>
            <p className="font-normal text-[20px] leading-[24px] text-center text-[#134e86] opacity-80 max-w-3xl">
              Step into a world of heartwarming moments captured in every frame. From wagging tails to joyful eyes, our gallery showcases the love and every companion feel special.”
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full">
            {/* Left Image */}
            <div className="lg:col-span-5 h-[300px] sm:h-[400px] lg:h-[727px] rounded-[28px] overflow-hidden shadow-sm">
               <img src="https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?w=800&h=1200&fit=crop" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Pets 1" />
            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-7 flex flex-col gap-4 lg:gap-[15.65px]">
               <div className="h-[250px] sm:h-[350px] lg:h-[475px] rounded-3xl overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1000&h=800&fit=crop" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Pets 2" />
               </div>
               <div className="h-[237px] bg-[#1b4965] rounded-3xl flex flex-col items-center justify-center p-8 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Mail className="w-10 h-10 mb-3 opacity-40" />
                  <span className="font-heading font-black text-[24px] leading-[36px] mb-1">Join our pack</span>
                  <span className="text-[14px] leading-[21px] opacity-50 mb-5 font-normal text-[#f4f4f4]">We're always hiring</span>
                  <Button className="bg-[#e8f0f6] hover:bg-white text-[#1b4965] font-bold text-[12px] px-3 py-2.5 rounded-[10px] flex items-center gap-2.5 h-auto transition-colors">
                    View Careers
                    <ArrowUpRight size={14} className="stroke-[2.5px]" />
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="bg-white px-6 md:px-12 lg:px-40 py-12 lg:py-20 flex flex-col items-center">
        <div className="section-container w-full flex flex-col items-center gap-12">
          <div className="max-w-[900px] flex flex-col items-center gap-3 text-center">
            <h2 className="font-extrabold text-[32px] md:text-[48px] text-[#012169]">What other Pawrents say</h2>
            <p className="font-normal text-[18px] md:text-[20px] text-[#134e86] opacity-80">Stories from pet parents who choose Pawwl with confidence.</p>
          </div>

          <div className="w-full max-w-[1120px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Testimonial */}
            <div className="lg:col-span-6 bg-[#1b4965] rounded-[28px] p-8 md:p-14 text-white flex flex-col gap-10 shadow-xl relative overflow-hidden min-h-[477px]">
              <Quote className="w-14 h-14 opacity-10" />
              <p className="text-[28px] md:text-[32px] font-normal leading-[1.4] relative z-10 max-w-[486px]">
                “Game-changer for our golden retriever. The staff truly cares.”
              </p>
              <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => <Star key={i} fill="#5fa8d3" className="w-5 h-5 text-[#5fa8d3]" />)}
              </div>
              <div className="flex items-center gap-4 mt-auto">
                 <div className="w-14 h-14 rounded-full border-2 border-[#dce6ee] p-0.5 overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=ayushi" className="w-full h-full object-cover rounded-full" alt="Ayushi" />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-bold text-base">Ayushi Mishra</span>
                    <span className="text-sm opacity-50">Dog Parent</span>
                 </div>
              </div>
            </div>

            {/* Column of shorter testimonials */}
            <div className="lg:col-span-6 flex flex-col gap-5 h-[477px]">
              {[
                { name: "Ankita Vashisht", role: "Cat Parent", text: "“Outstanding vet care. Every single visit is amazing.”", img: "https://i.pravatar.cc/150?u=ankita", h: "228px" },
                { name: "Aarti Sharma", role: "Pet Parent", text: "“My pup comes home tired and happy every single day!”", img: "https://i.pravatar.cc/150?u=aarti", h: "229px" }
              ].map((t, i) => (
                <div key={i} className={`bg-white border border-solid border-[#dce6ee] rounded-3xl p-8 flex flex-col justify-center gap-4 shadow-sm hover:shadow-md transition-shadow h-[${t.h}]`}>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(j => <Star key={j} fill="#1b4965" className="w-4 h-4 text-[#1b4965]" />)}
                  </div>
                  <p className="text-base text-[#212529] font-normal leading-relaxed">{t.text}</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full border border-[#dce6ee] overflow-hidden">
                       <img src={t.img} className="w-full h-full object-cover" alt={t.name} />
                    </div>
                    <div className="flex flex-col">
                       <span className="font-semibold text-sm text-[#212529]">{t.name}</span>
                       <span className="text-xs text-[#788796]">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Simple Plus icon to avoid missing export error if lucide doesn't have it exactly
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export default Services;

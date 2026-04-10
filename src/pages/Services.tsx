import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { ArrowUpRight, Star, Quote, Mail, GraduationCap, Heart, Scissors, Bath, Ruler, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorsSection from "@/components/DoctorsSection";
import PetGallery from "@/components/PetGallery";
import TestimonialsSection from "@/components/TestimonialsSection";

// Testimonial Data for Services Page
const servicesTestimonials = [
  {
    quote: "“Game-changer for our golden retriever. The staff truly cares.”",
    name: "Ayushi Mishra",
    role: "Dog Parent",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=ayushi",
  },
  {
    quote: "“Outstanding vet care. Every single visit is amazing.”",
    name: "Ankita Vashisht",
    role: "Cat Parent",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=ankita",
  },
  {
    quote: "“My pup comes home tired and happy every single day!”",
    name: "Aarti Sharma",
    role: "Pet Parent",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=aarti",
  },
];

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
              <img 
                src="/assets/images/serviceheroimg.webp" 
                alt="Services Banner" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex justify-between items-center bg-black/10 px-[100px] py-[19px] rounded-2xl group-hover:bg-black/20 transition-colors"></div>
              <PawwlWatermark 
                className="absolute w-[90%] sm:w-[95%] md:w-[1000px] h-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 text-white" 
                opacity={1.0}
              />
            </div>

            {/* Service Grid */}
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-9">
              {[
                { icon: <Bath className="w-8 h-8" />, title: "Bath & Wash", desc: "Gentle shampoo and conditioning to keep coats clean, soft, and fresh." },
                { icon: <Scissors className="w-8 h-8" />, title: "Haircut & Styling", desc: "Breed-specific or custom grooming styles tailored to your pet’s needs." },
                { icon: <Heart className="w-8 h-8" />, title: "Nail Trimming", desc: "Safe nail care to protect paws and ensure comfortable movement." },
                { icon: <PlusIcon className="w-8 h-8" />, title: "Ear Cleaning", desc: "Careful ear cleaning to reduce buildup and help prevent infections." },
                { icon: <GraduationCap className="w-8 h-8" />, title: "Teeth Cleaning", desc: "Basic dental care for fresher breath and better oral hygiene." },
                { icon: <Stethoscope className="w-8 h-8" />, title: "Treatment", desc: "Reduce shedding and maintain a smooth, healthy coat." }
              ].map((service, i) => (
                <div key={i} className="flex gap-2 bg-[#D8FAFF] p-2 rounded-2xl sm:rounded-3xl w-full min-h-[120px] sm:min-h-[160px] transition-all hover:-translate-y-1 hover:shadow-xl group">
                  <div className="w-full flex flex-col gap-2 p-3">
                    <div className="text-brand-accent">{service.icon}</div>
                    <span className="font-bold text-[20px] leading-[24px] text-[#241f1b]">{service.title}</span>
                    <span className="font-normal text-[16px] leading-[24px] text-[#534d49]">{service.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Products Showcase */}
      <section className="bg-white py-24 flex flex-col items-center">
         <div className="section-container flex flex-col items-center gap-12">
            <div className="flex flex-col items-center gap-3 text-center mb-4">
              <h2 className="font-heading font-black text-[32px] md:text-[51.4px] leading-tight text-brand-dark">Pamper Your Pet with Our Premium Products</h2>
              <p className="font-normal text-[18px] md:text-[20px] leading-[24px] text-brand-dark/80 max-w-4xl">Pamper your pet with our premium products designed for comfort and style.</p>
            </div>
            
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="rounded-[28px] overflow-hidden shadow-sm h-[500px]">
                 <img src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=1200&fit=crop" className="w-full h-full object-cover" alt="" />
               </div>
               <div className="flex flex-col gap-8">
                  <div className="bg-[#D8FAFF] p-8 rounded-[28px] h-[234px]">
                    <h3 className="font-bold text-2xl mb-2">In-house Nutrition</h3>
                    <p className="opacity-70">Best for your pets health.</p>
                  </div>
                  <div className="bg-[#D8FAFF] p-8 rounded-[28px] h-[234px]">
                    <h3 className="font-bold text-2xl mb-2">Accessories</h3>
                    <p className="opacity-70">Safe and Durable.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. Doctors Section */}
      <DoctorsSection />

      {/* 4. Gallery Section */}
      <PetGallery />

      {/* 5. Testimonials Section - Standarized Bento Unified */}
      <TestimonialsSection testimonials={servicesTestimonials} />

      <Footer />
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export default Services;

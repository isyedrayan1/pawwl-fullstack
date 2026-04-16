import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { ArrowUpRight, Star, Quote, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorsSection from "@/components/DoctorsSection";
import PetGallery from "@/components/PetGallery";
import TestimonialsSection from "@/components/TestimonialsSection";

import srv5 from "@/assets/gallery/5.webp";
import srv9 from "@/assets/gallery/9.webp";
import srv17 from "@/assets/gallery/17.webp";

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

import SEO from "@/components/SEO";

const Services = () => {
  return (
    <div className="min-h-screen bg-white text-brand-dark selection:bg-brand-blue selection:text-white">
      <SEO 
        title="Professional Pet Services | Vet Care, Grooming & Boarding Mumbai"
        description="Comprehensive pet care services in Mumbai. Specialized in veterinary medical checkups, professional pet grooming, safe pet daycare, and luxury boarding."
        url="https://pawwl.com/services"
      />
      <Navbar />

      {/* 1. Precise Hero Section from Figma */}
      <section className="bg-white pt-4 md:pt-8 pb-12">
        <div className="section-container">
          <div className="w-full flex flex-wrap gap-x-6 gap-y-9">
            {/* Top Pawwl Banner */}
            <div className="w-full h-[320px] sm:h-[420px] md:h-[496px] flex justify-center items-center bg-black/20 rounded-[28px] overflow-hidden relative group">
              <img 
                src="/assets/images/serviceheroimg.webp" 
                alt="Services Banner" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-10"
              />
              <div className="w-full h-full absolute inset-0 flex justify-center items-center z-20">
                <PawwlWatermark 
                  className="absolute w-[90%] sm:w-[95%] md:w-[1000px] h-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white drop-shadow-2xl" 
                  opacity={0.9}
                />
              </div>
            </div>

            {/* Service Grid */}
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-9">
              {[
                { imgSrc: "/assets/icons/pet.webp", title: "Bath & Wash", desc: "Gentle shampoo and conditioning to keep coats clean, soft, and fresh." },
                { imgSrc: "/assets/icons/dog.webp", title: "Haircut & Styling", desc: "Breed-specific or custom grooming styles tailored to your pet’s needs." },
                { imgSrc: "/assets/icons/nail-clippers.webp", title: "Nail Trimming", desc: "Safe nail care to protect paws and ensure comfortable movement." },
                { imgSrc: "/assets/icons/ear-cleaning.webp", title: "Ear Cleaning", desc: "Careful ear cleaning to reduce buildup and help prevent infections." },
                { imgSrc: "/assets/icons/dental-insurance.webp", title: "Teeth Cleaning", desc: "Basic dental care for fresher breath and better oral hygiene." },
                { imgSrc: "/assets/icons/vet.webp", title: "Treatment", desc: "Reduce shedding and maintain a smooth, healthy coat." }
              ].map((service, i) => (
                <div key={i} className="flex gap-2 bg-[#D8FAFF] p-2 rounded-2xl sm:rounded-3xl w-full min-h-[120px] sm:min-h-[160px] transition-all hover:-translate-y-1 hover:shadow-xl group">
                  <div className="w-full flex flex-col gap-2 p-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mb-1">
                       <img src={service.imgSrc} alt={service.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                    </div>
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
                 <img src={srv17} className="w-full h-full object-cover" alt="Premium Products" />
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
      <PetGallery img1={srv5} img2={srv9} />

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

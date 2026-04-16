import { Heart, Scissors, Bath, GraduationCap, Stethoscope } from "lucide-react";
import PawwlWatermark from "./PawwlWatermark";

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const HomeServices = () => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="section-container">
        
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          <div className="w-fit bg-[#e8f7ff] px-4 py-1.5 rounded-full border border-[#c1e8fb]">
            <span className="font-medium text-[12px] md:text-xs text-[#134e86]">Welcome to Pawwl</span>
          </div>
          <h2 className="font-extrabold text-[32px] md:text-[48px] text-[#012169] leading-tight">
            Your Pet's Second Home.
          </h2>
          <p className="font-normal text-[16px] md:text-[18px] leading-[1.6] text-[#012169] max-w-[640px] opacity-80 px-4">
            At Pawwl, we blend professional expertise with genuine affection. Our certified grooming clinic provides a safe, calm, and premium experience designed entirely around your pet's health and happiness.
          </p>
        </div>

        <div className="w-full flex flex-wrap gap-x-6 gap-y-9 relative">
            <PawwlWatermark 
              className="absolute w-[90%] sm:w-[95%] md:w-[800px] h-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-0 text-[#1b4965]" 
              opacity={0.03}
            />

          {/* Service Grid */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
            {[
              { imgSrc: "/assets/icons/pet.webp", title: "Bath & Wash", desc: "Gentle shampoo and conditioning to keep coats clean, soft, and fresh." },
              { imgSrc: "/assets/icons/dog.webp", title: "Haircut & Styling", desc: "Breed-specific or custom grooming styles tailored to your pet’s needs." },
              { imgSrc: "/assets/icons/nail-clippers.webp", title: "Nail Trimming", desc: "Safe nail care to protect paws and ensure comfortable movement." },
              { imgSrc: "/assets/icons/ear-cleaning.webp", title: "Ear Cleaning", desc: "Careful ear cleaning to reduce buildup and help prevent infections." },
              { imgSrc: "/assets/icons/dental-insurance.webp", title: "Teeth Cleaning", desc: "Basic dental care for fresher breath and better oral hygiene." },
              { imgSrc: "/assets/icons/vet.webp", title: "Treatment", desc: "Reduce shedding and maintain a smooth, healthy coat." }
            ].map((service, i) => (
              <div key={i} className="flex gap-2 bg-[#f8fdff] border-2 border-[#c1e8fb] p-2 rounded-[24px] sm:rounded-[28px] w-full min-h-[140px] sm:min-h-[160px] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                <div className="w-full flex flex-col gap-2 p-3 sm:p-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mb-1 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <img src={service.imgSrc} alt={service.title} className="w-full h-full object-contain drop-shadow-sm" />
                  </div>
                  <span className="font-bold text-[18px] sm:text-[20px] leading-tight text-[#012169] mt-1">{service.title}</span>
                  <span className="font-normal text-[13px] sm:text-[15px] leading-snug text-[#012169] opacity-70">{service.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeServices;

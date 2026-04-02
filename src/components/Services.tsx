import { ArrowUpRight } from "lucide-react";
import puppyInBox from "@/assets/puppy_box_treats.png";
import catWithToy from "@/assets/cat_blue_toy.png";
import kittenPlaying from "@/assets/kitten_toy_string.png";
import puppyGroup from "@/assets/puppy_group_care.png";
import petAccessories from "@/assets/pet_accessories.png";

const Services = () => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Large Left Card: Super Chewer Treats */}
          <div className="md:col-span-12 lg:col-span-4 bg-[#67B5D5] rounded-[48px] p-8 md:p-12 relative overflow-visible flex flex-col min-h-[500px] md:min-h-[600px] shadow-sm transform hover:scale-[1.01] transition-transform duration-300">
            <div className="relative z-20">
              <h3 className="text-3xl md:text-5xl font-heading font-black text-[#1A4B6B] mb-2 leading-tight">Super Chewer</h3>
              <p className="text-[#1A4B6B] font-bold text-lg mb-4">Get Durable Pet Toys @ 50%off</p>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 pointer-events-none z-10 p-4">
              <img 
                src={puppyInBox} 
                alt="Puppy with treats" 
                className="w-full object-contain scale-[1.15] origin-bottom translate-y-4 filter drop-shadow-2xl"
              />
            </div>
            
            <div className="mt-auto relative z-20 flex justify-end">
              <a href="#" className="flex items-center gap-2 text-[#1A4B6B] font-bold text-lg group">
                Learn More 
                <div className="bg-[#1A4B6B] p-1.5 rounded-full group-hover:scale-110 transition-transform shadow-md">
                  <ArrowUpRight size={20} className="text-[#67B5D5]" />
                </div>
              </a>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="md:col-span-12 lg:col-span-8 flex flex-col gap-8">
            
            {/* Top Right Card: Super Chewer Shop */}
            <div className="bg-white border-2 border-[#E9F7FB] rounded-[48px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row md:items-center min-h-[350px] md:min-h-[285px] group hover:shadow-lg transition-all duration-300 gap-6">
              <div className="w-full md:w-2/3 relative z-10 space-y-4">
                <h3 className="text-3xl md:text-5xl font-heading font-black text-[#1A4B6B] leading-tight">Super Chewer</h3>
                <p className="text-gray-500 text-sm max-w-[320px] font-medium leading-relaxed">Lorem ipsum dolor sit amet consectetur. Semper tristique ornare cursus tempor quis arcu commodo aliquam.</p>
                <button className="bg-[#1A4B6B] text-white px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-3 w-fit hover:bg-[#153a54] transition-all shadow-md">
                  Pawwl Select Product
                  <ArrowUpRight size={18} />
                </button>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] md:bottom-[-10px] w-full md:w-1/2 h-48 md:h-full">
                <img 
                  src={catWithToy} 
                  alt="Cat with toy" 
                  className="w-full h-full object-contain object-bottom scale-110 md:scale-125 transform group-hover:rotate-3 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Bottom Right Card: Super Chewer Kitten */}
            <div className="bg-white border-2 border-[#E9F7FB] rounded-[48px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row md:items-center min-h-[350px] md:min-h-[285px] group hover:shadow-lg transition-all duration-300 gap-6">
              <div className="w-full md:w-2/3 relative z-10 space-y-4">
                <h3 className="text-3xl md:text-5xl font-heading font-black text-[#1A4B6B] leading-tight">Super Chewer</h3>
                <p className="text-gray-500 text-sm max-w-[320px] font-medium leading-relaxed">Lorem ipsum dolor sit amet consectetur. Semper tristique ornare cursus tempor quis arcu commodo aliquam.</p>
                <button className="bg-[#1A4B6B] text-white px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-3 w-fit hover:bg-[#153a54] transition-all shadow-md">
                  Pawwl Select Product
                  <ArrowUpRight size={18} />
                </button>
              </div>
              <div className="absolute right-0 bottom-[-15px] md:bottom-[-5px] w-full md:w-2/5 h-40 md:h-full">
                <img 
                  src={kittenPlaying} 
                  alt="Kitten playing" 
                  className="w-full h-full object-contain object-bottom transform group-hover:-translate-y-2 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Third Row: 3 smaller food cards - 2 columns on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`bg-white border-2 border-[#E9F7FB] rounded-[32px] md:rounded-[40px] p-5 md:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center h-[280px] md:h-[200px] hover:shadow-md transition-all group ${i === 3 ? 'col-span-2 md:col-span-1' : 'col-span-1'}`}>
              <div className="w-full md:w-2/3 relative z-10 space-y-3">
                <h4 className="text-base md:text-xl font-black text-[#1A4B6B] leading-tight">Tasty Cat & Dog Food</h4>
                <p className="text-gray-500 text-[10px] md:text-xs font-medium leading-snug">Lorem ipsum dolor sit amet consectetur.</p>
                <button className="bg-[#1A4B6B] text-white px-4 py-2 rounded-full text-[10px] font-bold flex items-center justify-center gap-2 w-fit">
                  Pawwl Select
                  <ArrowUpRight size={12} />
                </button>
              </div>
              <div className="absolute right-2 bottom-2 w-full md:w-1/3 h-24 md:h-full">
                <img 
                  src="https://images.unsplash.com/photo-1548767791-514d3ecfd0df?w=400&h=400&fit=crop" 
                  alt="Food bag" 
                  className="w-full h-full object-contain object-bottom scale-[1.2] transition-transform duration-300 group-hover:scale-[1.3]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Fourth Row: Wide cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
          {/* Left Wide Card: Accessories */}
          <div className="md:col-span-5 bg-white border-2 border-[#E9F7FB] rounded-[40px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row md:items-center min-h-[350px] md:min-h-[220px] group hover:shadow-md transition-shadow">
            <div className="w-full md:w-2/3 relative z-10 space-y-4">
              <h4 className="text-2xl font-black text-[#1A4B6B] leading-tight-tight">Wide Range of Accessories for Pets</h4>
              <p className="text-gray-400 text-xs max-w-[180px]">Lorem ipsum dolor sit amet consectetur.</p>
              <button className="bg-[#1A4B6B] text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 w-fit hover:opacity-90 transition-opacity">
                Pawwl Select Product
                <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="absolute right-0 bottom-[-10px] w-full md:w-1/2 h-44 md:h-full">
              <img 
                src={petAccessories} 
                alt="Accessories" 
                className="w-full h-full object-contain object-bottom transform group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
            </div>
          </div>

          {/* Right Extra Wide Card: Day Care - Top Image / Bottom Content for Mobile */}
          <div className="md:col-span-7 bg-white border-2 border-[#E9F7FB] rounded-[40px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center md:items-center min-h-[400px] md:min-h-[220px] group hover:shadow-md transition-shadow">
            <div className="w-full md:w-3/5 h-48 md:absolute md:right-0 md:bottom-0 md:h-full flex items-end mb-8 md:mb-0 order-first md:order-last">
              <img 
                src={puppyGroup} 
                alt="Day care" 
                className="w-full h-full object-contain scale-[1.5] md:scale-100 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
              />
            </div>
            <div className="w-full md:w-1/2 relative z-10 space-y-4">
              <h4 className="text-2xl md:text-3xl font-black text-[#1A4B6B] leading-tight">Best Day Care in Town!</h4>
              <p className="text-gray-400 text-sm max-w-[280px]">Lorem ipsum dolor sit amet consectetur. Aliquam enim nullam et arcu dui.</p>
              <button className="bg-[#1A4B6B] text-white px-8 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-3 w-fit hover:bg-[#153a54] transition-all shadow-sm active:scale-95">
                Pawwl Select Product
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Services;

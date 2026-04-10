import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import puppyInBox from "@/assets/puppy_box_treats.webp";
import catWithToy from "@/assets/cat_blue_toy.webp";
import kittenPlaying from "@/assets/kitten_toy_string.webp";
import puppyGroup from "@/assets/puppy_group_care.webp";
import petAccessories from "@/assets/pet_accessories.webp";

const Services = () => {
  return (
    <section className="bg-white py-12">
      <div className="section-container">
        <div className="flex flex-col gap-8">
          
          {/* Row 2: Main Large Card + Two Wide Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Main Card: Super Chewer */}
            <div className="lg:col-span-5 h-[592px] bg-brand-light-blue rounded-2xl p-10 relative overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-xl border border-border-accent/30 shadow-inner">
              <div className="relative z-20 space-y-4">
                <div className="flex flex-col">
                  <span className="font-bold text-[38px] leading-[44px] text-brand-dark">Super Chewer</span>
                  <span className="text-[16px] text-brand-dark opacity-90">Get Durable Pet Toys @ 50%off</span>
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-12">
                <div className="w-[329px] h-[366px] relative">
                  <img src={puppyInBox} alt="Puppy" className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
              </div>

              <div className="mt-auto relative z-20">
                <a href="#" className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-2xl text-brand-dark font-bold text-[17.4px] hover:bg-brand-light transition-all shadow-lg hover:shadow-xl active:scale-95">
                  Learn More
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            {/* Right Column: Two wide white cards */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Top Case */}
              <div className="w-full h-[280px] bg-white border-2 border-border-accent rounded-2xl p-10 relative overflow-hidden flex items-center group transition-all hover:shadow-xl">
                <div className="w-full sm:w-1/2 space-y-5 relative z-10">
                   <div className="w-fit flex justify-center items-center gap-3 bg-brand-blue py-2 px-4 rounded-full">
                    <span className="font-bold text-[10px] text-white uppercase">Pawwl Select Product</span>
                    <ArrowUpRight size={9} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[38px] font-bold text-brand-dark leading-[44px]">Super Chewer</h3>
                    <p className="text-brand-dark text-[16px] font-normal leading-relaxed opacity-70 line-clamp-2">
                      Lorem ipsum dolor sit amet consectetur. Semper tristique ornare cursus tempor quis arcu commodo aliquam.
                    </p>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 w-[185px] h-full group-hover:scale-110 transition-transform duration-700">
                  <img src={catWithToy} alt="Cat" className="w-full h-full object-contain object-bottom" />
                </div>
              </div>

              {/* Bottom Case */}
              <div className="w-full h-[280px] bg-white border-2 border-border-accent rounded-2xl p-10 relative overflow-hidden flex items-center group transition-all hover:shadow-xl">
                <div className="w-full sm:w-1/2 space-y-5 relative z-10">
                  <div className="w-fit flex justify-center items-center gap-3 bg-brand-blue py-2 px-4 rounded-full">
                    <span className="font-bold text-[10px] text-white uppercase">Pawwl Select Product</span>
                    <ArrowUpRight size={9} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[38px] font-bold text-brand-dark leading-[44px]">Super Chewer</h3>
                    <p className="text-brand-dark text-[16px] font-normal leading-relaxed opacity-70 line-clamp-2">
                       Lorem ipsum dolor sit amet consectetur. Semper tristique ornare cursus tempor quis arcu commodo aliquam.
                    </p>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 w-[190px] h-full group-hover:scale-110 transition-transform duration-700">
                  <img src={kittenPlaying} alt="Kitten" className="w-full h-full object-contain object-bottom" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Three Horizontal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-[165px] bg-white border-2 border-border-accent rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group transition-all hover:shadow-xl">
                <div className="relative z-10 space-y-3">
                  <div className="w-fit flex justify-center items-center gap-3 bg-brand-blue py-1.5 px-3 rounded-full">
                    <span className="font-bold text-[10px] text-white uppercase">Pawwl Select Product</span>
                    <ArrowUpRight size={9} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-[20px] font-bold text-brand-blue leading-tight">Tasty Cat & Dog Food</h4>
                    <p className="text-brand-dark text-[16px] font-normal opacity-70">Lorem ipsum dolor sit amet consectetud.</p>
                  </div>
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] w-[82px] h-[153px] group-hover:scale-110 transition-all duration-500">
                   <img src="https://images.unsplash.com/photo-1583336663277-620dc1996580?w=200&h=200&fit=crop" alt="Food" className="w-full h-full object-contain" />
                </div>
              </div>
            ))}
          </div>

          {/* Row 4: Two Varied Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Accessories Card - Medium */}
            <div className="lg:col-span-5 w-full h-[125px] bg-white border-2 border-border-accent rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center group transition-all hover:shadow-xl">
              <div className="relative z-10 space-y-1">
                <div className="w-fit flex justify-center items-center gap-3 bg-brand-blue py-1.5 px-3 rounded-full mb-1">
                  <span className="font-bold text-[10px] text-white uppercase">Pawwl Select Product</span>
                  <ArrowUpRight size={9} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[20px] font-bold text-brand-blue leading-tight">Wide Range of Accessories</h4>
                  <p className="text-brand-dark text-xs font-normal opacity-70">Lorem ipsum dolor sit amet consectetud.</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-[154px] h-[113px] group-hover:scale-110 transition-transform duration-700">
                <img src={petAccessories} alt="Accessories" className="w-full h-full object-contain object-bottom" />
              </div>
            </div>

            {/* Day Care Card - Wide */}
            <div className="lg:col-span-7 w-full h-[125px] bg-white border-2 border-border-accent rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center group transition-all hover:shadow-xl">
              <div className="relative z-10 space-y-1">
                 <div className="w-fit flex justify-center items-center gap-3 bg-brand-blue py-1.5 px-3 rounded-full mb-1">
                  <span className="font-bold text-[10px] text-white uppercase">Pawwl Select Product</span>
                  <ArrowUpRight size={9} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[20px] font-bold text-brand-blue leading-tight">Best Day Care in Town!</h4>
                  <p className="text-brand-dark text-xs font-normal opacity-70">Lorem ipsum dolor sit amet consectetur. Aliquam enim nullam et arcu dui.</p>
                </div>
              </div>
              <div className="absolute right-12 bottom-0 h-[100%] overflow-visible translate-y-[10%]">
                <img src={puppyGroup} alt="Day care" className="h-[150%] w-auto object-contain object-bottom scale-125" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;

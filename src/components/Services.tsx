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
          
          {/* Top Bento Row: Main Large Card + Two Wide Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Main Card: Super Chewer */}
            <div className="lg:col-span-5 h-[450px] sm:h-[520px] lg:h-[600px] bg-brand-light-blue rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-xl border border-border-accent/30 shadow-inner">
              <div className="relative z-20 space-y-3">
                <div className="w-fit bg-white/40 backdrop-blur px-3 py-1 rounded-full border border-brand-accent/20 text-[10px] font-bold text-brand-dark uppercase tracking-wider">Most Popular</div>
                <h3 className="text-[32px] sm:text-[42px] font-black text-brand-dark leading-none">Super Chewer</h3>
                <p className="text-brand-dark text-sm sm:text-lg font-medium opacity-80 max-w-[240px]">Get Durable Pet Toys @ 50%off</p>
              </div>
              
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pointer-events-none mb-16 sm:mb-12">
                <div className="w-[220px] sm:w-[350px] h-[260px] sm:h-[380px] relative">
                  <img src={puppyInBox} alt="Puppy" className="w-full h-full object-contain scale-125 sm:scale-110 drop-shadow-2xl" />
                </div>
              </div>

              <div className="mt-auto relative z-20">
                <a href="#" className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl text-[#003459] font-bold text-[15px] sm:text-[18px] hover:bg-brand-light transition-all shadow-lg hover:shadow-xl active:scale-95">
                  Learn More
                  <ArrowUpRight size={20} />
                </a>
              </div>
            </div>

            {/* Right Column: Two wide white cards */}
            <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8">
              {/* Top Case */}
              <div className="w-full h-auto min-h-[240px] lg:h-[284px] bg-white border-2 border-border-accent rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center group transition-all hover:shadow-xl hover:border-brand-blue/30">
                <div className="w-full sm:w-1/2 space-y-3 sm:space-y-5 relative z-10 mb-4 sm:mb-0">
                   <div className="w-fit bg-brand-light px-3 py-1 rounded-full text-[10px] font-bold text-brand-blue uppercase">New Arrival</div>
                  <h3 className="text-[26px] sm:text-[34px] lg:text-[40px] font-black text-brand-dark leading-tight">Chewy Treats</h3>
                  <p className="text-brand-dark text-xs sm:text-[16px] font-normal leading-relaxed opacity-70 line-clamp-2">
                    High-quality treats and durable toys for your aggressive chewers.
                  </p>
                  <button className="bg-brand-blue text-white px-5 py-3 rounded-xl text-[12px] font-black flex items-center gap-2 hover:bg-brand-dark transition-all shadow-md hover:shadow-lg active:scale-95">
                    Select Product
                    <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="absolute sm:relative ml-auto right-0 bottom-0 sm:bottom-auto w-[130px] sm:w-[200px] h-[150px] sm:h-[290px] opacity-40 sm:opacity-100 group-hover:scale-110 transition-transform duration-700">
                  <img src={catWithToy} alt="Cat" className="w-full h-full object-contain object-bottom sm:object-right-bottom" />
                </div>
              </div>

              {/* Bottom Case */}
              <div className="w-full h-auto min-h-[240px] lg:h-[284px] bg-white border-2 border-border-accent rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center group transition-all hover:shadow-xl hover:border-brand-blue/30">
                <div className="w-full sm:w-1/2 space-y-3 sm:space-y-5 relative z-10 mb-4 sm:mb-0">
                  <div className="w-fit bg-teal-light px-3 py-1 rounded-full text-[10px] font-bold text-secondary uppercase">Best Seller</div>
                  <h3 className="text-[26px] sm:text-[34px] lg:text-[100%] font-black text-brand-dark leading-tight" style={{fontSize: "clamp(26px, 4vw, 40px)"}}>Kitten Kits</h3>
                  <p className="text-brand-dark text-xs sm:text-[16px] font-normal leading-relaxed opacity-70 line-clamp-2">
                    Specifically designed play-kits for kittens and young cats.
                  </p>
                  <button className="bg-brand-blue text-white px-5 py-3 rounded-xl text-[12px] font-black flex items-center gap-2 hover:bg-brand-dark transition-all shadow-md hover:shadow-lg active:scale-95">
                    Select Product
                    <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="absolute sm:relative ml-auto right-0 bottom-0 sm:bottom-auto w-[130px] sm:w-[210px] h-[150px] sm:h-[290px] opacity-40 sm:opacity-100 group-hover:scale-110 transition-transform duration-700">
                  <img src={kittenPlaying} alt="Kitten" className="w-full h-full object-contain object-bottom sm:object-right-bottom" />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: 4 Small Cards for a more "Complete" Bento Look */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              { title: "Tasty Treats", desc: "Healthy dog food.", color: "bg-white" },
              { title: "Fun Fetch", desc: "Interactive toys.", color: "bg-white" },
              { title: "Cozy Beds", desc: "Premium comfort.", color: "bg-white" },
              { title: "Grooming", desc: "Stay fresh.", color: "bg-white" }
            ].map((item, i) => (
              <div key={i} className={`w-full h-[150px] sm:h-[180px] ${item.color} border-2 border-border-accent rounded-3xl p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:border-brand-blue/20 hover:-translate-y-1 group`}>
                <div className="relative z-10 flex flex-col gap-2">
                  <button className="bg-brand-blue/10 text-brand-blue p-2 rounded-xl w-fit group-hover:bg-brand-blue group-hover:text-white transition-all">
                    <ArrowUpRight size={14} />
                  </button>
                  <div className="space-y-1">
                    <h4 className="text-[16px] sm:text-[22px] font-black text-brand-dark leading-none">{item.title}</h4>
                    <p className="text-gray-400 text-[10px] sm:text-[14px] font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] w-[70px] sm:w-[100px] h-[70px] sm:h-[100px] opacity-20 sm:opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                   <img src="https://images.unsplash.com/photo-1583336663277-620dc1996580?w=200&h=200&fit=crop" alt={item.title} className="w-full h-full object-contain" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row: Varied Cards for better density */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Accessories Card - Medium */}
            <div className="lg:col-span-4 w-full h-auto min-h-[160px] bg-white border-2 border-border-accent rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:border-brand-blue/20 group">
              <div className="flex flex-col gap-4 relative z-10">
                <div className="w-fit bg-brand-light px-3 py-1 rounded-full text-[10px] font-black text-brand-blue uppercase">Trending</div>
                <h4 className="text-[22px] sm:text-[26px] font-black text-brand-dark leading-tight">Premium <br /> Accessories</h4>
              </div>
              <div className="absolute right-0 bottom-0 w-[140px] h-[120px] group-hover:scale-110 transition-transform duration-700">
                <img src={petAccessories} alt="Accessories" className="w-full h-full object-contain object-bottom sm:object-right-bottom" />
              </div>
            </div>

            {/* Day Care Card - Wide */}
            <div className="lg:col-span-8 w-full h-auto min-h-[160px] bg-[#1b4965] rounded-3xl p-6 sm:p-10 relative overflow-hidden flex items-center transition-all hover:shadow-2xl group border border-white/10">
              <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 relative z-10">
                <h4 className="text-[28px] sm:text-[36px] font-black text-white leading-tight">Best Day Care <br className="hidden sm:block" /> in Town!</h4>
                <div className="flex items-center gap-4">
                  <Button className="bg-white hover:bg-brand-light text-brand-dark px-6 py-4 rounded-full font-black text-[13px] shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform h-auto">
                    Explore Services
                    <ArrowUpRight size={16} />
                  </Button>
                </div>
              </div>
              <div className="absolute right-4 bottom-0 w-[160px] sm:w-[240px] h-[180px] sm:h-[220px] group-hover:scale-110 transition-transform duration-700">
                <img src={puppyGroup} alt="Day care" className="w-full h-full object-contain object-bottom" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;

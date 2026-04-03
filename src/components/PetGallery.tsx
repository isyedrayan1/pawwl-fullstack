import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram } from "lucide-react";

const PetGallery = () => (
  <section className="py-24 bg-white flex flex-col items-center">
    {/* Header Content */}
    <div className="max-w-[900px] w-full flex flex-col items-center gap-4 mb-16 px-6">
      <h2 className="font-extrabold text-[32px] md:text-[48px] text-center text-[#012169] leading-tight px-4">
        Whiskers, Tails, and Joyful Eyes<br /> A Gallery Full of Love
      </h2>
      <p className="font-normal text-[16px] md:text-[20px] leading-[1.4] text-center text-[#134e86] opacity-80 max-w-2xl">
        Step into a world of heartwarming moments captured in every frame. From wagging tails to joyful eyes, our gallery showcases the love and every companion feel special.”
      </p>
    </div>

    {/* Bento Gallery Grid */}
    {/* Bento Gallery Grid - Optimized for Mobile Bento Feel */}
    <div className="section-container grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row gap-4 sm:gap-8">
      {/* Column 1: Large Vertical Image */}
      <div className="lg:w-[504px] w-full h-[320px] sm:h-[500px] lg:h-full rounded-[28px] overflow-hidden shadow-lg group border border-border-design/30">
        <img 
          src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&h=1200&fit=crop" 
          alt="Pawwl Pet Gallery 1" 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
        />
      </div>

      {/* Column 2: Bento Stacking */}
      <div className="lg:w-[600px] w-full flex flex-col gap-4 h-full">
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
          {/* Top: Image Section */}
          <div className="w-full h-[180px] sm:h-[300px] lg:h-[475px] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-lg group border border-border-design/30">
            <img 
              src="https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&h=600&fit=crop" 
              alt="Pawwl Pet Gallery 2" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
            />
          </div>

          {/* Bottom: Careers Card Section */}
          <div className="w-full h-[180px] sm:h-[300px] lg:h-[237px] flex flex-col justify-center items-center bg-[#1b4965] rounded-[28px] sm:rounded-[32px] p-4 sm:p-8 shadow-inner relative group hover:bg-[#153a54] transition-all border border-white/10">
            <div className="flex flex-col items-center gap-2 sm:gap-4 text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                <Instagram className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="flex flex-col gap-0.5 sm:gap-1">
                <h4 className="font-black text-[14px] sm:text-[24px] leading-tight text-white uppercase tracking-wider">Join our pack</h4>
                <span className="font-normal text-[10px] sm:text-[14px] leading-tight text-[#f4f4f4] opacity-50 block">WE'RE HIRING</span>
              </div>

              <Button className="flex items-center gap-2 bg-[#e8f0f6] hover:bg-white px-3 sm:px-6 h-8 sm:h-12 rounded-xl transition-all shadow-lg active:scale-95 mt-1">
                <span className="font-bold text-[10px] sm:text-[13px] text-[#1b4965]">View Careers</span>
                <ArrowRight size={14} className="text-[#1b4965] group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PetGallery;

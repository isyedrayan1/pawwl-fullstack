import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/useGsapReveal";
import { ArrowUpRight, GraduationCap, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import defaultGal1 from "@/assets/gallery/6.webp";
import defaultGal2 from "@/assets/gallery/11.webp";

interface PetGalleryProps {
  img1?: string;
  img2?: string;
}

const PetGallery = ({ img1 = defaultGal1, img2 = defaultGal2 }: PetGalleryProps) => {
  const headerRef = useReveal({ y: 30 });
  const bentoRef = useReveal({ y: 0, scale: 0.98, duration: 1.1 });

  return (
    <section className="w-full flex flex-col items-center gap-8 self-stretch bg-white px-6 md:px-12 lg:px-40 py-12 md:py-16 overflow-hidden">
      
      {/* Header Content */}
      <div 
        ref={headerRef}
        className="w-full max-w-[900px] flex flex-col items-center gap-3 text-center mb-[72px] opacity-0"
      >
      <h2 className="font-extrabold text-[32px] md:text-[48px] text-[#012169] leading-tight">
        Whiskers, Tails, and Joyful Eyes<br className="hidden md:block" /> A Gallery Full of Love
      </h2>
      <p className="font-normal text-[16px] md:text-[20px] leading-[1.4] text-[#134e86]">
        Step into a world of heartwarming moments captured in every frame. From wagging tails to joyful eyes, our gallery showcases the love and every companion feel special.”
      </p>
      </div>

    {/* Bento Content Section */}
    <div 
      ref={bentoRef}
      className="w-full max-w-[1144px] flex flex-col lg:flex-row gap-6 md:gap-9 items-stretch opacity-0"
    >
      
      {/* 1. Column Left: Large Vertical Image (504px) */}
      <div className="w-full lg:w-[504px] h-[400px] sm:h-[500px] lg:h-[727.6px] rounded-[28px] overflow-hidden group shadow-lg border border-[#dce6ee]">
        <img 
          src={img1} 
          alt="Pets 1" 
          loading="lazy" decoding="async"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
        />
      </div>

      {/* 2. Column Right: Stacked (Bento on Mobile: Side-by-Side) */}
      <div className="flex-1 grid grid-cols-2 lg:flex lg:flex-col gap-4 md:gap-[15.65px]">
        
        {/* Top (Left on Mobile): Horizontal Image */}
        <div className="w-full h-[180px] sm:h-[300px] lg:h-[475px] rounded-[24px] md:rounded-[28px] overflow-hidden group shadow-md border border-[#dce6ee]">
          <img 
             src={img2} 
             loading="lazy" decoding="async"
             className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
             alt="Pets 2" 
          />
        </div>

        {/* Bottom (Right on Mobile): Navy Gallery CTA Card */}
        <div className="w-full h-[180px] sm:h-[300px] lg:h-[237px] flex justify-center items-center bg-[#1b4965] rounded-[24px] md:rounded-[32px] p-4 sm:p-8 relative overflow-hidden group shadow-lg">
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           
           <div className="flex flex-col items-center text-center gap-2 sm:gap-4 relative z-10">
              <div className="opacity-40 text-white group-hover:opacity-80 transition-opacity">
                <ImageIcon className="w-6 h-6 sm:w-10 sm:h-10" strokeWidth={1.5} />
              </div>
              
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <h4 className="font-extrabold text-[14px] sm:text-[24px] leading-tight text-white line-clamp-1">Explore More</h4>
                <span className="font-normal text-[8px] sm:text-[14px] leading-tight text-[#f4f4f4]/60 uppercase tracking-widest hidden sm:block">View Full Gallery</span>
              </div>

              <Link to="/gallery">
                <Button className="flex items-center gap-1.5 md:gap-[9px] bg-[#e8f0f6] hover:bg-white px-3 md:px-7 h-7 md:h-12 rounded-[8px] md:rounded-[10px] shadow-md transition-all active:scale-95 group/btn border-none">
                  <span className="font-bold text-[10px] md:text-[12px] text-[#1b4965]">View Gallery</span>
                  <ArrowUpRight size={12} className="text-[#1b4965] transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default PetGallery;

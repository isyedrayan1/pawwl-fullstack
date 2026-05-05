import { useReveal, useStaggerReveal } from "@/hooks/useGsapReveal";
import vid2 from "@/assets/gallery/2v.mp4";
import vid3 from "@/assets/Newgallery/IMG_3620.mp4";
import vid4 from "@/assets/Newgallery/products/IMG_5021.JPG.webp";
import vid5 from "@/assets/gallery/5v.mp4";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const IntroVideo = () => {
  const headerRef = useReveal({ y: 40 });
  const gridRef = useStaggerReveal(".vid-item", { y: 40, stagger: 0.12 });
  const ctaRef = useReveal({ y: 20, delay: 0.2 });

  return (
    <section className="pb-12 md:pb-16 pt-8 md:pt-12 bg-white overflow-hidden">
      <div className="section-container">
        <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto">
          
          <div 
            ref={headerRef}
            className="text-center flex flex-col gap-3 opacity-0"
          >
            <h2 className="font-extrabold text-[32px] md:text-[48px] text-[#012169] leading-tight">
              See How We Care
            </h2>
            <p className="font-normal text-[16px] md:text-[20px] text-[#134e86] max-w-2xl mx-auto">
              A glimpse into the joy, love, and dedicated care every pet experiences at Pawwl.
            </p>
          </div>

          {/* Video Bento Layout */}
          <div ref={gridRef} className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Left: 3v portrait */}
            <div 
              className="vid-item rounded-[28px] overflow-hidden shadow-sm h-[400px] md:h-[600px] relative group border border-[#dce6ee] opacity-0 col-span-1"
            >
               <video 
                  src={vid3} 
                  autoPlay loop muted playsInline 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            {/* Middle: Stacked 5v (top) & 4v (bottom) */}
            <div 
              className="vid-item grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6 h-[300px] lg:h-[600px] opacity-0"
            >
               <div className="rounded-[28px] overflow-hidden shadow-sm flex-1 relative group border border-[#dce6ee]">
                   <video 
                      src={vid5} 
                      autoPlay loop muted playsInline 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                   />
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
               </div>
                <div className="rounded-[28px] overflow-hidden shadow-sm flex-1 relative group border border-[#dce6ee]">
                    <img 
                       src={vid4} 
                       alt="Pawwl Gallery"
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>
            </div>

            {/* Right: 2v portrait */}
            <div 
              className="vid-item rounded-[28px] overflow-hidden shadow-sm h-[400px] md:h-[600px] relative group border border-[#dce6ee] opacity-0 col-span-1"
            >
               <video 
                  src={vid2} 
                  autoPlay loop muted playsInline 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>

          </div>
          
          {/* CTA Button */}
          <div 
            ref={ctaRef}
            className="flex justify-center mt-2 opacity-0"
          >
            <Link to="/gallery">
              <Button className="bg-[#012169] hover:bg-[#012169]/90 text-white px-6 py-2.5 h-auto rounded-xl text-base font-bold flex items-center gap-2 group transition-all hover:shadow-lg active:scale-95 border-none">
                <span>View Gallery</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default IntroVideo;


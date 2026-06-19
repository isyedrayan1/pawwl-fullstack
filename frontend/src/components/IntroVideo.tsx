import { useReveal, useStaggerReveal } from "@/hooks/useGsapReveal";
const vid2 = "https://pub-5d58ad108d93401eaa1c5d97111289f7.r2.dev/gallery/2v.mp4";
const vid3 = "https://pub-5d58ad108d93401eaa1c5d97111289f7.r2.dev/Newgallery/IMG_3620.mp4";
const vid4 = "https://pub-5d58ad108d93401eaa1c5d97111289f7.r2.dev/Newgallery/products/IMG_5021.JPG.webp";
const vid5 = "https://pub-5d58ad108d93401eaa1c5d97111289f7.r2.dev/gallery/5v.mp4";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const IntroVideo = () => {
  const headerRef = useReveal({ y: 40 });
  const gridRef = useStaggerReveal(".vid-item", { y: 40, stagger: 0.12 });
  const mobileGridRef = useStaggerReveal(".vid-item-m", { y: 30, stagger: 0.1 });
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
          {/* Desktop / Tablet: 3-col bento (md+) */}
          <div ref={gridRef} className="w-full hidden md:grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Left: 3v portrait */}
            <div className="vid-item rounded-[28px] overflow-hidden shadow-sm h-[600px] relative group border border-[#dce6ee] opacity-0">
              <video src={vid3} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            {/* Middle: Stacked */}
            <div className="vid-item grid grid-cols-1 gap-6 h-[600px] opacity-0">
              <div className="rounded-[28px] overflow-hidden shadow-sm relative group border border-[#dce6ee]">
                <video src={vid5} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="rounded-[28px] overflow-hidden shadow-sm relative group border border-[#dce6ee]">
                <img src={vid4} alt="Pawwl Gallery" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </div>
            {/* Right: 2v portrait */}
            <div className="vid-item rounded-[28px] overflow-hidden shadow-sm h-[600px] relative group border border-[#dce6ee] opacity-0">
              <video src={vid2} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>

          {/* Mobile: portrait → 2 squares → portrait (below md) */}
          <div ref={mobileGridRef} className="w-full flex flex-col gap-4 md:hidden">
            {/* 1st: Portrait 9:16 */}
            <div className="vid-item-m rounded-[28px] overflow-hidden shadow-sm aspect-[9/16] relative group border border-[#dce6ee] opacity-0">
              <video src={vid3} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            {/* 2nd & 3rd: Side by side squares */}
            <div className="grid grid-cols-2 gap-4">
              <div className="vid-item-m rounded-[28px] overflow-hidden shadow-sm aspect-square relative group border border-[#dce6ee] opacity-0">
                <video src={vid5} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="vid-item-m rounded-[28px] overflow-hidden shadow-sm aspect-square relative group border border-[#dce6ee] opacity-0">
                <img src={vid4} alt="Pawwl Gallery" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </div>
            {/* 4th: Portrait 9:16 */}
            <div className="vid-item-m rounded-[28px] overflow-hidden shadow-sm aspect-[9/16] relative group border border-[#dce6ee] opacity-0">
              <video src={vid2} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
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


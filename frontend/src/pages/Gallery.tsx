import Navbar from "@/components/Navbar";
import { useReveal } from "@/hooks/useGsapReveal";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { ImageGallery } from "@/components/ui/image-gallery";
import SEO from "@/components/SEO";

const Gallery = () => {
  const heroRef = useReveal({ y: 0, scale: 0.96, duration: 1.2, ease: "power4.out" });
  const headerRef = useReveal({ y: 30 });

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <SEO 
        title="Pet Photo Gallery | Moments at Pawwl Studio"
        description="Explore our gallery of happy pets! See our professional grooming results, veterinary care moments, and daycare activities at Mumbai's top pet studio."
        url="https://pawwl.com/gallery"
      />
      <Navbar />
      
      {/* 1. Precise Hero Section from Figma */}
      <section className="bg-white pt-4 md:pt-8 pb-12 overflow-hidden">
        <div className="section-container">
          <div 
            ref={heroRef} className="w-full flex flex-wrap gap-x-6 gap-y-9 opacity-0"
          >
            {/* Banner Container */}
            <div className="w-full h-[320px] sm:h-[420px] md:h-[496px] rounded-2xl relative overflow-hidden flex items-center justify-center group shadow-2xl">
              <img 
                src="/assets/images/galleryheroimg.webp" 
                alt="Gallery Banner" 
                className="absolute inset-0 w-full h-full object-cover md:object-[center_15%] transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 flex justify-between items-center bg-black/10 px-[100px] py-[19px] rounded-2xl group-hover:bg-black/20 transition-colors"></div>
              <PawwlWatermark 
                className="absolute w-[90%] sm:w-[95%] md:w-[1000px] h-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 text-white" 
                opacity={1.0}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="bg-white">
        <div 
          ref={headerRef} className="section-container flex flex-col items-center gap-4 mb-12 mt-4 text-center opacity-0"
        >
          <div className="w-fit bg-[#e8f7ff] px-4 py-1.5 rounded-full border border-[#c1e8fb] shadow-sm">
            <span className="font-bold text-[12px] md:text-xs text-[#134e86]">Moments of Joy</span>
          </div>
          <h1 className="font-extrabold text-[36px] md:text-[52px] text-[#012169] leading-tight tracking-tight">
            Pawwl Gallery.
          </h1>
        </div>
        <ImageGallery />
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;

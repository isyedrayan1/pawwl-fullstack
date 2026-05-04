import heroDog from "@/assets/hero-dog.webp";
import { useReveal } from "@/hooks/useGsapReveal";
import PawwlWatermark from "./PawwlWatermark";

const Hero = () => {
  const heroRef = useReveal({ y: 0, scale: 0.96, duration: 1.2, ease: "power4.out" });

  return (
    <section className="bg-white pt-4 md:pt-8 pb-4">
      <div className="section-container">
        <div 
          ref={heroRef}
          className="relative bg-brand-light rounded-2xl overflow-hidden h-[320px] sm:h-[420px] md:h-[497px] flex items-center justify-center border border-border-accent/30 shadow-sm transition-all duration-300 opacity-0"
        >
        
        {/* Professional SVG Watermark Background */}
        <PawwlWatermark 
          className="absolute w-[90%] sm:w-[95%] md:w-[1000px] h-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:-mt-[19px] z-10 text-[#1b4965]" 
          opacity={0.6}
        />
        
        {/* Dalmatian Image Section - Improved Scaling */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <img
            src={heroDog}
            alt="Dalmatian with ball"
            className="w-full max-w-[190px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[380px] object-contain relative z-20 mb-[-1.5%] drop-shadow-2xl brightness-[1.02] contrast-[1.02]"
          />
        </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

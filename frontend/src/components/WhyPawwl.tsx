import { ShieldCheck, Clock, Users, Heart, Radio } from "lucide-react";
import { useReveal, useStaggerReveal } from "@/hooks/useGsapReveal";

const WhyPawwl = () => {
  const headerRef = useReveal({ y: 40 });
  const bigCardRef = useReveal({ x: -40, y: 0 });
  const gridRef = useStaggerReveal(".wp-card", { y: 30, stagger: 0.1 });

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="section-container">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className="flex flex-col justify-center items-center gap-4 mb-[72px] opacity-0"
        >
          <h2 className="font-extrabold text-[32px] md:text-[48px] text-center text-brand-dark leading-tight">Why Pawwl?</h2>
          <p className="font-normal text-[16px] md:text-[20px] leading-[1.4] text-center text-brand-dark max-w-2xl opacity-80 px-4">
            At Pawwl, we go beyond basic care. We provide a nurturing environment that brings joy, health, and enrichment to every pet's life.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-stretch">
          {/* Left Big Metric Card */}
          <div 
            ref={bigCardRef}
            className="h-auto min-h-[400px] lg:h-[494px] w-full lg:w-[500px] flex flex-col justify-between bg-brand-accent p-8 md:p-14 rounded-[28px] transition-transform hover:scale-[1.02] duration-500 opacity-0"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
               <Radio size={24} />
            </div>
            <div className="space-y-4 mt-12 lg:mt-0">
              <h3 className="font-black text-[40px] sm:text-[50px] lg:text-[70px] leading-[1.0] text-white">Expert<br />Care</h3>
              <p className="font-normal text-base text-white opacity-50">Professional Pet Services</p>
            </div>
          </div>

          {/* Right Feature Grid */}
          <div 
            ref={gridRef}
            className="grow grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-5"
          >
            <div className="wp-card min-h-[170px] sm:h-[237px] flex flex-col justify-center bg-white p-4 sm:p-8 rounded-3xl border border-border-design hover:border-brand-blue transition-colors group opacity-0">
              <div className="h-8 w-8 sm:h-11 sm:w-11 bg-brand-accent rounded-xl flex items-center justify-center text-white mb-3 sm:mb-6 group-hover:rotate-12 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-[15px] sm:text-[20px] leading-tight text-[#212529] mb-1">Certified Experts</h4>
              <p className="font-normal text-[11px] sm:text-[14px] leading-relaxed text-[#788796] line-clamp-2">High standards of care.</p>
            </div>

            <div className="wp-card min-h-[170px] sm:h-[237px] flex flex-col justify-center bg-white p-4 sm:p-8 rounded-3xl border border-border-design hover:border-brand-blue transition-colors group opacity-0">
              <div className="h-8 w-8 sm:h-11 sm:w-11 bg-brand-accent rounded-xl flex items-center justify-center text-white mb-3 sm:mb-6 group-hover:rotate-12 transition-transform">
                <Clock size={20} />
              </div>
              <h4 className="font-bold text-[15px] sm:text-[20px] leading-tight text-[#212529] mb-1">Flexible Hours</h4>
              <p className="font-normal text-[11px] sm:text-[14px] leading-relaxed text-[#788796] line-clamp-2">Fits into your busy life.</p>
            </div>

            <div className="wp-card min-h-[170px] sm:h-[237px] flex flex-col justify-center bg-white p-4 sm:p-8 rounded-3xl border border-border-design hover:border-brand-blue transition-colors group opacity-0">
              <div className="h-8 w-8 sm:h-11 sm:w-11 bg-brand-accent rounded-xl flex items-center justify-center text-white mb-3 sm:mb-6 group-hover:rotate-12 transition-transform">
                <Users size={20} />
              </div>
              <h4 className="font-bold text-[15px] sm:text-[20px] leading-tight text-[#212529] mb-1">Pet Community</h4>
              <p className="font-normal text-[11px] sm:text-[14px] leading-relaxed text-[#788796] line-clamp-2">Join our family of pet parents.</p>
            </div>

            <div className="wp-card min-h-[170px] sm:h-[237px] flex flex-col justify-center bg-white p-4 sm:p-8 rounded-3xl border border-border-design hover:border-brand-blue transition-colors group opacity-0">
              <div className="h-8 w-8 sm:h-11 sm:w-11 bg-brand-accent rounded-xl flex items-center justify-center text-white mb-3 sm:mb-6 group-hover:rotate-12 transition-transform">
                <Heart size={20} />
              </div>
              <h4 className="font-bold text-[15px] sm:text-[20px] leading-tight text-[#212529] mb-1">Genuine Love</h4>
              <p className="font-normal text-[11px] sm:text-[14px] leading-relaxed text-[#788796] line-clamp-2">Treating pets like family.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyPawwl;

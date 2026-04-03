import { ShieldCheck, Clock, Users, Heart, Share2, Radio } from "lucide-react";

const WhyPawwl = () => (
  <section className="py-24 bg-white">
    <div className="section-container">
      {/* Header Section */}
      <div className="flex flex-col justify-center items-center gap-4 mb-[72px]">
        <h2 className="font-extrabold text-[32px] md:text-[48px] text-center text-brand-dark leading-tight">Why Pawwl?</h2>
        <p className="font-normal text-[16px] md:text-[20px] leading-[1.4] text-center text-brand-dark max-w-2xl opacity-80 px-4">
          BarkBox isn't just a box of dog stuff. It's a monthly surprise that brings joy and enrichment to your pup's life.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        {/* Left Big Metric Card */}
        <div className="h-auto min-h-[400px] lg:h-[494px] w-full lg:w-[500px] flex flex-col justify-between bg-brand-accent p-8 md:p-14 rounded-[28px] transition-transform hover:scale-[1.02] duration-500">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
             <Radio size={24} />
          </div>
          <div className="space-y-4 mt-12 lg:mt-0">
            <h3 className="font-black text-[80px] sm:text-[100px] lg:text-[140px] leading-[0.8] text-white">50K+</h3>
            <p className="font-normal text-base text-white opacity-50">Pets cared for</p>
          </div>
        </div>

        {/* Right Feature Grid - Optimized with 2 cols on mobile */}
        <div className="grow grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-5">
          <div className="min-h-[170px] sm:h-[237px] flex flex-col justify-center bg-white p-4 sm:p-8 rounded-3xl border border-border-design hover:border-brand-blue transition-colors group">
            <div className="h-8 w-8 sm:h-11 sm:w-11 bg-brand-accent rounded-xl flex items-center justify-center text-white mb-3 sm:mb-6 group-hover:rotate-12 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-bold text-[15px] sm:text-[20px] leading-tight text-[#212529] mb-1">Certified Experts</h4>
            <p className="font-normal text-[11px] sm:text-[14px] leading-relaxed text-[#788796] line-clamp-2">High standards of care.</p>
          </div>

          <div className="min-h-[170px] sm:h-[237px] flex flex-col justify-center bg-white p-4 sm:p-8 rounded-3xl border border-border-design hover:border-brand-blue transition-colors group">
            <div className="h-8 w-8 sm:h-11 sm:w-11 bg-brand-accent rounded-xl flex items-center justify-center text-white mb-3 sm:mb-6 group-hover:rotate-12 transition-transform">
              <Clock size={20} />
            </div>
            <h4 className="font-bold text-[15px] sm:text-[20px] leading-tight text-[#212529] mb-1">Flexible Hours</h4>
            <p className="font-normal text-[11px] sm:text-[14px] leading-relaxed text-[#788796] line-clamp-2">Fits into your busy life.</p>
          </div>

          <div className="min-h-[170px] sm:h-[237px] flex flex-col justify-center bg-white p-4 sm:p-8 rounded-3xl border border-border-design hover:border-brand-blue transition-colors group">
            <div className="h-8 w-8 sm:h-11 sm:w-11 bg-brand-accent rounded-xl flex items-center justify-center text-white mb-3 sm:mb-6 group-hover:rotate-12 transition-transform">
              <Users size={20} />
            </div>
            <h4 className="font-bold text-[15px] sm:text-[20px] leading-tight text-[#212529] mb-1">Community 10K+</h4>
            <p className="font-normal text-[11px] sm:text-[14px] leading-relaxed text-[#788796] line-clamp-2">Join our pet parents.</p>
          </div>

          <div className="min-h-[170px] sm:h-[237px] flex flex-col justify-center bg-white p-4 sm:p-8 rounded-3xl border border-border-design hover:border-brand-blue transition-colors group">
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

export default WhyPawwl;

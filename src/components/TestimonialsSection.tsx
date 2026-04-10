import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
}

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

const StarRow = ({ count, color }: { count: number; color: string }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={color === "#5fa8d3" ? 20 : 16} 
        fill={i < count ? color : "transparent"} 
        className={i < count ? "text-transparent" : "text-[#dce6ee]"} 
      />
    ))}
  </div>
);

const TestimonialsSection = ({ 
  title = "What other Pawrents say", 
  subtitle = "Stories from pet parents who choose Pawwl with confidence.",
  testimonials 
}: TestimonialsSectionProps) => {
  const featured = testimonials[0];
  const secondary1 = testimonials[1];
  const secondary2 = testimonials[2];

  return (
    <section className="bg-white py-16 md:py-24 relative overflow-hidden">
      
      {/* Background Decorative Blob (Subtle) */}
      <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-[#1b4965] rounded-full opacity-[0.03] blur-[80px] pointer-events-none" />

      <div className="section-container">
        {/* Header Block */}
        <div className="flex flex-col justify-center items-center gap-3 mb-10 md:mb-[72px] px-4">
          <h2 className="font-extrabold text-[28px] md:text-[48px] text-center text-[#134e86] leading-tight">
            {title}
          </h2>
          <p className="font-normal text-[14px] md:text-[20px] leading-relaxed text-center text-[#134e86] max-w-2xl opacity-80">
            {subtitle}
          </p>
        </div>

        {/* 1. Desktop Layout (Bento Grid) - Hidden on Mobile */}
        <div className="hidden lg:flex lg:flex-row gap-8 items-stretch">
          
          {/* Left: Featured Large Card */}
          <div className="w-[598px] flex flex-col bg-[#1b4965] p-14 rounded-[28px] shadow-xl text-white relative group overflow-hidden">
            <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
              <Quote size={56} fill="white" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between gap-12 mt-12">
              <div className="flex flex-col gap-6">
                <p className="font-normal text-[32px] leading-[1.4] text-white">
                  {featured.quote}
                </p>
                <StarRow count={featured.rating} color="#5fa8d3" />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-solid border-[#dce6ee] p-0.5 overflow-hidden">
                  <img src={featured.avatar} alt={featured.name} className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-white">{featured.name}</span>
                  <span className="font-normal text-sm text-white opacity-50">{featured.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Secondary Stacked Cards */}
          <div className="flex-1 flex flex-col gap-6">
            {[secondary1, secondary2].map((t, i) => (
              <div key={i} className="flex-1 bg-white border border-solid border-[#dce6ee] p-8 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <div className="flex flex-col gap-4">
                  <StarRow count={t.rating} color="#1b4965" />
                  <p className="font-normal text-base leading-relaxed text-[#212529]">
                    {t.quote}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full border border-solid border-[#dce6ee] p-px overflow-hidden">
                    <img src={t.avatar} alt={t.name} className="w-full h-full rounded-full object-cover group-hover:scale-110 duration-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[#212529]">{t.name}</span>
                    <span className="font-normal text-xs text-[#788796]">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 2. Mobile Layout (Marquee) - Visible only on Mobile */}
      <div className="lg:hidden w-full overflow-hidden mt-4">
        <div className="flex gap-4 animate-marquee-mobile whitespace-nowrap px-6">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="w-[280px] shrink-0 bg-white border border-solid border-[#dce6ee] p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
              <StarRow count={t.rating} color="#1b4965" />
              <p className="font-normal text-[14px] leading-relaxed text-[#212529] whitespace-normal line-clamp-3">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
                <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full border border-[#dce6ee]" />
                <div className="flex flex-col">
                  <span className="font-bold text-[12px] text-[#212529]">{t.name}</span>
                  <span className="text-[10px] text-[#788796]">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "“Game-changer for our golden retriever. The staff truly cares.”",
    name: "Ayushi Mishra",
    role: "Dog Parent",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    featured: true,
  },
  {
    quote: "“Outstanding vet care. Every single visit is amazing.”",
    name: "Ankita Vashisht",
    role: "Cat Parent",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    featured: false,
  },
  {
    quote: "“My pup comes home tired and happy every single day!”",
    name: "Aarti Sharma",
    role: "Pet Parent",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    featured: false,
  },
];

const Stars = ({ count, color = "#5fa8d3", size = 20 }: { count: number; color?: string; size?: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={size} fill={color} className="text-transparent" />
    ))}
  </div>
);

const Testimonials = () => (
  <section className="py-24 bg-white flex flex-col items-center overflow-hidden">
    {/* Header Content */}
    <div className="max-w-[900px] w-full flex flex-col items-center gap-3 mb-16 px-6">
      <h2 className="font-extrabold text-[48px] text-center text-[#012169] leading-tight">
        What other Pawrents say
      </h2>
      <p className="font-normal text-[20px] leading-[24px] text-center text-[#134e86] opacity-80 max-w-[600px]">
        Stories from pet parents who choose Pawwl with confidence.
      </p>
    </div>

    {/* Bento Testimonials Grid */}
    <div className="section-container flex lg:flex-row flex-col gap-6 sm:gap-8">
      
      {/* Featured Testimonial (Left) */}
      <div className="lg:w-[598px] w-full bg-[#1b4965] p-8 sm:p-14 rounded-[32px] flex flex-col justify-between shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#BDE9F2] rounded-full blur-[100px] opacity-10 -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
        <div className="flex flex-col gap-6 sm:gap-10 relative z-10">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white/20 group-hover:rotate-12 transition-transform">
            <Quote size={32} fill="currentColor" className="opacity-40" />
          </div>
          <p className="font-bold text-[22px] sm:text-[32px] leading-[1.3] text-white">
            {testimonials[0].quote}
          </p>
          <div className="flex flex-col gap-6 sm:gap-8 mt-4 sm:mt-0">
            <Stars count={testimonials[0].rating} color="#5fa8d3" size={18} />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/20 p-0.5 overflow-hidden shadow-lg">
                <img src={testimonials[0].avatar} alt={testimonials[0].name} className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[16px] sm:text-lg text-white leading-tight tracking-wide">{testimonials[0].name}</span>
                <span className="font-medium text-[12px] sm:text-[14px] text-white/60">{testimonials[0].role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Testimonials (Right) */}
      <div className="lg:w-[500px] w-full flex flex-col gap-5">
        {testimonials.slice(1).map((t, i) => (
          <div key={i} className="flex-1 bg-white border border-[#dce6ee] p-6 sm:p-8 rounded-[32px] flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-brand-blue/20 transition-all group">
            <div className="flex flex-col gap-3 sm:gap-4">
              <Stars count={t.rating} color="#1b4965" size={14} />
              <p className="font-medium text-[14px] sm:text-[16px] leading-relaxed text-[#212529] opacity-90">
                {t.quote}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 sm:pt-6">
              <div className="w-10 h-10 rounded-full border border-[#dce6ee] p-0.5 overflow-hidden shadow-inner">
                <img src={t.avatar} alt={t.name} className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[14px] text-[#212529] leading-tight tracking-tight">{t.name}</span>
                <span className="font-medium text-[12px] text-[#788796]">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;

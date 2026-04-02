import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Our pup is happier and healthier than ever with Pawwl! The services are outstanding.",
    name: "Sarah Johnson",
    role: "Regular Customer",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    featured: true,
  },
  {
    quote: "Professional, caring, and reliable. Our cats have never been happier! Highly recommend their grooming.",
    name: "Michael Chen",
    role: "Cat Parent",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    featured: false,
  },
  {
    quote: "The products are outstanding. My pup has never been healthier or happier with Pawwl!",
    name: "Emily Davis",
    role: "Dog Mom",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    featured: false,
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, j) => (
      <Star key={j} size={16} className={j < count ? "fill-[#67B5D5] text-[#67B5D5]" : "text-gray-200"} />
    ))}
  </div>
);

const Testimonials = () => (
  <section className="py-24 bg-white relative overflow-hidden">
    {/* Background Decorative Element */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#BDE9F2] rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
    
    <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center relative z-10">
      <h2 className="text-5xl md:text-6xl font-heading font-black text-[#1A4B6B] mb-6">What other Pawrents say</h2>
      <p className="text-gray-400 font-medium text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
        Join the community of 10k+ happy pet parents who trust Pawwl with their furry family members.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Featured Left Card */}
        <div className="lg:col-span-5 bg-[#1A4B6B] rounded-[48px] p-12 text-left flex flex-col justify-between shadow-2xl relative">
          <div className="bg-white/10 w-16 h-16 rounded-3xl flex items-center justify-center text-[#67B5D5] mb-8">
            <Quote size={32} fill="currentColor" />
          </div>
          <div>
            <p className="text-white text-2xl font-bold leading-relaxed mb-10 italic">
              "{testimonials[0].quote}"
            </p>
            <div className="space-y-6">
              <Stars count={testimonials[0].rating} />
              <div className="flex items-center gap-4">
                <img src={testimonials[0].avatar} alt={testimonials[0].name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20" loading="lazy" />
                <div>
                  <p className="text-lg font-black text-white">{testimonials[0].name}</p>
                  <p className="text-white/60 font-bold uppercase tracking-wider text-xs">{testimonials[0].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smaller Cards on the Right */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {testimonials.slice(1).map((t, i) => (
            <div key={i} className="bg-white border-2 border-[#E9F7FB] rounded-[40px] p-10 text-left shadow-sm hover:shadow-md transition-all group flex-1 flex flex-col justify-between">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <p className="text-xl font-bold text-[#1A4B6B] leading-relaxed flex-1">"{t.quote}"</p>
                <Stars count={t.rating} />
              </div>
              <div className="flex items-center gap-4 border-t border-gray-100 pt-8">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-xl object-cover group-hover:scale-110 transition-transform" loading="lazy" />
                <div>
                  <p className="text-base font-black text-[#1A4B6B]">{t.name}</p>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;

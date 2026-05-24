import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="relative py-32 bg-[#1A4B6B] overflow-hidden">
    {/* Large "PAWWL" watermark text */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      <span className="text-[15rem] md:text-[25rem] lg:text-[35rem] font-heading font-black text-white/[0.03] leading-none tracking-tight">
        PAWWL
      </span>
    </div>
    
    {/* Decorative blur elements */}
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#67B5D5] rounded-full blur-[150px] opacity-20 -ml-40 -mb-40"></div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-[#BDE9F2] rounded-full blur-[150px] opacity-10 -mr-40 -mt-40"></div>

    <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center relative z-10">
      <h2 className="text-5xl md:text-7xl font-heading font-black text-white leading-tight mb-8">
        Ready to Give Your Pet<br />the Best Life?
      </h2>
      <p className="text-white/60 font-medium text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
        Wellness checkups, grooming, training — we're here for every wag and purr.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Button className="rounded-full bg-white hover:bg-gray-100 text-[#1A4B6B] px-12 py-8 text-lg font-bold shadow-2xl transition-all transform hover:-translate-y-1 flex items-center gap-2">
          Book Appointment
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
          </svg>
        </Button>
        <Button variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 px-12 py-8 text-lg font-bold backdrop-blur-sm transition-all">
          Explore Services
        </Button>
      </div>
    </div>
  </section>
);

export default CTASection;

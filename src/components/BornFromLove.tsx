import { Button } from "@/components/ui/button";
import bornFromLoveImg from "@/assets/born_from_love.png";

const stats = [
  { value: "8+", label: "Years of Experience" },
  { value: "50+", label: "Premium Products" },
  { value: "10K+", label: "Happy Customers" },
];

const BornFromLove = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#BDE9F2] rounded-[48px] rotate-2 -z-10 opacity-50 group-hover:rotate-0 transition-transform duration-500"></div>
          <img
            src={bornFromLoveImg}
            alt="Cat being pet"
            className="rounded-[40px] w-full aspect-square object-cover shadow-2xl relative z-10 scale-95 group-hover:scale-100 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        
        <div className="text-left">
          <span className="bg-[#BDE9F2] text-[#1A4B6B] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-6 shadow-sm">
            About Us
          </span>
          <h2 className="text-4xl md:text-6xl font-heading font-black text-[#1A4B6B] mb-8 leading-[1.1]">Born from Love.</h2>
          <p className="text-base md:text-lg text-gray-400 font-medium mb-10 leading-relaxed max-w-xl">
            Every pet deserves love, care, and the best quality products. We started Pawwl because we believe your pets are family — and family deserves the very best.
          </p>
          
          <Button className="rounded-full bg-[#1A4B6B] hover:bg-[#153a54] text-white px-10 py-7 text-base font-bold shadow-xl mb-12 transform hover:-translate-y-1 transition-all">
            Learn More
          </Button>

          <div className="grid grid-cols-3 gap-8 border-t border-gray-100 pt-12">
            {stats.map((s) => (
              <div key={s.label} className="text-left">
                <span className="text-4xl md:text-5xl font-heading font-black text-[#1A4B6B] block mb-2">{s.value}</span>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BornFromLove;

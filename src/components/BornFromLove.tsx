import { Button } from "@/components/ui/button";
import bornFromLoveImg from "@/assets/born_from_love.webp";

const stats = [
  { value: "8+", label: "Years of Experience" },
  { value: "50+", label: "Premium Products" },
  { value: "10K+", label: "Happy Customers" },
];

const BornFromLove = () => (
  <section className="py-12 bg-white">
    <div className="section-container">
      <div className="flex flex-col lg:flex-row items-center gap-10 bg-white">
        
        {/* Left Image Section */}
        <div className="w-full lg:w-[430px] h-[584px] rounded-[28px] overflow-hidden">
          <img 
            src={bornFromLoveImg} 
            alt="Born from Love" 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Right Content Section */}
        <div className="flex flex-col gap-8 flex-1">
          <div className="w-full flex flex-col justify-center bg-white border border-border-design rounded-3xl p-12">
            <div className="flex flex-col gap-6">
              <div className="w-fit bg-brand-light px-4 py-1.5 rounded-full border border-brand-accent">
                <span className="font-medium text-xs text-brand-accent">About Pawwl</span>
              </div>
              <h2 className="font-black text-[32px] md:text-[40px] lg:text-[52px] leading-tight text-[#212529]">Born from Love.</h2>
              <p className="font-normal text-[16px] leading-[26.4px] text-[#788796] max-w-md">
                Since 2018, we've grown from a small grooming studio to a full-spectrum pet care platform serving thousands of families.
              </p>
              <Button className="w-fit bg-brand-accent text-white px-8 py-3 h-auto rounded-full font-semibold text-sm hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-none">
                Learn About Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Stats Row - Always horizontal, optimized for mobile */}
          <div className="flex flex-row gap-3 sm:gap-5 px-1 sm:px-0">
            {[
              { label: "Years", val: "8+" },
              { label: "Experts", val: "50+" },
              { label: "Families", val: "10K+" }
            ].map((stat) => (
              <div key={stat.label} className="h-[90px] sm:h-[165px] flex-1 flex flex-col justify-center items-center bg-white rounded-2xl sm:rounded-[20px] border border-border-design hover:shadow-md transition-shadow">
                <span className="font-black text-[22px] sm:text-[44px] leading-none text-brand-accent mb-1">{stat.val}</span>
                <span className="font-normal text-[10px] sm:text-[14px] leading-tight text-[#788796]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </section>
);

export default BornFromLove;

import heroDog from "@/assets/hero-dog.png";

const Hero = () => (
  <section className="bg-white pt-6 pb-2 md:pb-6">
    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
      <div className="relative bg-[#BDE9F2] rounded-[48px] overflow-hidden min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
        {/* Background Text */}
        <h1 className="text-[6.5rem] sm:text-[10rem] md:text-[16rem] lg:text-[24rem] font-heading font-black text-[#1A4B6B] leading-none tracking-tight text-center select-none opacity-100 pointer-events-none">
          Pawwl
        </h1>
        
        {/* Floating Dog Image */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <img
            src={heroDog}
            alt="Dalmatian with ball"
            className="w-full max-w-[240px] md:max-w-[450px] lg:max-w-[550px] object-contain relative z-20 mb-[-2%]"
          />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;

import { ShieldCheck, Clock, Users, Heart, Share2, Radio } from "lucide-react";

const WhyPawwl = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center">
      <h2 className="text-4xl md:text-6xl font-heading font-black text-[#1A4B6B] mb-6 leading-[1.1]">Why Pawwl?</h2>
      <p className="text-base md:text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
        At Pawwl, we go beyond pet care - we build strong, joyful bonds between you and your cat.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Big Card */}
        <div className="lg:col-span-5 bg-[#1A4B6B] rounded-[48px] p-12 text-left relative overflow-hidden flex flex-col justify-between min-h-[400px] group hover:shadow-2xl transition-all duration-500">
          <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:rotate-12 transition-transform">
            <Radio size={24} />
          </div>
          <div>
            <span className="text-8xl md:text-9xl font-heading font-black text-white leading-none block mb-4">50K+</span>
            <p className="text-white/60 text-xl font-bold uppercase tracking-widest">Happy Pets</p>
          </div>
        </div>

        {/* Right Feature Cards Grid - 2 columns on mobile */}
        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mt-8 lg:mt-0">
          <div className="border-2 border-[#E9F7FB] rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-left hover:bg-[#F0F9FB] transition-colors group">
            <div className="bg-[#BDE9F2] w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-[#1A4B6B] mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={20} className="md:w-6 md:h-6" />
            </div>
            <h4 className="text-lg md:text-2xl font-black text-[#1A4B6B] mb-1 md:mb-2 leading-tight">Certified Experts</h4>
            <p className="text-gray-400 text-[10px] md:text-sm font-medium leading-relaxed">Licensed veterinarians and groomers</p>
          </div>

          <div className="border-2 border-[#E9F7FB] rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-left hover:bg-[#F0F9FB] transition-colors group">
            <div className="bg-[#BDE9F2] w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-[#1A4B6B] mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <Clock size={20} className="md:w-6 md:h-6" />
            </div>
            <h4 className="text-lg md:text-2xl font-black text-[#1A4B6B] mb-1 md:mb-2 leading-tight">Flexible Hours</h4>
            <p className="text-gray-400 text-[10px] md:text-sm font-medium leading-relaxed">Available when you need us most</p>
          </div>

          <div className="border-2 border-[#E9F7FB] rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-left hover:bg-[#F0F9FB] transition-colors group">
            <div className="bg-[#BDE9F2] w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-[#1A4B6B] mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <Users size={20} className="md:w-6 md:h-6" />
            </div>
            <h4 className="text-lg md:text-2xl font-black text-[#1A4B6B] mb-1 md:mb-2 leading-tight">Community 100%</h4>
            <p className="text-gray-400 text-[10px] md:text-sm font-medium leading-relaxed">Trusted by thousands of pet parents</p>
          </div>

          <div className="border-2 border-[#E9F7FB] rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-left hover:bg-[#F0F9FB] transition-colors group">
            <div className="bg-[#BDE9F2] w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-[#1A4B6B] mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <Heart size={20} className="md:w-6 md:h-6" />
            </div>
            <h4 className="text-lg md:text-2xl font-black text-[#1A4B6B] mb-1 md:mb-2 leading-tight">Breeds Care</h4>
            <p className="text-gray-400 text-[10px] md:text-sm font-medium leading-relaxed">Specialized care for every breed</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WhyPawwl;

import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

const PetGallery = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center">
      <h2 className="text-4xl md:text-6xl font-heading font-black text-[#1A4B6B] leading-[1.1] mb-8 max-w-4xl mx-auto">
        Whiskers, Tails, and Joyful Eyes<br className="hidden md:block" /> A Gallery Full of Love
      </h2>
      <p className="text-base md:text-lg text-gray-400 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
        Join thousands of heartwarming moments captured. Every frame, every wagging tail is a reminder of the love that connects us.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px] md:h-[700px]">
        {/* Tall Left Image */}
        <div className="rounded-[48px] overflow-hidden group shadow-xl h-full">
          <img
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=1200&fit=crop"
            alt="Dog in water"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8 h-full">
          {/* Top Horizontal Image */}
          <div className="rounded-[40px] overflow-hidden group shadow-xl flex-1">
            <img
              src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop"
              alt="Dog in city"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          </div>

          {/* Bottom Navy Card */}
          <div className="bg-[#1A4B6B] rounded-[40px] p-10 flex flex-col items-center justify-center text-white text-center group hover:bg-[#153a54] transition-all flex-1">
            <div className="bg-white/10 p-4 rounded-2xl mb-6 group-hover:rotate-12 transition-transform">
              <Instagram size={32} />
            </div>
            <h4 className="text-2xl font-black mb-2">Follow us on Instagram</h4>
            <p className="text-white/60 mb-8 font-medium">@pawwl_official</p>
            <Button className="rounded-full border-2 border-white/30 bg-transparent hover:bg-white hover:text-[#1A4B6B] text-white px-10 py-6 text-sm font-bold transition-all">
              Join Our Pack
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PetGallery;

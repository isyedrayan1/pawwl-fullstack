import heroDog from "@/assets/hero-dog.png";

const Hero = () => (
  <section className="relative bg-secondary overflow-hidden">
    <div className="container mx-auto px-4 py-10 md:py-16 relative">
      {/* Big Pawwl text */}
      <h1 className="text-7xl md:text-[10rem] lg:text-[12rem] font-heading font-black text-primary leading-none tracking-tight text-center select-none">
        Pawwl
      </h1>
      {/* Pet images overlaying the text */}
      <div className="flex justify-center items-end -mt-10 md:-mt-24 relative z-10 gap-3 md:gap-6">
        <img
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=250&fit=crop"
          alt="Golden retriever"
          className="w-24 md:w-40 h-32 md:h-52 object-cover rounded-2xl shadow-lg hidden md:block"
          loading="lazy"
        />
        <img
          src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=250&h=300&fit=crop"
          alt="Dog with scarf"
          className="w-28 md:w-48 h-36 md:h-60 object-cover rounded-2xl shadow-lg"
          loading="lazy"
        />
        <img
          src={heroDog}
          alt="Dalmatian with ball"
          className="w-32 md:w-52 h-40 md:h-64 object-contain relative z-20"
        />
        <img
          src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=250&fit=crop"
          alt="Cute cat"
          className="w-24 md:w-40 h-32 md:h-52 object-cover rounded-2xl shadow-lg"
          loading="lazy"
        />
        <img
          src="https://images.unsplash.com/photo-1583337130417-13104dec14a3?w=200&h=250&fit=crop"
          alt="Small dog"
          className="w-24 md:w-40 h-32 md:h-52 object-cover rounded-2xl shadow-lg hidden md:block"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);

export default Hero;

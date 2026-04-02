const Hero = () => (
  <section className="relative bg-secondary overflow-hidden">
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-primary leading-none tracking-tight">
          Pawwl
        </h1>
        <p className="mt-4 text-primary/80 text-lg max-w-md mx-auto md:mx-0">
          Premium pet care products & services your furry friends deserve.
        </p>
      </div>
      <div className="flex-1 flex justify-center">
        <img
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=500&fit=crop"
          alt="Happy dog with accessories"
          className="rounded-2xl w-full max-w-md object-cover shadow-xl"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);

export default Hero;

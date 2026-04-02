import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="relative py-24 bg-primary overflow-hidden">
    {/* Faint "PAWWL" watermark text */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      <span className="text-[8rem] md:text-[14rem] font-heading font-black text-primary-foreground/5 leading-none">
        PAWWL
      </span>
    </div>
    <div className="container mx-auto px-4 text-center relative z-10">
      <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground leading-tight">
        Ready to Give Your Pet<br />the Best Life?
      </h2>
      <p className="mt-4 text-sm text-primary-foreground/70 max-w-md mx-auto">
        Discover premium products, grooming, training, and vet services — everything your pet needs in one place.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 h-11 text-sm font-semibold">
          Explore Products
        </Button>
        <Button variant="outline" className="rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 h-11 text-sm font-semibold">
          Book a Session
        </Button>
      </div>
    </div>
  </section>
);

export default CTASection;

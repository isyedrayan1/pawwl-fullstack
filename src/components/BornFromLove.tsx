import { Button } from "@/components/ui/button";

const stats = [
  { value: "8+", label: "Years of Experience" },
  { value: "50+", label: "Premium Products" },
  { value: "10K+", label: "Happy Customers" },
];

const BornFromLove = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=400&fit=crop"
            alt="Cat with blue collar"
            className="rounded-2xl w-full object-cover shadow-lg"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-secondary font-semibold text-xs uppercase tracking-widest">Pawwl</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-2">Born from Love.</h2>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            Every pet deserves love, care, and the best quality products. We started Pawwl because we believe your pets are family — and family deserves the very best.
          </p>
          <Button className="mt-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
            Learn More
          </Button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center border border-border rounded-2xl p-6">
            <span className="text-3xl md:text-4xl font-heading font-black text-primary">{s.value}</span>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BornFromLove;

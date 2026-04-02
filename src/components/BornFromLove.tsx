const stats = [
  { value: "8+", label: "Years of Experience" },
  { value: "50+", label: "Premium Products" },
  { value: "10K+", label: "Happy Customers" },
];

const BornFromLove = () => (
  <section className="py-20 bg-warm-gray">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=400&fit=crop"
            alt="Happy dogs together"
            className="rounded-2xl w-full object-cover shadow-lg"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider">Pawwl</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-2">Born from Love.</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Every pet deserves love, care, and the best quality products. We started Pawwl because we believe your pets are family — and family deserves the very best.
          </p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center bg-background rounded-2xl p-6 shadow-sm">
            <span className="text-3xl md:text-4xl font-heading font-black text-primary">{s.value}</span>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BornFromLove;

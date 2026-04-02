import { Button } from "@/components/ui/button";

const blogs = [
  {
    title: "Premium Grooming Care",
    desc: "Grooming isn't just about keeping your dog clean — it's about their health. Learn our top tips for at-home grooming that rivals the pros.",
    img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=300&fit=crop",
  },
  {
    title: "Premium Grooming Care",
    desc: "Discover the best grooming tools and techniques that professional groomers use daily. Keep your pet looking and feeling their best.",
    img: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=500&h=300&fit=crop",
  },
];

const Blogs = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Blogs</h2>
      <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
        Just like humans, best of blog stuff. Our monthly supplies and blogs will enrich your pup's life.
      </p>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {blogs.map((b, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-border text-left group hover:shadow-lg transition-shadow">
            <img src={b.img} alt={b.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            <div className="p-5">
              <h3 className="font-heading font-bold text-lg text-primary">{b.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{b.desc}</p>
              <Button className="mt-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs">Read More</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Blogs;

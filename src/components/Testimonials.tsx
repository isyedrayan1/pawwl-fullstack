import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Game-changer for our golden retriever. The staff truly cares.",
    name: "Sarah Johnson",
    role: "Dog Mom",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    featured: true,
  },
  {
    quote: "Professional, caring, and reliable. Our cats have never been happier!",
    name: "Michael Chen",
    role: "Cat Dad",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    featured: false,
  },
  {
    quote: "The products are outstanding. My pup has never been healthier or happier with Pawwl!",
    name: "Emily Davis",
    role: "Pet Parent",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    featured: false,
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, j) => (
      <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
    ))}
  </div>
);

const Testimonials = () => (
  <section className="py-20 bg-muted">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">What other Pawrents say</h2>
      <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
        Joined from pet parents who choose Pawwl with confidence.
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-6 items-stretch">
        {/* Featured large card */}
        <div className="bg-primary rounded-2xl p-7 text-left flex flex-col justify-between">
          <div>
            <span className="text-5xl font-heading text-primary-foreground/20 leading-none">{"\u201C"}{"\u201C"}</span>
            <p className="text-primary-foreground text-sm leading-relaxed mt-2">
              "{testimonials[0].quote}"
            </p>
          </div>
          <div className="mt-6">
            <Stars count={testimonials[0].rating} />
            <div className="flex items-center gap-3 mt-3">
              <img src={testimonials[0].avatar} alt={testimonials[0].name} className="w-9 h-9 rounded-full object-cover" loading="lazy" />
              <div>
                <p className="text-xs font-semibold text-primary-foreground">{testimonials[0].name}</p>
                <p className="text-xs text-primary-foreground/60">{testimonials[0].role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Smaller cards */}
        <div className="flex flex-col gap-6 md:col-span-2">
          {testimonials.slice(1).map((t, i) => (
            <div key={i} className="bg-background rounded-2xl p-5 text-left shadow-sm flex-1">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-foreground leading-relaxed flex-1">"{t.quote}"</p>
                <Stars count={t.rating} />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="text-xs font-semibold text-primary">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;

import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Game-changer for our golden retriever. The staff truly cares.",
    name: "Sarah Johnson",
    role: "Dog Mom",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    quote: "Professional, caring, and reliable. Our cats love their grooming sessions here!",
    name: "Michael Chen",
    role: "Cat Dad",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    quote: "The products are outstanding. My pup has never been healthier or happier!",
    name: "Emily Davis",
    role: "Pet Parent",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
];

const Testimonials = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">What other Pawrents say</h2>
      <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm">
        Join thousands of pet parents who choose Pawwl with confidence.
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-muted rounded-2xl p-6 text-left relative">
            <span className="text-4xl font-heading text-primary/20 absolute top-4 left-5">"</span>
            <div className="flex gap-0.5 mb-4 mt-2">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-foreground leading-relaxed">"{t.quote}"</p>
            <div className="mt-5 flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
              <div>
                <p className="text-sm font-semibold text-primary">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;

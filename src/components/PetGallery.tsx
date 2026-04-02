import { Button } from "@/components/ui/button";

const images = [
  "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=350&fit=crop",
  "https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=400&h=350&fit=crop",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=350&fit=crop",
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=350&fit=crop",
];

const PetGallery = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight">
        Whiskers, Tails, and Joyful Eyes A<br />Gallery Full of Love
      </h2>
      <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
        Join thousands of heartwarming moments captured. Every frame, every wagging tail is a reminder of the love that connects us.
      </p>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 relative">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Pet gallery ${i + 1}`}
            className="rounded-2xl w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ))}
      </div>
      <div className="mt-6 inline-flex items-center gap-3 bg-primary rounded-full px-6 py-3">
        <span className="text-primary-foreground text-sm font-medium">Join our pack</span>
        <Button size="sm" variant="outline" className="rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-xs h-7 px-3">
          Join Us
        </Button>
      </div>
    </div>
  </section>
);

export default PetGallery;

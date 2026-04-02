import { Button } from "@/components/ui/button";

const images = [
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=350&fit=crop",
  "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=350&fit=crop",
  "https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=400&h=350&fit=crop",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=350&fit=crop",
];

const PetGallery = () => (
  <section className="py-20 bg-warm-gray">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
        Whiskers, Tails, and Joyful Eyes<br />A Gallery Full of Love
      </h2>
      <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm">
        Join thousands of happy pet parents. Capture precious moments and share the joy of pet parenthood.
      </p>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 relative">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Pet gallery ${i + 1}`}
            className="rounded-2xl w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform"
            loading="lazy"
          />
        ))}
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
          <Button className="rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
            Join our pack 🐾
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default PetGallery;

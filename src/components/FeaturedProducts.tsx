import { Button } from "@/components/ui/button";

const mainProduct = {
  title: "Super Chewer",
  desc: "Durable toys and treats for aggressive chewers. Built tough for your toughest pup.",
  img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
};

const sideProducts = [
  { title: "Super Chewer", desc: "Premium dental chews that clean while they play. Vet-recommended formula for healthy teeth and gums." },
  { title: "Super Chewer", desc: "All-natural bully sticks, slow-roasted for irresistible flavor and long-lasting chewing satisfaction." },
];

const smallProducts = [
  { name: "Tasty Cat Long Food", img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=200&fit=crop", price: "$24.99" },
  { name: "Tasty Cat Long Food", img: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=300&h=200&fit=crop", price: "$19.99" },
  { name: "Tasty Cat Biting Food", img: "https://images.unsplash.com/photo-1583337130417-13104dec14a3?w=300&h=200&fit=crop", price: "$29.99" },
];

const categories = [
  {
    name: "Make Rough of Accessories for Pets",
    desc: "Explore our wide range of premium accessories designed for comfort and style.",
    img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=200&fit=crop",
  },
  {
    name: "Best Dog Care in Town",
    desc: "Professional grooming, vet care, and training services your pet will love.",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=200&fit=crop",
  },
];

const FeaturedProducts = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      {/* Main product row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-teal-light rounded-2xl p-6 flex flex-col">
          <h3 className="font-heading text-xl font-bold text-primary mb-1">{mainProduct.title}</h3>
          <p className="text-xs text-muted-foreground mb-4">{mainProduct.desc}</p>
          <img src={mainProduct.img} alt="Super Chewer treats" className="rounded-xl w-full object-cover h-48 mt-auto" loading="lazy" />
          <Button variant="link" className="mt-3 self-start text-primary font-semibold p-0 text-sm">Learn More →</Button>
        </div>
        <div className="flex flex-col gap-4">
          {sideProducts.map((p, i) => (
            <div key={i} className="border border-border rounded-2xl p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-primary">{p.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 self-start rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs">
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Small product cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {smallProducts.map((p, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-border group hover:shadow-lg transition-shadow">
            <img src={p.img} alt={p.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            <div className="p-3">
              <p className="text-xs font-medium text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category cards — 2 wide cards with images */}
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((c) => (
          <div key={c.name} className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <img src={c.img} alt={c.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            <div className="absolute inset-0 bg-primary/60 flex flex-col justify-end p-5">
              <h4 className="text-sm font-bold text-primary-foreground">{c.name}</h4>
              <p className="text-xs text-primary-foreground/80 mt-1">{c.desc}</p>
              <Button size="sm" variant="outline" className="mt-3 self-start rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-xs">
                Explore Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProducts;

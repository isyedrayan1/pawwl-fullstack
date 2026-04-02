import { Award, Clock, Users, Heart } from "lucide-react";

const features = [
  { icon: Award, title: "Certified Experts", desc: "Licensed veterinarians and groomers" },
  { icon: Clock, title: "Flexible Hours", desc: "Available when you need us" },
  { icon: Users, title: "Community 100%", desc: "Trusted by thousands of pet parents" },
  { icon: Heart, title: "Breeds Care", desc: "Specialized care for every breed" },
];

const WhyPawwl = () => (
  <section className="py-20 bg-warm-gray">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Why Pawwl?</h2>
      <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
        Trusted by pet parents everywhere. We provide expert-backed, quality care and products for your best friend.
      </p>

      <div className="mt-12 grid md:grid-cols-5 gap-8 items-center">
        <div className="md:col-span-2 bg-primary rounded-2xl p-8 text-center text-primary-foreground">
          <span className="text-6xl md:text-7xl font-heading font-black">50K+</span>
          <p className="mt-2 text-sm opacity-80">Pets served & counting</p>
        </div>

        <div className="md:col-span-3 grid grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-background rounded-2xl p-5 text-left shadow-sm hover:shadow-md transition-shadow">
              <f.icon size={28} className="text-secondary mb-3" />
              <h4 className="font-semibold text-primary text-sm">{f.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyPawwl;

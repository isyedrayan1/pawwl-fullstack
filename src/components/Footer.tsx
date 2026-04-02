import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const columns = [
  { title: "Quick links", links: ["Home", "About Us", "Services", "Products"] },
  { title: "Services", links: ["Grooming", "Training", "Vet Care", "Boarding"] },
  { title: "Support", links: ["Help Center", "Contact", "Returns", "FAQ"] },
];

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    {/* Newsletter */}
    <div className="border-b border-primary-foreground/10 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg">Newsletter Signup</h3>
            <p className="text-xs text-primary-foreground/60 mt-1">Get the latest tips, products, and updates delivered to your inbox.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Input placeholder="Enter your email" className="rounded-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 h-10 md:w-64" />
            <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 h-10 text-sm shrink-0">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Footer content */}
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <span className="text-2xl font-heading font-bold">Pawwl</span>
          <p className="text-xs text-primary-foreground/50 mt-3 leading-relaxed">
            Premium pet care products and services. Because your pets deserve the best life possible.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/30">
        &copy; 2026 Pawwl. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

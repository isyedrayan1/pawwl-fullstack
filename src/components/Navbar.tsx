import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = ["Home", "About Us", "Our Products", "Pet News", "Contact"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <span className="text-2xl font-heading font-bold text-primary">Pawwl</span>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase().replace(/\s/g, "-")}`} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <button className="p-2 hover:bg-muted rounded-full transition-colors"><Search size={18} /></button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors"><ShoppingCart size={18} /></button>
          <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6">Pet Profile</Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4">
          <ul className="flex flex-col gap-3 py-3">
            {navLinks.map((l) => (
              <li key={l}><a href={`#${l.toLowerCase().replace(/\s/g, "-")}`} className="text-sm font-medium">{l}</a></li>
            ))}
          </ul>
          <Button className="w-full rounded-full bg-secondary text-secondary-foreground">Pet Profile</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { ShoppingBasket, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About", href: "#" },
  { name: "Services", href: "#", hasDropdown: true },
  { name: "Categories", href: "#", hasDropdown: true },
  { name: "Products", href: "#", hasDropdown: true },
  { name: "Blogs", href: "#" },
  { name: "Careers", href: "#" },
  { name: "Contact", href: "#" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border-design h-[75px] flex items-center">
      <div className="section-container flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <span className="text-[28px] font-bold text-brand-accent leading-[42px]">Pawwl</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-[40px]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                link.name === "Home" ? "text-brand-accent" : "text-foreground"
              } hover:text-brand-blue`}
            >
              {link.name}
              {link.hasDropdown && (
                <svg
                  className="w-3 h-3 opacity-60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </a>
          ))}
        </div>

        {/* Icons and Action Button */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-brand-accent hover:bg-brand-light rounded-full transition-colors">
              <ShoppingBasket size={24} strokeWidth={2} />
            </button>
            <button className="p-2.5 text-brand-accent hover:bg-brand-light rounded-full transition-colors">
              <Heart size={24} strokeWidth={2} />
            </button>
          </div>
          <Button className="bg-brand-blue hover:bg-brand-dark text-white px-5 py-3 rounded-xl text-[16px] font-bold leading-[20px] shadow-none h-auto transition-all active:scale-95">
            Contact Us
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-brand-accent"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Design Overlay */}
      {mobileOpen && (
        <div className="absolute top-[75px] left-0 w-full bg-white border-b border-border-design p-6 md:hidden shadow-xl animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-lg font-bold text-brand-dark flex items-center justify-between"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                  {link.hasDropdown && <span className="opacity-40 text-sm">▼</span>}
                </a>
              </li>
            ))}
          </ul>
          <Button className="w-full bg-brand-blue text-white py-6 text-lg font-bold mt-6 rounded-xl">
            Contact Us
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

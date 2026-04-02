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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto max-w-7xl flex items-center justify-between py-4 px-4 md:px-6">
        <span className="text-3xl font-heading font-black text-[#1A4B6B] tracking-tight">Pawwl</span>

        {/* Desktop links */}
        <ul className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className="text-[15px] font-semibold text-gray-600 hover:text-[#1A4B6B] transition-colors flex items-center gap-1"
              >
                {link.name}
                {link.hasDropdown && (
                  <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors relative">
              <ShoppingBasket size={22} strokeWidth={2} />
            </button>
            <button className="p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors">
              <Heart size={22} strokeWidth={2} />
            </button>
          </div>
          <Button className="rounded-full bg-[#1A4B6B] hover:bg-[#153a54] text-white px-8 py-6 text-base font-bold shadow-sm">
            Contact Us
          </Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-6 shadow-xl animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="text-lg font-bold text-gray-800 flex items-center justify-between">
                  {link.name}
                  {link.hasDropdown && <span className="text-gray-400">+</span>}
                </a>
              </li>
            ))}
          </ul>
          <Button className="w-full rounded-full bg-[#1A4B6B] text-white py-6 text-lg font-bold mt-2">
            Contact Us
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

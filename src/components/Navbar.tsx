import { ShoppingBasket, Heart, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services", hasDropdown: true },
  { name: "Categories", href: "#", hasDropdown: true },
  { name: "Products", href: "/products", hasDropdown: true },
  { name: "Blogs", href: "/#" },
  { name: "Careers", href: "/careers" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // 1. Only hide if we've scrolled more than 10px (debouncing small movements)
      if (Math.abs(prevScrollPos - currentScrollPos) < 10) return;

      // 2. Determine visibility
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 80;
      
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
      setHasScrolled(currentScrollPos > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] bg-white transition-all duration-300 ease-in-out h-[75px] flex items-center w-full ${
          visible ? "translate-y-0 shadow-sm" : "-translate-y-full"
        } ${hasScrolled ? "border-b border-[#dce6ee]" : "border-none"}`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-[141px] flex items-center justify-between h-full">
        {/* Logo Section */}
        <Link to="/" className="flex items-center">
          <span className="text-[28px] font-bold text-brand-dark leading-[42px] tracking-tight">Pawwl</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-[32px] 2xl:gap-[40px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-all flex items-center gap-1.5 py-2 relative group ${
                (location.pathname === link.href || (location.pathname === "/" && link.name === "Home")) ? "text-brand-accent" : "text-brand-dark"
              } hover:text-brand-blue`}
            >
              {link.name}
              {link.hasDropdown && (
                <ChevronDown size={14} className={`opacity-40 transition-transform group-hover:rotate-180`} />
              )}
              {/* Active Indicator */}
              {(location.pathname === link.href || (location.pathname === "/" && link.name === "Home")) && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-accent rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Icons and Action Button */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <div className="flex items-center gap-1">
            <button className="p-2 text-brand-dark hover:text-brand-blue hover:bg-brand-light rounded-full transition-all">
              <ShoppingBasket size={22} strokeWidth={2.5} />
            </button>
            <button className="p-2 text-brand-dark hover:text-brand-blue hover:bg-brand-light rounded-full transition-all">
              <Heart size={22} strokeWidth={2.5} />
            </button>
          </div>
          <Button asChild className="bg-brand-blue hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl text-[14px] font-bold shadow-sm h-auto transition-all active:scale-95 border-none">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="xl:hidden p-2 text-brand-dark"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Design Overlay */}
      {mobileOpen && (
        <div className="absolute top-[75px] left-0 w-full bg-white border-b border-[#dce6ee] p-6 lg:hidden shadow-2xl animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className={`text-lg font-bold flex items-center justify-between ${
                    location.pathname === link.href ? "text-brand-accent" : "text-brand-dark"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={18} className="opacity-40" />}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild className="w-full bg-brand-blue text-white py-6 text-lg font-bold mt-8 rounded-xl shadow-lg border-none hover:bg-brand-dark">
            <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact Us</Link>
          </Button>
        </div>
      )}
      </nav>
      <div className="h-[75px]" />
    </>
  );
};

export default Navbar;

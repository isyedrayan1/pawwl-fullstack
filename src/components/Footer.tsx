import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";

const quickLinks = ["Home", "About", "Services", "Products", "Blogs", "Careers"];
const services = ["Vet Care", "Grooming", "Pet Day Care", "Boarding", "Vaccination", "Pet Training"];

const Footer = () => (
  <footer className="bg-[#1A4B6B] overflow-hidden relative pb-16">
    <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
      
      {/* 1. CTA Part (H: 770px) */}
      <div className="min-h-[500px] md:h-[700px] relative flex flex-col items-center justify-center text-center">
        
        {/* Large "PAWWL" watermark background - refined for mobile fit */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[6.5rem] sm:text-[10rem] md:text-[16rem] lg:text-[20rem] font-heading font-black text-white/[0.06] leading-none tracking-tighter uppercase">
            PAWWL
          </span>
        </div>

        {/* Decorative Circles - enhanced visibility */}
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-white/[0.07] rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[5%] w-[500px] h-[500px] bg-white/[0.05] rounded-full blur-[60px] pointer-events-none"></div>

        <div className="max-w-[1000px] relative z-10 flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-[1.15] mb-8">
            Ready to Give Your Pet<br />the Best Life?
          </h2>
          <p className="text-white/60 font-medium text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
            Wellness checkups, grooming, training — we're here<br className="hidden md:block" /> for every wag and purr.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button className="rounded-full bg-white hover:bg-gray-100 text-[#1A4B6B] px-10 py-4 text-base font-bold shadow-2xl transition-all transform hover:-translate-y-1 flex items-center gap-3">
              Book Appointment
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
              </svg>
            </button>
            <button className="rounded-full border-2 border-white/30 bg-transparent hover:bg-white hover:text-[#1A4B6B] text-white px-10 py-4 text-base font-bold transition-all">
              Explore Services
            </button>
          </div>
        </div>
      </div>

      {/* 2. Newsletter Signup Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-16 border-b border-white/5">
        <div>
          <h3 className="text-2xl font-heading font-black mb-2 text-white">Newsletter Signup</h3>
          <p className="text-white/40 text-sm font-medium">Get the latest pet care tips and exclusive offers delivered to your inbox.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Input 
            placeholder="Your Email Address" 
            className="rounded-full bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 md:w-80 px-6 focus-visible:ring-[#67B5D5]" 
          />
          <Button className="rounded-full bg-white hover:bg-gray-100 text-[#1A4B6B] px-8 h-12 text-sm font-bold shadow-xl">
            Subscribe
          </Button>
        </div>
      </div>

      {/* 3. Main Footer Links Area (Tighter Vertical Spacing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 pb-10">
        {/* Logo & Description */}
        <div className="flex flex-col">
          <span className="text-2xl font-heading font-black block mb-6 text-white tracking-widest uppercase">Pawwl</span>
          <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[280px]">
            Your trusted partner in pet care. We provide premium services and products for your beloved companions.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h4 className="text-sm font-black mb-6 text-white uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link}>
                <a href="#" className="text-white/40 hover:text-white transition-colors text-sm font-medium">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="flex flex-col">
          <h4 className="text-sm font-black mb-6 text-white uppercase tracking-wider">Services</h4>
          <ul className="space-y-3">
            {services.map((link) => (
              <li key={link}>
                <a href="#" className="text-white/40 hover:text-white transition-colors text-sm font-medium">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div className="flex flex-col">
          <h4 className="text-sm font-black mb-6 text-white uppercase tracking-wider">Contact</h4>
          <ul className="space-y-5">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-white/30 shrink-0" />
              <span className="text-white/40 text-sm font-medium leading-relaxed">
                123 Pet Avenue, New York,<br />NY 10001
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-white/30 shrink-0" />
              <span className="text-white/40 text-sm font-medium">+1 (555) 234-5678</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-white/30 shrink-0" />
              <span className="text-white/40 text-sm font-medium">hello@pawwl.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Bottom Bar (Moved Upward) */}
      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-white/20">
        <p>&copy; 2026 Pawwl Pet Services. All Rights Reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

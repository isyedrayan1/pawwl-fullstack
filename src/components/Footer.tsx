import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PawwlWatermark from "./PawwlWatermark";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Products", path: "/products" },
  { label: "Blogs", path: "/" },
  { label: "Careers", path: "/careers" }
];

const services = [
  { label: "Vet Care", path: "/services" },
  { label: "Grooming", path: "/services" },
  { label: "Pet Day Care", path: "/services" },
  { label: "Boarding", path: "/services" },
  { label: "Vaccination", path: "/services" },
  { label: "Pet Training", path: "/services" }
];

const Footer = () => (
  <footer className="w-full flex flex-col bg-[#1b4965]">
    
    {/* 1. Large CTA Section (h-[770px]) */}
    <div className="relative w-full lg:h-[770px] min-h-[600px] flex flex-col items-center justify-center text-center px-6 overflow-hidden text-white font-body selection:bg-brand-blue selection:text-white">
      {/* Background Decorative Circles (Extreme Corners) */}
      <div className="absolute -top-[150px] -right-[150px] w-[300px] h-[300px] bg-white/5 rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-[200px] -left-[200px] w-[400px] h-[400px] bg-white/5 rounded-full pointer-events-none z-0"></div>

      {/* Professional SVG Watermark Background - Optimized for mobile visibility */}
      <PawwlWatermark 
        className="absolute w-[90%] sm:w-[80%] lg:w-[1000px] h-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -mt-[19px] z-10 text-white" 
        opacity={0.03}
      />

      {/* CTA Content Container */}
      <div className="relative z-20 flex flex-col items-center gap-12 section-container w-full">
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-black text-[40px] md:text-[60px] lg:text-[80px] leading-[1.1] text-white text-center max-w-[1100px]">
            Ready to Give Your Pet <br className="hidden md:block" /> the Best Life?
          </h2>
          <p className="font-normal text-[18px] md:text-[20px] leading-relaxed text-white opacity-90 max-w-lg">
            Wellness checkups, grooming, training — we're here for every wag and purr.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link to="/contact">
            <Button className="bg-[#e8f0f6] hover:bg-white text-[#1b4965] px-10 py-7 rounded-full font-semibold text-[16px] shadow-xl hover:shadow-white/10 transition-all flex items-center gap-3 active:scale-95 h-auto">
              Book Appointment
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="outline" className="border-2 border-white hover:bg-white/10 text-white px-10 py-7 rounded-full font-semibold text-[16px] transition-all h-auto bg-transparent hover:text-white">
              Explore Services
            </Button>
          </Link>
        </div>
      </div>
    </div>

    {/* 2. Newsletter Row (h-[114px] base) */}
    <div className="w-full bg-[#1b4965] flex justify-center text-white">
      <div className="section-container flex flex-col lg:flex-row items-center justify-between gap-8 py-10 lg:h-[114px] border-y border-white/20">
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h3 className="font-bold text-[24px] leading-tight text-white tracking-tight">Newsletter Signup</h3>
          <p className="font-normal text-[14px] text-white opacity-70">Get the latest pet care tips and exclusive offers delivered to your inbox.</p>
        </div>
        
        <div className="flex w-full lg:w-[404px] gap-2">
          <Input 
            placeholder="Your Email Address" 
            className="flex-1 bg-white border-white rounded-xl h-11 px-4 text-brand-dark focus:ring-brand-light placeholder:text-gray-400" 
          />
          <Button className="bg-[#e8f0f6] hover:bg-white text-[#1b4965] h-11 px-8 rounded-xl font-medium transition-colors">
            Subscribe
          </Button>
        </div>
      </div>
    </div>

    {/* 3. Main Footer Layout */}
    <div className="w-full bg-[#1b4965] flex justify-center text-white">
      <div className="section-container flex flex-col gap-8 pt-10 pb-8">
        
        {/* Brand Row (Big Logo on Left, Description on Right) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/10">
          {/* Big Logo & Name on the Left */}
          <div className="flex items-center gap-5 group">
            <img 
              src="/pawwl-logo-main-croped.webp" 
              alt="Pawwl Logo" 
              className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] object-contain transition-transform duration-500" 
            />
            <div className="flex flex-col items-start text-left">
              <span className="font-black text-[36px] md:text-[44px] text-white tracking-tighter antialiased leading-none">Pawwl</span>
              <span className="text-[14px] font-bold text-white/50 uppercase tracking-[0.2em] mt-1">One stop pet care</span>
            </div>
          </div>

          {/* Description on the Right */}
          <div className="flex-1 max-w-[500px] md:text-right">
            <p className="font-normal text-[16px] md:text-[18px] leading-relaxed text-white opacity-80 text-center md:text-right italic">
              "Your trusted partner in pet care. We provide premium services and products for your beloved companions since 2026."
            </p>
          </div>
        </div>

        {/* Links & Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div className="flex flex-col gap-4 text-white">
            <h4 className="font-bold text-[15px] text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="font-normal text-[14px] text-white opacity-60 hover:opacity-100 hover:translate-x-1 transition-all inline-block">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-4 text-white">
            <h4 className="font-bold text-[15px] text-white uppercase tracking-wider">Services</h4>
            <ul className="flex flex-col gap-2">
              {services.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="font-normal text-[14px] text-white opacity-60 hover:opacity-100 hover:translate-x-1 transition-all inline-block">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-4 text-white lg:col-span-1">
            <h4 className="font-bold text-[15px] text-white uppercase tracking-wider">Get in Touch</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-white/40 shrink-0 mt-1" />
                <span className="font-normal text-[14px] opacity-80 leading-relaxed">
                  Shop No, 4–5–6, Joy Homes CHS Rd, Kashi Nagar, Valmik Nagar, Bhandup West, Mumbai 400078
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-white/40 shrink-0" />
                <span className="font-normal text-[14px] opacity-80">+91 72088 13649</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-white/40 shrink-0" />
                <span className="font-normal text-[14px] opacity-80">hello@pawwl.com</span>
              </li>
            </ul>
          </div>

          {/* Map Section */}
          <div className="flex flex-col gap-4 text-white">
            <h4 className="font-bold text-[15px] text-white uppercase tracking-wider">Find Us</h4>
            <div className="w-full h-[120px] rounded-2xl overflow-hidden border border-white/10 shadow-inner group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d120617.49138228265!2d72.8124078!3d19.1384897!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b9d45d3f805d%3A0x6577fdc07c82a5d9!2sPawwl%20One%20stop%20pet%20care%20%7C%20Best%20Pet%20clinic%20and%20shop%20in%20Bhandup!5e0!3m2!1sen!2sin!4v1776378473997!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(150%) brightness(90%)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                className="opacity-50 group-hover:opacity-80 transition-opacity duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 4. Copyright Bar (h-[67px]) */}
    <div className="w-full bg-[#1b4965] flex justify-center text-white">
      <div className="section-container flex flex-col md:flex-row justify-between items-center gap-4 py-4 lg:h-[60px] border-t border-white/20 text-[12px]">
        <p className="opacity-60 font-normal">© 2026 Pawwl Pet Services. All Rights Reserved.</p>
        <div className="flex gap-10">
          <a href="#" className="opacity-60 hover:opacity-100 transition-opacity underline-offset-4 hover:underline">Privacy Policy</a>
          <a href="#" className="opacity-60 hover:opacity-100 transition-opacity underline-offset-4 hover:underline">Terms of Use</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

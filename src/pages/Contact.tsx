import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Calendar, ArrowRight } from "lucide-react";
import ScheduleSession from "@/components/ScheduleSession";
import SEO from "@/components/SEO";

const Contact = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gs-reveal").forEach((el) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true }
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);




  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <SEO 
        title="Contact Us | Visit Pawwl Mumbai Office"
        description="Get in touch with Mumbai's best pet care studio. Located in Bhandup West. Contact us for vet appointments, grooming sessions, or pet supplies."
        url="https://pawwl.com/contact"
      />
      <Navbar />

      {/* Hero & Contact Info */}
      <section className="bg-white pt-4 md:pt-8 pb-12 overflow-hidden">
        <div className="section-container flex flex-col gap-8">
          
           {/* Top Banner */}
           <div 
             className="w-full flex flex-col gap-6"
           >
             <div className="w-full max-w-[1114px] h-[320px] sm:h-[420px] md:h-[496px] bg-[#4a72ae] rounded-[28px] overflow-hidden relative flex justify-center items-center mx-auto shadow-2xl group">
                <PawwlWatermark 
                  className="absolute z-10 w-[90%] md:w-[1000px] h-auto text-white drop-shadow-2xl" 
                  opacity={1}
                />
                <img 
                  src="/assets/images/contacthero.webp" 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[60%] md:h-[65%] w-auto object-contain z-20 pointer-events-none" 
                  loading="lazy" decoding="async"
                  alt="Contact Hero Illustration" 
                />
              </div>

            {/* Quick Contact Cards */}
            <div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full"
            >
              {[
                { 
                  icon: <MapPin size={20} />, 
                  title: "Visit Us", 
                  desc: "Shop No, 4–5–6, Joy Homes CHS Rd, Kashi Nagar, Valmik Nagar, Bhandup West, Mumbai, 400078", 
                  sub: "Bhandup West, Mumbai" 
                },
                { 
                  icon: <Phone size={20} />, 
                  title: "Call Us", 
                  desc: "+91 72088 13649", 
                  sub: "WhatsApp Available" 
                },
                { 
                  icon: <Mail size={20} />, 
                  title: "Email Us", 
                  desc: "hello@pawwl.com", 
                  sub: "Support within 24h" 
                },
                { 
                  icon: <Clock size={20} />, 
                  title: "Working Hours", 
                  desc: "Mon – Sun: 10:00 AM – 9:00 PM", 
                  sub: "Open All Days" 
                }
              ].map((info, i) => (
                <div
                  key={i}
                  className="flex-1 bg-white p-6 rounded-3xl border-2 border-border-accent flex flex-col items-center gap-3 hover:-translate-y-1 hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 cursor-pointer group min-h-[180px] gs-reveal"
                >
                  <div className="w-12 h-12 flex justify-center items-center bg-brand-blue text-white rounded-xl mb-2 shadow-md group-hover:scale-110 transition-transform">
                    {info.icon}
                  </div>
                  <span className="font-black text-[16px] leading-tight text-center text-brand-dark">
                    {info.title}
                  </span>
                  <p className="font-medium text-[13px] leading-relaxed text-center text-foreground/80 line-clamp-3">
                    {info.desc}
                  </p>
                  <span className="font-black text-[11px] leading-tight text-center text-brand-blue mt-auto uppercase tracking-wider">
                    {info.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ScheduleSession />

      {/* Specific Help FAQ Section */}
      <section className="bg-white px-6 md:px-12 lg:px-40 py-16 lg:py-24 flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1114px] flex flex-col items-center gap-12 bg-white rounded-3xl">
          
          <div 
            className="max-w-[700px] flex flex-col items-center gap-4 text-center"
          >
            <h2 className="font-black text-[36px] md:text-[48px] text-brand-dark leading-tight">Need Specific help?</h2>
            <p className="font-medium text-[18px] md:text-[20px] text-brand-dark/80 opacity-80 leading-relaxed">
              Jump straight to the support you need. Our Specialised teams are ready to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
             {[
               {
                 title: "Grooming Appointments",
                 desc: "Need to book or reschedule a grooming session? Our team will help you find the perfect slot for your furry friend.",
                 action: "Book Grooming"
               },
               {
                 title: "Product Questions",
                 desc: "Have questions about food, treats, accessories, or any of our products? We're happy to guide you.",
                 action: "Ask About Products"
               },
               {
                 title: "Vet Care Inquiries",
                 desc: "Questions about vaccinations, health check-ups, or our veterinary services? Reach out to our vet support team.",
                 action: "Contact Vet Support"
               }
             ].map((card, i) => (
               <div 
                 key={i} 
                 className="flex-1 bg-white p-8 rounded-3xl border-2 border-border-accent flex flex-col gap-4 hover:border-brand-blue/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-pointer"
               >
                  <div className="w-14 h-14 flex justify-center items-center bg-brand-light text-brand-blue rounded-xl mb-2 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                     {i === 0 ? <Clock size={24} /> : i === 1 ? <MapPin size={24} /> : <Phone size={24} />}
                  </div>
                  <h4 className="font-black text-xl text-brand-dark group-hover:text-brand-blue transition-colors">{card.title}</h4>
                  <p className="font-medium text-sm leading-relaxed text-foreground/80">
                    {card.desc}
                  </p>
                  <div className="mt-auto pt-4 flex items-center gap-2 font-black text-sm text-brand-blue group-hover:underline">
                    {card.action}
                    <ArrowRight size={16} />
                  </div>
               </div>
             ))}
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="w-full px-6 md:px-12 lg:px-40 pb-24 overflow-hidden">
        <div 
          className="w-full max-w-[1114px] mx-auto overflow-hidden rounded-[32px] border-2 border-border-accent bg-white p-4 shadow-xl"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d120617.49138228265!2d72.8124078!3d19.1384897!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b9d45d3f805d%3A0x6577fdc07c82a5d9!2sPawwl%20One%20stop%20pet%20care%20%7C%20Best%20Pet%20clinic%20and%20shop%20in%20Bhandup!5e0!3m2!1sen!2sin!4v1776378473997!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-[24px]"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

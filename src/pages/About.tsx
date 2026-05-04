import Navbar from "@/components/Navbar";
import { useReveal, useStaggerReveal } from "@/hooks/useGsapReveal";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { ArrowRight, Star, Quote, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorsSection from "@/components/DoctorsSection";
import PetGallery from "@/components/PetGallery";
import Testimonials from "@/components/Testimonials";

import ab1 from "@/assets/gallery/1.webp";
import ab2 from "@/assets/gallery/10.webp";
import SEO from "@/components/SEO";

const About = () => {
  const heroBannerRef = useReveal({ y: 0, scale: 0.96, duration: 1.2, ease: "power4.out" });
  const storyLeftRef = useReveal({ x: -40, y: 0 });
  const storyRightRef = useReveal({ x: 40, y: 0 });
  const commitHeaderRef = useReveal({ y: 40 });
  const commitGridRef = useStaggerReveal(".commit-card", { y: 30, stagger: 0.1 });

  return (
    <div className="min-h-screen bg-white font-body selection:bg-brand-blue selection:text-white overflow-hidden">
      <SEO 
        title="About Us | Pawwl Pet Care Studio Mumbai"
        description="Learn about Pawwl's mission to provide premium, professional pet care in Mumbai. Founded on love, driven by expertise in vet care, grooming, and boarding."
        url="https://pawwl.com/about"
      />
      <Navbar />
      
      <main>
        {/* Section 1: Hero & Story */}
        <section className="bg-white pt-4 md:pt-8 pb-12 overflow-hidden">
          <div className="section-container">
            <div className="flex flex-col gap-6 w-full">
              {/* Top Banner Row */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative bg-brand-light rounded-[28px] overflow-hidden h-[320px] sm:h-[420px] md:h-[496px] flex items-center justify-center border border-border-design shadow-sm"
              >
                <img 
                  src="/assets/images/aboutheaderimg.webp" 
                  alt="Dog Paw Handshake" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <PawwlWatermark 
                  className="absolute w-[90%] sm:w-[95%] md:w-[1000px] h-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 text-white" 
                  opacity={1.0}
                />
              </div>

              {/* Stats & Story Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch overflow-hidden">
                {/* 50K+ Block */}
                <motion.div 
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="lg:col-span-5 h-auto min-h-[300px] lg:h-[494px] bg-brand-accent p-8 sm:p-12 md:p-14 rounded-[28px] flex flex-col justify-between text-white relative overflow-hidden shadow-2xl"
                >
                   <div className="opacity-20">
                     <Heart size={48} strokeWidth={1} />
                   </div>
                   <div className="flex flex-col gap-4">
                     <span className="font-heading font-black text-[40px] sm:text-[60px] md:text-[80px] leading-[1.0] tracking-tighter">Born From Love</span>
                     <span className="font-normal text-base md:text-lg opacity-50 uppercase tracking-widest">Our Founding Story</span>
                   </div>
                   <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                {/* Our Story Block */}
                <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="lg:col-span-7 h-auto lg:h-[494px] bg-white rounded-[28px] border border-border-design p-8 md:p-12 flex flex-col gap-6"
                >
                  <h2 className="font-heading font-black text-[48px] md:text-[56px] leading-[1.05] text-foreground">Our Story</h2>
                  <div className="flex flex-col gap-4 text-[#788796] text-[16px] leading-[1.75]">
                    <p>
                      Pawwl started when our founder, after struggling to find reliable pet care services, decided to build the solution herself. What began as a small grooming studio has grown into a comprehensive pet care platform.
                    </p>
                    <p>
                      Today, our team of 50+ certified professionals serves pet families with veterinary care, grooming, daycare, training, and curated premium products. We're a community.
                    </p>
                    <p>
                      Pawwl is built on trust, safety, and a commitment to excellence. We deliver seamless, personalized pet care experiences designed to ensure quality, reliability, and accessibility for every pet family.
                    </p>
                  </div>
                  <div className="mt-auto pt-8">
                    <button className="flex items-center gap-2.5 text-brand-accent font-heading font-black text-sm hover:gap-4 transition-all group py-2">
                      Explore Our Services 
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Commitment */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="section-container">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-[1000px] mx-auto text-center mb-20 flex flex-col gap-4"
            >
              <h2 className="font-heading font-extrabold text-[40px] md:text-[52px] leading-tight text-brand-blue">
                Our Commitment to Your Pet’s Well-Being
              </h2>
              <p className="text-[18px] md:text-[20px] text-brand-blue/80 max-w-3xl mx-auto">
                Caring for your pet is a journey, and we’re here every step of the way. Our streamlined pet care process ensures your furry friends get the best care, tailored to their unique needs.
              </p>
            </div>

            <div ref={commitGridRef} className="w-full max-w-[1120px] mx-auto flex flex-col items-center gap-8">
              {[
                [
                  {
                    id: 1,
                    title: "Consultation",
                    desc: "Begin with a personalized consultation to understand your pet’s unique needs, lifestyle, and preferences. This step ensures we provide the best care tailored specifically for them.",
                    img: ab1,
                    dark: true
                  },
                  {
                    id: 2,
                    title: "Care Plan Development",
                    desc: "We create a customized care plan designed to meet your pet’s specific needs, focusing on their health, nutrition, and overall well-being. Every detail is tailored for their happiness and comfort.",
                    img: ab2,
                    dark: false
                  }
                ],
                [
                  {
                    id: 3,
                    title: "Delivery of Services",
                    desc: "Our team provides expert care with services ranging from regular checkups to grooming and training. We ensure your pet receives the attention and support they need to stay happy and healthy.",
                    img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2671&auto=format&fit=crop",
                    dark: false
                  },
                  {
                    id: 4,
                    title: "Follow-Up & Support",
                    desc: "Stay connected with regular updates and expert guidance to ensure your pet’s ongoing health and happiness. Our dedicated team is here to support you every step of the way.",
                    img: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2686&auto=format&fit=crop",
                    dark: false
                  }
                ]
              ].map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 self-stretch">
                  {row.map((step, colIndex) => (
                    <motion.div 
                      key={step.id}
                      initial={{ opacity: 0, x: colIndex === 0 ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: colIndex * 0.1, ease: "easeOut" }}
                      className={`flex items-center gap-6 grow p-6 rounded-[32px] border transition-all duration-300 hover:shadow-xl group ${
                        step.dark ? "bg-brand-accent border-transparent text-white" : "bg-white border-border-accent text-brand-blue"
                      }`}
                    >
                      <img 
                        src={step.img} 
                        alt={step.title} 
                        className="w-[80px] h-[80px] sm:w-[125px] sm:h-[125px] shrink-0 object-cover rounded-2xl transition-transform group-hover:scale-105" 
                      />
                      <div className="flex flex-col gap-1.5 self-stretch grow">
                        <span className={`font-heading font-black text-[27.6px] leading-[1.2] ${step.dark ? "text-white" : "text-brand-blue"}`}>
                          {step.id}. {step.title}
                        </span>
                        <span className={`font-normal text-[16px] leading-[1.4] ${step.dark ? "text-white/80" : "text-brand-blue/80"}`}>
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Doctors Section */}
        <DoctorsSection />

        {/* Section 4: Gallery */}
        <PetGallery img1={ab1} img2={ab2} />

        {/* Section 5: Testimonials */}
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
};

export default About;

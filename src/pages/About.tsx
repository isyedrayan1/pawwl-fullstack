import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { ArrowRight, Star, Quote, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorsSection from "@/components/DoctorsSection";

const About = () => {
  return (
    <div className="min-h-screen bg-white font-body selection:bg-brand-blue selection:text-white">
      <Navbar />
      
      <main>
        {/* Section 1: Hero & Story */}
        <section className="bg-white pt-4 md:pt-8 pb-12">
          <div className="section-container">
            <div className="flex flex-col gap-6 w-full">
              {/* Top Banner Row */}
              <div className="relative bg-brand-light rounded-2xl overflow-hidden h-[320px] sm:h-[420px] md:h-[496px] flex items-center justify-center border border-border-design shadow-sm transition-all duration-300">
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* 50K+ Block */}
                <div className="lg:col-span-5 h-auto min-h-[300px] lg:h-[494px] bg-brand-accent p-8 sm:p-12 md:p-14 rounded-[28px] flex flex-col justify-between text-white relative overflow-hidden shadow-2xl">
                   <div className="opacity-20">
                     <Heart size={48} strokeWidth={1} />
                   </div>
                   <div className="flex flex-col gap-4">
                     <span className="font-heading font-black text-[72px] sm:text-[100px] md:text-[140px] leading-[0.8] tracking-tighter">50K+</span>
                     <span className="font-normal text-base md:text-lg opacity-50 uppercase tracking-widest">Pets cared for</span>
                   </div>
                   {/* Decorative circle */}
                   <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                {/* Our Story Block */}
                <div className="lg:col-span-7 h-auto lg:h-[494px] bg-white rounded-[28px] border border-border-design p-8 md:p-12 flex flex-col gap-6">
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
        <section className="py-24 bg-white">
          <div className="section-container">
            <div className="max-w-[1000px] mx-auto text-center mb-20 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="font-heading font-extrabold text-[40px] md:text-[52px] leading-tight text-brand-blue">
                Our Commitment to Your Pet’s Well-Being
              </h2>
              <p className="text-[18px] md:text-[20px] text-brand-blue/80 max-w-3xl mx-auto">
                Caring for your pet is a journey, and we’re here every step of the way. Our streamlined pet care process ensures your furry friends get the best care, tailored to their unique needs.
              </p>
            </div>

            <div className="w-full max-w-[1120px] mx-auto flex flex-col items-center gap-8">
              {[
                [
                  {
                    id: 1,
                    title: "Consultation",
                    desc: "Begin with a personalized consultation to understand your pet’s unique needs, lifestyle, and preferences. This step ensures we provide the best care tailored specifically for them.",
                    img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2670&auto=format&fit=crop",
                    dark: true
                  },
                  {
                    id: 2,
                    title: "Care Plan Development",
                    desc: "We create a customized care plan designed to meet your pet’s specific needs, focusing on their health, nutrition, and overall well-being. Every detail is tailored for their happiness and comfort.",
                    img: "https://images.unsplash.com/photo-1541599540903-21b373879563?q=80&w=2671&auto=format&fit=crop",
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
                  {row.map((step) => (
                    <div 
                      key={step.id}
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
        <section className="py-24 bg-white">
          <div className="section-container">
            <div className="max-w-[900px] mx-auto text-center mb-16 flex flex-col gap-4">
              <h2 className="font-heading font-extrabold text-[40px] md:text-[48px] text-brand-dark leading-tight">
                Whiskers, Tails, and Joyful Eyes<br />A Gallery Full of Love
              </h2>
              <p className="text-[20px] text-brand-blue/80 max-w-3xl mx-auto">
                Step into a world of heartwarming moments captured in every frame. From wagging tails to joyful eyes, our gallery showcases the love and care that makes every companion feel special.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 h-[300px] sm:h-[400px] lg:h-[728px] rounded-[28px] overflow-hidden shadow-xl border border-border-design/30">
                <img 
                  src="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2670&auto=format&fit=crop" 
                  alt="Dog gallery" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="lg:col-span-7 flex flex-col gap-8">
                <div className="h-[250px] sm:h-[350px] lg:h-[475px] rounded-[28px] overflow-hidden shadow-xl border border-border-design/30">
                  <img 
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop" 
                    alt="Puppies playing" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="h-auto sm:h-[221px] bg-brand-accent rounded-[28px] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-xl relative overflow-hidden group">
                   <div className="flex flex-col gap-3 relative z-10">
                     <div className="w-10 h-10 opacity-40 text-white flex items-center justify-center bg-white/10 rounded-full">
                       <Quote size={20} fill="currentColor" />
                     </div>
                     <h4 className="font-heading font-black text-[24px] md:text-[32px] tracking-tight">Join our pack</h4>
                     <p className="text-white/50 text-sm md:text-base -mt-2 font-medium uppercase tracking-widest">We're always hiring</p>
                   </div>
                   <Button className="relative z-10 bg-[#e8f0f6] hover:bg-white text-brand-accent rounded-xl px-10 py-6 h-auto text-[14px] font-black flex items-center gap-2.5 transition-all shadow-lg active:scale-95">
                     View Careers <ArrowRight size={16} strokeWidth={3} />
                   </Button>
                   {/* Background Glow */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Testimonials */}
        <section className="py-24 bg-white pb-32">
          <div className="section-container">
            <div className="max-w-[900px] mx-auto text-center mb-20 flex flex-col gap-4">
              <h2 className="font-heading font-extrabold text-[40px] md:text-[48px] text-brand-dark">
                What other Pawrents say
              </h2>
              <p className="text-[20px] text-brand-blue/80">
                Stories from pet parents who choose Pawwl with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Featured Testimonial Card */}
              <div className="lg:col-span-6 bg-brand-accent p-12 md:p-14 rounded-[28px] text-white flex flex-col justify-between gap-12 relative overflow-hidden group shadow-2xl">
                <Quote className="w-16 h-16 text-white/5 absolute -top-4 -left-4" fill="currentColor" />
                <div className="relative z-10 flex flex-col gap-10">
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={24} className="fill-brand-light-blue text-brand-light-blue" />)}
                  </div>
                  <p className="text-[28px] md:text-[36px] leading-[1.25] font-normal italic tracking-tight">
                    “Game-changer for our golden retriever. The staff truly cares.”
                  </p>
                </div>
                <div className="relative z-10 flex items-center gap-5 pt-8 border-t border-white/10">
                  <div className="w-16 h-16 rounded-full border-2 border-border-design/30 overflow-hidden p-1 bg-white/5">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" alt="Ayushi" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xl tracking-tight">Ayushi Mishra</p>
                    <p className="text-sm text-white/50 uppercase tracking-widest font-medium">Dog Parent</p>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
              </div>

              {/* Smaller Side Cards */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {[
                  {
                    text: "“Outstanding vet care. Every single visit is amazing.”",
                    name: "Ankita Vashisht",
                    role: "Cat Parent",
                    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
                  },
                  {
                    text: "“My pup comes home tired and happy every single day!”",
                    name: "Aarti Sharma",
                    role: "Pet Parent",
                    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
                  }
                ].map((testimonial, i) => (
                  <div key={i} className="bg-white border border-border-design p-10 rounded-3xl flex flex-col gap-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} size={18} className="fill-brand-accent text-brand-accent group-hover:scale-110 transition-transform" />)}
                    </div>
                    <p className="text-[20px] text-foreground font-normal leading-[1.6] italic">
                      {testimonial.text}
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-border-design/50">
                      <div className="w-12 h-12 rounded-full border border-border-design overflow-hidden p-1 shadow-sm">
                        <img src={testimonial.img} alt={testimonial.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-[18px] text-foreground tracking-tight">{testimonial.name}</p>
                        <p className="text-sm text-[#788796] font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PawwlWatermark from "@/components/PawwlWatermark";
import { Search, ChevronDown, CheckCircle2, ChevronRight, Briefcase, MapPin, ArrowUpRight, Mail, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DoctorsSection from "@/components/DoctorsSection";

const Careers = () => {
  const jobs = [
    { title: "Senior Veterinarian", dept: "Veterinary", loc: "Mumbai, Maharashtra", type: "Full-time", desc: "Lead clinical consultations and surgical procedures at our flagship pet clinic. Mentor junior vets and drive best-in-class animal healthcare standards." },
    { title: "Pet Grooming Specialist", dept: "Grooming", loc: "Bengaluru, Karnataka", type: "Full-time", desc: "Provide professional grooming services including bathing, haircuts, nail trimming, and breed-specific styling for dogs and cats." },
    { title: "Pet Store Manager", dept: "Retail", loc: "Delhi NCR", type: "Full-time", desc: "Oversee daily operations of our pet retail store, manage inventory of premium pet products, and lead a team of pet care associates." },
    { title: "Pet Nutrition Consultant", dept: "Pet Care", loc: "Hyderabad, Telangana", type: "Part-time", desc: "Advise pet parents on optimal diet plans, recommend suitable food products, and conduct in-store nutrition workshops." },
    { title: "Veterinary Technician", dept: "Veterinary", loc: "Pune, Maharashtra", type: "Full-time", desc: "Assist veterinarians with examinations, administer medications, handle lab work, and ensure smooth day-to-day clinic operations." },
    { title: "Certified Pet Trainer", dept: "Training", loc: "Chennai, Tamil Nadu", type: "Part-time", desc: "Conduct obedience training, behavioral correction, and puppy socialization classes for pet parents across our training centres." },
    { title: "Ecommerce & Inventory Coordinator", dept: "Operations", loc: "Remote (India)", type: "Full-time", desc: "Manage our online pet products catalogue, coordinate with warehouses across India, and optimize order fulfilment processes." },
    { title: "Pet Care Associate", dept: "Retail", loc: "Kolkata, West Bengal", type: "Full-time", desc: "Assist customers in choosing the right products for their pets, maintain store displays, and provide knowledgeable pet care advice." }
  ];

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [locFilter, setLocFilter] = useState("All Locations");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const departments = useMemo(() => ["All Departments", ...new Set(jobs.map(j => j.dept))], [jobs]);
  const locations = useMemo(() => ["All Locations", ...new Set(jobs.map(j => j.loc))], [jobs]);
  const types = useMemo(() => ["All Types", ...new Set(jobs.map(j => j.type))], [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) || job.desc.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "All Departments" || job.dept === deptFilter;
      const matchLoc = locFilter === "All Locations" || job.loc === locFilter;
      const matchType = typeFilter === "All Types" || job.type === typeFilter;
      return matchSearch && matchDept && matchLoc && matchType;
    });
  }, [jobs, search, deptFilter, locFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white pt-4 md:pt-8 pb-12">
        <div className="section-container">
          <div className="w-full flex flex-col gap-6">
            
            {/* Top Pawwl Banner */}
            <div className="w-full h-[320px] sm:h-[420px] md:h-[496px] flex justify-center items-center bg-black/20 rounded-[28px] overflow-hidden relative group">
              <img src="/assets/images/creershero.webp" className="absolute inset-0 w-full h-full object-cover z-20" alt="Careers Banner" />
              <div className="w-full h-full absolute inset-0 flex justify-center items-center z-10">
                <PawwlWatermark 
                  className="absolute w-[90%] sm:w-[95%] md:w-[1000px] h-auto left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[#134e86] drop-shadow-2xl" 
                  opacity={1}
                />
              </div>
            </div>

            {/* Middle Grid */}
            <div className="flex flex-col lg:flex-row gap-5 w-full">
              <div className="w-full lg:flex-1 h-auto lg:h-[368px] flex flex-col justify-center gap-4 bg-white px-8 md:px-12 py-10 lg:py-0 lg:px-[50px] rounded-[28px] border border-[#c1e8fb]">
                <div className="flex flex-col">
                  <span className="font-bold text-[48px] md:text-[68px] text-[#00356b] leading-tight mb-2">Careers</span>
                  <span className="font-bold text-[20px] md:text-[24px] text-[#00356b] leading-snug mb-4">
                    Your PET probably wants you to come work here.
                  </span>
                  <p className="font-normal text-base leading-[24px] text-[#00356b] opacity-90">
                    Dog people welcome. If you want to solve big problems in new ways with the smartest, kindest, weirdest people you've ever met, we want to meet you. We're building a team of ambitious, customer obsessed dog people who embrace new technology to bring dogs as much joy as humanly possible. If you've been spending your free time using AI to better understand your dog's barks...we should really talk.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-[394px] h-[250px] sm:h-[300px] lg:h-[368px] bg-[#dce6ee] rounded-[28px] border border-[#f0f0f0] overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&fit=crop" className="w-full h-full object-cover absolute inset-0" alt="Dog Working" />
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="flex flex-col gap-5 w-full sm:grid sm:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-2 sm:col-span-1 h-[240px] lg:h-[368px] flex flex-col justify-center items-center gap-2 bg-brand-dark px-7 py-10 lg:py-20 rounded-[28px]">
                <span className="font-extrabold text-[36px] sm:text-[58px] text-[#00b1e0] leading-none">
                  We’re<br/>Hiring a<br/>Pawwrent
                </span>
              </div>
              <div className="h-[240px] lg:h-[368px] flex flex-col justify-center items-center gap-2 px-7 py-10 lg:py-20 rounded-[28px] relative overflow-hidden">
                <div className="w-full h-full absolute flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?w=500&fit=crop" className="w-full h-full object-cover" alt="Dog" />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1 h-[240px] lg:h-[368px] flex flex-col justify-center gap-2 bg-[#81c0e3] px-[27px] rounded-[28px] overflow-hidden">
                <div className="flex flex-col gap-4 self-stretch">
                  <span className="font-extrabold text-[42px] xl:text-[46px] leading-none whitespace-nowrap text-[#142535]">Pet Groomers</span>
                  <span className="font-extrabold text-[42px] xl:text-[46px] leading-none whitespace-nowrap text-[#142535]">Pet Groomers</span>
                  <span className="font-extrabold text-[42px] xl:text-[46px] leading-none whitespace-nowrap text-[#142535]">Pet Groomers</span>
                  <span className="font-extrabold text-[42px] xl:text-[46px] leading-none whitespace-nowrap text-[#142535]">Pet Groomers</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Paw-sitive Work Culture */}
      <section className="w-full flex justify-center bg-white py-16 lg:py-24 border-t border-[#dce6ee]">
        <div className="w-full max-w-[1440px] px-6 md:px-12 lg:px-40 flex flex-col items-center gap-16">
          <div className="max-w-[900px] flex flex-col items-center gap-4 text-center">
            <h2 className="font-extrabold text-[36px] md:text-[51.4px] text-[#134e86] leading-tight">
              Paw-sitive work culture @Pawwl
            </h2>
            <p className="font-normal text-[18px] md:text-[20px] text-[#134e86] leading-relaxed opacity-80">
              Pamper your pet with our premium products designed for comfort and style. From cozy bedding to durable toys, we offer your furry friend needs to feel loved and cared for.
            </p>
          </div>

          <div className="w-full max-w-[1114px] grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { title: "Growth Opportunities", desc: "Clear career paths with mentorship, internal mobility, and leadership development programs." },
              { title: "Flexible Work Culture", desc: "Hybrid and remote options with flexible hours so you can do your best work on your terms." },
              { title: "Pet-Friendly Workspace", desc: "Bring your furry friend to work! Our offices are designed to welcome pets of all sizes." },
              { title: "Learning & Development", desc: "Annual learning stipend, conference passes, and access to industry-leading courses." },
              { title: "Community Impact", desc: "Paid volunteer days and company-matched donations to local animal shelters." },
              { title: "Wellness Benefits", desc: "Comprehensive health coverage, mental wellness support, and pet insurance for your companions." }
            ].map((card, i) => (
              <div key={i} className="flex flex-col gap-4 p-6 sm:p-8 rounded-3xl border-2 border-border-accent bg-transparent hover:-translate-y-1 hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 bg-brand-dark text-white">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-black text-[18px] leading-snug text-brand-dark">
                  {card.title}
                </h4>
                <p className="font-medium text-sm leading-relaxed text-foreground/80">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <DoctorsSection />

      {/* Find Your Role */}
      <section className="w-full flex justify-center bg-white py-16 lg:py-24">
        <div className="w-[1440px] flex flex-col items-center gap-8 bg-white px-6 lg:px-40 py-12">
          
          <div className="flex flex-col items-center gap-3 self-stretch">
            <div className="w-full lg:w-[900px] flex flex-col items-center gap-3">
              <span className="font-extrabold text-[36px] md:text-[48px] text-center text-[#012169]">
                Find Your Purr-fect Role
              </span>
              <span className="font-normal text-[18px] md:text-[20px] leading-[24px] text-center text-[#134e86]">
                Step into a world of heartwarming moments captured in every frame. From wagging tails to joyful eyes, our gallery showcases the love and every companion feel special.”
              </span>
            </div>
          </div>

          <div className="w-full lg:w-[1216px] flex flex-col gap-6">
            
            <div className="flex flex-col self-stretch bg-white px-[17px] py-4 rounded-xl border border-solid border-[#f0f0f0]">
              <div className="flex flex-col md:flex-row self-stretch gap-4 items-stretch">
                <div className="flex-1 flex items-center bg-white px-4 py-2 rounded-lg border border-solid border-[#f0f0f0] gap-3">
                  <Search size={16} className="text-[#b1b1b1]" />
                  <input 
                    type="text" 
                    placeholder="Search roles..." 
                    className="bg-transparent border-none outline-none w-full text-[14px] text-[#191919] placeholder:text-[#b1b1b1]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:w-[170px]">
                    <select 
                      className="w-full appearance-none bg-white px-3 py-2 pr-8 rounded-lg border border-solid border-[#f0f0f0] cursor-pointer font-normal text-[14px] text-[#191919] outline-none hover:border-[#c1e8fb] transition-colors"
                      value={deptFilter}
                      onChange={(e) => setDeptFilter(e.target.value)}
                    >
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={14} className="opacity-50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  
                  <div className="relative w-full md:w-[170px]">
                    <select 
                      className="w-full appearance-none bg-white px-3 py-2 pr-8 rounded-lg border border-solid border-[#f0f0f0] cursor-pointer font-normal text-[14px] text-[#191919] outline-none hover:border-[#c1e8fb] transition-colors"
                      value={locFilter}
                      onChange={(e) => setLocFilter(e.target.value)}
                    >
                      {locations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={14} className="opacity-50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="relative w-full md:w-[140px]">
                    <select 
                      className="w-full appearance-none bg-white px-3 py-2 pr-8 rounded-lg border border-solid border-[#f0f0f0] cursor-pointer font-normal text-[14px] text-[#191919] outline-none hover:border-[#c1e8fb] transition-colors"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      {types.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={14} className="opacity-50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="self-stretch">
              <span className="text-[14px] leading-[21px] text-[#555555] font-medium">Showing {filteredJobs.length} positions</span>
            </div>

            <div className="flex flex-wrap gap-4 self-stretch">
              {filteredJobs.length > 0 ? filteredJobs.map((job, i) => (
                <Link to="/careers/1" key={i} className="w-full lg:w-[598px] flex flex-col justify-between bg-white p-6 rounded-3xl border-2 border-border-accent hover:border-brand-blue/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[196px] group">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col gap-2">
                       <span className="font-medium text-base text-[#191919]">{job.title}</span>
                       <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-1.5">
                             <Briefcase size={12} className="text-[#555555]" />
                             <span className="font-normal text-[12px] leading-[18px] text-[#555555]">{job.dept}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <MapPin size={12} className="text-[#555555]" />
                             <span className="font-normal text-[12px] leading-[18px] text-[#555555]">{job.loc}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <CheckCircle2 size={12} className="text-[#555555]" />
                             <span className="font-normal text-[12px] leading-[18px] text-[#555555]">{job.type}</span>
                          </div>
                       </div>
                    </div>
                    <ArrowUpRight size={16} className="text-[#0071f3] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <span className="font-normal text-[14px] leading-[22px] text-[#555555] mt-4 mb-4 line-clamp-2">
                    {job.desc}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[14px] leading-[21px] text-[#0071f3]">View Details</span>
                    <ChevronRight size={14} className="text-[#0071f3]" />
                  </div>
                </Link>
              )) : (
                <div className="w-full flex justify-center items-center py-20 text-[#555555]">
                  <span className="font-medium text-lg">No positions found matching your criteria.</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-white px-6 md:px-12 lg:px-40 py-16 lg:py-24 flex flex-col items-center">
        <div className="w-full max-w-[1216px] flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-3 text-center max-w-[800px]">
            <h2 className="font-extrabold text-[32px] md:text-[48px] leading-tight text-[#012169]">
              Whiskers, Tails, and Joyful Eyes<br />A Gallery Full of Love
            </h2>
            <p className="font-medium text-[16px] md:text-[20px] leading-relaxed text-[#134e86] opacity-80">
              Step into a world of heartwarming moments captured in every frame. From wagging tails to joyful eyes, our gallery showcases the love and every companion feel special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 w-full items-stretch">
            <div className="md:col-span-1 lg:col-span-5 h-[300px] sm:h-[400px] lg:h-full rounded-[32px] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?w=800&h=1200&fit=crop" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Pets 1" />
            </div>
            <div className="md:col-span-1 lg:col-span-7 flex flex-col gap-4 sm:gap-6">
               <div className="grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6 h-full">
                 <div className="h-[180px] sm:h-[300px] md:h-[475px] rounded-[32px] overflow-hidden w-full">
                    <img src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1000&h=800&fit=crop" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Pets 2" />
                 </div>
                 <div className="h-[180px] sm:h-[300px] md:h-[237px] bg-[#1b4965] rounded-[32px] flex flex-col items-center justify-center p-4 sm:p-8 text-white relative overflow-hidden group w-full">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Mail className="w-6 h-6 sm:w-10 sm:h-10 mb-2 sm:mb-3 opacity-40" />
                    <span className="font-extrabold text-[14px] sm:text-[24px] mb-1">Join our pack</span>
                    <span className="text-[10px] sm:text-[14px] font-medium opacity-60 mb-3 sm:mb-5">We're always hiring</span>
                    <Button className="bg-[#e8f0f6] hover:bg-white text-[#1b4965] font-black text-[10px] sm:text-xs px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 h-auto shadow-md">
                      View Careers
                      <ArrowUpRight size={14} strokeWidth={3} />
                    </Button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#f8fbff] px-6 md:px-12 lg:px-40 py-16 lg:py-24 flex flex-col items-center border-t border-[#dce6ee]">
        <div className="w-full max-w-[1440px] flex flex-col items-center gap-12 lg:p-[50px] bg-white rounded-[32px] shadow-sm border border-[#dce6ee]">
          <div className="max-w-[900px] flex flex-col items-center gap-4 text-center">
            <h2 className="font-extrabold text-[36px] md:text-[48px] text-[#012169]">What other Pawrents say</h2>
            <p className="font-medium text-[18px] md:text-[20px] text-[#134e86] opacity-80">Stories from pet parents who choose Pawwl with confidence.</p>
          </div>

          <div className="w-full max-w-[1120px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Testimonial */}
            <div className="lg:col-span-6 bg-[#1b4965] rounded-[28px] p-8 md:p-14 text-white flex flex-col gap-10 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)]" style={{backgroundSize: '20px 20px'}}></div>
              <p className="text-[28px] md:text-[32px] font-normal leading-tight relative z-10">
                “Game-changer for our golden retriever. The staff truly cares.”
              </p>
              <div className="flex gap-1 relative z-10">
                 {[1,2,3,4,5].map(i => (
                   <Star key={i} size={16} fill="#5fa8d3" className="text-[#5fa8d3]" />
                 ))}
              </div>
              <div className="flex items-center gap-4 mt-auto relative z-10">
                 <div className="w-14 h-14 rounded-full border-2 border-[#dce6ee] p-0.5 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" className="w-full h-full object-cover rounded-full" alt="Ayushi" />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-bold text-base">Ayushi Mishra</span>
                    <span className="text-sm opacity-50 font-medium">Dog Parent</span>
                 </div>
              </div>
            </div>

            {/* Smaller Testimonials */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              {[
                { 
                  text: '“Outstanding vet care. Every single visit is amazing.”',
                  name: "Ankita Vashisht",
                  role: "Cat Parent",
                  img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
                },
                {
                  text: '“My pup comes home tired and happy every single day!”',
                  name: "Aarti Sharma",
                  role: "Pet Parent",
                  img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
                }
              ].map((test, i) => (
                <div key={i} className="flex-1 bg-white p-8 rounded-3xl border-2 border-[#dce6ee] flex flex-col justify-between hover:border-[#1b4965]/30 transition-colors shadow-sm">
                  <div className="flex gap-1 mb-4">
                     {[1,2,3,4,5].map(j => (
                       <Star key={j} size={14} fill="#1b4965" className="text-[#1b4965]" />
                     ))}
                  </div>
                  <p className="font-medium text-[16px] leading-[1.6] text-[#212529] mb-6">
                    {test.text}
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full border-2 border-[#dce6ee] p-px overflow-hidden">
                      <img src={test.img} className="w-full h-full object-cover rounded-full" alt={test.name} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[14px] text-[#212529] leading-tight">{test.name}</span>
                      <span className="font-medium text-[12px] text-[#788796]">{test.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Developer Test Link */}
      <div className="w-full bg-[#f8fbff] flex justify-center items-center py-6 border-b border-[#dce6ee]">
         <Link to="/careers/1" className="text-sm font-bold text-[#0071f3] hover:underline flex items-center gap-2">
            Test clicking here to open Career CMS Dummy Page
         </Link>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;

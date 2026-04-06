import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, ArrowLeft, Briefcase, MapPin, CheckCircle2, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CareerDetails = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 1. Breadcrumbs */}
      <div className="w-full flex justify-center pt-4 md:pt-8 pb-4 bg-white border-b border-[#f0f0f0]">
        <div className="w-full max-w-[1440px] px-6 md:px-12 lg:px-40">
          <div className="w-full max-w-[1114px] flex items-center gap-3 text-sm md:text-base font-medium text-[#788796]">
            <Link to="/" className="hover:text-[#1b4965] cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/careers" className="hover:text-[#1b4965] cursor-pointer transition-colors">Careers</Link>
            <ChevronRight size={14} />
            <span className="text-[#212529]">Senior Veterinarian</span>
          </div>
        </div>
      </div>

      <section className="w-full flex justify-center bg-white py-12 lg:py-16">
        <div className="w-full max-w-[1440px] px-6 md:px-12 lg:px-40">
          <div className="w-full max-w-[1114px] flex flex-col lg:flex-row items-start gap-12">
            
            {/* Left: Job Content */}
            <div className="flex-1 flex flex-col gap-10">
              
              <div className="flex flex-col gap-6">
                <Link to="/careers" className="flex items-center gap-2 text-sm font-bold text-[#0071f3] hover:underline w-fit">
                   <ArrowLeft size={16} /> Back to all jobs
                </Link>
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#012169] leading-tight">
                  Senior Veterinarian
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 border-b border-[#f0f0f0] pb-8">
                  <div className="flex items-center gap-2 bg-[#f8fbff] px-4 py-2 rounded-lg border border-[#dce6ee]">
                    <Briefcase size={16} className="text-[#555555]" />
                    <span className="font-semibold text-[14px] text-[#191919]">Veterinary Team</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#f8fbff] px-4 py-2 rounded-lg border border-[#dce6ee]">
                    <MapPin size={16} className="text-[#555555]" />
                    <span className="font-semibold text-[14px] text-[#191919]">Mumbai, Maharashtra</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#f8fbff] px-4 py-2 rounded-lg border border-[#dce6ee]">
                    <Clock size={16} className="text-[#555555]" />
                    <span className="font-semibold text-[14px] text-[#191919]">Full-time</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 text-[#555555] text-lg leading-relaxed">
                <h3 className="font-bold text-2xl text-[#191919]">About the Role</h3>
                <p>
                  As a Senior Veterinarian at Pawwl, you won't just be treating animals—you'll be leading a state-of-the-art clinic dedicated to elevating the standard of pet care in India. You will handle complex clinical cases, lead surgical procedures, and serve as a trusted mentor to our junior veterinary staff.
                </p>

                <h3 className="font-bold text-2xl text-[#191919] mt-6">What You'll Do</h3>
                <ul className="flex flex-col gap-4 list-disc pl-6">
                  <li>Lead primary care consultations, preventative health planning, and complex diagnoses.</li>
                  <li>Perform out-patient surgeries, dental procedures, and emergency critical care.</li>
                  <li>Collaborate closely with our Grooming and Behavioural teams for holistic pet wellness.</li>
                  <li>Mentor junior veterinarians and vet technicians, leading weekly clinical rounds.</li>
                </ul>

                <h3 className="font-bold text-2xl text-[#191919] mt-6">What We're Looking For</h3>
                <ul className="flex flex-col gap-4 list-disc pl-6">
                  <li>BVSc & AH or MVSc degree with active registration in the VCI.</li>
                  <li>Minimum 5+ years of active clinical experience, specifically in small animal practice (dogs/cats).</li>
                  <li>Strong proficiency in soft-tissue surgery and advanced diagnostics (USG, X-Ray).</li>
                  <li>Deep empathy for animals and excellent communication skills for consulting with pet parents.</li>
                </ul>
              </div>
            </div>

            {/* Right: Apply Sticky Card */}
            <div className="w-full lg:w-[380px] sticky top-[100px]">
               <div className="flex flex-col gap-6 bg-white p-8 rounded-3xl border-2 border-[#dce6ee] shadow-xl">
                 <div className="flex flex-col gap-2">
                   <h3 className="font-extrabold text-2xl text-[#012169]">Ready to apply?</h3>
                   <p className="text-[#555555] text-sm">Join our mission to bring joy to dogs and their humans.</p>
                 </div>
                 
                 <Button className="w-full bg-[#0071f3] hover:bg-[#005bb5] text-white py-6 rounded-xl font-bold text-lg shadow-lg hover:-translate-y-0.5 transition-transform">
                    Apply Now
                 </Button>

                 <div className="flex flex-col gap-4 mt-2 pt-6 border-t border-[#f0f0f0]">
                   <span className="font-bold text-sm text-[#191919]">Questions about this role?</span>
                   <div className="flex items-center gap-3 text-sm text-[#555555]">
                      <Mail size={16} /> Contact our recruiting team at careers@pawwl.in
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareerDetails;

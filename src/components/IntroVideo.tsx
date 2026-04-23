import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { motion } from "motion/react";
import vid2 from "@/assets/gallery/2v.mp4";
import vid3 from "@/assets/Newgallery/IMG_3620.mp4";
import vid4 from "@/assets/Newgallery/products/IMG_5021.JPG.webp";
import vid5 from "@/assets/gallery/5v.mp4";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const IntroVideo = () => {
  const isMobile = useIsMobile();

  return (
    <section className="pb-12 md:pb-16 pt-8 md:pt-12 bg-white overflow-hidden">
      <div className="section-container">
        <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center flex flex-col gap-3"
          >
            <h2 className="font-extrabold text-[32px] md:text-[48px] text-[#012169] leading-tight">
              See How We Care
            </h2>
            <p className="font-normal text-[16px] md:text-[20px] text-[#134e86] max-w-2xl mx-auto">
              A glimpse into the joy, love, and dedicated care every pet experiences at Pawwl.
            </p>
          </motion.div>

          {/* Video Bento Layout */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Left: 3v portrait */}
            <motion.div 
              initial={{ opacity: 0, x: isMobile ? 0 : -40, y: isMobile ? 40 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rounded-[28px] overflow-hidden shadow-sm h-[400px] md:h-[600px] relative group border border-[#dce6ee]"
            >
               <video 
                  src={vid3} 
                  autoPlay loop muted playsInline 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>
            
            {/* Middle: Stacked 5v (top) & 4v (bottom) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="flex flex-col gap-4 md:gap-6 h-[800px] md:h-[600px]"
            >
               <div className="rounded-[28px] overflow-hidden shadow-sm flex-1 relative group border border-[#dce6ee]">
                   <video 
                      src={vid5} 
                      autoPlay loop muted playsInline 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                   />
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
               </div>
                <div className="rounded-[28px] overflow-hidden shadow-sm flex-1 relative group border border-[#dce6ee]">
                    <img 
                       src={vid4} 
                       alt="Pawwl Gallery"
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>
            </motion.div>

            {/* Right: 2v portrait */}
            <motion.div 
              initial={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 40 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rounded-[28px] overflow-hidden shadow-sm h-[400px] md:h-[600px] relative group border border-[#dce6ee]"
            >
               <video 
                  src={vid2} 
                  autoPlay loop muted playsInline 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>

          </div>
          
          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center mt-2"
          >
            <Link to="/gallery">
              <Button className="bg-[#012169] hover:bg-[#012169]/90 text-white px-6 py-2.5 h-auto rounded-xl text-base font-bold flex items-center gap-2 group transition-all hover:shadow-lg active:scale-95 border-none">
                <span>View Gallery</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default IntroVideo;


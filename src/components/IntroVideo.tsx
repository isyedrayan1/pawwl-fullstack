import vid2 from "@/assets/gallery/2v.mp4";
import vid3 from "@/assets/gallery/3v.mp4";
import vid4 from "@/assets/gallery/4v.mp4";
import vid5 from "@/assets/gallery/5v.mp4";

const IntroVideo = () => {
  return (
    <section className="pb-12 md:pb-16 pt-8 md:pt-12 bg-white">
      <div className="section-container">
        <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto">
          
          <div className="text-center flex flex-col gap-3">
            <h2 className="font-extrabold text-[32px] md:text-[48px] text-[#012169] leading-tight">
              See How We Care
            </h2>
            <p className="font-normal text-[16px] md:text-[20px] text-[#134e86] max-w-2xl mx-auto">
              A glimpse into the joy, love, and dedicated care every pet experiences at Pawwl.
            </p>
          </div>

          {/* Video Bento Layout */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Left: 3v portrait */}
            <div className="rounded-[28px] overflow-hidden shadow-sm h-[400px] md:h-[600px] relative group border border-[#dce6ee]">
               <video 
                  src={vid3} 
                  autoPlay loop muted playsInline 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            {/* Middle: Stacked 5v (top) & 4v (bottom) */}
            <div className="flex flex-col gap-4 md:gap-6 h-[800px] md:h-[600px]">
               <div className="rounded-[28px] overflow-hidden shadow-sm flex-1 relative group border border-[#dce6ee]">
                   <video 
                      src={vid5} 
                      autoPlay loop muted playsInline 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                   />
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
               </div>
               <div className="rounded-[28px] overflow-hidden shadow-sm flex-1 relative group border border-[#dce6ee]">
                   <video 
                      src={vid4} 
                      autoPlay loop muted playsInline 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                   />
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
               </div>
            </div>

            {/* Right: 2v portrait */}
            <div className="rounded-[28px] overflow-hidden shadow-sm h-[400px] md:h-[600px] relative group border border-[#dce6ee]">
               <video 
                  src={vid2} 
                  autoPlay loop muted playsInline 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
               />
               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default IntroVideo;

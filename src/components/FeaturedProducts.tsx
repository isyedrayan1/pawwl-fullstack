import { ArrowUpRight } from "lucide-react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useReveal, useStaggerReveal } from "@/hooks/useGsapReveal";

// Detailed Bento Assets
import img286 from "@/assets/home/servbento/image 286.webp";
import download1 from "@/assets/home/servbento/download 1.webp";
import download2 from "@/assets/home/servbento/download 2.webp";
import superchewer1 from "@/assets/home/servbento/superchewer1.webp";
import superchewer2 from "@/assets/home/servbento/superchewer2.webp";
import fr21 from "@/assets/home/servbento/fr2-1.webp";
import fr22 from "@/assets/home/servbento/fr2-2.webp";
import row21 from "@/assets/home/servbento/2row-1.webp";
import row211 from "@/assets/home/servbento/2row-11.webp";
import lrow1 from "@/assets/home/servbento/lrow-1.webp";
import lrow11 from "@/assets/home/servbento/lrow-11.webp";
import bentolast from "@/assets/home/servbento/bentolast.svg";

const FeaturedProducts = () => {
  const isMobile = useIsMobile();
  const headerRef = useReveal({ y: 40 });
  const mainCardRef = useReveal({ x: -40, y: 0 });
  const topCaseRef = useReveal({ x: 40, y: 0 });
  const bottomCaseRef = useReveal({ x: 40, y: 0, delay: 0.15 });
  const desktopRowRef = useStaggerReveal(".fp-desktop-card", { y: 40, stagger: 0.08 });
  const accRef = useReveal({ x: -40, y: 0 });
  const daycareRef = useReveal({ x: 40, y: 0 });
  const mobileGridRef = useStaggerReveal(".fp-mobile-card", { y: 30, stagger: 0.08 });
  const mobileDaycareRef = useReveal({ y: 40 });

  return (
    <section className="bg-white py-12 md:py-16 overflow-hidden">
      <div className="section-container">
        
        {/* Simple Store Header */}
        <div 
          ref={headerRef}
          className="flex flex-col items-center gap-4 mb-10 text-center opacity-0"
        >
          <div className="w-fit bg-[#e8f7ff] px-4 py-1.5 rounded-full border border-[#c1e8fb]">
            <span className="font-medium text-[12px] md:text-xs text-[#134e86]">Pawwl Store</span>
          </div>
          <h2 className="font-extrabold text-[32px] md:text-[40px] text-[#012169] leading-tight">
            Premium Pet Essentials.
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Row 2: Main Large Card + Two Wide Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch overflow-hidden">
            
            {/* Left Main Card: Super Chewer */}
            <div 
              ref={mainCardRef}
              className="lg:col-span-12 xl:col-span-5 h-[500px] lg:h-[592px] w-full max-w-[440px] mx-auto xl:mx-0 bg-[#58a4cf] rounded-2xl relative overflow-hidden transition-all shadow-inner opacity-0"
            >
              {/* Text - TOP LEFT (Smaller and Moved Up) */}
              <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-20 flex flex-col max-w-[280px] lg:max-w-[330px]">
                <span className="font-bold text-[22px] lg:text-[26px] leading-tight text-[#012169]">
                  Long-Lasting <br /> Chew Bones
                </span>
                <p className="text-[10px] lg:text-[10px] text-[#012169] mt-1 lg:mt-2 leading-tight opacity-90 font-medium">
                  Tough chews for power chewers <br /> — 50% off this week.
                </p>
              </div>

              {/* IMAGES Positioning */}
              <div className="absolute top-0 right-0 w-[160px] lg:w-[220px] h-[160px] lg:h-[220px] z-10 pointer-events-none">
                <img src={download1} alt="" className="w-full h-full object-contain object-right-top" />
              </div>
              <div className="absolute bottom-0 left-0 w-[150px] lg:w-[200px] h-[150px] lg:h-[200px] z-10 pointer-events-none">
                <img src={download2} alt="" className="w-full h-full object-contain object-left-bottom" />
              </div>
              <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] lg:w-[329px] h-[300px] lg:h-[366px] z-0">
                <img src={img286} alt="Super Chewer Subject" className="w-full h-full object-contain" />
              </div>

              {/* Learn More Link - BOTTOM RIGHT */}
              <a href="#" className="absolute bottom-6 right-8 lg:bottom-8 lg:right-10 z-30 inline-flex items-center gap-2 text-[#012169] font-bold text-[14px] lg:text-[15px] hover:underline transition-all group">
                Learn More
                <ArrowUpRight size={16} className="text-[#012169] transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Right Column: Two wide white cards */}
            <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-8">
              {/* Top Case */}
              <div 
                ref={topCaseRef}
                className="relative w-full h-[180px] lg:h-[280px] bg-white border-2 border-solid border-[#c1e8fb] rounded-2xl overflow-hidden group opacity-0"
              >
                {/* Text Block - TOP LEFT */}
                <div className="absolute top-4 lg:top-10 left-4 lg:left-10 flex flex-col max-w-[180px] lg:max-w-[330px] z-10">
                  <span className="font-bold text-[19px] lg:text-[32px] leading-tight lg:leading-[36px] text-[#012169]">Premium Dog Kibble</span>
                  <p className="font-normal text-[12px] lg:text-[15px] text-[#012169] mt-1 lg:mt-2 leading-relaxed opacity-90">
                    Wholesome dry food for adult dogs <br className="hidden lg:block" /> with real chicken and rice.
                  </p>
                </div>

                {/* Pill Button - BOTTOM LEFT */}
                <div className="absolute bottom-4 lg:bottom-8 left-4 lg:left-10 px-4 lg:px-5 py-1.5 lg:py-2 bg-[#134e86] rounded-full flex justify-center items-center gap-2 transition-transform hover:scale-105 cursor-pointer z-10">
                  <span className="font-bold text-[10px] lg:text-[10px] text-white">Pawwl Select Product</span>
                  <ArrowUpRight size={10} className="text-white" />
                </div>

                {/* Images - GROUPED RIGHT */}
                <div className="absolute right-0 bottom-0 h-full w-[140px] lg:w-[310px] z-0">
                  <div className="absolute left-4 lg:left-16 bottom-0 w-[60px] lg:w-[140px] h-[80px] lg:h-[190px]">
                    <img src={superchewer1} alt="" className="w-full h-full object-contain object-bottom" />
                  </div>
                  <div className="absolute right-0 bottom-0 w-[80px] lg:w-[170px] h-[100px] lg:h-[210px]">
                    <img src={superchewer2} alt="" className="w-full h-full object-contain object-right-bottom" />
                  </div>
                </div>
              </div>

              {/* Bottom Case */}
              <div 
                ref={bottomCaseRef}
                className="relative w-full h-[180px] lg:h-[280px] bg-white border-2 border-solid border-[#c1e8fb] rounded-2xl overflow-hidden group opacity-0"
              >
                {/* Text Block - TOP LEFT */}
                <div className="absolute top-4 lg:top-10 left-4 lg:left-10 flex flex-col max-w-[180px] lg:max-w-[330px] z-10">
                  <span className="font-bold text-[19px] lg:text-[32px] leading-tight lg:leading-[36px] text-[#012169]">Tasty Cat Gravy Pouch</span>
                  <p className="font-normal text-[12px] lg:text-[15px] text-[#012169] mt-1 lg:mt-2 leading-relaxed opacity-90">
                    Soft chunks in rich gravy <br className="hidden lg:block" /> cats simply can't resist.
                  </p>
                </div>

                {/* Pill Button - BOTTOM LEFT */}
                <div className="absolute bottom-4 lg:bottom-8 left-4 lg:left-10 px-4 lg:px-5 py-1.5 lg:py-2 bg-[#134e86] rounded-full flex justify-center items-center gap-2 transition-transform hover:scale-105 cursor-pointer z-10">
                  <span className="font-bold text-[10px] lg:text-[10px] text-white">Pawwl Select Product</span>
                  <ArrowUpRight size={10} className="text-white" />
                </div>

                {/* Images - GROUPED RIGHT */}
                <div className="absolute right-0 bottom-0 h-full w-[150px] lg:w-[320px] z-0">
                  <div className="absolute left-4 lg:left-20 bottom-0 w-[70px] lg:w-[150px] h-[90px] lg:h-[180px]">
                    <img src={fr21} alt="" className="w-full h-full object-contain object-bottom" />
                  </div>
                  <div className="absolute right-0 top-0 w-[80px] lg:w-[160px] h-full">
                    <img src={fr22} alt="" className="w-full h-full object-contain object-right-top" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop-Only Rows (2, 3, 4) - Hidden on Mobile */}
          <div className="hidden lg:flex flex-col gap-8 overflow-hidden">
            {/* Row 2: Three Food Cards */}
            <div 
              ref={desktopRowRef}
              className="grid grid-cols-3 gap-8"
            >
              {[
                { title: "Adult Cat Dry Food", desc: "Crunchy bites packed with protein for adult cats." },
                { title: "Puppy Starter Food", desc: "Balanced nutrition to fuel growing puppies daily." },
                { title: "Chicken Jerky Sticks", desc: "Slow-cooked meaty jerky — perfect training reward." }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="fp-desktop-card h-[165px] bg-white border-2 border-[#c1e8fb] rounded-2xl relative overflow-hidden group opacity-0"
                >
                  <div className="absolute top-4 left-6 flex flex-col max-w-[200px] z-10">
                    <span className="font-bold text-[18px] text-[#134e86] leading-tight mb-1">{item.title}</span>
                    <p className="font-normal text-[14px] text-[#012169] leading-tight opacity-70">{item.desc}</p>
                  </div>
                  <div className="absolute bottom-4 left-6 w-[130px] h-[28px] flex justify-center items-center gap-2 bg-[#134e86] rounded-[20px] cursor-pointer z-10">
                    <span className="font-bold text-[9px] text-[#fffbf2]">Pawwl Select Product</span>
                    <ArrowUpRight size={8} className="text-[#fffbf2]" />
                  </div>
                  <div className="absolute right-0 bottom-0 h-full w-[160px] z-0">
                    <div className="absolute right-0 bottom-0 w-[95px] h-[155px]">
                      <img src={row211} alt="" className="w-full h-full object-contain object-right-bottom" />
                    </div>
                    <div className="absolute right-10 bottom-0 w-[85px] h-[145px]">
                      <img src={row21} alt="" className="w-full h-full object-contain object-bottom" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3: Accessories & Day Care - Perfectly Aligned Containers */}
            <div className="flex flex-row gap-[32.3px] items-end w-full overflow-hidden">
              {/* Accessories Card */}
              <div 
                ref={accRef}
                className="w-[490px] h-[175px] flex items-end relative overflow-visible flex-shrink-0 opacity-0"
              >
                <div className="w-[490px] h-[145px] bg-white border-2 border-[#c1e8fb] rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-5 left-6 flex flex-col gap-[4px] z-10 w-[410px]">
                    <h4 className="text-[20px] font-bold text-[#134e86] leading-tight">Wide Range of Accessories for Pets</h4>
                    <p className="text-[#012169] text-[13px] font-normal opacity-70">Collars, bowls, beds and grooming kits — all in one place.</p>
                  </div>
                  <div className="absolute bottom-5 left-6 px-6 py-2 bg-[#134e86] rounded-full flex justify-center items-center gap-3 cursor-pointer z-10 transition-transform hover:scale-105">
                    <span className="font-bold text-[10px] text-[#fffbf2]">Pawwl Select Product</span>
                    <ArrowUpRight size={10} className="text-[#fffbf2]" />
                  </div>
                  <div className="absolute right-0 bottom-0 h-full w-[200px] z-0">
                    <div className="absolute right-0 bottom-0 w-[140px] h-[105px]">
                      <img src={lrow11} alt="" className="w-full h-full object-contain object-right-bottom" />
                    </div>
                    <div className="absolute right-14 bottom-0 w-[150px] h-24">
                      <img src={lrow1} alt="" className="w-full h-full object-contain object-bottom" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Day Care Card */}
              <div 
                ref={daycareRef}
                className="flex-1 min-h-[175px] relative overflow-visible flex items-end opacity-0"
              >
                <div className="w-full h-[145px] bg-white border-2 border-[#c1e8fb] rounded-2xl relative z-0">
                   <div className="absolute top-5 left-6 flex flex-col gap-[4px] z-10 w-full sm:max-w-[340px]">
                    <h4 className="text-[20px] font-bold text-[#134e86] leading-tight">Best Day Care in Town!</h4>
                    <p className="text-[#012169] text-[13px] font-normal opacity-70">Safe daycare, grooming and pampering for your furry family.</p>
                  </div>
                  {/* Pill Button */}
                  <div className="absolute bottom-5 left-6 px-6 py-2 bg-[#134e86] rounded-full flex justify-center items-center gap-3 cursor-pointer z-10 transition-transform hover:scale-105">
                    <span className="font-bold text-[10px] text-[#fffbf2]">Pawwl Select Product</span>
                    <ArrowUpRight size={10} className="text-[#fffbf2]" />
                  </div>
                </div>
                {/* Pet Row - Standardized Positioning */}
                <div className="absolute right-4 bottom-[-12px] w-[380px] h-[150px] z-20 pointer-events-none items-end flex justify-end">
                  <img src={bentolast} alt="Day care pets" className="w-full h-auto object-contain object-right-bottom" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-Only Modular Layout - Hidden on Desktop */}
          <div className="lg:hidden flex flex-col gap-6 overflow-hidden">
            <div ref={mobileGridRef} className="grid grid-cols-2 gap-4">
               {/* 4 Cards: 3 Food + 1 Accessories */}
               {[
                 { title: "Adult Cat Dry Food", desc: "Crunchy protein bites for cats." },
                 { title: "Puppy Starter Food", desc: "Balanced nutrition for puppies." },
                 { title: "Chicken Jerky Sticks", desc: "Meaty jerky training treats." },
                 { title: "Pet Accessories", desc: "Bowls, collars and more." }
               ].map((item, idx) => {
                 const i = idx + 1;
                 return (
                 <div 
                   key={i} 
                   className="fp-mobile-card w-full h-[230px] bg-white border-2 border-[#c1e8fb] rounded-2xl relative overflow-hidden flex flex-col p-3 opacity-0"
                 >
                   {/* Top Text Related */}
                   <div className="flex flex-col gap-1 z-10 h-[80px]">
                      <span className="font-bold text-[15px] text-[#134e86] leading-tight">
                        {item.title}
                      </span>
                      <p className="text-[#012169] text-[11px] opacity-70 leading-tight">
                        {item.desc}
                      </p>
                      <div className="mt-1 w-[100px] h-6 flex justify-center items-center bg-[#134e86] rounded-[12px] gap-1">
                        <span className="text-[9px] font-bold text-white">Pawwl Select</span>
                        <ArrowUpRight size={8} className="text-white" />
                      </div>
                   </div>

                   {/* Bottom Image Cluster - Moved further Bottom Right */}
                   <div className="absolute bottom-0 left-0 w-full h-[120px] z-0 flex justify-center items-end bg-[#f8fdff]">
                     {i === 4 ? (
                       <div className="relative w-full h-full">
                          <img src={lrow11} className="w-[70px] h-[60px] object-contain absolute right-2 bottom-0" alt="" />
                          <img src={lrow1} className="w-[80px] h-[55px] object-contain absolute right-12 bottom-0" alt="" />
                       </div>
                     ) : (
                       <div className="relative w-full h-full">
                          <img src={row211} className="w-[60px] h-[90px] object-contain absolute right-2 bottom-0" alt="" />
                          <img src={row21} className="w-[50px] h-[80px] object-contain absolute right-14 bottom-0" alt="" />
                       </div>
                     )}
                   </div>
                 </div>
                 );
               })}
            </div>

            {/* Day Care - Full Row Mobile */}
            <div 
              ref={mobileDaycareRef}
              className="w-full h-[180px] bg-white border-2 border-[#c1e8fb] rounded-2xl relative overflow-hidden flex flex-col p-4 opacity-0"
            >
               <div className="flex flex-col gap-1 z-10 h-[80px]">
                  <h4 className="text-[18px] font-bold text-[#134e86]">Best Day Care in Town!</h4>
                  <p className="text-[#012169] text-[12px] opacity-70">Safe daycare and grooming for your furry family.</p>
                  <div className="mt-2 text-center max-w-fit px-5 py-2 bg-[#134e86] rounded-full flex items-center justify-center gap-2">
                    <span className="text-[10px] font-bold text-white">Pawwl Select Product</span>
                    <ArrowUpRight size={10} className="text-white" />
                  </div>
               </div>
               {/* Image - Slightly Bigger for Mobile */}
               <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[320px] h-[100px] z-0 flex justify-center items-end">
                 <img src={bentolast} className="w-full h-auto object-contain object-bottom" alt="" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

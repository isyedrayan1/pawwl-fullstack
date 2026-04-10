import React from 'react';
import doc1 from "@/assets/doccards/doc1.png";
import doc2 from "@/assets/doccards/doc2.png";
import doc3 from "@/assets/doccards/doc3.png";

const doctors = [
  { 
    name: "Fur haven", 
    role: "Pet Care Manager", 
    img: doc1 
  },
  { 
    name: "Corrie Orvis", 
    role: "Veterinarian", 
    img: doc2 
  },
  { 
    name: "Canine Comforts", 
    role: "Dog Trainer", 
    img: doc3 
  }
];

const DoctorsSection = () => {
  return (
    <section className="bg-white flex justify-center w-full">
      <div className="w-full max-w-[1440px] flex flex-col items-center gap-8 self-stretch bg-white px-6 md:px-12 lg:px-40 py-12 md:py-[100px]">
        
        {/* Header */}
        <div className="w-full max-w-[900px] flex flex-col items-center gap-3">
          <h2 className="font-heading font-black text-[32px] md:text-[51.4px] leading-tight md:leading-[58.8px] text-center text-[#134e86]">
            Honoring Those Who Serve<br className="hidden md:block" />Our Vets, Our Heroes
          </h2>
          <p className="font-normal text-[18px] md:text-[20px] leading-[24px] text-center text-[#134e86] opacity-80 max-w-3xl">
            “Honoring those who serve with courage and compassion, our vets embody true heroism. Their dedication inspires gratitude every day with courage and compassion, our vets embody true heroism.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full">
          {doctors.map((vet, i) => (
            <div key={i} className="w-full max-w-[352px] lg:w-[352px] flex flex-col items-start gap-2.5 group">
              <div className="w-full h-[450px] rounded-[32px] overflow-hidden relative">
                <img 
                  src={vet.img} 
                  alt={vet.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-1.5 self-stretch p-3">
                <span className="font-bold text-[26px] md:text-[34px] lg:text-[37.7px] tracking-tight leading-tight md:leading-[44.1px] text-[#003459] w-full text-left whitespace-nowrap overflow-hidden text-ellipsis">
                  {vet.name}
                </span>
                <span className="font-semibold text-[16px] md:text-[17.9px] text-[#003459] w-full text-left">
                  {vet.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;

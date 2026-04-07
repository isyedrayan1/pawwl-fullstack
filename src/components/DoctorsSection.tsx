import React from 'react';

const doctors = [
  { 
    name: "Fur haven", 
    role: "Pet Care Manager", 
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=600&fit=crop" 
  },
  { 
    name: "Corrie Orvis", 
    role: "Veterinarian", 
    img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&h=600&fit=crop" 
  },
  { 
    name: "Canine Comforts", 
    role: "Dog Trainer", 
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&h=600&fit=crop" 
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 justify-center w-full">
          {doctors.map((vet, i) => (
            <div key={i} className="w-full flex flex-col justify-center gap-2.5 group">
              <div className="w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-[16px] overflow-hidden relative shadow-lg">
                <img 
                  src={vet.img} 
                  alt={vet.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003459]/20 to-transparent"></div>
              </div>
              <div className="flex flex-col gap-1.5 self-stretch p-2 sm:p-3 rounded-xl min-h-[80px] sm:min-h-[140px] items-start">
                <h3 className="font-bold text-[20px] sm:text-[28px] md:text-[37.7px] leading-tight md:leading-[44.1px] text-[#003459] mb-1">
                  {vet.name}
                </h3>
                <p className="font-semibold text-[16px] md:text-[17.9px] text-[#003459]/70">
                  {vet.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;

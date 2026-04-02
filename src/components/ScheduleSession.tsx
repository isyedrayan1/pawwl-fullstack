import { Button } from "@/components/ui/button";
import petShopImg from "@/assets/pet_shop.png";

const ScheduleSession = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
      <h2 className="text-5xl md:text-6xl font-heading font-black text-[#1A4B6B] text-center mb-6">
        Schedule a session with Pawwl
      </h2>
      <p className="text-center text-gray-400 font-medium text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
        Let's make every meow and wag a celebration. Let's make every moment count for your pet.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        {/* Store image */}
        <div className="relative rounded-[48px] overflow-hidden min-h-[500px] shadow-2xl">
          <img
            src={petShopImg}
            alt="Pet shop storefront"
            className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A4B6B]/60 to-transparent"></div>
          <div className="absolute bottom-10 left-10 text-white">
            <h3 className="text-3xl font-heading font-black mb-2">Visit Our Store</h3>
            <p className="text-white/80 font-medium">123 Pet Lane, Suite 100, New York</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white border-2 border-[#E9F7FB] rounded-[48px] p-8 md:p-12 shadow-sm flex flex-col justify-center">
          <h3 className="text-3xl font-heading font-black text-[#1A4B6B] mb-8">Book Pet Session</h3>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1A4B6B] uppercase tracking-wider ml-1">First Name</label>
                <input type="text" placeholder="John" className="w-full bg-[#F8FDFF] border-2 border-[#E9F7FB] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#67B5D5] transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1A4B6B] uppercase tracking-wider ml-1">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full bg-[#F8FDFF] border-2 border-[#E9F7FB] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#67B5D5] transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A4B6B] uppercase tracking-wider ml-1">Phone Number</label>
              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-[#F8FDFF] border-2 border-[#E9F7FB] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#67B5D5] transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1A4B6B] uppercase tracking-wider ml-1">Date</label>
                <input type="date" className="w-full bg-[#F8FDFF] border-2 border-[#E9F7FB] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#67B5D5] transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1A4B6B] uppercase tracking-wider ml-1">Category</label>
                <select className="w-full bg-[#F8FDFF] border-2 border-[#E9F7FB] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#67B5D5] transition-colors appearance-none">
                  <option>Grooming</option>
                  <option>Vet Check-up</option>
                  <option>Training</option>
                </select>
              </div>
            </div>

            <Button className="w-full rounded-full bg-[#1A4B6B] hover:bg-[#153a54] text-white py-8 text-lg font-bold shadow-xl transform active:scale-95 transition-all mt-4">
              Submit Now
            </Button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

export default ScheduleSession;

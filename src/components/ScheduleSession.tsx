import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar as CalendarIcon, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import petShopImg from "@/assets/pet_shop.png";

const ScheduleSession = () => {
  const [date, setDate] = React.useState<Date>();

  return (
    <section className="py-24 bg-white">
      <div className="section-container">
        <div className="w-full flex flex-col justify-between items-center gap-12">
          {/* Header Section */}
          <div className="flex flex-col justify-center items-center gap-4 self-stretch">
            <h2 className="font-extrabold text-[32px] md:text-[48px] text-center text-[#012169] leading-tight px-4">
              Schedule a session with Pawwl
            </h2>
            <p className="font-normal text-[20px] leading-[24px] text-center text-[#012169] max-w-[800px] opacity-80">
              BarkBox isn’t just a box of dog stuff. It’s a monthly surprise that brings joy and enrichment to your pup’s life.
            </p>
          </div>

          {/* Form Card */}
          <div className="w-full flex lg:flex-row flex-col gap-8 bg-white p-6 rounded-3xl border-2 border-solid border-[#c1e8fb] shadow-xl">
            {/* Left Image Section */}
            <div className="lg:w-[556px] w-full self-stretch rounded-2xl overflow-hidden shadow-inner min-h-[400px]">
              <img 
                src={petShopImg} 
                alt="Schedule Session" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
              />
            </div>

            {/* Right Form Section */}
            <div className="lg:w-[498px] w-full flex flex-col gap-6">
              <div className="flex flex-col gap-2 self-stretch">
                <h3 className="font-bold text-[28px] text-brand-dark tracking-tight">Pawwl Pet Services</h3>
                <p className="font-medium text-[15px] leading-relaxed text-gray-500 max-w-md">
                  Because Every Pet Deserves Thoughtful Care. <br />
                  Connect with Pawwl and book a stress-free grooming session today.
                </p>
              </div>

              <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-4">
                  {/* Row 1: Your Name & Contact */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 self-stretch">
                    <div className="flex-1 w-full flex flex-col gap-1.5 focus-within:text-brand-blue transition-colors">
                      <label className="font-semibold text-xs text-[#939598] uppercase tracking-wider ml-1">Your Name</label>
                      <div className="flex items-center gap-2 self-stretch bg-white px-4 py-3 rounded-xl border border-solid border-[#f0f0f0] focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue/20 transition-all shadow-sm">
                        <input type="text" placeholder="Ex: John Doe" className="w-full font-medium text-sm text-[#555555] focus:outline-none placeholder:text-gray-300" />
                      </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col gap-1.5 focus-within:text-brand-blue transition-colors">
                      <label className="font-semibold text-xs text-[#939598] uppercase tracking-wider ml-1">Contact Info</label>
                      <div className="flex items-center gap-2 self-stretch bg-white px-4 py-3 rounded-xl border border-solid border-[#f0f0f0] focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue/20 transition-all shadow-sm">
                        <span className="font-bold text-sm text-brand-blue">+91</span>
                        <input type="tel" placeholder="XXXXX XXXXX" className="w-full font-medium text-sm text-[#555555] focus:outline-none placeholder:text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Email */}
                  <div className="flex flex-col gap-1.5 focus-within:text-brand-blue transition-colors">
                    <label className="font-semibold text-xs text-[#939598] uppercase tracking-wider ml-1">Email Address</label>
                    <div className="flex items-center gap-2 self-stretch bg-white px-4 py-3 rounded-xl border border-solid border-[#f0f0f0] focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue/20 transition-all shadow-sm">
                      <input type="email" placeholder="johndoe001@example.com" className="w-full font-medium text-sm text-[#555555] focus:outline-none placeholder:text-gray-300" />
                    </div>
                  </div>

                  {/* Row 3: Pet Name & Type */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 self-stretch">
                    <div className="flex-1 w-full flex flex-col gap-1.5 focus-within:text-brand-blue transition-colors">
                      <label className="font-semibold text-xs text-[#939598] uppercase tracking-wider ml-1">Pet Name</label>
                      <div className="flex items-center gap-2 self-stretch bg-white px-4 py-3 rounded-xl border border-solid border-[#f0f0f0] focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue/20 transition-all shadow-sm">
                        <input type="text" placeholder="Rocky" className="w-full font-medium text-sm text-[#555555] focus:outline-none placeholder:text-gray-300" />
                      </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col gap-1.5 ">
                      <label className="font-semibold text-xs text-[#939598] uppercase tracking-wider ml-1">Pet Type & Breed</label>
                      <div className="flex items-center gap-2 self-stretch bg-white px-4 py-3 rounded-xl border border-solid border-[#f0f0f0] focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue/20 transition-all shadow-sm focus-within:text-brand-blue">
                        <input type="text" placeholder="Cat (Persian)" className="w-full font-medium text-sm text-[#555555] focus:outline-none placeholder:text-gray-300" />
                        <ChevronDown size={14} className="text-[#939598] transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Gender & Age */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 self-stretch">
                    <div className="flex-1 w-full flex flex-col gap-1.5">
                      <label className="font-semibold text-xs text-[#939598] uppercase tracking-wider ml-1">Pet Gender</label>
                      <Select>
                        <SelectTrigger className="w-full bg-white px-4 py-3 h-auto rounded-xl border border-solid border-[#f0f0f0] focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all shadow-sm text-sm font-medium text-[#555555]">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#c1e8fb] shadow-xl">
                          <SelectItem value="male" className="rounded-lg">Male</SelectItem>
                          <SelectItem value="female" className="rounded-lg">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 w-full flex flex-col gap-1.5 focus-within:text-brand-blue transition-colors">
                      <label className="font-semibold text-xs text-[#939598] uppercase tracking-wider ml-1">Pet Age</label>
                      <div className="flex items-center gap-2 self-stretch bg-white px-4 py-3 rounded-xl border border-solid border-[#f0f0f0] focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue/20 transition-all shadow-sm">
                        <input type="text" placeholder="23 Months" className="w-full font-medium text-sm text-[#555555] focus:outline-none placeholder:text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Select Service */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-xs text-[#939598] uppercase tracking-wider ml-1">Select Service</label>
                    <Select>
                      <SelectTrigger className="w-full bg-white px-4 py-3 h-auto rounded-xl border border-solid border-[#f0f0f0] focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all shadow-sm text-sm font-medium text-[#555555]">
                        <SelectValue placeholder="Super Body Grooming + Vaccination" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#c1e8fb] shadow-xl">
                        <SelectItem value="grooming" className="rounded-lg text-sm">Full Body Grooming + Vaccination</SelectItem>
                        <SelectItem value="vet" className="rounded-lg text-sm">Veterinary Consultation</SelectItem>
                        <SelectItem value="training" className="rounded-lg text-sm">Professional Pet Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Row 6: Date & Time */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 self-stretch">
                    <div className="flex-1 w-full flex flex-col gap-1.5">
                      <label className="font-semibold text-xs text-[#939598] uppercase tracking-wider ml-1">Desired Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full bg-white px-4 py-3 h-auto justify-between rounded-xl border border-solid border-[#f0f0f0] focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 text-sm font-medium text-[#555555] shadow-sm hover:bg-white text-left",
                              !date && "text-muted-foreground"
                            )}
                          >
                            {date ? format(date, "PPP") : <span>01 - March - 2026</span>}
                            <CalendarIcon className="h-4 w-4 text-[#939598]" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-[#c1e8fb]" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="rounded-2xl"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex-1 w-full flex flex-col gap-1.5">
                      <label className="font-semibold text-xs text-[#939598] uppercase tracking-wider ml-1">Time Slot</label>
                      <Select>
                        <SelectTrigger className="w-full bg-white px-4 py-3 h-auto rounded-xl border border-solid border-[#f0f0f0] focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all shadow-sm text-sm font-medium text-[#555555]">
                          <SelectValue placeholder="13:00 to 13:30" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#c1e8fb] shadow-xl">
                          <SelectItem value="1" className="rounded-lg">10:00 - 10:30</SelectItem>
                          <SelectItem value="2" className="rounded-lg">13:00 - 13:30</SelectItem>
                          <SelectItem value="3" className="rounded-lg">16:00 - 16:30</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="w-full flex flex-col gap-4 pt-2">
                  <span className="font-medium text-[11px] text-[#666666] opacity-70 italic">
                    *Rescheduling? Please inform us a minimum of 2 hours in advance.
                  </span>
                  <Button className="w-full bg-[#134e86] hover:bg-brand-dark text-white px-5 py-7 rounded-2xl font-bold text-[15px] shadow-lg hover:shadow-brand-blue/20 transition-all active:scale-[0.98]">
                    Schedule Booking
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSession;

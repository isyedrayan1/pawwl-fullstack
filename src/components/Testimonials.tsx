"use client";
import React from "react";
import { motion } from "motion/react";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";

const testimonials = [
  {
    text: "Tried Pawal for cat grooming and food delivery recently. The grooming was decent—staff were polite and handled my cat carefully. Overall, a good experience and worth considering.",
    name: "Smita Mane",
    role: "Cat Parent",
  },
  {
    text: "Everyone’s incredibly professional and helpful. They groomed my pet well and took good care of her. Will definitely visit again! 10/10 would recommend 👍🏼",
    name: "Shruti Parkar",
    role: "Local Guide",
  },
  {
    text: "One of the best pet centre in bhandhup west (pawwl ) recently got my cat groomed and overall the experience was very good. The groomer handled my cat gently, which is important.",
    name: "Sneha Mehra",
    role: "Cat Owner",
  },
  {
    text: "Top-notch pet care! Friendly, professional and compassionate 💗",
    name: "Tanvi Ramakrishnan",
    role: "Pet Parent",
  },
  {
    text: "My cat seemed calm after the session which shows the groomer knew how to handle pets well. Cleanliness and service was hygienic and the staff explain what they were doing which built trust.",
    name: "Nisha Luthra",
    role: "Pet Owner",
  },
  {
    text: "Every staff member was supportive and they even taught me how to use the products. Amazing staff and a good experience. For new pet parents, this shop is worth trying.",
    name: "Varun Lokhande",
    role: "New Pet Parent",
  },
  {
    text: "A seamless and elevated experienced…. The level of care and details reflects true expertises in pet services… highly recommended",
    name: "Tanya Kulkarni",
    role: "Regular Customer",
  },
  {
    text: "The shop is a treasure trove for pet accessories. I found the cutest harness for my beagle! The quality is much better than what I find online.",
    name: "Ananya Iyer",
    role: "Beagle Mom",
  },
  {
    text: "Pawwl's vet services are highly professional. The consultation was thorough and they really put my anxious pup at ease during the vaccination.",
    name: "Rahul Deshmukh",
    role: "Dog Parent",
  },
];

const firstColumn = [testimonials[0], testimonials[3], testimonials[6]];
const secondColumn = [testimonials[1], testimonials[4], testimonials[7]];
const thirdColumn = [testimonials[2], testimonials[5], testimonials[8]];

const Testimonials = () => {
  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="section-container z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[700px] mx-auto text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-brand-light text-brand-accent px-4 py-1.5 rounded-full border border-brand-accent/20 text-xs font-bold uppercase tracking-wider">
              Testimonials
            </div>
          </div>

          <h2 className="font-black text-[36px] md:text-[48px] lg:text-[56px] text-brand-dark leading-tight tracking-tight">
            What our pet parents say
          </h2>
          <p className="mt-6 text-[18px] text-brand-dark/60 max-w-xl mx-auto leading-relaxed">
            Real experiences from real customers who trust Pawwl for their furry family members.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={20} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={25} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={22} />
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-light/30 rounded-full blur-[120px] -z-0 pointer-events-none"></div>
    </section>
  );
};

export default Testimonials;

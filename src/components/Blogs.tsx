import { Button } from "@/components/ui/button";
import grooming1 from "@/assets/grooming_1.webp";
import grooming2 from "@/assets/grooming_2.webp";

const blogs = [
  {
    date: "Dec 30",
    title: "Premium Grooming Care",
    desc: "Grooming isn't just about keeping your dog clean — it's about their health. Learn our top tips for at-home grooming that rivals the pros.",
    img: grooming1,
  },
  {
    date: "Dec 30",
    title: "Premium Grooming Care",
    desc: "Discover the best grooming tools and techniques that professional groomers use daily. Keep your pet looking and feeling their best.",
    img: grooming2,
  },
];

const Blogs = () => (
  <section className="py-24 bg-white">
    <div className="section-container text-center">
      <h2 className="text-4xl md:text-6xl font-heading font-black text-[#1A4B6B] mb-6 leading-[1.1]">Blogs</h2>
      <p className="text-base md:text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
        Expert advice and inspiration to help you and your feline friends thrive together.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {blogs.map((b, i) => (
          <div key={i} className="text-left group cursor-pointer">
            <div className="rounded-[40px] overflow-hidden mb-8 relative aspect-[16/10]">
              <img 
                src={b.img} 
                alt={b.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[#1A4B6B] font-bold text-sm shadow-sm">
                {b.date}
              </div>
            </div>
            <div className="px-2">
              <h3 className="text-3xl font-heading font-black text-[#1A4B6B] mb-4 group-hover:text-[#67B5D5] transition-colors">{b.title}</h3>
              <p className="text-gray-400 text-base font-medium mb-8 leading-relaxed line-clamp-2">{b.desc}</p>
              <Button className="rounded-full bg-[#1A4B6B] hover:bg-[#153a54] text-white px-10 py-6 text-sm font-bold shadow-md w-full md:w-auto">
                Read more
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Blogs;

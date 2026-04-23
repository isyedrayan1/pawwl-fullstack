import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import blogImg1 from "@/assets/Newgallery/IMG_5056.JPG.webp";
import blogImg2 from "@/assets/Newgallery/products/IMG_5035.JPG.webp";

const blogs = [
  {
    title: "Premium Grooming Care",
    desc: "Grooming isn't just about keeping your dog clean — it's about their health. Learn our top tips for at-home grooming that rivals the pros.",
    src: blogImg1,
  },
  {
    title: "Choosing the Right Pet Food",
    desc: "Dry kibble, wet pouches or a mix? A simple guide to picking the right everyday food for your dog or cat.",
    src: blogImg2,
  },
];

const Blogs = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="section-container text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-6xl font-heading font-black text-[#1A4B6B] mb-6 leading-[1.1]">Blogs</h2>
        <p className="text-base md:text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
          Expert advice and inspiration to help you and your feline friends thrive together.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {blogs.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link 
              to={`/blog/${i === 0 ? "premium-grooming-studio" : "choosing-right-pet-products"}`}
              className="text-left group cursor-pointer transition-transform duration-300 hover:-translate-y-2 block"
            >
              <div className="rounded-[40px] overflow-hidden mb-8 relative aspect-[16/10]">
                <img 
                  src={b.src} 
                  alt={b.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="px-2">
                <h3 className="text-3xl font-heading font-black text-[#1A4B6B] mb-4 group-hover:text-[#67B5D5] transition-colors">{b.title}</h3>
                <p className="text-gray-400 text-base font-medium mb-8 leading-relaxed line-clamp-2">{b.desc}</p>
                <Button className="rounded-full bg-[#1A4B6B] hover:bg-[#153a54] text-white px-10 py-6 text-sm font-bold shadow-md w-full md:w-auto">
                  Read more
                </Button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16"
      >
        <Link to="/blog">
          <Button variant="outline" className="rounded-full border-2 border-[#1A4B6B] text-[#1A4B6B] hover:bg-[#1A4B6B] hover:text-white px-10 py-6 text-base font-bold transition-all">
            View All Blogs
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default Blogs;

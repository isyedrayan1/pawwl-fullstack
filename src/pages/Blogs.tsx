import { useIsMobile } from "@/hooks/useMediaQuery";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogs } from "@/data/blogData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const Blogs = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gs-reveal").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true }
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <SEO
        title="Pet Care Blogs | Expert Advice from Pawwl Studio Mumbai"
        description="Read our latest blogs on pet grooming, nutrition, and health. Expert tips from the professional team at Pawwl Studio, Bhandup."
      />
      <Navbar />

      <main className="py-24">
        <div className="section-container">
          <div className="gs-reveal text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-black text-[#1A4B6B] mb-6">Our Stories & Tips</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Learn everything about pet care from our experts. Simple guides, professional insights!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-hidden">
            {blogs.map((blog, i) => (
              <div
                key={blog.id}
                className="gs-reveal"
              >
                <Link to={`/blog/${blog.id}`} className="group cursor-pointer">
                  <div className="rounded-[40px] overflow-hidden mb-8 aspect-[16/10] relative shadow-lg">
                    <img
                      src={blog.mainImage}
                      alt={blog.title}
                      loading="lazy" decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-sm text-[#1A4B6B] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <div className="px-2">
                    <p className="text-sm text-gray-400 font-medium mb-3">{blog.date}</p>
                    <h2 className="text-2xl md:text-3xl font-heading font-black text-[#1A4B6B] mb-4 group-hover:text-[#67B5D5] transition-colors leading-tight">
                      {blog.title}
                    </h2>
                    <p className="text-gray-400 text-base font-medium mb-8 leading-relaxed line-clamp-2">
                      {blog.desc}
                    </p>
                    <Button className="rounded-full bg-[#1A4B6B] hover:bg-[#153a54] text-white px-8 py-5 text-sm font-bold shadow-md">
                      Read Full Story
                    </Button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blogs;
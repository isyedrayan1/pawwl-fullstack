import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogs } from "@/data/blogData";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";

const BlogDetail = () => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
          <Link to="/blog">
            <Button>Back to Blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${blog.title} | Pawwl Blog`}
        description={blog.desc}
      />
      <Navbar />
      
      <main className="py-12 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#1A4B6B] font-bold mb-8 hover:underline group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Blogs
          </Link>

          <div className="mb-12">
            <span className="bg-[#D8FAFF] text-[#1A4B6B] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-black text-[#1A4B6B] mb-6 leading-tight">
              {blog.title}
            </h1>
            <p className="text-gray-400 font-medium">{blog.date} • Pawwl Editorial Team</p>
          </div>

          <div className="rounded-[40px] overflow-hidden mb-12 aspect-[16/9] shadow-xl">
            <img 
              src={blog.mainImage} 
              alt={blog.title} 
              className="w-full h-full object-cover" 
            />
          </div>

          <article 
            className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed
            prose-headings:text-[#1A4B6B] prose-headings:font-black prose-headings:font-heading
            prose-strong:text-[#1A4B6B] prose-strong:font-bold
            prose-li:marker:text-[#67B5D5]"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.highlightImages && (
            <div className="mt-16">
              <h2 className="text-2xl md:text-3xl font-heading font-black text-[#1A4B6B] mb-8">Studio Highlights</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {blog.highlightImages.map((img, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden aspect-square shadow-md hover:scale-105 transition-transform duration-500">
                    <img src={img} className="w-full h-full object-cover" alt={`Highlight ${i}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-20 p-8 md:p-12 bg-[#D8FAFF] rounded-[40px] text-center">
            <h3 className="text-2xl md:text-3xl font-heading font-black text-[#1A4B6B] mb-4">Visit Our Studio Today!</h3>
            <p className="text-[#1A4B6B]/80 mb-8 max-w-xl mx-auto">
              Experience the premium grooming and professional care that everyone is talking about. Your pet will love it!
            </p>
            <Link to="/contact">
              <Button className="rounded-full bg-[#1A4B6B] hover:bg-[#153a54] text-white px-10 py-6 text-base font-bold shadow-lg">
                Book a Session
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;

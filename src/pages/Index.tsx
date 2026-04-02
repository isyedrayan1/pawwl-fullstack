import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyPawwl from "@/components/WhyPawwl";
import Blogs from "@/components/Blogs";
import BornFromLove from "@/components/BornFromLove";
import ScheduleSession from "@/components/ScheduleSession";
import PetGallery from "@/components/PetGallery";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <FeaturedProducts />
    <WhyPawwl />
    <Blogs />
    <BornFromLove />
    <ScheduleSession />
    <PetGallery />
    <Testimonials />
    <CTASection />
    <Newsletter />
    <Footer />
  </div>
);

export default Index;

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyPawwl from "@/components/WhyPawwl";
import Blogs from "@/components/Blogs";
import BornFromLove from "@/components/BornFromLove";
import ScheduleSession from "@/components/ScheduleSession";
import PetGallery from "@/components/PetGallery";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <Hero />
    <Services />
    <WhyPawwl />
    <Blogs />
    <BornFromLove />
    <ScheduleSession />
    <PetGallery />
    <Testimonials />
    <Footer />
  </div>
);

export default Index;

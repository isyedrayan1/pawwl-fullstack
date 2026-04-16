import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroVideo from "@/components/IntroVideo";
import HomeServices from "@/components/HomeServices";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyPawwl from "@/components/WhyPawwl";
import Blogs from "@/components/Blogs";
import BornFromLove from "@/components/BornFromLove";
import ScheduleSession from "@/components/ScheduleSession";
import PetGallery from "@/components/PetGallery";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => (
  <div className="min-h-screen bg-white">
    <SEO 
      title="Pawwl | Best Pet Care, Clinic & Shop in Bhandup, Mumbai"
      description="Experience premium pet care at Pawwl Mumbai. We offer professional vet services, pet grooming, boarding, and high-quality accessories in Bhandup West."
    />
    <Navbar />
    <Hero />
    <HomeServices />
    <FeaturedProducts />
    <IntroVideo />
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

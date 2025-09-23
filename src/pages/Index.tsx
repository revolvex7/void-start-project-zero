import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CreatorGallerySection from '@/components/CreatorGallerySection';
import TestimonialSection from '@/components/TestimonialSection';
import CallToActionSection from '@/components/CallToActionSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <CreatorGallerySection />
      <TestimonialSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Index;

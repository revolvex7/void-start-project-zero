import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CreativitySection from '@/components/CreativitySection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <CreativitySection />
      <Footer />
    </div>
  );
};

export default Index;

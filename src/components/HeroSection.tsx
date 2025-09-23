import { ChevronDown } from 'lucide-react';
import AnimatedHeroText from './AnimatedHeroText';
import CreatorSpotlight from './CreatorSpotlight';
import heroBg1 from '@/assets/hero-bg-1.jpg';
import heroBg2 from '@/assets/hero-bg-2.jpg';
import heroBg3 from '@/assets/hero-bg-3.jpg';
import heroBg4 from '@/assets/hero-bg-4.jpg';
import heroBg5 from '@/assets/hero-bg-5.jpg';
import heroBg6 from '@/assets/hero-bg-6.jpg';
import { useState, useEffect } from 'react';

const backgroundImages = [
  heroBg1,
  heroBg2,
  heroBg3,
  heroBg4,
  heroBg5,
  heroBg6
];

const HeroSection = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Images with Transition */}
      {backgroundImages.map((bg, index) => (
        <div 
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentBgIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 patreon-hero-overlay" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">
          {/* Left Column - Hero Text */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="animate-fade-up">
              <AnimatedHeroText />
            </div>
            
            <div className="animate-fade-up delay-300">
              <p className="text-xl lg:text-2xl text-foreground/90 font-light max-w-lg patreon-text-shadow">
                Patreon powers creative independence. Our platform makes it easy for 
                creators to get paid for making the things they're already making.
              </p>
            </div>
            
            <div className="animate-fade-up delay-500">
              <button className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 patreon-hover-glow shadow-lg">
                Start my page
              </button>
            </div>
          </div>
          
          {/* Right Column - Creator Spotlight */}
          <div className="flex flex-col justify-center space-y-6 animate-fade-up delay-700">
            <CreatorSpotlight
              name="Jade Novah"
              description="fusing her loves of music, writing, and comedy"
              className="ml-auto max-w-md"
            />
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-foreground/60" />
      </div>
    </section>
  );
};

export default HeroSection;
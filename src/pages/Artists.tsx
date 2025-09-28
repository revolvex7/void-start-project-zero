import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Artists = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden musicians-gradient gradient-overlay-hover">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-tight mb-8 text-white drop-shadow-2xl">
            Visual
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">storytelling</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl mx-auto text-white/90 drop-shadow-lg">
            Visual artists like you earned more than ₦472 million on True Fans in 2024
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-300"
          >
            Start creating
          </Button>
        </div>
      </section>

      {/* Made Easy Section */}
      <section className="py-20 lg:py-32 bg-musicians-medium gradient-overlay-hover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white drop-shadow-lg">
            Made
            <br />
            <span className="text-white/90">easy</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Not only can you earn recurring income on True Fans through paid membership, you can also sell individual pieces and other downloadable exclusives to all of your fans in your personal online shop.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 lg:py-32 bg-musicians-light gradient-overlay-hover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-light mb-8 text-white">
              Your art, your audience
            </h2>
            <p className="text-lg text-white/80 mb-12 max-w-3xl mx-auto">
              Share your creative process, sell exclusive artwork, and build a community around your visual storytelling.
            </p>
            <Button className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-3 rounded-full transition-all duration-300">
              Learn more
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Artists;
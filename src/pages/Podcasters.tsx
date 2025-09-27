import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import podcastsHeroBg from '@/assets/podcasts-hero-bg.png';

const Podcasters = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${podcastsHeroBg})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h1 className="text-6xl lg:text-8xl font-light leading-tight mb-6">
                podcasts
                <br />
                <span className="font-semibold">grow</span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 max-w-lg">
                Join thousands of podcasters building their audience and earning from their passion.
              </p>
              
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-full"
              >
                Start creating
              </Button>
            </div>
            
            {/* Right Content - Creator Spotlight */}
            <div className="lg:flex lg:justify-end">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">EW</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Elliott Wilson</h3>
                    <p className="text-white/80">is building community around hip-hop journalism</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="get-to-know-your-listeners" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4" id="get-to-know-your-listeners">Get to know your listeners</h3>
              <p className="text-gray-600">Build deeper connections with your audience through direct engagement and feedback.</p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4" id="cut-through-the-noise">Cut through the noise</h3>
              <p className="text-gray-600">Stand out in a crowded podcast landscape with exclusive content and community.</p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4" id="more-ways-to-get-paid">More ways to get paid</h3>
              <p className="text-gray-600">Monetize your passion through memberships, exclusive content, and fan support.</p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4" id="other-podcasters">Other podcasters on True Fans</h3>
              <p className="text-gray-600">Join a community of successful podcasters already growing on our platform.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Podcasters;
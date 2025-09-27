import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const GameDevs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Game Developers</h1>
          <p className="text-xl text-gray-600 mb-12">
            This is the Game Developers page under Creators category. Content coming soon.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="safe-way-to-get-paid">A safe way to get paid</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="selling-made-simple">Selling made simple</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="real-community-thrives">Where real community thrives</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="other-game-devs">Other game devs on True Fans</h3>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GameDevs;
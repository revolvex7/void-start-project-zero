import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Musicians = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Musicians</h1>
          <p className="text-xl text-gray-600 mb-12">
            This is the Musicians page under Creators category. Content coming soon.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="from-mind-to-ears">From your mind to their ears</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="share-more-than-music">Share more than music</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="more-ways-to-get-paid">More ways to get paid</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="other-musicians">Other musicians on True Fans</h3>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Musicians;
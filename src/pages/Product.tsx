import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Product = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Create</h1>
          <p className="text-xl text-gray-600 mb-12">
            This is the Create page under Product or Features. Content coming soon.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="getting-started">Getting started on True Fans</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="make-it-your-own">Make it your own</h3>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4" id="showcase-your-work">Showcase your work</h3>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Product;
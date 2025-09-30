import React from 'react';
import creatorJade from '@/assets/creator-jade.jpg';
import heroBg1 from '@/assets/hero-bg-1.jpg';
import heroBg2 from '@/assets/hero-bg-2.jpg';
import heroBg3 from '@/assets/hero-bg-3.jpg';

const PatreonBlueBand: React.FC = () => {
  return (
    <section className="relative py-32 md:py-48 bg-gradient-to-b from-sky-100 via-blue-50 to-sky-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 mb-6 leading-tight">
          Complete creative control
        </div>
        <p className="mx-auto max-w-3xl text-lg md:text-xl text-slate-700 leading-relaxed">
          Patreon is your space to create what excites you most—whether polished or rough—sharing your work with your most passionate fans.
        </p>
        <button className="mt-10 px-8 py-4 rounded-full bg-black text-white text-lg font-medium hover:bg-black/90 transition-colors shadow-lg">
          Create on your terms
        </button>
      </div>
      {/* decorative thumbnails to mimic collage feel */}
      <img src={creatorJade} alt="creator" className="hidden md:block absolute top-1/4 left-5 md:left-10 w-40 h-28 object-cover rounded-lg shadow-xl rotate-3 transform transition-transform duration-300 hover:scale-105" />
      <img src={heroBg1} alt="hero background" className="hidden md:block absolute bottom-1/4 right-5 md:right-10 w-48 h-32 object-cover rounded-lg shadow-xl -rotate-6 transform transition-transform duration-300 hover:scale-105" />
      <img src={heroBg2} alt="hero background 2" className="hidden lg:block absolute top-10 right-1/4 w-32 h-24 object-cover rounded-lg shadow-xl -rotate-2 transform transition-transform duration-300 hover:scale-105" />
      <img src={heroBg3} alt="hero background 3" className="hidden lg:block absolute bottom-10 left-1/4 w-36 h-24 object-cover rounded-lg shadow-xl rotate-4 transform transition-transform duration-300 hover:scale-105" />
    </section>
  );
};

export default PatreonBlueBand;
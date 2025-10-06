const TestimonialSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&h=800&fit=crop&crop=face"
          alt="KAMAUU"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center min-h-[600px] text-center">
          <blockquote className="mb-12">
            <p className="text-3xl lg:text-4xl xl:text-5xl font-light text-white leading-relaxed max-w-5xl mx-auto">
              "[TrueFans] provides a space for artists to sustain ourselves by connecting us directly to our own communities."
            </p>
          </blockquote>
          
          <div className="flex justify-end max-w-5xl mx-auto w-full">
            <div className="text-right">
              <div className="text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-wider">
                KAMAUU
              </div>
              <div className="text-lg text-white/80 mt-2">
                Musician & Artist
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-white/20 rounded-full" />
      </div>
      
      <div className="absolute top-8 right-8 w-12 h-12 border border-white/30 rounded-full" />
      <div className="absolute top-24 right-16 w-6 h-6 bg-white/20 rounded-full" />
    </section>
  );
};

export default TestimonialSection;
import { useRef, useEffect, useState } from 'react';

const creators = [
  {
    name: "Jade Novah",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=800&fit=crop&crop=face",
    size: "large"
  },
  {
    name: "RossDraws",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
    size: "medium"
  },
  {
    name: "KAMAUU",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=face",
    size: "small"
  },
  {
    name: "Tina Yu",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop&crop=face",
    size: "large"
  },
  {
    name: "Kevin Woo",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=350&h=500&fit=crop&crop=face",
    size: "medium"
  },
  {
    name: "Rachel Maksy",
    image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=400&h=600&fit=crop&crop=face",
    size: "small"
  }
];

const getSizeClasses = (size: string, index: number) => {
  const baseClasses = "rounded-3xl overflow-hidden relative group cursor-pointer transition-all duration-500 hover:scale-105";
  
  switch (size) {
    case "large":
      return `${baseClasses} w-80 h-96`;
    case "medium":
      return `${baseClasses} w-64 h-80`;
    case "small":
      return `${baseClasses} w-48 h-64`;
    default:
      return `${baseClasses} w-64 h-80`;
  }
};

const CreatorGallerySection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollRef.current) {
        setIsScrollable(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % creators.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollAmount = currentIndex * 320; // Approximate width of each card
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          {/* Left Side - Text Content */}
          <div className="lg:w-1/2 space-y-6 sm:space-y-8 lg:sticky lg:top-32 px-4 max-w-7xl mx-auto lg:mx-0">
            <div>
              <h2 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-gray-900 leading-none mb-2 sm:mb-4">
                Creativity
              </h2>
              <h2 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-gray-900 leading-none">
                powered
              </h2>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <p className="text-lg sm:text-xl text-gray-700 max-w-lg leading-relaxed">
                Patreon is the best place to build community with your biggest fans, share exclusive work and turn your passion into a lasting creative business.
              </p>
              
              <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                <span>https://www.patreon.com/kevinwoo</span>
              </div>
            </div>

            {/* Large decorative text */}
            <div className="hidden lg:block absolute -bottom-16 -right-16 text-9xl font-bold text-gray-900/5 pointer-events-none">
              by
            </div>
            <div className="hidden lg:block absolute -top-16 -left-16 text-8xl font-bold text-purple-500/10 pointer-events-none">
              fandom
            </div>
          </div>

          {/* Right Side - Full Width Horizontal Scrolling Gallery */}
          <div className="lg:w-1/2 w-full relative">
            <div 
              ref={scrollRef}
              className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide pb-4 px-4 lg:px-0"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {creators.map((creator, index) => (
                <div
                  key={creator.name}
                  className={getSizeClasses(creator.size, index)}
                  style={{ scrollSnapAlign: 'start', flexShrink: 0 }}
                >
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Creator Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {creator.name}
                    </h3>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            {isScrollable && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorGallerySection;
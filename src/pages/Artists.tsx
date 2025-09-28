import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, ChevronRight, Palette, Brush, Camera } from 'lucide-react';

const Artists = () => {
  const featuredArtists = [
    {
      name: "Digital Dreams",
      handle: "@digitaldreams",
      image: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Digital Art"
    },
    {
      name: "Watercolor World",
      handle: "@watercolorworld", 
      image: "https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Traditional"
    },
    {
      name: "Street Art Collective",
      handle: "@streetartcollective",
      image: "https://images.pexels.com/photos/1690351/pexels-photo-1690351.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Street Art"
    },
    {
      name: "Portrait Masters",
      handle: "@portraitmasters",
      image: "https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Portrait"
    },
    {
      name: "Abstract Visions",
      handle: "@abstractvisions",
      image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Abstract"
    }
  ];

  const [animatedItems, setAnimatedItems] = useState<{[key: string]: boolean}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for hero section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setAnimatedItems((prev) => ({ ...prev, [entry.target.id]: true }));
            }, 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    Object.keys(itemRefs.current).forEach((id) => {
      const item = itemRefs.current[id];
      if (item) {
        observer.observe(item);
      }
    });

    return () => {
      Object.keys(itemRefs.current).forEach((id) => {
        const item = itemRefs.current[id];
        if (item) {
          observer.unobserve(item);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group cursor-crosshair"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`,
          backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
          transition: 'background-position 0.3s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 group-hover:from-black/40 group-hover:via-black/20 group-hover:to-black/40 transition-all duration-700"></div>
        
        {/* Animated overlay particles */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left lg:text-left transform group-hover:scale-105 transition-transform duration-500">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-tight mb-8 text-white drop-shadow-2xl">
            Create what
            <br />
            inspires
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">you</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg">
            Artists like you earned more than ₦290 million on True Fans in 2024
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-300"
          >
            Start creating
          </Button>
        </div>
      </section>

      {/* A True Home Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#5d95ff' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#5d95ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white">
              A true home
              <br />
              <span className="text-blue-100">for artists</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Showcase Your Art */}
            <div 
              id="showcase-art-card"
              ref={el => itemRefs.current['showcase-art-card'] = el as HTMLDivElement}
              className={`text-center group/card transition-all duration-1000 ease-out ${animatedItems['showcase-art-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-3'}`}
            >
              <div className="mb-8 transition-transform duration-500 group-hover/card:-translate-y-4 group-hover/card:rotate-1">
                <div className="w-80 h-80 mx-auto bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 relative overflow-hidden">
                  <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div className="mt-16">
                    <h3 className="text-2xl font-bold text-purple-600 mb-2">Art Portfolio</h3>
                    <div className="flex items-baseline justify-center mb-6">
                      <span className="text-3xl font-bold text-black">₦20</span>
                      <span className="text-gray-500 ml-2">/ month</span>
                    </div>
                    <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3 transform hover:scale-105 transition-transform duration-200">
                      View Art
                    </Button>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Showcase your art</h3>
              <p className="text-blue-100 leading-relaxed">
                Display your artwork in high quality, share your creative process, and connect with art lovers who appreciate your unique vision.
              </p>
            </div>

            {/* Build Art Community */}
            <div 
              id="build-art-community-card"
              ref={el => itemRefs.current['build-art-community-card'] = el as HTMLDivElement}
              className={`text-center group/card transition-all duration-1000 ease-out delay-200 ${animatedItems['build-art-community-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 -rotate-3'}`}
            >
              <div className="mb-8 transition-transform duration-500 group-hover/card:-translate-y-4 group-hover/card:-rotate-1">
                <div className="w-80 h-80 mx-auto bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                    Live
                  </div>
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover/card:bg-white/30 transition-colors duration-300">
                        <Brush className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white text-sm">Digital Dreams</p>
                      <div className="flex items-center justify-center mt-4 space-x-2">
                        <div className="flex -space-x-2">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-gray-900"></div>
                          ))}
                        </div>
                        <span className="text-white text-xs">+156 Watching</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Build community</h3>
              <p className="text-blue-100 leading-relaxed">
                Host live drawing sessions, share tutorials, and engage with fellow artists and art enthusiasts in real-time creative experiences.
              </p>
            </div>

            {/* Earn From Your Passion */}
            <div 
              id="earn-passion-card"
              ref={el => itemRefs.current['earn-passion-card'] = el as HTMLDivElement}
              className={`text-center group/card transition-all duration-1000 ease-out delay-400 ${animatedItems['earn-passion-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-2'}`}
            >
              <div className="mb-8 transition-transform duration-500 group-hover/card:-translate-y-4 group-hover/card:rotate-1">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 relative overflow-hidden">
                  <div className="text-white h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm opacity-90">Digital Dreams</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Art Collection</h3>
                    <div className="flex items-center mb-4">
                      <span className="text-sm">890 collectors • 120 pieces • ₦3,200/month</span>
                    </div>
                    <p className="text-sm opacity-90 mb-6 flex-1">
                      Explore our latest digital art collection featuring exclusive NFTs, high-resolution prints, and behind-the-scenes creative process videos.
                    </p>
                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-200">
                        View free
                      </Button>
                      <Button variant="outline" className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-200">
                        Collect
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Earn from passion</h3>
              <p className="text-blue-100 leading-relaxed">
                Transform your artistic passion into sustainable income through commissions, print sales, and exclusive memberships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Create What Inspires You */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#6097ff' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#6097ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white">
              Create what
              <br />
              <span className="text-blue-100">inspires you</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="creative-freedom-content"
              ref={el => itemRefs.current['creative-freedom-content'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['creative-freedom-content'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Art Gallery Interface */}
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-6 text-white mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">Canvas Collection</h3>
                      <p className="text-purple-100">Mixed Media Series</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Camera className="w-4 h-4" />
                        <span className="text-xs">12 pieces available</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Process Videos', 'Time-lapse Creation', 'Artist Commentary'].map((title, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <Brush className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div 
              id="artistic-freedom"
              ref={el => itemRefs.current['artistic-freedom'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['artistic-freedom'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h3 className="text-3xl font-semibold mb-6 text-white">Artistic freedom</h3>
              <p className="text-lg text-blue-100 leading-relaxed">
                Share your creative process, original artworks, and exclusive tutorials with supporters who value your artistic journey and vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Earning Made Easy */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#5e95fe' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#5e95fe]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="earning-text"
              ref={el => itemRefs.current['earning-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['earning-text'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white">
                Earning made
                <br />
                <span className="text-blue-100">easy</span>
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Sell original artworks, prints, commissions, and digital downloads directly to your fans through your personalized True Fans creator shop.
              </p>
            </div>
            <div 
              id="earning-card"
              ref={el => itemRefs.current['earning-card'] = el as HTMLDivElement}
              className={`lg:pl-8 transition-all duration-1000 ease-out delay-300 ${animatedItems['earning-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-6'}`}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="bg-gradient-to-r from-purple-400 to-pink-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                      <div>
                        <h3 className="font-semibold">Digital Dreams</h3>
                        <p className="text-sm opacity-90">890 collectors • 120 pieces • ₦3,200/month</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    Latest artworks
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-300">
                        <div className="text-white text-center">
                          <div className="text-2xl mb-2 opacity-60">🎨</div>
                          <div className="text-xs">New</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artists Thrive */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#6097ff' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#6097ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="artists-thrive-heading"
            ref={el => itemRefs.current['artists-thrive-heading'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['artists-thrive-heading'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
          >
            <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white">
              Artists thrive
              <br />
              <span className="text-blue-100">on True Fans</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredArtists.map((artist, index) => (
              <div 
                key={index} 
                id={`artist-card-${index}`}
                ref={el => itemRefs.current[`artist-card-${index}`] = el as HTMLDivElement}
                className={`group/card cursor-pointer transition-all duration-1000 ease-out delay-${index * 100} ${animatedItems[`artist-card-${index}`] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-3'}`}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                  <img 
                    src={artist.image} 
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover/card:from-black/40 transition-all duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-sm">{artist.name}</h3>
                      <p className="text-white/80 text-xs">{artist.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div 
            id="your-canvas-cta"
            ref={el => itemRefs.current['your-canvas-cta'] = el as HTMLDivElement}
            className={`text-center mt-16 transition-all duration-1000 ease-out delay-500 ${animatedItems['your-canvas-cta'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
          >
            <h3 className="text-4xl lg:text-5xl font-light mb-8 text-white">
              Your canvas to create
            </h3>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg rounded-full transition-all duration-300">
              Get started
            </Button>
            <p className="mt-4 text-blue-100">
              Already have an account? <a href="/login" className="text-white underline hover:text-blue-200 transition-colors">Log in</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Artists;
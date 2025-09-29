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
            True Fans for
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">artists</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg">
            Create with complete creative control, connect directly with supporters, and build a sustainable business around your art.
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-300"
          >
            Create on True Fans
          </Button>
        </div>
      </section>

      {/* Earning Made Easy Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-400 to-blue-500 relative overflow-hidden group">
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="earning-easy-visual"
              ref={el => itemRefs.current['earning-easy-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['earning-easy-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Art Portfolio Mobile Mockup */}
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="bg-black rounded-xl overflow-hidden">
                  <div className="aspect-[9/16] p-4 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Palette className="w-6 h-6 text-purple-400" />
                        <span className="font-bold">Art Studio</span>
                      </div>
                      <div className="text-green-400 text-sm">₦15,200</div>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">Monthly earnings</div>
                    <div className="text-white text-2xl font-bold mb-6">₦45,200</div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Digital Art</span>
                        </div>
                      </div>
                      <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Paintings</span>
                        </div>
                      </div>
                      <div className="aspect-square bg-gradient-to-br from-pink-500 to-red-500 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Sketches</span>
                        </div>
                      </div>
                      <div className="aspect-square bg-gradient-to-br from-green-500 to-blue-500 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Tutorials</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-white">made easy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="earning-easy-text"
              ref={el => itemRefs.current['earning-easy-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['earning-easy-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white leading-tight">
                Earning
                <br />
                made easy
              </h2>
              
              <p className="text-lg text-blue-100 leading-relaxed">
                Not only can you earn recurring income on True Fans through paid membership, you can also sell individual pieces and other downloadable exclusives to all of your fans in your personal online shop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Create What Inspires You Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="create-inspires-text"
              ref={el => itemRefs.current['create-inspires-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['create-inspires-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black leading-tight">
                Create what
                <br />
                inspires you
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you're sharing rough sketches, polished pieces, tutorials, or behind-the-scenes content, when you post on True Fans, it gets sent directly to every single one of your fans' feeds and inboxes, without ever being blocked or buried by a gatekeeping algorithm.
              </p>
            </div>
            
            <div 
              id="create-inspires-visual"
              ref={el => itemRefs.current['create-inspires-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['create-inspires-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              {/* Art Creation Mobile Interface */}
              <div className="relative max-w-sm mx-auto">
                <div className="bg-black rounded-3xl p-4 shadow-2xl">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-gradient-to-br from-purple-100 to-pink-50 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                              <Brush className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-medium text-sm">Art Studio</span>
                          </div>
                          <div className="text-white text-xs bg-purple-500 px-2 py-1 rounded">CREATING</div>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-white mb-3">
                            <p className="text-sm font-medium mb-1">Work in Progress: Digital Portrait 🎨</p>
                            <p className="text-xs opacity-80">Sharing my creative process with exclusive behind-the-scenes...</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <span className="text-white text-sm">3.2k</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-white text-sm">248</span>
                              </div>
                            </div>
                            <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-4">
                              Follow
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/80 via-black/60 to-purple-800/80"></div>
        
        <div 
          id="testimonial-content"
          ref={el => itemRefs.current['testimonial-content'] = el as HTMLDivElement}
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transform transition-all duration-1000 ease-out ${animatedItems['testimonial-content'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        >
          <blockquote className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-white drop-shadow-2xl mb-8">
            "True Fans has become my favorite platform for offering my fans exclusive content including process videos, in-depth tutorials, and 
            <span className="text-pink-300">physical rewards such as personalized art and small sculptures"</span>
          </blockquote>
          <cite className="text-xl text-pink-200 font-medium">— Tina Yu</cite>
        </div>
      </section>

      {/* Build Community Around Your Art Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden group">
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="build-community-text"
              ref={el => itemRefs.current['build-community-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['build-community-text'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white">
                Build community
                <br />
                around your art
              </h2>
              
              <p className="text-lg text-blue-100 leading-relaxed">
                Bring your community together in real-time group chats, stay close through DMs, comments, and polls, or even reach out directly over email. Explore fan profiles to get to know the people behind all the love.
              </p>
            </div>
            
            <div 
              id="build-community-visual"
              ref={el => itemRefs.current['build-community-visual'] = el as HTMLDivElement}
              className={`lg:pl-8 transition-all duration-1000 ease-out delay-300 ${animatedItems['build-community-visual'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-6'}`}
            >
              {/* Community Interface */}
              <div className="relative max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Art Enthusiast</h3>
                        <p className="text-sm text-gray-500">Active supporter</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">"Your latest piece absolutely blew my mind! The color composition is incredible..."</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">C</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Creative Collector</h3>
                        <p className="text-sm text-gray-500">Longtime fan</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">"Thank you for sharing your creative process! Learning so much from your tutorials..."</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">F</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Fellow Artist</h3>
                        <p className="text-sm text-gray-500">New member</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">"Just joined your community! Excited to see more behind-the-scenes content..."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artists Thrive Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="artists-thrive-heading"
            ref={el => itemRefs.current['artists-thrive-heading'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['artists-thrive-heading'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
          >
            <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black">
              Artists thrive
              <br />
              <span className="text-gray-700">on True Fans</span>
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
            <h3 className="text-4xl lg:text-5xl font-light mb-8 text-black">
              Your canvas to create
            </h3>
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 hover:scale-105 px-8 py-4 text-lg rounded-full transition-all duration-300">
              Get started
            </Button>
            <p className="mt-4 text-gray-600">
              Already have an account? <a href="/login" className="text-black underline hover:text-gray-700 transition-colors">Log in</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Artists;
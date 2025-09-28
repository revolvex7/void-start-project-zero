import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, ChevronRight, Music, Headphones, Mic } from 'lucide-react';

const Musicians = () => {
  const featuredMusicians = [
    {
      name: "Indie Collective",
      handle: "@indiecollective",
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Indie Rock"
    },
    {
      name: "Jazz Fusion",
      handle: "@jazzfusion", 
      image: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Jazz"
    },
    {
      name: "Electronic Dreams",
      handle: "@electronicdreams",
      image: "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Electronic"
    },
    {
      name: "Acoustic Sessions",
      handle: "@acousticsessions",
      image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Acoustic"
    },
    {
      name: "Hip Hop Underground",
      handle: "@hiphopunderground",
      image: "https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      category: "Hip Hop"
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
          backgroundImage: `url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`,
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
            From your mind
            <br />
            to their
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">ears</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg">
            Musicians like you earned more than ₦380 million on True Fans in 2024
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
              <span className="text-blue-100">for musicians</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Share More Than Music */}
            <div 
              id="share-music-card"
              ref={el => itemRefs.current['share-music-card'] = el as HTMLDivElement}
              className={`text-center group/card transition-all duration-1000 ease-out ${animatedItems['share-music-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-3'}`}
            >
              <div className="mb-8 transition-transform duration-500 group-hover/card:-translate-y-4 group-hover/card:rotate-1">
                <div className="w-80 h-80 mx-auto bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 relative overflow-hidden">
                  <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div className="mt-16">
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">Premium Tracks</h3>
                    <div className="flex items-baseline justify-center mb-6">
                      <span className="text-3xl font-bold text-black">₦25</span>
                      <span className="text-gray-500 ml-2">/ month</span>
                    </div>
                    <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3 transform hover:scale-105 transition-transform duration-200">
                      Listen
                    </Button>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Share more than music</h3>
              <p className="text-blue-100 leading-relaxed">
                Give your fans an inside look at your creative process, share unreleased tracks, and build deeper connections through exclusive content.
              </p>
            </div>

            {/* Build Your Community */}
            <div 
              id="build-community-card"
              ref={el => itemRefs.current['build-community-card'] = el as HTMLDivElement}
              className={`text-center group/card transition-all duration-1000 ease-out delay-200 ${animatedItems['build-community-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 -rotate-3'}`}
            >
              <div className="mb-8 transition-transform duration-500 group-hover/card:-translate-y-4 group-hover/card:-rotate-1">
                <div className="w-80 h-80 mx-auto bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                    Live
                  </div>
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover/card:bg-white/30 transition-colors duration-300">
                        <Headphones className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white text-sm">Indie Collective</p>
                      <div className="flex items-center justify-center mt-4 space-x-2">
                        <div className="flex -space-x-2">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-gray-900"></div>
                          ))}
                        </div>
                        <span className="text-white text-xs">+298 Listening</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Build your community</h3>
              <p className="text-blue-100 leading-relaxed">
                Connect with your fans through live listening sessions, Q&As, and exclusive performances that bring your music to life.
              </p>
            </div>

            {/* Monetize Your Art */}
            <div 
              id="monetize-art-card"
              ref={el => itemRefs.current['monetize-art-card'] = el as HTMLDivElement}
              className={`text-center group/card transition-all duration-1000 ease-out delay-400 ${animatedItems['monetize-art-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-2'}`}
            >
              <div className="mb-8 transition-transform duration-500 group-hover/card:-translate-y-4 group-hover/card:rotate-1">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 relative overflow-hidden">
                  <div className="text-white h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm opacity-90">Indie Collective</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Latest Album</h3>
                    <div className="flex items-center mb-4">
                      <span className="text-sm">1.2k fans • 45 tracks • ₦1,500/month</span>
                    </div>
                    <p className="text-sm opacity-90 mb-6 flex-1">
                      Experience our new album with exclusive behind-the-scenes content, acoustic versions, and early access to upcoming releases. Join our musical journey!
                    </p>
                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-200">
                        Listen free
                      </Button>
                      <Button variant="outline" className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-200">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Monetize your art</h3>
              <p className="text-blue-100 leading-relaxed">
                Turn your passion into sustainable income through memberships, exclusive releases, and direct fan support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Share More Than Music */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#6097ff' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#6097ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white">
              Share more than
              <br />
              <span className="text-blue-100">music</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="streaming-sync-content"
              ref={el => itemRefs.current['streaming-sync-content'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['streaming-sync-content'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Music Streaming Interface */}
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl p-6 text-white mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">Midnight Sessions</h3>
                      <p className="text-blue-100">Acoustic EP</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Play className="w-4 h-4" />
                        <div className="flex-1 bg-white/30 rounded-full h-1">
                          <div className="bg-white rounded-full h-1 w-2/3"></div>
                        </div>
                        <span className="text-xs">3:42</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Behind the Music', 'Studio Sessions', 'Fan Q&A'].map((title, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <Mic className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div 
              id="exclusive-content"
              ref={el => itemRefs.current['exclusive-content'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['exclusive-content'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h3 className="text-3xl font-semibold mb-6 text-white">Exclusive content</h3>
              <p className="text-lg text-blue-100 leading-relaxed">
                Share acoustic versions, unreleased tracks, and behind-the-scenes stories with your most dedicated fans who support your musical journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More Ways to Get Paid */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#5e95fe' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#5e95fe]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="monetize-text"
              ref={el => itemRefs.current['monetize-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['monetize-text'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white">
                More ways to
                <br />
                <span className="text-blue-100">get paid</span>
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Beyond streaming royalties, earn directly from your fans through memberships, exclusive releases, and merchandise sales on your personal True Fans page.
              </p>
            </div>
            <div 
              id="monetize-card"
              ref={el => itemRefs.current['monetize-card'] = el as HTMLDivElement}
              className={`lg:pl-8 transition-all duration-1000 ease-out delay-300 ${animatedItems['monetize-card'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-6'}`}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="bg-gradient-to-r from-blue-400 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                      <div>
                        <h3 className="font-semibold">Indie Collective</h3>
                        <p className="text-sm opacity-90">1.2k fans • 45 tracks • ₦1,500/month</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    Latest releases
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-300">
                        <div className="text-white text-center">
                          <div className="text-2xl mb-2 opacity-60">🎵</div>
                          <div className="text-xs">4:32</div>
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

      {/* Musicians Thrive */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ backgroundColor: '#6097ff' }}>
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[#6097ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="musicians-thrive-heading"
            ref={el => itemRefs.current['musicians-thrive-heading'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['musicians-thrive-heading'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
          >
            <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white">
              Musicians thrive
              <br />
              <span className="text-blue-100">on True Fans</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredMusicians.map((musician, index) => (
              <div 
                key={index} 
                id={`musician-card-${index}`}
                ref={el => itemRefs.current[`musician-card-${index}`] = el as HTMLDivElement}
                className={`group/card cursor-pointer transition-all duration-1000 ease-out delay-${index * 100} ${animatedItems[`musician-card-${index}`] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-3'}`}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                  <img 
                    src={musician.image} 
                    alt={musician.name}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover/card:from-black/40 transition-all duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-sm">{musician.name}</h3>
                      <p className="text-white/80 text-xs">{musician.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div 
            id="your-sound-cta"
            ref={el => itemRefs.current['your-sound-cta'] = el as HTMLDivElement}
            className={`text-center mt-16 transition-all duration-1000 ease-out delay-500 ${animatedItems['your-sound-cta'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
          >
            <h3 className="text-4xl lg:text-5xl font-light mb-8 text-white">
              Your sound to share
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

export default Musicians;
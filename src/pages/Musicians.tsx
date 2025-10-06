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
            [TrueFans] for
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">musicians</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg">
            Share your music on your own terms, strengthen your bond with listeners, and diversify how you get paid.
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-300"
          >
            Create on [TrueFans]
          </Button>
        </div>
      </section>

      {/* From Your Mind to Their Ears Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-400 to-blue-500 relative overflow-hidden group">
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="mind-to-ears-visual"
              ref={el => itemRefs.current['mind-to-ears-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['mind-to-ears-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Music Video Player Mockup */}
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                  <img 
                    src="https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&dpr=2"
                    alt="Music video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 text-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/80 rounded-lg p-3 text-white">
                      <h3 className="font-semibold">New song demo 🎵</h3>
                      <p className="text-sm opacity-80">Exclusive preview for [TrueFans] supporters</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-3">
                    <Music className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Behind the music</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Headphones className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Studio sessions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mic className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Live recordings</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="mind-to-ears-text"
              ref={el => itemRefs.current['mind-to-ears-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['mind-to-ears-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white leading-tight">
                From your mind
                <br />
                to their ears
              </h2>
              
              <p className="text-lg text-blue-100 leading-relaxed">
                Whether you're sharing demos, finished tracks, or exclusive acoustic versions, when you post on True Fans, it gets sent directly to every single one of your fans' feeds and inboxes, without ever being blocked or buried by a gatekeeping algorithm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Share More Than Music Section - Multi-Color Gradient */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(to right, #7c7dae 0%, #ce628b 25%, #f5c78c 50%, #0c5c36 75%, #064a2a 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="share-more-text"
              ref={el => itemRefs.current['share-more-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['share-more-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white leading-tight">
                Share
                <br />
                more
              </h2>
              
              <div className="space-y-6 text-lg text-white/90 leading-relaxed">
                <p>
                  Create what you want: as you travel the world, from studio sessions, or wherever you get inspired. From audio to video, images, and text, share your process with the people who care most.
                </p>
              </div>
            </div>
            
            <div 
              id="share-more-visual"
              ref={el => itemRefs.current['share-more-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['share-more-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto">
                <div className="bg-white rounded-3xl p-4 shadow-2xl">
                  <div className="bg-gray-100 rounded-2xl overflow-hidden">
                    <div className="aspect-[9/16] bg-white p-4">
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                            <div>
                              <h3 className="font-medium text-gray-900">Studio Update</h3>
                              <p className="text-sm text-gray-500">2 hours ago</p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">Just finished recording the bridge for our new single! The harmonies came out amazing...</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                            <div>
                              <h3 className="font-medium text-gray-900">Behind the Scenes</h3>
                              <p className="text-sm text-gray-500">1 day ago</p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">Here's the story behind the lyrics of our latest track...</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                            <div>
                              <h3 className="font-medium text-gray-900">Exclusive Preview</h3>
                              <p className="text-sm text-gray-500">3 days ago</p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">Early access to our upcoming album. You're hearing this first!</p>
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
          backgroundImage: `url('https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-black/60 to-orange-800/80"></div>
        
        <div 
          id="testimonial-content"
          ref={el => itemRefs.current['testimonial-content'] = el as HTMLDivElement}
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transform transition-all duration-1000 ease-out ${animatedItems['testimonial-content'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        >
          <blockquote className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-white drop-shadow-2xl mb-8">
            "My fans join from all over the world to stay updated with my projects and get a deeper look into how I create my music. 
            <span className="text-orange-300">Hearing their feedback on the platform helps me stay motivated too."</span>
          </blockquote>
          <cite className="text-xl text-orange-200 font-medium">— Kevin Woo</cite>
        </div>
      </section>

      {/* More Ways to Get Paid Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden group">
        {/* Beautiful hover layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="more-ways-text"
              ref={el => itemRefs.current['more-ways-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['more-ways-text'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white">
                More ways
                <br />
                to get paid
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Not only can you earn recurring income on True Fans through paid membership, you can also sell individual pieces and other downloadable exclusives to all of your fans in your personal online shop.
              </p>
            </div>
            
            <div 
              id="more-ways-visual"
              ref={el => itemRefs.current['more-ways-visual'] = el as HTMLDivElement}
              className={`lg:pl-8 transition-all duration-1000 ease-out delay-300 ${animatedItems['more-ways-visual'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-6'}`}
            >
              {/* Music Shop Interface */}
              <div className="bg-black rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all duration-500">
                <div className="p-6 text-white">
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">Acoustic EP</h3>
                        <p className="text-gray-400 text-sm">5 tracks • High quality</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">₦2,500</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Headphones className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">Studio Sessions</h3>
                        <p className="text-gray-400 text-sm">Behind the scenes</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">₦1,500</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">Live Concert</h3>
                        <p className="text-gray-400 text-sm">Full recording</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">₦3,500</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Musicians Thrive Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="musicians-thrive-heading"
            ref={el => itemRefs.current['musicians-thrive-heading'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['musicians-thrive-heading'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
          >
            <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black">
              Musicians thrive
              <br />
              <span className="text-gray-700">on True Fans</span>
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
            <h3 className="text-4xl lg:text-5xl font-light mb-8 text-black">
              Your sound to share
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

export default Musicians;
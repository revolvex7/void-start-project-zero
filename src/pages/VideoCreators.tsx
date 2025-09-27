import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, Heart, MessageCircle, Share2, ArrowRight, ChevronRight } from 'lucide-react';

const VideoCreators = () => {
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
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/4473775/pexels-photo-4473775.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`,
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
            <span className="font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">video creators</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg">
            Create on your own terms, strengthen your relationship with your community, and diversify how you get paid.
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-300"
          >
            Create on True Fans
          </Button>
        </div>
      </section>

      {/* Turn Your Viewers Into Your People Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="turn-viewers-video"
              ref={el => itemRefs.current['turn-viewers-video'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['turn-viewers-video'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto">
                <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="bg-gray-900 rounded-[2rem] overflow-hidden">
                    {/* Phone Header */}
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    {/* Video Content */}
                    <div className="aspect-[9/16] bg-gradient-to-br from-amber-100 to-amber-200 relative">
                      <img 
                        src="https://images.pexels.com/photos/4473775/pexels-photo-4473775.jpeg?auto=compress&cs=tinysrgb&w=400&h=700&dpr=2"
                        alt="Video creator content"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Video UI Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                        {/* Top UI */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></div>
                            <span className="text-white font-medium text-sm">Rachel Maksy</span>
                          </div>
                          <div className="text-white text-xs bg-black/30 px-2 py-1 rounded">LIVE</div>
                        </div>
                        
                        {/* Bottom UI */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-white mb-3">
                            <p className="text-sm font-medium mb-1">A little Autumn-themed Mail Time! 🍂</p>
                            <p className="text-xs opacity-80">Hey there, beautiful people! Welcome back...</p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1">
                                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                <span className="text-white text-sm">1.2k</span>
                              </button>
                              <button className="flex items-center space-x-1">
                                <MessageCircle className="w-5 h-5 text-white" />
                                <span className="text-white text-sm">89</span>
                              </button>
                              <button>
                                <Share2 className="w-5 h-5 text-white" />
                              </button>
                            </div>
                            <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4">
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
            
            <div 
              id="turn-viewers-text"
              ref={el => itemRefs.current['turn-viewers-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['turn-viewers-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black leading-tight">
                Turn your
                <br />
                viewers into
                <br />
                your people
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  True Fans gives you a space to connect directly with fans outside of the ad-based, 
                  algorithmically curated social media ecosystem.
                </p>
                <p>
                  Hang out with your community in real-time group chats, stay close through DMs and comments, 
                  and even reach out directly over email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reach Every Fan Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="reach-fans-text"
              ref={el => itemRefs.current['reach-fans-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['reach-fans-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black leading-tight">
                Reach every fan,
                <br />
                every time
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Your True Fans page is a direct line to your most engaged supporters. No algorithm decides who sees your content—
                  your fans get every update, every time.
                </p>
                <p>
                  Share exclusive behind-the-scenes content, early access to new videos, or just connect with the people who 
                  appreciate your work most.
                </p>
              </div>
            </div>
            
            <div 
              id="reach-fans-visual"
              ref={el => itemRefs.current['reach-fans-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['reach-fans-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              {/* Content Cards Stack */}
              <div className="relative max-w-md mx-auto">
                <div className="space-y-4">
                  {/* Top Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">The Depths of Netflix</h3>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">Just dropped a new deep dive into the strangest shows on Netflix. You won't believe what I found...</p>
                  </div>
                  
                  {/* Middle Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Behind the Scenes</h3>
                        <p className="text-sm text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">Here's what really happened during that chaotic filming session...</p>
                  </div>
                  
                  {/* Bottom Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-500 rounded-full"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Early Access</h3>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">Exclusive preview of next week's video series. You're getting this first!</p>
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
          backgroundImage: `url('https://images.pexels.com/photos/4491459/pexels-photo-4491459.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 via-red-800/50 to-black/80"></div>
        
        <div 
          id="testimonial-content"
          ref={el => itemRefs.current['testimonial-content'] = el as HTMLDivElement}
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transform transition-all duration-1000 ease-out ${animatedItems['testimonial-content'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        >
          <blockquote className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-white drop-shadow-2xl mb-8">
            "My True Fans community has given me the freedom to 
            branch out, try new things, and not feel tied down to one type of 
            <span className="text-red-300">content"</span>
          </blockquote>
          <cite className="text-xl text-red-200 font-medium">— Rachel Maksy</cite>
        </div>
      </section>

      {/* More Ways to Get Paid Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="more-ways-text"
              ref={el => itemRefs.current['more-ways-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['more-ways-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black leading-tight">
                More ways
                <br />
                to get paid
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Not only can you earn recurring income on True Fans through paid membership, you can 
                also sell bonus videos, archived series, and more to all of your fans in your personal 
                online shop.
              </p>
            </div>
            
            <div 
              id="more-ways-visual"
              ref={el => itemRefs.current['more-ways-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['more-ways-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              {/* Creator Profile Card */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all duration-500">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">A</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">The Amandaverse</h3>
                        <p className="text-pink-100 text-sm">@amandaseales</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-white text-pink-600 hover:bg-gray-100">
                      Follow
                    </Button>
                  </div>
                  <p className="text-pink-100 text-sm">
                    Creating comedy content, social commentary, and exclusive behind-the-scenes access
                  </p>
                </div>
                
                {/* Content Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg relative overflow-hidden hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center text-center border-t pt-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">2.1k</div>
                      <div className="text-sm text-gray-500">Members</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">156</div>
                      <div className="text-sm text-gray-500">Posts</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">₦15k</div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Creators Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/4473775/pexels-photo-4473775.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        
        <div 
          id="explore-creators-content"
          ref={el => itemRefs.current['explore-creators-content'] = el as HTMLDivElement}  
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ease-out ${animatedItems['explore-creators-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 text-white drop-shadow-2xl leading-tight">
                Explore how other
                <br />
                video creators are
                <br />
                using True Fans to take
                <br />
                creative and financial
                <br />
                control of their
                <br />
                futures.
              </h2>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 hover:scale-105 transition-all duration-300 shadow-2xl">
                <h3 className="text-3xl font-bold text-black mb-4">Rachel Maksy</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  is creating a space for vlogs, makeup transformations and whimsy
                </p>
              </div>
              
              <Button className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-300">
                Explore creators
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default VideoCreators;
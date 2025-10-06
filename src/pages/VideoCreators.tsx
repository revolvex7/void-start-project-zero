import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, Heart, MessageCircle, Share2, ArrowRight, ChevronRight } from 'lucide-react';

const VideoCreators = () => {
  const [animatedItems, setAnimatedItems] = useState<{[key: string]: boolean}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([]);
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const heroRef = useRef<HTMLDivElement>(null);
  const rippleCounter = useRef(0);

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

  // Ripple effect handler
  const handleRippleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const newRipple = {
        id: rippleCounter.current++,
        x,
        y,
        timestamp: Date.now()
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 2000);
    }
  };

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
        onClick={handleRippleClick}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group cursor-pointer"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/4473775/pexels-photo-4473775.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`,
          backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
          transition: 'background-position 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Dynamic overlay that responds to mouse */}
        <div 
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)`
          }}
        ></div>
        
        {/* Ripple Effects */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              {/* Main ripple */}
              <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"
                style={{
                  width: '20px',
                  height: '20px',
                  marginLeft: '-10px',
                  marginTop: '-10px',
                  animationDuration: '2s',
                  animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
                }}
              ></div>
              {/* Secondary ripple */}
              <div className="absolute inset-0 border border-white/20 rounded-full animate-ping"
                style={{
                  width: '40px',
                  height: '40px',
                  marginLeft: '-20px',
                  marginTop: '-20px',
                  animationDuration: '2s',
                  animationDelay: '0.3s',
                  animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
                }}
              ></div>
              {/* Tertiary ripple */}
              <div className="absolute inset-0 border border-white/10 rounded-full animate-ping"
                style={{
                  width: '60px',
                  height: '60px',
                  marginLeft: '-30px',
                  marginTop: '-30px',
                  animationDuration: '2s',
                  animationDelay: '0.6s',
                  animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
                }}
              ></div>
            </div>
          </div>
        ))}
        
        {/* Floating particles */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-700">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDuration: '2.5s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDuration: '3.5s' }}></div>
          <div className="absolute bottom-1/3 right-2/3 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDuration: '4.5s' }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left lg:text-left transform group-hover:scale-[1.02] transition-all duration-700 ease-out">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-tight mb-8 text-white drop-shadow-2xl transform transition-all duration-700 group-hover:translate-y-[-10px]">
            [TrueFans] for
            <br />
            <span className="font-normal bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-pulse">video creators</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg transform transition-all duration-700 delay-200 group-hover:translate-y-[-5px]">
            Create on your own terms, strengthen your relationship with your community, and diversify how you get paid.
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-110 hover:shadow-2xl px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-500 hover:rotate-1"
          >
            Create on [TrueFans]
          </Button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Turn Your Viewers Into Your People Section - Light Green Gradient */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-48 translate-x-48 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="turn-viewers-video"
              ref={el => itemRefs.current['turn-viewers-video'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['turn-viewers-video'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Enhanced Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto transform hover:scale-105 transition-all duration-500">
                <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                  <div className="bg-gray-900 rounded-[2rem] overflow-hidden">
                    {/* Phone Header */}
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    {/* Video Content */}
                    <div className="aspect-[9/16] bg-gradient-to-br from-purple-100 to-pink-200 relative group">
                      <img 
                        src="https://images.pexels.com/photos/4491459/pexels-photo-4491459.jpeg?auto=compress&cs=tinysrgb&w=400&h=700&dpr=2"
                        alt="Video creator content"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Video UI Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                        {/* Top UI */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse"></div>
                            <span className="text-white font-medium text-sm">Creative Studios</span>
                          </div>
                          <div className="text-white text-xs bg-red-500 px-2 py-1 rounded animate-pulse">LIVE</div>
                        </div>
                        
                        {/* Bottom UI */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-white mb-3">
                            <p className="text-sm font-medium mb-1">Behind the Scenes: Video Production Magic ✨</p>
                            <p className="text-xs opacity-80">Welcome to our creative process! Today we're showing...</p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1 hover:scale-110 transition-transform duration-200">
                                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                <span className="text-white text-sm">2.8k</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:scale-110 transition-transform duration-200">
                                <MessageCircle className="w-5 h-5 text-white" />
                                <span className="text-white text-sm">156</span>
                              </button>
                              <button className="hover:scale-110 transition-transform duration-200">
                                <Share2 className="w-5 h-5 text-white" />
                              </button>
                            </div>
                            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4 hover:scale-105 transition-all duration-300">
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
                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">your people</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  True Fans gives you a space to connect directly with fans outside of the ad-based, 
                  algorithmically curated social media ecosystem.
                </p>
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Hang out with your community in real-time group chats, stay close through DMs and comments, 
                  and even reach out directly over email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reach Every Fan Section - Multi-Color Gradient */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(to right, #7c7dae 0%, #ce628b 25%, #f5c78c 50%, #0c5c36 75%, #064a2a 100%)'
        }}
      >
        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-48 -translate-x-48 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="reach-fans-text"
              ref={el => itemRefs.current['reach-fans-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['reach-fans-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white leading-tight">
                Reach every fan,
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">every time</span>
              </h2>
              
              <div className="space-y-6 text-lg text-white/90 leading-relaxed">
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Your [TrueFans] page is a direct line to your most engaged supporters. No algorithm decides who sees your content—
                  your fans get every update, every time.
                </p>
                <p className="transform hover:translate-x-2 transition-transform duration-300">
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
              {/* Enhanced Content Cards Stack */}
              <div className="relative max-w-md mx-auto">
                <div className="space-y-4">
                  {/* Top Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Studio Spotlight</h3>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">Just wrapped filming our biggest production yet! Behind-the-scenes footage coming soon...</p>
                  </div>
                  
                  {/* Middle Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Creative Process</h3>
                        <p className="text-sm text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">Here's how we create those cinematic shots that everyone asks about...</p>
                  </div>
                  
                  {/* Bottom Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Exclusive Preview</h3>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">First look at our upcoming documentary series. You're getting this before anyone else!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonial Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/4473775/pexels-photo-4473775.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-black/60 to-red-800/80 group-hover:from-red-900/60 group-hover:via-black/40 group-hover:to-red-800/60 transition-all duration-700"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-300 rounded-full animate-bounce" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-3.5 h-3.5 bg-white rounded-full animate-pulse" style={{ animationDuration: '2.5s' }}></div>
        </div>
        
        <div 
          id="testimonial-content"
          ref={el => itemRefs.current['testimonial-content'] = el as HTMLDivElement}
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transform transition-all duration-1000 ease-out ${animatedItems['testimonial-content'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        >
          <blockquote className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-white drop-shadow-2xl mb-8 transform group-hover:scale-105 transition-transform duration-700">
            "My True Fans community has given me the freedom to 
            create without limits, explore new formats, and build 
            <span className="text-red-300 animate-pulse">genuine connections"</span>
          </blockquote>
          <cite className="text-xl text-red-200 font-medium transform group-hover:translate-y-[-5px] transition-transform duration-500">— Creative Studios Collective</cite>
        </div>
      </section>

      {/* More Ways to Get Paid Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-50 to-transparent rounded-full -translate-y-48 translate-x-48 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="more-ways-text"
              ref={el => itemRefs.current['more-ways-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['more-ways-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black leading-tight">
                More ways
                <br />
                to <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">get paid</span>
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed transform hover:translate-x-2 transition-transform duration-300">
                Not only can you earn recurring income on True Fans through paid membership, you can 
                also sell exclusive video content, masterclasses, and premium tutorials to all of your fans in your personal 
                online shop.
              </p>
            </div>
            
            <div 
              id="more-ways-visual"
              ref={el => itemRefs.current['more-ways-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['more-ways-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              {/* Enhanced Creator Profile Card */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all duration-700 group">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white group-hover:from-red-600 group-hover:to-pink-700 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-lg">VS</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Visual Storytellers</h3>
                        <p className="text-red-100 text-sm">@visualstory</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-white text-red-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300">
                      Follow
                    </Button>
                  </div>
                  <p className="text-red-100 text-sm">
                    Creating cinematic content, video tutorials, and exclusive behind-the-scenes access
                  </p>
                </div>
                
                {/* Content Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-red-400 to-pink-500 rounded-lg relative overflow-hidden hover:scale-110 transition-transform duration-500 group/item">
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover/item:bg-black/20 transition-colors duration-300">
                          <Play className="w-6 h-6 text-white group-hover/item:scale-125 transition-transform duration-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center text-center border-t pt-4">
                    <div className="transform hover:scale-110 transition-transform duration-300">
                      <div className="text-2xl font-bold text-gray-900">5.2k</div>
                      <div className="text-sm text-gray-500">Members</div>
                    </div>
                    <div className="transform hover:scale-110 transition-transform duration-300">
                      <div className="text-2xl font-bold text-gray-900">289</div>
                      <div className="text-sm text-gray-500">Videos</div>
                    </div>
                    <div className="transform hover:scale-110 transition-transform duration-300">
                      <div className="text-2xl font-bold text-gray-900">₦25k</div>
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
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/4491459/pexels-photo-4491459.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-red-900/40 to-black/80 group-hover:from-black/60 group-hover:via-red-900/20 group-hover:to-black/60 transition-all duration-700"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
          <div className="absolute top-1/5 left-1/5 w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/4 right-2/3 w-3.5 h-3.5 bg-red-300 rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>
        </div>
        
        <div 
          id="explore-creators-content"
          ref={el => itemRefs.current['explore-creators-content'] = el as HTMLDivElement}  
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ease-out ${animatedItems['explore-creators-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="transform group-hover:translate-x-2 transition-transform duration-700">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 text-white drop-shadow-2xl leading-tight">
                Explore how other
                <br />
                <span className="bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text text-transparent">video creators</span> are
                <br />
                using True Fans to take
                <br />
                creative and financial
                <br />
                control of their
                <br />
                <span className="text-red-300 animate-pulse">futures.</span>
              </h2>
            </div>
            
            <div className="space-y-8 transform group-hover:translate-x-[-8px] transition-transform duration-700">
              <div className="bg-white rounded-2xl p-8 hover:scale-105 hover:rotate-1 transition-all duration-500 shadow-2xl hover:shadow-3xl group/card">
                <h3 className="text-3xl font-bold text-black mb-4 group-hover/card:text-red-600 transition-colors duration-300">Visual Storytellers</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  is creating cinematic content, video tutorials and immersive storytelling experiences
                </p>
              </div>
              
              <Button className="bg-white text-black hover:bg-red-50 hover:text-red-600 hover:scale-110 hover:rotate-1 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-500 hover:shadow-3xl">
                Explore creators
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
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
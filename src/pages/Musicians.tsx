import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, Heart, MessageCircle, Share2, ArrowRight, Music, Headphones, Mic } from 'lucide-react';

const Musicians = () => {
  const [animatedItems, setAnimatedItems] = useState<{[key: string]: boolean}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([]);
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const heroRef = useRef<HTMLDivElement>(null);
  const rippleCounter = useRef(0);

  // Enhanced mouse tracking for hero section
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

  // Enhanced ripple effect handler with water-like physics
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
      }, 3000);
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
      
      {/* Enhanced Hero Section with Music Theme */}
      <section 
        ref={heroRef}
        onClick={handleRippleClick}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group cursor-pointer"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`,
          backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
          transition: 'background-position 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Enhanced dynamic overlay that responds to mouse with music-themed gradient */}
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.2) 0%, rgba(79, 70, 229, 0.4) 30%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.9) 100%)`
          }}
        ></div>
        
        {/* Enhanced Water-like Ripple Effects */}
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
              {/* Primary ripple with music-themed colors */}
              <div 
                className="absolute inset-0 border-2 border-purple-300/40 rounded-full"
                style={{
                  width: '30px',
                  height: '30px',
                  marginLeft: '-15px',
                  marginTop: '-15px',
                  animation: 'musicRipple 3s cubic-bezier(0.23, 1, 0.32, 1) forwards'
                }}
              ></div>
              {/* Secondary ripple */}
              <div 
                className="absolute inset-0 border border-indigo-300/30 rounded-full"
                style={{
                  width: '60px',
                  height: '60px',
                  marginLeft: '-30px',
                  marginTop: '-30px',
                  animation: 'musicRipple 3s 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards'
                }}
              ></div>
              {/* Tertiary ripple */}
              <div 
                className="absolute inset-0 border border-purple-200/20 rounded-full"
                style={{
                  width: '90px',
                  height: '90px',
                  marginLeft: '-45px',
                  marginTop: '-45px',
                  animation: 'musicRipple 3s 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards'
                }}
              ></div>
              {/* Outer ripple */}
              <div 
                className="absolute inset-0 border border-indigo-200/15 rounded-full"
                style={{
                  width: '120px',
                  height: '120px',
                  marginLeft: '-60px',
                  marginTop: '-60px',
                  animation: 'musicRipple 3s 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards'
                }}
              ></div>
            </div>
          </div>
        ))}
        
        {/* Enhanced floating particles with music notes */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-300 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-indigo-300 rounded-full animate-bounce" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-3.5 h-3.5 bg-purple-200 rounded-full animate-pulse" style={{ animationDuration: '2.5s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-indigo-200 rounded-full animate-bounce" style={{ animationDuration: '3.5s' }}></div>
          <div className="absolute bottom-1/3 right-2/3 w-3 h-3 bg-purple-300 rounded-full animate-pulse" style={{ animationDuration: '4.5s' }}></div>
          
          {/* Music note icons */}
          <Music className="absolute top-1/5 right-1/5 w-6 h-6 text-purple-300/30 animate-pulse" style={{ animationDuration: '5s' }} />
          <Headphones className="absolute bottom-1/5 left-1/5 w-5 h-5 text-indigo-300/30 animate-bounce" style={{ animationDuration: '6s' }} />
          <Mic className="absolute top-3/4 right-1/3 w-4 h-4 text-purple-200/30 animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left lg:text-left transform group-hover:scale-[1.01] transition-all duration-1000 ease-out">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-tight mb-8 text-white drop-shadow-2xl transform transition-all duration-1000 group-hover:translate-y-[-15px]">
            Patreon for
            <br />
            <span className="font-normal bg-gradient-to-r from-purple-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent animate-pulse" style={{ animationDuration: '3s' }}>musicians</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg transform transition-all duration-1000 delay-300 group-hover:translate-y-[-8px]">
            Sound off on your own terms, build deeper connections with fans, and create multiple income streams from your music.
          </p>
          
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:scale-110 hover:shadow-2xl px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-700 hover:rotate-1 border-0"
          >
            Start creating music
          </Button>
        </div>
        
        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-purple-300 to-indigo-300 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* From Your Mind to Their Ears Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-50 to-transparent rounded-full -translate-y-48 translate-x-48 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="mind-to-ears-visual"
              ref={el => itemRefs.current['mind-to-ears-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['mind-to-ears-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Enhanced Music Player Mockup */}
              <div className="relative max-w-sm mx-auto transform hover:scale-105 transition-all duration-700">
                <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-3 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                  <div className="bg-black rounded-2xl overflow-hidden">
                    {/* Music Player Header */}
                    <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-pulse flex items-center justify-center">
                            <Music className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white font-medium text-sm">SoundWave Studio</span>
                        </div>
                        <div className="text-white text-xs bg-gradient-to-r from-red-500 to-pink-500 px-2 py-1 rounded animate-pulse">LIVE</div>
                      </div>
                    </div>
                    
                    {/* Album Cover */}
                    <div className="aspect-square bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-600 relative group">
                      <img 
                        src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2"
                        alt="Music album cover"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      
                      {/* Music Player UI Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                        {/* Song Info */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-white mb-3">
                            <p className="text-lg font-bold mb-1">Midnight Melodies</p>
                            <p className="text-sm opacity-80">by Luna & The Dreamers</p>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-white/20 rounded-full h-1 mb-4">
                            <div className="bg-gradient-to-r from-purple-400 to-indigo-400 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                          </div>
                          
                          {/* Control Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1 hover:scale-110 transition-transform duration-300">
                                <Heart className="w-5 h-5 text-purple-400 fill-purple-400" />
                                <span className="text-white text-sm">1.2k</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:scale-110 transition-transform duration-300">
                                <MessageCircle className="w-5 h-5 text-white" />
                                <span className="text-white text-sm">89</span>
                              </button>
                              <button className="hover:scale-110 transition-transform duration-300">
                                <Share2 className="w-5 h-5 text-white" />
                              </button>
                            </div>
                            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full px-4 hover:scale-105 transition-all duration-300">
                              Follow
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Play Button Center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 group-hover:bg-white/30">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="mind-to-ears-text"
              ref={el => itemRefs.current['mind-to-ears-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['mind-to-ears-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black leading-tight">
                From your mind
                <br />
                to their
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">ears</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  True Fans gives you the creative freedom to share your music directly with listeners who 
                  truly appreciate your artistry, without algorithmic interference.
                </p>
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Build meaningful connections through exclusive releases, behind-the-scenes content, 
                  and intimate fan experiences that streaming platforms simply can't provide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share More Than Music Section */}
      <section className="py-20 lg:py-32 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-50 to-transparent rounded-full translate-y-48 -translate-x-48 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="share-more-text"
              ref={el => itemRefs.current['share-more-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['share-more-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black leading-tight">
                Share more
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">than music</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Your True Fans page becomes your personal music sanctuary where every post, every update, 
                  and every creative moment reaches your most dedicated supporters.
                </p>
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Share studio sessions, songwriting processes, tour diaries, and personal stories that 
                  create deeper bonds between you and your musical community.
                </p>
              </div>
            </div>
            
            <div 
              id="share-more-visual"
              ref={el => itemRefs.current['share-more-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['share-more-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              {/* Enhanced Music Content Cards Stack */}
              <div className="relative max-w-md mx-auto">
                <div className="space-y-4">
                  {/* Top Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full animate-pulse flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Studio Sessions</h3>
                        <p className="text-sm text-gray-500">3 hours ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">Just finished recording the chorus for our new single! The harmonies are giving me chills...</p>
                  </div>
                  
                  {/* Middle Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Song Inspiration</h3>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">This melody came to me during a rainy afternoon walk. Sometimes the best songs find you...</p>
                  </div>
                  
                  {/* Bottom Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse flex items-center justify-center">
                        <Mic className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Exclusive Preview</h3>
                        <p className="text-sm text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">Here's a sneak peek of our upcoming album. You're hearing this before anyone else!</p>
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
          backgroundImage: `url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/60 to-indigo-800/80 group-hover:from-purple-900/60 group-hover:via-black/40 group-hover:to-indigo-800/60 transition-all duration-1000"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-300 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-indigo-300 rounded-full animate-bounce" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-3.5 h-3.5 bg-purple-200 rounded-full animate-pulse" style={{ animationDuration: '2.5s' }}></div>
          <Music className="absolute top-1/5 right-1/5 w-8 h-8 text-purple-300/30 animate-pulse" style={{ animationDuration: '5s' }} />
          <Headphones className="absolute bottom-1/5 left-1/6 w-6 h-6 text-indigo-300/30 animate-bounce" style={{ animationDuration: '6s' }} />
        </div>
        
        <div 
          id="testimonial-content"
          ref={el => itemRefs.current['testimonial-content'] = el as HTMLDivElement}
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transform transition-all duration-1000 ease-out ${animatedItems['testimonial-content'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        >
          <blockquote className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-white drop-shadow-2xl mb-8 transform group-hover:scale-105 transition-transform duration-1000">
            "My True Fans community has transformed how I connect with listeners, 
            giving me the freedom to share my authentic musical journey and 
            <span className="text-purple-300 animate-pulse" style={{ animationDuration: '3s' }}>build lasting relationships"</span>
          </blockquote>
          <cite className="text-xl text-purple-200 font-medium transform group-hover:translate-y-[-5px] transition-transform duration-700">— Luna & The Dreamers</cite>
        </div>
      </section>

      {/* More Ways to Get Paid Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-50 to-transparent rounded-full -translate-y-48 translate-x-48 opacity-50"></div>
        
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
                to <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">get paid</span>
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed transform hover:translate-x-2 transition-transform duration-300">
                Beyond recurring memberships, monetize your musical talent through exclusive track releases, 
                live session recordings, music lessons, and personalized song requests in your dedicated creator shop.
              </p>
            </div>
            
            <div 
              id="more-ways-visual"
              ref={el => itemRefs.current['more-ways-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['more-ways-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              {/* Enhanced Music Creator Profile Card */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl hover:scale-105 transition-all duration-1000 group">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white group-hover:from-purple-700 group-hover:to-indigo-700 transition-all duration-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Music className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">SoundWave Collective</h3>
                        <p className="text-purple-100 text-sm">@soundwavecollective</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300">
                      Follow
                    </Button>
                  </div>
                  <p className="text-purple-100 text-sm">
                    Creating atmospheric music, exclusive live sessions, and personalized musical experiences
                  </p>
                </div>
                
                {/* Content Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg relative overflow-hidden hover:scale-110 transition-transform duration-500 group/item">
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover/item:bg-black/20 transition-colors duration-300">
                          <Play className="w-6 h-6 text-white group-hover/item:scale-125 transition-transform duration-300" />
                        </div>
                        {/* Music wave animation overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-300 to-indigo-300 opacity-70 group-hover/item:animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center text-center border-t pt-4">
                    <div className="transform hover:scale-110 transition-transform duration-300">
                      <div className="text-2xl font-bold text-gray-900">3.8k</div>
                      <div className="text-sm text-gray-500">Fans</div>
                    </div>
                    <div className="transform hover:scale-110 transition-transform duration-300">
                      <div className="text-2xl font-bold text-gray-900">156</div>
                      <div className="text-sm text-gray-500">Tracks</div>
                    </div>
                    <div className="transform hover:scale-110 transition-transform duration-300">
                      <div className="text-2xl font-bold text-gray-900">₦18k</div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Musicians Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/40 to-black/80 group-hover:from-black/60 group-hover:via-purple-900/20 group-hover:to-black/60 transition-all duration-1000"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-1000">
          <div className="absolute top-1/5 left-1/5 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/4 right-2/3 w-3.5 h-3.5 bg-purple-300 rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>
          <Music className="absolute top-1/6 right-1/3 w-6 h-6 text-purple-300/40 animate-pulse" style={{ animationDuration: '6s' }} />
          <Headphones className="absolute bottom-1/3 left-1/4 w-5 h-5 text-indigo-300/40 animate-bounce" style={{ animationDuration: '4s' }} />
        </div>
        
        <div 
          id="explore-musicians-content"
          ref={el => itemRefs.current['explore-musicians-content'] = el as HTMLDivElement}  
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ease-out ${animatedItems['explore-musicians-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="transform group-hover:translate-x-2 transition-transform duration-1000">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 text-white drop-shadow-2xl leading-tight">
                Explore how other
                <br />
                <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">musicians</span> are
                <br />
                using True Fans to take
                <br />
                creative and financial
                <br />
                control of their
                <br />
                <span className="text-purple-300 animate-pulse" style={{ animationDuration: '3s' }}>musical journey.</span>
              </h2>
            </div>
            
            <div className="space-y-8 transform group-hover:translate-x-[-8px] transition-transform duration-1000">
              <div className="bg-white rounded-2xl p-8 hover:scale-105 hover:rotate-1 transition-all duration-700 shadow-2xl hover:shadow-3xl group/card">
                <h3 className="text-3xl font-bold text-black mb-4 group-hover/card:text-purple-600 transition-colors duration-300">SoundWave Collective</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  is creating atmospheric soundscapes, exclusive live sessions, and intimate musical experiences for dedicated listeners
                </p>
              </div>
              
              <Button className="bg-white text-black hover:bg-purple-50 hover:text-purple-600 hover:scale-110 hover:rotate-1 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-700 hover:shadow-3xl">
                Explore musicians
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
          </div>
        </div>
      </div>
      </section>
      
      <Footer />

      {/* Custom CSS for enhanced ripple animations */}
      <style>{`
        @keyframes musicRipple {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          10% {
            transform: scale(0.3);
            opacity: 0.6;
          }
          30% {
            transform: scale(1);
            opacity: 0.4;
          }
          60% {
            transform: scale(1.5);
            opacity: 0.2;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Musicians;
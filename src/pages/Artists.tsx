import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, Heart, MessageCircle, Share2, ArrowRight, Palette, Brush, Image as ImageIcon } from 'lucide-react';

const Artists = () => {
  const [animatedItems, setAnimatedItems] = useState<{[key: string]: boolean}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [brushStrokes, setBrushStrokes] = useState<Array<{ id: number; x: number; y: number; timestamp: number; size: number; opacity: number }>>([]);
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const heroRef = useRef<HTMLDivElement>(null);
  const brushCounter = useRef(0);

  // Enhanced mouse tracking for hero section with brush effect
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

  // Enhanced brush stroke effect handler
  const handleBrushStroke = (e: React.MouseEvent<HTMLDivElement>) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const newBrushStroke = {
        id: brushCounter.current++,
        x,
        y,
        timestamp: Date.now(),
        size: Math.random() * 60 + 40,
        opacity: Math.random() * 0.6 + 0.4
      };
      
      setBrushStrokes(prev => [...prev, newBrushStroke]);
      
      // Remove brush stroke after animation completes
      setTimeout(() => {
        setBrushStrokes(prev => prev.filter(stroke => stroke.id !== newBrushStroke.id));
      }, 4000);
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
      
      {/* Enhanced Hero Section with Brush/Painting Effect */}
      <section 
        ref={heroRef}
        onClick={handleBrushStroke}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group cursor-crosshair"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`,
          backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
          transition: 'background-position 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Enhanced dynamic overlay with artistic gradient */}
        <div 
          className="absolute inset-0 transition-all duration-1200 ease-out"
          style={{
            background: `radial-gradient(900px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 87, 51, 0.15) 0%, rgba(255, 107, 107, 0.25) 20%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 0.85) 100%)`
          }}
        ></div>
        
        {/* Enhanced Brush Stroke Effects */}
        {brushStrokes.map((stroke) => (
          <div
            key={stroke.id}
            className="absolute pointer-events-none"
            style={{
              left: `${stroke.x}%`,
              top: `${stroke.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              {/* Main brush stroke */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  width: `${stroke.size}px`,
                  height: `${stroke.size * 0.6}px`,
                  marginLeft: `-${stroke.size/2}px`,
                  marginTop: `-${stroke.size * 0.3}px`,
                  background: `radial-gradient(ellipse, rgba(255, 87, 51, ${stroke.opacity}) 0%, rgba(255, 107, 107, ${stroke.opacity * 0.7}) 30%, transparent 70%)`,
                  animation: 'brushStroke 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                  transform: `rotate(${Math.random() * 60 - 30}deg)`
                }}
              ></div>
              {/* Paint splatter effect */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  width: `${stroke.size * 1.5}px`,
                  height: `${stroke.size * 1.2}px`,
                  marginLeft: `-${stroke.size * 0.75}px`,
                  marginTop: `-${stroke.size * 0.6}px`,
                  background: `radial-gradient(circle, rgba(255, 107, 107, ${stroke.opacity * 0.3}) 0%, transparent 60%)`,
                  animation: 'paintSplatter 4s 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                  transform: `rotate(${Math.random() * 90 - 45}deg)`
                }}
              ></div>
              {/* Texture overlay */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  width: `${stroke.size * 0.8}px`,
                  height: `${stroke.size * 0.5}px`,
                  marginLeft: `-${stroke.size * 0.4}px`,
                  marginTop: `-${stroke.size * 0.25}px`,
                  background: `linear-gradient(45deg, rgba(255, 87, 51, ${stroke.opacity * 0.8}) 0%, rgba(255, 107, 107, ${stroke.opacity * 0.5}) 50%, transparent 100%)`,
                  animation: 'brushTexture 4s 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                  transform: `rotate(${Math.random() * 120 - 60}deg)`
                }}
              ></div>
            </div>
          </div>
        ))}
        
        {/* Enhanced floating art elements */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1200">
          <div className="absolute top-1/4 left-1/4 w-5 h-5 bg-orange-300 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-red-300 rounded-full animate-bounce" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-4.5 h-4.5 bg-orange-200 rounded-full animate-pulse" style={{ animationDuration: '2.5s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-3.5 h-3.5 bg-red-200 rounded-full animate-bounce" style={{ animationDuration: '3.5s' }}></div>
          <div className="absolute bottom-1/3 right-2/3 w-4 h-4 bg-orange-300 rounded-full animate-pulse" style={{ animationDuration: '4.5s' }}></div>
          
          {/* Art icons */}
          <Palette className="absolute top-1/5 right-1/5 w-7 h-7 text-orange-300/30 animate-pulse" style={{ animationDuration: '5s' }} />
          <Brush className="absolute bottom-1/5 left-1/5 w-6 h-6 text-red-300/30 animate-bounce" style={{ animationDuration: '6s' }} />
          <ImageIcon className="absolute top-3/4 right-1/3 w-5 h-5 text-orange-200/30 animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left lg:text-left transform group-hover:scale-[1.01] transition-all duration-1200 ease-out">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-tight mb-8 text-white drop-shadow-2xl transform transition-all duration-1200 group-hover:translate-y-[-20px]">
            Patreon for
            <br />
            <span className="font-normal bg-gradient-to-r from-orange-300 via-red-200 to-orange-300 bg-clip-text text-transparent animate-pulse" style={{ animationDuration: '3s' }}>artists</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg transform transition-all duration-1200 delay-300 group-hover:translate-y-[-10px]">
            Create what inspires you, connect directly with your community, and build a thriving business around your art.
          </p>
          
          <Button 
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:scale-110 hover:shadow-2xl px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-800 hover:rotate-1 border-0"
          >
            Create on Patreon
          </Button>
        </div>
        
        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-orange-300 to-red-300 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Earning Made Easy Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-50 to-transparent rounded-full -translate-y-48 translate-x-48 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="earning-easy-visual"
              ref={el => itemRefs.current['earning-easy-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1200 ease-out ${animatedItems['earning-easy-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-20 rotate-6'}`}
            >
              {/* Enhanced Art Portfolio Mockup */}
              <div className="relative max-w-sm mx-auto transform hover:scale-105 transition-all duration-800">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-3 shadow-2xl hover:shadow-3xl transition-shadow duration-600">
                  <div className="bg-black rounded-2xl overflow-hidden">
                    {/* App Header */}
                    <div className="bg-gradient-to-r from-orange-800 to-red-800 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse flex items-center justify-center">
                            <Palette className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white font-medium text-sm">ArtSpace</span>
                        </div>
                        <div className="text-white text-xs bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-1 rounded animate-pulse">EARNING</div>
                      </div>
                    </div>
                    
                    {/* Portfolio Content */}
                    <div className="aspect-square bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 relative group p-4">
                      <div className="grid grid-cols-2 gap-2 h-full">
                        {/* Art pieces */}
                        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">Digital Art</span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-400 to-orange-500 rounded-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">Paintings</span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-red-400 rounded-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">Sketches</span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-500 to-orange-400 rounded-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">Tutorials</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Earnings overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">₦45,200</div>
                            <div className="text-sm text-gray-600">Monthly earnings</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="earning-easy-text"
              ref={el => itemRefs.current['earning-easy-text'] = el as HTMLDivElement}
              className={`transition-all duration-1200 ease-out delay-200 ${animatedItems['earning-easy-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-20 -rotate-6'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black leading-tight">
                Earning
                <br />
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">made easy</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Not only can you earn recurring income on Patreon through paid membership, you can 
                  also sell individual pieces and other downloadable exclusives to all of your fans in 
                  your personal online shop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Create What Inspires You Section */}
      <section className="py-20 lg:py-32 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-50 to-transparent rounded-full translate-y-48 -translate-x-48 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="create-inspires-text"
              ref={el => itemRefs.current['create-inspires-text'] = el as HTMLDivElement}
              className={`transition-all duration-1200 ease-out ${animatedItems['create-inspires-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-20 rotate-6'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black leading-tight">
                Create what
                <br />
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">inspires you</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Whether you're sharing rough sketches, polished pieces, tutorials, or beyond, when you post 
                  on Patreon, it gets sent directly to every single one of your fans' feeds and inboxes, without 
                  ever being blocked or buried by a gatekeeping algorithm.
                </p>
              </div>
            </div>
            
            <div 
              id="create-inspires-visual"
              ref={el => itemRefs.current['create-inspires-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1200 ease-out delay-200 ${animatedItems['create-inspires-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-20 -rotate-6'}`}
            >
              {/* Enhanced Art Creation Process */}
              <div className="relative max-w-sm mx-auto">
                <div className="bg-black rounded-3xl p-4 shadow-2xl hover:shadow-3xl transition-shadow duration-600 hover:scale-105 transform transition-all duration-800">
                  {/* Phone screen */}
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    {/* Status bar */}
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    {/* Art creation interface */}
                    <div className="aspect-[9/16] bg-gradient-to-br from-orange-100 to-red-50 relative group">
                      <img 
                        src="https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=700&dpr=2"
                        alt="Art creation process"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      
                      {/* Art creation UI overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                        {/* Top UI */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse flex items-center justify-center">
                              <Brush className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-medium text-sm">Creative Studio</span>
                          </div>
                          <div className="text-white text-xs bg-orange-500 px-2 py-1 rounded animate-pulse">CREATING</div>
                        </div>
                        
                        {/* Bottom UI */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-white mb-3">
                            <p className="text-sm font-medium mb-1">Work in Progress: Digital Masterpiece 🎨</p>
                            <p className="text-xs opacity-80">Sharing my creative process with exclusive behind-the-scenes...</p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1 hover:scale-110 transition-transform duration-200">
                                <Heart className="w-5 h-5 text-orange-500 fill-orange-500" />
                                <span className="text-white text-sm">3.2k</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:scale-110 transition-transform duration-200">
                                <MessageCircle className="w-5 h-5 text-white" />
                                <span className="text-white text-sm">248</span>
                              </button>
                              <button className="hover:scale-110 transition-transform duration-200">
                                <Share2 className="w-5 h-5 text-white" />
                              </button>
                            </div>
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 hover:scale-105 transition-all duration-300">
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

      {/* Enhanced Testimonial Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-black/60 to-red-800/80 group-hover:from-orange-900/60 group-hover:via-black/40 group-hover:to-red-800/60 transition-all duration-1200"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1200">
          <div className="absolute top-1/4 left-1/4 w-5 h-5 bg-orange-300 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-red-300 rounded-full animate-bounce" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-4.5 h-4.5 bg-orange-200 rounded-full animate-pulse" style={{ animationDuration: '2.5s' }}></div>
          <Palette className="absolute top-1/5 right-1/5 w-9 h-9 text-orange-300/30 animate-pulse" style={{ animationDuration: '5s' }} />
          <Brush className="absolute bottom-1/5 left-1/6 w-7 h-7 text-red-300/30 animate-bounce" style={{ animationDuration: '6s' }} />
        </div>
        
        <div 
          id="testimonial-content"
          ref={el => itemRefs.current['testimonial-content'] = el as HTMLDivElement}
          className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transform transition-all duration-1200 ease-out ${animatedItems['testimonial-content'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}
        >
          <blockquote className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-white drop-shadow-2xl mb-8 transform group-hover:scale-105 transition-transform duration-1200">
            "Patreon has become my favorite platform for offering my fans exclusive content including 
            process videos, in-depth tutorials, and 
            <span className="text-orange-300 animate-pulse" style={{ animationDuration: '3s' }}>physical rewards"</span>
          </blockquote>
          <cite className="text-xl text-orange-200 font-medium transform group-hover:translate-y-[-5px] transition-transform duration-800">— Tina Yu</cite>
        </div>
      </section>

      {/* Build Community Around Your Art Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-50 to-transparent rounded-full -translate-y-48 translate-x-48 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="build-community-text"
              ref={el => itemRefs.current['build-community-text'] = el as HTMLDivElement}
              className={`transition-all duration-1200 ease-out ${animatedItems['build-community-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-20 rotate-6'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-black leading-tight">
                Build community
                <br />
                around your
                <br />
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">art</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Bring your community together in real-time group chats, stay close through DMs, comments, 
                  and polls, or even reach out directly over email. Explore fan profiles to get to know the 
                  people behind all the love.
                </p>
              </div>
            </div>
            
            <div 
              id="build-community-visual"
              ref={el => itemRefs.current['build-community-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1200 ease-out delay-200 ${animatedItems['build-community-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-20 -rotate-6'}`}
            >
              {/* Enhanced Community Interface */}
              <div className="relative max-w-md mx-auto">
                <div className="space-y-4">
                  {/* Community member cards */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-600 hover:shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Art Enthusiast</h3>
                        <p className="text-sm text-gray-500">Active supporter</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">"Your latest piece absolutely blew my mind! The color composition is incredible..."</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-600 hover:shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-orange-500 rounded-full animate-pulse flex items-center justify-center">
                        <span className="text-white text-sm font-bold">C</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Creative Collector</h3>
                        <p className="text-sm text-gray-500">Longtime fan</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">"Thank you for sharing your creative process! Learning so much from your tutorials..."</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-600 hover:shadow-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-400 rounded-full animate-pulse flex items-center justify-center">
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

      {/* Explore Other Artists Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 group-hover:from-black/60 group-hover:via-orange-900/20 group-hover:to-black/60 transition-all duration-1200"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-1200">
          <div className="absolute top-1/5 left-1/5 w-4 h-4 bg-orange-400 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-3.5 h-3.5 bg-red-300 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/4 right-2/3 w-4.5 h-4.5 bg-orange-300 rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>
          <Palette className="absolute top-1/6 right-1/3 w-7 h-7 text-orange-300/40 animate-pulse" style={{ animationDuration: '6s' }} />
          <Brush className="absolute bottom-1/3 left-1/4 w-6 h-6 text-red-300/40 animate-bounce" style={{ animationDuration: '4s' }} />
        </div>
        
        <div 
          id="explore-artists-content"
          ref={el => itemRefs.current['explore-artists-content'] = el as HTMLDivElement}  
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transform transition-all duration-1200 ease-out ${animatedItems['explore-artists-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="transform group-hover:translate-x-2 transition-transform duration-1200">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 text-white drop-shadow-2xl leading-tight">
                Explore how other
                <br />
                <span className="bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">artists</span> are using
                <br />
                Patreon to take creative
                <br />
                and financial control
                <br />
                of their
                <br />
                <span className="text-orange-300 animate-pulse" style={{ animationDuration: '3s' }}>futures.</span>
              </h2>
            </div>
            
            <div className="space-y-8 transform group-hover:translate-x-[-8px] transition-transform duration-1200">
              <div className="bg-white rounded-2xl p-8 hover:scale-105 hover:rotate-1 transition-all duration-800 shadow-2xl hover:shadow-3xl group/card">
                <h3 className="text-3xl font-bold text-black mb-4 group-hover/card:text-orange-600 transition-colors duration-300">Tina Yu</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  is creating digital art, tutorials, and exclusive behind-the-scenes content for art enthusiasts
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 hover:scale-105 hover:rotate-1 transition-all duration-800 shadow-2xl hover:shadow-3xl group/card">
                <h3 className="text-3xl font-bold text-black mb-4 group-hover/card:text-orange-600 transition-colors duration-300">RossDraws</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  is creating character art, speed painting videos, and interactive art challenges
                </p>
              </div>
              
              <Button className="bg-white text-black hover:bg-orange-50 hover:text-orange-600 hover:scale-110 hover:rotate-1 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-800 hover:shadow-3xl">
                Explore creators
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
          </div>
        </div>
      </div>
      </section>
      
      <Footer />

      {/* Custom CSS for enhanced brush and paint animations */}
      <style>{`
        @keyframes brushStroke {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            transform: scale(0.8) rotate(15deg);
            opacity: 0.9;
          }
          30% {
            transform: scale(1.1) rotate(-10deg);
            opacity: 0.7;
          }
          60% {
            transform: scale(1.3) rotate(20deg);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.6) rotate(-5deg);
            opacity: 0;
          }
        }
        
        @keyframes paintSplatter {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            transform: scale(0.6) rotate(45deg);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2) rotate(-30deg);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.8) rotate(60deg);
            opacity: 0;
          }
        }
        
        @keyframes brushTexture {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          25% {
            transform: scale(0.7) rotate(-20deg);
            opacity: 0.8;
          }
          75% {
            transform: scale(1.1) rotate(40deg);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.4) rotate(-15deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Artists;
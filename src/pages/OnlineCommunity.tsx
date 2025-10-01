import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Users, Mail, Bell, TrendingUp } from 'lucide-react';

const OnlineCommunity = () => {
  const [animatedItems, setAnimatedItems] = useState<{[key: string]: boolean}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for hero section with parallax
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

  // Scroll tracking for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      
      {/* Hero Section with Background Image */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group cursor-crosshair"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop')`,
          backgroundPosition: `${50 + (mousePosition.x - 50) * 0.05}% ${50 + (mousePosition.y - 50) * 0.05}%`,
          transition: 'background-position 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 group-hover:from-black/50 group-hover:via-black/30 group-hover:to-black/50 transition-all duration-1000"></div>
        
        {/* Animated overlay particles with floating animation */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-700">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s', animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {/* Content with staggered animation */}
        <div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left lg:text-left"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-tight mb-8 text-white drop-shadow-2xl animate-fade-in">
            Where real
            <br />
            <span className="font-normal bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent" style={{ animationDelay: '0.2s' }}>community thrives</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Create a vibrant, engaged community that connects with your work on a deeper level.
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-110 hover:shadow-2xl px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-500 animate-fade-in hover:rotate-1"
            style={{ animationDelay: '0.6s' }}
          >
            Build your community
          </Button>
        </div>
      </section>

      {/* Every Post, Every Time Section with Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden group"
        style={{ 
          background: 'linear-gradient(135deg, rgba(147,187,254,0.95) 0%, rgba(99,152,254,0.95) 50%, rgba(92,147,254,0.95) 100%), url("https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        {/* Multiple animated overlay layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Floating animated shapes */}
        <div className="absolute top-20 left-20 w-96 h-96 opacity-20 rounded-full blur-3xl animate-pulse group-hover:scale-125 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 opacity-20 rounded-full blur-3xl animate-pulse group-hover:scale-125 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)', animationDuration: '5s', animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="every-post-visual"
              ref={el => itemRefs.current['every-post-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['every-post-visual'] ? 'opacity-100 translate-x-0 rotate-0 scale-100' : 'opacity-0 -translate-x-16 rotate-6 scale-90'}`}
            >
              {/* Desktop Browser Mockup with enhanced hover */}
              <div className="relative max-w-2xl mx-auto group/card">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-2xl opacity-0 group-hover/card:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform group-hover/card:scale-105 group-hover/card:-rotate-1 transition-all duration-500">
                  {/* Browser chrome */}
                  <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors"></div>
                    </div>
                    <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-xs text-gray-400">
                      truefans.com/creator/posts
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="bg-white p-6">
                    {/* Post Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                        <div>
                          <h4 className="font-bold text-gray-900">Chris Overland</h4>
                          <p className="text-sm text-gray-600">Just now • All members</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-800 mb-4">
                        Hey everyone! Just finished working on something special for you all. Can't wait to share it! 🎨✨
                      </p>
                      
                      <div className="aspect-video bg-gradient-to-br from-red-400 via-pink-400 to-purple-400 rounded-lg mb-4 animate-pulse" style={{ animationDuration: '3s' }}></div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1 hover:text-red-500 transition-colors cursor-pointer">
                          <Heart className="w-4 h-4" />
                          <span>234</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-blue-500 transition-colors cursor-pointer">
                          <MessageCircle className="w-4 h-4" />
                          <span>42</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notification Badge */}
                    <div className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-semibold flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors">
                      <Bell className="w-4 h-4 animate-pulse" />
                      <span>Delivered to all 1,234 members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="every-post-text"
              ref={el => itemRefs.current['every-post-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['every-post-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-7xl font-light mb-8 text-white leading-tight drop-shadow-lg">
                Every post,
                <br />
                <span className="font-normal bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">every time</span>
              </h2>
              
              <p className="text-xl text-white leading-relaxed drop-shadow-md">
                Your posts go directly to every single member's feed and inbox. No algorithms. No missed updates. 100% delivery guaranteed, so your community never misses what you share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More Ways to Stay Close Section with Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden group"
        style={{ 
          background: 'linear-gradient(135deg, rgba(99,152,254,0.95) 0%, rgba(92,147,254,0.95) 50%, rgba(80,137,238,0.95) 100%), url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        {/* Animated layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 opacity-20 rounded-full blur-3xl animate-pulse group-hover:scale-125 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 opacity-20 rounded-full blur-3xl animate-pulse group-hover:scale-125 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)', animationDuration: '4s', animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="stay-close-text"
              ref={el => itemRefs.current['stay-close-text'] = el as HTMLDivElement}
              className={`lg:order-1 transition-all duration-1000 ease-out ${animatedItems['stay-close-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-7xl font-light mb-8 text-white leading-tight drop-shadow-lg">
                More ways
                <br />
                <span className="font-normal bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">to stay close</span>
              </h2>
              
              <p className="text-xl text-white leading-relaxed drop-shadow-md">
                Connect with your community through group chats, direct messages, comments, polls, and more. Build meaningful relationships beyond the content you create.
              </p>
            </div>

            <div 
              id="stay-close-visual"
              ref={el => itemRefs.current['stay-close-visual'] = el as HTMLDivElement}
              className={`lg:order-2 transition-all duration-1000 ease-out delay-300 ${animatedItems['stay-close-visual'] ? 'opacity-100 translate-x-0 rotate-0 scale-100' : 'opacity-0 translate-x-16 -rotate-3 scale-90'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto group/phone">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-600 rounded-3xl blur-2xl opacity-0 group-hover/phone:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-black rounded-3xl p-4 shadow-2xl transform group-hover/phone:scale-105 group-hover/phone:rotate-2 transition-all duration-500">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-white relative">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Messages</h3>
                        
                        <div className="space-y-4">
                          {/* Message 1 with staggered animation */}
                          <div className="flex items-start space-x-3 bg-pink-50 rounded-xl p-3 hover:bg-pink-100 hover:scale-105 transition-all cursor-pointer duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex-shrink-0 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">Sarah Chen</h4>
                                <span className="text-xs text-gray-500">2m</span>
                              </div>
                              <p className="text-sm text-gray-700">Love the new tutorial! When's the next one? 🎨</p>
                            </div>
                            <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-2 animate-ping"></div>
                          </div>

                          {/* Message 2 */}
                          <div className="flex items-start space-x-3 bg-purple-50 rounded-xl p-3 hover:bg-purple-100 hover:scale-105 transition-all cursor-pointer duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex-shrink-0 animate-pulse" style={{ animationDuration: '3.5s' }}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">Alex Rivera</h4>
                                <span className="text-xs text-gray-500">15m</span>
                              </div>
                              <p className="text-sm text-gray-700">Thanks for the feedback! ❤️</p>
                            </div>
                          </div>

                          {/* Message 3 */}
                          <div className="flex items-start space-x-3 bg-blue-50 rounded-xl p-3 hover:bg-blue-100 hover:scale-105 transition-all cursor-pointer duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex-shrink-0 animate-pulse" style={{ animationDuration: '4s' }}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">Community Chat</h4>
                                <span className="text-xs text-gray-500">1h</span>
                              </div>
                              <p className="text-sm text-gray-700">Jamie: Can't wait for the live stream! 🔥</p>
                            </div>
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 mt-1 flex items-center justify-center text-white text-xs font-bold animate-pulse">3</div>
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

      {/* Get to Know Your Fans Section with Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden group"
        style={{ 
          background: 'linear-gradient(135deg, rgba(123,168,255,0.95) 0%, rgba(99,152,254,0.95) 50%, rgba(92,147,254,0.95) 100%), url("https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        {/* Animated layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20 rounded-full blur-3xl animate-pulse group-hover:scale-125 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 opacity-20 rounded-full blur-3xl animate-pulse group-hover:scale-125 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)', animationDuration: '5s', animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="know-fans-visual"
              ref={el => itemRefs.current['know-fans-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['know-fans-visual'] ? 'opacity-100 translate-x-0 rotate-0 scale-100' : 'opacity-0 -translate-x-16 rotate-3 scale-90'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto group/phone">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl blur-2xl opacity-0 group-hover/phone:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-black rounded-3xl p-4 shadow-2xl transform group-hover/phone:scale-105 group-hover/phone:rotate-2 transition-all duration-500">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                      {/* Chat Interface */}
                      <div className="p-6 text-white h-full flex flex-col">
                        <div className="flex items-center space-x-3 mb-6 animate-fade-in">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full animate-pulse"></div>
                          <div>
                            <h3 className="font-bold text-lg">Jamie Lee</h3>
                            <p className="text-sm text-white/70">Member since 2023</p>
                          </div>
                        </div>

                        <div className="space-y-3 flex-1 overflow-hidden">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <p className="text-xs text-white/70 mb-1">Recent activity</p>
                            <p className="text-sm">Commented on 12 posts</p>
                            <p className="text-sm">Attended 3 live streams</p>
                            <p className="text-sm">Member for 8 months</p>
                          </div>

                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <p className="text-xs text-white/70 mb-1">Latest comment</p>
                            <p className="text-sm">"This is exactly what I needed! Thank you! 💙"</p>
                          </div>
                        </div>

                        <div className="mt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                          <button className="w-full bg-white text-blue-600 rounded-full px-6 py-3 font-semibold hover:bg-white/90 hover:scale-105 transition-all duration-300">
                            Send message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="know-fans-text"
              ref={el => itemRefs.current['know-fans-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['know-fans-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-7xl font-light mb-8 text-white leading-tight drop-shadow-lg">
                Get to know
                <br />
                <span className="font-normal bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">your fans</span>
              </h2>
              
              <p className="text-xl text-white leading-relaxed drop-shadow-md">
                Explore detailed fan profiles to understand who supports you. See their activity, engagement history, and build deeper connections with the people who matter most to your creative journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section with Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden group"
        style={{ 
          background: 'linear-gradient(135deg, rgba(147,187,254,0.95) 0%, rgba(99,152,254,0.95) 50%, rgba(92,147,254,0.95) 100%), url("https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        {/* Animated layers */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Multiple floating shapes */}
        <div className="absolute top-10 left-10 w-96 h-96 opacity-20 rounded-full blur-3xl animate-pulse group-hover:scale-125 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)', animationDuration: '5s' }}></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 opacity-20 rounded-full blur-3xl animate-pulse group-hover:scale-125 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)', animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-15 rounded-full blur-3xl animate-pulse group-hover:scale-110 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)', animationDuration: '6s', animationDelay: '0.5s' }}></div>
        
        <div 
          id="final-cta"
          ref={el => itemRefs.current['final-cta'] = el as HTMLDivElement}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-1000 ease-out ${animatedItems['final-cta'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-light mb-8 text-white drop-shadow-2xl leading-tight">
            Build a community that
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">truly connects</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-lg">
            Start building meaningful relationships with your most dedicated fans today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-110 hover:shadow-2xl hover:rotate-1 px-8 py-4 text-lg rounded-full transition-all duration-500 w-full sm:w-auto"
            >
              Start building
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 hover:scale-110 hover:-rotate-1 px-8 py-4 text-lg rounded-full transition-all duration-500 w-full sm:w-auto"
            >
              Explore features
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OnlineCommunity;
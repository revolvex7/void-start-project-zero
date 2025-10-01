import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, Users, Bell, MessageCircle } from 'lucide-react';

const CreateOnYourTerms = () => {
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
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop')`,
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
            Create
            <br />
            <span className="font-normal bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent" style={{ animationDelay: '0.2s' }}>on your terms</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Your creativity, your rules. Build a sustainable creative business with complete freedom and control.
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-110 hover:shadow-2xl px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-500 animate-fade-in hover:rotate-1"
            style={{ animationDelay: '0.6s' }}
          >
            Get started for free
          </Button>
        </div>
      </section>

      {/* Getting Started Section with Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden group"
        style={{ 
          background: 'linear-gradient(135deg, rgba(147,187,254,0.95) 0%, rgba(99,152,254,0.95) 50%, rgba(92,147,254,0.95) 100%), url("https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop")',
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
              id="getting-started-visual"
              ref={el => itemRefs.current['getting-started-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['getting-started-visual'] ? 'opacity-100 translate-x-0 rotate-0 scale-100' : 'opacity-0 -translate-x-16 rotate-6 scale-90'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto group/phone">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl blur-2xl opacity-0 group-hover/phone:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-black rounded-3xl p-4 shadow-2xl transform group-hover/phone:scale-105 group-hover/phone:rotate-2 transition-all duration-500">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-white relative">
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 animate-fade-in">Create Your Page</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3 animate-fade-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse" style={{ animationDuration: '3s' }}>
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Set up your profile</h4>
                              <p className="text-sm text-gray-600">Add your photo, bio, and links</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3 animate-fade-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse" style={{ animationDuration: '3.5s' }}>
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Choose membership tiers</h4>
                              <p className="text-sm text-gray-600">Set pricing that works for you</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3 animate-fade-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.3s' }}>
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse" style={{ animationDuration: '4s' }}>
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Start creating</h4>
                              <p className="text-sm text-gray-600">Share your first post</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                          <Button className="w-full bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white rounded-full py-3 transition-all duration-300">
                            Get Started
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="getting-started-text"
              ref={el => itemRefs.current['getting-started-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['getting-started-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-7xl font-light mb-8 text-white leading-tight drop-shadow-lg">
                Getting started
                <br />
                <span className="font-normal bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">on True Fans</span>
              </h2>
              
              <p className="text-xl text-white leading-relaxed drop-shadow-md">
                Launch your creator page in minutes. Set up your profile, choose your membership tiers, and start sharing your work with supporters who want to see you succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Make It Your Own Section with Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden group"
        style={{ 
          background: 'linear-gradient(135deg, rgba(99,152,254,0.95) 0%, rgba(92,147,254,0.95) 50%, rgba(80,137,238,0.95) 100%), url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&h=1080&fit=crop")',
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
              id="make-own-text"
              ref={el => itemRefs.current['make-own-text'] = el as HTMLDivElement}
              className={`lg:order-1 transition-all duration-1000 ease-out ${animatedItems['make-own-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-7xl font-light mb-8 text-white leading-tight drop-shadow-lg">
                Make it
                <br />
                <span className="font-normal bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">your own</span>
              </h2>
              
              <p className="text-xl text-white leading-relaxed drop-shadow-md">
                Customize your page to reflect your unique brand. Choose your colors, layout, and content strategy. Your page, your personality, your way.
              </p>
            </div>

            <div 
              id="make-own-visual"
              ref={el => itemRefs.current['make-own-visual'] = el as HTMLDivElement}
              className={`lg:order-2 transition-all duration-1000 ease-out delay-300 ${animatedItems['make-own-visual'] ? 'opacity-100 translate-x-0 rotate-0 scale-100' : 'opacity-0 translate-x-16 -rotate-3 scale-90'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto group/phone">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-600 rounded-3xl blur-2xl opacity-0 group-hover/phone:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-black rounded-3xl p-4 shadow-2xl transform group-hover/phone:scale-105 group-hover/phone:rotate-2 transition-all duration-500">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                      <div className="p-6 text-white">
                        <div className="flex items-center space-x-3 mb-6 animate-fade-in">
                          <div className="w-16 h-16 bg-white rounded-full animate-pulse"></div>
                          <div>
                            <h3 className="font-bold text-lg">KAMAUU</h3>
                            <p className="text-sm text-white/80">@kamauu</p>
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 hover:bg-white/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                          <p className="text-sm mb-2">Customize everything:</p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2 hover:translate-x-1 transition-transform duration-300">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              <span>Profile colors & theme</span>
                            </li>
                            <li className="flex items-center space-x-2 hover:translate-x-1 transition-transform duration-300">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                              <span>Membership tier names</span>
                            </li>
                            <li className="flex items-center space-x-2 hover:translate-x-1 transition-transform duration-300">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                              <span>Welcome messages</span>
                            </li>
                            <li className="flex items-center space-x-2 hover:translate-x-1 transition-transform duration-300">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                              <span>Exclusive content types</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-white text-indigo-600 rounded-full px-4 py-2 text-center font-semibold text-sm hover:scale-105 transition-transform duration-300 cursor-pointer animate-fade-in" style={{ animationDelay: '0.4s' }}>
                          Your brand, your way
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

      {/* Reach Every Fan Section with Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden group"
        style={{ 
          background: 'linear-gradient(135deg, rgba(123,168,255,0.95) 0%, rgba(99,152,254,0.95) 50%, rgba(92,147,254,0.95) 100%), url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop")',
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
              id="reach-fan-visual"
              ref={el => itemRefs.current['reach-fan-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['reach-fan-visual'] ? 'opacity-100 translate-x-0 rotate-0 scale-100' : 'opacity-0 -translate-x-16 rotate-3 scale-90'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto group/phone">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-600 rounded-3xl blur-2xl opacity-0 group-hover/phone:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-black rounded-3xl p-4 shadow-2xl transform group-hover/phone:scale-105 group-hover/phone:rotate-2 transition-all duration-500">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-white relative">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6 animate-fade-in">
                          <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                          <Bell className="w-6 h-6 text-blue-600 animate-pulse" />
                        </div>

                        <div className="space-y-4">
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-start space-x-3">
                              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">New post published</h4>
                                <p className="text-xs text-gray-600 mt-1">Your post was sent to 1,234 fans</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-start space-x-3">
                              <Bell className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 animate-pulse" style={{ animationDelay: '0.5s' }} />
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">Email delivered</h4>
                                <p className="text-xs text-gray-600 mt-1">98% open rate on your last post</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-start space-x-3">
                              <MessageCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5 animate-pulse" style={{ animationDelay: '1s' }} />
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">High engagement</h4>
                                <p className="text-xs text-gray-600 mt-1">42 comments in the first hour</p>
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
            
            <div 
              id="reach-fan-text"
              ref={el => itemRefs.current['reach-fan-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['reach-fan-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-7xl font-light mb-8 text-white leading-tight drop-shadow-lg">
                Reach every fan
                <br />
                <span className="font-normal bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">every time</span>
              </h2>
              
              <p className="text-xl text-white leading-relaxed drop-shadow-md">
                When you post on True Fans, your content goes directly to every single one of your supporters' feeds and inboxes. No algorithms deciding who sees your work. No posts getting buried. Just you and your fans, connected.
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
            Start creating
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">on your terms</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-lg">
            Join thousands of creators building sustainable businesses with True Fans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-110 hover:shadow-2xl hover:rotate-1 px-8 py-4 text-lg rounded-full transition-all duration-500 w-full sm:w-auto"
            >
              Get started free
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 hover:scale-110 hover:-rotate-1 px-8 py-4 text-lg rounded-full transition-all duration-500 w-full sm:w-auto"
            >
              See how it works
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreateOnYourTerms;
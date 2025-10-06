import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Users, Mail, Bell, TrendingUp, ArrowRight } from 'lucide-react';

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
      
      {/* Hero Section with Background Image - Patreon Style */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop')`,
          backgroundPosition: `${50 + (mousePosition.x - 50) * 0.02}% ${50 + (mousePosition.y - 50) * 0.02}%`,
          transition: 'background-position 0.3s ease-out'
        }}
      >
        {/* Clean dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-1000"></div>
        
        {/* Content */}
        <div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.9] mb-6 text-white drop-shadow-2xl">
              Where real
              <br />
              <span className="font-light">community thrives</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl text-white/95 leading-relaxed">
              Create meaningful connections with your audience. Share exclusive content, engage in real conversations, and build a community that truly supports your creative journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-full shadow-xl transition-all duration-300 hover:scale-105"
              >
                Build your community
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105"
              >
                Explore features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Every Post, Every Time Section - Gradient Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(to right, #7c7dae 0%, #ce628b 25%, #f5c78c 50%, #0c5c36 75%, #064a2a 100%)'
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
              className={`transition-all duration-1000 ease-out ${animatedItems['every-post-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
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
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['every-post-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-white leading-tight">
                Every post,
                <br />
                <span className="font-light">every time</span>
              </h2>
              
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                Your posts go directly to every single member's feed and inbox. No algorithms. No missed updates. 100% delivery guaranteed.
              </p>
              
              <Button className="bg-white text-[#7c7dae] hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-all duration-300">
                Start posting
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* More Ways to Stay Close Section - White Background */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="stay-close-text"
              ref={el => itemRefs.current['stay-close-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['stay-close-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-gray-900 leading-tight">
                More ways
                <br />
                <span className="font-light">to stay close</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Connect with your community through group chats, direct messages, comments, polls, and more. Build meaningful relationships beyond the content you create.
              </p>
              
              <Button className="bg-gradient-to-r from-[#7c7dae] to-[#ce628b] text-white hover:opacity-90 px-8 py-3 rounded-full font-medium transition-all duration-300">
                Explore features
              </Button>
            </div>

            <div 
              id="stay-close-visual"
              ref={el => itemRefs.current['stay-close-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['stay-close-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
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

      {/* Creators Building Community Section - Patreon Style */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-[#7c7dae]/20 to-[#ce628b]/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-[#f5c78c]/20 to-[#0c5c36]/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div 
            id="creators-community"
            ref={el => itemRefs.current['creators-community'] = el as HTMLDivElement}
            className={`mb-20 transition-all duration-1000 ease-out ${animatedItems['creators-community'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight text-gray-900 mb-6">
              Creators building community
              <br />
              <span className="font-light bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] bg-clip-text text-transparent">on [TrueFans]</span>
            </h2>
          </div>

          {/* Sliding Images Layout */}
          <div className="relative h-[500px] lg:h-[400px]">
            {/* Image 1 - Top Left */}
            <div className="absolute top-0 left-0 lg:left-16 transform rotate-[-2deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-64 h-48 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=face" 
                  alt="The Charismatic - Music Creator" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">The Charismatic</p>
                  <p className="text-sm opacity-90">Music Creator</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                  2.1k fans
                </div>
              </div>
            </div>

            {/* Image 2 - Center */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 rotate-[1deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-72 h-56 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face" 
                  alt="RossDraw - Digital Artist" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">RossDraw</p>
                  <p className="text-sm opacity-90">Digital Artist</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                  5.8k fans
                </div>
              </div>
            </div>

            {/* Image 3 - Right Side */}
            <div className="absolute top-8 right-0 lg:right-12 transform rotate-[-1deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-15 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="w-80 h-60 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop&crop=face" 
                  alt="Rabia and Elijah - Podcast Duo" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">Rabia and Elijah</p>
                  <p className="text-sm opacity-90">Podcast Duo</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                  3.2k fans
                </div>
              </div>
            </div>

            {/* Image 4 - Bottom Left */}
            <div className="absolute bottom-0 left-8 lg:left-24 transform rotate-[2deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-10 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="w-60 h-44 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop&crop=face" 
                  alt="Creative Studio - Art Collective" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">Creative Studio</p>
                  <p className="text-sm opacity-90">Art Collective</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                  1.9k fans
                </div>
              </div>
            </div>

            {/* Image 5 - Bottom Right */}
            <div className="absolute bottom-8 right-16 lg:right-32 transform rotate-[-3deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-10 animate-slide-up" style={{ animationDelay: '1s' }}>
              <div className="w-56 h-40 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face" 
                  alt="Maya Arts - Illustrator" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">Maya Arts</p>
                  <p className="text-sm opacity-90">Illustrator</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                  4.1k fans
                </div>
              </div>
            </div>

            {/* Additional floating elements */}
            <div className="absolute top-1/3 right-1/4 transform rotate-[15deg] opacity-70 hover:opacity-100 transition-all duration-300 animate-slide-up" style={{ animationDelay: '1.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-[#ce628b]/30 to-[#f5c78c]/30 rounded-xl backdrop-blur-sm border border-white/50"></div>
            </div>

            <div className="absolute bottom-1/4 left-1/3 transform rotate-[-8deg] opacity-70 hover:opacity-100 transition-all duration-300 animate-slide-up" style={{ animationDelay: '1.4s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-[#7c7dae]/30 to-[#0c5c36]/30 rounded-lg backdrop-blur-sm border border-white/50"></div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <Button className="bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] text-white hover:opacity-90 hover:scale-105 px-12 py-4 text-xl rounded-full font-medium transition-all duration-300 shadow-2xl">
              Start building your community
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OnlineCommunity;
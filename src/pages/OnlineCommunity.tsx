import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Users, Mail, Bell, TrendingUp } from 'lucide-react';

const OnlineCommunity = () => {
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
          backgroundImage: `url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop')`,
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
            Where real
            <br />
            <span className="font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">community thrives</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-2xl text-white/90 drop-shadow-lg">
            Create a vibrant, engaged community that connects with your work on a deeper level.
          </p>
          
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100 hover:scale-105 px-8 py-4 text-lg font-medium rounded-full shadow-2xl transform transition-all duration-300"
          >
            Build your community
          </Button>
        </div>
      </section>

      {/* Every Post, Every Time Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #93bbfe 0%, #6398fe 50%, #5c93fe 100%)' }}>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-96 h-96 opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(147,187,254,0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(92,147,254,0.4) 0%, transparent 70%)' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="every-post-visual"
              ref={el => itemRefs.current['every-post-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['every-post-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Desktop Browser Mockup */}
              <div className="relative max-w-2xl mx-auto">
                <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-500">
                  {/* Browser chrome */}
                  <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-xs text-gray-400">
                      truefans.com/creator/posts
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="bg-white p-6">
                    {/* Post Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full"></div>
                        <div>
                          <h4 className="font-bold text-gray-900">Chris Overland</h4>
                          <p className="text-sm text-gray-600">Just now • All members</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-800 mb-4">
                        Hey everyone! Just finished working on something special for you all. Can't wait to share it! 🎨✨
                      </p>
                      
                      <div className="aspect-video bg-gradient-to-br from-red-400 via-pink-400 to-purple-400 rounded-lg mb-4"></div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>234</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>42</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notification Badge */}
                    <div className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-semibold flex items-center justify-center space-x-2">
                      <Bell className="w-4 h-4" />
                      <span>Delivered to all 1,234 members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="every-post-text"
              ref={el => itemRefs.current['every-post-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['every-post-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white leading-tight">
                Every post,
                <br />
                <span className="text-blue-100">every time</span>
              </h2>
              
              <p className="text-lg text-blue-50 leading-relaxed">
                Your posts go directly to every single member's feed and inbox. No algorithms. No missed updates. 100% delivery guaranteed, so your community never misses what you share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More Ways to Stay Close Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #6398fe 0%, #5c93fe 50%, #5089ee 100%)' }}>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(99,152,254,0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(92,147,254,0.4) 0%, transparent 70%)' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="stay-close-text"
              ref={el => itemRefs.current['stay-close-text'] = el as HTMLDivElement}
              className={`lg:order-1 transition-all duration-1000 ease-out ${animatedItems['stay-close-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-inter font-light mb-8 text-white leading-tight">
                More ways
                <br />
                <span className="text-blue-100">to stay close</span>
              </h2>
              
              <p className="text-lg text-blue-50 font-inter leading-relaxed">
                Connect with your community through group chats, direct messages, comments, polls, and more. Build meaningful relationships beyond the content you create.
              </p>
            </div>

            <div 
              id="stay-close-visual"
              ref={el => itemRefs.current['stay-close-visual'] = el as HTMLDivElement}
              className={`lg:order-2 transition-all duration-1000 ease-out delay-200 ${animatedItems['stay-close-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto">
                <div className="bg-black rounded-3xl p-4 shadow-2xl hover:scale-105 hover:rotate-2 transition-all duration-500">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-white relative">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Messages</h3>
                        
                        <div className="space-y-4">
                          {/* Message 1 */}
                          <div className="flex items-start space-x-3 bg-pink-50 rounded-xl p-3 hover:bg-pink-100 transition-colors cursor-pointer">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">Sarah Chen</h4>
                                <span className="text-xs text-gray-500">2m</span>
                              </div>
                              <p className="text-sm text-gray-700">Love the new tutorial! When's the next one? 🎨</p>
                            </div>
                            <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-2"></div>
                          </div>

                          {/* Message 2 */}
                          <div className="flex items-start space-x-3 bg-purple-50 rounded-xl p-3 hover:bg-purple-100 transition-colors cursor-pointer">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">Alex Rivera</h4>
                                <span className="text-xs text-gray-500">15m</span>
                              </div>
                              <p className="text-sm text-gray-700">Thanks for the feedback! ❤️</p>
                            </div>
                          </div>

                          {/* Message 3 */}
                          <div className="flex items-start space-x-3 bg-blue-50 rounded-xl p-3 hover:bg-blue-100 transition-colors cursor-pointer">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">Community Chat</h4>
                                <span className="text-xs text-gray-500">1h</span>
                              </div>
                              <p className="text-sm text-gray-700">Jamie: Can't wait for the live stream! 🔥</p>
                            </div>
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 mt-1 flex items-center justify-center text-white text-xs font-bold">3</div>
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

      {/* Get to Know Your Fans Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #7ba8ff 0%, #6398fe 50%, #5c93fe 100%)' }}>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(123,168,255,0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(92,147,254,0.4) 0%, transparent 70%)' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="know-fans-visual"
              ref={el => itemRefs.current['know-fans-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['know-fans-visual'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-16 rotate-3'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto">
                <div className="bg-black rounded-3xl p-4 shadow-2xl hover:scale-105 hover:rotate-2 transition-all duration-500">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                      {/* Chat Interface */}
                      <div className="p-6 text-white h-full flex flex-col">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full"></div>
                          <div>
                            <h3 className="font-bold text-lg">Jamie Lee</h3>
                            <p className="text-sm text-white/70">Member since 2023</p>
                          </div>
                        </div>

                        <div className="space-y-3 flex-1 overflow-hidden">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-xs text-white/70 mb-1">Recent activity</p>
                            <p className="text-sm">Commented on 12 posts</p>
                            <p className="text-sm">Attended 3 live streams</p>
                            <p className="text-sm">Member for 8 months</p>
                          </div>

                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-xs text-white/70 mb-1">Latest comment</p>
                            <p className="text-sm">"This is exactly what I needed! Thank you! 💙"</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <button className="w-full bg-white text-blue-600 rounded-full px-6 py-3 font-semibold hover:bg-white/90 transition-colors">
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
              className={`transition-all duration-1000 ease-out delay-200 ${animatedItems['know-fans-text'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-16 -rotate-3'}`}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-8 text-white leading-tight">
                Get to know
                <br />
                <span className="text-blue-100">your fans</span>
              </h2>
              
              <p className="text-lg text-blue-50 leading-relaxed">
                Explore detailed fan profiles to understand who supports you. See their activity, engagement history, and build deeper connections with the people who matter most to your creative journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #93bbfe 0%, #6398fe 50%, #5c93fe 100%)' }}>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-96 h-96 opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(147,187,254,0.5) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(92,147,254,0.5) 0%, transparent 70%)' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-15 rounded-full blur-3xl group-hover:scale-105 transition-transform duration-1000" style={{ background: 'radial-gradient(circle, rgba(99,152,254,0.6) 0%, transparent 70%)' }}></div>
        
        <div 
          id="final-cta"
          ref={el => itemRefs.current['final-cta'] = el as HTMLDivElement}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-1000 ease-out ${animatedItems['final-cta'] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-inter font-light mb-8 text-white drop-shadow-2xl leading-tight">
            Build a community that
            <br />
            <span className="font-normal">truly connects</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-white/90 font-inter mb-12 max-w-2xl mx-auto">
            Start building meaningful relationships with your most dedicated fans today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-110 hover:shadow-2xl px-8 py-4 text-lg font-inter rounded-full transition-all duration-300 w-full sm:w-auto"
            >
              Start building
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 hover:scale-110 px-8 py-4 text-lg font-inter rounded-full transition-all duration-300 w-full sm:w-auto"
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

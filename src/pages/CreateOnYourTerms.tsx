import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, Users, Bell, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

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
      
      {/* Hero Section with Background Image - Patreon Style */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop')`,
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
              Create
              <br />
              <span className="font-light">on your terms</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl text-white/95 leading-relaxed">
              [TrueFans] is the best place to build a family with your fans, share exclusive work, and earn money from showcasing your talent to the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-full shadow-xl transition-all duration-300 hover:scale-105"
              >
                Get started for free
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section - Gradient Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(to right, #7c7dae 0%, #ce628b 25%, #f5c78c 50%, #0c5c36 75%, #064a2a 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="getting-started-visual"
              ref={el => itemRefs.current['getting-started-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['getting-started-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto">
                <div className="bg-black rounded-3xl p-4 shadow-2xl">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-white relative">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Getting started on [TrueFans]</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-[#7c7dae] rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Set up in under 2 minutes</h4>
                              <p className="text-sm text-gray-600">Link your social media accounts</p>
                            </div>
                          </div>

                         
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-[#f5c78c] rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Publish your first post</h4>
                              <p className="text-sm text-gray-600">Start building your community</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <Button className="w-full bg-gradient-to-r from-[#7c7dae] to-[#ce628b] text-white rounded-full py-3">
                            Start creating
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
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['getting-started-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-white leading-tight">
                Getting started
                <br />
                <span className="font-light">on [TrueFans]</span>
              </h2>
              
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                It's free to get started. Attract fans with compelling content. Earn money from memberships, and build lasting relationships with your audience.
              </p>
              
              <Button className="bg-white text-[#7c7dae] hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-all duration-300">
                Start my page
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Make It Your Own Section - White Background */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="make-own-text"
              ref={el => itemRefs.current['make-own-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['make-own-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-gray-900 leading-tight">
                Make it
                <br />
                <span className="font-light">your own</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Customize your page to reflect your unique brand. Choose your colors, and content strategy. Your page, your personality, your way.
              </p>
              
              <Button className="bg-gradient-to-r from-[#7c7dae] to-[#ce628b] text-white hover:opacity-90 px-8 py-3 rounded-full font-medium transition-all duration-300">
                Customize your page
              </Button>
            </div>

            <div 
              id="make-own-visual"
              ref={el => itemRefs.current['make-own-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['make-own-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto">
                <div className="bg-black rounded-3xl p-4 shadow-2xl">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-gradient-to-br from-[#7c7dae] to-[#ce628b] relative">
                      <div className="p-6 text-white">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full"></div>
                          <div>
                            <h3 className="font-bold text-lg">KAMAUU</h3>
                            <p className="text-sm text-white/80">@kamauu</p>
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                          <p className="text-sm mb-2">Customize everything:</p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span>Profile colors & theme</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span>Membership tier names</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span>Welcome messages</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-white text-[#7c7dae] rounded-full px-4 py-2 text-center font-semibold text-sm">
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

      {/* Reach Every Fan Section - Image Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-1000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="reach-fan-visual"
              ref={el => itemRefs.current['reach-fan-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['reach-fan-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              {/* Mobile Phone Mockup */}
              <div className="relative max-w-sm mx-auto">
                <div className="bg-black rounded-3xl p-4 shadow-2xl">
                  <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="bg-black h-8 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    <div className="aspect-[9/16] bg-white relative">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                          <Bell className="w-6 h-6 text-[#f5c78c]" />
                        </div>

                        <div className="space-y-4">
                          <div className="bg-orange-50 border-l-4 border-[#f5c78c] p-4 rounded">
                            <div className="flex items-start space-x-3">
                              <Users className="w-5 h-5 text-[#f5c78c] flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">New post published</h4>
                                <p className="text-xs text-gray-600 mt-1">Your post was sent to 1,234 fans</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-50 border-l-4 border-[#0c5c36] p-4 rounded">
                            <div className="flex items-start space-x-3">
                              <Bell className="w-5 h-5 text-[#0c5c36] flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">100% delivery rate</h4>
                                <p className="text-xs text-gray-600 mt-1">Every fan sees your content</p>
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
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['reach-fan-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-white leading-tight">
                Reach every fan
                <br />
                <span className="font-light">every time</span>
              </h2>
              
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                When you post on [TrueFans], your content goes directly to every single one of your supporters' feeds and inboxes. No algorithms deciding who sees your work.
              </p>
              
              <Button className="bg-white text-[#0c5c36] hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-all duration-300">
                Start reaching fans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Other Creators Section - Dynamic Carousel Layout */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#7c7dae] rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-40 h-40 bg-[#ce628b] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#f5c78c] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="other-creators"
            ref={el => itemRefs.current['other-creators'] = el as HTMLDivElement}
            className={`text-center mb-20 transition-all duration-1000 ease-out ${animatedItems['other-creators'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl lg:text-6xl font-light mb-6 text-gray-900 leading-tight">
              Other creators
              <br />
              <span className="font-light bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] bg-clip-text text-transparent">on [TrueFans]</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of creators who are building sustainable businesses and meaningful communities.
            </p>
          </div>

          {/* Dynamic Creator Cards Layout */}
          <div className="relative h-[600px] lg:h-[500px]">
            {/* Creator Card 1 - Top Left */}
            <div className="absolute top-0 left-0 lg:left-8 transform rotate-[-3deg] hover:rotate-0 transition-all duration-500 hover:scale-110 hover:z-20 z-10">
              <div className="w-80 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#7c7dae] to-[#ce628b] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    SC
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Sarah Chen</h3>
                    <p className="text-gray-600">Digital Artist</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "[TrueFans] helped me turn my art into a sustainable income. My community loves the exclusive content!"
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#7c7dae]">1,234</p>
                    <p className="text-sm text-gray-500">fans</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0c5c36]">₦960,000</p>
                    <p className="text-sm text-gray-500">per month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Card 2 - Center Right */}
            <div className="absolute top-16 right-0 lg:right-12 transform rotate-[2deg] hover:rotate-0 transition-all duration-500 hover:scale-110 hover:z-20 z-10">
              <div className="w-80 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ce628b] to-[#f5c78c] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    MR
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Marcus Rodriguez</h3>
                    <p className="text-gray-600">Podcast Host</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "The direct connection with my audience is incredible. No algorithms, just real engagement."
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#ce628b]">856</p>
                    <p className="text-sm text-gray-500">fans</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0c5c36]">₦720,000</p>
                    <p className="text-sm text-gray-500">per month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Card 3 - Bottom Center */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rotate-[-1deg] hover:rotate-0 transition-all duration-500 hover:scale-110 hover:z-20 z-10">
              <div className="w-80 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#f5c78c] to-[#0c5c36] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    ET
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Emma Thompson</h3>
                    <p className="text-gray-600">Writer & Coach</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "I've built a thriving community around my writing. The support from my fans is amazing!"
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#f5c78c]">2,100</p>
                    <p className="text-sm text-gray-500">fans</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0c5c36]">₦1,280,000</p>
                    <p className="text-sm text-gray-500">per month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional smaller cards for visual impact */}
            <div className="absolute top-32 left-1/3 transform rotate-[8deg] opacity-60 hover:opacity-100 transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-[#7c7dae]/20 to-[#ce628b]/20 rounded-2xl backdrop-blur-sm border border-white/50 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7c7dae] to-[#ce628b] rounded-xl"></div>
              </div>
            </div>

            <div className="absolute bottom-32 right-1/4 transform rotate-[-5deg] opacity-60 hover:opacity-100 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-[#f5c78c]/20 to-[#0c5c36]/20 rounded-2xl backdrop-blur-sm border border-white/50 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f5c78c] to-[#0c5c36] rounded-xl"></div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button className="bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] text-white hover:opacity-90 hover:scale-105 px-10 py-4 text-lg rounded-full font-medium transition-all duration-300 shadow-xl">
              Join these creators
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreateOnYourTerms;
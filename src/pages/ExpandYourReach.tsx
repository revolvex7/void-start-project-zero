import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, TrendingUp, Users, Share2, BarChart3, Heart, ArrowRight } from 'lucide-react';

const ExpandYourReach = () => {
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
      
      {/* Hero Section - Grow your community */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop')`,
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
              Grow your
              <br />
              <span className="font-light">community</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl text-white/95 leading-relaxed">
              Reach new audiences, engage existing fans, and build a thriving community that supports your creative journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-full shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start growing
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                See how it works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Meet your fans where they are Section - White Background */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="meet-fans-header"
            ref={el => itemRefs.current['meet-fans-header'] = el as HTMLDivElement}
            className={`text-center mb-20 transition-all duration-1000 ease-out ${animatedItems['meet-fans-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl lg:text-6xl font-light mb-6 text-gray-900 leading-tight">
              Meet your fans
              <br />
              <span className="font-light bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] bg-clip-text text-transparent">where they are</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with your audience across all platforms and bring them together in one unified community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media Integration</h3>
              <p className="text-gray-600">Connect your Instagram, Twitter, TikTok, and YouTube to automatically share updates with your existing followers.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cross-Platform Discovery</h3>
              <p className="text-gray-600">Get discovered by fans of similar creators through our intelligent recommendation system.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Viral Growth Tools</h3>
              <p className="text-gray-600">Built-in sharing incentives and referral programs that turn your fans into your marketing team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Run easy promos Section - Turquoise Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(to right, #7c7dae 0%, #ce628b 25%, #f5c78c 50%, #0c5c36 75%, #064a2a 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="run-promos-text"
              ref={el => itemRefs.current['run-promos-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['run-promos-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-black leading-tight">
                Run easy
                <br />
                <span className="font-light">promos</span>
              </h2>
              
              <p className="text-lg text-black/80 leading-relaxed mb-6">
                Set up automated promotions and discounts to reward your most loyal fans and attract new supporters with special offers.
              </p>
              
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full font-medium transition-all duration-300">
                Create promotion
              </Button>
            </div>

            <div 
              id="run-promos-visual"
              ref={el => itemRefs.current['run-promos-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['run-promos-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
            >
              {/* Promo Interface Mockup */}
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">Autopilot</h3>
                  <p className="text-sm text-gray-600 mb-4">Put your membership growth on Autopilot. [TrueFans] will send targeted offers to selected fans to help grow your paid membership.</p>
                  
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Free member upgrade offer</span>
                      <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Automatically send select free members a one-time offer to upgrade to paid membership.</p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">124</p>
                    <p className="text-xs text-gray-500">new paid members from Autopilot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share the love Section - White Background */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="share-love-text"
              ref={el => itemRefs.current['share-love-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['share-love-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-gray-900 leading-tight">
                Share
                <br />
                <span className="font-light">the love</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Turn your existing fans into your biggest advocates. Give them tools to share your work and bring their friends into your community.
              </p>
              
              <Button className="bg-gradient-to-r from-[#7c7dae] to-[#ce628b] text-white hover:opacity-90 px-8 py-3 rounded-full font-medium transition-all duration-300">
                Enable sharing
              </Button>
            </div>

            <div 
              id="share-love-visual"
              ref={el => itemRefs.current['share-love-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['share-love-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
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
                        <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-4 mb-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#ce628b] to-[#f5c78c] rounded-full"></div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Sarah's Art Studio</h4>
                              <p className="text-sm text-gray-600">Just shared a post</p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 text-sm mb-3">
                            "Check out my latest digital painting! 🎨"
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <button className="flex items-center space-x-1 text-[#ce628b] hover:text-[#f5c78c] transition-colors">
                              <Heart className="w-4 h-4" />
                              <span>24</span>
                            </button>
                            <button className="flex items-center space-x-1 text-[#7c7dae] hover:text-[#ce628b] transition-colors">
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-2">Shared 47 times today</p>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            +12 new fans this week
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

      {/* Unlock growth Section - Image Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="unlock-growth-visual"
              ref={el => itemRefs.current['unlock-growth-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['unlock-growth-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              {/* Analytics Dashboard Mockup */}
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-[#0c5c36]" />
                  Growth Insights
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#7c7dae]/10 to-[#ce628b]/10 rounded-lg p-4">
                    <p className="text-2xl font-bold text-[#7c7dae]">2,847</p>
                    <p className="text-sm text-gray-600">Total fans</p>
                    <p className="text-xs text-green-600">+23% this month</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#f5c78c]/10 to-[#0c5c36]/10 rounded-lg p-4">
                    <p className="text-2xl font-bold text-[#0c5c36]">₦1,690,000</p>
                    <p className="text-sm text-gray-600">Monthly revenue</p>
                    <p className="text-xs text-green-600">+18% this month</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fan growth rate</span>
                    <span className="text-sm font-semibold text-[#0c5c36]">+15.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] h-2 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              id="unlock-growth-text"
              ref={el => itemRefs.current['unlock-growth-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['unlock-growth-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-white leading-tight">
                Unlock
                <br />
                <span className="font-light">growth</span>
              </h2>
              
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                Get detailed analytics and insights to understand your audience, track your growth, and optimize your content strategy for maximum impact.
              </p>
              
              <Button className="bg-white text-[#0c5c36] hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-all duration-300">
                View analytics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Unlock growth Section - Green Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(to right, #7c7dae 0%, #ce628b 25%, #f5c78c 50%, #0c5c36 75%, #064a2a 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="unlock-growth-text"
              ref={el => itemRefs.current['unlock-growth-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['unlock-growth-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-black leading-tight">
                Unlock
                <br />
                <span className="font-light">growth</span>
              </h2>
              
              <p className="text-lg text-black/80 leading-relaxed mb-6">
                In-depth insights & analytics give you a unified view of what's resonating with your most engaged fans so you can get a better sense where to focus for maximum impact.
              </p>
              
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full font-medium transition-all duration-300">
                View insights
              </Button>
            </div>

            <div 
              id="unlock-growth-visual"
              ref={el => itemRefs.current['unlock-growth-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['unlock-growth-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
            >
              {/* Analytics Dashboard Mockup */}
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-[#0c5c36]" />
                  Insights
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">5,593</p>
                    <p className="text-sm text-gray-600">Total visitors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">2,703</p>
                    <p className="text-sm text-gray-600">Public visitors</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">August 1, 2023 - August 30, 2023</p>
                  <div className="flex items-end space-x-1 h-20">
                    {[40, 60, 30, 80, 50, 90, 35, 70, 45, 85, 55, 75].map((height, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-blue-400 to-green-400 rounded-t" style={{ height: `${height}%` }}></div>
                    ))}\n                  </div>
                </div>

                <div className="flex space-x-4 text-xs">
                  <span className="flex items-center"><div className="w-3 h-3 bg-green-400 rounded mr-1"></div>Direct 4,458</span>
                  <span className="flex items-center"><div className="w-3 h-3 bg-blue-400 rounded mr-1"></div>[TrueFans] 2,890</span>
                  <span className="flex items-center"><div className="w-3 h-3 bg-orange-400 rounded mr-1"></div>Email 503</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Creators Building Community Section - Purple Background */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="creators-community"
            ref={el => itemRefs.current['creators-community'] = el as HTMLDivElement}
            className={`mb-20 transition-all duration-1000 ease-out ${animatedItems['creators-community'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight text-gray-900 mb-6">
              Other creators building
              <br />
              <span className="font-light bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] bg-clip-text text-transparent">community on [TrueFans]</span>
            </h2>
          </div>

          {/* Sliding Images Layout */}
          <div className="relative h-[500px] lg:h-[400px]">
            {/* Creator Image 1 */}
            <div className="absolute top-0 left-0 lg:left-16 transform rotate-[-2deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-64 h-48 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face" 
                  alt="Tina Yu Art - Creator" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">Tina Yu Art</p>
                  <p className="text-sm opacity-90">Digital Artist</p>
                </div>
              </div>
            </div>

            {/* Creator Image 2 */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 rotate-[1deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-72 h-56 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=300&fit=crop&crop=face" 
                  alt="Royals of Malibu - Podcast" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">Royals of Malibu</p>
                  <p className="text-sm opacity-90">Podcast Network</p>
                </div>
              </div>
            </div>

            {/* Creator Image 3 */}
            <div className="absolute top-8 right-0 lg:right-12 transform rotate-[-1deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-15 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="w-80 h-60 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face" 
                  alt="RossDraw - Artist" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">RossDraw</p>
                  <p className="text-sm opacity-90">Digital Artist</p>
                </div>
              </div>
            </div>

            {/* Creator Image 4 */}
            <div className="absolute bottom-0 left-8 lg:left-24 transform rotate-[2deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-10 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="w-60 h-44 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face" 
                  alt="Creative Collective" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">Creative Studio</p>
                  <p className="text-sm opacity-90">Art Collective</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button className="bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] text-white hover:opacity-90 hover:scale-105 px-12 py-4 text-xl rounded-full font-medium transition-all duration-300 shadow-2xl">
              Join these creators
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Simple Gradient */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #f5c78c 0%, #0c5c36 100%)'
        }}
      >
        <div 
          id="final-cta"
          ref={el => itemRefs.current['final-cta'] = el as HTMLDivElement}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-1000 ease-out ${animatedItems['final-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 text-white leading-tight">
            Ready to expand
            <br />
            <span className="font-light">your reach?</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are growing their communities and building sustainable creative businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-white text-[#0c5c36] hover:bg-gray-100 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Start growing today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#0c5c36] px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExpandYourReach;

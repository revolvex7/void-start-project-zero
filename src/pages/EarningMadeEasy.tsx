import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, DollarSign, Users, TrendingUp, Star, ArrowRight, CheckCircle, Heart, MessageCircle, Share2 } from 'lucide-react';

const EarningMadeEasy = () => {
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
      
      {/* Hero Section - Sell directly to your fans */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop')`,
          backgroundPosition: `${50 + (mousePosition.x - 50) * 0.02}% ${50 + (mousePosition.y - 50) * 0.02}%`,
          transition: 'background-position 0.3s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-1000"></div>
        
        <div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.9] mb-6 text-white drop-shadow-2xl">
              Sell directly to
              <br />
              <span className="font-light">your fans</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl text-white/95 leading-relaxed">
              Turn your passion into profit with multiple revenue streams and direct fan support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-full shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start earning
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                See success stories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Showcase Section - Light Green Background */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="showcase-header"
            ref={el => itemRefs.current['showcase-header'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['showcase-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-3xl lg:text-4xl font-light mb-6 text-gray-900">
              Creators earning with <span className="font-semibold bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] bg-clip-text text-transparent">[TrueFans]</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Creator Card 1 */}
            <div 
              id="creator-card-1"
              ref={el => itemRefs.current['creator-card-1'] = el as HTMLDivElement}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 ${animatedItems['creator-card-1'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 relative">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face" 
                  alt="Digital Artist" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">Sarah's Digital Art</h3>
                  <p className="text-sm opacity-90">Digital Artist</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">Creating stunning digital illustrations and tutorials for aspiring artists worldwide.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">₦1,680,000</span>
                  <span className="text-sm text-gray-500">monthly</span>
                </div>
              </div>
            </div>

            {/* Creator Card 2 */}
            <div 
              id="creator-card-2"
              ref={el => itemRefs.current['creator-card-2'] = el as HTMLDivElement}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 ${animatedItems['creator-card-2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-400 relative">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face" 
                  alt="Podcast Host" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">Tech Talk Daily</h3>
                  <p className="text-sm opacity-90">Podcast Host</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">Weekly tech discussions and interviews with industry leaders and innovators.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">₦2,720,000</span>
                  <span className="text-sm text-gray-500">monthly</span>
                </div>
              </div>
            </div>

            {/* Creator Card 3 */}
            <div 
              id="creator-card-3"
              ref={el => itemRefs.current['creator-card-3'] = el as HTMLDivElement}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 ${animatedItems['creator-card-3'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ animationDelay: '0.3s' }}
            >
              <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-400 relative">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face" 
                  alt="Fitness Coach" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">Fitness with Emma</h3>
                  <p className="text-sm opacity-90">Fitness Coach</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">Personalized workout plans and nutrition guidance for a healthier lifestyle.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">₦1,400,000</span>
                  <span className="text-sm text-gray-500">monthly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join 300,000+ creators Section - Ocean Blue Gradient */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #0891B2 0%, #0EA5E9 50%, #3B82F6 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="join-creators-header"
            ref={el => itemRefs.current['join-creators-header'] = el as HTMLDivElement}
            className={`mb-20 transition-all duration-1000 ease-out ${animatedItems['join-creators-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight text-white mb-6">
              Join 300,000+
              <br />
              <span className="font-light">creators on [TrueFans]</span>
            </h2>
          </div>

          {/* Sliding Creator Images */}
          <div className="relative h-[400px] lg:h-[350px] mb-16">
            {/* Creator Image 1 */}
            <div className="absolute top-0 left-0 lg:left-16 transform rotate-[-2deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-64 h-48 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=300&fit=crop&crop=face" 
                  alt="Music Creator" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">Alex Music</p>
                  <p className="text-sm opacity-90">₦840k/month</p>
                </div>
              </div>
            </div>

            {/* Creator Image 2 */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 rotate-[1deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-72 h-56 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop&crop=face" 
                  alt="Video Creator" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">Maya Videos</p>
                  <p className="text-sm opacity-90">₦2.3M/month</p>
                </div>
              </div>
            </div>

            {/* Creator Image 3 */}
            <div className="absolute top-8 right-0 lg:right-12 transform rotate-[-1deg] hover:rotate-0 transition-all duration-700 hover:scale-110 hover:z-30 z-15 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="w-80 h-60 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop&crop=face" 
                  alt="Art Creator" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold text-lg">Creative Studio</p>
                  <p className="text-sm opacity-90">₦1.3M/month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button className="bg-white text-[#0891B2] hover:bg-gray-100 hover:scale-105 px-12 py-4 text-xl rounded-full font-medium transition-all duration-300 shadow-2xl">
              Join these creators
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Revenue Streams Grid Section - Background Image */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="revenue-header"
            ref={el => itemRefs.current['revenue-header'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['revenue-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl lg:text-5xl font-light mb-6 text-white">
              Multiple ways to <span className="font-semibold bg-gradient-to-r from-[#f5c78c] to-[#0c5c36] bg-clip-text text-transparent">earn</span>
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Diversify your income with subscriptions, tips, merchandise, and exclusive content sales.
            </p>
          </div>

          {/* Complex Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Large Featured Card */}
            <div 
              id="revenue-card-featured"
              ref={el => itemRefs.current['revenue-card-featured'] = el as HTMLDivElement}
              className={`md:col-span-2 lg:col-span-2 bg-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/20 transition-all duration-700 hover:scale-105 hover:rotate-1 ${animatedItems['revenue-card-featured'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-3'}`}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Monthly Subscriptions</h3>
                  <p className="text-white/80">Build recurring revenue streams</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-3xl font-bold text-white">₦1,139,000</p>
                  <p className="text-white/70 text-sm">Average monthly</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-3xl font-bold text-white">89%</p>
                  <p className="text-white/70 text-sm">Retention rate</p>
                </div>
              </div>
              <p className="text-white/90">Create multiple subscription tiers with exclusive perks and content for your most dedicated supporters.</p>
            </div>

            {/* Smaller Cards */}
            {[
              { icon: Heart, title: "Tips & Donations", desc: "One-time support", amount: "₦496,000", color: "from-pink-500 to-red-500" },
              { icon: Star, title: "Exclusive Content", desc: "Premium offerings", amount: "₦356,000", color: "from-yellow-500 to-orange-500" }
            ].map((stream, index) => (
              <div 
                key={index}
                id={`revenue-card-${index + 2}`}
                ref={el => itemRefs.current[`revenue-card-${index + 2}`] = el as HTMLDivElement}
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:-rotate-1 ${animatedItems[`revenue-card-${index + 2}`] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 -rotate-2'}`}
                style={{ animationDelay: `${(index + 2) * 0.15}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stream.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <stream.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{stream.title}</h3>
                <p className="text-white/80 mb-4">{stream.desc}</p>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-2xl font-bold text-white">{stream.amount}</p>
                  <p className="text-white/70 text-sm">this month</p>
                </div>
              </div>
            ))}

            {/* Wide Bottom Card */}
            <div 
              id="revenue-card-wide"
              ref={el => itemRefs.current['revenue-card-wide'] = el as HTMLDivElement}
              className={`md:col-span-2 lg:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/20 transition-all duration-700 hover:scale-105 ${animatedItems['revenue-card-wide'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ animationDelay: '0.6s' }}
            >
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Merchandise & Products</h3>
                  <p className="text-white/80">Sell branded items and digital products directly to your audience</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">156</p>
                    <p className="text-white/70 text-sm">Items sold</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">₦1,368,000</p>
                    <p className="text-white/70 text-sm">Revenue</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">+24%</span>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm">Growth this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Turn customers into community Section - Gray Background */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-100 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="community-header"
            ref={el => itemRefs.current['community-header'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['community-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl lg:text-6xl font-light mb-6 text-gray-900 leading-tight">
              Turn customers
              <br />
              <span className="font-light bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] bg-clip-text text-transparent">into community</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Build lasting relationships with your supporters through engagement tools and community features.
            </p>
          </div>

          {/* Complex Masonry-style Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Large Feature Card */}
            <div 
              id="community-card-featured"
              ref={el => itemRefs.current['community-card-featured'] = el as HTMLDivElement}
              className={`md:col-span-2 lg:col-span-2 lg:row-span-2 bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-rotate-1 ${animatedItems['community-card-featured'] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-2'}`}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#7c7dae] to-[#0c5c36] rounded-3xl flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Direct Messaging</h3>
                  <p className="text-gray-600">Build personal connections</p>
                </div>
              </div>
              
              {/* Mock Chat Interface */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">SF</span>
                    </div>
                    <div className="bg-blue-500 text-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                      <p className="text-sm">Thank you so much for the exclusive content! It really helped me with my project 🙏</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-gray-200 text-gray-900 rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                      <p className="text-sm">So glad it was helpful! Let me know if you need anything else 😊</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-[#7c7dae] to-[#0c5c36] rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                  <p className="text-gray-600 text-sm">Messages sent</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                  <p className="text-gray-600 text-sm">Response rate</p>
                </div>
              </div>
            </div>

            {/* Medium Cards */}
            {[
              { icon: Users, title: "Community Posts", desc: "Share updates and behind-the-scenes content", stats: "2.3k posts", color: "from-purple-50 to-pink-50" },
              { icon: Heart, title: "Fan Recognition", desc: "Highlight your most loyal supporters", stats: "156 featured", color: "from-pink-50 to-red-50" }
            ].map((feature, index) => (
              <div 
                key={index}
                id={`community-card-medium-${index + 1}`}
                ref={el => itemRefs.current[`community-card-medium-${index + 1}`] = el as HTMLDivElement}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:rotate-1 ${animatedItems[`community-card-medium-${index + 1}`] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 -rotate-1'}`}
                style={{ animationDelay: `${(index + 2) * 0.15}s` }}
              >
                <div className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 mb-6`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7c7dae] to-[#0c5c36] rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-lg font-bold text-gray-900">{feature.stats}</p>
                  <p className="text-gray-600 text-xs">this month</p>
                </div>
              </div>
            ))}

            {/* Small Cards */}
            {[
              { icon: Share2, title: "Social Sharing", desc: "Easy content sharing", color: "from-blue-500 to-cyan-500" },
              { icon: Star, title: "Exclusive Access", desc: "VIP treatment", color: "from-yellow-500 to-orange-500" },
              { icon: TrendingUp, title: "Growth Analytics", desc: "Track engagement", color: "from-green-500 to-emerald-500" }
            ].map((feature, index) => (
              <div 
                key={index}
                id={`community-card-small-${index + 1}`}
                ref={el => itemRefs.current[`community-card-small-${index + 1}`] = el as HTMLDivElement}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110 hover:-rotate-2 ${animatedItems[`community-card-small-${index + 1}`] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-16 rotate-3'}`}
                style={{ animationDelay: `${(index + 4) * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(to right, #7c7dae 0%, #ce628b 25%, #f5c78c 50%, #0c5c36 75%, #064a2a 100%)'
        }}
      >
        <div 
          id="final-cta"
          ref={el => itemRefs.current['final-cta'] = el as HTMLDivElement}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-1000 ease-out ${animatedItems['final-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 text-white leading-tight">
            Ready to start
            <br />
            <span className="font-light">earning?</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are building sustainable businesses and earning from their passion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-white text-[#0c5c36] hover:bg-gray-100 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Start earning today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#0c5c36] px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              See pricing
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EarningMadeEasy;

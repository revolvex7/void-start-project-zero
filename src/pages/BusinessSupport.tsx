import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, Shield, HeadphonesIcon, CreditCard, Users, MessageCircle, FileText, Lock, ArrowRight, CheckCircle, Star, Clock } from 'lucide-react';

const BusinessSupport = () => {
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
      
      {/* Hero Section - Support for your business */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&h=1080&fit=crop')`,
          backgroundPosition: `${50 + (mousePosition.x - 50) * 0.02}% ${50 + (mousePosition.y - 50) * 0.02}%`,
          transition: 'background-position 0.3s ease-out'
        }}
      >
        {/* Clean dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-1000"></div>
        
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
              Support for
              <br />
              <span className="font-light">your business</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl text-white/95 leading-relaxed">
              Get the help, protection, and tools you need to run a successful creative business on [TrueFans].
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-full shadow-xl transition-all duration-300 hover:scale-105"
              >
                Get support
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Help when you need it Section - Blue Gradient Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 50%, #1D4ED8 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="help-when-text"
              ref={el => itemRefs.current['help-when-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['help-when-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-white leading-tight">
                Help when
                <br />
                <span className="font-light">you need it</span>
              </h2>
              
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                Our dedicated support team is here to help you succeed. Get answers to your questions, resolve issues quickly, and learn best practices from our experts.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white">24/7 support availability</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white">Live chat with experts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white">Comprehensive help center</span>
                </div>
              </div>
              
              <Button className="bg-white text-[#0EA5E9] hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-all duration-300">
                Contact support
              </Button>
            </div>

            <div 
              id="help-when-visual"
              ref={el => itemRefs.current['help-when-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['help-when-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
            >
              {/* Support Chat Interface Mockup */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-auto">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] rounded-full flex items-center justify-center">
                    <HeadphonesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">[TrueFans] Support</h3>
                    <p className="text-sm text-green-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Online now
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-700">Hi! I'm having trouble setting up my payment methods. Can you help?</p>
                    <p className="text-xs text-gray-500 mt-1">2:34 PM</p>
                  </div>
                  
                  <div className="bg-blue-500 text-white rounded-lg p-3 ml-8">
                    <p className="text-sm">Absolutely! I'd be happy to help you set up your payment methods. Let me walk you through the process step by step.</p>
                    <p className="text-xs text-blue-100 mt-1">2:35 PM</p>
                  </div>

                  <div className="bg-blue-500 text-white rounded-lg p-3 ml-8">
                    <p className="text-sm">First, go to your Creator Settings and click on "Payments". I'll send you a quick guide...</p>
                    <p className="text-xs text-blue-100 mt-1">2:35 PM</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies to protect you Section - White Background */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div 
              id="policies-visual"
              ref={el => itemRefs.current['policies-visual'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out ${animatedItems['policies-visual'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
            >
              {/* Policy Interface Mockup */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Creator Protection</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Intellectual Property Protection</p>
                        <p className="text-sm text-gray-600">Your content is protected by our DMCA policy</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Payment Security</p>
                        <p className="text-sm text-gray-600">Secure transactions with fraud protection</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Community Guidelines</p>
                        <p className="text-sm text-gray-600">Clear rules that protect all users</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-3">Recent Policy Updates</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Enhanced Privacy Controls</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">New</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Updated Terms of Service</span>
                      <span className="text-xs text-gray-500">Jan 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              id="policies-text"
              ref={el => itemRefs.current['policies-text'] = el as HTMLDivElement}
              className={`transition-all duration-1000 ease-out delay-300 ${animatedItems['policies-text'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}
            >
              <h2 className="text-4xl lg:text-6xl font-light mb-6 text-gray-900 leading-tight">
                Policies to
                <br />
                <span className="font-light bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] bg-clip-text text-transparent">protect you</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Our comprehensive policies and guidelines are designed to create a safe, fair environment for creators and fans alike. We're committed to protecting your rights and your business.
              </p>

              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Lock className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Data Privacy</p>
                    <p className="text-sm text-gray-600">Your data is encrypted and secure</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Content Protection</p>
                    <p className="text-sm text-gray-600">Anti-piracy measures in place</p>
                  </div>
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] text-white hover:opacity-90 px-8 py-3 rounded-full font-medium transition-all duration-300">
                Read policies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Payments powered by TrueFans Section - Gradient Background */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(to right, #7c7dae 0%, #ce628b 25%, #f5c78c 50%, #0c5c36 75%, #064a2a 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="payments-header"
            ref={el => itemRefs.current['payments-header'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['payments-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl lg:text-6xl font-light mb-6 text-white leading-tight">
              Payments
              <br />
              <span className="font-light">powered by [TrueFans]</span>
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Secure, reliable payment processing with multiple options for creators and supporters worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Payment Feature Cards */}
            <div 
              id="payment-card-1"
              ref={el => itemRefs.current['payment-card-1'] = el as HTMLDivElement}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 ${animatedItems['payment-card-1'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multiple Payment Methods</h3>
              <p className="text-white/80 text-sm">Accept credit cards, PayPal, bank transfers, and digital wallets from supporters worldwide.</p>
            </div>

            <div 
              id="payment-card-2"
              ref={el => itemRefs.current['payment-card-2'] = el as HTMLDivElement}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 ${animatedItems['payment-card-2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fraud Protection</h3>
              <p className="text-white/80 text-sm">Advanced security measures protect both creators and supporters from fraudulent transactions.</p>
            </div>

            <div 
              id="payment-card-3"
              ref={el => itemRefs.current['payment-card-3'] = el as HTMLDivElement}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 ${animatedItems['payment-card-3'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ animationDelay: '0.3s' }}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fast Payouts</h3>
              <p className="text-white/80 text-sm">Get paid quickly with automated payouts and real-time earnings tracking.</p>
            </div>

            <div 
              id="payment-card-4"
              ref={el => itemRefs.current['payment-card-4'] = el as HTMLDivElement}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 ${animatedItems['payment-card-4'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ animationDelay: '0.4s' }}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Tax Documentation</h3>
              <p className="text-white/80 text-sm">Automated tax forms and detailed earnings reports to simplify your business accounting.</p>
            </div>

            <div 
              id="payment-card-5"
              ref={el => itemRefs.current['payment-card-5'] = el as HTMLDivElement}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 ${animatedItems['payment-card-5'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ animationDelay: '0.5s' }}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Global Reach</h3>
              <p className="text-white/80 text-sm">Accept payments from supporters in over 180 countries with local currency support.</p>
            </div>

            <div 
              id="payment-card-6"
              ref={el => itemRefs.current['payment-card-6'] = el as HTMLDivElement}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 ${animatedItems['payment-card-6'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ animationDelay: '0.6s' }}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Low Fees</h3>
              <p className="text-white/80 text-sm">Competitive transaction fees with transparent pricing and no hidden costs.</p>
            </div>
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
            Ready to get the
            <br />
            <span className="font-light">support you need?</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who trust [TrueFans] to support and protect their creative businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-white text-[#0c5c36] hover:bg-gray-100 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Get started today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#0c5c36] px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Contact support
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessSupport;

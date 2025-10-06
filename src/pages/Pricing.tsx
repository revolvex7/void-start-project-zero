import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Info } from 'lucide-react';

const Pricing = () => {
  const [animatedItems, setAnimatedItems] = useState<{[key: string]: boolean}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
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

  // Scroll tracking
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

  const pricingFeatures = [
    "Unlimited posts",
    "Unlimited video uploads",
    "Unlimited audio uploads",
    "Unlimited image uploads",
    "Member-only community",
    "Exclusive livestreams",
    "Special offers for fans",
    "Polls and Q&A",
    "Analytics dashboard",
    "Mobile app access",
    "Custom branding",
    "Priority support"
  ];

  const earningFeatures = [
    {
      number: "01",
      title: "Set up in minutes, not days",
      description: "Create your page and start accepting payments in under 5 minutes. No technical skills required."
    },
    {
      number: "02",
      title: "0% platform fee on first ₦40M",
      description: "Keep more of what you earn. We only take a small fee after your first ₦40,000,000 in earnings."
    },
    {
      number: "03",
      title: "Simple, predictable pricing",
      description: "No hidden fees, no surprises. Just straightforward pricing that grows with your success."
    },
    {
      number: "04",
      title: "Get paid on your schedule",
      description: "Flexible payout options. Get your earnings when you need them, not when we decide."
    },
    {
      number: "05",
      title: "No credit card required",
      description: "Start for free, upgrade when you're ready. Build your community without any upfront costs."
    },
    {
      number: "06",
      title: "Built-in payment processing",
      description: "Accept payments from fans worldwide with our secure, integrated payment system."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center group"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop')`,
          backgroundPosition: `${50 + (mousePosition.x - 50) * 0.02}% ${50 + (mousePosition.y - 50) * 0.02}%`,
          transition: 'background-position 0.3s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-1000"></div>
        
        <div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.9] mb-6 text-white drop-shadow-2xl">
              Starting a [TrueFans]
              <br />
              <span className="font-light">is free</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto text-white/95 leading-relaxed">
              Get the funding you need to do what you love. We only make money when you do.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-full shadow-xl transition-all duration-300 hover:scale-105"
              >
                Get started for free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Powering Community Section - Light Green Background */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="powering-header"
            ref={el => itemRefs.current['powering-header'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['powering-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl lg:text-5xl font-light mb-6 text-gray-900 leading-tight">
              Powering community,
              <br />
              <span className="font-light">media, and discovery</span>
            </h2>
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105">
              Get started
            </Button>
          </div>

          {/* Pricing Card */}
          <div 
            id="pricing-card"
            ref={el => itemRefs.current['pricing-card'] = el as HTMLDivElement}
            className={`max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 transition-all duration-1000 ease-out ${animatedItems['pricing-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">[TrueFans] pricing</h3>
              <p className="text-gray-600">Simple, transparent pricing for creators</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-6xl font-light text-gray-900">10%</span>
              </div>
              <p className="text-center text-gray-600 text-sm">Platform fee on earnings over ₦40M</p>
            </div>

            <div className="space-y-3 mb-8">
              {pricingFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full bg-black text-white hover:bg-gray-800 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105">
              Start now
            </Button>

            <p className="text-center text-gray-500 text-xs mt-4">
              Free to start. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Earning Made Easy Section - White Background */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="earning-header"
            ref={el => itemRefs.current['earning-header'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['earning-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl lg:text-6xl font-light mb-6 text-gray-900 leading-tight">
              Earning
              <br />
              <span className="font-light bg-gradient-to-r from-[#7c7dae] to-[#0c5c36] bg-clip-text text-transparent">made easy</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              [TrueFans] is a membership platform that makes it easy for creators to get paid. We help you build a sustainable creative business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {earningFeatures.map((feature, index) => (
              <div 
                key={index}
                id={`earning-feature-${index + 1}`}
                ref={el => itemRefs.current[`earning-feature-${index + 1}`] = el as HTMLDivElement}
                className={`bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-gray-200 hover:shadow-xl transition-all duration-500 hover:scale-105 ${animatedItems[`earning-feature-${index + 1}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="text-5xl font-light text-gray-300 mb-4">{feature.number}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Light Background */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="faq-header"
            ref={el => itemRefs.current['faq-header'] = el as HTMLDivElement}
            className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedItems['faq-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <h2 className="text-4xl lg:text-5xl font-light mb-6 text-gray-900">
              Frequently asked
              <br />
              <span className="font-light">questions</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How much does [TrueFans] cost?",
                answer: "It's free to get started! We only charge a 10% platform fee on earnings over ₦40,000,000. Your first ₦40M is completely fee-free."
              },
              {
                question: "When do I get paid?",
                answer: "You can request payouts at any time. Funds are typically transferred to your account within 2-5 business days."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers. Your fans can pay using their preferred method."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes! There are no long-term contracts. You can pause or cancel your page at any time with no penalties."
              },
              {
                question: "Do you take a cut of my earnings?",
                answer: "We only charge 10% on earnings over ₦40,000,000. Everything you earn up to ₦40M is yours to keep (minus payment processing fees)."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                id={`faq-${index + 1}`}
                ref={el => itemRefs.current[`faq-${index + 1}`] = el as HTMLDivElement}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 ${animatedItems[`faq-${index + 1}`] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#7c7dae] to-[#0c5c36] rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
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
            Join thousands of creators building sustainable businesses on [TrueFans]. It's free to get started.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-white text-[#0c5c36] hover:bg-gray-100 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Create your page
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

export default Pricing;

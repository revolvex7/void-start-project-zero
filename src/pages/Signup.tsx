import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, fetchUserProfile } = useAuth();
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    creatorName: '',
    pageUrl: '',
    isAdultContent: false
  });

  const featureSlides = [
    {
      title: "Fund your creative work",
      description: "Get paid monthly by fans and build sustainable income as a creator",
      cardContent: {
        price: "₦2,500",
        period: "per month",
        features: [
          "Access to exclusive content",
          "Early access to new posts",
          "Behind-the-scenes content",
          "Direct creator interaction",
          "Monthly live streams"
        ]
      }
    },
    {
      title: "Connect with your community", 
      description: "Build lasting relationships with your most passionate supporters",
      cardContent: {
        price: "₦5,000",
        period: "per month", 
        features: [
          "All previous tier benefits",
          "Priority support response",
          "Exclusive community access",
          "Monthly Q&A sessions",
          "Custom content requests"
        ]
      }
    },
    {
      title: "Earn predictable income",
      description: "Turn your passion into a sustainable business with monthly memberships", 
      cardContent: {
        price: "₦10,000",
        period: "per month",
        features: [
          "All previous tier benefits", 
          "One-on-one video calls",
          "Personal project reviews",
          "Exclusive merchandise",
          "VIP event access"
        ]
      }
    }
  ];

  const handleJoinAsFan = () => {
    console.log('Joining as fan with email:', formData.email || 'No email provided');
    // Redirect to fan dashboard
    navigate('/dashboard');
  };

  const handleNext = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (currentStep === 2) {
        // Register user after step 2 - only store tokens, don't fetch profile yet
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        toast({
          title: "Account created successfully!",
          description: "You can now continue as a creator or join as a fan.",
        });
        setCurrentStep(3);
      } else if (currentStep === 3) {
        // Fetch complete user profile from /user API first
        await fetchUserProfile();
        
        // Then update user with creator name and adult content preference
        await userAPI.update({
          creatorName: formData.creatorName,
          is18Plus: formData.isAdultContent,
        });
        setCurrentStep(4);
      } else if (currentStep === 4) {
        // Update user with page name
        await userAPI.update({
          pageName: formData.pageUrl,
        });
        toast({
          title: "Profile completed!",
          description: "Welcome to your creator dashboard.",
        });
        navigate('/dashboard');
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.email.length > 0;
      case 2:
        return formData.name.length > 0 && formData.password.length >= 8;
      case 3:
        return formData.creatorName.length > 0;
      case 4:
        return formData.pageUrl.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-full">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Start creating on True Fans</h1>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                Join 250,000+ creators building fandoms, earning from memberships, and selling digital products.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 py-2.5 sm:py-3 h-auto rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none text-sm sm:text-base"
              />

              <Button 
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 text-white py-2.5 sm:py-3 h-auto rounded-lg font-medium shadow-sm text-sm sm:text-base"
              >
                {isLoading ? 'Loading...' : 'Continue'}
              </Button>

              <div className="text-center mt-4 sm:mt-6">
                <a href="#" className="text-gray-400 hover:text-white underline text-xs sm:text-sm">
                  Need help signing in?
                </a>
              </div>
            </div>

            <div className="text-center mt-6 sm:mt-8 text-xs text-gray-500 leading-relaxed px-2">
              By signing up, you are creating a True Fans account and agree to{' '}
              <a href="#" className="underline hover:text-gray-400">True Fans' Terms</a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Complete your account</h1>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                Signing up as {formData.email}
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-white text-xs sm:text-sm mb-2">What should we call you?</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Name"
                  className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 py-2.5 sm:py-3 h-auto rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-white text-xs sm:text-sm mb-2">Create a password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Password"
                    className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 py-2.5 sm:py-3 h-auto rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none pr-10 sm:pr-12 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">Passwords need to have at least 8 characters.</p>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 text-white py-2.5 sm:py-3 h-auto rounded-lg font-medium shadow-sm text-sm sm:text-base"
              >
                {isLoading ? 'Creating account...' : 'Continue'}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="w-full">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Let's name your page</h1>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                You can get creative or start with your name. Don't worry, you can always change this later.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="adult-content"
                  checked={formData.isAdultContent}
                  onCheckedChange={(checked) => handleInputChange('isAdultContent', checked)}
                  className="border-gray-400 mt-1"
                />
                <label htmlFor="adult-content" className="text-white text-xs sm:text-sm leading-relaxed">
                  My page isn't suitable for people under 18
                </label>
              </div>

              <Input
                type="text"
                value={formData.creatorName}
                onChange={(e) => handleInputChange('creatorName', e.target.value)}
                placeholder="Your creator name"
                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 py-2.5 sm:py-3 h-auto rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none text-sm sm:text-base"
              />

              <Button 
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 text-white py-2.5 sm:py-3 h-auto rounded-lg font-medium shadow-sm text-sm sm:text-base"
              >
                {isLoading ? 'Updating...' : 'Continue'}
              </Button>
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <Button 
                variant="outline" 
                onClick={handleJoinAsFan}
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm"
              >
                Not a creator? Join as a fan
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="w-full">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Choose your URL</h1>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                You can always change this later.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg">
                  <span className="text-gray-400 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm">truefans.com/</span>
                  <Input
                    type="text"
                    value={formData.pageUrl}
                    onChange={(e) => handleInputChange('pageUrl', e.target.value)}
                    placeholder="YourPageName"
                    className="flex-1 bg-transparent border-0 text-white placeholder-gray-400 py-2.5 sm:py-3 focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none text-sm sm:text-base"
                  />
                  {formData.pageUrl && (
                    <div className="px-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="w-full bg-white text-black hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 py-2.5 sm:py-3 h-auto rounded-lg font-medium shadow-sm text-sm sm:text-base"
              >
                {isLoading ? 'Finishing...' : 'Continue'}
              </Button>
            </div>

            <div className="text-center mt-4 sm:mt-6">
              <button 
                onClick={handleBack}
                className="text-gray-400 hover:text-white underline text-xs sm:text-sm"
              >
                Back
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="w-full lg:w-7/10 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 lg:py-12 relative">
        {/* Back Button */}
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 p-2 text-gray-400 hover:text-white transition-colors z-10"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          {renderStep()}
        </div>
      </div>

      {/* Right Side - Features Carousel - Hidden on mobile */}
      <div className="hidden lg:flex w-full lg:w-3/10 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 items-center justify-center relative overflow-hidden">
        <div className="embla w-full h-full" ref={emblaRef}>
          <div className="embla__container h-full flex">
            {featureSlides.map((slide, index) => (
              <div className="embla__slide flex-shrink-0 w-full h-full flex flex-col items-center justify-center text-center p-8" key={index}>
                <div className="relative mb-6">
                  <div className="absolute top-2 left-2 w-64 h-72 bg-white/10 rounded-2xl transform rotate-3"></div>
                  <div className="relative w-64 h-72 bg-white rounded-2xl p-4 shadow-2xl flex flex-col">
                    <div className="w-full h-24 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-xl mb-3 flex items-center justify-center flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="text-left flex-1 flex flex-col">
                      <div className="flex items-baseline mb-3">
                        <span className="text-2xl font-bold text-black">{slide.cardContent.price}</span>
                        <span className="text-gray-600 ml-1 text-sm">{slide.cardContent.period}</span>
                      </div>
                      
                      <div className="space-y-1.5 mb-4 flex-1">
                        {slide.cardContent.features.slice(0, 4).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-gray-600">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                            <span className="text-xs leading-tight">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium mt-auto">
                        Join now
                      </Button>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">{slide.title}</h3>
                <p className="text-gray-300 text-sm max-w-xs leading-relaxed">{slide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
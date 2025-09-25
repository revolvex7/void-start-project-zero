import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { authAPI, userAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
      title: 'Income you can count on',
      description: 'Earn a recurring monthly or annual income with memberships.',
      cardContent: {
        price: '$5.00',
        period: '/ month',
        features: ['Access to exclusive content', 'Monthly livestreams', 'Community Discord', 'Early access to videos']
      }
    },
    {
      title: 'Sell to anyone',
      description: 'Easily list digital products like videos and downloads for sale.',
      cardContent: {
        price: '$15.00',
        period: '/ product',
        features: ['Digital downloads', 'Video tutorials', 'Premium content', 'Instant access']
      }
    },
    {
      title: 'Reach your closest fans',
      description: 'Communicate directly with your most engaged fans, all gathered in one place.',
      cardContent: {
        price: '$10.00',
        period: '/ month',
        features: ['Direct messaging', 'Fan community', 'Exclusive updates', 'Behind the scenes']
      }
    },
  ];

  const handleNext = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (currentStep === 2) {
        // Register user after step 2
        const response = await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        login(response.user); // Log in the user immediately after registration
        toast({
          title: "Account created successfully!",
          description: "Please complete your profile.",
        });
        setCurrentStep(3);
      } else if (currentStep === 3) {
        // Update user with creator name and adult content preference
        await userAPI.update({
          creatorName: formData.creatorName,
          is18Plus: formData.isAdultContent
        });
        setCurrentStep(4);
      } else if (currentStep === 4) {
        // Update user with page name
        await userAPI.update({
          pageName: formData.pageUrl
        });
        toast({
          title: "Profile completed!",
          description: "Welcome to your creator dashboard.",
        });
        navigate(`/c/${formData.pageUrl}`);
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

  const handleJoinAsFan = () => {
    console.log('Joining as fan with email:', formData.email || 'No email provided');
    // Create a basic user profile for fan
    const fanUser = {
      id: 'fan_' + Date.now(),
      name: formData.name || 'Fan User',
      email: formData.email,
      isCreator: false
    };
    login(fanUser);
    navigate('/dashboard');
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
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Start creating on Patreon</h1>
              <p className="text-gray-300 text-base sm:text-lg">
                Join 250,000+ creators building fandoms, earning from memberships, and selling digital products.
              </p>
            </div>

            <div className="space-y-4">
              {/* Social Login Buttons */}
              <Button 
                variant="outline" 
                className="w-full bg-white text-gray-900 border-gray-300 hover:bg-gray-50 py-3 h-auto flex items-center justify-start px-4 rounded-lg shadow-sm"
              >
                <div className="w-5 h-5 mr-3 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="flex-1 text-left font-medium">Continue as Star Reach</span>
                <div className="w-5 h-5">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full bg-white text-gray-900 border-gray-300 hover:bg-gray-50 py-3 h-auto flex items-center justify-center px-4 rounded-lg shadow-sm"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="font-medium">Continue with Apple</span>
              </Button>

              <Button 
                variant="outline" 
                className="w-full bg-white text-gray-900 border-gray-300 hover:bg-gray-50 py-3 h-auto flex items-center justify-center px-4 rounded-lg shadow-sm"
              >
                <svg className="w-5 h-5 mr-3" fill="#1877f2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-medium">Continue with Facebook</span>
              </Button>

              <div className="text-center text-gray-400 my-6 text-sm">or</div>

              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 py-3 h-auto rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
              />

              <Button 
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 text-white py-3 h-auto rounded-lg font-medium shadow-sm"
              >
                {isLoading ? 'Loading...' : 'Continue'}
              </Button>

              <div className="text-center mt-6">
                <a href="#" className="text-gray-400 hover:text-white underline text-sm">
                  Need help signing in?
                </a>
              </div>
            </div>

            <div className="text-center mt-8 text-xs text-gray-500">
              By signing up, you are creating a Patreon account and agree to{' '}
              <a href="#" className="underline hover:text-gray-400">Patreon's Terms</a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>
            </div>

          </div>
        );

      case 2:
        return (
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Complete your account</h1>
              <p className="text-gray-300 text-lg">
                Signing up as {formData.email}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm mb-2">What should we call you?</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Name"
                  className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 py-3 h-auto rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Create a password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Password"
                    className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 py-3 h-auto rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-2">Passwords need to have at least 8 characters.</p>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 text-white py-3 h-auto rounded-lg font-medium shadow-sm"
              >
                {isLoading ? 'Creating account...' : 'Continue'}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Let's name your page</h1>
              <p className="text-gray-300 text-lg">
                You can get creative or start with your name. Don't worry, you can always change this later.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="adult-content"
                  checked={formData.isAdultContent}
                  onCheckedChange={(checked) => handleInputChange('isAdultContent', checked)}
                  className="border-gray-400"
                />
                <label htmlFor="adult-content" className="text-white text-sm">
                  My page isn't suitable for people under 18
                </label>
              </div>

              <Input
                type="text"
                value={formData.creatorName}
                onChange={(e) => handleInputChange('creatorName', e.target.value)}
                placeholder="Your creator name"
                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 py-3 h-auto rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
              />

              <Button 
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 text-white py-3 h-auto rounded-lg font-medium shadow-sm"
              >
                {isLoading ? 'Updating...' : 'Continue'}
              </Button>
            </div>

            {/* Join as fan button - only show in step 3 */}
            <div className="text-center mt-6">
              <button 
                onClick={handleJoinAsFan}
                className="text-gray-400 hover:text-white underline text-sm"
              >
                Join as a fan instead
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Choose your URL</h1>
              <p className="text-gray-300 text-lg">
                You can always change this later.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg">
                  <span className="text-gray-400 px-4 py-3">patreon.com/</span>
                  <Input
                    type="text"
                    value={formData.pageUrl}
                    onChange={(e) => handleInputChange('pageUrl', e.target.value)}
                    placeholder="YourPageName"
                    className="flex-1 bg-transparent border-0 text-white placeholder-gray-400 py-3 focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
                  />
                  {formData.pageUrl && (
                    <div className="px-3">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="w-full bg-white text-black hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 py-3 h-auto rounded-lg font-medium shadow-sm"
              >
                {isLoading ? 'Finishing...' : 'Continue'}
              </Button>
            </div>

            <div className="text-center mt-6">
              <button 
                onClick={handleBack}
                className="text-gray-400 hover:text-white underline text-sm"
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
      <div className="w-full lg:w-7/10 flex items-center justify-center px-4 sm:px-8 py-6 lg:py-12 relative">
        {/* Back Button */}
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 sm:top-8 sm:left-8 p-2 text-gray-400 hover:text-white transition-colors z-10"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        
        {renderStep()}
      </div>

      {/* Right Side - Features Carousel */}
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
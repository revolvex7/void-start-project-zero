import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&crop=center"
          alt="Creative workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Card Container */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-sm"></div>
            </div>
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            Your world to create
          </h2>
          
          {/* CTA Button */}
          <Button 
            size="lg"
            className="bg-black hover:bg-gray-800 text-white rounded-full px-12 py-4 text-lg font-semibold mb-8 transition-all duration-300 hover:scale-105"
          >
            Get started
          </Button>
          
          {/* Login Link */}
          <div className="mb-8">
            <span className="text-gray-600">Already have an account? </span>
            <a href="#" className="text-black font-medium hover:underline">
              Log in
            </a>
          </div>
          
          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a 
              href="#" 
              className="flex items-center space-x-3 bg-black rounded-xl px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              <img 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                alt="Download on App Store"
                className="h-8"
              />
            </a>
            
            <a 
              href="#" 
              className="flex items-center space-x-3 bg-black rounded-xl px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              <img 
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                alt="Get it on Google Play"
                className="h-12"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
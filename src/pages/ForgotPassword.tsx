import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForgotPassword } from '@/hooks/useApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPasswordMutation.isPending) return;
    
    try {
      await forgotPasswordMutation.mutateAsync(email);
      
      toast({
        title: "OTP sent!",
        description: "Please check your email for the 6-digit OTP code.",
      });
      
      // Navigate to reset password page with email
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-black rounded-full relative">
              <div className="absolute inset-0 bg-white rounded-full" style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%)'
              }}></div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Forgot Password</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-400">
            Enter your email and we'll send you a 6-digit OTP code
          </p>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <Button
            type="submit"
            disabled={forgotPasswordMutation.isPending || !email}
            className="w-full bg-white text-black hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg"
          >
            {forgotPasswordMutation.isPending ? 'Sending...' : 'Send OTP Code'}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-gray-400">
            Remember your password?{' '}
            <Link to="/login" className="text-white underline hover:text-gray-300">
              Sign in
            </Link>
          </p>
          
          <p className="text-xs text-gray-500 leading-relaxed px-2">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-gray-400">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

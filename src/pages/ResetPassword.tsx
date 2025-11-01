import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useResetPassword } from '@/hooks/useApi';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    // Get email from URL query parameters
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPasswordMutation.isPending) return;
    
    // Validate email
    if (!email) {
      toast({
        title: "Email required",
        description: "Please provide your email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate OTP
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "OTP must be 6 digits.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await resetPasswordMutation.mutateAsync({ email, otp, password });
      
      toast({
        title: "Password reset successful!",
        description: "You can now sign in with your new password.",
      });
      
      // Navigate to login page
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Failed to reset password",
        description: error.message || "Please check your OTP and try again.",
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
          <h1 className="text-2xl sm:text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-400">
            Enter the OTP code sent to your email and your new password
          </p>
        </div>

        {/* Reset Password Form */}
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

          <div>
            <Input
              id="otp"
              name="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit OTP code"
              className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg focus:outline-none focus:border-gray-600 tracking-widest text-center text-xl"
            />
          </div>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 py-2.5 sm:py-3 px-3 sm:px-4 pr-10 sm:pr-12 text-sm sm:text-base rounded-lg focus:outline-none focus:border-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 py-2.5 sm:py-3 px-3 sm:px-4 pr-10 sm:pr-12 text-sm sm:text-base rounded-lg focus:outline-none focus:border-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={resetPasswordMutation.isPending || !email || !otp || !password || !confirmPassword}
            className="w-full bg-white text-black hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg"
          >
            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;

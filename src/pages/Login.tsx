import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowPasswordField(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Login and store tokens
      await login({ email, password });
      
      // Fetch complete user profile from /user API
      await fetchUserProfile();
      
      toast({
        title: "Login successful!",
        description: "Welcome back!",
      });
      
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-400">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={showPasswordField ? handleLogin : handleEmailSubmit} className="space-y-4 sm:space-y-6">
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
              disabled={showPasswordField}
            />
          </div>

          {showPasswordField && (
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
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
          )}

          <Button
            type="submit"
            disabled={isLoading || !email || (showPasswordField && !password)}
            className="w-full bg-white text-black hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg"
          >
            {isLoading ? 'Signing in...' : showPasswordField ? 'Sign in' : 'Continue'}
          </Button>
        </form>

        {/* Social Login Options */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-black text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-800 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285f4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fbbc05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ea4335"/>
            </svg>
            Continue with Google
          </Button>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white underline hover:text-gray-300">
              Sign up
            </Link>
          </p>
          
          <p className="text-xs text-gray-500 leading-relaxed px-2">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-gray-400">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 
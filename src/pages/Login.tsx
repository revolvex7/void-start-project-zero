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
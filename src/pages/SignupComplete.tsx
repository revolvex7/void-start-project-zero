import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';

const SignupComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email ?? 'you@example.com';
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const isValid = fullName.trim().length > 0 && password.length >= 8;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Left 70% */}
      <div className="w-full lg:w-7/10 flex items-center justify-center px-4 sm:px-6 py-6 lg:py-0">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Complete your account</h1>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Signing up as {email}</p>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm text-gray-300 mb-2">What should we call you?</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-10 sm:h-12 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm text-gray-300 mb-2">Create a password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-10 sm:h-12 text-sm sm:text-base"
              />
              <p className="text-xs text-gray-400 mt-2">Passwords need to have at least 8 characters.</p>
            </div>

            <Button
              disabled={!isValid}
              onClick={() => navigate('/signup/name', { state: { email, fullName } })}
              className={`w-full h-10 sm:h-12 rounded-lg text-sm sm:text-base ${isValid ? 'bg-gray-200 text-black hover:bg-white' : 'bg-gray-700 text-gray-400'}`}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Right 30% */}
      <div className="hidden lg:flex w-full lg:w-3/10 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 items-center justify-center">
        <div className="max-w-sm text-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl mb-8">
            <div className="h-36 rounded-xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 mb-4"></div>
            <div className="text-left">
              <div className="text-2xl font-bold text-black mb-1">$5.00 <span className="text-sm font-normal">/ month</span></div>
              <ul className="text-gray-700 text-sm space-y-2 mb-4">
                <li>Access to exclusive content</li>
                <li>Monthly livestreams</li>
                <li>Community Discord</li>
                <li>Early access to videos</li>
              </ul>
              <Button className="w-full bg-black text-white rounded-lg py-2">Join now</Button>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Income you can count on</h3>
          <p className="text-gray-300">Earn a recurring monthly or annual income with memberships.</p>
        </div>
      </div>
    </div>
  );
};

export default SignupComplete; 
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation, useNavigate } from 'react-router-dom';

const SignupName = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, fullName } = (location.state as any) || { email: 'you@example.com', fullName: '' };
  const [creatorName, setCreatorName] = useState(fullName || '');
  const [isMature, setIsMature] = useState(false);

  const isValid = creatorName.trim().length > 0;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Left 70% */}
      <div className="w-full lg:w-7/10 flex items-center justify-center px-4 sm:px-6 py-6 lg:py-0">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Let's name your page</h1>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">You can get creative or start with your name. Don't worry, you can always change this later.</p>

          <div className="space-y-4 sm:space-y-6">
            <label className="flex items-center space-x-3 text-gray-300 text-sm sm:text-base">
              <input type="checkbox" className="w-4 h-4" checked={isMature} onChange={(e) => setIsMature(e.target.checked)} />
              <span>My page isn't suitable for people under 18</span>
            </label>

            <Input
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="Your creator name"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-10 sm:h-12 text-sm sm:text-base"
            />

            <Button
              disabled={!isValid}
              onClick={() => navigate('/')}
              className={`w-full h-10 sm:h-12 rounded-lg text-sm sm:text-base ${isValid ? 'bg-gray-200 text-black hover:bg-white' : 'bg-gray-700 text-gray-400'}`}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Right 30% */}
      <div className="hidden lg:flex w-full lg:w-3/10 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 items-center justify-center">
        <div className="max-w-sm">
          <div className="bg-white rounded-2xl p-4 shadow-2xl mb-6">
            <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
            <div className="px-4 pb-4">
              <div className="h-3 bg-gray-200 rounded mb-3"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-2xl ml-10">
            <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
            <div className="px-4 pb-4">
              <div className="h-3 bg-gray-200 rounded mb-3"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupName; 
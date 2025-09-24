import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Camera } from 'lucide-react';

const SignupProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, fullName, creatorName } = (location.state as any) || {};
  
  const [profileData, setProfileData] = useState({
    bio: '',
    coverImage: null as File | null,
    profileImage: null as File | null,
    mediaLayout: 'grid' // 'grid', 'list', 'masonry'
  });

  const handleFileUpload = (type: 'cover' | 'profile', file: File | null) => {
    if (type === 'cover') {
      setProfileData(prev => ({ ...prev, coverImage: file }));
    } else {
      setProfileData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleComplete = () => {
    console.log('Creator profile setup completed:', {
      email,
      fullName,
      creatorName,
      ...profileData
    });
    navigate('/');
  };

  const isValid = profileData.bio.trim().length > 0;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left 70% */}
      <div className="w-7/10 flex items-center justify-center px-6 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-2">Set up your creator profile</h1>
          <p className="text-gray-400 mb-8">Tell your audience who you are and what you create. You can always update this later.</p>

          <div className="space-y-6">
            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Cover image</label>
              <div className="relative h-32 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('cover', e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {profileData.coverImage ? (
                    <div className="text-center">
                      <Camera className="w-6 h-6 text-green-500 mx-auto mb-1" />
                      <p className="text-sm text-green-500">{profileData.coverImage.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">Click to upload cover image</p>
                      <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Profile picture</label>
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 bg-gray-800 border-2 border-dashed border-gray-700 rounded-full hover:border-gray-600 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('profile', e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {profileData.profileImage ? (
                      <Camera className="w-6 h-6 text-green-500" />
                    ) : (
                      <Upload className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-300">
                    {profileData.profileImage ? profileData.profileImage.name : 'Upload your profile picture'}
                  </p>
                  <p className="text-xs text-gray-500">Square image recommended, JPG or PNG</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                About you <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell your audience what you create and why they should support you..."
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-24 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500 characters</p>
            </div>

            {/* Media Layout Preference */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Content layout</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'grid', label: 'Grid', description: 'Organized grid view' },
                  { key: 'list', label: 'List', description: 'Clean list format' },
                  { key: 'masonry', label: 'Masonry', description: 'Pinterest-style layout' }
                ].map((layout) => (
                  <button
                    key={layout.key}
                    onClick={() => setProfileData(prev => ({ ...prev, mediaLayout: layout.key }))}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      profileData.mediaLayout === layout.key
                        ? 'border-white bg-white/5 text-white'
                        : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{layout.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{layout.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              disabled={!isValid}
              onClick={handleComplete}
              className={`w-full h-12 rounded-lg ${isValid ? 'bg-gray-200 text-black hover:bg-white' : 'bg-gray-700 text-gray-400'}`}
            >
              Complete setup
            </Button>

            <div className="text-center mt-8">
              <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-6 py-2 rounded-full">
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right 30% */}
      <div className="hidden md:flex w-3/10 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 items-center justify-center">
        <div className="max-w-sm text-center">
          <div className="bg-white rounded-2xl p-4 shadow-2xl mb-6 transform -rotate-2">
            <div className="h-24 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-xl mb-4"></div>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
              <div>
                <div className="h-2 bg-gray-300 rounded w-16 mb-1"></div>
                <div className="h-1.5 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
            <div className="text-left space-y-2">
              <div className="h-1.5 bg-gray-300 rounded"></div>
              <div className="h-1.5 bg-gray-200 rounded w-4/5"></div>
              <div className="h-1.5 bg-gray-200 rounded w-3/5"></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-white">Make it yours</h3>
          <p className="text-gray-300">Customize your page to reflect your unique style and connect with your audience.</p>
        </div>
      </div>
    </div>
  );
};

export default SignupProfile;